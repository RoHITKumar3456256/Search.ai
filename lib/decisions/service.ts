import "server-only";
import { DecisionInput, DecisionBrief } from "../ai/types";
import { generateDecisionBrief } from "../ai/provider";
import { getToolLogoUrl } from "../ai/logos";

export async function processDecisionRequest(input: DecisionInput): Promise<{ brief: DecisionBrief; provider: string; model: string }> {
  const result = await generateDecisionBrief(input);
  const brief = result.brief;

  // Enrich recommendations with high-res logos
  if (brief.bestFit?.tools) {
    brief.bestFit.logoUrls = brief.bestFit.tools.map((tool) => getToolLogoUrl(tool));
  }
  if (brief.bestValue?.tools) {
    brief.bestValue.logoUrls = brief.bestValue.tools.map((tool) => getToolLogoUrl(tool));
  }
  if (brief.alternative?.tools) {
    brief.alternative.logoUrls = brief.alternative.tools.map((tool) => getToolLogoUrl(tool));
  }

  return result;
}
