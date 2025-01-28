import express from 'express';
import { GoogleGenerativeAI } from "@google/generative-ai"
import { z } from "zod";
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const port = 8000;

app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:3000', // Allow only this origin
  methods: 'GET,POST', // Allow only these methods
}));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const VideoContentSchema = z.object({
  title: z.string(),
  description: z.string(),
  fullScript: z.string().optional(),
  hashtags: z.array(z.string()),
  engagementScore: z.number().optional(),
  trendingContext: z
    .object({
      suggestedCategories: z.array(z.string()),
      userProvidedCategory: z.string().optional(),
      channelFit: z.string().optional(),
    })
    .optional(),
});

// Global variable to store cached trends
let globalTrendCache = null;

async function fetchTrendingTopics(timeRange) {
  const ONE_DAY = 24 * 60 * 60 * 1000;
  const currentTime = Date.now();

  // If timeRange is 24 and cache exists and is less than a day old, return cached data
  if (
    timeRange === "24" &&
    globalTrendCache &&
    currentTime - globalTrendCache.timestamp < ONE_DAY
  ) {
    return globalTrendCache.trends;
  }
  console.log(
    "Fetching new trends................................................................."
  );
  try {
    const url = `https://serpapi.com/search.json?engine=google_trends_trending_now&hours=${timeRange}&api_key=${process.env.SERPER_API_KEY}`;
    console.log("URL:", url);
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const trends = data.trending_searches.map(
      (trend, index) => ({
        top: index + 1,
        categories:
          trend?.categories?.map((category) => category?.name) || [],
        title: trend.query,
        relatedQueries: trend.trend_breakdown?.slice(0, 5) || [],
      })
    );

    // Update global cache if timeRange is 24 hours
    if (timeRange === "24") {
      globalTrendCache = {
        trends,
        timestamp: currentTime,
      };
    }

    return trends;
  } catch (error) {
    console.error("Google Serper API Error:", {
      status: error?.response?.status,
      data: error?.response?.data,
      message: error?.message,
    });
    throw new Error(
      `Serper API Error: ${error?.response?.data?.message || error?.message}`
    );
  }
}

const generatePrompt = (channelDescription, trends) => {
  return `
  Strictly follow these rules:
  1. Generate EXACTLY 7-minute scripts (500+ words)
  2. Use trends with highest "top" ranking that match channel
  3. Only use trends from top 5 if they align with channel
  4. If top 5 don't fit, use lower-ranked matching trends
  5. Always explain trend-channel alignment

  **Channel Focus:** 
  ${channelDescription}

  **Trending Topics (Ranked):**
  ${trends
    .slice(0, 15)
    .map(
      (t) => `
  - [Rank #${t.top}] ${t.title}
    ↳ Categories: ${t.categories.join(", ")}
    ↳ Related: ${t.relatedQueries.slice(0, 3).join(", ")}`
    )
    .join("\n")}

  **Required Structure Per Idea:**
  {
    "title": "Engaging title using",
    "description": "SEO description (120-150 chars)",
    "fullScript": "7 MINUTE SCRIPT WITH:\n- 0:00 Hook\n- 1:00 Intro\n- 2:30 Main content\n- 5:00 Trend analysis\n- 6:30 CTA\n(MUST BE 500+ WORDS)",
    "hashtags": ["trend1", "trend2", "trend3"],
    "engagementScore": 0 - 100,
  }

  **Rejection Criteria:**
  ❌ Scripts under 500 words
  ❌ Using trends without explicit channel alignment proof
  ❌ Missing timecode structure
  ❌ Hashtags not including trend rank

  Output valid JSON array with 5 ideas:`;
};

async function generateContent(category, channelDescription, timeRange) {
  try {
    let trendsByCategory = [];
    const trends = await fetchTrendingTopics(timeRange);
    if (category === "All categories") {
      trendsByCategory = trends;
    } else {
      trendsByCategory = trends.filter((trend) =>
        trend.categories.some(
          (cat) => cat.toLowerCase() === category.toLowerCase()
        )
      );
    }

    if (trendsByCategory.length === 0) {
      return {
        success: false,
        message: "No trending topics found for the specified category",
      };
    }

    const prompt = generatePrompt(
      channelDescription,
      trendsByCategory.slice(0, 100)
    );

    const result = await model.generateContent(prompt);

    let content = result.response.text();

    if (!content) {
      throw new Error("Empty response from AI model");
    }

    content = content
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .replace(/^\s*\[/, "[")
      .replace(/\]\s*$/, "]")
      .trim();

    try {
      const parsedContent = JSON.parse(content);

      if (!Array.isArray(parsedContent)) {
        throw new Error("Response is not an array");
      }
      const validatedContent = parsedContent.map((content) => {
        const safeContent = {
          title: content.title || "",
          description: content.description || "",
          hashtags: Array.isArray(content.hashtags)
            ? content.hashtags.map((tag) =>
                tag.replace(/^#/, "").trim()
              )
            : [],
          fullScript: content.fullScript || "Script generation is pending...",
          engagementScore: content.engagementScore || 0,
          trendingContext: content.trendingContext
            ? {
                suggestedCategories:
                  content.trendingContext.suggestedCategories || [],
                channelFit: content.trendingContext.channelFit || "",
              }
            : undefined,
        };

        return VideoContentSchema.parse(safeContent);
      });

      return {
        success: true,
        error: null,
        data: validatedContent,
      };
    } catch (error) {
      console.error("JSON Parse Error:", {
        error,
        responseText: content.substring(0, 200),
      });
      return {
        success: false,
        error: "Failed to parse AI response",
        data: null,
      };
    }
  } catch (error) {
    console.error("Content Generation Error:", error);
    return {
      success: false,
      error: error.message || "Internal server error",
      data: null,
    };
  }
}

async function processUserData(data) {
  try {

    const { channelDescription, timeRange, category } = data;

    if (!category) {
      return {
        success: false,
        error: "Category is required",
      };
    }
    const responseText = await generateContent(
      category,
      channelDescription,
      timeRange
    );

    return {
      success: true,
      data: responseText,
      error: null,
    };
  } catch (error) {
    console.error("API Error:", error);
    return {
      success: false,
      error: error.message || "Internal server error",
      data: null,
    };
  }
}

// Define a route to handle the processUserData function
app.post('/process', async (req, res) => {
  try {
    const data = req.body;
    const response = await processUserData(data);
    res.json(response);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});