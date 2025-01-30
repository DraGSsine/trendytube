import express from 'express';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const port = 8000;

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
  origin: ['http://localhost:3000', 'https://trendytube.vercel.app', 'https://trendytube.pro'],
  methods: 'GET,POST',
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

let globalTrendCache = null;

async function fetchTrendingTopics(timeRange) {
  const ONE_DAY = 24 * 60 * 60 * 1000;
  const currentTime = Date.now();

  if (
    timeRange === "24" &&
    globalTrendCache &&
    currentTime - globalTrendCache.timestamp < ONE_DAY
  ) {
    return globalTrendCache.trends;
  }

  console.log("Fetching new trends...");
  
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
    const trends = data.trending_searches.map((trend, index) => ({
      top: index + 1,
      categories: trend?.categories?.map((category) => category?.name) || [],
      title: trend.query,
      relatedQueries: trend.trend_breakdown?.slice(0, 5) || [],
    }));

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

async function cleanJsonResponse(text) {
  text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
  text = text.trim();
  
  if (!text.startsWith('[')) {
    text = '[' + text;
  }
  if (!text.endsWith(']')) {
    text = text + ']';
  }
  
  try {
    return JSON.parse(text);
  } catch (error) {
    console.error("Failed to parse JSON after cleaning:", text);
    throw new Error("Could not parse AI response as JSON");
  }
}

async function generateInitialScripts(channelDescription, trends) {
  const prompt = `
You are a video content expert with access to real-time knowledge of current events and breaking news. Create scripts that combine trending topics and latest news that align with: "${channelDescription}".

First, analyze these trending topics:
${trends.map(t => `
- ${t.title} (Rank #${t.top})
  Categories: ${t.categories.join(', ')}
  Related: ${t.relatedQueries.join(', ')}
`).join('\n')}

Then, check if there are any MAJOR BREAKING NEWS stories from the last 24 hours related to these topics or the channel's focus. If there are significant breaking news stories, prioritize them and include detailed, accurate information about the events.

IMPORTANT: Respond ONLY with a JSON array. No other text. Each object must have this EXACT format:
[
  {
    "trendTitle": "trend or news title",
    "isBreakingNews": boolean,
    "lastUpdated": "approximate time of last known update for breaking news",
    "script": "DETAILED 500+ word script with sections: 
      Breaking News Update (if applicable)
      Hook (0:00) 
      Intro (1:00) 
      Main Content with latest details (2:30) 
      Analysis/Impact (5:00) 
      CTA (6:30)",
    "initialEngagement": 85,
    "channelFitExplanation": "explanation including time sensitivity if breaking news",
    "updateStatus": "whether this news is still developing or concluded"
  }
]

Requirements:
- Scripts MUST be 500+ words
- Include latest known information for breaking news
- Include all timecodes
- Keep JSON format exact
- No markdown, no code blocks
- Array of exactly ${trends.length} items
- For breaking news, include verified details only`;

  try {
    const result = await model.generateContent(prompt);
    const content = result.response.text();
    console.log("Raw AI response:", content.substring(0, 200) + "..."); 
    
    return await cleanJsonResponse(content);
  } catch (error) {
    console.error("Error in generateInitialScripts:", error);
    throw new Error("Failed to generate initial scripts: " + error.message);
  }
}

async function optimizeTitleAndDescription(script, trend, channelDescription, isBreakingNews = false) {
  const prompt = `
You are a YouTube SEO expert. Create optimized metadata for this video.

IMPORTANT: Respond ONLY with a JSON object. No other text. Use this EXACT format:
{
  "title": "compelling title under 60 chars (include BREAKING NEWS if applicable)",
  "description": "engaging description 120-150 chars with latest info",
  "hashtags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "predictedCTR": 85,
  "urgencyLevel": "HIGH/MEDIUM/LOW based on time sensitivity"
}

Content Details:
- Channel Focus: ${channelDescription}
- Content Type: ${isBreakingNews ? 'BREAKING NEWS' : 'Trend'}
- Topic: ${trend.title}
- Script Summary: ${script.substring(0, 300)}...

Requirements:
- Title: Include keywords, create urgency for breaking news
- Description: Include latest details and key information
- Hashtags: Mix of trending and topic-specific tags
- No markdown, no code blocks
- Keep JSON format exact`;

  try {
    const result = await model.generateContent(prompt);
    const content = result.response.text();
    return JSON.parse(content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim());
  } catch (error) {
    console.error("Error in optimizeTitleAndDescription:", error);
    throw new Error("Failed to optimize title and description: " + error.message);
  }
}

async function generateFinalContent(category, channelDescription, timeRange) {
  try {
    const trends = await fetchTrendingTopics(timeRange);
    let relevantTrends = category === "All categories" 
      ? trends.slice(0, 5)
      : trends.filter(t => t.categories.some(cat => 
          cat.toLowerCase() === category.toLowerCase()
        )).slice(0, 5);

    if (relevantTrends.length === 0) {
      throw new Error("No relevant trending topics found");
    }

    console.log("Generating scripts for trends:", relevantTrends.map(t => t.title));

    const initialScripts = await generateInitialScripts(channelDescription, relevantTrends);
    
    if (!Array.isArray(initialScripts)) {
      throw new Error("Invalid response format from script generation");
    }

    console.log("Scripts generated successfully, proceeding with optimization");

    const finalContent = await Promise.all(
      initialScripts.map(async (content, index) => {
        try {
          const optimization = await optimizeTitleAndDescription(
            content.script,
            relevantTrends[index],
            channelDescription
          );

          const finalVideoContent = {
            title: optimization.title,
            description: optimization.description,
            fullScript: content.script,
            hashtags: optimization.hashtags,
            engagementScore: Math.round((content.initialEngagement + optimization.predictedCTR) / 2),
            trendingContext: {
              suggestedCategories: relevantTrends[index].categories,
              channelFit: content.channelFitExplanation
            }
          };

          return VideoContentSchema.parse(finalVideoContent);
        } catch (error) {
          console.error(`Error processing content ${index}:`, error);
          throw new Error(`Failed to process content for trend "${relevantTrends[index].title}"`);
        }
      })
    );

    return {
      success: true,
      error: null,
      data: finalContent
    };
  } catch (error) {
    console.error("Content Generation Error:", error);
    return {
      success: false,
      error: error.message || "Internal server error",
      data: null
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

    const responseText = await generateFinalContent(
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

app.post('/process', async (req, res) => {
  try {
    const data = req.body;
    console.log("Request Data:", data);
    const response = await processUserData(data);
    res.json(response);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});