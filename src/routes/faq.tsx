import { createFileRoute } from '@tanstack/react-router'
import FAQ from '../components/FAQ'

export const Route = createFileRoute('/faq')({
  component: FAQ,
  head: () => ({
    meta: [
      { title: 'FAQ | CalcZA - Frequently Asked Questions' },
      {
        name: 'description',
        content: 'Find answers to frequently asked questions about South African taxes, investments, home loans, and student loans. Learn how CalcZA calculators work.',
      },
      { name: 'keywords', content: 'South Africa tax FAQ, finance calculator questions, student loan FAQ, CalcZA help' },
    ],
  }),
})