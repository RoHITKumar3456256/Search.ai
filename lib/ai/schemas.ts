import { z } from "zod";

export const decisionInputSchema = z.object({
  query: z.string().min(3).max(1000),
  budget: z.string().optional(),
  experience: z.string().optional(),
  priority: z.string().optional(),
  location: z.string().optional(),
  language: z.enum(["en", "hi", "hinglish"]).default("en"),
  mode: z.enum(["standard", "deep"]).default("standard"),
});

export const toolRecommendationSchema = z.object({
  title: z.string(),
  reason: z.string(),
  tools: z.array(z.string()),
});

export const sourceCitationSchema = z.object({
  title: z.string(),
  url: z.string().url(),
  publisher: z.string().optional(),
  retrievedAt: z.string().optional(),
  claimSummary: z.string().optional(),
});

export const decisionBriefSchema = z.object({
  category: z.string(),
  confidence: z.enum(["low", "medium", "high"]),
  summary: z.string(),
  recommendedPath: z.string(),
  estimatedCost: z.string(),
  bestFit: toolRecommendationSchema,
  bestValue: toolRecommendationSchema,
  alternative: toolRecommendationSchema,
  whyItFits: z.array(z.string()),
  tradeoffs: z.array(z.string()),
  actionPlan: z.array(z.string()),
  followUpQuestions: z.array(z.string()),
  safetyNotice: z.string().optional(),
  sources: z.array(sourceCitationSchema),
});
