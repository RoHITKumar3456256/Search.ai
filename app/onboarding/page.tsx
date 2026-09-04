"use client";

import { useState } from "react";

export default function OnboardingPage() {
  const [fullName, setFullName] = useState("");
  const [country, setCountry] = useState("IN");
  const [useCase, setUseCase] = useState("founder");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-screen bg-black text-stone-100 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg bg-stone-900/60 border border-stone-800 rounded-3xl p-8 backdrop-blur-xl">
        <h1 className="text-2xl font-bold text-white mb-2">Set Up Your Profile</h1>
        <p className="text-sm text-stone-400 mb-6">Customize Search.ai decision engine for your team's constraints.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold text-stone-400 uppercase tracking-wider block mb-1">Full Name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Alex Sharma"
              className="w-full bg-stone-950 border border-stone-800 text-stone-100 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-stone-600"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-400 uppercase tracking-wider block mb-1">Primary Country</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 text-stone-100 text-sm rounded-xl px-4 py-2.5 outline-none"
            >
              <option value="IN">India (UPI Payments & INR Pricing)</option>
              <option value="US">United States (USD Stripe Pricing)</option>
              <option value="GB">United Kingdom (GBP)</option>
              <option value="GLOBAL">Global / Other</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-400 uppercase tracking-wider block mb-1">Primary Goal / Role</label>
            <select
              value={useCase}
              onChange={(e) => setUseCase(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 text-stone-100 text-sm rounded-xl px-4 py-2.5 outline-none"
            >
              <option value="founder">Founder / Building SaaS MVP</option>
              <option value="freelancer">Freelancer / Client Work</option>
              <option value="student">Student / Academic Projects</option>
              <option value="enterprise">Enterprise Tech Lead</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-emerald-400 hover:bg-emerald-300 text-black font-bold py-3 rounded-xl transition"
          >
            Complete Onboarding & Enter Workspace →
          </button>
        </form>
      </div>
    </div>
  );
}
