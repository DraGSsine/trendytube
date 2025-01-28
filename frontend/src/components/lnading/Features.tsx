"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Feature } from "@/types/landing";
import siteConfig from "@/config/site";

const ANIMATION_CONFIG = {
  hover: {
    scale: 1.05,
    transition: { duration: 0.4, ease: [0.21, 0.45, 0.27, 0.9] },
  },
  initial: { scale: 1 },
};

const FeatureCard: React.FC<Feature> = ({
  image,
  alt,
  badge,
  title,
  description,
  className = "",
  index = 0,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`rounded-xl p-8 bg-zinc-900/50 backdrop-blur-sm transition-all
        ring-1 ring-zinc-800 hover:ring-2 hover:ring-red-600/50
        shadow-sm hover:shadow-xl relative ${className}`}
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
    >
      <div className="overflow-hidden flex items-start justify-center h-auto relative lg:h-60">
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-zinc-900/50 via-transparent z-10"
          animate={{ opacity: isHovered ? 0.3 : 0.7 }}
          transition={{ duration: 0.3 }}
        />
        <motion.div
          className="relative w-full h-full"
          variants={ANIMATION_CONFIG}
          animate={isHovered ? "hover" : "initial"}
        >
          <Image
            src={image}
            alt={alt}
            className="h-full w-full rounded-2xl overflow-hidden object-fit"
            loading="lazy"
            width={1280}
            height={800}
            quality={90}
          />
        </motion.div>
      </div>

      <div className="mt-4 space-y-3">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + index * 0.1 }}
          className={`${badge.color} border border-zinc-800 rounded-full text-xs font-semibold px-3 py-1 inline-block`}
        >
          {badge.text}
        </motion.span>
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 + index * 0.1 }}
          className="text-xl lg:text-2xl font-semibold mt-2 text-white"
        >
          {title}
        </motion.h3>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 + index * 0.1 }}
          className="text-zinc-400 leading-relaxed pr-4 [text-wrap:balance]"
        >
          {description}
        </motion.p>
      </div>
    </motion.div>
  );
};

const Features = () => {
  return (
    <div className="mt-32 md:mt-48 space-y-16 bg-[#0a0a0a] text-white py-16">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.8,
            ease: [0.21, 0.45, 0.27, 0.9],
          },
        }}
      >
        <h2 className="text-4xl lg:text-5xl font-bold lg:tracking-tight mb-6">
          {siteConfig.features.heading.title}
          <span className="ml-2 bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-400">
            {siteConfig.features.heading.highlight}
          </span>
        </h2>
        <p className="text-lg text-zinc-400 mx-auto max-w-2xl">
          {siteConfig.features.description}
        </p>
      </motion.div>

      <div className="grid grid-cols-3 gap-6 container mx-auto px-4">
        {siteConfig.features.items.slice(0, 3).map((feature, index) => (
          <div key={feature.id} className="col-span-1">
            <FeatureCard {...feature} index={index} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;