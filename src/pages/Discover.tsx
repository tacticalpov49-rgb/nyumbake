import { useState } from "react";
import DiscoveryCard from "@/components/DiscoveryCard";
import { toast } from "sonner";

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
];

const Discover = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likesLeft, setLikesLeft] = useState(5);

  const currentProfile = MOCK_PROFILES[currentIndex];

  const handleNext = () => {
    if (currentIndex < MOCK_PROFILES.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      setCurrentIndex(-1); // No more profiles
    }
  };

  const handleLike = () => {
    if (likesLeft <= 0) {
      toast("No likes left today", {
        description: "Upgrade to Premium for unlimited likes ✨",
      });
      return;
    }
    setLikesLeft((l) => l - 1);
    toast("💚 Liked!", { description: `You liked ${currentProfile.name}` });
    handleNext();
  };

  const handlePass = () => {
    handleNext();
  };

  return (
    <div className="min-h-screen bg-background pb-24 pt-4">
      {/* Header */}
      <div className="px-5 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Discover</h1>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {currentIndex >= 0 ? `${MOCK_PROFILES.length - currentIndex} people nearby` : "Come back tomorrow!"}
            </p>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-sage px-3 py-1.5">
            <span className="text-xs font-semibold text-sage-foreground">{likesLeft} likes left</span>
          </div>
        </div>
      </div>

      {/* Card */}
      <div className="px-4">
        {currentIndex >= 0 && currentProfile ? (
          <DiscoveryCard
            key={currentProfile.id}
            {...currentProfile}
            onLike={handleLike}
            onPass={handlePass}
          />
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl bg-card p-12 text-center shadow-[var(--shadow-soft)]">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sage">
              <span className="text-2xl">🌿</span>
            </div>
            <h3 className="font-display text-lg font-semibold text-foreground">All caught up!</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              New people will appear tomorrow. Quality over quantity.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Discover;
