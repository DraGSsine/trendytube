import React from "react";
import Link from "next/link";
import { InstagramIcon, LinkedinIcon, TwitterIcon } from "lucide-react";
import Logo from "./logo";

const FooterBar = () => {
  return (
    <footer className="py-14 border-t border-zinc-800 bg-[#0a0a0a] text-white">
      <div className="mt-14 pt-8 px-5 border-t border-zinc-800">
        <div className="max-w-screen-xl mx-auto px-5">
          <p className="text-center text-sm text-zinc-400 [text-wrap:balance]">
            Copyright © 2025 saaskit. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterBar;