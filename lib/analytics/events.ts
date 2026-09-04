export interface AnalyticsEvents {
  landing_viewed: Record<string, never>;
  login_started: { method: 'google' | 'magic_link' };
  login_completed: { userId: string };
  onboarding_completed: { userId: string; plan: string };
  decision_started: { category?: string; mode: 'standard' | 'deep' };
  decision_completed: { category: string; provider: string; model: string };
  decision_failed: { reason: string };
  comparison_opened: { toolCount: number };
  tool_opened: { toolSlug: string };
  sources_opened: { sourceCount: number };
  action_plan_saved: { stepCount: number };
  pricing_viewed: Record<string, never>;
  checkout_started: { plan: string; gateway: 'razorpay' | 'stripe' };
  checkout_completed: { plan: string; gateway: 'razorpay' | 'stripe' };
}
