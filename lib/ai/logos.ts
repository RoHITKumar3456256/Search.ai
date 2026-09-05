import "server-only";

// Common tool to primary domain mapping
const TOOL_DOMAIN_MAP: Record<string, string> = {
  supabase: "supabase.com",
  neon: "neon.tech",
  planetscale: "planetscale.com",
  firebase: "firebase.google.com",
  stripe: "stripe.com",
  razorpay: "razorpay.com",
  clerk: "clerk.com",
  auth0: "auth0.com",
  nextjs: "nextjs.org",
  vercel: "vercel.com",
  aws: "aws.amazon.com",
  prisma: "prisma.io",
  drizzle: "orm.drizzle.team",
  posthog: "posthog.com",
  resend: "resend.com",
  sentry: "sentry.io",
  upstash: "upstash.com",
  openai: "openai.com",
  anthropic: "anthropic.com",
  groq: "groq.com",
  redis: "redis.io",
  mongodb: "mongodb.com",
  tailwind: "tailwindcss.com",
  shadcn: "ui.shadcn.com"
};

export function getToolLogoUrl(toolName: string): string {
  const normalized = toolName.toLowerCase().replace(/[^a-z0-9]/g, "");
  const matchedKey = Object.keys(TOOL_DOMAIN_MAP).find((k) => normalized.includes(k));
  const domain = matchedKey ? TOOL_DOMAIN_MAP[matchedKey] : `${normalized}.com`;

  const logoDevKey = process.env.LOGO_DEV_API_KEY;
  if (logoDevKey) {
    return `https://img.logo.dev/${domain}?token=${logoDevKey}&size=128&format=png`;
  }

  // Fallback to clearbit / google favicon
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
}
