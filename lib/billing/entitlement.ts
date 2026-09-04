import "server-only";
import { getUserProfile } from "../auth/profile";

export async function getUserEntitlement(userId: string) {
  const profile = await getUserProfile(userId);
  return {
    plan: profile?.plan || 'free',
    onboarded: profile?.onboarding_completed || false,
  };
}
