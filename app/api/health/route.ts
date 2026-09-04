import { NextResponse } from "next/server";
import { isMockMode } from "@/lib/env";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    mode: isMockMode ? "mock" : "configured",
    providers: {
      geminiAvailable: Boolean(process.env.GOOGLE_GENERATIVE_AI_API_KEY),
      groqAvailable: Boolean(process.env.GROQ_API_KEY),
      openrouterAvailable: Boolean(process.env.OPENROUTER_API_KEY),
      ollamaAvailable: Boolean(process.env.OLLAMA_BASE_URL),
    },
    supabaseConfigured: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    posthogConfigured: Boolean(process.env.NEXT_PUBLIC_POSTHOG_KEY),
    paymentProviders: {
      razorpayConfigured: Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET),
      stripeConfigured: Boolean(process.env.STRIPE_SECRET_KEY),
    },
  });
}
