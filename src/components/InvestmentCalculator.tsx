import { useState, useCallback, useId } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface CalculationResult {
  initialInvestment: number
  monthlyContribution: number
  finalValue: number
  totalContributions: number
  totalGrowth: number
  annualizedReturn: number
}

// ─── Calculation Logic ────────────────────────────────────────────────────────

function calculateInvestmentReturns(
  initial: number,
  monthly: number,
  years: number,
  expectedReturn: number
): CalculationResult {
  const annualRate = expectedReturn / 100
  let finalValue = initial
  let totalContributions = initial

  for (let month = 0; month < years * 12; month++) {
    finalValue = finalValue * (1 + annualRate / 12) + monthly
    totalContributions += monthly
  }

  const totalGrowth = finalValue - totalContributions
  const annualizedReturn = (Math.pow(finalValue / initial, 1 / years) - 1) * 100

  return {
    initialInvestment: initial,
    monthlyContribution: monthly,
    finalValue: Math.round(finalValue),
    totalContributions,
    totalGrowth: Math.round(totalGrowth),
    annualizedReturn: Math.round(annualizedReturn * 100) / 100,
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

export default function InvestmentCalculator() {
  const inputId = useId()
  const [initial, setInitial] = useState('')
  const [monthly, setMonthly] = useState('')
  const [years, setYears] = useState('')
  const [returnRate, setReturnRate] = useState('')
  const [result, setResult] = useState<CalculationResult | null>(null)
  const [calcKey, setCalcKey] = useState(0)

  const handleCalculate = useCallback(() => {
    const i = parseFloat(initial.replace(/[^\d.]/g, ''))
    const m = parseFloat(monthly.replace(/[^\d.]/g, ''))
    const y = parseInt(years.replace(/[^\d]/g, ''))
    const r = parseFloat(returnRate.replace(/[^\d.]/g, ''))

    if ((!i && !m) || !y || !r) return

    const res = calculateInvestmentReturns(i || 0, m || 0, y, r)
    setResult(res)
    setCalcKey(k => k + 1)
  }, [initial, monthly, years, returnRate])

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
            <a href="/interest" className="nav-link active">Finance</a>
            <span className="nav-link opacity-40 cursor-not-allowed">Education</span>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <div className="px-4 sm:px-8 pt-10 pb-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="tool-chip active">Investment Calculator</span>
            <span className="tool-chip">Unit Trusts</span>
            <span className="tool-chip">Retirement</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl leading-tight mb-3">
            Investment Returns<br />
            <span style={{ color: 'var(--amber-light)' }}>Calculator</span>
          </h1>
          <p className="text-sm opacity-60 max-w-lg leading-relaxed">
            See how your investments could grow over time. Calculate potential returns from
            unit trusts, retirement annuities, and other investment vehicles.
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="px-4 sm:px-8 pb-16 flex-1">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-6">

          {/* Input Panel */}
          <div className="space-y-5">
            <div className="rounded-2xl p-6 space-y-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}>
              {/* Initial Investment */}
              <div className="space-y-2">
                <label htmlFor={`${inputId}-initial`} className="text-sm font-medium">
                  Initial Investment (Lump Sum)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm opacity-50">R</span>
                  <input
                    id={`${inputId}-initial`}
                    type="number"
                    className="tax-input pl-7"
                    placeholder="e.g. 50000"
                    value={initial}
                    onChange={e => setInitial(e.target.value)}
                    onKeyDown={handleKeyDown}
                    min="0"
                    aria-label="Initial investment amount"
                  />
                </div>
              </div>

              {/* Monthly Contribution */}
              <div className="space-y-2">
                <label htmlFor={`${inputId}-monthly`} className="text-sm font-medium">
                  Monthly Contribution
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm opacity-50">R</span>
                  <input
                    id={`${inputId}-monthly`}
                    type="number"
                    className="tax-input pl-7"
                    placeholder="e.g. 2000"
                    value={monthly}
                    onChange={e => setMonthly(e.target.value)}
                    onKeyDown={handleKeyDown}
                    min="0"
                    aria-label="Monthly contribution"
                  />
                </div>
              </div>

              {/* Investment Period */}
              <div className="space-y-2">
                <label htmlFor={`${inputId}-years`} className="text-sm font-medium">Investment Period</label>
                <div className="relative">
                  <input
                    id={`${inputId}-years`}
                    type="number"
                    className="tax-input pr-14"
                    placeholder="e.g. 10"
                    value={years}
                    onChange={e => setYears(e.target.value)}
                    onKeyDown={handleKeyDown}
                    min="1"
                    aria-label="Investment period in years"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-sm opacity-50">years</span>
                </div>
              </div>

              {/* Expected Return */}
              <div className="space-y-2">
                <label htmlFor={`${inputId}-return`} className="text-sm font-medium flex items-center gap-1.5">
                  Expected Annual Return
                  <span className="ml-1 cursor-help" title="The average annual return you expect to earn"><span className="inline-flex items-center justify-center w-4 h-4 text-xs rounded-full opacity-50" style={{ background: 'var(--border-strong)' }}>i</span></span>
                </label>
                <div className="relative">
                  <input
                    id={`${inputId}-return`}
                    type="number"
                    className="tax-input pr-12"
                    placeholder="e.g. 10"
                    value={returnRate}
                    onChange={e => setReturnRate(e.target.value)}
                    onKeyDown={handleKeyDown}
                    min="0"
                    step="0.5"
                    aria-label="Expected annual return"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-sm opacity-50">%</span>
                </div>
              </div>

              <button
                type="button"
                className="btn-calculate"
                onClick={handleCalculate}
                disabled={!years || !returnRate}
                style={{ opacity: (!years || !returnRate) ? 0.55 : 1 }}
              >
                Calculate Returns
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
              <p className="font-medium text-[var(--amber-light)] mb-2">Historical Returns (SA)</p>
              <div className="flex justify-between opacity-70">
                <span>Top Equity Funds</span>
                <span className="font-mono">10-14% p.a.</span>
              </div>
              <div className="flex justify-between opacity-70">
                <span>Balanced Funds</span>
                <span className="font-mono">8-10% p.a.</span>
              </div>
              <div className="flex justify-between opacity-70">
                <span>Retirement Annuity</span>
                <span className="font-mono">9-11% p.a.</span>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="space-y-4">
            {!result ? (
              <div className="rounded-2xl p-8 flex flex-col items-center justify-center text-center min-h-[320px] animate-scale-in" style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--border-strong)' }}>
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="mb-4 opacity-30">
                  <path d="M10 30L20 10L30 30" stroke="var(--amber)" strokeWidth="1.5" />
                  <path d="M14 24H26" stroke="var(--amber)" strokeWidth="1.5" />
                </svg>
                <p className="text-sm opacity-50">Enter your investment details to see<br />projected growth over time.</p>
              </div>
            ) : (
              <div key={calcKey} className="space-y-3">
                {/* Final value hero */}
                <div className="rounded-2xl p-6 animate-fade-up" style={{ background: 'rgba(212,162,68,0.08)', border: '1px solid var(--border-strong)' }}>
                  <p className="text-xs uppercase tracking-widest opacity-60 mb-1 font-medium">Projected Final Value</p>
                  <p className="font-display text-4xl sm:text-5xl" style={{ color: 'var(--amber-light)' }}>
                    {fmtCurrency(result.finalValue)}
                  </p>
                  <p className="text-xs opacity-50 mt-1 font-mono">
                    After {years} years at {returnRate}% p.a.
                  </p>
                </div>

                {/* Key metrics */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="result-card animate-fade-up afd-1">
                    <p className="text-xs opacity-50 mb-1">Total Contributions</p>
                    <p className="font-mono text-xl font-medium text-[var(--amber-light)]">
                      {fmtCurrency(result.totalContributions)}
                    </p>
                  </div>
                  <div className="result-card animate-fade-up afd-1">
                    <p className="text-xs opacity-50 mb-1">Investment Growth</p>
                    <p className="font-mono text-xl font-medium text-[var(--amber-light)]">
                      {fmtCurrency(result.totalGrowth)}
                    </p>
                  </div>
                </div>

                {/* Detailed breakdown */}
                <div className="space-y-2">
                  <div className="result-card flex items-center justify-between animate-fade-up afd-2">
                    <span className="text-sm opacity-70">Initial Investment</span>
                    <span className="font-mono font-medium">{fmtCurrency(result.initialInvestment)}</span>
                  </div>
                  <div className="result-card flex items-center justify-between animate-fade-up afd-2">
                    <span className="text-sm opacity-70">Total Monthly Contributions</span>
                    <span className="font-mono font-medium">{fmtCurrency(result.totalContributions - result.initialInvestment)}</span>
                  </div>
                  <div className="result-card flex items-center justify-between animate-fade-up afd-3">
                    <span className="text-sm opacity-70">Total Growth</span>
                    <span className="font-mono font-medium text-[var(--amber-light)]">{fmtCurrency(result.totalGrowth)}</span>
                  </div>
                  <div className="result-card flex items-center justify-between animate-fade-up afd-3" style={{ borderColor: 'var(--border-strong)' }}>
                    <span className="text-sm font-medium">Final Value</span>
                    <span className="font-mono font-medium text-[var(--amber-light)] text-lg">{fmtCurrency(result.finalValue)}</span>
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="rounded-xl p-4 text-xs" style={{ background: 'rgba(212,162,68,0.06)', border: '1px solid var(--border)' }}>
                  <p className="opacity-70 leading-relaxed">
                    Past performance is not indicative of future returns. These calculations are for
                    illustrative purposes only and do not constitute financial advice.
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
            Consult a financial advisor for personalized investment advice.
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