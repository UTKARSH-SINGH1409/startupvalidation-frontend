import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import FeedCard from "../components/FeedCard";
import api from "../api/axios";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Globe, Users } from "lucide-react";

export default function Feed() {
  const [allPosts, setAllPosts] = useState([]);
  const [followingPosts, setFollowingPosts] = useState([]);
  const [followingIds, setFollowingIds] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadFeed = async (showLoadingState = true) => {
    try {
      if (showLoadingState) setLoading(true);
      const [profileRes, exploreRes, followingRes] = await Promise.all([
        api.get("/users/me/profile"),
        api.get("/ideas/explore"),
        api.get("/ideas/following")
      ]);
      setFollowingIds(profileRes.data.followingIds || []);
      setCurrentUserId(profileRes.data.id);
      setAllPosts(exploreRes.data.ideas || []);
      setFollowingPosts(followingRes.data.ideas || []);
    } catch (err) {
      console.error("Failed to load feed", err);
    } finally {
      if (showLoadingState) setLoading(false);
    }
  };

  const refreshFeed = () => loadFeed(false);

  useEffect(() => {
    loadFeed(true);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 py-8 md:py-10">
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight font-heading">
            Public Idea Feed
          </h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            Discover, rate, and provide feedback on startup ideas from founders around the world.
          </p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="all" className="gap-2 font-semibold">
              <Globe className="size-4" />
              All Posts
            </TabsTrigger>
            <TabsTrigger value="following" className="gap-2 font-semibold">
              <Users className="size-4" />
              Following
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {loading ? (
              <p className="text-center text-muted-foreground">Loading feed...</p>
            ) : allPosts.length === 0 ? (
              <EmptyState message="No ideas have been shared publicly yet." />
            ) : (
              allPosts.map((post) => (
                <FeedCard
                  key={post.id}
                  post={post}
                  isFollowing={followingIds.includes(post.authorId)}
                  currentUserId={currentUserId}
                  onUpdate={refreshFeed}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="following" className="space-y-6">
            {loading ? (
              <p className="text-center text-muted-foreground">Loading feed...</p>
            ) : followingPosts.length === 0 ? (
              <EmptyState message="You aren't following anyone with posts yet. Discover founders in the All Posts tab!" />
            ) : (
              followingPosts.map((post) => (
                <FeedCard
                  key={post.id}
                  post={post}
                  isFollowing={true}
                  currentUserId={currentUserId}
                  onUpdate={refreshFeed}
                />
              ))
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <Card className="border-dashed shadow-none">
      <CardContent className="flex flex-col items-center justify-center p-12 text-center">
        <div className="p-4 bg-muted rounded-full mb-4 text-muted-foreground">
          <Globe className="size-8" />
        </div>
        <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
          {message}
        </p>
      </CardContent>
    </Card>
  );
}
