import { MetadataParams } from "@/types/landing";

export function generateMetadata({
  title = 'TrendyTube - AI YouTube Trend Analysis',
  description = 'Generate viral YouTube video ideas using AI-powered trend analysis and Google Trends data',
  path = '/',
  image = '/images/trendytube-og.png'
}: MetadataParams) {
  const baseUrl = 'https://trendytube.vercel.app';

  return {
    title: {
      default: title,
      template: `%s | TrendyTube`,
    },
    description,
    keywords: "youtube trends, viral video ideas, ai content generator, youtube analytics, content strategy, trending topics, video title generator, youtube seo, content creation tools, trending youtube ideas",
    metadataBase: new URL(baseUrl),
    openGraph: {
      title,
      description,
      url: `${baseUrl}${path}`,
      siteName: 'TrendyTube',
      locale: 'en_US',
      type: 'website',
      images: [{
        url: image,
        width: 1200,
        height: 630,
        alt: `TrendyTube - AI YouTube Trends`,
      }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  }
}