import "server-only";
import { DecisionInput, DecisionBrief } from "./types";
import { SYSTEM_PROMPT } from "./prompts";

export async function generateGeminiDecision(input: DecisionInput): Promise<DecisionBrief> {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) throw new Error("Missing Gemini API Key");

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: `${SYSTEM_PROMPT}\n\nUser Problem Statement: ${input.query}` }
            ]
          }
        ]
      })
    }
  );

  if (!response.ok) throw new Error(`Gemini API error status: ${response.status}`);
  const data = await response.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
  const cleanedText = rawText.replace(/```json|```/g, "").trim();
  return JSON.parse(cleanedText);
}
