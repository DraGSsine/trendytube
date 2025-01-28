import React from "react";
import siteConfig from "@/config/site";
import { Zap, Check } from "lucide-react";
import Upgrade from "@/components/lnading/pricing/Upgrade";
import { generateMetadata } from "@/lib/metadata";



const page = () => {
  const { header, plans } = siteConfig.pricing;
  
  return (
    <div className="min-h-[90vh] pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative text-center max-w-3xl mx-auto mb-20">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Zap size={16} className="text-primary" />
              {header.badge}
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-6">
              {header.title}
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              {header.description}
            </p>
            <div className="flex items-center justify-center gap-8 text-sm text-foreground">
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
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative group rounded-3xl flex flex-col min-h-[600px] ${
                plan.highlight
                  ? "bg-primary text-primary-foreground shadow-xl"
                  : "bg-card text-foreground shadow-lg hover:shadow-xl"
              } p-8 transition-all duration-300 border border-border`}
            >
              {/* Popular Badge */}
              {plan.highlight && (
                <div className="absolute bg-secondary rounded-full -top-4 left-1/2 -translate-x-1/2">
                  <div className="text-foreground px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                </div>
              )}

              {/* Plan Content */}
              <div className="flex-1">
                {/* Plan Header */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-2">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-4xl font-bold">
                      ${plan.price}
                    </span>
                    <span className={plan.highlight ? "text-primary-foreground/70" : "text-muted-foreground"}>
                      /{plan.period}
                    </span>
                  </div>
                  <p className={plan.highlight ? "text-primary-foreground/80" : "text-muted-foreground"}>
                    {plan.description}
                  </p>
                </div>

                {/* Features List */}
                <ul className="space-y-4">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check
                        size={20}
                        className={plan.highlight ? "text-primary-foreground/80 mt-0.5" : "text-primary mt-0.5"}
                      />
                      <span className={plan.highlight ? "text-primary-foreground/90" : "text-muted-foreground"}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Button */}
              <div className="mt-8">
                <Upgrade plan={plan.name} price={plan.price} active={plan.highlight} priceId={plan.priceId} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default page