import "server-only";
import { DecisionInput, DecisionBrief } from "../ai/types";
import { generateDecisionBrief } from "../ai/provider";

export async function processDecisionRequest(input: DecisionInput): Promise<{ brief: DecisionBrief; provider: string; model: string }> {
  return await generateDecisionBrief(input);
}
