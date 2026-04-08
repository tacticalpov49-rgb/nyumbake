import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ChatPreview from "@/components/ChatPreview";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface ChatThread {
  id: string;
  otherUserId: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: boolean;
}

const Chats = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [chats, setChats] = useState<ChatThread[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchChats = useCallback(async () => {
    if (!user) { setLoading(false); return; }

    // Get all messages where user is sender or receiver
    const { data: messages } = await supabase
      .from("messages" as any)
      .select("*")
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order("created_at", { ascending: false }) as any;

    if (!messages || messages.length === 0) {
      setChats([]);
      setLoading(false);
      return;
    }

    // Group by other user
    const threadMap: Record<string, any> = {};
    messages.forEach((msg: any) => {
      const otherId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
      if (!threadMap[otherId]) {
        threadMap[otherId] = {
          otherUserId: otherId,
          lastMessage: msg.text,
          time: msg.created_at,
          unread: msg.receiver_id === user.id && !msg.read,
        };
      }
    });

    const otherIds = Object.keys(threadMap);
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, display_name, avatar_url, username")
      .in("user_id", otherIds);

    const profileMap: Record<string, any> = {};
    profiles?.forEach((p: any) => { profileMap[p.user_id] = p; });

    const threads: ChatThread[] = otherIds.map((otherId) => {
      const t = threadMap[otherId];
      const p = profileMap[otherId];
      const diff = Date.now() - new Date(t.time).getTime();
      const mins = Math.floor(diff / 60000);
      let timeStr = `${mins}m ago`;
      if (mins >= 60) {
        const hrs = Math.floor(mins / 60);
        timeStr = hrs < 24 ? `${hrs}h ago` : `${Math.floor(hrs / 24)}d ago`;
      }
      return {
        id: otherId,
        otherUserId: otherId,
        name: p?.display_name || p?.username || "User",
        avatar: p?.avatar_url || "",
        lastMessage: t.lastMessage,
        time: timeStr,
        unread: t.unread,
      };
    });

    setChats(threads);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchChats(); }, [fetchChats]);

  // Realtime subscription
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("chat-list")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, () => {
        fetchChats();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, fetchChats]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background pb-24 pt-4 flex flex-col items-center justify-center px-6">
        <div className="text-center">
          <div className="mb-4 flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-muted">
            <span className="text-2xl">💬</span>
          </div>
          <h2 className="font-display text-xl font-bold text-foreground mb-2">Your Chats</h2>
          <p className="text-sm text-muted-foreground mb-6">Sign in to start messaging</p>
          <button onClick={() => navigate("/auth")} className="rounded-full bg-primary px-8 py-2.5 text-sm font-semibold text-primary-foreground">
            Sign In / Sign Up
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24 pt-4">
      <div className="px-5 pb-2">
        <h1 className="font-display text-2xl font-bold text-foreground">Chats</h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {loading ? "Loading..." : `${chats.length} conversation${chats.length !== 1 ? "s" : ""}`}
        </p>
      </div>

      <div className="px-3 mt-2 space-y-1">
        {chats.length === 0 && !loading && (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-sm">No conversations yet. Send a friend request to start chatting!</p>
          </div>
        )}
        {chats.map((chat) => (
          <ChatPreview
            key={chat.id}
            name={chat.name}
            avatar={chat.avatar}
            lastMessage={chat.lastMessage}
            time={chat.time}
            unread={chat.unread}
            onClick={() => navigate(`/chat/${chat.otherUserId}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default Chats;
