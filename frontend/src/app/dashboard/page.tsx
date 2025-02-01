"use client"
import { useState } from "react";
import { Sparkles, Youtube } from "lucide-react";
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
  "Gaming",
  "Technology",
  "Entertainment",
  "Education",
  "Lifestyle",
  "Music",
  "Sports",
  "Travel",
];

type Idea = {
  title: string;
  description: string;
  tags: string[];
  score: number;
};

export default function App() {
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [timeRange, setTimeRange] = useState("24");
  const [category, setCategory] = useState("Gaming");
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
      });

      if (!response.ok) {
        throw new Error("Failed to generate ideas");
      }

      const result:any = await fetch("http://localhost:8000/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description,
          timeRange,
          category,
        }),
      });
      
      if (!result.ok) {
        throw new Error("Failed to generate ideas");
      }

      if (!result.data.success)
      {
        toast({
          description: result.data.error,
          variant: "destructive",
        });
      }
      const mockIdeas = await result.json();      
      setIdeas(mockIdeas);
    } catch (error) {
      toast({
        description: "Failed to generate ideas. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-zinc-900 text-white p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-4">
            <Youtube className="w-8 h-8 text-red-500" />
            <Sparkles className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-4xl font-bold">Video Idea Generator</h1>
          <p className="text-zinc-400">Generate trending video ideas powered by AI</p>
        </div>

        {/* Main Input Section */}
        <Card className="bg-zinc-800/50 border-zinc-700">
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-zinc-400">Category</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="bg-zinc-900 border-zinc-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-zinc-400">Time Range</label>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="bg-zinc-900 border-zinc-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timeRanges.map(range => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-zinc-400">Channel Description</label>
              <div className="relative">
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What's your channel about?"
                  className="bg-zinc-900 border-zinc-700 pr-32"
                />
                <Button
                  onClick={generateIdeas}
                  disabled={loading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-red-500 hover:bg-red-600"
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
            {ideas.map((idea, index) => (
              <Card 
                key={index}
                className="bg-zinc-800/50 border-zinc-700 hover:border-red-500/50 transition-all cursor-pointer"
                onClick={() => setSelectedIdea(idea)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">{idea.title}</h3>
                      <p className="text-zinc-400">{idea.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {idea.tags.map(tag => (
                          <Badge key={tag} className="bg-red-500/10 text-red-400">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-red-400 font-bold">{idea.score}%</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Idea Details Dialog */}
        <Dialog open={!!selectedIdea} onOpenChange={() => setSelectedIdea(null)}>
          <DialogContent className="bg-zinc-900 border-zinc-800">
            <DialogHeader>
              <DialogTitle>{selectedIdea?.title}</DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh] p-4">
              <div className="space-y-4">
                <p className="text-zinc-400">{selectedIdea?.description}</p>
                <div className="flex flex-wrap gap-2">
                  {selectedIdea?.tags.map(tag => (
                    <Badge key={tag} className="bg-red-500/10 text-red-400">
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