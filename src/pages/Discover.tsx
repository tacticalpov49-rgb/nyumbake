import { useState, useEffect, useCallback } from "react";
import PostCard from "@/components/PostCard";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User, MapPin, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const FRIEND_SEEKERS = [
  { id: 1, name: "Amara", age: 26, distance: "3 km away", photo: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=800&fit=crop&crop=face", bio: "Love hiking trails and finding hidden coffee spots 🌿", interests: ["Hiking", "Coffee", "Photography"] },
  { id: 2, name: "Jordan", age: 29, distance: "7 km away", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop&crop=face", bio: "Bookworm who loves jazz bars and long walks 📖", interests: ["Books", "Jazz", "Walks"] },
  { id: 3, name: "Lena", age: 24, distance: "12 km away", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=800&fit=crop&crop=face", bio: "Yoga teacher and lo-fi enthusiast ☕", interests: ["Music", "Yoga", "Cooking"] },
  { id: 4, name: "Kai", age: 27, distance: "5 km away", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=800&fit=crop&crop=face", bio: "Fitness nerd who also loves cooking experiments 🍳", interests: ["Cooking", "Fitness", "Travel"] },
  { id: 5, name: "Nia", age: 25, distance: "2 km away", photo: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=800&fit=crop&crop=face", bio: "Artist and plant mom 🎨", interests: ["Art", "Plants", "Music"] },
];

interface DBPost {
  id: string;
  user_id: string;
  content: string;
  image_url: string | null;
  created_at: string;
}

const Discover = () => {
  const [posts, setPosts] = useState<DBPost[]>([]);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});
  const [comments, setComments] = useState<Record<string, any[]>>({});
  const [profile, setProfile] = useState<{ display_name: string | null; avatar_url: string | null; username: string | null } | null>(null);
  const [postProfiles, setPostProfiles] = useState<Record<string, { display_name: string | null; avatar_url: string | null; username: string | null }>>({});
  const [selectedPerson, setSelectedPerson] = useState<typeof FRIEND_SEEKERS[0] | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchPosts = useCallback(async () => {
    const { data } = await supabase.from("posts" as any).select("*").order("created_at", { ascending: false }).limit(50) as any;
    if (data) {
      setPosts(data);
      // Fetch profiles for post authors
      const userIds = [...new Set(data.map((p: DBPost) => p.user_id))];
      if (userIds.length > 0) {
        const { data: profiles } = await supabase.from("profiles").select("user_id, display_name, avatar_url, username").in("user_id", userIds as string[]);
        if (profiles) {
          const map: Record<string, any> = {};
          profiles.forEach((p: any) => { map[p.user_id] = p; });
          setPostProfiles(map);
        }
      }
      // Fetch like counts
      const postIds = data.map((p: DBPost) => p.id);
      if (postIds.length > 0) {
        const { data: likes } = await supabase.from("post_likes" as any).select("post_id") as any;
        if (likes) {
          const counts: Record<string, number> = {};
          likes.forEach((l: any) => { counts[l.post_id] = (counts[l.post_id] || 0) + 1; });
          setLikeCounts(counts);
        }
        // Fetch user's likes
        if (user) {
          const { data: myLikes } = await supabase.from("post_likes" as any).select("post_id").eq("user_id", user.id) as any;
          if (myLikes) setLikedPosts(new Set(myLikes.map((l: any) => l.post_id)));
        }
        // Fetch comment counts
        const { data: cmts } = await supabase.from("post_comments" as any).select("post_id") as any;
        if (cmts) {
          const cc: Record<string, number> = {};
          cmts.forEach((c: any) => { cc[c.post_id] = (cc[c.post_id] || 0) + 1; });
          setCommentCounts(cc);
        }
      }
    }
  }, [user]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  // Listen for new posts
  useEffect(() => {
    const handler = () => fetchPosts();
    window.addEventListener("posts-updated", handler);
    return () => window.removeEventListener("posts-updated", handler);
  }, [fetchPosts]);

  useEffect(() => {
    if (!user) { setProfile(null); return; }
    supabase.from("profiles").select("display_name, avatar_url, username").eq("user_id", user.id).single().then(({ data }) => {
      if (data) setProfile(data);
    });
  }, [user]);

  const togglePostLike = async (postId: string) => {
    if (!user) { toast("Sign in to like posts"); navigate("/auth"); return; }
    const isLiked = likedPosts.has(postId);
    if (isLiked) {
      await supabase.from("post_likes" as any).delete().eq("post_id", postId).eq("user_id", user.id);
      setLikedPosts((prev) => { const n = new Set(prev); n.delete(postId); return n; });
      setLikeCounts((prev) => ({ ...prev, [postId]: Math.max(0, (prev[postId] || 1) - 1) }));
    } else {
      await supabase.from("post_likes" as any).insert({ post_id: postId, user_id: user.id } as any);
      setLikedPosts((prev) => new Set(prev).add(postId));
      setLikeCounts((prev) => ({ ...prev, [postId]: (prev[postId] || 0) + 1 }));
    }
  };

  const fetchComments = async (postId: string) => {
    const { data } = await supabase.from("post_comments" as any).select("*").eq("post_id", postId).order("created_at", { ascending: true }) as any;
    if (data) {
      // Fetch profiles for comment authors
      const userIds = [...new Set(data.map((c: any) => c.user_id))];
      const { data: profiles } = await supabase.from("profiles").select("user_id, display_name, avatar_url").in("user_id", userIds as string[]);
      const profileMap: Record<string, any> = {};
      profiles?.forEach((p: any) => { profileMap[p.user_id] = p; });
      const enriched = data.map((c: any) => ({
        ...c,
        profiles: profileMap[c.user_id] || { display_name: "User", avatar_url: null },
        text: c.content,
      }));
      setComments((prev) => ({ ...prev, [postId]: enriched }));
    }
  };

  const addComment = async (postId: string, text: string) => {
    if (!user) { toast("Sign in to comment"); navigate("/auth"); return; }
    await supabase.from("post_comments" as any).insert({ post_id: postId, user_id: user.id, content: text } as any);
    setCommentCounts((prev) => ({ ...prev, [postId]: (prev[postId] || 0) + 1 }));
    fetchComments(postId);
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div className="min-h-screen bg-background pb-24 pt-4">
      <div className="px-5 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Discover</h1>
            <p className="mt-0.5 text-xs text-muted-foreground">See what's happening around you</p>
          </div>
          <div className="flex items-center gap-2">
            {user ? (
              <Link to="/profile" className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  {profile?.avatar_url ? <AvatarImage src={profile.avatar_url} /> : null}
                  <AvatarFallback className="text-xs bg-primary/10 text-primary">
                    {(profile?.display_name || profile?.username || user.email)?.[0]?.toUpperCase() || <User className="h-4 w-4" />}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-foreground max-w-[80px] truncate">
                  {profile?.display_name || profile?.username || user.email?.split("@")[0]}
                </span>
              </Link>
            ) : (
              <button onClick={() => navigate("/sign-in")} className="rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>

      {/* People looking for friends */}
      <div className="px-4 pb-5">
        <p className="text-xs font-semibold text-muted-foreground mb-3 px-1">People looking for friends</p>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {FRIEND_SEEKERS.map((person) => (
            <button key={person.id} onClick={() => setSelectedPerson(person)} className="shrink-0 flex flex-col items-center gap-1.5">
              <div className="h-16 w-16 overflow-hidden rounded-full ring-2 ring-primary/50 hover:ring-primary transition-all">
                <img src={person.photo} alt={person.name} className="h-full w-full object-cover" />
              </div>
              <span className="text-[11px] font-medium text-foreground">{person.name}</span>
              <span className="text-[10px] text-muted-foreground">{person.distance}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Community posts feed */}
      <div className="px-4">
        <p className="text-xs font-semibold text-muted-foreground px-1 mb-3">Community posts</p>
        {posts.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-sm">No posts yet. Be the first to share!</p>
          </div>
        )}
        <div className="space-y-4">
          {posts.map((post) => {
            const authorProfile = postProfiles[post.user_id];
            return (
              <PostCard
                key={post.id}
                id={post.id}
                user={authorProfile?.display_name || authorProfile?.username || "User"}
                avatar={authorProfile?.avatar_url || ""}
                image={post.image_url}
                text={post.content}
                likesCount={likeCounts[post.id] || 0}
                commentsCount={commentCounts[post.id] || 0}
                isLiked={likedPosts.has(post.id)}
                time={timeAgo(post.created_at)}
                comments={comments[post.id] || []}
                onToggleLike={() => togglePostLike(post.id)}
                onAddComment={(text) => addComment(post.id, text)}
                onExpandComments={() => fetchComments(post.id)}
              />
            );
          })}
        </div>
      </div>

      {/* Person detail dialog */}
      <Dialog open={!!selectedPerson} onOpenChange={(open) => !open && setSelectedPerson(null)}>
        <DialogContent className="max-w-sm p-0 overflow-hidden rounded-2xl">
          <DialogTitle className="sr-only">{selectedPerson?.name}'s Profile</DialogTitle>
          {selectedPerson && (
            <>
              <div className="relative aspect-[3/4] overflow-hidden">
                <img src={selectedPerson.photo} alt={selectedPerson.name} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="font-display text-2xl font-semibold text-white">{selectedPerson.name}, {selectedPerson.age}</h3>
                  <div className="mt-1 flex items-center gap-1 text-sm text-white/80">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{selectedPerson.distance}</span>
                  </div>
                </div>
              </div>
              <div className="p-5 space-y-4">
                <p className="text-sm text-foreground leading-relaxed">{selectedPerson.bio}</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedPerson.interests.map((interest) => (
                    <Badge key={interest} variant="secondary" className="rounded-full px-3 py-1 text-xs font-medium">{interest}</Badge>
                  ))}
                </div>
                <button
                  onClick={() => { toast.success(`Friend request sent to ${selectedPerson.name}!`); setSelectedPerson(null); }}
                  className="w-full rounded-full bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  Send Friend Request
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Discover;
