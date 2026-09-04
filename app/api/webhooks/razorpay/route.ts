import { NextResponse } from "next/server";
import { logAuditEvent } from "@/lib/security/auditLog";

export async function POST(request: Request) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = request.headers.get("x-razorpay-signature");

  if (secret && !signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  await logAuditEvent("razorpay_webhook_received", undefined, "subscription");
  return NextResponse.json({ received: true });
}
