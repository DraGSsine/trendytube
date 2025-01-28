import { getServerSession } from "next-auth/next";
import { User } from "@/models/user";
import { connectDB } from "./mongodb";

export async function checkSubscription() {
  try {
    await connectDB();
    const session = await getServerSession();
    
    const user = await User.findOne({ email: session?.user?.email });

    console.log("User subscription status:", user?.subscriptionStatus);
    if (user?.subscriptionStatus !== "active" && user?.subscriptionStatus !== "trial") {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error checking subscription:", error);
    return false;
  }
}