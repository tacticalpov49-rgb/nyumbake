import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Mail, Lock, User, ArrowLeft, Camera, Loader2 } from "lucide-react";

const ALL_INTERESTS = [
  "Hiking", "Coffee", "Photography", "Books", "Jazz", "Cooking",
  "Music", "Yoga", "Travel", "Gaming", "Art", "Fitness",
  "Movies", "Dogs", "Cats", "Nature", "Dancing", "Writing",
  "Football", "Basketball", "Tennis", "Swimming", "Running",
  "Tech", "Entrepreneurship", "Design", "Finance",
  "Painting", "Singing", "Fashion", "Meditation", "Podcasts",
];

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  // Signup extras
  const [signupStep, setSignupStep] = useState(0); // 0 = credentials, 1 = photo & interests
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) { toast.error("Select a JPG, PNG, or WebP image"); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be under 5MB"); return; }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : prev.length < 5 ? [...prev, interest] : prev
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSignUp && signupStep === 0) {
      if (!email || !password || !displayName) { toast.error("Fill in all fields"); return; }
      setSignupStep(1);
      return;
    }

    setLoading(true);

    if (isSignUp) {
      const { error } = await signUp(email, password, { display_name: displayName });
      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      // Upload avatar and save interests after signup
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const userId = session.user.id;

        // Upload avatar if selected
        if (avatarFile) {
          try {
            const ext = avatarFile.name.split(".").pop();
            const path = `${userId}/avatar.${ext}`;
            await supabase.storage.from("avatars").upload(path, avatarFile, { upsert: true });
            const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
            await supabase.from("profiles").update({ avatar_url: urlData.publicUrl } as any).eq("user_id", userId);
          } catch {}
        }

        // Save interests
        if (selectedInterests.length > 0) {
          await supabase.from("profiles").update({ interests: selectedInterests } as any).eq("user_id", userId);
        }
      }

      toast.success("Account created! You can start exploring.");
      navigate("/");
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        toast.error(error.message);
      } else {
        navigate("/");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="px-5 pt-4 pb-2">
        <button onClick={() => {
          if (isSignUp && signupStep === 1) { setSignupStep(0); return; }
          navigate(-1);
        }} className="text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-center px-6 pb-20">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground">
            {isSignUp ? (signupStep === 0 ? "Create Account" : "Complete Profile") : "Welcome Back"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isSignUp ? (signupStep === 0 ? "Join the community 🌿" : "Add a photo and pick interests") : "Sign in to continue"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && signupStep === 0 && (
            <>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Display name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                  className="w-full rounded-xl border border-input bg-card py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required
                  className="w-full rounded-xl border border-input bg-card py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type="password" placeholder="Password (min 6 chars)" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
                  className="w-full rounded-xl border border-input bg-card py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </>
          )}

          {isSignUp && signupStep === 1 && (
            <>
              {/* Profile photo */}
              <div className="flex flex-col items-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-dashed border-border bg-muted hover:border-primary transition-colors"
                >
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <Camera className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </button>
                <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleAvatarSelect} className="hidden" />
                <p className="text-xs text-muted-foreground">{avatarPreview ? "Tap to change" : "Add profile photo"}</p>
              </div>

              {/* Interests */}
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Pick your interests ({selectedInterests.length}/5)</p>
                <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto">
                  {ALL_INTERESTS.map((interest) => {
                    const selected = selectedInterests.includes(interest);
                    return (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                          selected
                            ? "bg-primary text-primary-foreground"
                            : "bg-card text-foreground border border-border hover:bg-muted"
                        }`}
                      >
                        {interest}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {!isSignUp && (
            <>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required
                  className="w-full rounded-xl border border-input bg-card py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
                  className="w-full rounded-xl border border-input bg-card py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </>
          )}

          <Button type="submit" className="w-full rounded-xl py-3 text-sm font-semibold" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {loading ? "Please wait..." : isSignUp ? (signupStep === 0 ? "Next" : "Create Account") : "Sign In"}
          </Button>
        </form>

        {(!isSignUp || signupStep === 0) && (
          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button onClick={() => { setIsSignUp(!isSignUp); setSignupStep(0); }} className="font-semibold text-primary">
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </p>
        )}

        {isSignUp && signupStep === 1 && (
          <button onClick={() => { setSignupStep(0); }} className="mt-4 text-center text-xs text-muted-foreground underline">
            Back to credentials
          </button>
        )}
      </div>
    </div>
  );
};

export default Auth;
