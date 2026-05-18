import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import '../styles.css'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'SARS Income Tax Calculator 2026 | CalcZA — Free SA Tax Tools' },
      {
        name: 'description',
        content:
          'Free South African income tax calculator for the 2025/2026 SARS tax year. Instantly calculate PAYE, effective rate, rebates, UIF, and medical aid credits. No sign-up required.',
      },
      { name: 'keywords', content: 'SARS tax calculator, South Africa income tax 2026, PAYE calculator, SA tax bracket 2025/2026, CalcZA' },
      { name: 'author', content: 'CalcZA' },
      { name: 'theme-color', content: '#0d3320' },
      { property: 'og:title', content: 'SARS Income Tax Calculator 2026 | CalcZA' },
      {
        property: 'og:description',
        content: 'Free, accurate PAYE calculator for South Africa. 2025/2026 tax year. Includes rebates, UIF, and medical credits.',
      },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary' },
    ],
    links: [
      { rel: 'canonical', href: 'https://calcza.co.za' },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-ZA">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
