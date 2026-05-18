import { createFileRoute } from '@tanstack/react-router'
import SARSTaxCalculator from '../components/SARSTaxCalculator'

export const Route = createFileRoute('/')({
  component: SARSTaxCalculator,
})
