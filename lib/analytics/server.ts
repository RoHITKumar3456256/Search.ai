import "server-only";

export function captureServerEvent(eventName: string, properties: Record<string, any> = {}) {
  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!posthogKey) return; // Silent skip if PostHog not configured

  // Sanitize sensitive user queries or payment details before capturing
  const safeProperties = { ...properties };
  delete safeProperties.query;
  delete safeProperties.email;
  delete safeProperties.cardNumber;

  console.log(`[PostHog Server Event]: ${eventName}`, safeProperties);
}
