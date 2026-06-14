import { useState, useEffect } from "react";
import api from "../api/axios";
import IdeaForm from "./IdeaForm";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  ShieldCheck,
  Pencil,
  Trash2,
  Loader2,
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

function IdeaCard({ idea, refreshIdeas }) {
  const [isDeleting, setIsDeleting] = useState(false);

  // Validation State
  const [isValidating, setIsValidating] = useState(false);
  const [validationData, setValidationData] = useState(null);
  const [validationModalOpen, setValidationModalOpen] = useState(false);

  // Edit State
  const [editModalOpen, setEditModalOpen] = useState(false);

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${idea.title}"?`
    );

    if (!confirmDelete) return;

    setIsDeleting(true);
    try {
      await api.delete(`/ideas/${idea.id}`);
      refreshIdeas();
    } catch (error) {
      console.error(error);
      alert("Failed to delete the startup idea. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleValidate = async () => {
    setValidationData({ title: idea.title });
    setValidationModalOpen(true);
    setIsValidating(true);
    try {
      const response = await api.get(`/ideas/validate/${idea.id}`);
      setValidationData({
        title: idea.title,
        ...response.data
      });
    } catch (error) {
      console.error(error);
      setValidationModalOpen(false);
      alert(error.response?.data?.message || "Please enter a meaningful startup idea with a clear problem statement and proposed solution.");
    } finally {
      setIsValidating(false);
    }
  };

  // Helper to determine verdict colors and badges
  const getVerdictStyle = (verdict) => {
    const v = (verdict || "").toLowerCase();
    if (v.includes("high") || v.includes("good") || v.includes("viable") || v.includes("approve") || v.includes("strong")) {
      return {
        bg: "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-300",
        badgeClass: "bg-emerald-500 text-white hover:bg-emerald-500",
        icon: <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400" />,
      };
    }
    if (v.includes("invalid") || v.includes("risk") || v.includes("weak") || v.includes("avoid") || v.includes("fail") || v.includes("low") || v.includes("meaningless")) {
      return {
        bg: "bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/30 dark:border-rose-800 dark:text-rose-300",
        badgeClass: "bg-rose-500 text-white hover:bg-rose-500",
        icon: <XCircle className="size-5 text-rose-600 dark:text-rose-400" />,
      };
    }
    return {
      bg: "bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-300",
      badgeClass: "bg-amber-500 text-white hover:bg-amber-500",
      icon: <AlertTriangle className="size-5 text-amber-600 dark:text-amber-400" />,
    };
  };

  const verdictConfig = validationData ? getVerdictStyle(validationData.verdict) : null;

  return (
    <>
      {/* IDEA CARD */}
      <Card className="flex flex-col justify-between hover:shadow-lg transition-all duration-300">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start gap-3">
            <h3 className="text-lg font-bold text-foreground leading-tight">
              {idea.title}
            </h3>
            <Badge variant="secondary" className="shrink-0">
              {idea.industry}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 flex-1">
          {/* Problem */}
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
              The Problem
            </span>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {idea.problem}
            </p>
          </div>

          {/* Solution */}
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
              Proposed Solution
            </span>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {idea.solution}
            </p>
          </div>
        </CardContent>

        <CardFooter className="justify-between gap-2">
          {/* Validate */}
          <Button
            size="sm"
            onClick={handleValidate}
            disabled={isValidating || isDeleting}
            className="gap-1.5"
          >
            {isValidating ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <ShieldCheck className="size-4" />
                Validate
              </>
            )}
          </Button>

          {/* Actions */}
          <div className="flex gap-1">

            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setEditModalOpen(true)}
              disabled={isDeleting || isValidating}
              title="Edit Idea"
            >
              <Pencil className="size-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleDelete}
              disabled={isDeleting || isValidating}
              title="Delete Idea"
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              {isDeleting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Trash2 className="size-4" />
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* EDIT IDEA MODAL */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-xl">
          <IdeaForm
            initialData={idea}
            refreshIdeas={refreshIdeas}
            onClose={() => setEditModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* VALIDATION MODAL */}
      <Dialog open={validationModalOpen} onOpenChange={setValidationModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <Badge className="w-fit bg-primary/10 text-primary hover:bg-primary/10 border-primary/20">
              Validation Report
            </Badge>
            <DialogTitle className="text-2xl font-extrabold mt-3">
              {idea.title}
            </DialogTitle>
            <DialogDescription>
              AI evaluation based on current market signals, competition, and risk.
            </DialogDescription>
          </DialogHeader>

          {validationData && (
            <div className="space-y-6 mt-4">
              {isValidating || !validationData.verdict ? (
                <div className="space-y-6 animate-pulse">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <Skeleton className="h-24 w-full rounded-xl" />
                    <Skeleton className="h-24 w-full rounded-xl" />
                    <Skeleton className="h-24 w-full rounded-xl" />
                  </div>
                  <Skeleton className="h-32 w-full rounded-xl" />
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="size-4 animate-spin" />
                    <span className="text-sm">Gemini AI is analyzing your idea...</span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {[
                      { label: "Market Potential", value: validationData.marketScore, accent: "text-primary" },
                      { label: "Competition", value: validationData.competitionScore, accent: "text-chart-2" },
                      { label: "Risk Profile", value: validationData.riskScore, accent: "text-destructive" },
                    ].map((item) => (
                      <Card key={item.label} className="p-4">
                        <div className="flex items-center justify-between text-sm font-semibold text-muted-foreground mb-2">
                          <span>{item.label}</span>
                          <span className={item.accent}>{item.value}%</span>
                        </div>
                        <Progress value={item.value} className="h-3" />
                      </Card>
                    ))}
                  </div>

                  <div className={`rounded-xl border p-5 ${verdictConfig?.card || verdictConfig?.bg}`}>
                    <div className="flex items-center gap-4">
                      <div className="flex size-12 items-center justify-center rounded-lg bg-card shadow-sm">
                        {verdictConfig?.icon}
                      </div>
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">Verdict</p>
                        <p className="mt-1 text-lg font-semibold text-foreground">{validationData.verdict}</p>
                      </div>
                    </div>
                    {validationData.feedback && (
                      <div className="mt-5 pt-5 border-t border-border/50 text-sm text-muted-foreground">
                        <p className="flex items-center gap-2 font-semibold text-foreground mb-2">
                          <Sparkles className="size-4 text-amber-500" />
                          Gemini AI Analysis
                        </p>
                        <TypewriterText text={validationData.feedback} />
                      </div>
                    )}
                  </div>

                  {/* Close Button */}
                  <Button
                    className="w-full mt-4"
                    onClick={() => setValidationModalOpen(false)}
                  >
                    Done
                  </Button>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default IdeaCard;