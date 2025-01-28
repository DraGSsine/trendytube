"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import HowItWorkCard from "./HowItWorkCard";
import Slider from "./Slider";
import siteConfig from "@/config/site";

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState("Step 1");

  return (
    <section
      id="how-it-works"
      className="relative py-24 lg:py-32 overflow-hidden bg-background"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center space-y-4"
        >
          <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-primary bg-secondary border border-border rounded-full">
            {siteConfig.howItWorks.badge}
          </span>

          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            {siteConfig.howItWorks.title}
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto [text-wrap:pretty]">
            {siteConfig.howItWorks.description}
          </p>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {siteConfig.howItWorks.steps.map((feature, index) => (
            <motion.div
              key={feature.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              <HowItWorkCard
                {...feature}
                isActive={activeStep === feature.step}
                onStepClick={setActiveStep}
                icon={feature.icon}
                className="bg-card border-border hover:bg-secondary/50"
                activeClassName="border-primary ring-2 ring-primary"
              />
            </motion.div>
          ))}
        </div>

        {/* <div className="mt-20 lg:mt-24">
          <Slider activeStep={activeStep} />
        </div> */}
      </div>
    </section>
  );
}