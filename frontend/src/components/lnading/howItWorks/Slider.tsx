"use client";

import Image from "next/image";
import React from "react";

const Slider = ({activeStep}:{activeStep:string}) => {

  // Define translation values for each step dynamically
  const stepTranslation: Record<string, number> = {
    "Step 1": 0,
    "Step 2": -90,
    "Step 3": -178,
  };

  // Determine translateX based on active step
  const translateX = stepTranslation[activeStep] ?? 0;

  // Define slider data for scalability and reuse
  const sliderData = [
    { step: "Step 1", image: "/images/step1.png", alt: "Upload Files" },
    { step: "Step 2", image: "/images/step2.png", alt: "Analyze Files" },
    { step: "Step 3", image: "/images/step3.png", alt: "Organized Folders" },
  ];

  return (
    <div className="relative overflow-hidden flex mt-20 rounded-3xl bg-slate-50 px-14 py-16 xl:px-16">
      {sliderData.map(({ step, image, alt }) => (
        <div
          key={step}
          className={`px-5 transition duration-500 ease-in-out ui-not-focus-visible:outline-none ${
            activeStep !== step && "opacity-30"
          }`}
          style={{ transform: `translateX(${translateX}%)` }}
        >
          <div className="w-[52.75rem] h-[30rem] overflow-hidden rounded-xl bg-white shadow-lg shadow-slate-900/5 ring-1 ring-slate-500/10">
            <Image
              alt={alt}
              loading="lazy"
              width={1688}
              height={856}
              decoding="async"
              className="w-full h-full object-cover"
              style={{ color: "transparent" }}
              sizes="52.75rem"
              src={image}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Slider;
