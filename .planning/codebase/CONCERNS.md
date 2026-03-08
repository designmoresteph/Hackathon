# Codebase Concerns

**Analysis Date:** 2026-03-07

## Tech Debt

**All data is hardcoded mock data with no persistence or backend:**
- Issue: Every screen uses hardcoded arrays and `setTimeout` to simulate AI/backend behavior. No actual data flows between screens. User input on one screen (e.g., text typed in `TextDumpScreen`) is never passed to downstream screens (e.g., `ClusteringScreen` shows the same fixed clusters regardless).
- Files: `src/app/screens/VoiceDumpScreen.tsx` (lines 16-25, mock transcript), `src/app/screens/ClusteringScreen.tsx` (lines 191-254, hardcoded words and clusters), `src/app/screens/DashboardScreen.tsx` (lines 47-89, fake AI responses via setTimeout), `src/app/screens/SearchScreen.tsx` (lines 24-127, hardcoded sticky notes)
- Impact: The app is a static prototype. No user data persists across sessions or even across navigations. Adding real functionality requires building an entire data layer from scratch.
- Fix approach: Introduce a state management layer (React Context or Zustand) to pass data between screens. Add a backend API or local storage for persistence. Replace all `setTimeout` mock responses with actual API calls.

**No shared state management between screens:**
- Issue: Each screen component manages its own isolated `useState` hooks. There is no global state, no React Context, no store. The `name` field captured in `WelcomeScreen` is never used anywhere else. Text from `TextDumpScreen` is lost on navigation.
- Files: `src/app/screens/WelcomeScreen.tsx` (line 11, `name` state unused beyond input), `src/app/screens/TextDumpScreen.tsx` (line 10, `text` state discarded on navigate), `src/app/routes.tsx` (flat route config, no layout with shared state)
- Impact: Impossible to build real features without first adding state management. Every screen transition loses all user context.
- Fix approach: Add a shared context provider (wrap routes in a layout component with React Context) or introduce a lightweight store like Zustand. Pass user input data through the flow.

**Massive inline style objects instead of using CSS variables/theme:**
- Issue: Despite having a well-defined theme in `src/styles/theme.css` with CSS custom properties (`--off-white`, `--black`, `--yellow`, etc.), every screen hardcodes color values directly in `style={{}}` props. The same hex values (`#0D0D0D`, `#F7F5F0`, `#E8E5E0`, `#6B6B6B`, `#F5E642`, `#A8A49E`) appear hundreds of times across files.
- Files: All screen files. Examples: `src/app/screens/WelcomeScreen.tsx` (lines 47, 57-60, 69-70, 87-89, etc.), `src/app/screens/DashboardScreen.tsx` (throughout all 591 lines), `src/app/screens/ProjectScreen.tsx` (throughout all 200 lines)
- Impact: Changing the color scheme requires find-and-replace across every file. Theme CSS variables exist but are completely unused by screen components. Dark mode is defined in `theme.css` but cannot work because colors are inline.
- Fix approach: Replace all inline `style={{ color: '#0D0D0D' }}` with Tailwind classes using theme tokens (e.g., `text-foreground`). Replace `style={{ backgroundColor: '#F7F5F0' }}` with `bg-background`. Map the custom design system colors (`--yellow`, `--sage`, `--peach`, `--blush`) to Tailwind theme extensions.

**Duplicate DndProvider wrapping:**
- Issue: `DndProvider` with `HTML5Backend` is mounted both in `App.tsx` (wrapping the entire app) and again inside `ClusteringScreen.tsx`. Nested DndProviders can cause subtle bugs with drag-and-drop context.
- Files: `src/app/App.tsx` (lines 8-10), `src/app/screens/ClusteringScreen.tsx` (lines 460-464)
- Impact: Potential runtime errors or unexpected drag-and-drop behavior. Wasted bundle overhead from double initialization.
- Fix approach: Remove the `DndProvider` wrapper from `ClusteringScreen` since the app-level provider in `App.tsx` already covers it. Or remove from `App.tsx` if DnD is only used on the clustering screen.

**Inline font-family strings repeated everywhere:**
- Issue: Font family names are specified as inline className strings (`font-['Playfair_Display']`, `font-['Lora']`, `font-['DM_Sans']`, `font-['Outfit']`, `font-['Cormorant_Garamond']`) on nearly every text element. There are no Tailwind theme font aliases.
- Files: All screen files, e.g., `src/app/screens/WelcomeScreen.tsx` (lines 47, 55, 69, 85, 129), `src/app/screens/DashboardScreen.tsx` (throughout)
- Impact: Changing a font requires global find-and-replace. No semantic font scale (heading font vs body font vs label font). Easy to use wrong font on new elements.
- Fix approach: Define font families in Tailwind theme config (e.g., `font-heading: Playfair Display`, `font-body: DM Sans`, `font-label: Outfit`). Replace all inline font classes with semantic names.

## Known Bugs

**ClusterCloud drag references undefined `containerRef`:**
- Symptoms: The `useDrag` hook's `end` callback references `containerRef` but `containerRef` is defined AFTER the `useDrag` call. On the initial render, `containerRef.current` is `null`, so drag-end position calculations silently fail.
- Files: `src/app/screens/ClusteringScreen.tsx` (lines 78-96, `useDrag` at line 78 uses `containerRef` declared at line 95)
- Trigger: Drag and drop any cluster cloud on the clustering screen.
- Workaround: The `containerRef` eventually gets assigned, but the closure in `useDrag` may capture a stale ref depending on render timing.

**VoiceDumpScreen timer auto-navigates without user consent:**
- Symptoms: After 10 minutes (or if user waits), the screen automatically navigates to `/cluster` without warning. There is no way to pause, stop, or extend recording.
- Files: `src/app/screens/VoiceDumpScreen.tsx` (lines 39-51, timer auto-navigates at 0)
- Trigger: Let the timer reach 0:00.
- Workaround: None. User loses control of navigation flow.

**SearchScreen sort by date is unreliable:**
- Symptoms: The timeline view sorts notes by `new Date(note.fullDate).getTime()`, but some `fullDate` values like `"Today - 10:23 AM"` will produce `NaN` from `new Date()`, causing incorrect sort order.
- Files: `src/app/screens/SearchScreen.tsx` (line 244, `new Date(b.fullDate).getTime()`)
- Trigger: View the timeline phase of the search screen.
- Workaround: The visual order may appear random for notes with unparseable dates.

**"Drop" button on WelcomeScreen does nothing:**
- Symptoms: The "Drop" button calls `handleStart("drop")` but the handler only checks for "voice" and "type" modes. The "drop" case falls through silently.
- Files: `src/app/screens/WelcomeScreen.tsx` (lines 20-26, no "drop" case; line 111, button triggers "drop")
- Trigger: Click the "Drop" button on the welcome screen.
- Workaround: None. Button is non-functional.

## Security Considerations

**No input sanitization:**
- Risk: User text input from `TextDumpScreen` and `WelcomeScreen` is rendered directly into the DOM without sanitization. While React auto-escapes JSX, if content is ever rendered via `dangerouslySetInnerHTML` or passed to a backend, XSS is possible.
- Files: `src/app/screens/TextDumpScreen.tsx` (line 59), `src/app/screens/WelcomeScreen.tsx` (line 53)
- Current mitigation: React's JSX escaping prevents XSS in the current implementation.
- Recommendations: Add input validation and length limits before connecting to any backend. Sanitize user input before persistence.

**No authentication or authorization:**
- Risk: All routes are publicly accessible with no auth layer. When real user data is added, it will be exposed.
- Files: `src/app/routes.tsx` (all routes are unprotected)
- Current mitigation: None needed since there is no real data.
- Recommendations: Add auth before storing any real user data.

## Performance Bottlenecks

**AnimatedGradient renders 4 continuously-animating large blurred elements:**
- Problem: Four 500-700px blurred gradient blobs animate continuously using Framer Motion on the welcome screen. CSS `blur-3xl` (blur radius 64px) on large elements is GPU-intensive.
- Files: `src/app/components/AnimatedGradient.tsx` (lines 23-93, four motion divs with blur-3xl)
- Cause: Continuous CSS blur filter repainting on large elements. Runs indefinitely even when partially off-screen.
- Improvement path: Use CSS `will-change: transform` or pre-render blurred gradients as static images. Consider reducing to 2 blobs or using a canvas-based approach.

**VoiceDumpScreen and ClusteringScreen use `window.innerWidth` in render:**
- Problem: Multiple components read `window.innerWidth` and `window.innerHeight` directly during render to compute random positions. This does not respond to window resizes and triggers layout thrashing.
- Files: `src/app/screens/VoiceDumpScreen.tsx` (lines 168, 173), `src/app/screens/ClusteringScreen.tsx` (lines 33, 37-38)
- Cause: Direct DOM measurement during render without memoization or resize handling.
- Improvement path: Use a `useWindowSize` hook with debounced resize listener, or use CSS-based relative positioning instead of pixel calculations.

**48 UI component files imported from shadcn/ui, most unused:**
- Problem: The `src/app/components/ui/` directory contains 48 component files (accordion, alert-dialog, aspect-ratio, avatar, badge, breadcrumb, calendar, carousel, chart, etc.). The actual screens only use: `Button`, `Card`, `CardContent`, `CardHeader`, `CardTitle`, `Input`, `Textarea`. The vast majority are dead code.
- Files: `src/app/components/ui/` (48 files, ~42 unused)
- Cause: Figma Make likely generated the full shadcn/ui component library regardless of usage.
- Improvement path: Remove unused UI components to reduce codebase noise. Keep only: `button.tsx`, `card.tsx`, `input.tsx`, `textarea.tsx`, `utils.ts`.

## Fragile Areas

**ClusteringScreen component (465 lines):**
- Files: `src/app/screens/ClusteringScreen.tsx`
- Why fragile: Combines three sub-components (`WordCloud`, `ClusterCloud`, `ClusteringScreenContent`) with drag-and-drop, SVG line drawing, animation sequencing, and connection management all in one file. The drag-end callback references a ref that may not be initialized. SVG connection lines use absolute pixel calculations that break on different screen sizes.
- Safe modification: Extract `WordCloud` and `ClusterCloud` into separate files. Replace pixel-based position calculations with percentage-based CSS. Test drag behavior thoroughly.
- Test coverage: None.

**DashboardScreen component (591 lines):**
- Files: `src/app/screens/DashboardScreen.tsx`
- Why fragile: The largest file in the codebase. Contains three nearly identical AI widget patterns (insight, pattern, action) with copy-pasted state management and UI code. Each widget has its own `useState` + `setTimeout` + identical loading animation JSX. Any change to the widget pattern must be replicated three times.
- Safe modification: Extract a reusable `AIWidgetCard` component. Parameterize the widget title, icon, color, placeholder text, and mock response.
- Test coverage: None.

**SynthesisScreen auto-navigation:**
- Files: `src/app/screens/SynthesisScreen.tsx`
- Why fragile: Uses a chained `async` function with `setTimeout` promises to sequence animations, then auto-navigates to `/project` after 5.5 seconds. User has no control. If navigation fails or the component unmounts during the sequence, state updates on unmounted component will occur.
- Safe modification: Add a "Continue" button instead of auto-navigation. Use `useEffect` cleanup to cancel pending timeouts.
- Test coverage: None.

## Scaling Limits

**No routing guards or error boundaries:**
- Current capacity: Works for the 8-screen linear prototype flow.
- Limit: Any navigation error, missing route, or component crash will show a white screen with no recovery path.
- Scaling path: Add a root error boundary component. Add a 404/catch-all route. Add route guards for authenticated flows.

**Flat route structure with no layouts:**
- Current capacity: 8 independent screens work fine.
- Limit: Cannot share navigation bars, sidebars, or persistent UI elements across screens without duplicating them.
- Scaling path: Add nested routes with layout components in `src/app/routes.tsx`.

## Dependencies at Risk

**`next-themes` (0.4.6) in a Vite/React app:**
- Risk: `next-themes` is designed for Next.js. It depends on Next.js-specific APIs for SSR/hydration. Using it in a pure Vite SPA may cause hydration warnings or no-ops.
- Impact: Dark mode theming may silently fail or not work at all.
- Migration plan: Replace with a simple React Context-based theme provider, or use `use-dark-mode` package.

**React listed as `peerDependency` with `optional: true`:**
- Risk: `package.json` lists `react` and `react-dom` as optional peer dependencies rather than direct dependencies. This means the app may install without React if no parent package provides it.
- Impact: Build could fail in CI or fresh installs if React is not provided by the environment.
- Migration plan: Move `react` and `react-dom` to `dependencies`.

**No lockfile present:**
- Risk: No `package-lock.json`, `pnpm-lock.yaml`, or `yarn.lock` exists. Dependency versions are not pinned.
- Impact: Different installations may resolve different dependency versions, leading to "works on my machine" bugs.
- Migration plan: Run `pnpm install` (given the `pnpm.overrides` in package.json) and commit the lockfile.

## Missing Critical Features

**No error boundaries:**
- Problem: No React error boundary components exist anywhere in the app.
- Blocks: Any runtime error in a screen component crashes the entire application with no recovery.

**No loading states for route transitions:**
- Problem: Route transitions are instant with no loading indicators. When real async data loading is added, users will see blank screens.
- Blocks: Cannot add data fetching to routes without first implementing suspense boundaries or loading states.

**No responsive design below desktop:**
- Problem: Screens use fixed widths (`max-w-7xl`, `w-80`, `col-span-3/6/3` grid), absolute pixel positioning, and `window.innerWidth` calculations. No mobile breakpoints are implemented.
- Blocks: App is unusable on mobile or tablet devices.

**No TypeScript strict configuration:**
- Problem: No `tsconfig.json` exists in the project root. TypeScript configuration is entirely default/implicit via Vite.
- Blocks: No strict null checks, no unused variable detection, no import resolution guarantees.

## Test Coverage Gaps

**No tests exist:**
- What's not tested: Everything. Zero test files, no test framework configured, no test scripts in `package.json`.
- Files: All files in `src/app/screens/`, `src/app/components/`
- Risk: Any code change can introduce regressions with no automated detection. The complex animation sequencing in `ClusteringScreen`, `SearchScreen`, and `SynthesisScreen` is particularly vulnerable.
- Priority: High. Add at minimum: vitest config, smoke tests for each screen rendering without errors, and unit tests for utility functions like `getGreeting()` and `formatTime()`.

---

*Concerns audit: 2026-03-07*
