import { NextResponse } from "next/server";
import { decisionInputSchema } from "@/lib/ai/schemas";
import { processDecisionRequest } from "@/lib/decisions/service";
import { rateLimit } from "@/lib/security/rateLimit";
import { checkAndIncrementUsage } from "@/lib/decisions/usage";
import { safeErrorResponse } from "@/lib/security/safeError";
import { validateOrigin } from "@/lib/security/csrf";
import { logAuditEvent } from "@/lib/security/auditLog";

export async function POST(request: Request) {
  if (!validateOrigin(request)) {
    return safeErrorResponse("Cross-Origin Request Blocked", 403);
  }

  const clientIp = request.headers.get("x-forwarded-for") || "127.0.0.1";
  const { success } = await rateLimit(`decisions_${clientIp}`, 15, 60000);
  if (!success) {
    return safeErrorResponse("Rate limit exceeded. Please try again later.", 429);
  }

  try {
    const body = await request.json();
    const parsedInput = decisionInputSchema.parse(body);

    const allowed = await checkAndIncrementUsage("demo_user", "free", parsedInput.mode);
    if (!allowed) {
      return safeErrorResponse("You have reached today's research limit. Try again tomorrow or upgrade.", 429);
    }

    const { brief, provider, model } = await processDecisionRequest(parsedInput);
    await logAuditEvent("decision_generated", "demo_user", "decision", undefined, { provider, model });

    return NextResponse.json({
      success: true,
      data: brief,
      meta: { provider, model }
    });
  } catch (e: any) {
    return safeErrorResponse(e.message || "Failed to process decision request", 400);
  }
}

export async function GET() {
  return NextResponse.json({
    decisions: []
  });
}
