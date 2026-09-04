"use client";

import React, { useState } from "react";
import SignOutButton from "../auth/SignOutButton";
import DecisionForm from "./DecisionForm";
import DecisionResult from "./DecisionResult";
import { DecisionBrief } from "@/lib/ai/types";

export default function DashboardShell({ isMock }: { isMock: boolean }) {
  const [result, setResult] = useState<DecisionBrief | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDecisionSubmit = async (query: string, mode: "standard" | "deep") => {
    setLoading(true);
    try {
      const res = await fetch("/api/decisions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, mode }),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-stone-100 p-6">
      <header className="max-w-6xl mx-auto flex items-center justify-between py-4 border-b border-stone-800 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-400 to-teal-400 flex items-center justify-center font-bold text-black text-sm">
            S
          </div>
          <span className="font-bold text-lg tracking-tight">Search.ai Workspace</span>
          {isMock && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-950/80 text-amber-400 border border-amber-800">
              Mock Mode (No API key)
            </span>
          )}
        </div>
        <SignOutButton />
      </header>

      <main className="max-w-4xl mx-auto">
        <DecisionForm onSubmit={handleDecisionSubmit} loading={loading} />
        {result && <DecisionResult brief={result} />}
      </main>
    </div>
  );
}
