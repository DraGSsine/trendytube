// app/(auth)/signup/page.tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { UserPlus, Mail, Lock } from "lucide-react";
import { signUpSchema, type SignUpInput } from "@/lib/validations/auth";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import ThirdPartyAuth from "@/components/ThirdPartyAuth";

export default function SignUpPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<SignUpInput>({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<SignUpInput>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
  
    try {
      const validatedData = signUpSchema.parse(formData);
  
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedData),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }
  
      const result = await signIn("credentials", {
        email: validatedData.email,
        password: validatedData.password,
        callbackUrl: "/dashboard",
        redirect: true,
      });
  
      if (result?.error) {
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: result.error,
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(error.formErrors.fieldErrors);
      } else if (error instanceof Error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full md:w-[60%] flex flex-col items-center justify-center">
      <div className="w-[85%] max-w-[480px] py-16 relative">
        <div className="absolute top-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-3xl -z-10" />

        <div className="space-y-6 mb-8">
          <h1 className="font-bold text-2xl md:text-3xl lg:text-4xl tracking-tight text-foreground">
            Create Account
          </h1>
        </div>
        <ThirdPartyAuth />

        <div className="my-8">
          <div className="relative flex items-center">
            <div className="flex-grow border-t border-border" />
            <span className="mx-4 text-sm text-muted-foreground">
              Or continue with email
            </span>
            <div className="flex-grow border-t border-border" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">Full Name</Label>
              <div className="relative">
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="pl-10 [10px] h-12 text-lg bg-card"
                  placeholder="John Doe"
                  required
                />
                <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
              {errors.name && (
                <p className="text-destructive text-sm">{errors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className={`pl-10 h-12 rounded-[10px] text-lg bg-card ${
                    errors.email ? "border-destructive" : ""
                  }`}
                  placeholder="you@example.com"
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className={`pl-10 h-12 rounded-[10px] text-lg bg-card ${
                    errors.password ? "border-destructive" : ""
                  }`}
                  placeholder="••••••••"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full rounded-[10px] h-12 text-lg font-medium transition-all hover:scale-[1.02] bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <span className="animate-spin w-5 h-5 border-2 border-current border-t-transparent rounded-full" />
                Signing up....
              </div>
            ) : (
              "Sign up"
            )}
          </Button>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/auth/signin"
                className="text-primary font-medium hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}