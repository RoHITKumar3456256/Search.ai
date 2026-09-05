import "server-only";
import { DecisionInput, DecisionBrief } from "./types";
import { SYSTEM_PROMPT } from "./prompts";

import { searchLiveWeb } from "./tavily";

export async function generateGeminiDecision(input: DecisionInput): Promise<DecisionBrief> {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) throw new Error("Missing Gemini API Key");

  // Step 1: Perform live web search via Tavily for real-time citations & 2026 data
  const liveData = await searchLiveWeb(input.query);
  const webContext = liveData?.rawContext
    ? `\n\nLIVE VERIFIED WEB EVIDENCE (Ground your verdict on this factual data):\n${liveData.rawContext}`
    : "";

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: `${SYSTEM_PROMPT}${webContext}\n\nUser Problem Statement: ${input.query}` }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: "application/json"
        }
      })
    }
  );

  if (!response.ok) throw new Error(`Gemini API error status: ${response.status}`);
  const data = await response.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
  const cleanedText = rawText.replace(/```json|```/g, "").trim();
  const brief: DecisionBrief = JSON.parse(cleanedText);

  // If the model returned empty or minimal sources, inject our verified Tavily sources
  if ((!brief.sources || brief.sources.length === 0) && liveData?.sources?.length) {
    brief.sources = liveData.sources;
  }

  return brief;
}
