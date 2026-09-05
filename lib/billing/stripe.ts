import "server-only";

export async function createStripeCheckoutSession(planId: string, userId: string, priceInCents: number = 499) {
  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  if (!stripeSecret) {
    return { mock: true, url: `${siteUrl}/dashboard?billing=mock_success` };
  }

  try {
    const params = new URLSearchParams();
    params.append("success_url", `${siteUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}`);
    params.append("cancel_url", `${siteUrl}/pricing`);
    params.append("payment_method_types[]", "card");
    params.append("mode", "payment");
    params.append("line_items[0][price_data][currency]", "usd");
    params.append("line_items[0][price_data][product_data][name]", `Search.ai ${planId.toUpperCase()} Subscription`);
    params.append("line_items[0][price_data][unit_amount]", priceInCents.toString());
    params.append("line_items[0][quantity]", "1");
    params.append("client_reference_id", userId);

    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeSecret}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    if (res.ok) {
      const data = await res.json();
      return { mock: false, url: data.url, sessionId: data.id };
    }
  } catch (e) {
    console.error("Stripe checkout session error:", e);
  }

  return { mock: true, url: `${siteUrl}/dashboard?billing=mock_success` };
}
