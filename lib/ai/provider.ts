import "server-only";
import { DecisionInput, DecisionBrief } from "./types";
import { decisionBriefSchema } from "./schemas";
import { generateGeminiDecision } from "./gemini";
import { generateGroqDecision } from "./groq";
import { generateOpenRouterDecision } from "./openrouter";
import { generateOllamaDecision } from "./ollama";
import { generateMockDecision } from "./mock";

export async function generateDecisionBrief(input: DecisionInput): Promise<{ brief: DecisionBrief; provider: string; model: string }> {
  // 1. Try Gemini
  if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    try {
      const brief = await generateGeminiDecision(input);
      const validated = decisionBriefSchema.parse(brief);
      return { brief: validated, provider: "gemini", model: "gemini-2.5-flash" };
    } catch (e) {
      console.warn("Gemini provider failed, falling back to Groq...", e);
    }
  }

  // 2. Try Groq
  if (process.env.GROQ_API_KEY) {
    try {
      const brief = await generateGroqDecision(input);
      const validated = decisionBriefSchema.parse(brief);
      return { brief: validated, provider: "groq", model: "llama3-70b-8192" };
    } catch (e) {
      console.warn("Groq provider failed, falling back to OpenRouter...", e);
    }
  }

  // 3. Try OpenRouter
  if (process.env.OPENROUTER_API_KEY) {
    try {
      const brief = await generateOpenRouterDecision(input);
      const validated = decisionBriefSchema.parse(brief);
      return { brief: validated, provider: "openrouter", model: "claude-3.5-sonnet" };
    } catch (e) {
      console.warn("OpenRouter provider failed, falling back to Ollama...", e);
    }
  }

  // 4. Try Ollama (Local Dev)
  if (process.env.OLLAMA_BASE_URL) {
    try {
      const brief = await generateOllamaDecision(input);
      const validated = decisionBriefSchema.parse(brief);
      return { brief: validated, provider: "ollama", model: "llama3" };
    } catch (e) {
      console.warn("Ollama provider failed, falling back to Mock Provider...", e);
    }
  }

  // 5. Mock Fallback (Guaranteed to work without API keys)
  const mockBrief = generateMockDecision(input);
  return { brief: mockBrief, provider: "mock", model: "search-ai-mock-v1" };
}
