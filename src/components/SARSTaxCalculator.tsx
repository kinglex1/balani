import { useState, useCallback, useId } from 'react'

// ─── SARS 2025/2026 Tax Year Data ────────────────────────────────────────────

const TAX_BRACKETS = [
  { min: 0,         max: 237_100,    base: 0,         rate: 0.18 },
  { min: 237_101,   max: 370_500,    base: 42_678,    rate: 0.26 },
  { min: 370_501,   max: 512_800,    base: 77_362,    rate: 0.31 },
  { min: 512_801,   max: 673_000,    base: 121_475,   rate: 0.36 },
  { min: 673_001,   max: 857_900,    base: 179_147,   rate: 0.39 },
  { min: 857_901,   max: 1_817_000,  base: 251_258,   rate: 0.41 },
  { min: 1_817_001, max: Infinity,   base: 644_489,   rate: 0.45 },
]

const REBATES = {
  primary: 17_235,
  secondary: 9_444,   // 65+
  tertiary: 3_145,    // 75+
}

const TAX_THRESHOLDS = {
  under65: 95_750,
  age65to74: 148_217,
  age75plus: 165_689,
}

const MEDICAL_CREDITS = {
  firstTwo: 364,    // per month, per member (first 2)
  additional: 246,  // per month, per additional member
}

// ─── Types ────────────────────────────────────────────────────────────────────

type AgeGroup = 'under65' | 'age65to74' | 'age75plus'
type Period = 'annual' | 'monthly'

interface TaxResult {
  grossIncome: number
  taxableIncome: number
  grossTax: number
  rebates: number
  medicalCredits: number
  netTax: number
  effectiveRate: number
  marginalRate: number
  takeHomePay: number
  uifEmployee: number
  activeBracketIndex: number
  bracketBreakdown: Array<{ bracket: typeof TAX_BRACKETS[0]; taxInBracket: number }>
}

// ─── Calculation Logic ────────────────────────────────────────────────────────

function calculateTax(
  grossAnnual: number,
  ageGroup: AgeGroup,
  medicalAids: number,
  period: Period,
): TaxResult {
  const income = period === 'monthly' ? grossAnnual * 12 : grossAnnual

  // Step 1: Gross tax from brackets
  let grossTax = 0
  let activeBracketIndex = 0
  let marginalRate = 0.18

  const bracketBreakdown = TAX_BRACKETS.map((bracket, i) => {
    let taxInBracket = 0
    if (income >= bracket.min) {
      const taxableInBracket = Math.min(income, bracket.max === Infinity ? income : bracket.max) - bracket.min + 1
      if (taxableInBracket > 0) {
        taxInBracket = (bracket.base === 0 && i === 0)
          ? taxableInBracket * bracket.rate
          : (income > bracket.min ? (Math.min(income, bracket.max === Infinity ? income : bracket.max) - bracket.min + 1) * bracket.rate : 0)
        activeBracketIndex = i
        marginalRate = bracket.rate
      }
    }
    return { bracket, taxInBracket }
  })

  // More accurate calculation using the bracket table
  const activeBracket = TAX_BRACKETS.findIndex((b, i) => {
    const next = TAX_BRACKETS[i + 1]
    return income >= b.min && (b.max === Infinity || income <= b.max)
  })

  if (activeBracket >= 0) {
    const b = TAX_BRACKETS[activeBracket]
    grossTax = b.base + (income - b.min + (activeBracket === 0 ? 0 : 1)) * b.rate
    activeBracketIndex = activeBracket
    marginalRate = b.rate
  }

  // Step 2: Rebates
  let totalRebates = REBATES.primary
  if (ageGroup === 'age65to74') totalRebates += REBATES.secondary
  if (ageGroup === 'age75plus') totalRebates += REBATES.secondary + REBATES.tertiary

  // Step 3: Medical tax credits (annual)
  const annualMedical = Math.max(0, medicalAids - 2) * MEDICAL_CREDITS.additional * 12
    + Math.min(medicalAids, 2) * MEDICAL_CREDITS.firstTwo * 12
  const medCredits = medicalAids > 0 ? annualMedical : 0

  // Step 4: Net tax
  const netTax = Math.max(0, grossTax - totalRebates - medCredits)

  // Step 5: UIF (employee portion: 1% of remuneration, capped at R177.12/month)
  const uifMonthly = Math.min(income / 12 * 0.01, 177.12)
  const uifAnnual = uifMonthly * 12

  const takeHome = income - netTax - uifAnnual
  const effectiveRate = income > 0 ? (netTax / income) * 100 : 0

  return {
    grossIncome: income,
    taxableIncome: income,
    grossTax: Math.max(0, grossTax),
    rebates: totalRebates,
    medicalCredits: medCredits,
    netTax,
    effectiveRate,
    marginalRate: marginalRate * 100,
    takeHomePay: takeHome,
    uifEmployee: uifAnnual,
    activeBracketIndex,
    bracketBreakdown: TAX_BRACKETS.map((bracket, i) => {
      if (income < bracket.min) return { bracket, taxInBracket: 0 }
      const upperBound = bracket.max === Infinity ? income : Math.min(income, bracket.max)
      const amount = (upperBound - bracket.min + (i === 0 ? 0 : 1)) * bracket.rate
      return { bracket, taxInBracket: Math.max(0, amount) }
    }),
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number, decimals = 0): string {
  return new Intl.NumberFormat('en-ZA', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n)
}

function fmtCurrency(n: number): string {
  return `R ${fmt(n)}`
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function InfoBadge({ text }: { text: string }) {
  return (
    <span
      title={text}
      className="tooltip-trigger ml-1"
      aria-label={text}
    >
      i
    </span>
  )
}

function ResultRow({
  label,
  value,
  highlight = false,
  muted = false,
  info,
  animClass = '',
}: {
  label: string
  value: string
  highlight?: boolean
  muted?: boolean
  info?: string
  animClass?: string
}) {
  return (
    <div className={`result-card flex items-center justify-between gap-4 animate-fade-up ${animClass}`}>
      <div className={`text-sm ${muted ? 'opacity-60' : ''}`}>
        {label}
        {info && <InfoBadge text={info} />}
      </div>
      <div
        className={`font-mono text-right font-medium ${
          highlight
            ? 'text-[var(--amber-light)] text-lg'
            : muted
              ? 'opacity-60 text-sm'
              : ''
        }`}
      >
        {value}
      </div>
    </div>
  )
}

function TaxBar({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const pct = total > 0 ? Math.min(100, (value / total) * 100) : 0
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center text-sm">
        <span className="opacity-70">{label}</span>
        <span className="font-mono text-xs opacity-80">{fmt(pct, 1)}%</span>
      </div>
      <div className="tax-bar-track">
        <div
          className="tax-bar-fill"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SARSTaxCalculator() {
  const [income, setIncome] = useState('')
  const [period, setPeriod] = useState<Period>('annual')
  const [ageGroup, setAgeGroup] = useState<AgeGroup>('under65')
  const [medAids, setMedAids] = useState('0')
  const [result, setResult] = useState<TaxResult | null>(null)
  const [showBrackets, setShowBrackets] = useState(false)
  const [calcKey, setCalcKey] = useState(0)
  const inputId = useId()

  const handleCalculate = useCallback(() => {
    const raw = parseFloat(income.replace(/[^\d.]/g, ''))
    if (!raw || raw <= 0) return
    const res = calculateTax(raw, ageGroup, parseInt(medAids) || 0, period)
    setResult(res)
    setCalcKey(k => k + 1)
    setShowBrackets(false)
  }, [income, period, ageGroup, medAids])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleCalculate()
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-[var(--border)] px-4 py-4 sm:px-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center text-[#0d2a14] font-bold text-xs font-mono"
              style={{ background: 'var(--amber)' }}
            >
              ZA
            </div>
            <span className="font-display text-lg tracking-tight">CalcZA</span>
          </div>
          <nav className="hidden sm:flex items-center gap-6">
            <a href="#" className="nav-link active" style={{ color: 'var(--amber-light)', borderBottomColor: 'rgba(212,162,68,0.4)' }}>Tax</a>
            <span className="nav-link opacity-40 cursor-not-allowed" title="Coming soon">Finance</span>
            <span className="nav-link opacity-40 cursor-not-allowed" title="Coming soon">Education</span>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <div className="px-4 sm:px-8 pt-10 pb-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="tool-chip active">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <circle cx="5" cy="5" r="4" fill="var(--amber)" />
              </svg>
              SARS 2025/2026
            </span>
            <span className="tool-chip">Free</span>
            <span className="tool-chip">No sign-up</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl leading-tight mb-3" style={{ fontStyle: 'normal' }}>
            South African<br />
            <span style={{ color: 'var(--amber-light)' }}>Income Tax</span> Calculator
          </h1>
          <p className="text-sm opacity-60 max-w-lg leading-relaxed">
            Accurate PAYE estimates for the 2025/2026 tax year. Includes rebates, UIF, and medical tax credits.
            Not financial advice.
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="px-4 sm:px-8 pb-16 flex-1">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-6">

          {/* ─── Input Panel ─── */}
          <div className="space-y-5">
            <div
              className="rounded-2xl p-6 space-y-5"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}
            >
              {/* Income */}
              <div className="space-y-2">
                <label htmlFor={`${inputId}-income`} className="text-sm font-medium flex items-center gap-1.5">
                  Gross Income
                  <InfoBadge text="Your total income before any deductions or tax." />
                </label>
                <div className="relative">
                  <span
                    className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm opacity-50 pointer-events-none"
                  >
                    R
                  </span>
                  <input
                    id={`${inputId}-income`}
                    type="number"
                    className="tax-input pl-7"
                    placeholder="e.g. 450000"
                    value={income}
                    onChange={e => setIncome(e.target.value)}
                    onKeyDown={handleKeyDown}
                    min="0"
                    step="1000"
                    aria-label="Gross income in Rands"
                  />
                </div>
              </div>

              {/* Period */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Income Period</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['annual', 'monthly'] as Period[]).map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPeriod(p)}
                      className="py-2.5 px-3 rounded-lg text-sm font-medium transition-all"
                      style={{
                        background: period === p ? 'rgba(212, 162, 68, 0.18)' : 'rgba(255,255,255,0.04)',
                        border: `1.5px solid ${period === p ? 'rgba(212,162,68,0.5)' : 'var(--border-strong)'}`,
                        color: period === p ? 'var(--amber-light)' : 'var(--cream)',
                      }}
                    >
                      {p === 'annual' ? 'Annual' : 'Monthly'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Age */}
              <div className="space-y-2">
                <label htmlFor={`${inputId}-age`} className="text-sm font-medium flex items-center gap-1.5">
                  Age Group
                  <InfoBadge text="Your age determines which rebates you qualify for." />
                </label>
                <select
                  id={`${inputId}-age`}
                  className="tax-select"
                  value={ageGroup}
                  onChange={e => setAgeGroup(e.target.value as AgeGroup)}
                >
                  <option value="under65">Under 65</option>
                  <option value="age65to74">65 – 74</option>
                  <option value="age75plus">75 and older</option>
                </select>
              </div>

              {/* Medical aid */}
              <div className="space-y-2">
                <label htmlFor={`${inputId}-med`} className="text-sm font-medium flex items-center gap-1.5">
                  Medical Aid Dependants
                  <InfoBadge text="Total members on your medical aid (including yourself). First two earn R364/month credit each; R246/month for each additional member." />
                </label>
                <select
                  id={`${inputId}-med`}
                  className="tax-select"
                  value={medAids}
                  onChange={e => setMedAids(e.target.value)}
                >
                  <option value="0">None</option>
                  {[1,2,3,4,5,6,7,8].map(n => (
                    <option key={n} value={n}>{n} member{n > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                className="btn-calculate"
                onClick={handleCalculate}
                disabled={!income}
                style={{ opacity: !income ? 0.55 : 1 }}
              >
                Calculate Tax
              </button>
            </div>

            {/* Tax thresholds info box */}
            <div
              className="rounded-xl p-4 text-xs space-y-1.5"
              style={{ background: 'rgba(212,162,68,0.06)', border: '1px solid var(--border)' }}
            >
              <p className="font-medium text-[var(--amber-light)] mb-2 text-xs tracking-wide uppercase">
                2025/2026 Tax-Free Thresholds
              </p>
              <div className="flex justify-between opacity-70">
                <span>Under 65</span>
                <span className="font-mono">R 95,750</span>
              </div>
              <div className="flex justify-between opacity-70">
                <span>Age 65–74</span>
                <span className="font-mono">R 148,217</span>
              </div>
              <div className="flex justify-between opacity-70">
                <span>Age 75+</span>
                <span className="font-mono">R 165,689</span>
              </div>
            </div>
          </div>

          {/* ─── Results Panel ─── */}
          <div className="space-y-4">
            {!result ? (
              <div
                className="rounded-2xl p-8 flex flex-col items-center justify-center text-center min-h-[320px] animate-scale-in"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--border-strong)' }}
              >
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="mb-4 opacity-30">
                  <rect x="6" y="4" width="28" height="32" rx="3" stroke="var(--amber)" strokeWidth="1.5" />
                  <line x1="12" y1="13" x2="28" y2="13" stroke="var(--amber)" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="12" y1="20" x2="28" y2="20" stroke="var(--amber)" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="12" y1="27" x2="22" y2="27" stroke="var(--amber)" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <p className="text-sm opacity-50">Enter your income details and hit<br />Calculate Tax to see your breakdown.</p>
              </div>
            ) : (
              <div key={calcKey} className="space-y-3">
                {/* Take-home hero */}
                <div
                  className="rounded-2xl p-6 animate-fade-up"
                  style={{ background: 'rgba(212,162,68,0.08)', border: '1px solid var(--border-strong)' }}
                >
                  <p className="text-xs uppercase tracking-widest opacity-60 mb-1 font-medium">Annual Take-Home Pay</p>
                  <p className="font-display text-4xl sm:text-5xl" style={{ color: 'var(--amber-light)' }}>
                    {fmtCurrency(result.takeHomePay)}
                  </p>
                  <p className="text-xs opacity-50 mt-1 font-mono">
                    {fmtCurrency(result.takeHomePay / 12)} / month
                  </p>
                </div>

                {/* Income flow bars */}
                <div
                  className="rounded-2xl p-5 space-y-3.5 animate-fade-up afd-1"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}
                >
                  <p className="text-xs uppercase tracking-widest opacity-50 font-medium">Breakdown of Gross Income</p>
                  <TaxBar
                    label="Take-Home Pay"
                    value={result.takeHomePay}
                    total={result.grossIncome}
                    color="var(--amber)"
                  />
                  <TaxBar
                    label="Income Tax (PAYE)"
                    value={result.netTax}
                    total={result.grossIncome}
                    color="#6b9e7a"
                  />
                  <TaxBar
                    label="UIF (Employee)"
                    value={result.uifEmployee}
                    total={result.grossIncome}
                    color="#4a7a5a"
                  />
                </div>

                {/* Key metrics grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="result-card animate-fade-up afd-2">
                    <p className="text-xs opacity-50 mb-1">Effective Rate</p>
                    <p className="font-mono text-2xl font-medium" style={{ color: 'var(--amber-light)' }}>
                      {fmt(result.effectiveRate, 2)}%
                    </p>
                  </div>
                  <div className="result-card animate-fade-up afd-2">
                    <p className="text-xs opacity-50 mb-1">Marginal Rate</p>
                    <p className="font-mono text-2xl font-medium" style={{ color: 'var(--amber-light)' }}>
                      {fmt(result.marginalRate, 0)}%
                    </p>
                  </div>
                </div>

                {/* Detailed rows */}
                <div className="space-y-2">
                  <ResultRow
                    label="Gross Income"
                    value={fmtCurrency(result.grossIncome)}
                    animClass="afd-3"
                  />
                  <ResultRow
                    label="Gross Tax (before rebates)"
                    value={fmtCurrency(result.grossTax)}
                    animClass="afd-3"
                  />
                  <ResultRow
                    label="Tax Rebates"
                    value={`− ${fmtCurrency(result.rebates)}`}
                    muted
                    info={`Primary rebate R${fmt(REBATES.primary)}${ageGroup !== 'under65' ? ` + secondary R${fmt(REBATES.secondary)}` : ''}${ageGroup === 'age75plus' ? ` + tertiary R${fmt(REBATES.tertiary)}` : ''}`}
                    animClass="afd-4"
                  />
                  {result.medicalCredits > 0 && (
                    <ResultRow
                      label="Medical Aid Credits"
                      value={`− ${fmtCurrency(result.medicalCredits)}`}
                      muted
                      info={`${medAids} member${parseInt(medAids) > 1 ? 's' : ''} × monthly credits × 12`}
                      animClass="afd-4"
                    />
                  )}
                  <ResultRow
                    label="Net Income Tax (PAYE)"
                    value={fmtCurrency(result.netTax)}
                    highlight
                    animClass="afd-5"
                  />
                  <ResultRow
                    label="UIF (Employee 1%)"
                    value={`− ${fmtCurrency(result.uifEmployee)}`}
                    muted
                    info="Unemployment Insurance Fund: 1% of income, capped at R177.12/month."
                    animClass="afd-5"
                  />
                </div>

                {/* Tax brackets toggle */}
                <button
                  type="button"
                  onClick={() => setShowBrackets(s => !s)}
                  className="w-full rounded-xl py-3 px-4 text-sm font-medium flex items-center justify-between transition-all animate-fade-up afd-6"
                  style={{
                    background: showBrackets ? 'rgba(212,162,68,0.08)' : 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--border)',
                    color: 'var(--amber-light)',
                  }}
                >
                  <span>Tax Bracket Breakdown</span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    style={{ transform: showBrackets ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.25s' }}
                  >
                    <path d="M2 5L7 10L12 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {showBrackets && (
                  <div
                    className="rounded-2xl p-5 animate-scale-in"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}
                  >
                    <p className="text-xs uppercase tracking-widest opacity-50 font-medium mb-4">
                      2025/2026 SARS Brackets
                    </p>
                    <div className="space-y-1">
                      {TAX_BRACKETS.map((bracket, i) => {
                        const isActive = i === result.activeBracketIndex
                        const maxLabel = bracket.max === Infinity ? 'and above' : `– R${fmt(bracket.max)}`
                        return (
                          <div key={i} className={`bracket-row ${isActive ? 'active-bracket' : ''}`}>
                            <span className={`text-xs ${isActive ? 'font-medium' : 'opacity-60'}`}>
                              R{fmt(bracket.min)} {maxLabel}
                            </span>
                            <span className={`font-mono text-xs ${isActive ? 'text-[var(--amber-light)]' : 'opacity-50'}`}>
                              {Math.round(bracket.rate * 100)}%
                            </span>
                            {isActive && (
                              <span
                                className="text-xs px-1.5 py-0.5 rounded font-medium"
                                style={{ background: 'rgba(212,162,68,0.2)', color: 'var(--amber)' }}
                              >
                                You
                              </span>
                            )}
                          </div>
                        )
                      })}
                    </div>
                    <p className="text-xs opacity-40 mt-4 leading-relaxed">
                      South Africa uses a progressive tax system. You only pay the higher rate on income above each bracket's threshold.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer
        className="mt-auto border-t px-4 sm:px-8 py-6"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs opacity-40 max-w-sm leading-relaxed">
            Results are estimates only. For official SARS guidance visit{' '}
            <span className="underline" style={{ color: 'var(--amber)' }}>sars.gov.za</span>.
            CalcZA is not affiliated with SARS or the South African government.
          </p>
          <div className="flex items-center gap-4 text-xs opacity-40">
            <span>Tax Year: 2025/2026</span>
            <span className="w-1 h-1 rounded-full bg-current" />
            <span>Free & No Ads</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
