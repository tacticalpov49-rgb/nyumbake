import { ArrowLeft, Eye, EyeOff, UserX, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";

const PrivacySafety = () => {
  const navigate = useNavigate();
  const [hideProfile, setHideProfile] = useState(false);
  const [hideDistance, setHideDistance] = useState(false);
  const [hideOnlineStatus, setHideOnlineStatus] = useState(false);

  return (
    <div className="min-h-screen bg-background pb-24 pt-4">
      <div className="flex items-center gap-3 px-5 pb-4">
        <button onClick={() => navigate("/settings")} className="text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="font-display text-2xl font-bold text-foreground">Privacy & Safety</h1>
      </div>

      <div className="mx-4 overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-card)] divide-y divide-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sage">
              <EyeOff className="h-4 w-4 text-sage-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Hide Profile</p>
              <p className="text-xs text-muted-foreground">Your profile won't appear in discovery</p>
            </div>
          </div>
          <Switch checked={hideProfile} onCheckedChange={setHideProfile} />
        </div>

        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sage">
              <Eye className="h-4 w-4 text-sage-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Hide Distance</p>
              <p className="text-xs text-muted-foreground">Others won't see how far you are</p>
            </div>
          </div>
          <Switch checked={hideDistance} onCheckedChange={setHideDistance} />
        </div>

        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sage">
              <Shield className="h-4 w-4 text-sage-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Hide Online Status</p>
              <p className="text-xs text-muted-foreground">Others won't see when you're active</p>
            </div>
          </div>
          <Switch checked={hideOnlineStatus} onCheckedChange={setHideOnlineStatus} />
        </div>

        <button className="flex w-full items-center gap-3 p-4 text-left hover:bg-muted/40 transition-colors">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/10">
            <UserX className="h-4 w-4 text-destructive" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Blocked Users</p>
            <p className="text-xs text-muted-foreground">Manage your block list</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default PrivacySafety;
