import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    // Exchange code for session in real Supabase setup
    return NextResponse.redirect(`${requestUrl.origin}/onboarding`);
  }

  return NextResponse.redirect(`${requestUrl.origin}/dashboard`);
}
