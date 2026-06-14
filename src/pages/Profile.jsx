import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import api from "../api/axios";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, UserPlus } from "lucide-react";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/users/me/profile");
        setProfile(res.data);
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const email = profile?.email || localStorage.getItem("email");
  const userName = profile?.name || localStorage.getItem("userName") || "Founder";
  const initials = userName.substring(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-3xl mx-auto p-8">
        <Card className="shadow-lg border-border">
          <CardHeader className="flex flex-row items-center gap-6 pb-2">
            <Avatar className="size-20 border-2 border-primary/20">
              <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-3xl font-extrabold text-foreground font-heading">
                {userName}
              </h1>
              <p className="text-muted-foreground font-medium mt-1">
                Entrepreneur & Innovator
              </p>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex gap-8 mb-6 p-4 bg-muted/30 rounded-lg border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 text-primary rounded-full">
                  <Users className="size-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{loading ? "-" : profile?.followerCount || 0}</p>
                  <p className="text-xs text-muted-foreground uppercase font-semibold">Followers</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 text-primary rounded-full">
                  <UserPlus className="size-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{loading ? "-" : profile?.followingCount || 0}</p>
                  <p className="text-xs text-muted-foreground uppercase font-semibold">Following</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Email Address
                </p>
                <p className="text-foreground text-lg font-medium">{email}</p>
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Role
                </p>
                <p className="text-foreground text-lg font-medium">Founder</p>
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Posted Ideas
                </p>
                <p className="text-foreground text-lg font-medium">{loading ? "-" : profile?.ideas?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Profile;