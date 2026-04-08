import { Shield, CreditCard, Bell, HelpCircle, LogOut, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const items = [
  { icon: Shield, label: "Privacy & Safety", desc: "Block list, hidden profile", path: "/settings/privacy" },
  { icon: CreditCard, label: "Subscription", desc: "Free tier · Upgrade to Premium", path: "/settings/subscription" },
  { icon: Bell, label: "Notifications", desc: "Matches, messages, reminders", path: "/settings/notifications" },
  { icon: HelpCircle, label: "Help & Support", desc: "FAQ, contact us", path: "/settings/help" },
];

const AppSettings = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    navigate("/welcome");
  };

  return (
    <div className="min-h-screen bg-background pb-24 pt-4">
      <div className="px-5 pb-4">
        <h1 className="font-display text-2xl font-bold text-foreground">Settings</h1>
      </div>

      {!user && (
        <div className="mx-4 mb-4 rounded-2xl bg-sage p-4 text-center">
          <p className="text-sm font-medium text-sage-foreground mb-2">Sign in to unlock all features</p>
          <button
            onClick={() => navigate("/auth")}
            className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground"
          >
            Sign In / Sign Up
          </button>
        </div>
      )}

      <div className="mx-4 overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-card)]">
        {items.map(({ icon: Icon, label, desc, path }, i) => (
          <button
            key={label}
            onClick={() => navigate(path)}
            className={`flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-muted/40 ${
              i < items.length - 1 ? "border-b border-border" : ""
            }`}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sage">
              <Icon className="h-4.5 w-4.5 text-sage-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">{label}</p>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
          </button>
        ))}
      </div>

      {user && (
        <div className="mx-4 mt-4">
          <button
            onClick={handleSignOut}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-destructive/10 p-4 text-sm font-medium text-destructive transition-colors hover:bg-destructive/15"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      )}

      <p className="mt-6 text-center text-[11px] text-muted-foreground">
        CircleMeet v1.0 · Made with intention 🌿
      </p>
    </div>
  );
};

export default AppSettings;
