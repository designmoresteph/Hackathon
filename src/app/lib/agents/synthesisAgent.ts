import type { Entry, SynthesisOutput } from '../types';

export async function runSynthesisAgent(entry: Entry): Promise<SynthesisOutput> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('SynthesisAgent: VITE_OPENAI_API_KEY is not set');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
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
            'You are a thought analysis agent. Given a raw voice transcript of someone\'s thoughts, extract structured insights. Return a JSON object with these fields: priorities (top priorities mentioned), tasks (actionable items), themes (recurring themes/topics), blockers (obstacles or frustrations), sparks (creative ideas or open questions), summary (a brief 2-3 sentence narrative summary). Be specific and actionable. If the transcript is short, still extract what you can.',
        },
        {
          role: 'user',
          content: `Transcript from ${entry.createdAt}:\n\n${entry.fullText}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'unknown error');
    throw new Error(`SynthesisAgent: OpenAI API returned ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('SynthesisAgent: No content in OpenAI response');
  }

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error(`SynthesisAgent: Failed to parse JSON response - ${content.slice(0, 200)}`);
  }

  const output: SynthesisOutput = {
    priorities: Array.isArray(parsed.priorities) ? parsed.priorities : [],
    tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [],
    themes: Array.isArray(parsed.themes) ? parsed.themes : [],
    blockers: Array.isArray(parsed.blockers) ? parsed.blockers : [],
    sparks: Array.isArray(parsed.sparks) ? parsed.sparks : [],
    summary: typeof parsed.summary === 'string' ? parsed.summary : '',
  };

  return output;
}
