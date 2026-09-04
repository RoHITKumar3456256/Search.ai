# Search.ai — Decision Intelligence Platform

Search.ai is a decision-intelligence platform designed for founders, students, and freelancers to make evidence-grounded software and architecture decisions.

## Features & Architecture
- **Supabase Auth**: Google OAuth 2.0 and passwordless Magic Link email authentication.
- **Multi-Engine AI Routing**: Primary execution via Gemini 1.5 Flash / Groq, fallback to OpenRouter (Claude 3.5 Sonnet / Llama 3) and local Ollama.
- **Mock Engine**: Fallback mock mode allowing local development without paid API keys.
- **Payments**: Dual billing support via Razorpay (India) and Stripe (Global).
- **PostHog Analytics**: Privacy-first event capture with masked inputs.

## Setup Instructions

### 1. Environment Setup
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

### 2. Run Database Migrations
Execute the migration scripts in order using the Supabase SQL Editor:
1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/migrations/002_rls_policies.sql`
3. `supabase/migrations/003_profile_trigger.sql`

### 3. Setup Google OAuth in Supabase
1. Go to Google Cloud Console → APIs & Services → Credentials.
2. Create OAuth 2.0 Client ID.
3. Set Authorized Redirect URI: `https://<your-project-id>.supabase.co/auth/v1/callback`
4. Add Client ID & Secret into Supabase Auth Provider settings.

### 4. Run Development Server
```bash
npm run dev
```

### What NOT to commit
Never commit `.env.local` or raw API keys to Git repositories.
