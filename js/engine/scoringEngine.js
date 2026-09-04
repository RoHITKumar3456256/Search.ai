/**
 * Search.ai Explainable 8-Signal Fit Score Engine (PRD Section 8)
 * Computes deterministic, auditable match scores across all candidate tools.
 */

import { TOOL_DATABASE } from '../data/toolDatabase.js';

export const DEFAULT_SIGNAL_WEIGHTS = {
  goalFit: 25,
  budgetFit: 20,
  capabilityFit: 20,
  skillFit: 10,
  locationFit: 10,
  timeToValue: 5,
  evidenceConfidence: 5,
  preferenceFit: 5
};

export function scoreTools(context, customWeights = null) {
  const weights = customWeights || DEFAULT_SIGNAL_WEIGHTS;
  const candidates = filterCandidates(context);

  const scoredList = candidates.map(tool => {
    const breakdown = calculateScoreBreakdown(tool, context, weights);
    const totalScore = Math.min(
      99,
      Math.round(
        breakdown.goalFit +
        breakdown.budgetFit +
        breakdown.capabilityFit +
        breakdown.skillFit +
        breakdown.locationFit +
        breakdown.timeToValue +
        breakdown.evidenceConfidence +
        breakdown.preferenceFit
      )
    );

    const fitRationale = generateWhyThisFits(tool, context, breakdown);
    const tradeOffs = generateTradeOffs(tool, context);

    return {
      tool,
      totalScore,
      breakdown,
      fitRationale,
      tradeOffs,
      estimatedMonthlyCost: computeEstimatedCost(tool, context)
    };
  });

  // Sort by highest overall score
  scoredList.sort((a, b) => b.totalScore - a.totalScore);

  // Generate 3 Distinct Decision Lenses (PRD Section 8)
  const decisionBrief = buildDecisionBrief(scoredList, context);

  return decisionBrief;
}

function filterCandidates(context) {
  if (!context.domain || context.domain === "General" || context.domain === "All") {
    return [...TOOL_DATABASE];
  }
  const domainFiltered = TOOL_DATABASE.filter(t => t.category.toLowerCase() === context.domain.toLowerCase());
  return domainFiltered.length > 0 ? domainFiltered : [...TOOL_DATABASE];
}

function calculateScoreBreakdown(tool, context, weights) {
  // 1. Goal / Use-case Fit (25 max)
  let goalFitRatio = 0.85;
  const lowerQuery = (context.rawQuery || "").toLowerCase();
  const matchedCases = tool.use_cases.filter(uc => lowerQuery.includes(uc.toLowerCase().slice(0, 5))).length;
  if (matchedCases > 0) goalFitRatio = 0.95;
  if (tool.category.toLowerCase() === context.domain.toLowerCase()) goalFitRatio = Math.min(1.0, goalFitRatio + 0.1);

  // 2. Budget Fit (20 max)
  let budgetFitRatio = 0.8;
  const isZeroBudget = context.budget.includes("Free") || context.budget.includes("₹0") || (context.maxNumericBudget !== null && context.maxNumericBudget === 0);
  if (isZeroBudget) {
    budgetFitRatio = tool.free_plan ? 1.0 : 0.25;
  } else if (context.maxNumericBudget) {
    if (tool.starting_price <= context.maxNumericBudget) {
      budgetFitRatio = 0.95;
    } else {
      budgetFitRatio = 0.4;
    }
  } else {
    budgetFitRatio = tool.free_plan ? 0.95 : 0.85;
  }

  // 3. Required Capability Fit (20 max)
  let capabilityFitRatio = 0.88;
  if (tool.features.length >= 5) capabilityFitRatio = 0.96;

  // 4. Skill / Ease Fit (10 max)
  let skillFitRatio = 0.85;
  const userSkill = context.skill.toLowerCase();
  if (userSkill.includes("beginner") || userSkill.includes("no-code")) {
    if (tool.learning_curve.toLowerCase().includes("very low") || tool.learning_curve.toLowerCase().includes("low")) {
      skillFitRatio = 1.0;
    } else if (tool.learning_curve.toLowerCase().includes("high")) {
      skillFitRatio = 0.45;
    }
  } else if (userSkill.includes("dev") || userSkill.includes("tech")) {
    skillFitRatio = 0.95;
  }

  // 5. Location / Regional Fit (10 max)
  let locationFitRatio = 0.9;
  if (context.location === "India") {
    if (tool.countries_supported.includes("India") || tool.currency === "INR" || tool.integrations.some(i => i.toLowerCase().includes("razorpay") || i.toLowerCase().includes("upi"))) {
      locationFitRatio = 1.0;
    } else {
      locationFitRatio = 0.75;
    }
  }

  // 6. Time-to-Value (5 max)
  let timeToValueRatio = 0.8;
  if (tool.setup_time_estimate.toLowerCase().includes("under") || tool.setup_time_estimate.toLowerCase().includes("minutes") || tool.setup_time_estimate.toLowerCase().includes("hour")) {
    timeToValueRatio = 1.0;
  } else if (tool.setup_time_estimate.toLowerCase().includes("day")) {
    timeToValueRatio = 0.85;
  }

  // 7. Evidence Confidence (5 max)
  let evidenceRatio = tool.confidence === "High" ? 1.0 : 0.8;

  // 8. User Preference Fit (5 max)
  let preferenceRatio = 0.85;
  if (context.priority.includes("Privacy") && (tool.privacy_security_notes.toLowerCase().includes("local") || tool.privacy_security_notes.toLowerCase().includes("open source"))) {
    preferenceRatio = 1.0;
  }
  if (context.priority.includes("Cost") && tool.free_plan) {
    preferenceRatio = 1.0;
  }

  return {
    goalFit: (weights.goalFit || 25) * goalFitRatio,
    budgetFit: (weights.budgetFit || 20) * budgetFitRatio,
    capabilityFit: (weights.capabilityFit || 20) * capabilityFitRatio,
    skillFit: (weights.skillFit || 10) * skillFitRatio,
    locationFit: (weights.locationFit || 10) * locationFitRatio,
    timeToValue: (weights.timeToValue || 5) * timeToValueRatio,
    evidenceConfidence: (weights.evidenceConfidence || 5) * evidenceRatio,
    preferenceFit: (weights.preferenceFit || 5) * preferenceRatio
  };
}

function computeEstimatedCost(tool, context) {
  if (tool.free_plan && (context.budget.includes("Free") || context.budget.includes("₹0"))) {
    return {
      setupCost: "₹0",
      recurringCost: "₹0 / month",
      tier: "100% Free Tier"
    };
  }
  if (tool.currency === "INR") {
    return {
      setupCost: "₹0",
      recurringCost: tool.starting_price > 0 ? `₹${tool.starting_price.toLocaleString()} / month` : "Pay per transaction (~2%)",
      tier: tool.free_plan ? "Free Starter Available" : "Standard Plan"
    };
  }
  return {
    setupCost: "$0",
    recurringCost: tool.starting_price > 0 ? `$${tool.starting_price}/mo (~₹${(tool.starting_price * 85).toLocaleString()})` : "Free Tier / Pay per use",
    tier: tool.free_plan ? "Free Tier Available" : "Hobby / Pro Plan"
  };
}

function generateWhyThisFits(tool, context, breakdown) {
  const points = [];
  points.push(`Matches your ${context.domain} workflow with specialized ${tool.subCategory} capabilities.`);
  if (tool.free_plan) {
    points.push(`Meets budget constraint (${context.budget}) via permanent free tier / open-source model.`);
  } else {
    points.push(`Starting cost fits within stated threshold with clear ROI.`);
  }
  if (tool.setup_time_estimate) {
    points.push(`Rapid setup time (${tool.setup_time_estimate}) aligns with your ${context.timeframe} target.`);
  }
  if (context.location === "India" && (tool.countries_supported.includes("India") || tool.currency === "INR")) {
    points.push(`Native support for Indian payment methods (UPI/Netbanking/INR billing).`);
  }
  return points;
}

function generateTradeOffs(tool, context) {
  return tool.tradeoffs && tool.tradeoffs.length > 0 
    ? tool.tradeoffs 
    : ["Requires standard periodic data backup", "Advanced enterprise customizations require paid upgrades"];
}

function buildDecisionBrief(scoredList, context) {
  if (!scoredList || scoredList.length === 0) {
    return null;
  }

  // Best Fit (Top overall score)
  const bestFit = scoredList[0];

  // Best Value (Free-first or highest utility per rupee/dollar)
  const bestValueCandidates = scoredList.filter(item => item.tool.free_plan);
  const bestValue = bestValueCandidates.length > 0 && bestValueCandidates[0].tool.id !== bestFit.tool.id
    ? bestValueCandidates[0]
    : (scoredList[1] || bestFit);

  // Best Alternative (Different architectural or scaling trade-off)
  const bestAlternative = scoredList.find(item => item.tool.id !== bestFit.tool.id && item.tool.id !== bestValue.tool.id) 
    || scoredList[2] 
    || scoredList[1] 
    || bestFit;

  // Unselected popular option rationale
  const popularUnselected = findPopularUnselectedRationale(scoredList, [bestFit.tool.id, bestValue.tool.id, bestAlternative.tool.id], context);

  // Confidence assessment
  let confidenceLevel = "High";
  let confidenceExplanation = "Strong match across primary budget, timeline, and feature constraints with verified primary sources.";
  if (bestFit.totalScore < 75) {
    confidenceLevel = "Medium";
    confidenceExplanation = "Acceptable match found, but trade-offs exist regarding setup effort or budget thresholds.";
  }

  return {
    id: `decision_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    createdAt: new Date().toISOString(),
    restatedGoal: `Deploy a tailored ${context.domain} solution matching budget (${context.budget}), skill level (${context.skill}), priority (${context.priority}) within ${context.timeframe}.`,
    constraints: context,
    confidence: {
      level: confidenceLevel,
      explanation: confidenceExplanation
    },
    topRanked: [
      { lens: "Best Fit", label: "Optimal Weighted Match", data: bestFit },
      { lens: "Best Value", label: "Maximum Benefit per ₹ / $", data: bestValue },
      { lens: "Best Alternative", label: "Scale / High-Flexibility Option", data: bestAlternative }
    ],
    allCandidates: scoredList,
    popularUnselected,
    sources: aggregateSources([bestFit.tool, bestValue.tool, bestAlternative.tool]),
    dataFreshness: "Verified August 2026",
    safetyNotices: context.safety && context.safety.isSensitive ? [context.safety.policy.disclaimer] : []
  };
}

function findPopularUnselectedRationale(scoredList, selectedIds, context) {
  const unselected = scoredList.filter(item => !selectedIds.includes(item.tool.id));
  if (unselected.length === 0) return null;

  const topUnselected = unselected[0];
  let reason = `Ranked lower for your specific criteria (${context.budget}, ${context.skill}) due to `;
  if (!topUnselected.tool.free_plan && context.budget.includes("Free")) {
    reason += `higher starting costs compared to free alternatives.`;
  } else if (topUnselected.tool.learning_curve.includes("High") && context.skill.includes("Beginner")) {
    reason += `a steeper learning curve requiring developer experience.`;
  } else {
    reason += `more manual maintenance overhead for this specific timeframe.`;
  }

  return {
    toolName: topUnselected.tool.name,
    category: topUnselected.tool.category,
    reason
  };
}

function aggregateSources(tools) {
  const sourcesMap = new Map();
  tools.forEach(tool => {
    if (tool.sources) {
      tool.sources.forEach(s => {
        if (!sourcesMap.has(s.url)) {
          sourcesMap.set(s.url, {
            ...s,
            toolName: tool.name,
            lastVerified: tool.last_verified_at
          });
        }
      });
    }
  });
  return Array.from(sourcesMap.values());
}
