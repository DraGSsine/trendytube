import React from "react";
import SendEmailForm from "./SendEmailForm";
import siteConfig from "@/config/site";

const NewsLetter = () => {
  return (
    <section id="join" className="relative bg-[#0a0a0a]">
      <div className="border-y border-zinc-800 bg-zinc-900">
        <div className="relative mx-auto px-6 md:max-w-full md:px-12 lg:max-w-6xl xl:px-0">
          <div className="items-end justify-between md:flex">
            <div className="h-max py-16 md:w-6/12 xl:w-5/12">
              <div className="text-center md:text-left">
                <h2 className="text-3xl max-w-[500px] font-bold text-white md:w-max md:text-4xl xl:text-5xl">
                  {siteConfig.newsletter.title}
                </h2>
                <p className="mb-8 mt-6 text-zinc-400">
                  {siteConfig.newsletter.description}
                </p>
                <SendEmailForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsLetter;