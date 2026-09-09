import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const PROTECTED_ROUTES = ["/dashboard", "/onboarding"];
const AUTH_ROUTES = ["/login"];

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);
  const { pathname } = request.nextUrl;

  // Check if user is authenticated via cookie
  const hasSession = request.cookies.has("sb-tbcqctzzjvknskfbonyq-auth-token") ||
    request.cookies.has("sb-access-token") ||
    Array.from(request.cookies.getAll()).some(c => c.name.startsWith("sb-") && c.name.endsWith("-auth-token"));

  // Redirect unauthenticated users away from protected routes
  if (PROTECTED_ROUTES.some(r => pathname.startsWith(r)) && !hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect logged-in users away from login page
  if (AUTH_ROUTES.some(r => pathname.startsWith(r)) && hasSession) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
