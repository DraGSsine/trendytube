import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon } from "lucide-react";
import siteConfig  from "@/config/site";

const Hero = () => {
  return (
    <section className="flex flex-col items-center px-4 animate-section text-white">
      <div className="w-full flex flex-col items-center pb-10">
        <h1 className="text-5xl md:text-7xl font-bold text-center">
          <span className="animate-gradient bg-gradient-to-r from-red-600 via-[#9837d3] to-red-600 bg-[length:200%_auto] bg-clip-text text-transparent block py-2">
            {siteConfig.hero.title.gradient}
          </span>
          <span className="inline-block leading-[5rem] text-white">
            {siteConfig.hero.title.black}
          </span>
        </h1>
        <p className="pt-4 pb-14 text-center mt-4 text-zinc-400 max-w-[600px] text-medium leading-8">
          {siteConfig.hero.description}
        </p>

        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
          <Link
            href={siteConfig.hero.cta.primary.href}
            className="group flex items-center justify-center p-2 rounded-full px-4 text-white bg-red-600 transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <span>{siteConfig.hero.cta.primary.text}</span>
            <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <Link
            href={siteConfig.hero.cta.secondary.href}
            className="group flex items-center justify-center p-2 rounded-full px-4 border border-zinc-800 bg-zinc-900 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <span>{siteConfig.hero.cta.secondary.text}</span>
            <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      <div className="relative bg-zinc-900/5 ring-1 ring-inset ring-zinc-800 rounded-xl p-4 transition-all duration-500">
        <Image
          src="/images/dashboard.png"
          alt="Hero Image"
          width={1300}
          height={800}
          quality={85}
          priority
          className="rounded-xl overflow-hidden bg-zinc-900 shadow-2xl ring-1 ring-zinc-800"
        />
      </div>
    </section>
  );
};

export default Hero;