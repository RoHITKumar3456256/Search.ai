import { NextResponse } from "next/server";

export function validateOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");

  if (!origin || !host) return true; // Server-to-server calls
  const originHost = origin.replace(/^https?:\/\//, "");
  return originHost === host;
}
