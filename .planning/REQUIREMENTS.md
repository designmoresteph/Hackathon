# Requirements: Thought Journal — AI Agent Pipeline

**Defined:** 2026-03-07
**Core Value:** Turn messy, unstructured thoughts into organized priorities, connected insights, and scheduled actions through a sequential AI agent pipeline.

## v1 Requirements

### Voice Input

- [x] **VOICE-01**: User can record voice input with real-time speech-to-text via OpenAI Realtime API
- [x] **VOICE-02**: Transcribed words appear as floating cloud bubbles in real-time during recording
- [x] **VOICE-03**: User can configure recording duration (not hardcoded to 10 minutes)
- [x] **VOICE-04**: Recording stops automatically when timer expires, transitions to clustering

### Agent Pipeline

- [ ] **AGENT-01**: SynthesisAgent processes raw transcript + past entries into priorities, tasks, themes, blockers, and sparks
- [ ] **AGENT-02**: LinkerAgent takes past notes + current entry and produces semantic connections and recurring patterns
- [ ] **AGENT-03**: ResearchAgent takes creative sparks + themes and queries Exa API for curated references and inspiration cards
- [ ] **AGENT-04**: ActionAgent takes priorities + tasks and generates next steps, time blocks, and reminders
- [ ] **AGENT-05**: CalendarAgent takes time blocks + commitments and proposes Google Calendar events (mocked)
- [ ] **AGENT-06**: Agents run sequentially as a pipeline — each agent's output feeds as input to the next
- [ ] **AGENT-07**: Agent pipeline screen shows all 5 agents with animated status bullets (scanning, processing, done)

### Persistence

- [x] **PERS-01**: Entries and agent outputs persist in localStorage across sessions
- [ ] **PERS-02**: LinkerAgent can access past entries to detect patterns over time
- [ ] **PERS-03**: Dashboard displays historical data from stored entries

### Dashboard

- [ ] **DASH-01**: AI agent widgets display real outputs from the most recent pipeline run
- [ ] **DASH-02**: Dashboard workspace cards reflect actual stored data (not hardcoded mocks)

## v2 Requirements

### Calendar Integration

- **CAL-01**: Real Google Calendar OAuth for CalendarAgent to create actual events
- **CAL-02**: Bi-directional calendar sync (read existing events for conflict detection)

### Multi-modal Input

- **INPUT-01**: Text input mode with same agent pipeline processing
- **INPUT-02**: Image/drop input mode with OCR or vision processing

### Advanced Persistence

- **PERS-04**: Cloud database (Supabase) for cross-device sync
- **PERS-05**: User authentication for multi-user support

## Out of Scope

| Feature | Reason |
|---------|--------|
| Backend server | Client-side only, direct API calls to OpenAI/Exa |
| User authentication | Single-user local app for hackathon |
| Mobile app | Web-first, mobile later |
| Real-time collaboration | Personal reflection tool |
| Offline support | Requires API calls, online-only is fine |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| VOICE-01 | Phase 1 | Complete |
| VOICE-02 | Phase 1 | Complete |
| VOICE-03 | Phase 1 | Complete |
| VOICE-04 | Phase 1 | Complete |
| AGENT-01 | Phase 2 | Pending |
| AGENT-02 | Phase 2 | Pending |
| AGENT-03 | Phase 2 | Pending |
| AGENT-04 | Phase 2 | Pending |
| AGENT-05 | Phase 2 | Pending |
| AGENT-06 | Phase 2 | Pending |
| AGENT-07 | Phase 2 | Pending |
| PERS-01 | Phase 1 | Complete |
| PERS-02 | Phase 2 | Pending |
| PERS-03 | Phase 3 | Pending |
| DASH-01 | Phase 3 | Pending |
| DASH-02 | Phase 3 | Pending |

**Coverage:**
- v1 requirements: 16 total
- Mapped to phases: 16
- Unmapped: 0

---
*Requirements defined: 2026-03-07*
*Last updated: 2026-03-07 after roadmap creation*
