import { Shield, CreditCard, Bell, HelpCircle, LogOut, ChevronRight } from "lucide-react";

const items = [
  { icon: Shield, label: "Privacy & Safety", desc: "Block list, hidden profile" },
  { icon: CreditCard, label: "Subscription", desc: "Free tier · Upgrade to Premium" },
  { icon: Bell, label: "Notifications", desc: "Matches, messages, reminders" },
  { icon: HelpCircle, label: "Help & Support", desc: "FAQ, contact us" },
];

const AppSettings = () => {
  return (
    <div className="min-h-screen bg-background pb-24 pt-4">
      <div className="px-5 pb-4">
        <h1 className="font-display text-2xl font-bold text-foreground">Settings</h1>
      </div>

      <div className="mx-4 overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-card)]">
        {items.map(({ icon: Icon, label, desc }, i) => (
          <button
            key={label}
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

      <div className="mx-4 mt-4">
        <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-destructive/10 p-4 text-sm font-medium text-destructive transition-colors hover:bg-destructive/15">
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>

      <p className="mt-6 text-center text-[11px] text-muted-foreground">
        CircleMeet v1.0 · Made with intention 🌿
      </p>
    </div>
  );
};

export default AppSettings;
