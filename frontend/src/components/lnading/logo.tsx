import Link from "next/link";
import React from "react";
import Image from "next/image";

function Logo({ width, height }: { width: number; height: number }) {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Image
        className="rounded-[10px] overflow-hidden"
        src="/logo.png"
        alt="logo" 
        width={width}
        height={height}
        priority
      />
      <span className="text-2xl font-bold text-white">
        Trendy<span className="text-red-500">Tube</span>
      </span>
    </Link>
  );
}

export default Logo;
