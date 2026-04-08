import { Heart, UserPlus, MessageCircle } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const MOCK_ALERTS = [
  { id: 1, type: "friend_request", name: "Amara", avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop&crop=face", time: "2m ago" },
  { id: 2, type: "like", name: "Jordan", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face", time: "15m ago", detail: "liked your post" },
  { id: 3, type: "comment", name: "Lena", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face", time: "1h ago", detail: "commented on your post" },
  { id: 4, type: "friend_request", name: "Kai", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face", time: "3h ago" },
];

const iconMap = {
  friend_request: UserPlus,
  like: Heart,
  comment: MessageCircle,
};

const Alerts = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen bg-background pb-24 pt-4 flex flex-col items-center justify-center px-6">
        <div className="text-center">
          <div className="mb-4 flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-muted">
            <UserPlus className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="font-display text-xl font-bold text-foreground mb-2">Stay Connected</h2>
          <p className="text-sm text-muted-foreground mb-6">Sign in to see friend requests and notifications</p>
          <Button onClick={() => navigate("/auth")} className="rounded-full px-8">Sign In / Sign Up</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24 pt-4">
      <div className="px-5 pb-4">
        <h1 className="font-display text-2xl font-bold text-foreground">Notifications</h1>
        <p className="mt-0.5 text-xs text-muted-foreground">Friend requests & activity</p>
      </div>

      <div className="mx-4 space-y-2">
        {MOCK_ALERTS.map((alert) => {
          const Icon = iconMap[alert.type as keyof typeof iconMap];
          return (
            <div key={alert.id} className="flex items-center gap-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarImage src={alert.avatar} />
                <AvatarFallback>{alert.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">
                  <span className="font-semibold">{alert.name}</span>{" "}
                  {alert.type === "friend_request" ? "sent you a friend request" : alert.detail}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{alert.time}</p>
              </div>
              {alert.type === "friend_request" ? (
                <div className="flex gap-1.5 shrink-0">
                  <Button
                    size="sm"
                    className="rounded-full h-8 px-3 text-xs"
                    onClick={() => toast.success(`Accepted ${alert.name}'s request!`)}
                  >
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full h-8 px-3 text-xs"
                    onClick={() => toast("Request declined")}
                  >
                    Decline
                  </Button>
                </div>
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted shrink-0">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Alerts;
