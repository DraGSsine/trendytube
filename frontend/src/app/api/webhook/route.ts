import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/config/stripe";
import type Stripe from "stripe";
import { User } from "@/models/user";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!signature) {
      return NextResponse.json({ error: "Stripe signature missing" }, { status: 400 });
    }

    if (!webhookSecret) {
      return NextResponse.json({ error: "Stripe webhook secret missing" }, { status: 500 });
    }

    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    
    // Extract customer email from the event
    const customerEmail = await getCustomerEmailFromEvent(event);
    
    if (!customerEmail) {
      return NextResponse.json({ error: "Customer email not found" }, { status: 400 });
    }

    await handleStripeEvent(event, customerEmail);
    
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler failed:", error);
    return NextResponse.json(
      {
        error: "Webhook handler failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

async function getCustomerEmailFromEvent(event: Stripe.Event): Promise<string | null> {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      return session.customer_details?.email ?? null;
    }
    case "invoice.payment_succeeded":
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const customerId = (event.data.object as Stripe.Subscription | Stripe.Invoice).customer as string;
      const customer = await stripe.customers.retrieve(customerId);
      if ('deleted' in customer) return null;
      return customer.email ?? null;
    }
    default:
      return null;
  }
}

async function handleStripeEvent(event: Stripe.Event, customerEmail: string): Promise<void> {
  switch (event.type) {
    case "checkout.session.completed": {
      console.log("Checkout session completed");
      const session = event.data.object as Stripe.Checkout.Session;
      await updateUserAfterCheckout(session, customerEmail);
      break;
    }
    case "invoice.payment_succeeded": {
      console.log("Invoice payment succeeded");
      const invoice = event.data.object as Stripe.Invoice;
      await updateUserAfterPayment(invoice, customerEmail);
      break;
    }
    case "customer.subscription.updated": {
      console.log("Customer subscription updated");
      const subscription = event.data.object as Stripe.Subscription;
      await updateUserSubscription(subscription, customerEmail);
      break;
    }
    case "customer.subscription.deleted": {
      console.log("Customer subscription deleted");
      const subscription = event.data.object as Stripe.Subscription;
      await cancelUserSubscription(subscription, customerEmail);
      break;
    }
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
}

async function updateUserAfterCheckout(
  session: Stripe.Checkout.Session,
  email: string
): Promise<void> {
  await User.findOneAndUpdate(
    { email },
    {
      stripeCustomerId: session.customer as string,
      subscriptionStatus: "active",
      subscriptionPlan: session.metadata?.plan,
      subscriptionPeriodEnd: session.expires_at
        ? new Date(Number(session.expires_at) * 1000)
        : undefined,
      numberOfGeneratedIdeas: 0,
    },
    { new: true, upsert: true }
  );
}

async function updateUserAfterPayment(
  invoice: Stripe.Invoice,
  email: string
): Promise<void> {
  await User.findOneAndUpdate(
    { email },
    {
      subscriptionStatus: "active",
      subscriptionPeriodEnd: new Date(Number(invoice.period_end) * 1000),
      numberOfGeneratedIdeas: 0,
    }
  );
}

async function updateUserSubscription(
  subscription: Stripe.Subscription,
  email: string
): Promise<void> {
  await User.findOneAndUpdate(
    { email },
    {
      subscriptionPlan: subscription.items.data[0].price.nickname,
      subscriptionStatus: subscription.status,
      subscriptionPeriodEnd: new Date(Number(subscription.current_period_end) * 1000),
      numberOfGeneratedIdeas: 0,
    }
  );
}

async function cancelUserSubscription(
  subscription: Stripe.Subscription,
  email: string
): Promise<void> {
  await User.findOneAndUpdate(
    { email },
    {
      subscriptionStatus: "canceled",
      subscriptionPeriodEnd: subscription.canceled_at
        ? new Date(Number(subscription.canceled_at) * 1000)
        : undefined,
    }
  );
}