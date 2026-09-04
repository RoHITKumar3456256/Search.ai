import { NextResponse } from "next/server";
import { createRazorpayOrder } from "@/lib/billing/razorpay";
import { safeErrorResponse } from "@/lib/security/safeError";

export async function POST(request: Request) {
  try {
    const { planId, userId } = await request.json();
    if (!planId) return safeErrorResponse("Plan ID is required", 400);

    const order = await createRazorpayOrder(planId, userId || "anonymous");
    return NextResponse.json(order);
  } catch (e: any) {
    return safeErrorResponse("Failed to create Razorpay order", 500);
  }
}
