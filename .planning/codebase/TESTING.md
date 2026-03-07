# Testing Patterns

**Analysis Date:** 2026-03-07

## Test Framework

**Runner:**
- None configured. No test framework is installed or set up.
- No `jest`, `vitest`, `@testing-library/react`, or any test runner in `package.json` dependencies.
- No test configuration files (`jest.config.*`, `vitest.config.*`, `playwright.config.*`) exist.

**Run Commands:**
```bash
# No test commands defined in package.json scripts
# Only "build" and "dev" scripts exist
```

## Test File Organization

**Location:**
- No test files exist anywhere in the codebase.
- No `__tests__/` directories, `*.test.*` files, or `*.spec.*` files detected.

## Current State

This is a Figma Make-generated prototype project with zero test coverage. The codebase consists of:
- 8 screen components in `src/app/screens/`
- ~48 UI components in `src/app/components/ui/` (shadcn/ui)
- 1 helper component in `src/app/components/figma/`
- No business logic, API calls, or data layer to test

## Recommended Setup

If testing is to be added, follow this approach based on the existing stack (Vite + React + TypeScript):

**Recommended Framework:**
- Vitest (native Vite integration)
- @testing-library/react for component testing
- @testing-library/user-event for interaction testing

**Recommended Config:**
```bash
# Install
pnpm add -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

**Recommended vitest.config.ts:**
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

**Recommended File Organization:**
- Co-locate tests with source: `src/app/screens/DashboardScreen.test.tsx`
- Name pattern: `{ComponentName}.test.tsx`
- Shared test utilities: `src/test/setup.ts`, `src/test/utils.tsx`

**Recommended package.json scripts:**
```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  }
}
```

## What to Test First

**Priority 1 - Screen navigation flow:**
- `src/app/routes.tsx`: Verify all routes render correct screen components
- `src/app/screens/WelcomeScreen.tsx`: Button clicks navigate to correct routes

**Priority 2 - Interactive components:**
- `src/app/screens/ClusteringScreen.tsx`: Cluster connection logic (`handleClusterClick`)
- `src/app/screens/DashboardScreen.tsx`: Search handler navigation
- `src/app/screens/VoiceDumpScreen.tsx`: Timer countdown and transcript state

**Priority 3 - UI utilities:**
- `src/app/components/ui/utils.ts`: `cn()` function (simple but foundational)
- `src/app/components/figma/ImageWithFallback.tsx`: Error fallback behavior

## Test Patterns to Follow

**Component render test:**
```typescript
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { DashboardScreen } from './DashboardScreen'

describe('DashboardScreen', () => {
  it('renders greeting heading', () => {
    render(
      <MemoryRouter>
        <DashboardScreen />
      </MemoryRouter>
    )
    expect(screen.getByText(/good morning/i)).toBeInTheDocument()
  })
})
```

**Navigation test:**
```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { WelcomeScreen } from './WelcomeScreen'

const mockNavigate = vi.fn()
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router')
  return { ...actual, useNavigate: () => mockNavigate }
})

describe('WelcomeScreen', () => {
  it('navigates to /voice on Voice button click', async () => {
    render(
      <MemoryRouter>
        <WelcomeScreen />
      </MemoryRouter>
    )
    await userEvent.click(screen.getByText('Voice'))
    expect(mockNavigate).toHaveBeenCalledWith('/voice')
  })
})
```

**Utility test:**
```typescript
import { cn } from './utils'

describe('cn', () => {
  it('merges tailwind classes', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('px-4 py-1')
  })

  it('handles conditional classes', () => {
    expect(cn('base', false && 'hidden', 'extra')).toBe('base extra')
  })
})
```

## Mocking Considerations

**What to Mock:**
- `react-router` `useNavigate` hook (return `vi.fn()`)
- `window.innerWidth` / `window.innerHeight` for responsive tests
- `window.matchMedia` for `useIsMobile` hook tests
- Timer functions (`vi.useFakeTimers()`) for `VoiceDumpScreen` countdown

**What NOT to Mock:**
- shadcn/ui components -- render them as-is
- The `cn()` utility
- CSS/styling (use snapshot or visual tests if needed)
- Framer Motion animations (they degrade gracefully in test env)

## Coverage

**Requirements:** None enforced. No coverage thresholds configured.

## E2E Tests

**Framework:** Not used. No Playwright, Cypress, or similar detected.

If E2E is needed, Playwright is recommended given the Vite setup and multi-screen navigation flow.

---

*Testing analysis: 2026-03-07*
