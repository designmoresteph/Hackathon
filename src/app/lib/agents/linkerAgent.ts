import type { Entry, SynthesisOutput, LinkerOutput } from '../types';

export async function runLinkerAgent(
  entry: Entry,
  pastEntries: Entry[],
  synthesisOutput: SynthesisOutput,
): Promise<LinkerOutput> {
  if (pastEntries.length === 0) {
    return { connections: [], recurringPatterns: [] };
  }

  // Build context from the 10 most recent past entries
  const recentEntries = pastEntries.slice(-10);
  const pastContext = recentEntries
    .map((e) => `Entry ${e.id} (${e.createdAt}): ${e.fullText.slice(0, 500)}`)
    .join('\n\n');

  const themesContext = synthesisOutput.themes.length > 0
    ? `\nCurrent themes: ${synthesisOutput.themes.join(', ')}`
    : '';

  const response = await fetch('/api/openai', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      temperature: 0.7,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content:
            'You are a pattern detection agent. Compare the current thought entry to past entries and find meaningful connections. Return JSON with: connections (array of objects with currentExcerpt, pastEntryId, pastExcerpt, relationship), recurringPatterns (array of patterns you notice across multiple entries). Focus on semantic connections — recurring topics, evolving ideas, contradictions, progress on goals. Be specific with excerpts.',
        },
        {
          role: 'user',
          content: `Current entry:\n${entry.fullText}${themesContext}\n\nPast entries:\n${pastContext}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'unknown error');
    throw new Error(`LinkerAgent: OpenAI API returned ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('LinkerAgent: No content in OpenAI response');
  }

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error(`LinkerAgent: Failed to parse JSON response - ${content.slice(0, 200)}`);
  }

  const output: LinkerOutput = {
    connections: Array.isArray(parsed.connections)
      ? parsed.connections.map((c: Record<string, unknown>) => ({
          currentExcerpt: typeof c.currentExcerpt === 'string' ? c.currentExcerpt : '',
          pastEntryId: typeof c.pastEntryId === 'string' ? c.pastEntryId : '',
          pastExcerpt: typeof c.pastExcerpt === 'string' ? c.pastExcerpt : '',
          relationship: typeof c.relationship === 'string' ? c.relationship : '',
        }))
      : [],
    recurringPatterns: Array.isArray(parsed.recurringPatterns) ? parsed.recurringPatterns : [],
  };

  return output;
}
