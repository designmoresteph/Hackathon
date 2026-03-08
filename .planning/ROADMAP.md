# Roadmap: Thought Journal — AI Agent Pipeline

## Overview

Wire real AI processing behind the existing Figma Make UI prototype. Phase 1 establishes live voice capture and data persistence as the foundation. Phase 2 builds the five-agent sequential pipeline — the core value of the project. Phase 3 connects real agent outputs to the dashboard so the full loop is visible and useful across sessions.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Voice Input and Persistence** - Real speech-to-text capture with localStorage so entries survive across sessions (completed 2026-03-08)
- [x] **Phase 2: Agent Pipeline** - Five sequential AI agents processing transcripts into structured outputs with pipeline UI (completed 2026-03-08)
- [ ] **Phase 3: Dashboard Integration** - Wire real agent outputs and historical data into the dashboard

## Phase Details

### Phase 1: Voice Input and Persistence
**Goal**: User can speak thoughts into the app and have them captured, transcribed, and stored persistently
**Depends on**: Nothing (first phase)
**Requirements**: VOICE-01, VOICE-02, VOICE-03, VOICE-04, PERS-01
**Success Criteria** (what must be TRUE):
  1. User can tap record and see their spoken words appear as floating cloud bubbles in real-time
  2. User can set a custom recording duration and the recording auto-stops when the timer expires
  3. After recording, the transcript and entry metadata persist in localStorage — refreshing the browser does not lose the entry
  4. Completed recording transitions the user to the clustering screen with their real transcript
**Plans:** 2/2 plans complete

Plans:
- [x] 01-01-PLAN.md — Types, localStorage storage layer, and OpenAI Realtime voice capture hook
- [x] 01-02-PLAN.md — Wire voice capture into VoiceDumpScreen UI with configurable timer, persistence, and ClusteringScreen integration

### Phase 2: Agent Pipeline
**Goal**: Raw transcripts are processed through five sequential AI agents, each feeding the next, with real-time pipeline progress visible to the user
**Depends on**: Phase 1
**Requirements**: AGENT-01, AGENT-02, AGENT-03, AGENT-04, AGENT-05, AGENT-06, AGENT-07, PERS-02
**Success Criteria** (what must be TRUE):
  1. After clustering, user triggers the pipeline and sees all 5 agents activate sequentially with animated status indicators (scanning, processing, done)
  2. SynthesisAgent produces real priorities, tasks, themes, blockers, and sparks from the transcript
  3. Each downstream agent receives the previous agent's output — LinkerAgent finds connections to past entries, ResearchAgent returns Exa-sourced references, ActionAgent generates concrete next steps, CalendarAgent proposes time-blocked events
  4. Pipeline results are stored so they can be displayed after completion
  5. LinkerAgent can access previously stored entries to detect recurring patterns across sessions
**Plans:** 4/4 plans complete

Plans:
- [ ] 02-01-PLAN.md — Agent output types, pipeline storage, and sequential pipeline orchestrator
- [ ] 02-02-PLAN.md — SynthesisAgent, LinkerAgent, and ResearchAgent implementations
- [ ] 02-03-PLAN.md — ActionAgent and CalendarAgent implementations
- [ ] 02-04-PLAN.md — Pipeline progress UI screen with animated agent status indicators

### Phase 3: Dashboard Integration
**Goal**: The dashboard reflects real data — agent outputs from the latest run and historical entries across sessions
**Depends on**: Phase 2
**Requirements**: DASH-01, DASH-02, PERS-03
**Success Criteria** (what must be TRUE):
  1. AI agent widgets on the dashboard display actual outputs from the most recent pipeline run (not hardcoded mocks)
  2. Workspace cards show real stored entries and their metadata
  3. Historical data from past sessions appears on the dashboard, giving the user a sense of accumulated reflection over time
**Plans**: TBD

Plans:
- [ ] 03-01: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Voice Input and Persistence | 2/2 | Complete   | 2026-03-08 |
| 2. Agent Pipeline | 4/4 | Complete   | 2026-03-08 |
| 3. Dashboard Integration | 0/1 | Not started | - |
