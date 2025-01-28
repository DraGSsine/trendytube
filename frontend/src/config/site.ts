import {
  TrendingUp,
  Video,
  Zap,
  Lock,
  BookOpen,
  AlertTriangle,
  Shield,
} from "lucide-react";

const siteConfig = {
  name: "TrendyTube",
  hero: {
    title: {
      gradient: "Generate Viral Content",
      black: "Like a Pro Creator",
    },
    description:
      "AI-powered YouTube idea generator that crafts trending titles, hashtags, scripts and descriptions using real-time Google Trends data.",
    process: [
      "Select Content Category",
      "Choose Trend Timeframe",
      "Input Your Channel Details",
      "Generate Complete Video Blueprint"
    ],
    cta: {
      primary: {
        text: "Try For Free",
        href: "/pricing",
      },
      secondary: {
        text: "How It Works",
        href: "/#how-it-works",
      },
    },
  },
  features: {
    heading: {
      title: "Everything You Need",
      highlight: "For Viral Videos",
    },
    description:
      "Transform trending topics into engaging YouTube content with our AI-powered toolkit.",
    items: [
      {
        id: "feature-1",
        image: "/images/trends.png",
        alt: "Google Trends integration",
        badge: {
          text: "Trends",
          color: "bg-red-100 border-red-200 text-red-800",
        },
        title: "Real-Time Trend Analysis",
        description:
          "Leverage Google Trends data from past 24 hours to 30 days to find hottest topics in your niche",
      },
      {
        id: "feature-2",
        image: "/images/ai-script.png",
        alt: "AI script generation",
        badge: {
          text: "AI",
          color: "bg-purple-100 border-purple-200 text-purple-800",
        },
        title: "Smart Script Writing",
        description:
          "Generate complete video scripts with optimized structure, hooks, and audience engagement points",
      },
      {
        id: "feature-3",
        image: "/images/hashtags.png",
        alt: "Hashtag generator",
        badge: {
          text: "SEO",
          color: "bg-green-100 border-green-200 text-green-800",
        },
        title: "Hashtag Generator",
        description:
          "Get trending hashtags and keywords tailored for YouTube search optimization",
      },
      {
        id: "feature-4",
        image: "/images/thumbnails.png",
        alt: "Thumbnail ideas",
        badge: {
          text: "Visuals",
          color: "bg-red-100 border-red-200 text-red-800",
        },
        title: "Thumbnail Concepts",
        description:
          "AI-generated thumbnail ideas with composition suggestions and color schemes",
      },
      {
        id: "feature-5",
        image: "/images/analytics.png",
        alt: "Performance analytics",
        badge: {
          text: "Analytics",
          color: "bg-yellow-100 border-yellow-200 text-yellow-800",
        },
        title: "Trend Predictions",
        description:
          "Get predictions on trend longevity and optimal posting times for maximum views",
      },
    ],
  },
  howItWorks: {
    badge: "CONTENT CREATION PROCESS",
    title: "From Trend to Upload in 3 Steps",
    description:
      "Turn emerging trends into viral videos faster than ever with our streamlined workflow",
    steps: [
      {
        id: "step-1",
        step: "Step 1",
        feature: "Niche & Trend Selection",
        icon: TrendingUp,
        description:
          "Choose your content niche and preferred trend timeframe (24h, 48h, 72h, 1 week)",
      },
      {
        id: "step-2",
        step: "Step 2",
        feature: "Channel Description",
        icon: Video,
        description:
          "Enter your channel details to get personalized video suggestions",
      },
      {
        id: "step-3",
        step: "Step 3",
        feature: "Select Video Ideas",
        icon: Zap,
        description:
          "Choose from AI-generated video ideas tailored to your niche and trends",
      },
    ],
  },
  newsletter: {
    title: "Get Trending Ideas First!",
    description: "Join our creator newsletter for weekly trend reports, content tips, and early access to new features. Plus get 3 free AI generations when you subscribe!",
  },

  pricing: {
    header: {
      badge: "Simple Pricing",
      title: "Choose Your Plan",
      description: "Start growing your YouTube channel today",
      trustSignals: [
        { icon: Shield, text: "Copyright Safe" },
        { icon: Zap, text: "Instant Generation" },
        { icon: TrendingUp, text: "Trend Analysis" },
      ],
    },
    plans: [
      {
        name: "Starter",
        price: 4,
        priceId: process.env.NEXT_PUBLIC_STARTER_PRICE_ID!,
        period: "month",
        description: "For beginners and casual creators",
        features: [
          "10 Video Ideas per Day",
          "Advanced Trend Analysis",
          "Advanced SEO Suggestions",
          "Advanced Script Generation",
          "Email Support",
        ],
        highlight: false,
        cta: "Start Free Trial",
      },
      {
        name: "Premium",
        price: 9,
        priceId: process.env.PREMIUM_PRICE_ID!,
        period: "month",
        description: "For Big Channels and Agencies",
        features: [
          "Unlimited Video Ideas",
          "Advanced Trend Analysis",
          "Advanced SEO Suggestions",
          "Advanced Script Generation",
          "24/7 Priority Support",
        ],
        highlight: true,
        cta: "Start Free Trial",
      }
    ]
  },
  legal: {
    nav: [
      {
        title: "Content Guidelines",
        section: "#guidelines",
        icon: AlertTriangle,
      },
      {
        title: "Data Privacy",
        section: "#privacy",
        icon: Lock,
      },
      {
        title: "Terms of Service",
        section: "#terms",
        icon: BookOpen,
      },
    ],
    privacy: {
      title: "Data Privacy",
      description: "How we handle your information",
      measures: [
        {
          title: "Secure Processing",
          description: "All trend data is anonymized and encrypted"
        },
        {
          title: "Content Ownership",
          description: "You retain full rights to all generated content"
        },
        {
          title: "GDPR Compliance",
          description: "Strict adherence to global data regulations"
        },
      ],
    },
    terms: {
      title: "Terms of Service",
      description: "Content generation policies",
      clauses: [
        {
          title: "Fair Use",
          content: "Generated content must comply with platform guidelines"
        },
        {
          title: "Renewals",
          content: "Monthly subscriptions auto-renew until cancelled"
        },
        {
          title: "Usage",
          content: "Personal/commercial use allowed for created content"
        },
      ],
    },
    guidelines: {
      title: "Content Guidelines",
      description: "Ensure compliance with platform rules",
      rules: [
        "No trademark/copyright infringement",
        "No misleading metadata",
        "No harmful/disinformative content",
        "Adhere to YouTube Community Guidelines"
      ],
    },
  },
  auth: {
    title: {
      primary: "Boost Your YouTube Growth with",
      secondary: "TrendyTube",
    },
    description: "AI-powered YouTube content generator that turns trends into viral videos",
    features: [
      "Real-time Google Trends Analysis",
      "AI Script Writer with Hook Generator",
      "Optimized Hashtag & Keyword Suggestions",
      "Thumbnail Composition Ideas",
      "Trend Longevity Predictions",
      "Competitor Content Analysis",
      "Video SEO Score Optimizer",
      "Cross-Platform Content Adaptation"
    ],
    button: {
      title: "See Demo",
      href: "/demo",
    }
  }
};

export default siteConfig;