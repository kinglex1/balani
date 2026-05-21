import { createFileRoute } from '@tanstack/react-router'
import InvestmentCalculator from '../components/InvestmentCalculator'

export const Route = createFileRoute('/investment')({
  component: InvestmentCalculator,
  head: () => ({
    meta: [
      { title: 'Investment Returns Calculator | CalcZA - Unit Trust & RA Calculator' },
      {
        name: 'description',
        content: 'Calculate potential investment returns in South Africa. See how your money could grow with unit trusts, retirement annuities, and other investments.',
      },
      { name: 'keywords', content: 'investment calculator South Africa, unit trust returns, retirement annuity calculator, investment growth' },
    ],
  }),
})