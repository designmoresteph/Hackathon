# Codebase Concerns

**Analysis Date:** 2026-03-07

## Tech Debt

**Hardcoded Mock Data Instead of Real Functionality:**
- Issue: Every screen uses hardcoded mock data and simulated interactions instead of real backend/state. The `VoiceDumpScreen` fakes transcription with a timer-fed array, `ClusteringScreen` has hardcoded clusters, `SearchScreen` has hardcoded sticky notes, `DashboardScreen` has static widgets, and `SynthesisScreen` runs a canned animation sequence.
- Files: `src/app/screens/VoiceDumpScreen.tsx` (lines 15-24, mock transcript), `src/app/screens/ClusteringScreen.tsx` (lines 31-94, hardcoded words and clusters), `src/app/screens/SearchScreen.tsx` (lines 24-127, hardcoded sticky notes), `src/app/screens/DashboardScreen.tsx` (all widget content is static), `src/app/screens/SynthesisScreen.tsx` (entire synthesis is a canned animation)
- Impact: The app is a prototype/demo only. No user data persists, no real voice recording, no real search, no real clustering or synthesis. Every interaction is scripted.
- Fix approach: Introduce a state management layer (React Context or Zustand), implement real voice recording via Web Audio API / MediaRecorder, add a backend or local storage for persistence, and replace mock data with dynamic content.

**No State Management or Data Persistence:**
- Issue: There is no global state, no context providers (except DndProvider which is unused), no local storage, no database. Each screen is fully self-contained with local `useState`. Data entered on one screen (e.g., name on WelcomeScreen, text on TextDumpScreen) is lost when navigating to the next screen.
- Files: `src/app/App.tsx`, `src/app/screens/WelcomeScreen.tsx` (name input discarded), `src/app/screens/TextDumpScreen.tsx` (text input discarded on navigate)
- Impact: User input has zero effect on downstream screens. The "flow" is purely navigational theater.
- Fix approach: Add a shared state provider (React Context or state library) to pass user-entered data between screens. Persist data to localStorage or a backend.

**Massive Unused UI Component Library:**
- Issue: 48 UI components are included in `src/app/components/ui/` but only 5 are actually imported by screen code: `button`, `card`, `input`, `textarea`. The remaining 43 components (sidebar, chart, menubar, carousel, form, dialog, sheet, etc.) are dead code.
- Files: All files in `src/app/components/ui/` except `button.tsx`, `card.tsx`, `input.tsx`, `textarea.tsx`, `utils.ts`
- Impact: Bloated bundle size, unnecessary dependency tree (many Radix UI packages in `package.json` are unused), slower build times, confusion about what's actually in use.
- Fix approach: Remove unused UI components and their corresponding `@radix-ui/*` dependencies from `package.json`. Keep only what screens actually import.

**Inline Styles Override Design System:**
- Issue: Almost every component uses inline `style={{}}` props with hardcoded hex colors (e.g., `style={{ backgroundColor: '#F7F5F0' }}`, `style={{ color: '#0D0D0D' }}`), despite a comprehensive CSS custom property system defined in `src/styles/theme.css` with variables like `--off-white`, `--black`, `--text-primary`, etc.
- Files: `src/app/screens/WelcomeScreen.tsx`, `src/app/screens/VoiceDumpScreen.tsx`, `src/app/screens/TextDumpScreen.tsx`, `src/app/screens/ClusteringScreen.tsx`, `src/app/screens/DashboardScreen.tsx`, `src/app/screens/SearchScreen.tsx`, `src/app/screens/SynthesisScreen.tsx`, `src/app/screens/ProjectScreen.tsx`
- Impact: Theme changes require finding and updating every inline style. The CSS variables are defined but effectively unused. Dark mode theme in `theme.css` will never apply because colors are hardcoded.
- Fix approach: Replace all inline `style={{}}` color/background references with Tailwind classes using the CSS custom properties (e.g., `bg-[var(--off-white)]` or create Tailwind theme mappings). Remove inline styles entirely.

**Hardcoded Font Family Strings:**
- Issue: Font families are specified as inline Tailwind classes with bracket syntax throughout every component: `font-['Playfair_Display']`, `font-['DM_Sans']`, `font-['Lora']`, `font-['Outfit']`, `font-['Cormorant_Garamond']`. These are repeated dozens of times across all screens with no centralization.
- Files: All screen files in `src/app/screens/`
- Impact: Changing a font requires a find-and-replace across the entire codebase. Typos in font names silently fall back to system fonts.
- Fix approach: Define font families as Tailwind theme extensions or CSS custom properties. Create semantic utility classes (e.g., `font-heading`, `font-body`, `font-label`).

**No TypeScript Configuration:**
- Issue: There is no `tsconfig.json` file in the project despite all source files being `.tsx`/`.ts`. The project relies entirely on Vite's default TypeScript handling.
- Files: Project root (missing `tsconfig.json`)
- Impact: No type checking during build, no strict mode, no path alias type resolution (the `@` alias in `vite.config.ts` has no TypeScript equivalent), IDE support may be degraded.
- Fix approach: Add a `tsconfig.json` with strict mode, path aliases matching `vite.config.ts`, and appropriate compiler options.

**React and React-DOM as Peer Dependencies:**
- Issue: `react` and `react-dom` are listed as optional `peerDependencies` rather than `dependencies` in `package.json`. This is unusual for an application (vs a library).
- Files: `package.json` (lines 72-83)
- Impact: React may not be installed depending on the package manager and environment. Could cause "module not found" errors in fresh installs.
- Fix approach: Move `react` and `react-dom` to `dependencies`.

## Known Bugs

**"Drop" Button Does Nothing:**
- Symptoms: Clicking the "Drop" button on WelcomeScreen calls `handleStart("drop")` but the handler only checks for "voice" and "type" modes. The "drop" case is silently ignored.
- Files: `src/app/screens/WelcomeScreen.tsx` (lines 19-25, 106-118)
- Trigger: Click the "Drop" (image) button on the welcome screen
- Workaround: None. Feature is not implemented.

**VoiceDumpScreen Timer Creates Stale Closure Bug:**
- Symptoms: The `index` variable in the transcript effect captures a stale closure. Because `index` is a local `let` inside the effect, it resets to 0 every time `isRecording` changes, potentially replaying transcript lines.
- Files: `src/app/screens/VoiceDumpScreen.tsx` (lines 14-35)
- Trigger: Toggle recording state
- Workaround: The current mock data makes this hard to observe, but it would be a bug with real data.

**VoiceDumpScreen Waveform Uses Math.random() in Render:**
- Symptoms: `Math.random()` is called inside animation props during render, meaning each re-render generates new random values, causing visual jitter and unnecessary re-animation.
- Files: `src/app/screens/VoiceDumpScreen.tsx` (lines 134-152)
- Trigger: Any state change that triggers re-render
- Workaround: None visible; the effect is subtle but wasteful.

**ClusteringScreen useEffect Has Missing Dependencies:**
- Symptoms: The useEffect that animates words references `allWords` and `clusterData` which are defined inside the component but not in the dependency array. The `[]` dependency array means this runs once, but ESLint would flag it. With React strict mode, double-invocation could cause issues.
- Files: `src/app/screens/ClusteringScreen.tsx` (lines 97-116)
- Trigger: React strict mode in development
- Workaround: Works in production build due to single mount.

**SearchScreen Date Sorting is Unreliable:**
- Symptoms: `new Date(b.fullDate).getTime()` is used to sort notes, but `fullDate` values like `"Today - 10:23 AM"` will produce `NaN` from `Date.parse()`, breaking sort order.
- Files: `src/app/screens/SearchScreen.tsx` (line 244)
- Trigger: View the timeline phase of SearchScreen
- Workaround: The note with "Today" date will sort unpredictably.

**ClusteringScreen SVG Connection Lines Don't Update on Resize:**
- Symptoms: `getClusterCenter()` reads `containerRef.current.getBoundingClientRect()` at render time. SVG paths are calculated once and never recalculated on window resize, causing misaligned connection lines.
- Files: `src/app/screens/ClusteringScreen.tsx` (lines 141-148, 150-159)
- Trigger: Resize browser window after clusters are shown
- Workaround: None.

## Security Considerations

**No Input Sanitization:**
- Risk: User text input on WelcomeScreen (name) and TextDumpScreen (text dump) is rendered directly via React JSX, which auto-escapes. However, if this data were ever sent to a backend or rendered with `dangerouslySetInnerHTML`, XSS would be possible.
- Files: `src/app/screens/WelcomeScreen.tsx`, `src/app/screens/TextDumpScreen.tsx`
- Current mitigation: React's built-in JSX escaping
- Recommendations: Add input validation/sanitization before any future backend integration.

**External Font Loading Without SRI:**
- Risk: Google Fonts CSS is loaded via `@import url()` in `src/styles/fonts.css` without Subresource Integrity (SRI) hashes. A CDN compromise could inject malicious CSS.
- Files: `src/styles/fonts.css`
- Current mitigation: None
- Recommendations: Self-host fonts or add SRI hashes. Consider using `font-display: swap` for performance (currently using `display=swap` in the URL).

## Performance Bottlenecks

**Excessive Motion/Animation on Every Screen:**
- Problem: Every screen wraps most elements in `motion.div` with entrance animations. The ClusteringScreen and SearchScreen create dozens of independently animated elements with spring physics.
- Files: `src/app/screens/ClusteringScreen.tsx` (20 waveform bars + word bubbles + cluster cards + SVG paths), `src/app/screens/SearchScreen.tsx` (10 sticky notes with spring animations), `src/app/screens/VoiceDumpScreen.tsx` (3 pulsing circles + 20 waveform bars)
- Cause: Animation-heavy design with no reduced-motion support and no lazy loading of animation-heavy screens
- Improvement path: Add `prefers-reduced-motion` media query support. Use `React.lazy()` for route-based code splitting. Memoize animation values instead of recalculating with `Math.random()`.

**No Code Splitting:**
- Problem: All 8 screens and all 48 UI components are bundled into a single chunk despite `react-router` being used.
- Files: `src/app/routes.tsx`
- Cause: Direct imports instead of lazy imports in route definitions
- Improvement path: Use `React.lazy()` with `Suspense` for each route component.

**Large Unused Dependency Payload:**
- Problem: `package.json` includes heavy dependencies that appear unused: `recharts`, `react-slick`, `react-responsive-masonry`, `react-dnd` + `react-dnd-html5-backend` (DndProvider is mounted but drag-and-drop is never used), `@mui/material` + `@mui/icons-material` + `@emotion/react` + `@emotion/styled` (MUI is never imported in any screen), `react-hook-form`, `react-day-picker`, `embla-carousel-react`, `cmdk`, `sonner`, `next-themes`, `react-popper`, `@popperjs/core`.
- Files: `package.json` (lines 10-64)
- Cause: Figma Make scaffolding includes everything by default
- Improvement path: Remove all unused dependencies. At minimum remove MUI suite (~2MB), recharts, react-slick, react-responsive-masonry, react-dnd suite. This would significantly reduce install time and bundle size.

## Fragile Areas

**ClusteringScreen Layout and Connection Drawing:**
- Files: `src/app/screens/ClusteringScreen.tsx`
- Why fragile: Cluster positions use percentage-based coordinates converted to pixels via `getBoundingClientRect()`. Connection line paths are calculated with hardcoded offsets. Any change to container sizing, padding, or cluster card dimensions will break visual alignment.
- Safe modification: Test at multiple viewport sizes. The connection drawing logic (lines 150-159) needs to be recalculated if cluster card dimensions change.
- Test coverage: None

**SearchScreen Phase Transitions:**
- Files: `src/app/screens/SearchScreen.tsx`
- Why fragile: Three animation phases ("flying", "gathering", "timeline") are timed with hardcoded `setTimeout` delays that depend on the number of notes. Adding or removing notes changes timing. The `window.innerWidth/innerHeight` references in animation targets make the layout viewport-dependent.
- Safe modification: If changing the `stickyNotes` array, recalculate all setTimeout values. The gathering phase animation uses `window.innerWidth / 2` which is captured at render time.
- Test coverage: None

**SynthesisScreen Auto-Navigation:**
- Files: `src/app/screens/SynthesisScreen.tsx`
- Why fragile: The screen auto-navigates to `/project` after a fixed 5.5-second animation sequence. There is no way to pause, restart, or skip. If the user navigates away and back, the animation replays from scratch.
- Safe modification: Consider adding a skip button or storing animation-completed state.
- Test coverage: None

## Scaling Limits

**In-Memory State Only:**
- Current capacity: One session, one user, data lost on refresh
- Limit: Cannot store any persistent data
- Scaling path: Add localStorage for session persistence, then a backend API/database for multi-session and multi-user support.

## Dependencies at Risk

**Figma Make Scaffold Lock-In:**
- Risk: The project was generated by Figma Make (see `package.json` name `@figma/my-make-file` and `vite.config.ts` comments about not removing plugins). The configuration contains Figma-specific constraints.
- Impact: Unclear which config items can be safely modified. The `assetsInclude` and plugin comments suggest tight coupling to the Figma Make build system.
- Migration plan: Audit and document which config items are Figma Make requirements vs app requirements. Rename the package and remove Figma-specific constraints if decoupling from Figma Make.

**next-themes in a Non-Next.js App:**
- Risk: `next-themes` is listed as a dependency but this is a Vite/React app, not Next.js. It may not function correctly outside of Next.js.
- Impact: If dark mode is attempted using `next-themes`, it will likely fail or behave unexpectedly.
- Migration plan: Remove `next-themes`. Use a simple React context or CSS media query approach for theme switching.

## Missing Critical Features

**No Real Voice Recording:**
- Problem: The VoiceDumpScreen shows a pulsing animation and fake transcript but does not access the microphone or record audio.
- Blocks: The entire voice-to-text pipeline (core feature of the app).

**No Real Search:**
- Problem: DashboardScreen search only navigates to `/search` if the query contains "blog". There is no actual search implementation.
- Blocks: Finding and filtering user content.

**No Real Clustering/Synthesis:**
- Problem: ClusteringScreen and SynthesisScreen display hardcoded, pre-determined results with no actual NLP or clustering logic.
- Blocks: The core value proposition of organizing unstructured thoughts.

**No Error Boundaries:**
- Problem: No React error boundaries anywhere in the component tree. Any runtime error crashes the entire app.
- Blocks: Production readiness.

**No Accessibility:**
- Problem: No ARIA labels, no keyboard navigation support, no screen reader considerations, no `prefers-reduced-motion` support despite heavy animation usage. The voice recording screen has no accessible status indicators.
- Blocks: Accessibility compliance and inclusive design.

## Test Coverage Gaps

**Zero Tests:**
- What's not tested: Everything. There are no test files, no test configuration, no test runner, no test dependencies.
- Files: Entire `src/` directory
- Risk: Any change can introduce regressions undetected. The complex animation timing in ClusteringScreen, SearchScreen, and SynthesisScreen is especially fragile.
- Priority: High - Add at minimum: route navigation tests, component render tests for each screen, and interaction tests for TextDumpScreen and WelcomeScreen inputs.

**No Linting or Formatting:**
- What's not enforced: No `.eslintrc`, `.prettierrc`, or any code quality tooling configured.
- Files: Project root (missing config files)
- Risk: Inconsistent code style, unused imports, missing dependencies in useEffect arrays go undetected.
- Priority: Medium - Add ESLint with React and TypeScript plugins, Prettier for formatting.

---

*Concerns audit: 2026-03-07*
