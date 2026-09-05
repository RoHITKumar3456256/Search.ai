export interface DecisionInput {
  query: string;
  budget?: string;
  experience?: string;
  priority?: string;
  location?: string;
  language: 'en' | 'hi' | 'hinglish';
  mode: 'standard' | 'deep';
}

export interface ToolRecommendation {
  title: string;
  reason: string;
  tools: string[];
  logoUrls?: string[];
}

export interface SourceCitation {
  title: string;
  url: string;
  publisher?: string;
  retrievedAt?: string;
  claimSummary?: string;
}

export interface DecisionBrief {
  category: string;
  confidence: 'low' | 'medium' | 'high';
  summary: string;
  recommendedPath: string;
  estimatedCost: string;
  bestFit: ToolRecommendation;
  bestValue: ToolRecommendation;
  alternative: ToolRecommendation;
  whyItFits: string[];
  tradeoffs: string[];
  actionPlan: string[];
  followUpQuestions: string[];
  safetyNotice?: string;
  sources: SourceCitation[];
}
