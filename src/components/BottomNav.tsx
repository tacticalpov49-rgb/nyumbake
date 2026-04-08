import { useState } from "react";
import { Compass, MessageCircle, User, Settings, Plus } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import AppSidebar from "@/components/AppSidebar";
import CreatePostDialog from "@/components/CreatePostDialog";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [postDialogOpen, setPostDialogOpen] = useState(false);

  if (location.pathname === "/welcome" || location.pathname === "/onboarding" || location.pathname.startsWith("/chat/")) return null;

  const tabs = [
    { icon: Compass, label: "Discover", path: "/" },
    { icon: MessageCircle, label: "Chats", path: "/chats" },
    { key: "plus" as const },
    { icon: User, label: "Profile", path: "/profile" },
    { key: "settings" as const },
  ];

  const handlePlusClick = () => {
    if (!user) {
      toast("Sign in to create a post");
      navigate("/auth");
      return;
    }
    setPostDialogOpen(true);
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-md items-center justify-around py-2">
          {tabs.map((tab, i) => {
            if ("key" in tab && tab.key === "plus") {
              return (
                <button
                  key="plus"
                  onClick={handlePlusClick}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md -mt-4"
                >
                  <Plus className="h-5 w-5" strokeWidth={2.5} />
                </button>
              );
            }
            if ("key" in tab && tab.key === "settings") {
              return (
                <button
                  key="settings"
                  onClick={() => setSidebarOpen(true)}
                  className="flex flex-col items-center gap-0.5 px-4 py-1.5 text-muted-foreground transition-colors"
                >
                  <Settings className="h-5 w-5" strokeWidth={1.8} />
                  <span className="text-[10px] font-medium">Settings</span>
                </button>
              );
            }
            const navTab = tab as { icon: any; label: string; path: string };
            const active = location.pathname === navTab.path;
            return (
              <button
                key={navTab.path}
                onClick={() => navigate(navTab.path)}
                className={`flex flex-col items-center gap-0.5 px-4 py-1.5 transition-colors ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <navTab.icon className="h-5 w-5" strokeWidth={active ? 2.2 : 1.8} />
                <span className="text-[10px] font-medium">{navTab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
      <AppSidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
      <CreatePostDialog open={postDialogOpen} onOpenChange={setPostDialogOpen} onPostCreated={() => {
        // Force a page refresh to pick up the new post
        window.dispatchEvent(new Event("posts-updated"));
      }} />
    </>
  );
};

export default BottomNav;
