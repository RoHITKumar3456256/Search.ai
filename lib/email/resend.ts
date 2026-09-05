import "server-only";

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions): Promise<{ success: boolean; id?: string; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY not configured, skipping email delivery.");
    return { success: false, error: "Missing RESEND_API_KEY" };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Search.ai <onboarding@resend.dev>", // Can be updated to custom domain e.g. hello@search.ai once verified
        to: [to],
        subject,
        html,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.message || "Failed to send email" };
    }

    return { success: true, id: data.id };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function sendWelcomeEmail(to: string, userName?: string) {
  const name = userName || "there";
  return await sendEmail({
    to,
    subject: "Welcome to Search.ai - Decision Intelligence",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #111; line-height: 1.6;">
        <h2 style="color: #0f172a; margin-bottom: 8px;">Welcome to Search.ai, ${name}!</h2>
        <p style="color: #475569;">You are now equipped with real-time AI decision intelligence.</p>
        <p>Search.ai helps founders and engineers evaluate software stacks, calculate real-world costs, and make high-stakes technical decisions backed by live web data.</p>
        <div style="margin: 24px 0;">
          <a href="https://search.ai/dashboard" style="background: #000; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 6px; display: inline-block; font-weight: 500;">
            Go to Your Dashboard
          </a>
        </div>
        <p style="font-size: 13px; color: #94a3b8;">Search.ai • Automated Decision Intelligence</p>
      </div>
    `,
  });
}
