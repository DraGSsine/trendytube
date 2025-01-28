import { getServerSession } from "next-auth";
import { connectDB } from "./mongodb";
import { authOptions } from "./auth/authOptions";

export const GetAuthUser = async () => {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new Error("No active session found");
    }

    if (!session.user?.email) {
      throw new Error("No user email found in session");
    }

    return { userEmail: session.user.email };
  } catch (error) {
    console.error("GetAuthUser error:", error);
    return { userEmail: null };
  }
};