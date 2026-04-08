import { useState, useRef, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  sender_id: string;
  text: string;
  created_at: string;
}

const ChatConversation = () => {
  const { chatId: otherUserId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [otherProfile, setOtherProfile] = useState<{ display_name: string | null; avatar_url: string | null; username: string | null } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }), 50);
  };

  // Fetch other user's profile
  useEffect(() => {
    if (!otherUserId) return;
    supabase.from("profiles").select("display_name, avatar_url, username").eq("user_id", otherUserId).single().then(({ data }: any) => {
      if (data) setOtherProfile(data);
    });
  }, [otherUserId]);

  // Fetch messages
  const fetchMessages = useCallback(async () => {
    if (!user || !otherUserId) return;
    const { data } = await supabase
      .from("messages" as any)
      .select("*")
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`)
      .order("created_at", { ascending: true }) as any;
    if (data) {
      setMessages(data);
      scrollToBottom();
      // Mark unread messages as read
      await supabase
        .from("messages" as any)
        .update({ read: true } as any)
        .eq("sender_id", otherUserId)
        .eq("receiver_id", user.id)
        .eq("read", false);
    }
  }, [user, otherUserId]);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  // Realtime subscription
  useEffect(() => {
    if (!user || !otherUserId) return;
    const channel = supabase
      .channel(`chat-${otherUserId}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "messages",
      }, (payload: any) => {
        const msg = payload.new;
        if (
          (msg.sender_id === user.id && msg.receiver_id === otherUserId) ||
          (msg.sender_id === otherUserId && msg.receiver_id === user.id)
        ) {
          setMessages((prev) => [...prev, msg]);
          scrollToBottom();
          // Mark as read if received
          if (msg.sender_id === otherUserId) {
            supabase.from("messages" as any).update({ read: true } as any).eq("id", msg.id);
          }
        }
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, otherUserId]);

  const handleSend = async () => {
    if (!input.trim() || !user || !otherUserId) return;
    const text = input.trim();
    setInput("");
    await supabase.from("messages" as any).insert({
      sender_id: user.id,
      receiver_id: otherUserId,
      text,
    } as any);
  };

  if (!user) {
    navigate("/auth");
    return null;
  }

  const otherName = otherProfile?.display_name || otherProfile?.username || "User";

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <button onClick={() => navigate("/chats")} className="text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <Avatar className="h-9 w-9">
          {otherProfile?.avatar_url ? <AvatarImage src={otherProfile.avatar_url} /> : null}
          <AvatarFallback className="text-xs bg-primary/10 text-primary">{otherName[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-semibold text-foreground">{otherName}</p>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-12">No messages yet. Say hi! 👋</p>
        )}
        {messages.map((msg) => {
          const isMe = msg.sender_id === user.id;
          return (
            <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                  isMe
                    ? "rounded-br-md bg-primary text-primary-foreground"
                    : "rounded-bl-md bg-card text-foreground shadow-[var(--shadow-card)]"
                }`}
              >
                <p className="text-sm leading-relaxed">{msg.text}</p>
                <p className={`mt-1 text-[10px] ${isMe ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="border-t border-border p-3">
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message..."
            className="flex-1 rounded-full border border-input bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <Button
            onClick={handleSend}
            size="icon"
            className="h-10 w-10 shrink-0 rounded-full bg-primary text-primary-foreground"
            disabled={!input.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatConversation;
