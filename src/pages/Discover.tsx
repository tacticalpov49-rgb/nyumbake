import { useState } from "react";
import SwipeCard from "@/components/SwipeCard";
import { toast } from "sonner";
import { Heart, MapPin, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
    id: 1,
    user: "Amara",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&crop=face",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=300&fit=crop",
    text: "Explored a hidden waterfall today. Nature always heals. 🌿",
    likes: 24,
    comments: 5,
    time: "2h ago",
  },
  {
    id: 2,
    user: "Jordan",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=300&fit=crop",
    text: "Current read: 'The Art of Stillness'. Highly recommend for overthinkers like me 📖",
    likes: 18,
    comments: 8,
    time: "4h ago",
  },
  {
    id: 3,
    user: "Lena",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop",
    text: "Pour-over mornings are a ritual, not a routine. Who else is a coffee nerd? ☕",
    likes: 31,
    comments: 12,
    time: "5h ago",
  },
  {
    id: 4,
    user: "Kai",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face",
    image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=400&h=300&fit=crop",
    text: "Morning run through the park. The city is beautiful at 6am when nobody's around.",
    likes: 15,
    comments: 3,
    time: "6h ago",
  },
  {
    id: 5,
    user: "Amara",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&crop=face",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop",
    text: "Made jollof rice for the first time. Verdict: my grandma would be proud 🍚",
    likes: 42,
    comments: 15,
    time: "8h ago",
  },
  {
    id: 6,
    user: "Lena",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
    text: "Sunset yoga on the rooftop. This is what peace looks like 🧘‍♀️",
    likes: 27,
    comments: 7,
    time: "10h ago",
  },
];

const Discover = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likesLeft, setLikesLeft] = useState(5);
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());

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

  const togglePostLike = (postId: number) => {
    setLikedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId);
      else next.add(postId);
      return next;
    });
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
          <div className="flex items-center gap-1.5 rounded-full bg-sage px-3 py-1.5">
            <span className="text-xs font-semibold text-sage-foreground">{likesLeft} likes left</span>
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
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
          {MOCK_POSTS.map((post) => (
            <div key={post.id} className="shrink-0 w-64 rounded-2xl bg-card overflow-hidden shadow-[var(--shadow-card)]">
              <div className="flex items-center gap-2.5 p-3 pb-2">
                <img src={post.avatar} alt={post.user} className="h-8 w-8 rounded-full object-cover ring-1 ring-border" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{post.user}</p>
                  <p className="text-[10px] text-muted-foreground">{post.time}</p>
                </div>
              </div>
              <img src={post.image} alt="" className="w-full aspect-[4/3] object-cover" />
              <div className="p-3 space-y-2">
                <p className="text-sm text-foreground leading-relaxed line-clamp-2">{post.text}</p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => togglePostLike(post.id)}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Heart className={`h-4 w-4 ${likedPosts.has(post.id) ? "fill-primary text-primary" : ""}`} />
                    <span>{post.likes + (likedPosts.has(post.id) ? 1 : 0)}</span>
                  </button>
                  <button className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MessageCircle className="h-4 w-4" />
                    <span>{post.comments}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Discover;
