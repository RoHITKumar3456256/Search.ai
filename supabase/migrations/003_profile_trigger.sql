-- Migration 003: Profile Trigger and Updated-At Helper
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Automatic Profile Creation Trigger on Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  safe_name TEXT;
  safe_avatar TEXT;
BEGIN
  -- Extract safe metadata from raw_user_meta_data
  safe_name := COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'User');
  safe_avatar := COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', NULL);

  INSERT INTO public.profiles (id, full_name, avatar_url, onboarding_completed, plan)
  VALUES (NEW.id, safe_name, safe_avatar, false, 'free')
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Drop trigger if exists for idempotency
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Apply updated_at triggers
DROP TRIGGER IF EXISTS update_profiles_modtime ON public.profiles;
CREATE TRIGGER update_profiles_modtime BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS update_decisions_modtime ON public.decisions;
CREATE TRIGGER update_decisions_modtime BEFORE UPDATE ON public.decisions FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
