# Technology Stack

**Analysis Date:** 2026-03-07

## Languages

**Primary:**
- TypeScript / TSX - All application code in `src/`

**Secondary:**
- CSS - Styling via Tailwind CSS and custom CSS variables in `src/styles/`

## Runtime

**Environment:**
- Node.js (no `.nvmrc` or version constraint detected)

**Package Manager:**
- pnpm (configured via `pnpm.overrides` in `package.json`)
- Lockfile: Not committed (no `pnpm-lock.yaml` in repo)

## Frameworks

**Core:**
- React `18.3.1` - UI framework (listed as peerDependency in `package.json`)
- React Router `7.13.0` - Client-side routing via `createBrowserRouter` in `src/app/routes.tsx`
- Vite `6.3.5` - Build tool and dev server, configured in `vite.config.ts`

**UI Component Libraries:**
- MUI (Material UI) `7.3.5` - `@mui/material` and `@mui/icons-material` in `package.json`
- Radix UI Primitives - Extensive set of headless components (accordion, dialog, dropdown-menu, tabs, etc.) wrapped in `src/app/components/ui/`
- shadcn/ui pattern - Radix primitives + Tailwind styling in `src/app/components/ui/`

**Styling:**
- Tailwind CSS `4.1.12` - Utility-first CSS via `@tailwindcss/vite` plugin
- tw-animate-css `1.3.8` - Animation utilities imported in `src/styles/tailwind.css`
- Emotion `11.14.x` - CSS-in-JS (`@emotion/react`, `@emotion/styled`) for MUI compatibility

**Animation:**
- Motion (Framer Motion) `12.23.24` - Page and element animations, imported as `motion/react`

**Testing:**
- Not detected - No test framework, config, or test files present

**Build/Dev:**
- Vite `6.3.5` - Dev server and production builds
- `@vitejs/plugin-react` `4.7.0` - React Fast Refresh and JSX transform
- `@tailwindcss/vite` `4.1.12` - Tailwind CSS integration
- PostCSS - Minimal config in `postcss.config.mjs` (Tailwind handles plugins)

## Key Dependencies

**Critical:**
- `react` `18.3.1` - Core UI framework
- `react-router` `7.13.0` - All navigation and routing in `src/app/routes.tsx`
- `motion` `12.23.24` - Animations used across all screen components

**UI Utilities:**
- `lucide-react` `0.487.0` - Icon library used in all screens (Mic, Type, ImageIcon, Calendar, etc.)
- `class-variance-authority` `0.7.1` - Component variant management in UI components
- `clsx` `2.1.1` - Conditional className composition
- `tailwind-merge` `3.2.0` - Tailwind class deduplication (used via `cn()` in `src/app/components/ui/utils.ts`)

**Feature Libraries:**
- `react-dnd` `16.0.1` + `react-dnd-html5-backend` `16.0.1` - Drag and drop, wrapped at app root in `src/app/App.tsx`
- `react-hook-form` `7.55.0` - Form state management
- `recharts` `2.15.2` - Chart/data visualization
- `date-fns` `3.6.0` - Date utilities
- `react-day-picker` `8.10.1` - Calendar date picker in `src/app/components/ui/calendar.tsx`
- `embla-carousel-react` `8.6.0` - Carousel in `src/app/components/ui/carousel.tsx`
- `react-resizable-panels` `2.1.7` - Resizable panel layouts
- `react-responsive-masonry` `2.7.1` - Masonry grid layouts
- `react-slick` `0.31.0` - Slider/carousel
- `sonner` `2.0.3` - Toast notifications in `src/app/components/ui/sonner.tsx`
- `vaul` `1.1.2` - Drawer component in `src/app/components/ui/drawer.tsx`
- `cmdk` `1.1.1` - Command palette in `src/app/components/ui/command.tsx`
- `input-otp` `1.4.2` - OTP input in `src/app/components/ui/input-otp.tsx`
- `next-themes` `0.4.6` - Theme switching (light/dark)
- `@popperjs/core` `2.11.8` + `react-popper` `2.3.0` - Tooltip/popover positioning

## Configuration

**Path Aliases:**
- `@` maps to `./src` directory, configured in `vite.config.ts`

**Assets:**
- SVG and CSV files configured for raw imports in `vite.config.ts` via `assetsInclude`

**Build:**
- `vite.config.ts` - Vite configuration with React and Tailwind plugins
- `postcss.config.mjs` - Empty PostCSS config (Tailwind v4 handles its own setup)

**Fonts:**
- Google Fonts loaded via CSS import in `src/styles/fonts.css`
- Families: Playfair Display, Lora, DM Sans, DM Mono, Cormorant Garamond, Outfit

**Theming:**
- CSS custom properties defined in `src/styles/theme.css`
- Design system colors: off-white (#F7F5F0), black (#0D0D0D), yellow (#F5E642), peach (#F5C4A1), sage (#C8D5B0), blush (#F0D5D0)
- Dark mode variant defined but not actively used in screens
- Tailwind theme integration via `@theme inline` block in `src/styles/theme.css`

## Scripts

```bash
pnpm dev     # Start Vite dev server
pnpm build   # Production build via Vite
```

## Platform Requirements

**Development:**
- Node.js with pnpm
- No TypeScript config file detected (no `tsconfig.json`) - Vite handles TS transpilation

**Production:**
- Static SPA - outputs to `dist/` via `vite build`
- No server-side rendering
- Can be deployed to any static hosting (Netlify, Vercel, S3, etc.)

---

*Stack analysis: 2026-03-07*
