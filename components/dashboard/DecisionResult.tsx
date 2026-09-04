"use client";

import React from "react";
import { DecisionBrief } from "@/lib/ai/types";

export default function DecisionResult({ brief }: { brief: DecisionBrief }) {
  return (
    <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-6 backdrop-blur-xl flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-stone-800 pb-4">
        <div>
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">{brief.category}</span>
          <h3 className="text-xl font-extrabold text-white mt-1">{brief.bestFit.title}</h3>
        </div>
        <span className="px-3 py-1 bg-emerald-950/80 text-emerald-400 border border-emerald-800 text-xs font-bold rounded-full">
          Confidence: {brief.confidence.toUpperCase()}
        </span>
      </div>

      <p className="text-sm text-stone-300 leading-relaxed">{brief.summary}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-stone-950 p-4 rounded-xl border border-stone-800">
          <h4 className="text-xs font-bold text-emerald-400 uppercase mb-2">Why It Fits</h4>
          <ul className="text-xs text-stone-300 space-y-1">
            {brief.whyItFits.map((item, i) => <li key={i}>✓ {item}</li>)}
          </ul>
        </div>
        <div className="bg-stone-950 p-4 rounded-xl border border-stone-800">
          <h4 className="text-xs font-bold text-amber-400 uppercase mb-2">Key Trade-offs</h4>
          <ul className="text-xs text-stone-300 space-y-1">
            {brief.tradeoffs.map((item, i) => <li key={i}>⚠️ {item}</li>)}
          </ul>
        </div>
      </div>

      <div className="border-t border-stone-800 pt-4">
        <h4 className="text-xs font-bold text-stone-400 uppercase mb-3">7-Day Action Plan</h4>
        <div className="space-y-2">
          {brief.actionPlan.map((step, i) => (
            <div key={i} className="flex items-center gap-3 bg-stone-950 p-3 rounded-lg text-xs text-stone-200 border border-stone-800/60">
              <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center font-bold text-[10px]">
                {i + 1}
              </span>
              {step}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
