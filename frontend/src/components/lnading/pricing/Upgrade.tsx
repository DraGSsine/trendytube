"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const Upgrade = ({
  plan,
  price,
  active,
  priceId,
}: {
  plan: string;
  price: number;
  active: boolean;
  priceId: string;
}) => {
  const router = useRouter();

  return (
    <Button
      onClick={() =>
        router.push("/auth/signup?priceId=" + priceId + "&plan=" + plan)
      }
      data-plan={plan}
      className={`
        w-full h-12 rounded-full font-medium 
        transition-all duration-200 
        ${
          active
            ? "bg-white text-primary hover:bg-gray-100"
            : "bg-primary text-white hover:bg-primary/90"
        } 
        flex items-center justify-center gap-2
      `}
    >
      Try For Free
    </Button>
  );
};

export default Upgrade;
