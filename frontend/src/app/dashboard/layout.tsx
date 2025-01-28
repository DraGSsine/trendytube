import Sidebar from "@/components/dashboard/Sidebar";
import { SubscriptionModal } from "@/components/dashboard/SubscriptionModal";
import { authOptions } from "@/lib/auth/authOptions";
import { checkSubscription } from "@/lib/checkSubscription";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/user";
import { getServerSession } from "next-auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const hasSubscription = await checkSubscription();
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("No active session found");
  }
  const userEmail = session.user.email;
  if (!userEmail) {
    throw new Error("No user email found in session");
  }
  const user = await User.findOne({ email: userEmail });
  const plan =( user?.subscriptionPlan).toLowerCase();
  const used = user?.numberOfGeneratedIdeas;
  const max =
    plan === "starter"
      ? 100
      : plan === "premium"
      ? 1000
      : plan === "trial"
      ? 2
      : 0;
  return (
    <div className="flex">
      <Sidebar plan={plan} used={used} max={max} />
      <main className=" flex-grow">{children}</main>
      <SubscriptionModal isOpen={!hasSubscription} />
    </div>
  );
}
