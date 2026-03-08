import type { SynthesisOutput, ResearchOutput } from '../types';

interface ExaResult {
  title: string;
  url: string;
  text?: string;
}

interface ExaSearchResponse {
  results: ExaResult[];
}

export async function runResearchAgent(
  synthesisOutput: SynthesisOutput,
): Promise<ResearchOutput> {
  const apiKey = import.meta.env.VITE_EXA_API_KEY;
  if (!apiKey) {
    console.warn('ResearchAgent: VITE_EXA_API_KEY is not set, skipping research');
    return { references: [] };
  }

  // Build 2-3 search queries from sparks and themes
  const querySources: Array<{ query: string; source: string }> = [];

  for (const spark of synthesisOutput.sparks.slice(0, 2)) {
    querySources.push({ query: spark, source: spark });
  }

  if (querySources.length < 3) {
    for (const theme of synthesisOutput.themes.slice(0, 3 - querySources.length)) {
      querySources.push({ query: theme, source: theme });
    }
  }

  if (querySources.length === 0) {
    return { references: [] };
  }

  const allReferences: ResearchOutput['references'] = [];
  const seenUrls = new Set<string>();

  for (const { query, source } of querySources) {
    try {
      const response = await fetch('https://api.exa.ai/search', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          numResults: 3,
          type: 'neural',
          contents: { text: { maxCharacters: 300 } },
        }),
      });

      if (!response.ok) {
        console.warn(`ResearchAgent: Exa API returned ${response.status} for query "${query}"`);
        continue;
      }

      const data: ExaSearchResponse = await response.json();

      for (const result of data.results ?? []) {
        if (seenUrls.has(result.url)) continue;
        seenUrls.add(result.url);

        allReferences.push({
          title: result.title ?? '',
          url: result.url,
          snippet: result.text ?? '',
          relevantTo: source,
        });
      }
    } catch (err) {
      console.warn(`ResearchAgent: Failed to search for "${query}"`, err);
    }
  }

  return { references: allReferences.slice(0, 8) };
}
