"use client";

import { useState } from "react";
import { Sparkles, Youtube, TrendingUp } from "lucide-react";
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
import { toast } from "@/hooks/use-toast";

const timeRanges = [
  { label: "Past 24 hours", value: "24" },
  { label: "Past 2 days", value: "48" },
  { label: "Past 3 days", value: "72" },
  { label: "Past 7 days", value: "168" },
];

const categories = [
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
  "Pets and Animals",
  "Politics",
  "Science",
  "Shopping",
  "Sports",
  "Technology",
  "Travel and Transportation",
  "Other",
];

type Idea = {
  title: string;
  description: string;
  fullScript: string;
  hashtags: string[];
  engagementScore: number;
};

export default function App() {
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [timeRange, setTimeRange] = useState("168");
  const [category, setCategory] = useState("All categories");
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [ideas, setIdeas] = useState<Idea[]>([]);

  const generateIdeas = async () => {
    if (!description.trim()) {
      toast({
        description: "Please enter a channel description",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: "",
      }).then((res) => res.json());

      if (!response.success) {
        return toast({
          description: "Failed to generate ideas. Please try again",
          variant: "destructive",
        });
      }

      const result: any = await fetch("http://localhost:8000/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category,
          description,
          timeRange,
        }),
      }).then((res) => res.json());
      if (!result.success) {
        return toast({
          description: result.error,
          variant: "destructive",
        });
      }
      console.log(result.data);
      setIdeas(result.data);
    } catch (error) {
      console.error("API Error:", error);
      toast({
        description: "Failed to generate ideas. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-yellow-400";
    return "text-blue-400";
  };

  return (
    <div className="h-screen overflow-y-scroll bg-zinc-900 text-white p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Main Input Section */}
        <Card className="bg-zinc-800/50 border-zinc-700 backdrop-blur-sm">
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-zinc-400">Category</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="bg-zinc-900 border-zinc-700 hover:border-zinc-600 transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-zinc-400">Time Range</label>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="bg-zinc-900 border-zinc-700 hover:border-zinc-600 transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timeRanges?.map((range) => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-zinc-400">
                Channel Description
              </label>
              <div className="relative">
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What's your channel about?"
                  className="bg-zinc-900 border-zinc-700 hover:border-zinc-600 transition-colors pr-32"
                />
                <Button
                  onClick={generateIdeas}
                  disabled={loading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-zinc-50 text-zinc-800 border-0"
                >
                  {loading ? (
                    <div className="animate-spin">⚡️</div>
                  ) : (
                    <>Generate</>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {ideas.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <TrendingUp className="w-4 h-4" />
              <span>Click an idea to view the full script</span>
            </div>
            {ideas?.map((idea, index) => (
              <Card
                key={index}
                className="bg-zinc-800/50 border-zinc-700 hover:border-yellow-500/50 hover:bg-zinc-800/70 transition-all cursor-pointer backdrop-blur-sm"
                onClick={() => setSelectedIdea(idea)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-3 flex-1">
                      <h3 className="text-lg font-medium">{idea.title}</h3>
                      <p className="text-zinc-400">{idea.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {idea.hashtags?.map((tag) => (
                          <Badge
                            key={tag}
                            className="bg-zinc-700/50 hover:bg-zinc-700 transition-colors"
                          >
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className={`text-2xl font-bold ${getScoreColor(idea.engagementScore)}`}>
                        {idea.engagementScore}%
                      </div>
                      <div className="text-xs text-zinc-500">Trend Score</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Idea Details Dialog */}
        <Dialog
          open={!!selectedIdea}
          onOpenChange={() => setSelectedIdea(null)}
        >
          <DialogContent className="bg-zinc-900 border-zinc-800 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl">{selectedIdea?.title}</DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh] p-4">
              <div className="space-y-4">
                <p className="text-zinc-400 leading-relaxed">{selectedIdea?.fullScript}</p>
                <div className="flex flex-wrap gap-2 pt-4">
                  {selectedIdea?.hashtags?.map((tag) => (
                    <Badge
                      key={tag}
                      className="bg-zinc-700/50 hover:bg-zinc-700 transition-colors"
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}