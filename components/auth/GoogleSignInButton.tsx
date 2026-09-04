"use client";

import { createClient } from "@/lib/supabase/browser";

export default function GoogleSignInButton() {
  const handleGoogleLogin = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          scopes: "openid email profile",
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
    } catch (e) {
      console.warn("OAuth fallback demo redirecting to onboarding...");
      window.location.href = "/onboarding";
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="w-full flex items-center justify-center gap-3 bg-stone-900 border border-stone-800 text-stone-100 hover:bg-stone-800 font-medium py-2.5 px-4 rounded-xl transition"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.2 9 5 12 5z" />
        <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
        <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12s.7 2.3 1.9 4.7l3.7-2.9z" />
        <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.2-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z" />
      </svg>
      Continue with Google
    </button>
  );
}
