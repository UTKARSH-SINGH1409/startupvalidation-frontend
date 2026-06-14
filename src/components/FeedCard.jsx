import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { MessageSquare, Star, Send } from "lucide-react";
import api from "../api/axios";

export default function FeedCard({ post, isFollowing, onUpdate, currentUserId }) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [userRating, setUserRating] = useState(0);

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await api.post(`/users/${post.authorId}/unfollow`);
      } else {
        await api.post(`/users/${post.authorId}/follow`);
      }
      onUpdate(); // refresh feed
    } catch (err) {
      console.error("Failed to follow/unfollow", err);
    }
  };

  const handleRate = async (score) => {
    try {
      setUserRating(score);
      await api.post(`/ideas/${post.id}/rate`, { rating: score });
      onUpdate(); // refresh feed
    } catch (err) {
      console.error("Failed to rate", err);
    }
  };

  const toggleComments = async () => {
    const nextState = !showComments;
    setShowComments(nextState);
    if (nextState) {
      setLoadingComments(true);
      try {
        const res = await api.get(`/ideas/${post.id}/suggestions`);
        setComments(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingComments(false);
      }
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      await api.post(`/ideas/${post.id}/suggestions`, { suggestion: commentText.trim() });
      setCommentText("");
      const res = await api.get(`/ideas/${post.id}/suggestions`);
      setComments(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const authorName = post.authorName || "Unknown";
  const initials = authorName.substring(0, 2).toUpperCase();
  const isOwnPost = currentUserId && post.authorId === currentUserId;

  return (
    <Card className="hover:shadow-md transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center gap-4 pb-3">
        <Avatar className="size-10 border">
          <AvatarFallback className="bg-primary/10 text-primary font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-foreground">{authorName}</h4>
            {!isOwnPost && post.authorId && (
              <Button
                variant={isFollowing ? "secondary" : "outline"}
                size="sm"
                className="h-6 text-xs px-2 rounded-full"
                onClick={handleFollow}
              >
                {isFollowing ? "Following" : "Follow"}
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {post.createdAt ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) : "recently"}
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Idea Info */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold text-foreground font-heading">
              {post.title}
            </h3>
            <Badge variant="secondary">{post.industry}</Badge>
          </div>
          
          <div className="mt-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
              The Problem
            </p>
            <p className="text-sm text-foreground/80 leading-relaxed">
              {post.problem}
            </p>
          </div>

          <div className="mt-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
              Proposed Solution
            </p>
            <p className="text-sm text-foreground/80 leading-relaxed">
              {post.solution}
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex-col items-stretch gap-4 bg-muted/20 border-t p-4 rounded-b-xl">
        <div className="flex items-center justify-between w-full">
          {/* Rating Section */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {(() => {
                const displayRating = userRating || Math.round(post.averageRating || 0);
                return [1, 2, 3, 4, 5].map((star) => {
                  const isSolid = star <= displayRating;
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRate(star)}
                      className={`transition-colors hover:text-amber-500 focus:outline-none ${isSolid ? 'text-amber-500' : 'text-muted-foreground/30'}`}
                      title={`Rate ${star} stars`}
                    >
                      <Star className={`size-5 ${isSolid ? 'fill-amber-500' : ''}`} />
                    </button>
                  );
                });
              })()}
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              {userRating || Math.round(post.averageRating || 0)}
            </span>
          </div>

          {/* Comment Toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={toggleComments}
          >
            <MessageSquare className="size-4" />
            <span className="text-sm">Comments</span>
          </Button>
        </div>

        {/* Expandable Comments Section */}
        {showComments && (
          <div className="w-full space-y-4 pt-2">
            <Separator />
            
            <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {loadingComments ? (
                <p className="text-sm text-muted-foreground text-center py-2">Loading...</p>
              ) : comments.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-2">
                  No suggestions yet. Be the first!
                </p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="bg-background rounded-lg p-3 border text-sm">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-foreground">{comment.user?.name || "User"}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {comment.createdAt ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true }) : ""}
                      </span>
                    </div>
                    <p className="text-muted-foreground">{comment.suggestion}</p>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleAddComment} className="flex gap-2 items-center">
              <Input
                type="text"
                placeholder="Add a suggestion or question..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 bg-background h-9 text-sm"
              />
              <Button type="submit" size="icon" className="h-9 w-9 shrink-0" disabled={!commentText.trim()}>
                <Send className="size-4" />
              </Button>
            </form>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
