import { useState, useEffect } from "react";
import SwipeCard from "@/components/SwipeCard";
import PostCard from "@/components/PostCard";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const MOCK_PROFILES = [
  {
    id: 1,
    name: "Amara",
    age: 26,
    distance: "3 km away",
    photo: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=800&fit=crop&crop=face",
    icebreaker: "A stranger's dog sat next to me on a bench today and it made my whole week.",
    sharedInterests: ["Hiking", "Coffee", "Photography"],
  },
  {
    id: 2,
    name: "Jordan",
    age: 29,
    distance: "7 km away",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop&crop=face",
    icebreaker: "Found a tiny bookshop yesterday that smelled like cedar. Bought 3 books I didn't need.",
    sharedInterests: ["Books", "Jazz", "Walks"],
  },
  {
    id: 3,
    name: "Lena",
    age: 24,
    distance: "12 km away",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=800&fit=crop&crop=face",
    icebreaker: "My morning ritual is making pour-over coffee while listening to lo-fi. Simple joy.",
    sharedInterests: ["Music", "Yoga", "Cooking"],
  },
  {
    id: 4,
    name: "Kai",
    age: 27,
    distance: "5 km away",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=800&fit=crop&crop=face",
    icebreaker: "I learned to make the perfect omelette today. Small wins matter.",
    sharedInterests: ["Cooking", "Fitness", "Travel"],
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
  },
  {
    id: "mock-2",
    user: "Jordan",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=300&fit=crop",
    text: "Current read: 'The Art of Stillness'. Highly recommend for overthinkers like me 📖",
    time: "4h ago",
  },
  {
    id: "mock-3",
    user: "Lena",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop",
    text: "Pour-over mornings are a ritual, not a routine. Who else is a coffee nerd? ☕",
    time: "5h ago",
  },
  {
    id: "mock-4",
    user: "Kai",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face",
    image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=400&h=300&fit=crop",
    text: "Morning run through the park. The city is beautiful at 6am when nobody's around.",
    time: "6h ago",
  },
  {
    id: "mock-5",
    user: "Amara",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&crop=face",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop",
    text: "Made jollof rice for the first time. Verdict: my grandma would be proud 🍚",
    time: "8h ago",
  },
  {
    id: "mock-6",
    user: "Lena",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
    text: "Sunset yoga on the rooftop. This is what peace looks like 🧘‍♀️",
    time: "10h ago",
  },
];

interface Comment {
  id: string;
  text: string;
  created_at: string;
  profiles: { display_name: string | null; avatar_url: string | null } | null;
}

const Discover = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likesLeft, setLikesLeft] = useState(5);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const { user } = useAuth();
  const navigate = useNavigate();

  const currentProfile = MOCK_PROFILES[currentIndex];

  const handleNext = () => {
    if (currentIndex < MOCK_PROFILES.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      setCurrentIndex(-1);
    }
  };

  const handleLike = () => {
    if (likesLeft <= 0) {
      toast("No likes left today", { description: "Upgrade to Premium for unlimited likes ✨" });
      return;
    }
    setLikesLeft((l) => l - 1);
    toast("💚 Liked!", { description: `You liked ${currentProfile.name}` });
    handleNext();
  };

  const handlePass = () => handleNext();

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
            <p className="mt-0.5 text-xs text-muted-foreground">
              {currentIndex >= 0 ? `${MOCK_PROFILES.length - currentIndex} people nearby` : "Check out the community"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {!user && (
              <button
                onClick={() => navigate("/auth")}
                className="rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
              >
                Sign In
              </button>
            )}
            <div className="flex items-center gap-1.5 rounded-full bg-sage px-3 py-1.5">
              <span className="text-xs font-semibold text-sage-foreground">{likesLeft} likes left</span>
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal profiles */}
      <div className="px-4 pb-5">
        <p className="text-xs font-semibold text-muted-foreground mb-3 px-1">People nearby</p>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {MOCK_PROFILES.map((profile, i) => (
            <button
              key={profile.id}
              onClick={() => { if (i !== currentIndex) setCurrentIndex(i); }}
              className={`shrink-0 flex flex-col items-center gap-1.5 ${i === currentIndex ? "opacity-100" : "opacity-70"}`}
            >
              <div className={`h-16 w-16 overflow-hidden rounded-full ring-2 ${i === currentIndex ? "ring-primary" : "ring-border"}`}>
                <img src={profile.photo} alt={profile.name} className="h-full w-full object-cover" />
              </div>
              <span className="text-[11px] font-medium text-foreground">{profile.name}</span>
              <span className="text-[10px] text-muted-foreground">{profile.distance}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Active card */}
      {currentIndex >= 0 && currentProfile && (
        <div className="px-4 pb-6">
          <SwipeCard
            key={currentProfile.id}
            {...currentProfile}
            onLike={handleLike}
            onPass={handlePass}
          />
        </div>
      )}

      {currentIndex < 0 && (
        <div className="mx-4 mb-6 flex flex-col items-center justify-center rounded-2xl bg-card p-8 text-center shadow-[var(--shadow-soft)]">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-sage">
            <span className="text-xl">🌿</span>
          </div>
          <h3 className="font-display text-lg font-semibold text-foreground">All caught up!</h3>
          <p className="mt-1 text-sm text-muted-foreground">New people tomorrow. Enjoy the posts below.</p>
        </div>
      )}

      {/* Community posts feed */}
      <div className="px-4">
        <p className="text-xs font-semibold text-muted-foreground px-1 mb-3">Community posts</p>
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
          {MOCK_POSTS.map((post) => (
            <PostCard
              key={post.id}
              id={post.id}
              user={post.user}
              avatar={post.avatar}
              image={post.image}
              text={post.text}
              likesCount={(likedPosts.has(post.id) ? 1 : 0) + Math.floor(Math.random() * 30 + 10)}
              commentsCount={(comments[post.id]?.length || 0)}
              isLiked={likedPosts.has(post.id)}
              time={post.time}
              comments={comments[post.id] || []}
              onToggleLike={() => togglePostLike(post.id)}
              onAddComment={(text) => addComment(post.id, text)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Discover;
