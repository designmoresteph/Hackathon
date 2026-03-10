import type { ActionOutput, CalendarOutput } from '../types';

export async function runCalendarAgent(
  actionOutput: ActionOutput
): Promise<CalendarOutput> {
  const today = new Date().toISOString().split('T')[0];

  const userMessage = `Today's date: ${today}

**Action Items:**
${actionOutput.nextSteps
  .map(
    (step) =>
      `- [${step.priority}] ${step.action}${step.timeEstimate ? ` (estimated: ${step.timeEstimate})` : ''} — ${step.context}`
  )
  .join('\n')}

Propose time-blocked calendar events for the upcoming week based on these action items.`;

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
          content: `You are a calendar scheduling agent. Given a list of action items with priorities and time estimates, propose time-blocked calendar events for the upcoming week. Return JSON with: proposedEvents (array of objects with title, description, startTime [ISO 8601], endTime [ISO 8601], source [which action item this came from]). Schedule high-priority items earlier in the week. Use reasonable working hours (9 AM - 6 PM). Today's date for scheduling context: ${today}. Generate 3-5 events.`,
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
  const rawEvents = Array.isArray(raw.proposedEvents) ? raw.proposedEvents : [];

  if (rawEvents.length === 0) {
    throw new Error('OpenAI returned no proposedEvents in response');
  }

  const proposedEvents = rawEvents.map((event: Record<string, unknown>) => ({
    title: typeof event.title === 'string' ? event.title : '',
    description: typeof event.description === 'string' ? event.description : '',
    startTime: typeof event.startTime === 'string' ? event.startTime : '',
    endTime: typeof event.endTime === 'string' ? event.endTime : '',
    source: typeof event.source === 'string' ? event.source : '',
  }));

  return { proposedEvents };
}
