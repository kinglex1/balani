# AGENTS.md

Architecture and conventions reference for AI agents working on this codebase.

## Project Overview

**CalcZA** is a South African micro-calculator platform. Free, mobile-friendly utility tools (tax, finance, education) built for organic SEO. Each tool lives as its own route + component.

**First live tool:** SARS Income Tax Calculator (2025/2026 tax year)

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | TanStack Start (SSR-capable React 19) |
| Router | TanStack Router v1, file-based routing in `src/routes/` |
| Build | Vite 7 |
| Styling | Tailwind CSS 4 + custom CSS vars (no component library) |
| Language | TypeScript 5.7, strict mode, `@/*` → `src/*` path alias |
| Deployment | Netlify (config in `netlify.toml`) |

## Directory Structure

```
src/
  components/
    SARSTaxCalculator.tsx   # SARS PAYE calculator — main feature component
    Calculator.tsx          # Original iOS-style calculator (unused, kept for reference)
  routes/
    __root.tsx              # HTML shell, global SEO meta tags (lang="en-ZA")
    index.tsx               # / → renders SARSTaxCalculator
  styles.css                # Tailwind import + CSS custom properties + animations
  router.tsx                # TanStack Router configuration
public/
  favicon.ico
netlify.toml                # Netlify build config (publish: dist/client)
vite.config.ts              # Vite plugins: TanStack Start, Tailwind, Netlify
tsconfig.json               # Strict TypeScript, @/* alias
```

## Design System

Colours, typography, and component classes are defined as CSS custom properties and utility classes in `src/styles.css`.

**Colour palette** (South African forest + amber):
- `--forest` (`#0d3320`) — primary background
- `--amber` (`#d4a244`) — primary accent / CTA
- `--amber-light` (`#e8bc6a`) — hover/highlight
- `--cream` (`#faf7f0`) — primary text
- `--muted` (`#8a9e8e`) — secondary text
- `--border` / `--border-strong` — amber-tinted borders

**Fonts** (Google Fonts, loaded in styles.css):
- `DM Serif Display` — headings (`.font-display`)
- `Outfit` — body / UI
- `DM Mono` — numeric values, code (`.font-mono`)

**Reusable CSS classes** (defined in styles.css):
- `.tax-input` — styled number input
- `.tax-select` — styled select with amber chevron
- `.btn-calculate` — amber CTA button
- `.result-card` — semi-transparent result row container
- `.tax-bar-track` / `.tax-bar-fill` — animated progress bar
- `.bracket-row` / `.active-bracket` — tax bracket table rows
- `.tool-chip` — pill badge for tool metadata
- `.nav-link` — header navigation link
- Animation utilities: `.animate-fade-up`, `.afd-1`–`.afd-6`, `.animate-scale-in`, `.animate-slide-in`

## Calculator Logic (SARSTaxCalculator.tsx)

All SARS tax logic lives in `src/components/SARSTaxCalculator.tsx`:

- `TAX_BRACKETS` — 2025/2026 progressive bracket array (base tax + marginal rate per bracket)
- `REBATES` — primary/secondary/tertiary annual rebates
- `MEDICAL_CREDITS` — monthly MTC per member
- `TAX_THRESHOLDS` — tax-free thresholds by age group
- `calculateTax(grossIncome, ageGroup, medicalAids, period)` — pure function returning `TaxResult`
- State: plain React `useState`, no external store

**Calculation order:** gross tax from brackets → subtract rebates → subtract medical credits → net PAYE. UIF calculated separately at 1% capped at R177.12/month.

## Adding New Calculator Tools

1. Create `src/components/YourTool.tsx` with a self-contained component
2. Create `src/routes/your-tool.tsx` using `createFileRoute('/your-tool')({ component: YourTool })`
3. Update the header nav links in `SARSTaxCalculator.tsx`
4. Update SEO meta in `src/routes/__root.tsx` if needed

## Routing Convention

- `src/routes/__root.tsx` — root layout (HTML shell, meta tags)
- `src/routes/index.tsx` — home `/`
- `src/routes/api.*.ts` — server API endpoints

## Non-Obvious Decisions

- **Pure client-side calculation**: Tax math is deterministic and requires no server round-trips.
- **CSS variables over Tailwind for the palette**: Allows the entire colour scheme to be changed from one block in `styles.css`. Tailwind utilities inline-reference these vars via `style=` props where the Tailwind class would be dynamic.
- **No shareable result URLs**: Results are ephemeral form state. Add URL search params if sharing becomes a requirement.
- **Tax year data is hardcoded**: Update `TAX_BRACKETS`, `REBATES`, `MEDICAL_CREDITS`, and `TAX_THRESHOLDS` in `SARSTaxCalculator.tsx` each new SARS tax year (typically announced in February budget).
- **`lang="en-ZA"`** is set on the `<html>` element for correct locale and screen reader behaviour.
