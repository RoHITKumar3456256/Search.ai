/**
 * Search.ai Trust, Safety & Responsible AI Policies (Section 10 of PRD v1.0)
 * Detects sensitive/high-stakes intent and provides appropriate boundary guidance & disclaimers.
 */

export const HIGH_STAKES_POLICIES = {
  medical: {
    domain: "Medical / Health",
    keywords: ["diagnose", "symptoms", "cure", "prescription", "disease", "treatment", "medicine", "doctor", "illness", "bimari", "ilaj", "dawa"],
    allowedScope: "General wellness education, habit trackers, and reputable public health reference directories.",
    prohibitedScope: "Clinical medical diagnosis, drug prescription recommendations, or emergency triage advice.",
    disclaimer: "⚠️ Medical Boundary Notice: Search.ai provides educational tool information and productivity workflows only. This is not medical advice or clinical diagnosis. For any health concerns or emergencies, please consult a certified healthcare professional immediately."
  },
  legal: {
    domain: "Legal & Regulatory",
    keywords: ["lawsuit", "court", "sue", "legal advice", "divorce", "bail", "criminal", "vakil", "kanoon", "trademark dispute"],
    allowedScope: "General legal document templates, contract storage tools, and publicly available statutory guides.",
    prohibitedScope: "Formal legal counsel, court filing representations, or binding legal advice.",
    disclaimer: "⚖️ Legal Information Disclaimer: Search.ai is an informational tool comparison platform and does not provide formal legal representation or advice. Legal requirements vary across jurisdictions. Consult a qualified attorney for specific legal matters."
  },
  finance_investing: {
    domain: "Financial & Investment",
    keywords: ["stock tip", "crypto pump", "buy calls", "guaranteed return", "get rich", "tax evasion", "future options", "share market tip", "multibagger"],
    allowedScope: "Budgeting calculators, personal expense organizers, invoice trackers, and open financial literacy curricula.",
    prohibitedScope: "Personalized stock buy/sell tips, guaranteed investment returns, or certified chartered tax advice.",
    disclaimer: "📈 Financial Literacy Notice: Content provided relates to budgeting tools and open educational resources. It does not constitute certified financial or investment advice. Investments carry market risks; please verify with a certified SEBI/financial advisor."
  },
  employment_guarantee: {
    domain: "Employment & Career",
    keywords: ["guaranteed job", "100% placement", "fake certificate", "buy degree", "job guarantee", "naukri pakki"],
    allowedScope: "Portfolio builders, resume formatting tools, meeting schedulers, and skill roadmap organizers.",
    prohibitedScope: "Fabricated qualifications or guarantees of hiring outcomes.",
    disclaimer: "💼 Truthfulness Reminder: Search.ai assists with tool discovery and portfolio workflows. We do not endorse fabricated credentials or guarantee employment placement."
  }
};

export function checkSafetyPolicies(queryText = "") {
  const normalized = queryText.toLowerCase();
  for (const [key, policy] of Object.entries(HIGH_STAKES_POLICIES)) {
    for (const kw of policy.keywords) {
      if (normalized.includes(kw.toLowerCase())) {
        return {
          isSensitive: true,
          categoryKey: key,
          policy
        };
      }
    }
  }
  return { isSensitive: false, policy: null };
}
