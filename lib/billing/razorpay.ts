import "server-only";

export async function createRazorpayOrder(planId: string, userId: string) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return { mock: true, orderId: `order_mock_${Date.now()}`, amount: 29900, currency: "INR" };
  }

  // Real Razorpay API call placeholder
  return { mock: false, orderId: `order_rzp_${Date.now()}`, amount: 29900, currency: "INR" };
}
