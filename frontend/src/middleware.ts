// /middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Define protected routes that require authentication
  const protectedRoutes = ["/dashboard"];

  const path = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);

  if (isProtectedRoute && !token) {
    // Redirect to login if trying to access a protected route without authentication
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  if (!isProtectedRoute && token) {
    // Redirect authenticated users away from public pages to the dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// Apply middleware to all routes except for public assets and API routes
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
