# Thought Journal — AI Agent Pipeline

## What This Is

A personal reflection app that captures raw thoughts via voice (or text/image), clusters them into themes, then runs a 5-agent AI pipeline to extract structure, find patterns, research ideas, create action items, and schedule them. It feels like opening a journal, not launching an app — warm, meditative, and deeply personal.

## Core Value

Turn messy, unstructured thoughts into organized priorities, connected insights, and scheduled actions — automatically, through a sequential AI agent pipeline.

## Requirements

### Validated

- Voice/Type/Drop input modes on welcome screen — existing
- Voice dump screen with timer and floating transcript clouds — existing
- Clustering screen with draggable themed clouds and connections — existing
- Dashboard with AI agent widgets and workspace cards — existing
- Animated gradient background, cloud metaphor throughout — existing
- Figma Make design system (Playfair Display, Lora, DM Sans, Outfit, Cormorant Garamond) — existing
- React + Vite + TypeScript + Tailwind + shadcn/ui + Framer Motion stack — existing

### Active

- [ ] Real speech-to-text via OpenAI Realtime API for voice dump
- [ ] SynthesisAgent: processes raw transcript + past entries into priorities, tasks, themes, blockers, sparks
- [ ] LinkerAgent: takes past notes + current entry, produces semantic connections and recurring patterns
- [ ] ResearchAgent: takes creative sparks + themes, queries Exa API for curated references and inspiration
- [ ] ActionAgent: takes priorities + tasks, generates next steps, time blocks, reminders
- [ ] CalendarAgent: takes time blocks + commitments, proposes Google Calendar events (mocked for now)
- [ ] Agent pipeline screen showing sequential progress with animated status bullets
- [ ] localStorage persistence for entries and agent outputs (LinkerAgent needs history)
- [ ] Pipeline data flow: each agent's output feeds as input to the next
- [ ] Dashboard updated to display real agent outputs instead of mock data

### Out of Scope

- Real Google Calendar OAuth integration — mock for hackathon, integrate later
- Cloud database / multi-device sync — localStorage is sufficient
- Mobile app — web only
- User authentication — single-user local app
- Real-time collaboration — personal tool

## Context

This is a hackathon project. The UI prototype already exists with mock data throughout — hardcoded transcripts, fake clusters, simulated AI responses. The goal is to wire up real AI processing behind the existing beautiful UI.

The existing codebase was generated via Figma Make. It has a warm, earthy aesthetic (sage, blush, yellow, peach on #F7F5F0 background) with cloud imagery as a core metaphor. The design is polished but all functionality is simulated.

Key technical context:
- OpenAI API for all LLM agent calls
- Exa API for ResearchAgent web search
- OpenAI Realtime API for speech-to-text (same client as agent LLM calls)
- localStorage + IndexedDB for persistence
- No backend server — all processing happens client-side or via direct API calls

## Constraints

- **LLM Provider**: OpenAI — all agent prompts target GPT models
- **Search API**: Exa — ResearchAgent uses Exa for curated research cards
- **No Backend**: Client-side only — API keys managed locally, no server
- **Hackathon Timeline**: Ship fast, mock what isn't core (Calendar OAuth)
- **Existing Design**: Preserve the current aesthetic and UI patterns from Figma Make

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Sequential pipeline over parallel agents | Each agent's output feeds the next — Synthesis structures raw input for all downstream agents | -- Pending |
| OpenAI for LLM | User preference, good function calling support | -- Pending |
| localStorage over cloud DB | Hackathon simplicity, no auth needed, single user | -- Pending |
| Real STT over mocked | Core to the experience — voice input is the primary interaction | -- Pending |
| Mock Calendar integration | Google OAuth is complex, not core to demo value | -- Pending |
| Keep clustering screen | Adds user agency between raw dump and AI processing | -- Pending |

---
*Last updated: 2026-03-07 after initialization*
