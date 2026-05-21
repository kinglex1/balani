import { createFileRoute } from '@tanstack/react-router'
import InterestCalculator from '../components/InterestCalculator'

export const Route = createFileRoute('/interest')({
  component: InterestCalculator,
  head: () => ({
    meta: [
      { title: 'Compound Interest Calculator | CalcZA - Free South African Financial Tools' },
      {
        name: 'description',
        content: 'Calculate compound interest and investment growth in South Africa. See how your savings grow with regular contributions and different compounding periods.',
      },
      { name: 'keywords', content: 'compound interest calculator South Africa, investment growth, savings calculator, CalcZA' },
    ],
  }),
})