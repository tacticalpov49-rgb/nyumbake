import { Shield, CreditCard, Bell, HelpCircle, LogOut, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const items = [
  { icon: Shield, label: "Privacy & Safety", desc: "Block list, hidden profile", path: "/settings/privacy" },
  { icon: CreditCard, label: "Subscription", desc: "Free tier · Upgrade to Premium", path: "/settings/subscription" },
  { icon: Bell, label: "Notifications", desc: "Matches, messages, reminders", path: "/settings/notifications" },
  { icon: HelpCircle, label: "Help & Support", desc: "FAQ, contact us", path: "/settings/help" },
];

interface AppSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AppSidebar = ({ open, onOpenChange }: AppSidebarProps) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    onOpenChange(false);
    navigate("/welcome");
  };

  const handleNav = (path: string) => {
    onOpenChange(false);
    navigate(path);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-72 p-0 bg-background">
        <SheetTitle className="sr-only">Settings</SheetTitle>
        <div className="p-5 pb-3 border-b border-border">
          <h2 className="font-display text-xl font-bold text-foreground">Settings</h2>
        </div>

        {!user && (
          <div className="mx-4 my-4 rounded-2xl bg-muted p-4 text-center">
            <p className="text-sm font-medium text-foreground mb-2">Sign in to unlock all features</p>
            <button
              onClick={() => handleNav("/auth")}
              className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground"
            >
              Sign In / Sign Up
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {items.map(({ icon: Icon, label, desc, path }) => (
            <button
              key={label}
              onClick={() => handleNav(path)}
              className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-muted/40 border-b border-border"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
            </button>
          ))}

          {user && (
            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-destructive/10 border-b border-border"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
                <LogOut className="h-4 w-4 text-destructive" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-destructive">Sign Out</p>
                <p className="text-xs text-muted-foreground">Log out of your account</p>
              </div>
            </button>
          )}
        </div>

        <p className="p-4 text-center text-[11px] text-muted-foreground">
          CircleMeet v1.0 · Made with intention 🌿
        </p>
      </SheetContent>
    </Sheet>
  );
};

export default AppSidebar;
