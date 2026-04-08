import { Camera, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const INTERESTS = ["Hiking", "Coffee", "Photography", "Books", "Jazz", "Cooking"];

const Profile = () => {
  return (
    <div className="min-h-screen bg-background pb-24 pt-4">
      <div className="px-5 pb-4">
        <h1 className="font-display text-2xl font-bold text-foreground">Profile</h1>
      </div>

      {/* Profile card */}
      <div className="mx-4 overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-soft)]">
        {/* Photo */}
        <div className="relative aspect-square max-h-72">
          <img
            src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=600&fit=crop&crop=face"
            alt="Your profile"
            className="h-full w-full object-cover"
          />
          <button className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm shadow-md">
            <Camera className="h-5 w-5 text-foreground" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-bold text-foreground">Kira, 27</h2>
              <p className="text-sm text-muted-foreground">Nairobi, Kenya</p>
            </div>
            <Button variant="outline" size="sm" className="gap-1.5 rounded-full">
              <Edit2 className="h-3.5 w-3.5" />
              Edit
            </Button>
          </div>

          {/* Interests */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Your interests</p>
            <div className="flex flex-wrap gap-1.5">
              {INTERESTS.map((interest) => (
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

          {/* Icebreaker */}
          <div className="rounded-xl bg-peach p-4">
            <p className="text-xs font-medium text-peach-foreground/70 mb-1">Your icebreaker</p>
            <p className="text-sm text-peach-foreground leading-relaxed italic">
              "Sunsets from my balcony with a warm cup of chai — that's my happy place."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
