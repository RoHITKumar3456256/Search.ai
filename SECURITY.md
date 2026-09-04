# Security Policy — Search.ai

## Threat Model & Protections

### 1. API Keys & Secrets
All server-side secrets (`SUPABASE_SERVICE_ROLE_KEY`, `GOOGLE_GENERATIVE_AI_API_KEY`, `RAZORPAY_KEY_SECRET`, `STRIPE_SECRET_KEY`) are protected using Next.js `server-only` guards. They are never imported or exposed to client-side bundles.

### 2. Row Level Security (RLS)
PostgreSQL tables enforce strict tenant separation via Supabase RLS. Users can only query and mutate their own profile, decision briefs, and action plans (`auth.uid() = user_id`).

### 3. Payment Webhook Security
Razorpay and Stripe webhooks verify HMAC signatures before updating user subscription states. Direct client payment success callbacks are never trusted.

### 4. Rate Limiting & Quota Shields
API routes enforce sliding window rate limiting via Upstash Redis (with in-memory local dev fallbacks) to shield endpoints against cost abuse and scraping.

### 5. Input Validation & Prompt Injection
All user inputs are parsed via Zod schemas. AI responses are strictly validated against JSON schemas with system prompts prohibiting medical, legal, or investment advice.
