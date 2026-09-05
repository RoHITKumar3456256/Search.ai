"use client";

import React, { useState } from "react";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import MagicLinkForm from "@/components/auth/MagicLinkForm";
import { createClient } from "@/lib/supabase/browser";

export default function LoginPage() {
  const [authMode, setAuthMode] = useState<"password" | "magic">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const handlePasswordAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const supabase = createClient();
      // Try sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // If user doesn't exist, try auto sign up
        if (error.message.toLowerCase().includes("invalid login credentials")) {
          const signUpRes = await supabase.auth.signUp({
            email,
            password,
          });

          if (signUpRes.error) {
            setMessage({ text: signUpRes.error.message, isError: true });
          } else {
            setMessage({ text: "Account created successfully! Redirecting...", isError: false });
            setTimeout(() => {
              window.location.href = "/dashboard";
            }, 1000);
          }
        } else {
          setMessage({ text: error.message, isError: true });
        }
      } else if (data.user) {
        setMessage({ text: "Signed in successfully! Redirecting...", isError: false });
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 800);
      }
    } catch (err: any) {
      setMessage({ text: err.message || "Failed to authenticate", isError: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6EC] text-[#1E1A17] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-white border border-[#E8E1D3] rounded-3xl p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-[#1B9AAA] flex items-center justify-center text-white shadow-sm">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="11" cy="11" r="6"/>
              <line x1="16" y1="16" x2="20" y2="20"/>
            </svg>
          </div>
          <span className="font-extrabold text-xl tracking-tight text-[#1E1A17]">Search.ai</span>
        </div>

        <h1 className="text-2xl font-extrabold tracking-tight text-[#1E1A17] mb-2">Welcome Back</h1>
        <p className="text-sm text-[#5C554E] mb-6">Sign in to access your saved decision briefs, workspace, and tool comparisons.</p>

        {message && (
          <div className={`p-3 rounded-xl text-sm mb-4 border ${message.isError ? 'bg-red-50 text-red-700 border-red-200' : 'bg-teal-50 text-teal-800 border-teal-200'}`}>
            {message.text}
          </div>
        )}

        {/* Tab switcher */}
        <div className="flex gap-2 p-1 bg-[#F5EFE1] rounded-full mb-6 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setAuthMode("password")}
            className={`flex-1 py-1.5 rounded-full transition ${authMode === "password" ? "bg-white text-[#1E1A17] shadow-sm" : "text-[#8A8177]"}`}
          >
            Email & Password
          </button>
          <button
            type="button"
            onClick={() => setAuthMode("magic")}
            className={`flex-1 py-1.5 rounded-full transition ${authMode === "magic" ? "bg-white text-[#1E1A17] shadow-sm" : "text-[#8A8177]"}`}
          >
            Magic Link
          </button>
        </div>

        {authMode === "password" ? (
          <form onSubmit={handlePasswordAuth} className="flex flex-col gap-3">
            <div>
              <label className="text-xs font-bold text-[#5C554E] uppercase tracking-wider block mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="founder@example.com"
                className="w-full bg-[#FAF6EC] border border-[#E8E1D3] text-[#1E1A17] text-sm rounded-xl px-4 py-2.5 outline-none focus:border-[#1B9AAA] transition"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#5C554E] uppercase tracking-wider block mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#FAF6EC] border border-[#E8E1D3] text-[#1E1A17] text-sm rounded-xl px-4 py-2.5 outline-none focus:border-[#1B9AAA] transition"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1B9AAA] hover:bg-[#147B88] text-white font-semibold py-2.5 px-4 rounded-full transition disabled:opacity-50 mt-2 shadow-sm"
            >
              {loading ? "Signing in..." : "Continue to Search.ai →"}
            </button>
          </form>
        ) : (
          <MagicLinkForm />
        )}

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#E8E1D3]"></div></div>
          <span className="relative bg-white px-3 text-xs font-semibold uppercase text-[#8A8177]">or third-party</span>
        </div>

        <GoogleSignInButton />

        <p className="text-xs text-[#8A8177] text-center mt-6">
          By continuing, you agree to Search.ai Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
