import type { SynthesisOutput, ResearchOutput, ActionOutput } from '../types';

export async function runActionAgent(
  synthesisOutput: SynthesisOutput,
  researchOutput: ResearchOutput
): Promise<ActionOutput> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing VITE_OPENAI_API_KEY environment variable');
  }

  const userMessage = `Here is the synthesized context:

**Priorities:**
${synthesisOutput.priorities.map((p) => `- ${p}`).join('\n')}

**Tasks:**
${synthesisOutput.tasks.map((t) => `- ${t}`).join('\n')}

**Blockers:**
${synthesisOutput.blockers.map((b) => `- ${b}`).join('\n')}

**Research References:**
${researchOutput.references.map((r) => `- "${r.title}": ${r.snippet} (relevant to: ${r.relevantTo})`).join('\n')}

Generate concrete next steps based on this context.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      temperature: 0.7,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content:
            'You are an action planning agent. Given synthesized priorities, tasks, blockers, and research references, generate concrete next steps. Return JSON with: nextSteps (array of objects with action, priority [high/medium/low], timeEstimate [e.g. "30 min", "2 hours"], context [why this matters]). Be specific and actionable — "Write blog outline about X" not "Think about writing". Prioritize high-impact, low-effort items first. Generate 3-7 next steps.',
        },
        {
          role: 'user',
          content: userMessage,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `OpenAI API error (${response.status}): ${errorBody}`
    );
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('No content in OpenAI response');
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error(`Failed to parse OpenAI response as JSON: ${content}`);
  }

  const raw = parsed as Record<string, unknown>;
  const rawSteps = Array.isArray(raw.nextSteps) ? raw.nextSteps : [];

  if (rawSteps.length === 0) {
    throw new Error('OpenAI returned no nextSteps in response');
  }

  const nextSteps = rawSteps.map((step: Record<string, unknown>) => ({
    action: typeof step.action === 'string' ? step.action : String(step.action ?? ''),
    priority: (['high', 'medium', 'low'].includes(step.priority as string)
      ? step.priority
      : 'medium') as 'high' | 'medium' | 'low',
    timeEstimate: typeof step.timeEstimate === 'string' ? step.timeEstimate : undefined,
    context: typeof step.context === 'string' ? step.context : '',
  }));

  return { nextSteps };
}
