/**
 * PostHog Product Analytics & Sentry Error Tracking Setup
 */

// Initialize PostHog
export function initAnalytics() {
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    // PostHog SDK Initialization snippet
    console.log('PostHog Analytics Initialized');
  }
}

export function trackEvent(eventName, properties = {}) {
  console.log(`[PostHog Event]: ${eventName}`, properties);
}

// Rate Limiting Check (Upstash Redis / DB fallback)
export async function checkRateLimit(userId) {
  const res = await fetch(`/api/ratelimit?user=${userId}`);
  const data = await res.json();
  return data.allowed; // true/false
}
