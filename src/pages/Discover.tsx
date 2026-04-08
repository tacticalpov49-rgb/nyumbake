import { useState, useEffect, useMemo } from "react";
import PostCard from "@/components/PostCard";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, User, MapPin, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const FRIEND_SEEKERS = [
  {
    id: 1,
    name: "Amara",
    age: 26,
    distance: "3 km away",
    photo: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=800&fit=crop&crop=face",
    bio: "Love hiking trails and finding hidden coffee spots. Always down for a spontaneous adventure 🌿",
    interests: ["Hiking", "Coffee", "Photography"],
  },
  {
    id: 2,
    name: "Jordan",
    age: 29,
    distance: "7 km away",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop&crop=face",
    bio: "Bookworm who loves jazz bars and long walks. Looking for a friend to explore the city with 📖",
    interests: ["Books", "Jazz", "Walks"],
  },
  {
    id: 3,
    name: "Lena",
    age: 24,
    distance: "12 km away",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=800&fit=crop&crop=face",
    bio: "Yoga teacher and lo-fi enthusiast. Let's grab matcha and talk about life ☕",
    interests: ["Music", "Yoga", "Cooking"],
  },
  {
    id: 4,
    name: "Kai",
    age: 27,
    distance: "5 km away",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=800&fit=crop&crop=face",
    bio: "Fitness nerd who also loves cooking experiments. Seeking a gym buddy or cooking partner 🍳",
    interests: ["Cooking", "Fitness", "Travel"],
  },
  {
    id: 5,
    name: "Nia",
    age: 25,
    distance: "2 km away",
    photo: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=800&fit=crop&crop=face",
    bio: "Artist and plant mom. Let's visit galleries or just chill in the park 🎨",
    interests: ["Art", "Plants", "Music"],
  },
];

const MOCK_POSTS = [
  {
    id: "mock-1",
    user: "Amara",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&crop=face",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=300&fit=crop",
    text: "Explored a hidden waterfall today. Nature always heals. 🌿",
    time: "2h ago",
    baseLikes: 24,
  },
  {
    id: "mock-2",
    user: "Jordan",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=300&fit=crop",
    text: "Current read: 'The Art of Stillness'. Highly recommend for overthinkers like me 📖",
    time: "4h ago",
    baseLikes: 18,
  },
  {
    id: "mock-3",
    user: "Lena",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop",
    text: "Pour-over mornings are a ritual, not a routine. Who else is a coffee nerd? ☕",
    time: "5h ago",
    baseLikes: 31,
  },
  {
    id: "mock-4",
    user: "Kai",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face",
    image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=400&h=300&fit=crop",
    text: "Morning run through the park. The city is beautiful at 6am when nobody's around.",
    time: "6h ago",
    baseLikes: 15,
  },
  {
    id: "mock-5",
    user: "Amara",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&crop=face",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop",
    text: "Made jollof rice for the first time. Verdict: my grandma would be proud 🍚",
    time: "8h ago",
    baseLikes: 42,
  },
  {
    id: "mock-6",
    user: "Nia",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=80&h=80&fit=crop&crop=face",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
    text: "Sunset yoga on the rooftop. This is what peace looks like 🧘‍♀️",
    time: "10h ago",
    baseLikes: 27,
  },
];

interface Comment {
  id: string;
  text: string;
  created_at: string;
  profiles: { display_name: string | null; avatar_url: string | null } | null;
}

const Discover = () => {
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [profile, setProfile] = useState<{ display_name: string | null; avatar_url: string | null; username: string | null } | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<typeof FRIEND_SEEKERS[0] | null>(null);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) { setProfile(null); return; }
    supabase.from("profiles").select("display_name, avatar_url, username").eq("user_id", user.id).single().then(({ data }) => {
      if (data) setProfile(data);
    });
  }, [user]);

  const togglePostLike = (postId: string) => {
    if (!user) {
      toast("Sign in to like posts", { description: "Create an account to interact" });
      navigate("/auth");
      return;
    }
    setLikedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId);
      else next.add(postId);
      return next;
    });
  };

  const addComment = (postId: string, text: string) => {
    if (!user) {
      toast("Sign in to comment", { description: "Create an account to interact" });
      navigate("/auth");
      return;
    }
    const newComment: Comment = {
      id: crypto.randomUUID(),
      text,
      created_at: new Date().toISOString(),
      profiles: { display_name: user.email?.split("@")[0] || "You", avatar_url: null },
    };
    setComments((prev) => ({ ...prev, [postId]: [...(prev[postId] || []), newComment] }));
    toast.success("Comment added!");
  };

  return (
    <div className="min-h-screen bg-background pb-24 pt-4">
      {/* Header */}
      <div className="px-5 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Discover</h1>
            <p className="mt-0.5 text-xs text-muted-foreground">See what's happening around you</p>
          </div>
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Link to="/profile" className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    {profile?.avatar_url ? <AvatarImage src={profile.avatar_url} /> : null}
                    <AvatarFallback className="text-xs bg-primary/10 text-primary">
                      {(profile?.display_name || profile?.username || user.email)?.[0]?.toUpperCase() || <User className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-foreground max-w-[80px] truncate">
                    {profile?.display_name || profile?.username || user.email?.split("@")[0]}
                  </span>
                </Link>
                <button
                  onClick={async () => { await signOut(); toast.success("Signed out"); }}
                  className="rounded-full p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  title="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate("/auth")}
                className="rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>

      {/* People looking for friends — horizontal scroll */}
      <div className="px-4 pb-5">
        <p className="text-xs font-semibold text-muted-foreground mb-3 px-1">People looking for friends</p>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {FRIEND_SEEKERS.map((person) => (
            <button
              key={person.id}
              onClick={() => setSelectedPerson(person)}
              className="shrink-0 flex flex-col items-center gap-1.5"
            >
              <div className="h-16 w-16 overflow-hidden rounded-full ring-2 ring-primary/50 hover:ring-primary transition-all">
                <img src={person.photo} alt={person.name} className="h-full w-full object-cover" />
              </div>
              <span className="text-[11px] font-medium text-foreground">{person.name}</span>
              <span className="text-[10px] text-muted-foreground">{person.distance}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Community posts feed — vertical */}
      <div className="px-4">
        <p className="text-xs font-semibold text-muted-foreground px-1 mb-3">Community posts</p>
        <div className="space-y-4">
          {MOCK_POSTS.map((post) => (
            <PostCard
              key={post.id}
              id={post.id}
              user={post.user}
              avatar={post.avatar}
              image={post.image}
              text={post.text}
              likesCount={post.baseLikes + (likedPosts.has(post.id) ? 1 : 0)}
              commentsCount={comments[post.id]?.length || 0}
              isLiked={likedPosts.has(post.id)}
              time={post.time}
              comments={comments[post.id] || []}
              onToggleLike={() => togglePostLike(post.id)}
              onAddComment={(text) => addComment(post.id, text)}
            />
          ))}
        </div>
      </div>

      {/* Person detail dialog */}
      <Dialog open={!!selectedPerson} onOpenChange={(open) => !open && setSelectedPerson(null)}>
        <DialogContent className="max-w-sm p-0 overflow-hidden rounded-2xl">
          <DialogTitle className="sr-only">{selectedPerson?.name}'s Profile</DialogTitle>
          {selectedPerson && (
            <>
              <div className="relative aspect-[3/4] overflow-hidden">
                <img src={selectedPerson.photo} alt={selectedPerson.name} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="font-display text-2xl font-semibold text-white">{selectedPerson.name}, {selectedPerson.age}</h3>
                  <div className="mt-1 flex items-center gap-1 text-sm text-white/80">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{selectedPerson.distance}</span>
                  </div>
                </div>
              </div>
              <div className="p-5 space-y-4">
                <p className="text-sm text-foreground leading-relaxed">{selectedPerson.bio}</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedPerson.interests.map((interest) => (
                    <Badge key={interest} variant="secondary" className="rounded-full px-3 py-1 text-xs font-medium">
                      {interest}
                    </Badge>
                  ))}
                </div>
                <button
                  onClick={() => {
                    toast.success(`Friend request sent to ${selectedPerson.name}!`);
                    setSelectedPerson(null);
                  }}
                  className="w-full rounded-full bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  Send Friend Request
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Discover;
