import { ArrowLeft, Check, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    current: true,
    features: ["5 likes per day", "Basic profile", "Community posts", "Limited messages"],
  },
  {
    name: "Premium",
    price: "$9.99",
    period: "/month",
    current: false,
    features: ["Unlimited likes", "See who liked you", "Priority discovery", "Unlimited messages", "Advanced filters", "No ads"],
  },
];

const Subscription = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-24 pt-4">
      <div className="flex items-center gap-3 px-5 pb-4">
        <button onClick={() => navigate(-1)} className="text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="font-display text-2xl font-bold text-foreground">Subscription</h1>
      </div>

      <div className="px-4 space-y-4">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-2xl p-5 shadow-[var(--shadow-card)] ${
              plan.current ? "bg-card border-2 border-primary" : "bg-card border border-border"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {!plan.current && <Sparkles className="h-4 w-4 text-accent" />}
                <h3 className="font-display text-lg font-bold text-foreground">{plan.name}</h3>
              </div>
              <div>
                <span className="text-xl font-bold text-foreground">{plan.price}</span>
                <span className="text-xs text-muted-foreground">{plan.period}</span>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              {plan.features.map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-primary" />
                  <span className="text-sm text-foreground">{f}</span>
                </div>
              ))}
            </div>

            {plan.current ? (
              <div className="text-center text-sm font-medium text-primary">Current Plan</div>
            ) : (
              <Button className="w-full rounded-xl">Upgrade to Premium</Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Subscription;
