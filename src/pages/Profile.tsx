import { Camera, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Profile {
  display_name: string | null;
  avatar_url: string | null;
  location: string | null;
  icebreaker: string | null;
  interests: string[] | null;
}

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("display_name, avatar_url, location, icebreaker, interests")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (data) setProfile(data);
      });
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background pb-24 pt-4 flex flex-col items-center justify-center px-6">
        <div className="text-center">
          <div className="mb-4 flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-sage">
            <span className="text-2xl">🌿</span>
          </div>
          <h2 className="font-display text-xl font-bold text-foreground mb-2">Join CircleMeet</h2>
          <p className="text-sm text-muted-foreground mb-6">Sign in to see your profile and connect with people</p>
          <Button onClick={() => navigate("/auth")} className="rounded-full px-8">
            Sign In / Sign Up
          </Button>
        </div>
      </div>
    );
  }

  const displayName = profile?.display_name || user.email?.split("@")[0] || "User";
  const interests = profile?.interests || ["Hiking", "Coffee", "Photography"];
  const avatarUrl = profile?.avatar_url || "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=600&fit=crop&crop=face";
  const location = profile?.location || "Nairobi, Kenya";
  const icebreaker = profile?.icebreaker || "Sunsets from my balcony with a warm cup of chai — that's my happy place.";

  return (
    <div className="min-h-screen bg-background pb-24 pt-4">
      <div className="px-5 pb-4">
        <h1 className="font-display text-2xl font-bold text-foreground">Profile</h1>
      </div>

      <div className="mx-4 overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-soft)]">
        <div className="relative aspect-square max-h-72">
          <img src={avatarUrl} alt="Your profile" className="h-full w-full object-cover" />
          <button className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm shadow-md">
            <Camera className="h-5 w-5 text-foreground" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-bold text-foreground">{displayName}</h2>
              <p className="text-sm text-muted-foreground">{location}</p>
            </div>
            <Button variant="outline" size="sm" className="gap-1.5 rounded-full">
              <Edit2 className="h-3.5 w-3.5" />
              Edit
            </Button>
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Your interests</p>
            <div className="flex flex-wrap gap-1.5">
              {interests.map((interest) => (
                <Badge
                  key={interest}
                  variant="secondary"
                  className="rounded-full bg-sage px-3 py-1 text-xs font-medium text-sage-foreground"
                >
                  {interest}
                </Badge>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-peach p-4">
            <p className="text-xs font-medium text-peach-foreground/70 mb-1">Your icebreaker</p>
            <p className="text-sm text-peach-foreground leading-relaxed italic">"{icebreaker}"</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
