import { z } from "zod";

const emptyStringToUndefined = z.literal("").transform(() => undefined);

function optionalString() {
  return z.string().optional().or(emptyStringToUndefined);
}

const serverEnvSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: optionalString(),
  GOOGLE_GENERATIVE_AI_API_KEY: optionalString(),
  GROQ_API_KEY: optionalString(),
  OPENROUTER_API_KEY: optionalString(),
  OLLAMA_BASE_URL: optionalString(),
  UPSTASH_REDIS_REST_URL: optionalString(),
  UPSTASH_REDIS_REST_TOKEN: optionalString(),
  RAZORPAY_KEY_ID: optionalString(),
  RAZORPAY_KEY_SECRET: optionalString(),
  RAZORPAY_WEBHOOK_SECRET: optionalString(),
  STRIPE_SECRET_KEY: optionalString(),
  STRIPE_WEBHOOK_SECRET: optionalString(),
  SENTRY_DSN: optionalString(),
  TAVILY_API_KEY: optionalString(),
  LOGO_DEV_API_KEY: optionalString(),
  RESEND_API_KEY: optionalString(),
  // Vector DB (Pinecone)
  PINECONE_API_KEY: optionalString(),
  // Web Scraping (Apify)
  APIFY_API_KEY: optionalString(),
});

const clientEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().default("https://placeholder.supabase.co"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().default("placeholder-key"),
  NEXT_PUBLIC_SITE_URL: z.string().default("http://localhost:3000"),
  NEXT_PUBLIC_POSTHOG_KEY: optionalString(),
  NEXT_PUBLIC_POSTHOG_HOST: z.string().default("https://us.i.posthog.com"),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: optionalString(),
});

export const env = {
  server: serverEnvSchema.parse(process.env),
  client: clientEnvSchema.parse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || undefined,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || undefined,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || undefined,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY || undefined,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST || undefined,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || undefined,
  }),
};

export const isMockMode = !process.env.GOOGLE_GENERATIVE_AI_API_KEY && 
                         !process.env.GROQ_API_KEY && 
                         !process.env.OPENROUTER_API_KEY;
