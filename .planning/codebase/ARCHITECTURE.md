# Architecture

**Analysis Date:** 2026-03-07

## Pattern Overview

**Overall:** Single-Page Application (SPA) with client-side routing and screen-based navigation

**Key Characteristics:**
- Figma Make-generated React prototype (no backend, no API calls, all data is hardcoded/mocked)
- Flat screen-based architecture with no shared state between screens
- Linear user flow: Welcome -> Input (Voice/Text) -> Clustering -> Dashboard -> Search -> Synthesis -> Project
- Heavy use of Framer Motion animations as a core UX feature
- shadcn/ui component library with Radix UI primitives

## Layers

**Entry Layer:**
- Purpose: Bootstrap React app, mount root component
- Location: `src/main.tsx`, `index.html`
- Contains: React DOM render call, global CSS imports
- Depends on: `src/app/App.tsx`, `src/styles/index.css`

**App Shell:**
- Purpose: Provide top-level providers (DnD, Router)
- Location: `src/app/App.tsx`
- Contains: `DndProvider` wrapping `RouterProvider`
- Depends on: `src/app/routes.tsx`, `react-dnd`, `react-router`

**Routing Layer:**
- Purpose: Map URL paths to screen components
- Location: `src/app/routes.tsx`
- Contains: Flat route definitions using `createBrowserRouter`
- Depends on: All screen components in `src/app/screens/`
- Pattern: No nested routes, no layouts, no route guards

**Screen Layer:**
- Purpose: Full-page views representing each step of the user flow
- Location: `src/app/screens/`
- Contains: 8 screen components, each self-contained with local state only
- Depends on: UI components, `react-router` navigation, `motion/react`
- Used by: Router

**UI Component Layer:**
- Purpose: Reusable presentational primitives (shadcn/ui pattern)
- Location: `src/app/components/ui/`
- Contains: 45+ UI components (Button, Card, Input, Textarea, etc.)
- Depends on: Radix UI primitives, `class-variance-authority`, `tailwind-merge`
- Used by: Screen components

**Figma Component Layer:**
- Purpose: Figma Make-specific utility components
- Location: `src/app/components/figma/`
- Contains: `ImageWithFallback.tsx` - image component with error fallback

**Styling Layer:**
- Purpose: Global styles, theme variables, font loading, Tailwind configuration
- Location: `src/styles/`
- Contains: CSS custom properties for design system, Google Fonts imports, Tailwind v4 setup

## Data Flow

**User Navigation Flow:**

1. User lands on `WelcomeScreen` (`/`) and enters name, chooses input mode
2. Navigate to `VoiceDumpScreen` (`/voice`) or `TextDumpScreen` (`/text`)
3. Input completes -> navigate to `ClusteringScreen` (`/cluster`)
4. Clustering animation plays -> user clicks "Create My Dashboard" -> `DashboardScreen` (`/dashboard`)
5. Search from dashboard -> `SearchScreen` (`/search`)
6. Click "Synthesize Into Project" -> `SynthesisScreen` (`/synthesis`)
7. Synthesis animation -> auto-navigate to `ProjectScreen` (`/project`)

**State Management:**
- No global state management (no Redux, Zustand, Context, etc.)
- Each screen uses local `useState` hooks independently
- Navigation state passed via URL only (no route params, no query strings, no location state)
- All "data" (transcript lines, cluster content, sticky notes, project outline) is hardcoded within each screen component

**Animation as Data Flow:**
- Screens use timed `useEffect` sequences to simulate processing (e.g., `VoiceDumpScreen` timer, `ClusteringScreen` word animation, `SynthesisScreen` collapse sequence)
- Phase-based state machines drive animation transitions within screens (e.g., `SearchScreen` phases: "flying" -> "gathering" -> "timeline")

## Key Abstractions

**Screen Components:**
- Purpose: Represent a full-page step in the user journey
- Examples: `src/app/screens/WelcomeScreen.tsx`, `src/app/screens/ClusteringScreen.tsx`
- Pattern: Named export function component, local state via `useState`, navigation via `useNavigate()`, motion animations

**UI Primitives (shadcn/ui):**
- Purpose: Consistent, accessible UI building blocks
- Examples: `src/app/components/ui/button.tsx`, `src/app/components/ui/card.tsx`, `src/app/components/ui/input.tsx`
- Pattern: `cva` for variant styling, `cn()` utility for class merging, Radix UI for behavior

**Design System Tokens:**
- Purpose: Centralized color palette and typography
- Examples: `src/styles/theme.css` (CSS custom properties), `src/styles/fonts.css` (Google Fonts)
- Pattern: CSS variables on `:root`, mapped to Tailwind theme via `@theme inline`

## Entry Points

**Application Entry:**
- Location: `src/main.tsx`
- Triggers: Browser loads `index.html` which loads `/src/main.tsx` as ES module
- Responsibilities: Create React root, render `<App />`, import global styles

**Router Entry:**
- Location: `src/app/routes.tsx`
- Triggers: `RouterProvider` in `App.tsx`
- Responsibilities: Define all 8 routes mapping paths to screen components

## Error Handling

**Strategy:** Minimal - prototype-level only

**Patterns:**
- `ImageWithFallback` in `src/app/components/figma/ImageWithFallback.tsx` catches image load errors and shows a placeholder SVG
- No error boundaries
- No try/catch blocks in screen components
- No error states for user-facing flows

## Cross-Cutting Concerns

**Logging:** None - no logging framework or console.log usage in production code

**Validation:** Minimal - `TextDumpScreen` disables continue button when text is empty; `WelcomeScreen` has no validation on name input

**Authentication:** None - this is a static prototype

**Animation:** Pervasive - every screen uses `motion` from `motion/react` for entrance animations, phase transitions, and interactive feedback. Animation is a first-class architectural concern, not an afterthought.

**Drag and Drop:** `react-dnd` with `HTML5Backend` is provided at the app level via `DndProvider` in `src/app/App.tsx`, though no screens currently implement drag targets/sources.

---

*Architecture analysis: 2026-03-07*
