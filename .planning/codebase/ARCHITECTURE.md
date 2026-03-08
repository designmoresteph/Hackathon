# Architecture

**Analysis Date:** 2026-03-07

## Pattern Overview

**Overall:** Single-page application (SPA) with client-side routing, screen-based navigation flow, and no backend/API layer. This is a Figma Make-generated prototype with all data hardcoded in components.

**Key Characteristics:**
- Flat screen-based architecture with no shared layout or nested routes
- All state is local to individual screen components (no global state management)
- No backend, no API calls, no persistent data storage -- all content is hardcoded/mocked
- Heavy use of animation (Framer Motion) as a core UX mechanism, not just decoration
- UI primitive layer from shadcn/ui (Radix-based) with Tailwind CSS styling
- Drag-and-drop interaction via react-dnd on the clustering screen

## Layers

**Entry / Bootstrap:**
- Purpose: Mount the React app and set up global providers
- Location: `src/main.tsx`, `src/app/App.tsx`
- Contains: Root render, DndProvider (drag-and-drop context), RouterProvider
- Depends on: react-router, react-dnd
- Used by: Browser (via `index.html`)

**Routing:**
- Purpose: Map URL paths to screen components
- Location: `src/app/routes.tsx`
- Contains: Flat route definitions using `createBrowserRouter`
- Depends on: All screen components
- Used by: `src/app/App.tsx` via `RouterProvider`

**Screens (Pages):**
- Purpose: Full-page views representing each step in the user flow
- Location: `src/app/screens/`
- Contains: 8 screen components, each self-contained with local state and hardcoded data
- Depends on: UI components (`src/app/components/ui/`), custom components (`src/app/components/`), lucide-react icons, motion
- Used by: Router

**UI Primitives:**
- Purpose: Reusable, unstyled/low-styled building blocks (shadcn/ui pattern)
- Location: `src/app/components/ui/`
- Contains: 48 component files (accordion, button, card, dialog, input, textarea, etc.)
- Depends on: Radix UI primitives, `clsx`, `tailwind-merge`, class-variance-authority
- Used by: Screen components

**Custom Components:**
- Purpose: App-specific reusable components
- Location: `src/app/components/`
- Contains: `AnimatedGradient.tsx` (animated background), `figma/ImageWithFallback.tsx` (image error handling)
- Depends on: motion (Framer Motion)
- Used by: Screen components (WelcomeScreen uses AnimatedGradient)

**Styles:**
- Purpose: Global CSS, design tokens, font imports, Tailwind configuration
- Location: `src/styles/`
- Contains: `index.css` (entry), `fonts.css` (Google Fonts), `tailwind.css` (Tailwind source config), `theme.css` (CSS custom properties / design tokens)
- Depends on: Tailwind CSS v4, Google Fonts CDN
- Used by: All components via Tailwind classes and CSS variables

## Data Flow

**User Journey (Primary Flow):**

1. User lands on `WelcomeScreen` (`/`) -- enters name, chooses input mode (voice/type/drop)
2. Navigates to `VoiceDumpScreen` (`/voice`) or `TextDumpScreen` (`/text`) -- captures thoughts
3. Auto-navigates to `ClusteringScreen` (`/cluster`) -- words animate in, then cluster into draggable groups
4. User clicks "Create My Dashboard" -> `DashboardScreen` (`/dashboard`)
5. User searches "blog" -> `SearchScreen` (`/search`) -- sticky notes animate, form timeline
6. User clicks "Synthesize" -> `SynthesisScreen` (`/synthesis`) -- collapse animation
7. Auto-navigates to `ProjectScreen` (`/project`) -- final writing workspace

**State Management:**
- No global state store (no Redux, Zustand, Context, etc.)
- Each screen manages its own state via `useState` and `useEffect`
- Navigation between screens uses `useNavigate()` from react-router
- No data is passed between screens -- each screen has its own hardcoded content
- Timer state in VoiceDumpScreen triggers auto-navigation on expiry
- Phase-based state machines in SearchScreen (`"flying" | "gathering" | "timeline"`) and SynthesisScreen (`"gathering" | "collapsing" | "flash" | "document"`) drive multi-step animations

## Key Abstractions

**Screen Components:**
- Purpose: Each screen is a self-contained page with its own data, state, and animation logic
- Examples: `src/app/screens/WelcomeScreen.tsx`, `src/app/screens/ClusteringScreen.tsx`, `src/app/screens/DashboardScreen.tsx`
- Pattern: Named export function component, uses hooks for local state, `useNavigate` for transitions

**Phase-Based Animation State Machines:**
- Purpose: Drive multi-step animated transitions within a single screen
- Examples: `src/app/screens/SearchScreen.tsx` (flying -> gathering -> timeline), `src/app/screens/SynthesisScreen.tsx` (gathering -> collapsing -> flash -> document), `src/app/screens/ClusteringScreen.tsx` (words appear -> clusters form)
- Pattern: `useState` with string union type, `useEffect` with `setTimeout` chains to advance phases

**shadcn/ui Components:**
- Purpose: Consistent, accessible UI primitives
- Examples: `src/app/components/ui/button.tsx`, `src/app/components/ui/card.tsx`, `src/app/components/ui/input.tsx`
- Pattern: Radix UI primitive wrapped with Tailwind styles, exported as named components. Uses `cn()` utility from `src/app/components/ui/utils.ts` for class merging.

**Figma Asset Imports:**
- Purpose: Reference images exported from Figma
- Examples: `import cloudImage from 'figma:asset/3c7af6a14225d1ee2a77d186872f69245c52483a.png'` in `src/app/screens/VoiceDumpScreen.tsx` and `src/app/screens/ClusteringScreen.tsx`
- Pattern: Custom `figma:asset/` import prefix resolved by Vite config

## Entry Points

**Browser Entry:**
- Location: `index.html` -> `src/main.tsx`
- Triggers: Page load in browser
- Responsibilities: Mounts React root, imports global styles from `src/styles/index.css`, renders `<App />`

**App Root:**
- Location: `src/app/App.tsx`
- Triggers: React render
- Responsibilities: Sets up `DndProvider` (drag-and-drop) and `RouterProvider` (routing)

**Route Definitions:**
- Location: `src/app/routes.tsx`
- Triggers: URL navigation
- Responsibilities: Maps 8 paths to screen components: `/`, `/voice`, `/text`, `/cluster`, `/dashboard`, `/search`, `/synthesis`, `/project`

## Error Handling

**Strategy:** Minimal -- this is a prototype/demo app

**Patterns:**
- `ImageWithFallback` component in `src/app/components/figma/ImageWithFallback.tsx` catches image load errors and shows a placeholder SVG
- No try/catch blocks, no error boundaries, no API error handling (no APIs exist)
- Disabled button states prevent empty submissions (e.g., TextDumpScreen disables Continue when text is empty)

## Cross-Cutting Concerns

**Logging:** None -- no logging framework or console.log statements
**Validation:** Minimal -- only basic empty-string checks on form inputs
**Authentication:** None -- no auth system
**Animation:** Pervasive -- every screen uses Framer Motion (`motion/react`) for entrance animations, phase transitions, and micro-interactions. Animation IS the core UX pattern.
**Theming:** CSS custom properties defined in `src/styles/theme.css`, though many screens use inline `style` props with hardcoded hex values instead of CSS variables

---

*Architecture analysis: 2026-03-07*
