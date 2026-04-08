import { ArrowLeft, Heart, MessageCircle, Bell, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";

const items = [
  { icon: Heart, label: "New Matches", desc: "When someone likes you back", key: "matches" },
  { icon: MessageCircle, label: "Messages", desc: "New messages from connections", key: "messages" },
  { icon: Bell, label: "Reminders", desc: "Daily prompts and suggestions", key: "reminders" },
  { icon: Calendar, label: "Events", desc: "Community events and meetups", key: "events" },
];

const Notifications = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<Record<string, boolean>>({
    matches: true,
    messages: true,
    reminders: false,
    events: true,
  });

  const toggle = (key: string) =>
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="min-h-screen bg-background pb-24 pt-4">
      <div className="flex items-center gap-3 px-5 pb-4">
        <button onClick={() => navigate(-1)} className="text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="font-display text-2xl font-bold text-foreground">Notifications</h1>
      </div>

      <div className="mx-4 overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-card)] divide-y divide-border">
        {items.map(({ icon: Icon, label, desc, key }) => (
          <div key={key} className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sage">
                <Icon className="h-4 w-4 text-sage-foreground" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            </div>
            <Switch checked={settings[key]} onCheckedChange={() => toggle(key)} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
