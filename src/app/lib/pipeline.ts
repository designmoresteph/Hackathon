import type {
  Entry,
  PipelineResult,
  PipelineState,
  AgentName,
  AgentStatus,
  SynthesisOutput,
  LinkerOutput,
  ResearchOutput,
  ActionOutput,
  CalendarOutput,
} from './types';
import { getAllEntries } from './storage';
import { savePipelineResult } from './pipelineStorage';

export type AgentFn<TInput, TOutput> = (input: TInput) => Promise<TOutput>;

export interface PipelineAgents {
  synthesis: (entry: Entry) => Promise<SynthesisOutput>;
  linker: (entry: Entry, pastEntries: Entry[], synthesisOutput: SynthesisOutput) => Promise<LinkerOutput>;
  research: (synthesisOutput: SynthesisOutput) => Promise<ResearchOutput>;
  action: (synthesisOutput: SynthesisOutput, researchOutput: ResearchOutput) => Promise<ActionOutput>;
  calendar: (actionOutput: ActionOutput) => Promise<CalendarOutput>;
}

const AGENT_ORDER: AgentName[] = ['synthesis', 'linker', 'research', 'action', 'calendar'];

function createInitialState(): PipelineState {
  const agents = {} as Record<AgentName, AgentStatus>;
  for (const name of AGENT_ORDER) {
    agents[name] = 'idle';
  }
  return {
    agents,
    currentAgent: null,
    isComplete: false,
    error: null,
  };
}

export async function runPipeline(
  entry: Entry,
  agents: PipelineAgents,
  onStatusChange: (state: PipelineState) => void
): Promise<PipelineResult> {
  const state = createInitialState();
  onStatusChange({ ...state });

  let synthesisOutput: SynthesisOutput | null = null;
  let linkerOutput: LinkerOutput | null = null;
  let researchOutput: ResearchOutput | null = null;
  let actionOutput: ActionOutput | null = null;
  let calendarOutput: CalendarOutput | null = null;

  for (const agentName of AGENT_ORDER) {
    state.agents[agentName] = 'running';
    state.currentAgent = agentName;
    onStatusChange({ ...state, agents: { ...state.agents } });

    try {
      switch (agentName) {
        case 'synthesis': {
          synthesisOutput = await agents.synthesis(entry);
          break;
        }
        case 'linker': {
          const pastEntries = getAllEntries().filter((e) => e.id !== entry.id);
          linkerOutput = await agents.linker(entry, pastEntries, synthesisOutput!);
          break;
        }
        case 'research': {
          researchOutput = await agents.research(synthesisOutput!);
          break;
        }
        case 'action': {
          actionOutput = await agents.action(synthesisOutput!, researchOutput!);
          break;
        }
        case 'calendar': {
          calendarOutput = await agents.calendar(actionOutput!);
          break;
        }
      }

      state.agents[agentName] = 'done';
      onStatusChange({ ...state, agents: { ...state.agents } });
    } catch (err) {
      state.agents[agentName] = 'error';
      state.error = err instanceof Error ? err.message : String(err);
      state.currentAgent = null;
      onStatusChange({ ...state, agents: { ...state.agents } });

      // Save partial result on error
      const result: PipelineResult = {
        id: crypto.randomUUID(),
        entryId: entry.id,
        createdAt: new Date().toISOString(),
        synthesis: synthesisOutput,
        linker: linkerOutput,
        research: researchOutput,
        action: actionOutput,
        calendar: calendarOutput,
      };
      savePipelineResult(result);
      return result;
    }
  }

  // All agents completed successfully
  state.isComplete = true;
  state.currentAgent = null;
  onStatusChange({ ...state, agents: { ...state.agents } });

  const result: PipelineResult = {
    id: crypto.randomUUID(),
    entryId: entry.id,
    createdAt: new Date().toISOString(),
    synthesis: synthesisOutput,
    linker: linkerOutput,
    research: researchOutput,
    action: actionOutput,
    calendar: calendarOutput,
  };

  savePipelineResult(result);
  return result;
}
