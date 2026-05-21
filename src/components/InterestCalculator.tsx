import { useState, useCallback, useId } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

type Period = 'monthly' | 'annually'
type Compounding = 'monthly' | 'quarterly' | 'annually'

interface CalculationResult {
  principal: number
  totalAmount: number
  totalInterest: number
  yearlyBreakdown: Array<{
    year: number
    balance: number
    interestEarned: number
  }>
}

// ─── Calculation Logic ────────────────────────────────────────────────────────

function calculateCompoundInterest(
  principal: number,
  annualRate: number,
  years: number,
  compounding: Compounding,
  monthlyContribution: number
): CalculationResult {
  const periodsPerYear = compounding === 'monthly' ? 12 : compounding === 'quarterly' ? 4 : 1
  const ratePerPeriod = annualRate / 100 / periodsPerYear
  const totalPeriods = years * periodsPerYear
  const monthlyRate = annualRate / 100 / 12

  let balance = principal
  const yearlyBreakdown: CalculationResult['yearlyBreakdown'] = []

  for (let year = 1; year <= years; year++) {
    const startBalance = balance
    for (let period = 0; period < periodsPerYear; period++) {
      balance = balance * (1 + ratePerPeriod)
      for (let month = 0; month < (12 / periodsPerYear); month++) {
        balance += monthlyContribution
      }
    }
    yearlyBreakdown.push({
      year,
      balance: Math.round(balance),
      interestEarned: Math.round(balance - startBalance - (monthlyContribution * 12)),
    })
  }

  return {
    principal,
    totalAmount: Math.round(balance),
    totalInterest: Math.round(balance - principal - (monthlyContribution * 12 * years)),
    yearlyBreakdown,
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

// ─── Components ───────────────────────────────────────────────────────────────

function InfoBadge({ text }: { text: string }) {
  return (
    <span className="ml-1 cursor-help" title={text} aria-label={text}>
      <span className="inline-flex items-center justify-center w-4 h-4 text-xs rounded-full opacity-50" style={{ background: 'var(--border-strong)' }}>i</span>
    </span>
  )
}

function ResultCard({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="result-card flex items-center justify-between">
      <span className="text-sm opacity-70">{label}</span>
      <span className={`font-mono font-medium ${highlight ? 'text-[var(--amber-light)] text-lg' : ''}`}>
        {value}
      </span>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function InterestCalculator() {
  const inputId = useId()
  const [principal, setPrincipal] = useState('')
  const [rate, setRate] = useState('')
  const [years, setYears] = useState('')
  const [compounding, setCompounding] = useState<Compounding>('monthly')
  const [monthlyContribution, setMonthlyContribution] = useState('')
  const [result, setResult] = useState<CalculationResult | null>(null)
  const [calcKey, setCalcKey] = useState(0)
  const [showBreakdown, setShowBreakdown] = useState(false)

  const handleCalculate = useCallback(() => {
    const p = parseFloat(principal.replace(/[^\d.]/g, ''))
    const r = parseFloat(rate.replace(/[^\d.]/g, ''))
    const y = parseInt(years.replace(/[^\d]/g, ''))
    const m = parseFloat(monthlyContribution.replace(/[^\d.]/g, '')) || 0

    if (!p || p <= 0 || !r || r <= 0 || !y || y <= 0) return

    const res = calculateCompoundInterest(p, r, y, compounding, m)
    setResult(res)
    setCalcKey(k => k + 1)
  }, [principal, rate, years, compounding, monthlyContribution])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleCalculate()
  }

  const handlePrint = () => window.print()
  const handleShare = async () => {
    if (navigator.share && result) {
      try {
        await navigator.share({
          title: 'CalcZA - Compound Interest Calculator',
          text: `Savings growth from ${fmtCurrency(result.principal)} at ${rate}% over ${years} years: ${fmtCurrency(result.totalAmount)}`,
          url: window.location.href,
        })
      } catch (e) {
        // User cancelled or share failed
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-[var(--border)] px-4 py-4 sm:px-8 no-print">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 no-underline">
            <div className="w-7 h-7 rounded-md flex items-center justify-center text-[#0d2a14] font-bold text-xs font-mono" style={{ background: 'var(--amber)' }}>
              ZA
            </div>
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
            <span className="tool-chip active">Interest Calculator</span>
            <span className="tool-chip">Compound Growth</span>
            <span className="tool-chip">Free</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl leading-tight mb-3">
            Compound Interest<br />
            <span style={{ color: 'var(--amber-light)' }}>Calculator</span>
          </h1>
          <p className="text-sm opacity-60 max-w-lg leading-relaxed">
            Calculate how your savings and investments grow over time with compound interest.
            Includes support for regular monthly contributions.
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="px-4 sm:px-8 pb-16 flex-1">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-6">

          {/* Input Panel */}
          <div className="space-y-5">
            <div className="rounded-2xl p-6 space-y-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}>
              {/* Principal */}
              <div className="space-y-2">
                <label htmlFor={`${inputId}-principal`} className="text-sm font-medium flex items-center gap-1.5">
                  Initial Investment
                  <InfoBadge text="The amount you start with or have saved." />
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm opacity-50">R</span>
                  <input
                    id={`${inputId}-principal`}
                    type="number"
                    className="tax-input pl-7"
                    placeholder="e.g. 50000"
                    value={principal}
                    onChange={e => setPrincipal(e.target.value)}
                    onKeyDown={handleKeyDown}
                    min="0"
                    aria-label="Initial investment amount"
                  />
                </div>
              </div>

              {/* Interest Rate */}
              <div className="space-y-2">
                <label htmlFor={`${inputId}-rate`} className="text-sm font-medium flex items-center gap-1.5">
                  Annual Interest Rate
                  <InfoBadge text="The yearly interest rate offered (%)." />
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
              </div>

              {/* Years */}
              <div className="space-y-2">
                <label htmlFor={`${inputId}-years`} className="text-sm font-medium flex items-center gap-1.5">
                  Investment Period
                  <InfoBadge text="Number of years you plan to invest." />
                </label>
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

              {/* Compounding */}
              <div className="space-y-2">
                <label htmlFor={`${inputId}-compounding`} className="text-sm font-medium">Interest Compounding</label>
                <select
                  id={`${inputId}-compounding`}
                  className="tax-select"
                  value={compounding}
                  onChange={e => setCompounding(e.target.value as Compounding)}
                >
                  <option value="monthly">Monthly (12x per year)</option>
                  <option value="quarterly">Quarterly (4x per year)</option>
                  <option value="annually">Annually (1x per year)</option>
                </select>
              </div>

              {/* Monthly Contribution */}
              <div className="space-y-2">
                <label htmlFor={`${inputId}-contribution`} className="text-sm font-medium flex items-center gap-1.5">
                  Monthly Contribution (Optional)
                  <InfoBadge text="Additional amount you add each month." />
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm opacity-50">R</span>
                  <input
                    id={`${inputId}-contribution`}
                    type="number"
                    className="tax-input pl-7"
                    placeholder="e.g. 2000"
                    value={monthlyContribution}
                    onChange={e => setMonthlyContribution(e.target.value)}
                    onKeyDown={handleKeyDown}
                    min="0"
                    aria-label="Monthly contribution amount"
                  />
                </div>
              </div>

              <button
                type="button"
                className="btn-calculate"
                onClick={handleCalculate}
                disabled={!principal || !rate || !years}
                style={{ opacity: (!principal || !rate || !years) ? 0.55 : 1 }}
              >
                Calculate Returns
              </button>
            </div>

            {/* Action buttons */}
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
                <button
                  type="button"
                  onClick={handleShare}
                  className="flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1.5px solid var(--border-strong)', color: 'var(--cream)' }}
                >
                  Share
                </button>
              </div>
            )}

            {/* Info box */}
            <div className="rounded-xl p-4 text-xs space-y-1.5" style={{ background: 'rgba(212,162,68,0.06)', border: '1px solid var(--border)' }}>
              <p className="font-medium text-[var(--amber-light)] mb-2">Investment Tips</p>
              <div className="flex justify-between opacity-70">
                <span>High-Yield Savings</span>
                <span className="font-mono">5-8% p.a.</span>
              </div>
              <div className="flex justify-between opacity-70">
                <span>Fixed Deposits</span>
                <span className="font-mono">7-9% p.a.</span>
              </div>
              <div className="flex justify-between opacity-70">
                <span>Unit Trusts</span>
                <span className="font-mono">8-12% p.a.</span>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="space-y-4">
            {!result ? (
              <div className="rounded-2xl p-8 flex flex-col items-center justify-center text-center min-h-[320px] animate-scale-in" style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--border-strong)' }}>
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="mb-4 opacity-30">
                  <circle cx="20" cy="20" r="15" stroke="var(--amber)" strokeWidth="1.5" />
                  <path d="M20 10V20L26 26" stroke="var(--amber)" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <p className="text-sm opacity-50">Enter your investment details to see<br />how your money can grow over time.</p>
              </div>
            ) : (
              <div key={calcKey} className="space-y-3">
                {/* Total balance hero */}
                <div className="rounded-2xl p-6 animate-fade-up" style={{ background: 'rgba(212,162,68,0.08)', border: '1px solid var(--border-strong)' }}>
                  <p className="text-xs uppercase tracking-widest opacity-60 mb-1 font-medium">Final Balance</p>
                  <p className="font-display text-4xl sm:text-5xl" style={{ color: 'var(--amber-light)' }}>
                    {fmtCurrency(result.totalAmount)}
                  </p>
                  <p className="text-xs opacity-50 mt-1 font-mono">
                    Started with {fmtCurrency(result.principal)}
                  </p>
                </div>

                {/* Key metrics */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="result-card animate-fade-up afd-1">
                    <p className="text-xs opacity-50 mb-1">Total Interest</p>
                    <p className="font-mono text-2xl font-medium text-[var(--amber-light)]">
                      {fmtCurrency(result.totalInterest)}
                    </p>
                  </div>
                  <div className="result-card animate-fade-up afd-1">
                    <p className="text-xs opacity-50 mb-1">Growth Rate</p>
                    <p className="font-mono text-2xl font-medium text-[var(--amber-light)]">
                      {((result.totalInterest / result.principal) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>

                {/* Detailed breakdown */}
                <div className="space-y-2">
                  <ResultCard label="Initial Investment" value={fmtCurrency(result.principal)} />
                  <ResultCard label="Total Contributions" value={fmtCurrency(parseInt(years) * 12 * (parseFloat(monthlyContribution) || 0))} />
                  <ResultCard label="Total Interest Earned" value={fmtCurrency(result.totalInterest)} highlight />
                </div>

                {/* Yearly breakdown toggle */}
                <button
                  type="button"
                  onClick={() => setShowBreakdown(s => !s)}
                  className="w-full rounded-xl py-3 px-4 text-sm font-medium flex items-center justify-between transition-all animate-fade-up afd-2 no-print"
                  style={{
                    background: showBreakdown ? 'rgba(212,162,68,0.08)' : 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--border)',
                    color: 'var(--amber-light)',
                  }}
                >
                  <span>Yearly Breakdown</span>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ transform: showBreakdown ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.25s' }}>
                    <path d="M2 5L7 10L12 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {showBreakdown && (
                  <div className="rounded-2xl p-5 animate-scale-in" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}>
                    <p className="text-xs uppercase tracking-widest opacity-50 font-medium mb-4">
                      Growth Over {years} Years
                    </p>
                    <div className="space-y-2">
                      {result.yearlyBreakdown.map((item, i) => (
                        <div key={i} className="bracket-row">
                          <span className="text-xs opacity-70">Year {item.year}</span>
                          <span className="font-mono text-xs text-[var(--amber-light)]">{fmtCurrency(item.balance)}</span>
                          <span className="font-mono text-xs opacity-60">+{fmtCurrency(item.interestEarned)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
            Returns are not guaranteed. Consult a financial advisor for personalized advice.
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