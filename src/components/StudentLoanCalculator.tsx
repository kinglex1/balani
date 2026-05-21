import { useState, useCallback, useId } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface CalculationResult {
  totalLoan: number
  monthlyPayment: number
  totalPayment: number
  totalInterest: number
  rate: number
  years: number
}

// ─── Calculation Logic ────────────────────────────────────────────────────────

function calculateStudentLoan(
  tuition: number,
  annualInterestRate: number,
  years: number,
  graceYears: number = 0
): CalculationResult {
  // Interest during study period
  const studyInterest = tuition * (annualInterestRate / 100) * graceYears
  const totalLoan = tuition + studyInterest

  // After graduation, repay over remaining years
  const repaymentYears = Math.max(1, years - graceYears)
  const monthlyRate = annualInterestRate / 100 / 12
  const numPayments = repaymentYears * 12

  let monthlyPayment = 0
  if (monthlyRate > 0 && repaymentYears > 0) {
    monthlyPayment = totalLoan * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1)
  } else if (repaymentYears > 0) {
    monthlyPayment = totalLoan / numPayments
  }

  const totalPayment = monthlyPayment * numPayments
  const totalInterest = totalPayment - totalLoan

  return {
    totalLoan: Math.round(totalLoan),
    monthlyPayment: Math.round(monthlyPayment),
    totalPayment: Math.round(totalPayment),
    totalInterest: Math.round(totalInterest),
    rate: annualInterestRate,
    years: repaymentYears,
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number): string {
  return new Intl.NumberFormat('en-ZA', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n)
}

function fmtCurrency(n: number): string {
  return `R ${fmt(n)}`
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function StudentLoanCalculator() {
  const inputId = useId()
  const [tuition, setTuition] = useState('')
  const [rate, setRate] = useState('')
  const [years, setYears] = useState('')
  const [graceYears, setGraceYears] = useState('0')
  const [result, setResult] = useState<CalculationResult | null>(null)
  const [calcKey, setCalcKey] = useState(0)

  const handleCalculate = useCallback(() => {
    const t = parseFloat(tuition.replace(/[^\d.]/g, ''))
    const r = parseFloat(rate.replace(/[^\d.]/g, ''))
    const y = parseInt(years.replace(/[^\d]/g, ''))
    const g = parseInt(graceYears.replace(/[^\d]/g, '')) || 0

    if (!t || t <= 0 || !r || r <= 0 || !y || y <= 0) return

    const res = calculateStudentLoan(t, r, y, g)
    setResult(res)
    setCalcKey(k => k + 1)
  }, [tuition, rate, years, graceYears])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleCalculate()
  }

  const handlePrint = () => window.print()

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-[var(--border)] px-4 py-4 sm:px-8 no-print">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 no-underline">
            <div className="w-7 h-7 rounded-md flex items-center justify-center text-[#0d2a14] font-bold text-xs font-mono" style={{ background: 'var(--amber)' }}>ZA</div>
            <span className="font-display text-lg tracking-tight text-[var(--cream)]">CalcZA</span>
          </a>
          <nav className="hidden sm:flex items-center gap-6">
            <a href="/" className="nav-link">Tax</a>
            <a href="/interest" className="nav-link">Finance</a>
            <a href="/student-loan" className="nav-link active">Education</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <div className="px-4 sm:px-8 pt-10 pb-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="tool-chip active">Student Loan Calculator</span>
            <span className="tool-chip">Bursary Calculator</span>
            <span className="tool-chip">Free</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl leading-tight mb-3">
            Student Loan<br />
            <span style={{ color: 'var(--amber-light)' }}>Calculator</span>
          </h1>
          <p className="text-sm opacity-60 max-w-lg leading-relaxed">
            Calculate your student loan repayments. See how much you'll pay monthly after graduation
            and understand the total cost of your bursary or study loan.
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="px-4 sm:px-8 pb-16 flex-1">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-6">

          {/* Input Panel */}
          <div className="space-y-5">
            <div className="rounded-2xl p-6 space-y-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}>
              {/* Tuition/Fee */}
              <div className="space-y-2">
                <label htmlFor={`${inputId}-tuition`} className="text-sm font-medium flex items-center gap-1.5">
                  Total Tuition/Fees
                  <span className="ml-1 cursor-help" title="Total cost of your entire degree"><span className="inline-flex items-center justify-center w-4 h-4 text-xs rounded-full opacity-50" style={{ background: 'var(--border-strong)' }}>i</span></span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm opacity-50">R</span>
                  <input
                    id={`${inputId}-tuition`}
                    type="number"
                    className="tax-input pl-7"
                    placeholder="e.g. 180000"
                    value={tuition}
                    onChange={e => setTuition(e.target.value)}
                    onKeyDown={handleKeyDown}
                    min="0"
                    aria-label="Total tuition amount"
                  />
                </div>
              </div>

              {/* Interest Rate */}
              <div className="space-y-2">
                <label htmlFor={`${inputId}-rate`} className="text-sm font-medium">
                  Interest Rate (per annum)
                </label>
                <div className="relative">
                  <input
                    id={`${inputId}-rate`}
                    type="number"
                    className="tax-input pr-12"
                    placeholder="e.g. 8.5"
                    value={rate}
                    onChange={e => setRate(e.target.value)}
                    onKeyDown={handleKeyDown}
                    min="0"
                    step="0.1"
                    aria-label="Annual interest rate"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-sm opacity-50">%</span>
                </div>
                <p className="text-xs opacity-50">NSFAS rate is approximately 7-9%</p>
              </div>

              {/* Study Duration */}
              <div className="space-y-2">
                <label htmlFor={`${inputId}-years`} className="text-sm font-medium">Total Loan Period</label>
                <select
                  id={`${inputId}-years`}
                  className="tax-select"
                  value={years}
                  onChange={e => setYears(e.target.value)}
                >
                  <option value="">Select duration</option>
                  {[2, 3, 4, 5, 6, 7].map(y => (
                    <option key={y} value={y}>{y} years</option>
                  ))}
                </select>
              </div>

              {/* Grace Period */}
              <div className="space-y-2">
                <label htmlFor={`${inputId}-grace`} className="text-sm font-medium flex items-center gap-1.5">
                  Grace Period (Years)
                  <span className="ml-1 cursor-help" title="Years after graduation before repayments start"><span className="inline-flex items-center justify-center w-4 h-4 text-xs rounded-full opacity-50" style={{ background: 'var(--border-strong)' }}>i</span></span>
                </label>
                <select
                  id={`${inputId}-grace`}
                  className="tax-select"
                  value={graceYears}
                  onChange={e => setGraceYears(e.target.value)}
                >
                  {[0, 1, 2].map(y => (
                    <option key={y} value={y}>{y} year{y > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                className="btn-calculate"
                onClick={handleCalculate}
                disabled={!tuition || !rate || !years}
                style={{ opacity: (!tuition || !rate || !years) ? 0.55 : 1 }}
              >
                Calculate Repayment
              </button>
            </div>

            {result && (
              <div className="flex gap-3 no-print">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1.5px solid var(--border-strong)', color: 'var(--cream)' }}
                >
                  Print
                </button>
              </div>
            )}

            {/* Info box */}
            <div className="rounded-xl p-4 text-xs space-y-1.5" style={{ background: 'rgba(212,162,68,0.06)', border: '1px solid var(--border)' }}>
              <p className="font-medium text-[var(--amber-light)] mb-2">Student Loan Facts</p>
              <div className="flex justify-between opacity-70">
                <span>NSFAS Funding</span>
                <span className="font-mono">Up to R125k/year</span>
              </div>
              <div className="flex justify-between opacity-70">
                <span>Interest Rate</span>
                <span className="font-mono">7-10% p.a.</span>
              </div>
              <div className="flex justify-between opacity-70">
                <span>Grace Period</span>
                <span className="font-mono">Up to 12 months</span>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="space-y-4">
            {!result ? (
              <div className="rounded-2xl p-8 flex flex-col items-center justify-center text-center min-h-[320px] animate-scale-in" style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--border-strong)' }}>
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="mb-4 opacity-30">
                  <path d="M20 8L8 14V26L20 32L32 26V14L20 8Z" stroke="var(--amber)" strokeWidth="1.5" />
                  <path d="M20 16V26" stroke="var(--amber)" strokeWidth="1.5" />
                </svg>
                <p className="text-sm opacity-50">Enter your student loan details to see<br />monthly repayments after graduation.</p>
              </div>
            ) : (
              <div key={calcKey} className="space-y-3">
                {/* Monthly payment hero */}
                <div className="rounded-2xl p-6 animate-fade-up" style={{ background: 'rgba(212,162,68,0.08)', border: '1px solid var(--border-strong)' }}>
                  <p className="text-xs uppercase tracking-widest opacity-60 mb-1 font-medium">Monthly Repayment</p>
                  <p className="font-display text-4xl sm:text-5xl" style={{ color: 'var(--amber-light)' }}>
                    {fmtCurrency(result.monthlyPayment)}
                  </p>
                  <p className="text-xs opacity-50 mt-1 font-mono">
                    Repaying over {result.years} years
                  </p>
                </div>

                {/* Key metrics */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="result-card animate-fade-up afd-1">
                    <p className="text-xs opacity-50 mb-1">Total Loan Amount</p>
                    <p className="font-mono text-xl font-medium text-[var(--amber-light)]">
                      {fmtCurrency(result.totalLoan)}
                    </p>
                  </div>
                  <div className="result-card animate-fade-up afd-1">
                    <p className="text-xs opacity-50 mb-1">Total Interest</p>
                    <p className="font-mono text-xl font-medium text-[var(--amber-light)]">
                      {fmtCurrency(result.totalInterest)}
                    </p>
                  </div>
                </div>

                {/* Detailed breakdown */}
                <div className="space-y-2">
                  <div className="result-card flex items-center justify-between animate-fade-up afd-2">
                    <span className="text-sm opacity-70">Tuition/Fees</span>
                    <span className="font-mono font-medium">{fmtCurrency(parseFloat(tuition))}</span>
                  </div>
                  <div className="result-card flex items-center justify-between animate-fade-up afd-2">
                    <span className="text-sm opacity-70">Interest During Study</span>
                    <span className="font-mono font-medium">{fmtCurrency(result.totalLoan - parseFloat(tuition))}</span>
                  </div>
                  <div className="result-card flex items-center justify-between animate-fade-up afd-3">
                    <span className="text-sm opacity-70">Total Loan</span>
                    <span className="font-mono font-medium text-[var(--amber-light)]">{fmtCurrency(result.totalLoan)}</span>
                  </div>
                  <div className="result-card flex items-center justify-between animate-fade-up afd-3">
                    <span className="text-sm opacity-70">Total Interest</span>
                    <span className="font-mono font-medium">{fmtCurrency(result.totalInterest)}</span>
                  </div>
                  <div className="result-card flex items-center justify-between animate-fade-up afd-4" style={{ borderColor: 'var(--border-strong)' }}>
                    <span className="text-sm font-medium">Total to Repay</span>
                    <span className="font-mono font-medium text-[var(--amber-light)] text-lg">{fmtCurrency(result.totalPayment)}</span>
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="rounded-xl p-4 text-xs" style={{ background: 'rgba(212,162,68,0.06)', border: '1px solid var(--border)' }}>
                  <p className="font-medium text-[var(--amber-light)] mb-1">Important Notice</p>
                  <p className="opacity-70 leading-relaxed">
                    This is an estimate. NSFAS and bank loans may have different terms.
                    Interest may accrue during study or repayments may start immediately.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-auto border-t px-4 sm:px-8 py-6 no-print" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs opacity-40 max-w-sm leading-relaxed">
            This calculator provides estimates for educational purposes only.
            Contact NSFAS or your bank for official loan terms.
          </p>
          <div className="flex items-center gap-4 text-xs opacity-40">
            <a href="/faq" className="hover:opacity-70">FAQ</a>
            <a href="/about" className="hover:opacity-70">About</a>
          </div>
        </div>
      </footer>
    </div>
  )
}