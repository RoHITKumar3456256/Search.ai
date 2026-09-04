import "server-only";
import { DecisionInput, DecisionBrief } from "./types";
import { SYSTEM_PROMPT } from "./prompts";

export async function generateGroqDecision(input: DecisionInput): Promise<DecisionBrief> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("Missing Groq API Key");

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama3-70b-8192",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: input.query }
      ]
    })
  });

  if (!response.ok) throw new Error(`Groq API error status: ${response.status}`);
  const data = await response.json();
  const rawText = data.choices?.[0]?.message?.content || "{}";
  return JSON.parse(rawText);
}
