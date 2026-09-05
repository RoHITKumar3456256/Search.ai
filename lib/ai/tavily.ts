import "server-only";
import { SourceCitation } from "./types";

export interface TavilySearchResult {
  answer?: string;
  sources: SourceCitation[];
  rawContext: string;
}

export async function searchLiveWeb(query: string): Promise<TavilySearchResult | null> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: apiKey,
        query: `${query} latest tools pricing 2026`,
        search_depth: "basic",
        include_answer: true,
        max_results: 4,
      }),
    });

    if (!response.ok) {
      console.warn(`Tavily search returned status ${response.status}`);
      return null;
    }

    const data = await response.json();
    const results = data.results || [];

    const sources: SourceCitation[] = results.map((item: any) => {
      let hostname = "";
      try {
        hostname = new URL(item.url).hostname.replace("www.", "");
      } catch {
        hostname = "Web Source";
      }

      return {
        title: item.title || hostname,
        url: item.url,
        publisher: hostname,
        retrievedAt: new Date().toISOString(),
        claimSummary: item.content?.slice(0, 180) || "",
      };
    });

    const contextSnippets = results
      .map((r: any) => `Source: ${r.title} (${r.url})\nInfo: ${r.content}`)
      .join("\n\n");

    return {
      answer: data.answer || undefined,
      sources,
      rawContext: contextSnippets,
    };
  } catch (error) {
    console.warn("Tavily live search error:", error);
    return null;
  }
}
