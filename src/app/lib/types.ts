export interface TranscriptSegment {
  id: string;
  text: string;
  timestamp: number; // ms since recording start
}

export interface Entry {
  id: string;           // crypto.randomUUID()
  createdAt: string;    // ISO 8601
  durationSeconds: number;
  transcript: TranscriptSegment[];
  fullText: string;     // joined transcript segments
  userName?: string;    // from WelcomeScreen
}

// --- Agent Output Types ---

export interface SynthesisOutput {
  priorities: string[];
  tasks: string[];
  themes: string[];
  blockers: string[];
  sparks: string[];       // creative ideas / open questions
  summary: string;        // brief narrative summary
}

export interface LinkerOutput {
  connections: Array<{
    currentExcerpt: string;      // text from current entry
    pastEntryId: string;         // id of connected past entry
    pastExcerpt: string;         // relevant text from past entry
    relationship: string;        // description of how they connect
  }>;
  recurringPatterns: string[];   // patterns seen across sessions
}

export interface ResearchOutput {
  references: Array<{
    title: string;
    url: string;
    snippet: string;             // relevant excerpt
    relevantTo: string;          // which spark/theme it relates to
  }>;
}

export interface ActionOutput {
  nextSteps: Array<{
    action: string;
    priority: 'high' | 'medium' | 'low';
    timeEstimate?: string;       // e.g. "30 min", "2 hours"
    context: string;             // why this action matters
  }>;
}

export interface CalendarOutput {
  proposedEvents: Array<{
    title: string;
    description: string;
    startTime: string;           // ISO 8601
    endTime: string;             // ISO 8601
    source: string;              // which action/task this came from
  }>;
}

// --- Pipeline Types ---

export type AgentName = 'synthesis' | 'linker' | 'research' | 'action' | 'calendar';

export type AgentStatus = 'idle' | 'running' | 'done' | 'error';

export interface PipelineState {
  agents: Record<AgentName, AgentStatus>;
  currentAgent: AgentName | null;
  isComplete: boolean;
  error: string | null;
}

export interface PipelineResult {
  id: string;                    // crypto.randomUUID()
  entryId: string;               // which entry was processed
  createdAt: string;             // ISO 8601
  synthesis: SynthesisOutput | null;
  linker: LinkerOutput | null;
  research: ResearchOutput | null;
  action: ActionOutput | null;
  calendar: CalendarOutput | null;
}
