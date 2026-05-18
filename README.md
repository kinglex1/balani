# CalcZA — South African Micro-Calculator Platform

Free, mobile-friendly utility calculators built for South Africans. Organic SEO focus, no sign-up required.

**First live tool:** SARS Income Tax Calculator 2025/2026

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | TanStack Start (React 19, file-based routing) |
| Build | Vite 7 |
| Styling | Tailwind CSS 4 + custom CSS variables |
| Language | TypeScript 5 (strict mode) |
| Deployment | Netlify |

## Running Locally

```bash
# Install dependencies
npm install

# Start dev server (port 3000, or 8888 with Netlify CLI)
npm run dev

# Production build
npm run build
```

With Netlify CLI for full platform emulation:

```bash
netlify dev
```

## Project Structure

```
src/
  components/
    SARSTaxCalculator.tsx   # SARS PAYE calculator (main tool)
  routes/
    __root.tsx              # HTML shell + global SEO meta
    index.tsx               # Home route → SARSTaxCalculator
  styles.css                # Tailwind + CSS custom properties
  router.tsx                # TanStack Router setup
public/
  favicon.ico
```

## Adding a New Calculator Tool

1. Create `src/components/YourCalculator.tsx`
2. Add a route in `src/routes/` (e.g. `your-tool.tsx`)
3. Link it from the header nav in `SARSTaxCalculator.tsx` (or a shared Header component)

## Tax Data Sources

- [SARS Tax Tables 2025/2026](https://www.sars.gov.za/tax-rates/income-tax/rates-of-tax-for-individuals/)
- [Medical Tax Credits](https://www.sars.gov.za/tax-rates/income-tax/medical-tax-credits-mtc/)
- [UIF Rates](https://www.uif.gov.za/)
