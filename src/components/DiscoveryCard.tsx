import { Heart, X, MapPin, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DiscoveryCardProps {
  name: string;
  age: number;
  distance: string;
  photo: string;
  icebreaker: string;
  sharedInterests: string[];
  onLike: () => void;
  onPass: () => void;
}

const DiscoveryCard = ({
  name,
  age,
  distance,
  photo,
  icebreaker,
  sharedInterests,
  onLike,
  onPass,
}: DiscoveryCardProps) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-soft)] transition-all">
      {/* Photo */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={photo}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />
        
        {/* Info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="flex items-end justify-between">
            <div>
              <h3 className="font-display text-2xl font-semibold text-primary-foreground">
                {name}, {age}
              </h3>
              <div className="mt-1 flex items-center gap-1 text-sm text-primary-foreground/80">
                <MapPin className="h-3.5 w-3.5" />
                <span>{distance}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Shared interests */}
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-accent shrink-0" />
          <span className="text-xs font-medium text-muted-foreground">Why you might connect</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {sharedInterests.map((interest) => (
            <Badge
              key={interest}
              variant="secondary"
              className="rounded-full bg-sage px-3 py-1 text-xs font-medium text-sage-foreground"
            >
              {interest}
            </Badge>
          ))}
        </div>

        {/* Icebreaker */}
        <div className="rounded-xl bg-peach p-4">
          <p className="text-xs font-medium text-peach-foreground/70 mb-1">Their icebreaker</p>
          <p className="text-sm text-peach-foreground leading-relaxed italic">"{icebreaker}"</p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-4 pt-2">
          <Button
            onClick={onPass}
            variant="outline"
            size="icon"
            className="h-14 w-14 rounded-full border-2 border-muted-foreground/20 text-muted-foreground hover:border-destructive hover:text-destructive transition-colors"
          >
            <X className="h-6 w-6" />
          </Button>
          <Button
            onClick={onLike}
            size="icon"
            className="h-16 w-16 rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-105 transition-transform"
          >
            <Heart className="h-7 w-7" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DiscoveryCard;
