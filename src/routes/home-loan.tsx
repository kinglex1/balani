import { createFileRoute } from '@tanstack/react-router'
import HomeLoanCalculator from '../components/HomeLoanCalculator'

export const Route = createFileRoute('/home-loan')({
  component: HomeLoanCalculator,
  head: () => ({
    meta: [
      { title: 'Home Loan Calculator | CalcZA - South African Bond Calculator' },
      {
        name: 'description',
        content: 'Calculate your South African home loan (bond) monthly repayments. See how much property you can afford with our free mortgage calculator.',
      },
      { name: 'keywords', content: 'home loan calculator South Africa, bond calculator, mortgage calculator, property affordability' },
    ],
  }),
})