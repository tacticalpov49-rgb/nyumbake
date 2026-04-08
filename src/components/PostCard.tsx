import { useState } from "react";
import { Heart, MessageCircle, Send } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
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
  onExpandComments?: () => void;
}

const PostCard = ({
  id, user, avatar, image, text, likesCount, commentsCount, isLiked, time, comments, onToggleLike, onAddComment, onExpandComments,
}: PostCardProps) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const { user: authUser } = useAuth();
  const navigate = useNavigate();

  const handleToggleComments = () => {
    const next = !showComments;
    setShowComments(next);
    if (next && onExpandComments) onExpandComments();
  };

  const handleLike = () => {
    if (!authUser) {
      toast("Sign in to like posts");
      navigate("/auth");
      return;
    }
    onToggleLike();
  };

  const handleSubmitComment = () => {
    if (!authUser) {
      toast("Sign in to comment");
      navigate("/auth");
      return;
    }
    if (!commentText.trim()) return;
    onAddComment(commentText.trim());
    setCommentText("");
  };

  return (
    <div className="w-full rounded-2xl bg-card overflow-hidden shadow-[var(--shadow-card)]">
      <div className="flex items-center gap-2.5 p-3 pb-2">
        <Avatar className="h-8 w-8">
          {avatar ? <AvatarImage src={avatar} /> : null}
          <AvatarFallback className="text-xs bg-primary/10 text-primary">{user[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">{user}</p>
          <p className="text-[10px] text-muted-foreground">{time}</p>
        </div>
      </div>
      {image && <img src={image} alt="" className="w-full aspect-[4/3] object-cover" />}
      <div className="p-3 space-y-2">
        <p className="text-sm text-foreground leading-relaxed">{text}</p>
        <div className="flex items-center gap-4">
          <button onClick={handleLike} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
            <Heart className={`h-4 w-4 ${isLiked ? "fill-primary text-primary" : ""}`} />
            <span>{likesCount}</span>
          </button>
          <button onClick={handleToggleComments} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
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
                placeholder={authUser ? "Add a comment..." : "Sign in to comment..."}
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
