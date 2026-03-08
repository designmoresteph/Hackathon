# Thought Journal — AI Agent Pipeline

A voice-first thought journaling app that captures spoken reflections and processes them through a five-agent AI pipeline to extract insights, find patterns, suggest actions, and propose calendar events.

## How It Works

1. **Voice Capture** — Tap record and speak your thoughts. Words appear as floating cloud bubbles in real-time via OpenAI Realtime API.
2. **Clustering** — Your transcript is grouped into themes and topics.
3. **Agent Pipeline** — Five AI agents process your entry sequentially:
   - **SynthesisAgent** — Extracts priorities, tasks, themes, blockers, and sparks
   - **LinkerAgent** — Finds connections to your past journal entries
   - **ResearchAgent** — Fetches relevant external references via Exa
   - **ActionAgent** — Generates concrete next steps from your priorities
   - **CalendarAgent** — Proposes time-blocked events from your actions
4. **Dashboard** — View structured outputs, historical entries, and accumulated insights across sessions.

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS 4, shadcn/ui (Radix)
- **Animation:** Motion (Framer Motion), animated pipeline status indicators
- **AI:** OpenAI Realtime API (voice), OpenAI GPT-4o-mini (agents), Exa (research)
- **Storage:** localStorage for entries and pipeline results
- **Routing:** React Router 7

## Getting Started

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Add your API keys:
#   VITE_OPENAI_API_KEY=your-openai-key
#   VITE_EXA_API_KEY=your-exa-key (optional)

# Start dev server
pnpm dev
```

## Project Status

| Phase | Description | Status |
|-------|-------------|--------|
| 1. Voice Input & Persistence | Real speech-to-text with localStorage | Complete |
| 2. Agent Pipeline | Five sequential AI agents with progress UI | Complete |
