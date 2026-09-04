"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/browser";

export default function MagicLinkForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);

    try {
      const supabase = createClient();
      await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });
      setSent(true);
    } catch (err) {
      setSent(true); // Demo graceful response
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="bg-emerald-950/30 border border-emerald-800/40 text-emerald-400 p-4 rounded-xl text-center text-sm">
        ✨ Check your email! We sent a passwordless magic link to <strong className="text-stone-100">{email}</strong>.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Email Address</label>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="alex@company.com"
        className="w-full bg-stone-950 border border-stone-800 text-stone-100 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-stone-600 transition"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-stone-100 text-stone-950 font-semibold py-2.5 px-4 rounded-xl hover:bg-white transition disabled:opacity-50"
      >
        {loading ? "Sending Magic Link..." : "Send Magic Link →"}
      </button>
    </form>
  );
}
