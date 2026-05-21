import { createFileRoute } from '@tanstack/react-router'
import About from '../components/About'

export const Route = createFileRoute('/about')({
  component: About,
  head: () => ({
    meta: [
      { title: 'About | CalcZA - Free South African Financial Calculators' },
      {
        name: 'description',
        content: 'Learn about CalcZA - free, accurate financial calculators for South Africans. Calculate taxes, investments, home loans, and student loans.',
      },
      { name: 'keywords', content: 'about CalcZA, South Africa calculators, free financial tools' },
    ],
  }),
})