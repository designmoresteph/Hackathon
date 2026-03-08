# Testing Patterns

**Analysis Date:** 2026-03-07

## Test Framework

**Runner:**
- Not configured. No test framework is installed or set up.
- No `jest`, `vitest`, `@testing-library/react`, or any other testing dependency in `package.json`

**Assertion Library:**
- None

**Run Commands:**
```bash
# No test scripts defined in package.json
# Only available scripts:
npm run build   # vite build
npm run dev     # vite
```

## Test File Organization

**Location:**
- No test files exist anywhere in the codebase

**Naming:**
- No convention established

**Structure:**
- Not applicable

## Test Structure

No tests exist. If tests were to be added, follow these recommendations based on the codebase:

**Recommended Framework:** Vitest (aligns with Vite build tool already in use)

**Recommended Setup:**
```bash
# Install
pnpm add -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

**Recommended Config (`vitest.config.ts`):**
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

**Recommended Test Location:** Co-locate tests with source files:
```
src/app/screens/WelcomeScreen.tsx
src/app/screens/WelcomeScreen.test.tsx
src/app/components/AnimatedGradient.tsx
src/app/components/AnimatedGradient.test.tsx
```

## Mocking

**Framework:** Not applicable (no tests exist)

**If adding tests, mock these:**
- `react-router` navigation (`useNavigate`)
- `motion/react` animations (or use `motion` test utilities)
- `window.innerWidth` / `window.innerHeight` (used in `VoiceDumpScreen.tsx` and `ClusteringScreen.tsx`)
- `setTimeout` calls used for simulated async in `DashboardScreen.tsx`, `SynthesisScreen.tsx`
- `figma:asset/*` imports (custom Vite asset resolution)

**What NOT to Mock:**
- React state and hooks (test real behavior)
- shadcn/ui components (test through their rendered output)
- Tailwind/CSS classes (not relevant to behavior tests)

## Fixtures and Factories

**Test Data:**
- Not applicable. However, significant hardcoded mock data exists in components that could be extracted:
  - `src/app/screens/VoiceDumpScreen.tsx`: `transcriptLines` array
  - `src/app/screens/ClusteringScreen.tsx`: `allWords` array, `initialClusterData` array
  - `src/app/screens/SearchScreen.tsx`: `stickyNotes` array
  - `src/app/screens/DashboardScreen.tsx`: mock AI responses in `setTimeout` callbacks

**Location:**
- No fixtures directory exists

## Coverage

**Requirements:** None enforced

**View Coverage:**
```bash
# Not configured
```

## Test Types

**Unit Tests:**
- None exist. Priority candidates:
  - `src/app/components/ui/utils.ts` (`cn` function)
  - `src/app/components/figma/ImageWithFallback.tsx` (error fallback logic)
  - `src/app/components/ui/use-mobile.ts` (responsive hook)

**Integration Tests:**
- None exist. Priority candidates:
  - Screen navigation flow (Welcome -> Voice/Text -> Cluster -> Dashboard)
  - DashboardScreen widget interaction (input -> processing -> response)

**E2E Tests:**
- Not configured. No Playwright, Cypress, or similar tool installed.

## Common Patterns

**Async Testing (recommended pattern for this codebase):**
```typescript
// Many components use setTimeout for simulated async behavior
// Use vi.useFakeTimers() or waitFor() to test these:
import { vi } from 'vitest'
import { render, act } from '@testing-library/react'

it('shows transcript lines over time', () => {
  vi.useFakeTimers()
  render(<VoiceDumpScreen />)
  act(() => { vi.advanceTimersByTime(3000) })
  // assert first transcript line visible
  vi.useRealTimers()
})
```

**Navigation Testing (recommended pattern):**
```typescript
import { MemoryRouter } from 'react-router'

it('navigates to /voice on voice button click', () => {
  const navigate = vi.fn()
  vi.mock('react-router', () => ({
    ...vi.importActual('react-router'),
    useNavigate: () => navigate,
  }))
  // render and click, assert navigate('/voice') called
})
```

## Summary

This is a Figma Make-generated prototype with zero test infrastructure. All behavior is UI-driven with hardcoded mock data and `setTimeout`-simulated async operations. If testing is to be added, Vitest with React Testing Library is the natural fit given the Vite build system already in place.

---

*Testing analysis: 2026-03-07*
