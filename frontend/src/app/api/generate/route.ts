import { GetAuthUser } from "@/lib/getAuthUser";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/user";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const limits = {
      starter: 300,
      premium: 1000,
      trial: 2,
    };
    await connectDB();
    const { userEmail } = await GetAuthUser();
    const user = await User.findOne({ email: userEmail });
    if (user.subscriptionStatus !== "active") {
      return new Response(
        JSON.stringify({
          success: false,
          error: "You need an active subscription to generate ideas",
        }),
        { status: 403 }
      );
    }
    if (
      user.subscriptionPlan === "trial" &&
      user.numberOfGeneratedIdeas >= limits.trial
    ) {
      await User.updateOne(
        { email: userEmail },
        { subscriptionStatus: "inactive" }
      );
      return new Response(
        JSON.stringify({
          success: false,
          error: "You have reached the limit of trial requests",
        }),
        { status: 403 }
      );
    }
    if (
      user.subscriptionPlan === "starter" &&
      user.numberOfGeneratedIdeas > limits.starter
    ) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "You have reached the limit of starter requests",
        }),
        { status: 400 }
      );
    }
    if (
      user.subscriptionPlan === "premium" &&
      user.numberOfGeneratedIdeas > limits.premium
    ) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "You have reached the limit of premium requests",
        }),
        { status: 400 }
      );
    }
    user.numberOfGeneratedIdeas++;
    await user.save();
    return new Response(
      JSON.stringify({
        success: true,
        error: null,
        data: "Generated response",
      })
    );
  } catch (error: any) {
    console.error("API Error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to generate response",
        details: error.message,
      }),
      { status: 500 }
    );
  }
}
