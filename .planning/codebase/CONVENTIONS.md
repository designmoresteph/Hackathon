# Coding Conventions

**Analysis Date:** 2026-03-07

## Naming Patterns

**Files:**
- UI components in `src/app/components/ui/`: kebab-case (e.g., `alert-dialog.tsx`, `hover-card.tsx`, `toggle-group.tsx`)
- Screen components in `src/app/screens/`: PascalCase with `Screen` suffix (e.g., `DashboardScreen.tsx`, `WelcomeScreen.tsx`)
- Figma helper components in `src/app/components/figma/`: PascalCase (e.g., `ImageWithFallback.tsx`)
- Hooks: kebab-case prefixed with `use-` (e.g., `use-mobile.ts`)
- Utility files: lowercase (e.g., `utils.ts`)
- CSS files: lowercase (e.g., `fonts.css`, `theme.css`, `tailwind.css`)

**Functions/Components:**
- Use PascalCase for React components: `DashboardScreen`, `WelcomeScreen`, `ImageWithFallback`
- Use camelCase for event handlers: `handleSearch`, `handleStart`, `handleClusterClick`
- Use camelCase for helper functions: `getGreeting`, `formatTime`, `getClusterCenter`
- Use camelCase for hooks: `useIsMobile`, `useSidebar`

**Variables:**
- Use camelCase: `timeLeft`, `isRecording`, `connectMode`, `selectedCluster`
- Use UPPER_SNAKE_CASE for constants: `MOBILE_BREAKPOINT`, `SIDEBAR_COOKIE_NAME`, `SIDEBAR_WIDTH`

**Types/Interfaces:**
- Use PascalCase with `interface` keyword: `Cluster`, `Connection`, `StickyNote`, `SidebarContextProps`
- Use inline types via `React.ComponentProps<"element">` for component props rather than separate prop interfaces
- Union types for string literals: `"voice" | "text" | "image"`, `"expanded" | "collapsed"`

## Code Style

**Formatting:**
- No ESLint or Prettier config files detected -- formatting is informal/manual
- Double quotes for strings in JSX and imports
- Semicolons at end of statements
- 2-space indentation

**Linting:**
- No linter configured. No `.eslintrc`, `biome.json`, or similar config files present.

## Component Patterns

**UI Components (shadcn/ui style):**
- Use function declarations (not arrow functions) for components
- Destructure props with rest spread: `{ className, ...props }`
- Apply `cn()` utility for merging Tailwind classes
- Use `data-slot` attributes for component identification
- Export named components (not default exports) from UI files
- Use `class-variance-authority` (cva) for component variants

```tsx
// Pattern from `src/app/components/ui/button.tsx`
function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
```

**Screen Components:**
- Use named function declarations with `export function` (not default export)
- Self-contained: all state, effects, and handlers defined within the component
- Use `useNavigate()` from react-router for navigation
- Wrap content in `motion.div` from `motion/react` for entry animations
- Apply inline `style` props for brand colors rather than Tailwind color classes

```tsx
// Pattern from `src/app/screens/WelcomeScreen.tsx`
export function WelcomeScreen() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  // ...handlers...
  return (
    <div className="min-h-screen ..." style={{ backgroundColor: '#F7F5F0' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* content */}
      </motion.div>
    </div>
  );
}
```

## Import Organization

**Order:**
1. React and React hooks (`import { useState, useEffect } from "react"`)
2. Third-party libraries (`react-router`, `motion/react`, `lucide-react`)
3. Local UI components (`../components/ui/button`, `../components/ui/card`)
4. Local utilities (if any)

**Path Aliases:**
- `@` is aliased to `./src` in `vite.config.ts`, but screen components currently use relative paths (`../components/ui/button`) rather than the alias
- Use `@/` prefix for imports from `src/` when crossing directory boundaries

## Styling Conventions

**Approach: Tailwind CSS v4 + inline styles for brand colors**

- Use Tailwind utility classes for layout, spacing, typography sizing, and responsive design
- Use inline `style={{ }}` props for brand-specific colors (not Tailwind color classes)
- Brand color palette defined as CSS custom properties in `src/styles/theme.css`
- Use the `cn()` utility from `src/app/components/ui/utils.ts` to merge classes

**Key brand colors (use via inline styles):**
- Background: `#F7F5F0` (off-white), `#1A1A1A` (dark)
- Text: `#0D0D0D` (primary), `#6B6B6B` (secondary), `#A8A49E` (muted)
- Accent: `#F5E642` (yellow), `#F5C4A1` (peach), `#C8D5B0` (sage), `#F0D5D0` (blush)
- Border: `#E8E5E0`

**Typography (use via inline className):**
- Headings (large): `font-['Playfair_Display']` with `tracking-[-0.02em]`
- Headings (medium): `font-['Lora']` with `tracking-[-0.01em]`
- Body text: `font-['DM_Sans'] font-light`
- Labels/buttons: `font-['Outfit'] font-semibold text-xs tracking-[0.08em] uppercase`
- Accent/italic: `font-['Cormorant_Garamond'] italic font-light`

**Button styling pattern:**
```tsx
// CTA button
className="rounded-full font-['Outfit'] font-semibold text-xs tracking-[0.08em] uppercase h-12 px-7 transition-all hover:-translate-y-0.5"
style={{ backgroundColor: '#F5E642', color: '#0D0D0D', border: 'none' }}

// Outline button
className="rounded-full border-[1.5px] font-['Outfit'] font-semibold text-xs tracking-[0.08em] uppercase transition-all hover:-translate-y-0.5"
style={{ borderColor: '#0D0D0D', color: '#0D0D0D' }}
```

## Animation Conventions

**Library:** `motion` (Framer Motion) via `motion/react`

**Entry animations:**
- Fade in with slide up: `initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}`
- Fade in with scale: `initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}`
- Staggered delays: `transition={{ delay: 0.1 * index }}`

**Interactive animations:**
- Hover lift: `hover:-translate-y-0.5` or `hover:-translate-y-1` via Tailwind
- Pulsing: `animate={{ scale: [1, 1.1, 1], opacity: [0.6, 0.8, 0.6] }}` with `repeat: Infinity`

## Error Handling

**Patterns:**
- Minimal error handling throughout the codebase
- Image fallback pattern in `src/app/components/figma/ImageWithFallback.tsx` using `onError` + state toggle
- No try/catch blocks, error boundaries, or error states in screen components
- Context validation via runtime check: `if (!context) throw new Error(...)` in `src/app/components/ui/sidebar.tsx`

## Logging

**Framework:** None. No logging framework or `console.log` statements detected.

## Comments

**When to Comment:**
- Section headers within JSX using `{/* Header */}`, `{/* Dashboard Grid */}`, `{/* Timer */}` pattern
- Inline color annotations: `// sage`, `// blush`, `// yellow`
- Brief explanatory comments for non-obvious logic

**JSDoc/TSDoc:**
- Not used. No JSDoc annotations in the codebase.

## Function Design

**Size:** Screen components are 100-350 lines (monolithic). UI components are 10-60 lines (focused).

**Parameters:** Use object destructuring for component props. Simple functions use positional params.

**Return Values:** Components return JSX. Helper functions return primitives.

## Module Design

**Exports:**
- Screen components: single named export per file (`export function DashboardScreen`)
- UI components: multiple named exports per file (`export { Card, CardHeader, CardContent, ... }`)
- No default exports except `src/app/App.tsx`
- No barrel files (no `index.ts` re-exports)

**State Management:**
- Local `useState` only. No global state management library.
- No Context providers except the sidebar component's built-in context.
- Mock/hardcoded data embedded directly in screen components.

---

*Convention analysis: 2026-03-07*
