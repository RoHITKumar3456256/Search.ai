/**
 * Dual Payment Gateway Adapter
 * Razorpay (India: UPI, Netbanking, Cards) + Stripe (Global Cards & Subscriptions)
 */

// Razorpay Indian Payments Setup
export async function createRazorpaySubscription(planId, customerDetails) {
  const res = await fetch('/api/payments/razorpay/create-subscription', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ planId, customerDetails })
  });
  const session = await res.json();
  
  const options = {
    key: process.env.RAZORPAY_KEY_ID,
    subscription_id: session.id,
    name: "Search.ai",
    description: "Search.ai Plus / Pro Subscription",
    handler: function (response) {
      console.log("Razorpay Payment Success:", response.razorpay_payment_id);
    },
    theme: { color: "#4ADE80" }
  };
  
  return options;
}

// Stripe Global Checkout Setup
export async function createStripeCheckoutSession(priceId) {
  const res = await fetch('/api/payments/stripe/create-checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ priceId })
  });
  const session = await res.json();
  window.location.href = session.url;
}
