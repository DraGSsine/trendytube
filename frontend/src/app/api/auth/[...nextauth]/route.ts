/* eslint-disable */
export const runtime = 'edge';
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"]
  }
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };