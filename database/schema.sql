-- Enable pgvector extension for AI similarity search
CREATE EXTENSION IF NOT EXISTS vector;

-- Users / Profiles Table (Linked with Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'starter', -- starter, plus, pro, teams
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tools Registry Table
CREATE TABLE IF NOT EXISTS public.tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  pricing_model TEXT NOT NULL,
  starting_price NUMERIC DEFAULT 0,
  has_free_tier BOOLEAN DEFAULT false,
  regional_support JSONB, -- {"india": true, "upi": true}
  eight_signal_scores JSONB, -- {"cost": 85, "privacy": 90, "latency": 95}
  embedding VECTOR(1536), -- Tool feature vector
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Decision Briefs Table
CREATE TABLE IF NOT EXISTS public.decision_briefs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  constraints JSONB, -- {"budget": 10000, "skill": "beginner"}
  top_recommendations JSONB,
  action_plan JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.decision_briefs ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can read and write only their own profiles and briefs
CREATE POLICY "Allow individual read access" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Allow individual write access" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Allow user decision briefs read" ON public.decision_briefs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow user decision briefs insert" ON public.decision_briefs FOR INSERT WITH CHECK (auth.uid() = user_id);
