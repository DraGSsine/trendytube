import React from "react";
import { motion } from "framer-motion";
import { HowItWorkCardProps } from "@/types/landing";

const HowItWorkCard: React.FC<HowItWorkCardProps> = ({
  step,
  feature,
  description,
  icon: Icon,
  isActive,
  onStepClick,
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      animate={{ scale: isActive ? 1.05 : 1 }}
      transition={{ duration: 0.2 }}
      onClick={() => onStepClick(step)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onStepClick(step);
        }
      }}
      className={`
        relative max-w-[350px] min-h-[300px] cursor-pointer 
        rounded-xl border transition-all duration-300 ease-in-out
        ${
          isActive
            ? "bg-zinc-800 border-red-700 shadow-lg shadow-red-900/30"
            : "border-transparent hover:border-red-800/50 hover:bg-zinc-900"
        }
        p-6 md:p-7
      `}
      aria-pressed={isActive}
    >
      {/* Step indicator */}
      <div className="absolute z-50 -top-3 left-6 bg-zinc-900 border border-red-700/50 text-zinc-100 px-3 py-1 rounded-full text-sm font-medium">
        {step}
      </div>
      {/* Icon container */}
      <div
        className={`
        mb-5 rounded-xl p-3 w-12 h-12 flex items-center justify-center border border-red-700/50
        ${isActive ? "bg-red-900/30 text-zinc-100" : "bg-zinc-900 text-zinc-300"}
        transition-colors duration-300
      `}
      >
        <Icon 
          className={`w-5 h-5 ${
            isActive ? "text-red-100" : "text-zinc-300"
          }`} 
        />
      </div>
      {/* Content */}
      <div className="space-y-3">
        <h3
          className={`
          text-xl font-semibold transition-colors duration-300
          ${isActive ? "text-red-100" : "text-zinc-200"}
        `}
        >
          {feature}
        </h3>
        <p className="text-zinc-400 leading-relaxed">{description}</p>
      </div>
      {/* Active indicator */}
      {isActive && (
        <motion.div
          layoutId="activeIndicator"
          className="absolute inset-0 border-2 border-red-700/50 rounded-xl"
          initial={false}
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
    </motion.div>
  );
};

export default HowItWorkCard;