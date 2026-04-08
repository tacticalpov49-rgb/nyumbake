import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Shield, Coffee } from "lucide-react";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Hero */}
      <div className="relative flex flex-1 flex-col items-center justify-center px-6 pt-16 pb-8 text-center">
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-sage/40 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-peach/50 blur-3xl" />

        <div className="relative z-10 space-y-6">
          {/* Logo */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-primary shadow-lg">
            <Heart className="h-10 w-10 text-primary-foreground" fill="currentColor" />
          </div>

          <div className="space-y-3">
            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground">
              CircleMeet
            </h1>
            <p className="mx-auto max-w-xs text-base text-muted-foreground leading-relaxed">
              Real people. No bots. No swipe anxiety. For the price of a coffee per month.
            </p>
          </div>

          {/* Value props */}
          <div className="mx-auto max-w-sm space-y-3 pt-4">
            {[
              { icon: Shield, text: "Privacy-first. No public profiles or read receipts." },
              { icon: Coffee, text: "Just $0.99/month. Real connections, not gamification." },
              { icon: Heart, text: "Prompt-based icebreakers, not endless swiping." },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-start gap-3 rounded-xl bg-card p-3 text-left shadow-[var(--shadow-card)]">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sage">
                  <Icon className="h-4 w-4 text-sage-foreground" />
                </div>
                <p className="text-sm text-foreground/80 leading-snug">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="space-y-3 p-6 pb-10">
        <Button
          onClick={() => navigate("/")}
          className="w-full rounded-xl bg-primary py-6 text-base font-semibold text-primary-foreground shadow-lg hover:opacity-90"
        >
          Get Started
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          By continuing, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default Welcome;
