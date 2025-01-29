"use client"
import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Youtube,
  Search,
  Clock,
  Battery as Category,
  TrendingUp,
  Scan,
  LineChart,
  Brain,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";

type VideoIdea = {
  title: string;
  description: string;
  fullScript: string;
  hashtags: string[];
  engagementScore: number;
};

const timeRanges = [
  { label: "Past 24 hours", value: "24" },
  { label: "Past 2 days", value: "48" },
  { label: "Past 3 days", value: "72" },
  { label: "Past 7 days", value: "168" },
];

const youtubeCategories = [
  "All categories",
  "Autos and Vehicles",
  "Beauty and Fashion",
  "Business and Finance",
  "Climate",
  "Entertainment",
  "Food and Drink",
  "Games",
  "Health",
  "Hobbies and Leisure",
  "Jobs and Education",
  "Law and Government",
  "Other",
  "Pets and Animals",
  "Politics",
  "Science",
  "Shopping",
  "Sports",
  "Technology",
  "Travel and Transportation",
];

function LoadingStep({ icon: Icon, text, progress, isActive, isPulsing = false }: {
  icon: any;
  text: string;
  progress: number;
  isActive: boolean;
  isPulsing?: boolean;
}) {
  return (
    <div className={`flex items-center gap-4 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-40'}`}>
      <div className="relative">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
          isActive 
            ? isPulsing 
              ? 'bg-red-500/20 text-red-500 animate-pulse' 
              : 'bg-red-500/20 text-red-500'
            : 'bg-zinc-800 text-zinc-500'
        }`}>
          <Icon className="w-6 h-6" />
        </div>
        {isActive && !isPulsing && (
          <div className="absolute inset-0 w-12 h-12 rounded-xl bg-red-500/20 animate-ping" />
        )}
      </div>
      <div className="flex-1">
        <p className={`text-sm font-medium ${isActive ? 'text-white' : 'text-zinc-400'}`}>{text}</p>
        <Progress value={progress} className="h-1 mt-2" />
      </div>
    </div>
  );
}

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [channelDescription, setChannelDescription] = useState("");
  const [timeRange, setTimeRange] = useState("24");
  const [category, setCategory] = useState("All categories");
  const [ideas, setIdeas] = useState<VideoIdea[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<VideoIdea | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isDataFetching, setIsDataFetching] = useState(false);

  useEffect(() => {
    if (loading) {
      // Reset progress when loading starts
      setLoadingStep(0);
      setLoadingProgress(0);
      setIsDataFetching(false);

      // Step 1: Scanning ideas (0-3s)
      const step1Duration = 3000;
      const step1Interval = setInterval(() => {
        setLoadingProgress(prev => Math.min(prev + 2, 100));
      }, 60);

      const step1 = setTimeout(() => {
        clearInterval(step1Interval);
        setLoadingStep(1);
        setLoadingProgress(0);
      }, step1Duration);

      // Step 2: Getting trends (3-8s)
      const step2Duration = 5000;
      const step2Interval = setInterval(() => {
        setLoadingProgress(prev => Math.min(prev + 1, 100));
      }, 50);

      const step2 = setTimeout(() => {
        clearInterval(step2Interval);
        setLoadingStep(2);
        setLoadingProgress(0);
        setIsDataFetching(true);
      }, step1Duration + step2Duration);

      return () => {
        clearTimeout(step1);
        clearTimeout(step2);
        clearInterval(step1Interval);
        clearInterval(step2Interval);
      };
    }
  }, [loading]);

  const generateIdeas = async () => {
    if (!channelDescription.trim()) {
      toast({
        description: "Please enter a channel description",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Initial loading sequence (8 seconds total)
      await new Promise(resolve => setTimeout(resolve, 8000));

      const res = await fetch("/api/generate",{
        method: "POST",
      })
      const d = await res.json()
      if (!res.ok) {
        throw new Error(d.error || "Failed to generate ideas");
      }

      const response = await fetch("https://3b1fad95-03a4-49d9-99a3-20e56f66bce0.us-east-1.cloud.genez.io/process", {
        method: "POST",
        body: JSON.stringify({
          channelDescription,
          timeRange,
          category,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate ideas");
      }
      setIdeas(data.data.data);
    } catch (error: any) {
      toast({
        description: `No Trends Found For The Given Category In The ${timeRanges.find((t)=> t.value == timeRange)?.label}`,
        variant: "destructive",
      });
      setIdeas([]);
    } finally {
      setLoading(false);
      setLoadingStep(0);
      setLoadingProgress(0);
      setIsDataFetching(false);
    }
  };

  return (
    <div className="h-screen overflow-y-scroll bg-[#0a0a0a]">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center gap-4 mb-6">
            <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-red-500/50 transition-colors">
              <Youtube className="w-8 h-8 text-red-500" />
            </div>
            <div className="h-[2px] w-12 bg-zinc-800" />
            <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-red-500/50 transition-colors">
              <Sparkles className="w-8 h-8 text-red-500" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
            Video Idea Generator
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Transform your content strategy with AI-powered trending video ideas
          </p>
        </div>

        {/* Main Content */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6 md:p-8">
            {/* Filters */}
            <div className="space-y-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm text-zinc-400">
                    <Category className="w-4 h-4" />
                    Category
                  </label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="w-full bg-zinc-800 border-zinc-700">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {youtubeCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm text-zinc-400">
                    <Clock className="w-4 h-4" />
                    Time Range
                  </label>
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-full bg-zinc-800 border-zinc-700">
                      <SelectValue placeholder="Select time range" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeRanges.map((range) => (
                        <SelectItem key={range.value} value={range.value}>
                          {range.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-zinc-400">
                  <Search className="w-4 h-4" />
                  Channel Description
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    value={channelDescription}
                    onChange={(e) => setChannelDescription(e.target.value)}
                    placeholder="e.g. A channel about tech tutorials"
                    className="w-full h-12 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                  />
                  <Button
                    onClick={generateIdeas}
                    disabled={loading}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-red-600 hover:bg-red-700"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="space-y-6 py-12">
                <div className="max-w-md mx-auto space-y-6">
                  <LoadingStep
                    icon={Scan}
                    text="Scanning your channel description"
                    progress={loadingStep === 0 ? loadingProgress : 100}
                    isActive={loadingStep === 0}
                  />
                  <LoadingStep
                    icon={LineChart}
                    text="Analyzing Google Trends data"
                    progress={loadingStep === 1 ? loadingProgress : loadingStep > 1 ? 100 : 0}
                    isActive={loadingStep === 1}
                  />
                  <LoadingStep
                    icon={Brain}
                    text="Generating AI-powered content ideas"
                    progress={loadingStep === 2 ? 100 : 0}
                    isActive={loadingStep === 2}
                    isPulsing={isDataFetching}
                  />
                </div>
              </div>
            )}

            {/* Results */}
            {!loading && ideas?.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-white">
                    Generated Ideas
                  </h2>
                  <span className="text-sm text-zinc-400">
                    {ideas?.length} ideas generated
                  </span>
                </div>

                <div className="space-y-4">
                  {ideas.map((idea, index) => (
                    <Card
                      key={index}
                      className="bg-zinc-800 border-zinc-700 hover:border-red-500/50 transition-all cursor-pointer group"
                      onClick={() => setSelectedVideo(idea)}
                    >
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                          <h3 className="text-lg font-semibold text-white flex-1 group-hover:text-red-400 transition-colors">
                            {idea.title}
                          </h3>
                          <div className="flex items-center gap-2 bg-zinc-900 px-3 py-1.5 rounded-full">
                            <TrendingUp className="w-4 h-4 text-red-500" />
                            <span className="text-sm font-medium text-zinc-200">
                              {idea.engagementScore}% Engagement Score
                            </span>
                          </div>
                        </div>
                        <Progress
                          value={idea.engagementScore}
                          className="h-1.5 mb-4"
                        />
                        <p className="text-zinc-300 mb-4">{idea.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {idea.hashtags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="bg-red-500/10 text-red-400 hover:bg-red-500/20"
                            >
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modal */}
        <Dialog
          open={!!selectedVideo}
          onOpenChange={(open) => !open && setSelectedVideo(null)}
        >
          <DialogContent className="bg-zinc-900 border-zinc-800 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-white">
                {selectedVideo?.title}
              </DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-6 p-1">
                <div className="flex items-center gap-2 bg-zinc-800 px-4 py-2 rounded-[10px]">
                  <TrendingUp className="w-5 h-5 text-red-500" />
                  <span className="text-zinc-200 font-medium">
                    {selectedVideo?.engagementScore}% Engagement Score
                  </span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-zinc-200">
                    Description
                  </h3>
                  <p className="text-zinc-400">{selectedVideo?.description}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-zinc-200">
                    Full Script
                  </h3>
                  <div className="bg-zinc-800 rounded-[10px] p-4">
                    <p className="text-zinc-300 whitespace-pre-wrap">
                      {selectedVideo?.fullScript}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-zinc-200">
                    Hashtags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedVideo?.hashtags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-red-500/10 text-red-400"
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}