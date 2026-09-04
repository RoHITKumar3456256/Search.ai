-- Migration 001: Initial Database Schema for Search.ai
-- Enable vector search extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  locale TEXT DEFAULT 'en',
  country_code TEXT,
  onboarding_completed BOOLEAN DEFAULT false,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'plus', 'pro', 'teams')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Decisions Table
CREATE TABLE IF NOT EXISTS public.decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  query TEXT NOT NULL,
  normalized_query TEXT,
  category TEXT,
  constraints JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'processing' CHECK (status IN ('draft', 'processing', 'complete', 'failed', 'archived')),
  confidence TEXT CHECK (confidence IN ('low', 'medium', 'high')),
  recommended_path TEXT,
  estimated_cost TEXT,
  result_json JSONB,
  model_provider TEXT,
  model_name TEXT,
  prompt_version TEXT DEFAULT 'v1.0',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tools Directory Table
CREATE TABLE IF NOT EXISTS public.tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  official_url TEXT NOT NULL,
  pricing_url TEXT,
  docs_url TEXT,
  best_for TEXT[],
  not_for TEXT[],
  setup_time TEXT,
  learning_curve INT CHECK (learning_curve BETWEEN 1 AND 10),
  countries_supported TEXT[],
  features JSONB DEFAULT '{}'::jsonb,
  tradeoffs JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  last_verified_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Tool Prices Table
CREATE TABLE IF NOT EXISTS public.tool_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id UUID NOT NULL REFERENCES public.tools(id) ON DELETE CASCADE,
  country_code TEXT,
  currency TEXT NOT NULL DEFAULT 'USD',
  amount NUMERIC(10,2),
  billing_cycle TEXT CHECK (billing_cycle IN ('monthly', 'annually', 'one_time', 'usage')),
  free_plan BOOLEAN DEFAULT false,
  price_notes TEXT,
  source_url TEXT,
  verified_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Sources Table
CREATE TABLE IF NOT EXISTS public.sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT UNIQUE NOT NULL,
  domain TEXT NOT NULL,
  title TEXT NOT NULL,
  publisher TEXT,
  source_type TEXT DEFAULT 'documentation',
  trust_tier INT CHECK (trust_tier BETWEEN 1 AND 5),
  retrieved_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Decision Sources Junction Table
CREATE TABLE IF NOT EXISTS public.decision_sources (
  decision_id UUID NOT NULL REFERENCES public.decisions(id) ON DELETE CASCADE,
  source_id UUID NOT NULL REFERENCES public.sources(id) ON DELETE CASCADE,
  claim_text TEXT,
  citation_number INT,
  PRIMARY KEY (decision_id, source_id)
);

-- 8. Action Plans Table
CREATE TABLE IF NOT EXISTS public.action_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_id UUID NOT NULL REFERENCES public.decisions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  steps JSONB DEFAULT '[]'::jsonb,
  completed_steps JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Daily Usage Table
CREATE TABLE IF NOT EXISTS public.usage_daily (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  usage_date DATE NOT NULL DEFAULT CURRENT_DATE,
  standard_queries INT DEFAULT 0,
  deep_queries INT DEFAULT 0,
  input_tokens INT DEFAULT 0,
  output_tokens INT DEFAULT 0,
  estimated_cost_usd NUMERIC(10,6) DEFAULT 0,
  CONSTRAINT unique_user_usage_date UNIQUE (user_id, usage_date)
);

-- 10. Subscriptions Table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('razorpay', 'stripe')),
  provider_customer_id TEXT,
  provider_subscription_id TEXT UNIQUE,
  plan TEXT NOT NULL CHECK (plan IN ('free', 'plus', 'pro', 'teams')),
  status TEXT NOT NULL,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  ip_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_decisions_user_created ON public.decisions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_decisions_user_status ON public.decisions(user_id, status);
CREATE INDEX IF NOT EXISTS idx_projects_user ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_daily_user_date ON public.usage_daily(user_id, usage_date DESC);
CREATE INDEX IF NOT EXISTS idx_tool_prices_tool_verified ON public.tool_prices(tool_id, verified_at DESC);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_status ON public.subscriptions(user_id, status);
