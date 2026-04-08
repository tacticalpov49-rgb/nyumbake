import { useEffect, useState, useCallback } from "react";
import { Heart, UserPlus, MessageCircle, Check, X, Trash2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Notification {
  id: string;
  user_id: string;
  type: string;
  from_user_id: string | null;
  post_id: string | null;
  message: string;
  read: boolean;
  created_at: string;
  from_profile?: {
    display_name: string | null;
    avatar_url: string | null;
  };
}

const iconMap: Record<string, typeof Heart> = {
  friend_request: UserPlus,
  like: Heart,
  comment: MessageCircle,
};

const Alerts = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching notifications:", error);
      setLoading(false);
      return;
    }

    // Fetch profiles for from_user_ids
    const fromIds = [...new Set((data || []).map((n) => n.from_user_id).filter(Boolean))] as string[];
    let profileMap: Record<string, { display_name: string | null; avatar_url: string | null }> = {};

    if (fromIds.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name, avatar_url")
        .in("user_id", fromIds);

      if (profiles) {
        profileMap = Object.fromEntries(profiles.map((p) => [p.user_id, p]));
      }
    }

    setNotifications(
      (data || []).map((n) => ({
        ...n,
        from_profile: n.from_user_id ? profileMap[n.from_user_id] : undefined,
      }))
    );
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Realtime subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("notifications-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` },
        () => {
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchNotifications]);

  const handleAcceptRequest = async (notification: Notification) => {
    if (!notification.from_user_id) return;

    // Update the match status to accepted
    const { error } = await supabase
      .from("matches")
      .update({ status: "accepted" })
      .or(`and(user1_id.eq.${notification.from_user_id},user2_id.eq.${user!.id}),and(user1_id.eq.${user!.id},user2_id.eq.${notification.from_user_id})`)
      .eq("status", "pending");

    if (!error) {
      // Mark notification as read
      await supabase.from("notifications").update({ read: true }).eq("id", notification.id);
      toast.success(`Accepted ${notification.from_profile?.display_name || "user"}'s request!`);
      fetchNotifications();
    } else {
      toast.error("Failed to accept request");
    }
  };

  const handleDeclineRequest = async (notification: Notification) => {
    if (!notification.from_user_id) return;

    const { error } = await supabase
      .from("matches")
      .update({ status: "declined" })
      .or(`and(user1_id.eq.${notification.from_user_id},user2_id.eq.${user!.id}),and(user1_id.eq.${user!.id},user2_id.eq.${notification.from_user_id})`)
      .eq("status", "pending");

    if (!error) {
      await supabase.from("notifications").update({ read: true }).eq("id", notification.id);
      toast("Request declined");
      fetchNotifications();
    }
  };

  const handleDeleteNotification = async (id: string) => {
    await supabase.from("notifications").delete().eq("id", id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

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
        {loading ? (
          <div className="text-center py-12 text-muted-foreground text-sm">Loading...</div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="mb-3 flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-muted">
              <Check className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">You're all caught up!</p>
          </div>
        ) : (
          notifications.map((notification) => {
            const Icon = iconMap[notification.type] || MessageCircle;
            const name = notification.from_profile?.display_name || "Someone";
            const avatar = notification.from_profile?.avatar_url;

            return (
              <div
                key={notification.id}
                className={`flex items-center gap-3 rounded-2xl p-4 shadow-[var(--shadow-card)] ${
                  notification.read ? "bg-card opacity-70" : "bg-card"
                }`}
              >
                <Avatar className="h-10 w-10 shrink-0">
                  {avatar && <AvatarImage src={avatar} />}
                  <AvatarFallback>{name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">
                    <span className="font-semibold">{name}</span>{" "}
                    {notification.message}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{timeAgo(notification.created_at)}</p>
                </div>
                {notification.type === "friend_request" && !notification.read ? (
                  <div className="flex gap-1.5 shrink-0">
                    <Button
                      size="sm"
                      className="rounded-full h-8 px-3 text-xs"
                      onClick={() => handleAcceptRequest(notification)}
                    >
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full h-8 px-3 text-xs"
                      onClick={() => handleDeclineRequest(notification)}
                    >
                      Decline
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 shrink-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <button
                      onClick={() => handleDeleteNotification(notification.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Alerts;
