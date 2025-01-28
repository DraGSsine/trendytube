"use client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { sendEmail } from "@/lib/mail";
import { Loader2, MailIcon } from "lucide-react";
import React, { useState } from "react";


const SendEmailForm = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast({
        variant: "destructive",
        description: 'Please enter a valid email address',
      });
      return;
    }

    setIsLoading(true);
    const { err } = await sendEmail(email);
    
    if (err) {
      setIsLoading(false);
      toast({
        variant: "destructive",
        description: err,
      });
      return;
    }

    setTimeout(() => {
      setIsLoading(false);
      toast({
        description: "Subscribed successfully!",
      });
      setEmail("");
    }, 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-12">
      <div className="relative flex items-center rounded-full border border-primary/20 bg-white px-2 shadow-md dark:border-white/10 dark:bg-dark md:p-2 lg:pr-3">
        <div className="py-3 pl-4 lg:pl-5">
          <MailIcon size={24} stroke="#4b81f7" />
        </div>
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          autoComplete="email"
          placeholder="Enter your email address"
          className="w-full rounded-full bg-transparent p-4 placeholder-gray-600 dark:placeholder-white outline-none"
          type="email"
          required
        />
        <div className="md:pr-1.5 lg:pr-0">
          <Button
            type="submit"
            className="rounded-full p-5 min-w-28"
            color="primary"
          >
            {isLoading ? (
              <Loader2
                size={24}
                stroke="#fff"
                className="animate-spin"
              />
            ) : (
              <>Subscribe</>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default SendEmailForm;
