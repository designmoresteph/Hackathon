# Codebase Structure

**Analysis Date:** 2026-03-07

## Directory Layout

```
illustrious-brook/
├── .planning/              # Planning and analysis documents
├── guidelines/             # AI guidelines for Figma Make
│   └── Guidelines.md       # Placeholder for design/coding rules
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── figma/      # Figma Make utility components
│   │   │   │   └── ImageWithFallback.tsx
│   │   │   ├── ui/         # shadcn/ui primitives (48 files)
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── textarea.tsx
│   │   │   │   ├── utils.ts        # cn() class merge utility
│   │   │   │   ├── use-mobile.ts   # useIsMobile() hook
│   │   │   │   └── ... (45 more)
│   │   │   └── AnimatedGradient.tsx # Animated background component
│   │   ├── screens/        # Full-page screen components
│   │   │   ├── WelcomeScreen.tsx
│   │   │   ├── VoiceDumpScreen.tsx
│   │   │   ├── TextDumpScreen.tsx
│   │   │   ├── ClusteringScreen.tsx
│   │   │   ├── DashboardScreen.tsx
│   │   │   ├── SearchScreen.tsx
│   │   │   ├── SynthesisScreen.tsx
│   │   │   └── ProjectScreen.tsx
│   │   ├── App.tsx          # Root component (providers)
│   │   └── routes.tsx       # Route definitions
│   ├── assets/              # Static assets (images)
│   │   └── 3c7af6a14225d1ee2a77d186872f69245c52483a.png
│   ├── imports/             # Figma Make design reference docs
│   │   ├── screen-flow.md
│   │   ├── starter_design_system.md
│   │   └── starter_design_system-1.md
│   ├── styles/
│   │   ├── index.css        # CSS entry (imports others)
│   │   ├── fonts.css        # Google Fonts imports
│   │   ├── tailwind.css     # Tailwind v4 source config
│   │   └── theme.css        # Design tokens (CSS custom properties)
│   └── main.tsx             # App bootstrap / React root mount
├── index.html               # HTML shell
├── package.json             # Dependencies and scripts
├── postcss.config.mjs       # PostCSS config (empty, Tailwind handles it)
├── vite.config.ts           # Vite build config with path aliases
├── ATTRIBUTIONS.md          # Asset attributions
└── README.md                # Project readme
```

## Directory Purposes

**`src/app/screens/`:**
- Purpose: Full-page view components, one per route
- Contains: 8 screen components representing the user journey flow
- Key files: `WelcomeScreen.tsx` (entry), `DashboardScreen.tsx` (hub), `ProjectScreen.tsx` (final destination)

**`src/app/components/ui/`:**
- Purpose: shadcn/ui component library -- pre-built, accessible UI primitives
- Contains: 48 component files wrapping Radix UI primitives with Tailwind styles
- Key files: `button.tsx`, `card.tsx`, `input.tsx`, `textarea.tsx`, `utils.ts` (cn helper), `use-mobile.ts` (responsive hook)

**`src/app/components/`:**
- Purpose: App-specific reusable components (not UI primitives)
- Contains: `AnimatedGradient.tsx` (welcome screen background), `figma/ImageWithFallback.tsx` (error-safe image)

**`src/app/components/figma/`:**
- Purpose: Utility components generated/used by Figma Make
- Contains: `ImageWithFallback.tsx`

**`src/styles/`:**
- Purpose: Global styles, design tokens, Tailwind configuration
- Contains: CSS files imported by `index.css` entry point
- Key files: `theme.css` (all design tokens and CSS variables), `fonts.css` (Google Fonts CDN imports)

**`src/imports/`:**
- Purpose: Reference documentation imported from Figma Make (design specs, screen flow)
- Contains: Markdown files describing the design system and screen-by-screen flow
- Key files: `screen-flow.md` (detailed UX flow for all 7 screens)

**`src/assets/`:**
- Purpose: Static image assets referenced by components
- Contains: Cloud image PNG used in VoiceDumpScreen and ClusteringScreen

**`guidelines/`:**
- Purpose: AI coding guidelines for Figma Make generation
- Contains: `Guidelines.md` (currently a placeholder template)

## Key File Locations

**Entry Points:**
- `index.html`: HTML shell with `<div id="root">` mount point
- `src/main.tsx`: React root creation, global CSS import
- `src/app/App.tsx`: Root component with DndProvider and RouterProvider
- `src/app/routes.tsx`: All route definitions (8 routes)

**Configuration:**
- `vite.config.ts`: Vite config with React plugin, Tailwind plugin, `@` path alias to `src/`
- `postcss.config.mjs`: Empty PostCSS config (Tailwind v4 handles plugins)
- `package.json`: Dependencies, `dev` and `build` scripts

**Core Logic:**
- `src/app/screens/ClusteringScreen.tsx`: Most complex screen -- drag-and-drop clusters, SVG connections, word animations
- `src/app/screens/DashboardScreen.tsx`: Central hub with AI widget interactions (simulated)
- `src/app/screens/SearchScreen.tsx`: Multi-phase animated search results
- `src/app/screens/SynthesisScreen.tsx`: Collapse animation sequence

**Styling:**
- `src/styles/theme.css`: All CSS custom properties (design tokens, colors, radii, Tailwind compatibility vars)
- `src/styles/fonts.css`: Google Fonts CDN imports (Playfair Display, Lora, DM Sans, DM Mono, Cormorant Garamond, Outfit)
- `src/styles/tailwind.css`: Tailwind v4 source configuration with `tw-animate-css`

**Design Reference:**
- `src/imports/screen-flow.md`: Screen-by-screen UX specification
- `src/imports/starter_design_system.md`: Design system tokens and rules

## Naming Conventions

**Files:**
- Screen components: `PascalCase` with `Screen` suffix: `WelcomeScreen.tsx`, `DashboardScreen.tsx`
- UI primitives: `kebab-case`: `button.tsx`, `alert-dialog.tsx`, `toggle-group.tsx`
- Custom components: `PascalCase`: `AnimatedGradient.tsx`, `ImageWithFallback.tsx`
- Hooks: `use-` prefix, kebab-case: `use-mobile.ts`
- Utilities: `camelCase`: `utils.ts`
- CSS files: `kebab-case`: `index.css`, `theme.css`, `fonts.css`

**Directories:**
- Lowercase: `screens/`, `components/`, `styles/`, `assets/`, `imports/`
- Nested grouping: `components/ui/`, `components/figma/`

**Exports:**
- Screen components: Named exports (`export function WelcomeScreen`)
- UI primitives: Named exports (`export function Button`, `export function Card`)
- Custom components: Named exports (`export function AnimatedGradient`)
- Utilities: Named exports (`export function cn`)

## Where to Add New Code

**New Screen:**
- Create file: `src/app/screens/{Name}Screen.tsx`
- Add route: `src/app/routes.tsx` -- add a new object to the router array
- Pattern: Named export function component, use `useNavigate()` for transitions, `motion` for animations

**New Reusable Component:**
- App-specific component: `src/app/components/{ComponentName}.tsx`
- UI primitive (shadcn/ui style): `src/app/components/ui/{component-name}.tsx`

**New Hook:**
- Place in: `src/app/components/ui/use-{name}.ts` (following existing pattern)
- Or create `src/app/hooks/` directory for app-specific hooks

**New Style/Token:**
- Design tokens: Add CSS custom properties to `src/styles/theme.css` under `:root`
- New font: Add `@import` to `src/styles/fonts.css`

**New Static Asset:**
- Place in: `src/assets/`
- Import using: Vite asset import or `figma:asset/` prefix for Figma-exported assets

**Utilities:**
- Class merging: Use `cn()` from `src/app/components/ui/utils.ts`
- New shared utilities: Create `src/app/lib/` or `src/app/utils/` directory

## Special Directories

**`src/imports/`:**
- Purpose: Figma Make design reference documents (not code)
- Generated: Yes, by Figma Make
- Committed: Yes

**`src/app/components/ui/`:**
- Purpose: shadcn/ui component library
- Generated: Yes, via shadcn/ui CLI or Figma Make
- Committed: Yes
- Note: Contains 48 component files; many are likely unused by current screens but available for future use

**`src/assets/`:**
- Purpose: Static image assets exported from Figma
- Generated: Yes, from Figma
- Committed: Yes

---

*Structure analysis: 2026-03-07*
