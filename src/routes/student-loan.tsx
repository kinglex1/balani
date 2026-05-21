import { createFileRoute } from '@tanstack/react-router'
import StudentLoanCalculator from '../components/StudentLoanCalculator'

export const Route = createFileRoute('/student-loan')({
  component: StudentLoanCalculator,
  head: () => ({
    meta: [
      { title: 'Student Loan Calculator | CalcZA - NSFAS & Bursary Calculator' },
      {
        name: 'description',
        content: 'Calculate your South African student loan repayments. See how much your NSFAS or university bursary will cost after graduation.',
      },
      { name: 'keywords', content: 'student loan calculator South Africa, NSFAS calculator, bursary calculator, study loan' },
    ],
  }),
})