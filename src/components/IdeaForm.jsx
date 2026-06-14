import { useState, useEffect } from "react";
import api from "../api/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Pencil, PlusCircle, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

function IdeaForm({ initialData, refreshIdeas, onClose }) {
  const isEditMode = !!initialData?.id;

  const [formData, setFormData] = useState({
    title: "",
    industry: "",
    problem: "",
    solution: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Populate form if we are in Edit Mode
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        industry: initialData.industry || "",
        problem: initialData.problem || "",
        solution: initialData.solution || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(""); // Clear error on change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic Validation
    if (!formData.title.trim() || !formData.industry.trim() || !formData.problem.trim() || !formData.solution.trim()) {
      setError("Please fill out all fields.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (isEditMode) {
        // Edit flow: PUT /ideas/{id}
        await api.put(`/ideas/${initialData.id}`, {
          id: initialData.id,
          ...formData,
        });
        setSuccess("Startup idea updated successfully!");
      } else {
        // Create flow: POST /ideas
        await api.post("/ideas", formData);
        setSuccess("Startup idea created successfully!");
        // Reset form on success if creating
        setFormData({
          title: "",
          industry: "",
          problem: "",
          solution: "",
        });
      }

      if (refreshIdeas) {
        refreshIdeas();
      }

      // Close modal/overlay if onClose function is supplied
      if (onClose) {
        setTimeout(() => {
          onClose();
        }, 1200);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || `Failed to ${isEditMode ? "update" : "create"} idea. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-6 tracking-tight flex items-center gap-2">
        {isEditMode ? (
          <>
            <span className="p-2 bg-primary/10 text-primary rounded-lg">
              <Pencil className="size-5" />
            </span>
            Edit Startup Idea
          </>
        ) : (
          <>
            <span className="p-2 bg-primary/10 text-primary rounded-lg">
              <PlusCircle className="size-5" />
            </span>
            Submit New Startup Idea
          </>
        )}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 [&>svg]:text-emerald-600">
            <CheckCircle2 className="size-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="idea-title">Idea Title</Label>
          <Input
            id="idea-title"
            type="text"
            name="title"
            placeholder="e.g. AI-Powered Dental Diagnostics"
            value={formData.title}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="idea-industry">Industry</Label>
          <Input
            id="idea-industry"
            type="text"
            name="industry"
            placeholder="e.g. Artificial Intelligence, Healthcare, EdTech"
            value={formData.industry}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="idea-problem">The Problem</Label>
          <Textarea
            id="idea-problem"
            name="problem"
            rows={3}
            placeholder="What painful problem are you solving?"
            value={formData.problem}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="idea-solution">Your Solution</Label>
          <Textarea
            id="idea-solution"
            name="solution"
            rows={3}
            placeholder="How does your startup address this problem uniquely?"
            value={formData.solution}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          {onClose && (
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Processing...
              </>
            ) : isEditMode ? (
              "Update Idea"
            ) : (
              "Submit Idea"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default IdeaForm;