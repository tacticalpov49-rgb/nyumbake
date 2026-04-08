import { useState } from "react";
import { Heart, MessageCircle, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Comment {
  id: string;
  text: string;
  created_at: string;
  profiles: { display_name: string | null; avatar_url: string | null } | null;
}

interface PostCardProps {
  id: string;
  user: string;
  avatar: string;
  image: string | null;
  text: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  time: string;
  comments: Comment[];
  onToggleLike: () => void;
  onAddComment: (text: string) => void;
}

const PostCard = ({
  id,
  user,
  avatar,
  image,
  text,
  likesCount,
  commentsCount,
  isLiked,
  time,
  comments,
  onToggleLike,
  onAddComment,
}: PostCardProps) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");

  const handleSubmitComment = () => {
    if (!commentText.trim()) return;
    onAddComment(commentText.trim());
    setCommentText("");
  };

  return (
    <div className="w-full rounded-2xl bg-card overflow-hidden shadow-[var(--shadow-card)]">
      <div className="flex items-center gap-2.5 p-3 pb-2">
        <img src={avatar} alt={user} className="h-8 w-8 rounded-full object-cover ring-1 ring-border" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">{user}</p>
          <p className="text-[10px] text-muted-foreground">{time}</p>
        </div>
      </div>
      {image && <img src={image} alt="" className="w-full aspect-[4/3] object-cover" />}
      <div className="p-3 space-y-2">
        <p className="text-sm text-foreground leading-relaxed line-clamp-2">{text}</p>
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleLike}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            <Heart className={`h-4 w-4 ${isLiked ? "fill-primary text-primary" : ""}`} />
            <span>{likesCount}</span>
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            <span>{commentsCount}</span>
          </button>
        </div>

        {showComments && (
          <div className="pt-2 border-t border-border space-y-2">
            {comments.map((c) => (
              <div key={c.id} className="text-xs">
                <span className="font-semibold text-foreground">{c.profiles?.display_name || "User"}</span>{" "}
                <span className="text-muted-foreground">{c.text}</span>
              </div>
            ))}
            <div className="flex gap-1.5">
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmitComment()}
                placeholder="Add a comment..."
                className="flex-1 rounded-lg border border-input bg-background px-2 py-1 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
              <button onClick={handleSubmitComment} className="text-primary">
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;
