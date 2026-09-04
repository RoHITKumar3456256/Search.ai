import "server-only";
import { DecisionInput, DecisionBrief } from "./types";
import { SYSTEM_PROMPT } from "./prompts";

export async function generateOllamaDecision(input: DecisionInput): Promise<DecisionBrief> {
  const baseUrl = process.env.OLLAMA_BASE_URL || "http://localhost:11434";

  const response = await fetch(`${baseUrl}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama3",
      prompt: `${SYSTEM_PROMPT}\n\nUser Problem: ${input.query}`,
      stream: false,
      format: "json"
    })
  });

  if (!response.ok) throw new Error(`Ollama API error status: ${response.status}`);
  const data = await response.json();
  return JSON.parse(data.response || "{}");
}
