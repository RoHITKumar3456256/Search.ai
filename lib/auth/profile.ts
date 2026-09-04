import "server-only";
import { createClient } from "../supabase/server";

export interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  locale: string;
  country_code: string | null;
  onboarding_completed: boolean;
  plan: 'free' | 'plus' | 'pro' | 'teams';
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !data) return null;
  return data as UserProfile;
}

export async function updateOnboardingProfile(userId: string, data: {
  full_name: string;
  locale?: string;
  country_code?: string;
}) {
  const supabase = createClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: data.full_name,
      locale: data.locale || 'en',
      country_code: data.country_code || null,
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (error) throw error;
}
