-- Migration 002: Row Level Security (RLS) Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.decision_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.action_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. Profiles RLS
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- 2. Projects RLS
CREATE POLICY "Users manage own projects" ON public.projects FOR ALL USING (auth.uid() = user_id);

-- 3. Decisions RLS
CREATE POLICY "Users manage own decisions" ON public.decisions FOR ALL USING (auth.uid() = user_id);

-- 4. Action Plans RLS
CREATE POLICY "Users manage own action plans" ON public.action_plans FOR ALL USING (auth.uid() = user_id);

-- 5. Usage Daily RLS
CREATE POLICY "Users view own usage" ON public.usage_daily FOR SELECT USING (auth.uid() = user_id);

-- 6. Subscriptions RLS
CREATE POLICY "Users view own subscriptions" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);

-- 7. Audit Logs RLS (Users can view own logs, direct client insert disallowed)
CREATE POLICY "Users view own audit logs" ON public.audit_logs FOR SELECT USING (auth.uid() = user_id);

-- 8. Public Directory Tables (Tools, Prices, Sources - Read Only for authenticated users)
CREATE POLICY "Authenticated users view active tools" ON public.tools FOR SELECT USING (is_active = true);
CREATE POLICY "Authenticated users view tool prices" ON public.tool_prices FOR SELECT USING (true);
CREATE POLICY "Authenticated users view sources" ON public.sources FOR SELECT USING (true);

-- 9. Decision Sources RLS (Access only if decision belongs to authenticated user)
CREATE POLICY "Users view sources for own decisions" ON public.decision_sources FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.decisions d WHERE d.id = decision_id AND d.user_id = auth.uid()
  )
);
