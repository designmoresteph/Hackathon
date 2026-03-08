---
phase: 02-agent-pipeline
plan: 02
subsystem: agents
tags: [openai, exa, gpt-4o-mini, fetch, json-mode]

requires:
  - phase: 02-agent-pipeline-01
    provides: "Pipeline types (Entry, SynthesisOutput, LinkerOutput, ResearchOutput) and orchestrator"
provides:
  - "SynthesisAgent: extracts structured insights from transcripts via OpenAI"
  - "LinkerAgent: finds semantic connections to past entries via OpenAI"
  - "ResearchAgent: fetches external references via Exa Search API"
affects: [02-agent-pipeline-03, 02-agent-pipeline-04]

tech-stack:
  added: []
  patterns: ["Raw fetch to OpenAI Chat Completions with JSON response format", "Raw fetch to Exa neural search API", "Graceful degradation for optional agents (ResearchAgent)"]

key-files:
  created:
    - src/app/lib/agents/synthesisAgent.ts
    - src/app/lib/agents/linkerAgent.ts
    - src/app/lib/agents/researchAgent.ts
  modified: []

key-decisions:
  - "Used gpt-4o-mini for both SynthesisAgent and LinkerAgent (cost-effective, fast)"
  - "ResearchAgent returns empty results instead of throwing when Exa key is missing"
  - "LinkerAgent limits past entries to 10 most recent to stay within token limits"

patterns-established:
  - "Agent pattern: single exported async function, raw fetch to external API, validate/default all fields"
  - "Graceful degradation: optional agents warn and return empty instead of crashing pipeline"

requirements-completed: [AGENT-01, AGENT-02, AGENT-03]

duration: 1min
completed: 2026-03-08
---

# Phase 2 Plan 2: Core Agents Summary

**SynthesisAgent, LinkerAgent, and ResearchAgent using raw fetch to OpenAI and Exa APIs with JSON response format**

## Performance

- **Duration:** 1 min
- **Started:** 2026-03-08T00:46:23Z
- **Completed:** 2026-03-08T00:47:40Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- SynthesisAgent extracts priorities, tasks, themes, blockers, sparks, and summary from voice transcripts via OpenAI gpt-4o-mini
- LinkerAgent compares current entry against up to 10 recent past entries to find semantic connections and recurring patterns
- ResearchAgent queries Exa neural search with sparks/themes and returns deduplicated, capped references

## Task Commits

Each task was committed atomically:

1. **Task 1: Implement SynthesisAgent** - `7028013` (feat)
2. **Task 2: Implement LinkerAgent and ResearchAgent** - `cd27e5c` (feat)

## Files Created/Modified
- `src/app/lib/agents/synthesisAgent.ts` - Calls OpenAI to extract structured insights from transcript
- `src/app/lib/agents/linkerAgent.ts` - Finds semantic connections between current and past entries
- `src/app/lib/agents/researchAgent.ts` - Queries Exa API for external references related to sparks/themes

## Decisions Made
- Used gpt-4o-mini for both SynthesisAgent and LinkerAgent (cost-effective, fast enough for the use case)
- ResearchAgent returns empty results instead of throwing when Exa API key is missing (research is nice-to-have)
- LinkerAgent limits past entries to 10 most recent to stay within token limits

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required. API keys (VITE_OPENAI_API_KEY, VITE_EXA_API_KEY) are expected to be set in environment but are not new requirements from this plan.

## Next Phase Readiness
- All three upstream agents are ready for the pipeline orchestrator to invoke
- ActionAgent and CalendarAgent (Plan 03) can consume SynthesisOutput from SynthesisAgent
- LinkerAgent and ResearchAgent consume SynthesisOutput as expected by pipeline signatures

---
*Phase: 02-agent-pipeline*
*Completed: 2026-03-08*
