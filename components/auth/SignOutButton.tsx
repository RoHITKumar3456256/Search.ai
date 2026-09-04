"use client";

import { createClient } from "@/lib/supabase/browser";

export default function SignOutButton() {
  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch (e) {
      // Ignore fallback
    }
    window.location.href = "/login";
  };

  return (
    <button
      onClick={handleSignOut}
      className="text-xs text-stone-400 hover:text-stone-200 border border-stone-800 bg-stone-900/50 hover:bg-stone-800 px-3 py-1.5 rounded-lg transition"
    >
      Sign Out
    </button>
  );
}
