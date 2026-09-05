import "server-only";

export async function createRazorpayOrder(planId: string, userId: string, amountPaise: number = 29900) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return { mock: true, orderId: `order_mock_${Date.now()}`, amount: amountPaise, currency: "INR" };
  }

  try {
    const authHeader = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
    const res = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${authHeader}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amountPaise,
        currency: "INR",
        receipt: `rcpt_${userId.slice(0, 10)}_${Date.now().toString().slice(-6)}`,
        notes: { planId, userId },
      }),
    });

    if (res.ok) {
      const data = await res.json();
      return { mock: false, orderId: data.id, amount: data.amount, currency: data.currency };
    }
  } catch (e) {
    console.error("Razorpay order creation error:", e);
  }

  return { mock: true, orderId: `order_fallback_${Date.now()}`, amount: amountPaise, currency: "INR" };
}
