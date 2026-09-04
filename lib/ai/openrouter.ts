import "server-only";
import { DecisionInput, DecisionBrief } from "./types";
import { SYSTEM_PROMPT } from "./prompts";

export async function generateOpenRouterDecision(input: DecisionInput): Promise<DecisionBrief> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("Missing OpenRouter API Key");

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "anthropic/claude-3.5-sonnet",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: input.query }
      ]
    })
  });

  if (!response.ok) throw new Error(`OpenRouter API error status: ${response.status}`);
  const data = await response.json();
  const rawText = data.choices?.[0]?.message?.content || "{}";
  const cleanedText = rawText.replace(/```json|```/g, "").trim();
  return JSON.parse(cleanedText);
}
