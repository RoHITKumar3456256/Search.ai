import { DecisionInput, DecisionBrief } from "./types";

export function generateMockDecision(input: DecisionInput): DecisionBrief {
  const queryLower = input.query.toLowerCase();
  let category = "Software & Tech Stack";

  if (queryLower.includes("ecommerce") || queryLower.includes("store") || queryLower.includes("sell")) {
    category = "E-Commerce Infrastructure";
  } else if (queryLower.includes("database") || queryLower.includes("sql") || queryLower.includes("postgres")) {
    category = "Database Architecture";
  }

  return {
    category,
    confidence: "high",
    summary: `Structured evaluation for problem: "${input.query}". Recommendation curated based on budget constraint of ${input.budget || "default"} and 8-signal scoring algorithm.`,
    recommendedPath: "Deploy Dukaan / WooCommerce for Indian market entry with instant UPI integration.",
    estimatedCost: "₹699 / month (recurring) + 0% platform transaction fees",
    bestFit: {
      title: "Best Fit: Dukaan",
      reason: "Optimal zero-code Indian e-commerce platform with native WhatsApp & Razorpay UPI integrations.",
      tools: ["Dukaan", "WooCommerce"]
    },
    bestValue: {
      title: "Best Value: WooCommerce",
      reason: "Open-source WordPress plugin with zero software subscription costs.",
      tools: ["WooCommerce", "WordPress"]
    },
    alternative: {
      title: "Scale Alternative: Shopify",
      reason: "Global market leader but higher monthly cost starting at ₹1,999/mo.",
      tools: ["Shopify"]
    },
    whyItFits: [
      "Fits budget requirement under ₹10,000 completely.",
      "Requires zero prior programming or website setup experience.",
      "Native Indian payment gateway integration (UPI Autopay & Cards)."
    ],
    tradeoffs: [
      "Custom UI flexibility is limited compared to custom Next.js builds.",
      "Higher transaction percentage on base free plans."
    ],
    actionPlan: [
      "Day 1: Create Dukaan account & complete Indian GST/KYC verification.",
      "Day 2: Connect Razorpay / Paytm UPI payment gateway.",
      "Day 3: Add product catalog & set up WhatsApp Order Notifications.",
      "Day 7: Launch live site and publish domain."
    ],
    followUpQuestions: [
      "Do you require custom domain DNS pointing?",
      "Will you sell physical products or digital downloads?"
    ],
    safetyNotice: queryLower.includes("crypto") || queryLower.includes("invest") 
      ? "Safety Alert: Educational decision brief only. Not financial or investment advice." 
      : undefined,
    sources: [
      {
        title: "Dukaan Official Pricing 2026",
        url: "https://mydukaan.io/pricing",
        publisher: "Dukaan",
        retrievedAt: new Date().toISOString(),
        claimSummary: "Verified Indian subscription tier at ₹699/month."
      }
    ]
  };
}
