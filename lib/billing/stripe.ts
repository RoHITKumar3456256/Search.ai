import "server-only";

export async function createStripeCheckoutSession(planId: string, userId: string) {
  const stripeSecret = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecret) {
    return { mock: true, url: "http://localhost:3000/dashboard?billing=mock_success" };
  }

  // Real Stripe API call placeholder
  return { mock: false, url: "https://checkout.stripe.com/mock-session" };
}
