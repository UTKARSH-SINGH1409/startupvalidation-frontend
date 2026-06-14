import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import IdeaCard from "../components/IdeaCard";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

function MyIdeas() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");

  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    setLoading(true);
    try {
      const response = await api.get("/users/me/profile");
      setIdeas(response.data.ideas || []);
    } catch (error) {
      console.error("Error fetching ideas:", error);
    } finally {
      setLoading(false);
    }
  };

  // Extract unique industries for filter dropdown
  const industries = Array.from(
    new Set(ideas.map((idea) => idea.industry).filter(Boolean))
  );

  // Filter ideas based on search query and selected industry dropdown
  const filteredIdeas = ideas.filter((idea) => {
    const matchesSearch =
      idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.problem.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.solution.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesIndustry =
      selectedIndustry === "" || selectedIndustry === "all" ||
      idea.industry.toLowerCase() === selectedIndustry.toLowerCase();

    return matchesSearch && matchesIndustry;
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6 md:p-8">
        {/* Page Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight font-heading">
              My Startup Ideas
            </h1>
            <p className="text-muted-foreground mt-1">
              Browse, search, edit, and trigger evaluations for all your business ideas.
            </p>
          </div>
          <Badge variant="outline" className="w-fit text-sm px-4 py-2 font-semibold">
            Total Ideas: <span className="text-primary font-extrabold ml-1">{ideas.length}</span>
          </Badge>
        </div>

        {/* Filter Toolbar */}
        <Card className="mb-8">
          <CardContent className="p-4 md:p-6 flex flex-col md:flex-row gap-4">
            {/* Search Box */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <Input
                type="text"
                placeholder="Search by title, problem, or solution..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Industry Filter Dropdown */}
            <div className="md:w-64">
              <Select
                value={selectedIndustry || "all"}
                onValueChange={(value) => setSelectedIndustry(value === "all" ? "" : value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Industries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Industries</SelectItem>
                  {industries.map((ind) => (
                    <SelectItem key={ind} value={ind}>
                      {ind}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Catalog Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <Card key={i} className="p-6 space-y-4">
                  <div className="flex justify-between">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                  <div className="space-y-2 pt-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                  </div>
                </Card>
              ))}
          </div>
        ) : filteredIdeas.length === 0 ? (
          <Card className="text-center">
            <CardContent className="p-16">
              <div className="bg-muted p-5 rounded-full w-fit mx-auto text-muted-foreground mb-5">
                <Search className="size-12" />
              </div>
              <h3 className="text-xl font-bold text-foreground">No matching startup ideas found</h3>
              <p className="text-muted-foreground max-w-sm mx-auto mt-2 text-sm leading-relaxed">
                {ideas.length === 0
                  ? "You haven't submitted any startup ideas yet. Go to your Dashboard to submit your first idea!"
                  : "No ideas match your current search query or industry filter. Try using different terms or resetting filters."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIdeas.map((idea) => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                refreshIdeas={fetchIdeas}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyIdeas;