# External Integrations

**Analysis Date:** 2026-03-07

## APIs & External Services

**None detected.** This is a frontend-only prototype with no API calls, no `fetch()` usage, and no HTTP client libraries (axios, ky, etc.). All data displayed in screens is hardcoded/static.

## Data Storage

**Databases:**
- None - No database connection or ORM detected

**File Storage:**
- Local filesystem only (SVG and CSV assets via Vite raw imports)

**Caching:**
- None

## Authentication & Identity

**Auth Provider:**
- None - No authentication system detected

## Monitoring & Observability

**Error Tracking:**
- None

**Logs:**
- None (no logging framework or structured logging)

## CI/CD & Deployment

**Hosting:**
- Not configured - Static SPA, deployable to any static host

**CI Pipeline:**
- None detected (no `.github/workflows/`, no CI config files)

## Environment Configuration

**Required env vars:**
- None - No `.env` files present, no `import.meta.env` usage detected

**Secrets location:**
- Not applicable

## External Font Service

**Google Fonts:**
- Loaded via CSS `@import url()` in `src/styles/fonts.css`
- Families: Playfair Display, Lora, DM Sans, DM Mono, Cormorant Garamond, Outfit
- This is the only external network dependency

## Webhooks & Callbacks

**Incoming:**
- None

**Outgoing:**
- None

## Integration Notes

This codebase is a Figma Make-generated frontend prototype. It contains:
- Static screen mockups with hardcoded data
- No backend connectivity
- No state persistence between sessions
- The `package.json` name `@figma/my-make-file` confirms this is generated from Figma's Make tool

Any future backend integration would need to add:
- An HTTP client (fetch wrapper or axios)
- Environment variable configuration for API endpoints
- State management beyond React's `useState` (e.g., React Query, Zustand)
- Authentication flow

---

*Integration audit: 2026-03-07*
