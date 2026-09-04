import { NextResponse } from "next/server";
import { logAuditEvent } from "@/lib/security/auditLog";

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");

  if (secret && !signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  await logAuditEvent("stripe_webhook_received", undefined, "subscription");
  return NextResponse.json({ received: true });
}
