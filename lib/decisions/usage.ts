import "server-only";
import { PLAN_LIMITS } from "../constants";

// In-memory development usage fallback when database is absent
const inMemoryUsage = new Map<string, { date: string; standard: number; deep: number }>();

export async function checkAndIncrementUsage(userId: string, plan: 'free' | 'plus' | 'pro' | 'teams', mode: 'standard' | 'deep'): Promise<boolean> {
  const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.free;
  const today = new Date().toISOString().split("T")[0];

  const userUsage = inMemoryUsage.get(userId) || { date: today, standard: 0, deep: 0 };

  if (userUsage.date !== today) {
    userUsage.date = today;
    userUsage.standard = 0;
  }

  if (mode === "standard" && userUsage.standard >= limits.standardDaily) {
    return false;
  }
  if (mode === "deep" && userUsage.deep >= limits.deepMonthly) {
    return false;
  }

  if (mode === "standard") userUsage.standard += 1;
  if (mode === "deep") userUsage.deep += 1;

  inMemoryUsage.set(userId, userUsage);
  return true;
}
