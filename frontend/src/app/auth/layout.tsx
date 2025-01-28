// AuthLayout.tsx
import Logo from "@/components/lnading/logo";
import { Button } from "@/components/ui/button";
import siteConfig from "@/config/site";
import { generateMetadata } from "@/lib/metadata";
import { PlayCircle } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = generateMetadata({
  title: "Auth",
  description: "sign in or sign up to your SaasKit account",
});

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[100vh] w-[100vw] flex items-center bg-background justify-center">
      <div className="items-center h-[80vh] rounded-[10px] overflow-hidden bg-card shadow-sm flex max-w-[1200px] md:p-4 border border-border">
        <div className="hidden rounded-[10px] sm:flex h-full w-[40%] bg-gradient-to-br to-primary/20 from-secondary/20  p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-foreground/10 [mask-image:radial-gradient(white,transparent_85%)]" />
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-card/50 backdrop-blur-[1px]" />

          <div className="relative mx-auto flex gap-14 flex-col">
            <Logo width={50} height={50} />

            <div className="space-y-8">
              <h1 className="text-4xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-foreground">
                {siteConfig.auth.title.primary}
                <span className="text-primary">
                  {siteConfig.auth.title.secondary}
                </span>
              </h1>

              <p className="text-muted-foreground text-lg leading-relaxed">
                {siteConfig.auth.description}
              </p>
            </div>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}