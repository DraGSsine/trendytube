"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "../logo";
import { usePathname } from "next/navigation";

const NavBar = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <nav className="fixed top-0 z-50 w-full bg-[#0a0a0a] border-b border-zinc-800">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Logo width={40} height={40} />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center absolute left-1/2 transform -translate-x-1/2 bg-zinc-900 rounded-full p-1">
            <Link
              href="/"
              className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                pathname === "/"
                  ? "bg-red-600 text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Home
            </Link>
            <Link
              href="/pricing"
              className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                pathname === "/pricing"
                  ? "bg-red-600 text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Pricing
            </Link>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/auth/signin">
              <Button
                variant="ghost"
                className="text-sm font-medium text-zinc-400 hover:text-white"
              >
                log in
              </Button>
            </Link>
            <Link href="/pricing">
              <Button className="bg-red-600 hover:bg-red-700 text-white rounded-full px-6 py-2 text-sm font-medium">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              className="text-zinc-400 hover:text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              Menu
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-[#0a0a0a] border-b border-zinc-800 shadow-lg">
            <div className="flex flex-col p-4 space-y-2">
              <Link
                href="/"
                className={`px-4 py-2 text-sm font-medium rounded-[10px] transition-colors ${
                  pathname === "/"
                    ? "bg-red-600 text-white"
                    : "text-zinc-400 hover:text-white"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/pricing"
                className={`px-4 py-2 text-sm font-medium rounded-[10px] transition-colors ${
                  pathname === "/pricing"
                    ? "bg-red-600 text-white"
                    : "text-zinc-400 hover:text-white"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                href="/legal"
                className={`px-4 py-2 text-sm font-medium rounded-[10px] transition-colors ${
                  pathname === "/legal"
                    ? "bg-red-600 text-white"
                    : "text-zinc-400 hover:text-white"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Legal
              </Link>
              <Link
                href="/demo"
                className={`px-4 py-2 text-sm font-medium rounded-[10px] transition-colors ${
                  pathname === "/demo"
                    ? "bg-red-600 text-white"
                    : "text-zinc-400 hover:text-white"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Demo
              </Link>
              
              {/* Mobile Auth Buttons */}
              <div className="pt-4 border-t border-zinc-800">
                <Link
                  href="/auth/signin"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button
                    variant="ghost"
                    className="w-full text-sm font-medium text-zinc-400 hover:text-white justify-center"
                  >
                    Log in
                  </Button>
                </Link>
                <Link
                  href="/pricing"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="mt-2 block"
                >
                  <Button className="w-full bg-red-600 hover:bg-red-700 text-white rounded-full px-6 py-2 text-sm font-medium justify-center">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;