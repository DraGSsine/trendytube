"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Youtube,
  Sparkles,
  History,
  Settings,
  LogOut,
  Crown,
  Menu,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";

const routes = [
  {
    label: "Generate Ideas",
    icon: Sparkles,
    href: "/dashboard",
    color: "text-red-500",
  },
  // {
  //   label: "History",
  //   icon: History,
  //   href: "/dashboard/history",
  //   color: "text-zinc-400",
  // },
];

export default function Sidebar({
  plan,
  used,
  max,
}: {
  plan: string
  used: number
  max: number
}) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col h-screen w-[240px] bg-zinc-900 border-r border-zinc-800">
        {/* Logo */}
        <div className="px-6 py-6">
          <h1 className="text-2xl font-bold text-white">
            <span>Trendy</span>
            <span className="text-red-500">Tube</span>
          </h1>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-4 overflow-y-auto">
          <div className="space-y-2">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center gap-3 p-3 text-sm font-medium rounded-xl",
                  "transition-all duration-200 hover:bg-zinc-800/50",
                  pathname === route.href
                    ? "bg-zinc-800/80 text-white"
                    : "text-zinc-400 hover:text-white"
                )}
              >
                <route.icon className={cn("w-5 h-5", route.color)} />
                <span>{route.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Pro Badge */}
        <div className="p-4">
          <div className="p-4 bg-zinc-800 rounded-xl mb-4">
            <div className="flex items-center gap-3">
              <Crown className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="text-sm font-medium text-white">{plan} Account</p>
                {plan === "premium" ? (
                  <p className="text-xs text-zinc-400">Unlimited generations</p>
                ) : (
                  <p className="text-xs text-zinc-400">
                    {used} of {max} generations
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sign Out Button */}
        <div className="p-4">
          <button
            onClick={() => signOut({ redirect: true, callbackUrl: "/" })}
            className="w-full flex items-center gap-3 p-3 text-sm font-medium rounded-xl
                     text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className="md:hidden">
        {/* Mobile Header */}
        <div className="fixed top-0 left-0 right-0 h-16 bg-zinc-900 border-b border-zinc-800 px-4 flex items-center justify-between z-40">
          <h1 className="text-xl font-bold text-white">
            <span>Trendy</span>
            <span className="text-red-500">Tube</span>
          </h1>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 text-zinc-400 hover:text-white"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isCollapsed && (
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsCollapsed(false)}
          />
        )}

        {/* Mobile Menu Content */}
        <div
          className={cn(
            "fixed top-0 right-0 h-full w-[280px] bg-zinc-900 z-50",
            "transform transition-transform duration-300 ease-in-out",
            isCollapsed ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex flex-col h-full">
            <div className="p-4 flex justify-end">
              <button
                onClick={() => setIsCollapsed(false)}
                className="p-2 text-zinc-400 hover:text-white"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

            <div className="px-4 space-y-2">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  onClick={() => setIsCollapsed(false)}
                  className={cn(
                    "flex items-center gap-3 p-3 text-sm font-medium rounded-xl",
                    "transition-all duration-200 hover:bg-zinc-800/50",
                    pathname === route.href
                      ? "bg-zinc-800/80 text-white"
                      : "text-zinc-400 hover:text-white"
                  )}
                >
                  <route.icon className={cn("w-5 h-5", route.color)} />
                  <span>{route.label}</span>
                </Link>
              ))}
            </div>

            <div className="mt-auto p-4">
              <div className="p-4 bg-zinc-800 rounded-xl mb-4">
                <div className="flex items-center gap-3">
                  <Crown className="w-5 h-5 text-yellow-500" />
                  <div>
                    <p className="text-sm font-medium text-white">
                      {plan} Account
                    </p>
                    {plan === "premium" ? (
                      <p className="text-xs text-zinc-400">
                        Unlimited generations
                      </p>
                    ) : (
                      <p className="text-xs text-zinc-400">
                        {used} of {max} generations
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => signOut({ redirect: true, callbackUrl: "/" })}
                className="w-full flex items-center gap-3 p-3 text-sm font-medium rounded-xl
                         text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
