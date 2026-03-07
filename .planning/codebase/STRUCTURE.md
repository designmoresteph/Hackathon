# Codebase Structure

**Analysis Date:** 2026-03-07

## Directory Layout

```
illustrious-brook/
├── .planning/              # Planning and analysis documents
│   └── codebase/           # Codebase mapping documents
├── guidelines/             # AI/Figma Make guidelines
│   └── Guidelines.md       # Custom guidelines (template, mostly empty)
├── src/                    # All application source code
│   ├── app/                # Application logic
│   │   ├── components/     # Reusable components
│   │   │   ├── figma/      # Figma Make utility components
│   │   │   └── ui/         # shadcn/ui component library (45+ components)
│   │   ├── screens/        # Full-page screen components (8 screens)
│   │   ├── App.tsx         # Root app component with providers
│   │   └── routes.tsx      # Client-side route definitions
│   ├── imports/            # Design documentation imported from Figma
│   │   ├── screen-flow.md  # Screen-by-screen UX specification
│   │   ├── starter_design_system.md
│   │   └── starter_design_system-1.md
│   ├── styles/             # Global CSS and theme
│   │   ├── fonts.css       # Google Fonts imports
│   │   ├── index.css       # CSS entry point (imports all others)
│   │   ├── tailwind.css    # Tailwind v4 configuration
│   │   └── theme.css       # Design system CSS custom properties
│   └── main.tsx            # Application entry point
├── index.html              # HTML shell (Vite entry)
├── package.json            # Dependencies and scripts
├── postcss.config.mjs      # PostCSS config (empty, Tailwind v4 handles it)
├── vite.config.ts          # Vite build config with path aliases
├── ATTRIBUTIONS.md         # Third-party attributions
└── README.md               # Project readme
```

## Directory Purposes

**`src/app/screens/`:**
- Purpose: Each file is a full-page view in the user flow
- Contains: 8 screen components, one per file
- Key files:
  - `WelcomeScreen.tsx`: Landing page with name input and mode selection
  - `VoiceDumpScreen.tsx`: Voice recording simulation with timer and transcript
  - `TextDumpScreen.tsx`: Free-form text input
  - `ClusteringScreen.tsx`: Animated word clustering and connection visualization
  - `DashboardScreen.tsx`: Widget-based dashboard with cards
  - `SearchScreen.tsx`: Sticky note search with timeline view
  - `SynthesisScreen.tsx`: Animation-driven note synthesis
  - `ProjectScreen.tsx`: Three-panel project workspace (outline, editor, widgets)

**`src/app/components/ui/`:**
- Purpose: shadcn/ui component library - pre-built, accessible UI primitives
- Contains: 45+ component files plus utilities
- Key files:
  - `button.tsx`: Button with variants (default, destructive, outline, secondary, ghost, link) and sizes
  - `card.tsx`: Card layout components (Card, CardHeader, CardTitle, CardContent, etc.)
  - `input.tsx`: Text input component
  - `textarea.tsx`: Multi-line text input
  - `utils.ts`: `cn()` utility combining `clsx` and `tailwind-merge`
  - `use-mobile.ts`: `useIsMobile()` hook (breakpoint at 768px)

**`src/app/components/figma/`:**
- Purpose: Figma Make-specific utility components
- Contains: `ImageWithFallback.tsx` - image with error state fallback

**`src/styles/`:**
- Purpose: Global styling foundation
- Contains: CSS files for theme tokens, fonts, and Tailwind setup
- Key files:
  - `theme.css`: Design system CSS custom properties (colors, typography, spacing) with light/dark mode support
  - `fonts.css`: Google Fonts import for Playfair Display, Lora, DM Sans, DM Mono, Cormorant Garamond, Outfit
  - `tailwind.css`: Tailwind v4 setup with `tw-animate-css` plugin
  - `index.css`: Aggregates all style imports

**`src/imports/`:**
- Purpose: Design documentation and specifications imported from Figma
- Contains: Screen flow spec and design system documentation
- Note: These are reference docs, not consumed by application code

## Key File Locations

**Entry Points:**
- `index.html`: HTML shell, loads `src/main.tsx`
- `src/main.tsx`: Creates React root, renders `<App />`, imports global styles
- `src/app/App.tsx`: Root component with DndProvider and RouterProvider
- `src/app/routes.tsx`: All route definitions

**Configuration:**
- `vite.config.ts`: Vite config with React plugin, Tailwind plugin, `@` path alias to `src/`
- `package.json`: Dependencies, scripts (`dev`, `build`)
- `postcss.config.mjs`: Empty (Tailwind v4 handles PostCSS internally)

**Core Logic:**
- `src/app/screens/*.tsx`: All application logic lives in screen components
- `src/app/routes.tsx`: Route mapping

**Styling:**
- `src/styles/theme.css`: All design tokens and CSS variables
- `src/styles/fonts.css`: Font loading
- `src/styles/tailwind.css`: Tailwind v4 source configuration

## Naming Conventions

**Files:**
- Screen components: `PascalCase` + `Screen` suffix (e.g., `WelcomeScreen.tsx`, `DashboardScreen.tsx`)
- UI components: `kebab-case.tsx` (e.g., `button.tsx`, `alert-dialog.tsx`, `hover-card.tsx`)
- Hooks: `use-kebab-case.ts` (e.g., `use-mobile.ts`)
- Utility files: `kebab-case.ts` (e.g., `utils.ts`)
- CSS files: `kebab-case.css` (e.g., `theme.css`, `fonts.css`)

**Directories:**
- All lowercase, singular or descriptive (e.g., `screens`, `components`, `styles`, `imports`)

**Exports:**
- Screen components: Named export functions (e.g., `export function WelcomeScreen()`)
- UI components: Named exports (e.g., `export { Button, buttonVariants }`)
- No default exports except `src/app/App.tsx`

## Where to Add New Code

**New Screen:**
1. Create `src/app/screens/YourScreen.tsx` with named export
2. Add route entry in `src/app/routes.tsx`
3. Follow pattern: use `useNavigate()` for navigation, `motion` for animations, local `useState` for state

**New UI Component (custom):**
- Place in `src/app/components/` (not in `ui/` which is shadcn-managed)
- Use `cn()` from `src/app/components/ui/utils.ts` for class merging

**New shadcn/ui Component:**
- Place in `src/app/components/ui/`
- Follow existing shadcn/ui patterns (Radix primitives, `cva` variants, `cn()` utility)

**New Shared Hook:**
- Place in `src/app/components/ui/` following `use-*.ts` naming (current convention)
- Or create `src/app/hooks/` directory for app-specific hooks

**New Styles:**
- Add CSS custom properties to `src/styles/theme.css`
- Import new CSS files from `src/styles/index.css`

**New Utility Functions:**
- Add to `src/app/components/ui/utils.ts` for component utilities
- Or create new file in appropriate location

## Special Directories

**`src/imports/`:**
- Purpose: Design documentation and specifications from Figma
- Generated: Yes (from Figma Make)
- Committed: Yes
- Note: Reference only; not imported by application code

**`src/app/components/ui/`:**
- Purpose: shadcn/ui component library
- Generated: Yes (via shadcn CLI or Figma Make)
- Committed: Yes
- Note: These are "owned" copies - they can be modified, but follow shadcn patterns

**`.planning/`:**
- Purpose: Project planning and analysis documents
- Generated: By tooling
- Committed: Depends on workflow

## Path Aliases

**`@` -> `src/`:**
- Configured in `vite.config.ts` via `resolve.alias`
- Use `@/app/components/ui/button` instead of relative paths from deeply nested files
- Screens currently use relative imports (e.g., `../components/ui/input`)

## Design System Color Palette

Defined in `src/styles/theme.css` as CSS custom properties:
- `--off-white: #F7F5F0` (primary background)
- `--cream: #F2EFE9` (secondary background)
- `--black: #0D0D0D` (primary text)
- `--dark: #1A1A1A` (dark backgrounds like VoiceDump/Synthesis)
- `--yellow: #F5E642` (primary CTA/accent)
- `--peach: #F5C4A1` (warm accent)
- `--sage: #C8D5B0` (cool accent)
- `--blush: #F0D5D0` (soft accent)

## Typography

Six Google Fonts loaded in `src/styles/fonts.css`:
- **Playfair Display**: Large headings (hero text, page titles)
- **Lora**: Section headings, card titles
- **DM Sans**: Body text, descriptions (weight 300 for light feel)
- **DM Mono**: Monospace (available but not currently used in screens)
- **Cormorant Garamond**: Italic hint text, atmospheric quotes
- **Outfit**: Labels, buttons, metadata (uppercase tracking)

---

*Structure analysis: 2026-03-07*
