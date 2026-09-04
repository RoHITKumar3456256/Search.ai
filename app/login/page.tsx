"use client";

import React from "react";
import GoogleSignInButton from "./GoogleSignInButton";
import MagicLinkForm from "./MagicLinkForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-black text-stone-100 flex flex-col items-center justify-center p-6">
      <div className="w-full max-width-md max-w-md bg-stone-900/60 border border-stone-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-400 to-teal-400 flex items-center justify-center font-bold text-black text-sm">
            S
          </div>
          <span className="font-bold text-lg tracking-tight">Search.ai</span>
        </div>

        <h1 className="text-2xl font-extrabold tracking-tight text-white mb-2">Welcome Back</h1>
        <p className="text-sm text-stone-400 mb-8">Sign in to access your saved decision briefs, workspace, and tool comparisons.</p>

        <GoogleSignInButton />

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-stone-800"></div></div>
          <span className="relative bg-stone-900 px-3 text-xs font-semibold uppercase text-stone-500">or continue with email</span>
        </div>

        <MagicLinkForm />

        <p className="text-xs text-stone-500 text-center mt-8">
          By continuing, you agree to Search.ai Terms of Service and Privacy Policy. Zero sponsored rankings.
        </p>
      </div>
    </div>
  );
}
