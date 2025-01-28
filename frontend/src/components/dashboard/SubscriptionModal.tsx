"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import siteConfig from "@/config/site";
import { useState } from "react";

interface Plan {
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  highlight: boolean;
  priceId: string;
}

interface PriceCardProps {
  plan: Plan;
  handleUpgrade: (
    priceId: string,
    name: string,
    setLoading: (loading: boolean) => void
  ) => void;
}

const PriceCard = ({ plan, handleUpgrade }: PriceCardProps) => {
  const [loading, setLoading] = useState(false);

  return (
    <div
      key={plan.name}
      className={`relative flex flex-col min-h-[400px] rounded-2xl ${
        plan.highlight
          ? "bg-primary text-primary-foreground"
          : "bg-card text-card-foreground"
      } p-6 shadow-lg transition-all duration-300`}
    >
      {plan.highlight && (
        <div className="absolute bg-secondary text-secondary-foreground rounded-full -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-sm font-medium">
          Most Popular
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-3xl font-bold">${plan.price}</span>
          <span
            className={
              plan.highlight
                ? "text-primary-foreground/70"
                : "text-muted-foreground"
            }
          >
            /{plan.period}
          </span>
        </div>
        <p
          className={
            plan.highlight
              ? "text-primary-foreground/80"
              : "text-muted-foreground"
          }
        >
          {plan.description}
        </p>
      </div>

      <ul className="space-y-3 mb-6">
        {plan.features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3">
            <Check
              size={18}
              className={
                plan.highlight
                  ? "text-primary-foreground mt-0.5"
                  : "text-primary mt-0.5"
              }
            />
            <span
              className={
                plan.highlight
                  ? "text-primary-foreground/90"
                  : "text-card-foreground"
              }
            >
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <Button
        onClick={() => handleUpgrade(plan.priceId, plan.name, setLoading)}
        className={`w-full mt-auto ${
          plan.highlight
            ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            : "bg-primary text-primary-foreground hover:bg-primary/90"
        }`}
      >
        {loading ? "Processing..." : `Upgrade to ${plan.name}`}
      </Button>
    </div>
  );
};

export function SubscriptionModal({ isOpen }: { isOpen: boolean }) {
  const { header, plans } = siteConfig.pricing;

  const handleUpgrade = async (
    priceId: string,
    planName: string,
    setLoading: (loading: boolean) => void
  ) => {
    try {
      setLoading(true);
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId,
          planName,
        }),
      });

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error("Payment error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-[800px] p-0">
        <div className="p-6">
          {/* Header */}
          <DialogTitle className="text-center max-w-2xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              {header.badge}
            </div>
            <span className="text-2xl font-bold tracking-tight text-foreground mb-4">
              {header.title}
            </span>
            <p className="text-muted-foreground">{header.description}</p>
            <div className="flex items-center justify-center gap-6 mt-4 text-sm text-foreground">
              {header.trustSignals.map((signal) => {
                const Icon = signal.icon;
                return (
                  <div key={signal.text} className="flex items-center gap-2">
                    <Icon size={16} className="text-primary" />
                    <span>{signal.text}</span>
                  </div>
                );
              })}
            </div>
          </DialogTitle>

          {/* Plans Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {plans.map((plan) => (
              <PriceCard
                key={plan.name}
                plan={plan}
                handleUpgrade={handleUpgrade}
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
