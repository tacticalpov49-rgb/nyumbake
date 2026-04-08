import { Camera, Edit2, MapPin, Loader2, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ALL_INTERESTS = [
  // Social & Lifestyle
  "Hiking", "Coffee", "Photography", "Books", "Jazz", "Cooking",
  "Music", "Yoga", "Travel", "Gaming", "Art", "Fitness",
  "Movies", "Dogs", "Cats", "Nature", "Dancing", "Writing",
  // Sports
  "Football", "Basketball", "Tennis", "Swimming", "Running", "Cycling",
  // Career & Professional
  "Tech", "Entrepreneurship", "Marketing", "Design", "Finance", "Medicine",
  "Law", "Engineering", "Education", "Real Estate",
  // Creative
  "Painting", "Singing", "Acting", "Poetry", "Fashion", "Interior Design",
  // Wellness
  "Meditation", "Mental Health", "Nutrition", "Skincare",
  // Entertainment
  "Anime", "Podcasts", "Stand-up Comedy", "Board Games", "Concerts",
  // Community
  "Volunteering", "Mentoring", "Networking", "Faith & Spirituality",
];

const ICEBREAKER_PROMPTS = [
  "What's a small thing that made you happy today?",
  "What's a place you'd love to visit again?",
  "What's the last thing that made you laugh out loud?",
  "What's your go-to comfort food on a rainy day?",
  "What's a skill you'd love to learn this year?",
  "What's your favorite way to spend a weekend?",
];

interface ProfileData {
  display_name: string | null;
  avatar_url: string | null;
  username: string | null;
  location: string | null;
  interests: string[];
  icebreaker: string | null;
}

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ display_name: "", username: "", location: "", icebreaker: "" });
  const [editInterests, setEditInterests] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("display_name, avatar_url, username, location, interests, icebreaker" as any)
      .eq("user_id", user.id)
      .single()
      .then(({ data }: any) => {
        if (data) setProfile({
          ...data,
          interests: data.interests || [],
          icebreaker: data.icebreaker || "",
        });
      });
  }, [user]);

  const openEdit = () => {
    setEditForm({
      display_name: profile?.display_name || "",
      username: profile?.username || "",
      location: profile?.location || "",
      icebreaker: profile?.icebreaker || "",
    });
    setEditInterests(profile?.interests || []);
    setEditing(true);
  };

  const toggleEditInterest = (interest: string) => {
    setEditInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : prev.length < 10 ? [...prev, interest] : prev
    );
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) { toast.error("Please select a JPG, PNG, or WebP image"); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be under 5MB"); return; }

    setUploadingAvatar(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${user.id}/avatar.${ext}`;
      const { error: uploadErr } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
      if (uploadErr) throw uploadErr;
      const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
      const avatarUrl = `${urlData.publicUrl}?t=${Date.now()}`;
      const { error: updateErr } = await supabase.from("profiles").update({ avatar_url: avatarUrl } as any).eq("user_id", user.id);
      if (updateErr) throw updateErr;
      setProfile((prev) => prev ? { ...prev, avatar_url: avatarUrl } : prev);
      toast.success("Profile photo updated!");
    } catch (err: any) {
      toast.error(err.message || "Failed to upload photo");
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const detectLocation = () => {
    if (!navigator.geolocation) { toast.error("Geolocation not supported"); return; }
    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json&zoom=10`);
          const data = await res.json();
          const addr = data.address || {};
          // For African countries, try county first
          const county = addr.county || addr.state_district || "";
          const city = addr.city || addr.town || addr.village || "";
          const state = addr.state || "";
          const country = addr.country || "";
          // Build location string: county/city, country
          const primary = county || city || state;
          const loc = [primary, country].filter(Boolean).join(", ");
          setEditForm((prev) => ({ ...prev, location: loc }));
          if (user) {
            await supabase.from("profiles").update({
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
            } as any).eq("user_id", user.id);
          }
        } catch {
          setEditForm((prev) => ({ ...prev, location: `${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)}` }));
        }
        setDetectingLocation(false);
      },
      () => { toast.error("Location access denied"); setDetectingLocation(false); },
      { enableHighAccuracy: true }
    );
  };

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase.from("profiles").update({
        display_name: editForm.display_name,
        username: editForm.username,
        location: editForm.location,
        interests: editInterests,
        icebreaker: editForm.icebreaker,
      } as any).eq("user_id", user.id);
      if (error) {
        console.error("Profile update error:", error);
        toast.error("Failed to save: " + error.message);
      } else {
        setProfile((prev) => prev ? {
          ...prev,
          display_name: editForm.display_name,
          username: editForm.username,
          location: editForm.location,
          interests: editInterests,
          icebreaker: editForm.icebreaker,
        } : prev);
        toast.success("Profile updated!");
        setEditing(false);
      }
    } catch (err: any) {
      console.error("Profile save exception:", err);
      toast.error("Failed to save profile");
    }
    setSaving(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background pb-24 pt-4 flex flex-col items-center justify-center px-6">
        <div className="text-center">
          <div className="mb-4 flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-muted">
            <span className="text-2xl">🌿</span>
          </div>
          <h2 className="font-display text-xl font-bold text-foreground mb-2">Join CircleMeet</h2>
          <p className="text-sm text-muted-foreground mb-6">Sign in to see your profile and connect with people</p>
          <Button onClick={() => navigate("/auth")} className="rounded-full px-8">Sign In / Sign Up</Button>
        </div>
      </div>
    );
  }

  const displayName = profile?.display_name || profile?.username || user.email?.split("@")[0] || "User";
  const interests = profile?.interests || [];
  const avatarUrl = profile?.avatar_url || "";
  const location = profile?.location || "Set your location";
  const icebreaker = profile?.icebreaker || "Tap edit to add your icebreaker ✨";

  return (
    <div className="min-h-screen bg-background pb-24 pt-4">
      <div className="px-5 pb-4">
        <h1 className="font-display text-2xl font-bold text-foreground">Profile</h1>
      </div>

      <div className="mx-4 overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-soft)]">
        <div className="relative aspect-square max-h-72 bg-muted">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Your profile" className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <span className="text-6xl">🌿</span>
            </div>
          )}
          <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleAvatarUpload} className="hidden" />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingAvatar}
            className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm shadow-md"
          >
            {uploadingAvatar ? <Loader2 className="h-5 w-5 text-foreground animate-spin" /> : <Camera className="h-5 w-5 text-foreground" />}
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-bold text-foreground">{displayName}</h2>
              {profile?.username && <p className="text-xs text-muted-foreground">@{profile.username}</p>}
              <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                <span>{location}</span>
              </div>
            </div>
            <Button variant="outline" size="sm" className="gap-1.5 rounded-full" onClick={openEdit}>
              <Edit2 className="h-3.5 w-3.5" />
              Edit
            </Button>
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Your interests</p>
            <div className="flex flex-wrap gap-1.5">
              {interests.length > 0 ? interests.map((interest) => (
                <Badge key={interest} variant="secondary" className="rounded-full px-3 py-1 text-xs font-medium">{interest}</Badge>
              )) : (
                <p className="text-xs text-muted-foreground italic">No interests selected yet</p>
              )}
            </div>
          </div>

          <div className="rounded-xl bg-muted p-4">
            <p className="text-xs font-medium text-muted-foreground mb-1">Your icebreaker</p>
            <p className="text-sm text-foreground leading-relaxed italic">"{icebreaker}"</p>
          </div>
        </div>
      </div>

      {/* Edit dialog */}
      <Dialog open={editing} onOpenChange={setEditing}>
        <DialogContent className="max-w-sm rounded-2xl max-h-[85vh] overflow-y-auto">
          <DialogTitle className="font-display text-lg font-bold">Edit Profile</DialogTitle>
          <div className="space-y-4">
            <div>
              <Label>Display Name</Label>
              <Input value={editForm.display_name} onChange={(e) => setEditForm((p) => ({ ...p, display_name: e.target.value }))} placeholder="Your name" />
            </div>
            <div>
              <Label>Username</Label>
              <Input value={editForm.username} onChange={(e) => setEditForm((p) => ({ ...p, username: e.target.value }))} placeholder="@username" />
            </div>
            <div>
              <Label>Location</Label>
              <div className="flex gap-2">
                <Input value={editForm.location} onChange={(e) => setEditForm((p) => ({ ...p, location: e.target.value }))} placeholder="County, Country" className="flex-1" />
                <Button variant="outline" size="icon" onClick={detectLocation} disabled={detectingLocation} title="Auto-detect location">
                  {detectingLocation ? <Loader2 className="h-4 w-4 animate-spin" /> : <Navigation className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Interests */}
            <div>
              <Label>Interests ({editInterests.length}/10)</Label>
              <div className="flex flex-wrap gap-1.5 mt-2 max-h-40 overflow-y-auto">
                {ALL_INTERESTS.map((interest) => {
                  const selected = editInterests.includes(interest);
                  return (
                    <button
                      key={interest}
                      onClick={() => toggleEditInterest(interest)}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                        selected
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground border border-border hover:bg-muted/80"
                      }`}
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Icebreaker */}
            <div>
              <Label>Icebreaker</Label>
              <p className="text-[11px] text-muted-foreground mb-1">Answer a prompt so others can start a real conversation</p>
              <div className="space-y-1.5 mb-2">
                {ICEBREAKER_PROMPTS.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => setEditForm((p) => ({ ...p, icebreaker: prompt + " " }))}
                    className="w-full rounded-lg p-2 text-left text-xs bg-muted text-foreground hover:bg-muted/80 transition-colors border border-border"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
              <Textarea
                value={editForm.icebreaker}
                onChange={(e) => setEditForm((p) => ({ ...p, icebreaker: e.target.value }))}
                placeholder="Write your icebreaker answer..."
                maxLength={200}
                className="min-h-[80px] resize-none text-sm"
              />
              <p className="text-right text-[10px] text-muted-foreground mt-1">{editForm.icebreaker.length}/200</p>
            </div>

            <Button onClick={saveProfile} disabled={saving} className="w-full rounded-full">
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
