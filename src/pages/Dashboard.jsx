import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import IdeaCard from "../components/IdeaCard";
import boxImg from "../assets/box.png";
import brainImg from "../assets/brain.png";
import capImg from "../assets/cap.png";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Lightbulb,
  Brain,
  GraduationCap,
  Archive,
  ShieldCheck,
  Pencil,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Share2,
  Sparkles,
} from "lucide-react";

const TypewriterText = ({ text, delay = 20 }) => {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentText("");
    setCurrentIndex(0);
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText(prevText => prevText + text[currentIndex]);
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, delay, text]);

  return <p className="leading-relaxed">{currentText}</p>;
};

function Dashboard() {
  const [stats, setStats] = useState({
    totalIdeas: 0,
    aiIdeas: 0,
    edTechIdeas: 0,
  });

  const [ideas, setIdeas] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingIdeas, setLoadingIdeas] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    industry: "",
    problem: "",
    solution: "",
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const userName = localStorage.getItem("userName") || "Founder";

  useEffect(() => {
    fetchStats();
    fetchIdeas();
  }, []);

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const response = await api.get("/ideas/stats");
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchIdeas = async () => {
    setLoadingIdeas(true);
    try {
      const response = await api.get("/users/me/profile");
      setIdeas(response.data.ideas || []);
    } catch (error) {
      console.error("Error fetching ideas:", error);
    } finally {
      setLoadingIdeas(false);
    }
  };

  const refreshDashboard = () => {
    fetchStats();
    fetchIdeas();
  };

  const handleInputChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
    setFormError("");
    setFormSuccess("");
  };

  const resetForm = () => {
    setFormData({
      title: "",
      industry: "",
      problem: "",
      solution: "",
    });
    setFormError("");
    setFormSuccess("");
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!formData.title.trim() || !formData.industry.trim() || !formData.problem.trim() || !formData.solution.trim()) {
      setFormError("Please complete all fields before submitting.");
      return;
    }

    setFormLoading(true);
    setFormError("");
    setFormSuccess("");

    try {
      await api.post("/ideas", formData);
      setFormSuccess("Startup idea created successfully!");
      resetForm();
      refreshDashboard();
    } catch (error) {
      console.error(error);
      setFormError(error.response?.data?.message || "Failed to create idea. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  const recentIdeas = [...ideas].sort((a, b) => b.id - a.id).slice(0, 4);

  const statsConfig = [
    { label: "Total Ideas", value: stats.totalIdeas, image: boxImg, accent: "text-primary" },
    { label: "AI Startup Ideas", value: stats.aiIdeas, image: brainImg, accent: "text-chart-2" },
    { label: "EdTech Startup Ideas", value: stats.edTechIdeas, image: capImg, accent: "text-chart-3" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8 md:px-8 md:py-10">
        {/* Welcome Hero */}
        <Card className="mb-10 overflow-hidden">
          <CardContent className="p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground">
                  Startup validation hub
                </p>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl font-heading">
                  Welcome back, {userName}! 👋
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                  Submit your latest startup hypotheses and validate them with AI insights, all from one clean dashboard.
                </p>
              </div>

              <Badge variant="outline" className="gap-2 px-4 py-2 text-sm font-semibold w-fit">
                <span className="inline-flex size-2.5 rounded-full bg-emerald-500" aria-hidden="true" />
                Server status:
                <span className="text-primary">Online</span>
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Stats Row */}
        <section className="grid gap-6 lg:grid-cols-3 mb-10">
          {loadingStats ? (
            Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="p-6">
                <Skeleton className="h-4 w-24 mb-4" />
                <Skeleton className="h-10 w-16" />
              </Card>
            ))
          ) : (
            statsConfig.map((stat) => {
              return (
                <Card key={stat.label} className="hover:shadow-md transition-all duration-300">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                      <p className="mt-3 text-4xl font-bold text-foreground">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-lg bg-muted ${stat.accent}`}>
                      <img src={stat.image} alt={stat.label} className="w-8 h-8 object-contain" />
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </section>

        {/* Main Grid: Form + Recent Ideas */}
        <section className="grid gap-8 xl:grid-cols-[420px_minmax(0,1fr)]">
          {/* Submission Form Card */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground">
                    Submission panel
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-foreground">
                    Submit new idea
                  </h2>
                </div>
                <Badge>New</Badge>
              </div>
            </CardHeader>

            <CardContent>
              {formError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="size-4" />
                  <AlertDescription>{formError}</AlertDescription>
                </Alert>
              )}
              {formSuccess && (
                <Alert className="mb-4 border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 [&>svg]:text-emerald-600">
                  <CheckCircle2 className="size-4" />
                  <AlertDescription>{formSuccess}</AlertDescription>
                </Alert>
              )}

              <form className="space-y-5" onSubmit={handleFormSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="dash-title">Idea title</Label>
                  <Input
                    id="dash-title"
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="AI-powered education assistant"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dash-industry">Industry</Label>
                  <Input
                    id="dash-industry"
                    type="text"
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    placeholder="EdTech, AI, Healthcare"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dash-problem">The problem</Label>
                  <Textarea
                    id="dash-problem"
                    name="problem"
                    value={formData.problem}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="What pain point are you solving?"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dash-solution">Proposed solution</Label>
                  <Textarea
                    id="dash-solution"
                    name="solution"
                    value={formData.solution}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="How does your startup solve it?"
                  />
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <Button type="submit" disabled={formLoading}>
                    {formLoading ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Submit idea"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Recent Ideas Panel */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground">
                      Recent submissions
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-foreground">
                      Latest startup ideas
                    </h2>
                  </div>
                  <Badge variant="outline" className="w-fit text-xs uppercase tracking-[0.2em]">
                    Showing latest 4
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {loadingIdeas ? (
              <div className="grid gap-6 sm:grid-cols-2">
                {Array.from({ length: 2 }).map((_, index) => (
                  <Card key={index} className="p-6">
                    <Skeleton className="h-4 w-20 mb-3" />
                    <Skeleton className="h-6 w-40 mb-5" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4 mb-5" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </Card>
                ))}
              </div>
            ) : recentIdeas.length === 0 ? (
              <Card className="text-center">
                <CardContent className="p-12">
                  <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <Lightbulb className="size-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">No startup ideas yet</h3>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    Add your first idea using the form on the left and let the AI validation engine analyze it.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                {recentIdeas.map((idea) => (
                  <IdeaCard key={idea.id} idea={idea} refreshIdeas={refreshDashboard} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
