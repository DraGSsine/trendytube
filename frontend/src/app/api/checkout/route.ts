// app/api/create-checkout/route.ts
import { stripe } from "@/config/stripe";
import { GetAuthUser } from "@/lib/getAuthUser";
import { NextRequest, NextResponse } from "next/server";

interface CheckoutRequestBody {
  priceId: string;
  planName: string;
}

const prices: Record<string, number> = {
  starter: 4,
  premium: 9,
};
export async function POST(req: NextRequest) {
  try {
    const {userEmail} = await GetAuthUser();
    const { priceId, planName }: CheckoutRequestBody = await req.json();

    if (!planName || !priceId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Fix: Use template literal for CHECKOUT_SESSION_ID
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: planName,
            },
            unit_amount: prices[planName.toLowerCase()] * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      allow_promotion_codes: true,
      customer_email: userEmail!,
      //Use literal braces for CHECKOUT_SESSION_ID
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id=${'{CHECKOUT_SESSION_ID}'}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      metadata: {
        priceId,
        plan: planName,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
