import { NextResponse } from "next/server";
import { createStripeCheckoutSession } from "@/lib/billing/stripe";
import { safeErrorResponse } from "@/lib/security/safeError";

export async function POST(request: Request) {
  try {
    const { planId, userId } = await request.json();
    if (!planId) return safeErrorResponse("Plan ID is required", 400);

    const session = await createStripeCheckoutSession(planId, userId || "anonymous");
    return NextResponse.json(session);
  } catch (e: any) {
    return safeErrorResponse("Failed to create Stripe session", 500);
  }
}
