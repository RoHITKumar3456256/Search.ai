"use client";

import React, { useState } from "react";

export default function DecisionForm({ onSubmit, loading }: { onSubmit: (query: string, mode: "standard" | "deep") => void; loading: boolean }) {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<"standard" | "deep">("standard");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSubmit(query, mode);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-stone-900/60 border border-stone-800 rounded-2xl p-6 backdrop-blur-xl mb-8">
      <h2 className="text-lg font-bold text-stone-100 mb-2">New Decision Request</h2>
      <p className="text-xs text-stone-400 mb-4">Describe your stack or tool selection challenge. E.g. "I need an e-commerce platform under ₹10,000 for India".</p>
      
      <textarea
        rows={3}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter your constraints, budget, and project goal..."
        className="w-full bg-stone-950 border border-stone-800 text-stone-100 text-sm rounded-xl p-4 outline-none focus:border-stone-600 mb-4"
      />

      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-xs text-stone-300 cursor-pointer">
            <input type="radio" name="mode" checked={mode === "standard"} onChange={() => setMode("standard")} className="accent-emerald-400" />
            Standard Brief (Free)
          </label>
          <label className="flex items-center gap-2 text-xs text-stone-300 cursor-pointer">
            <input type="radio" name="mode" checked={mode === "deep"} onChange={() => setMode("deep")} className="accent-emerald-400" />
            Deep Matrix (12 Signals)
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-emerald-400 hover:bg-emerald-300 text-black font-bold px-5 py-2.5 rounded-xl text-sm transition disabled:opacity-50"
        >
          {loading ? "Generating Brief..." : "Map Options →"}
        </button>
      </div>
    </form>
  );
}
