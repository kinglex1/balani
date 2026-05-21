import { useState, useCallback, useId } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface CalculationResult {
  loanAmount: number
  monthlyPayment: number
  totalPayment: number
  totalInterest: number
  rate: number
  years: number
}

// ─── Calculation Logic ────────────────────────────────────────────────────────

function calculateHomeLoan(
  purchasePrice: number,
  deposit: number,
  interestRate: number,
  years: number
): CalculationResult {
  const loanAmount = purchasePrice - deposit
  const monthlyRate = interestRate / 100 / 12
  const numPayments = years * 12

  // PMT formula for mortgage calculation
  let monthlyPayment = 0
  if (monthlyRate > 0) {
    monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1)
  } else {
    monthlyPayment = loanAmount / numPayments
  }

  const totalPayment = monthlyPayment * numPayments
  const totalInterest = totalPayment - loanAmount

  return {
    loanAmount,
    monthlyPayment: Math.round(monthlyPayment),
    totalPayment: Math.round(totalPayment),
    totalInterest: Math.round(totalInterest),
    rate: interestRate,
    years,
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

export default function HomeLoanCalculator() {
  const inputId = useId()
  const [purchasePrice, setPurchasePrice] = useState('')
  const [deposit, setDeposit] = useState('')
  const [rate, setRate] = useState('')
  const [years, setYears] = useState('')
  const [result, setResult] = useState<CalculationResult | null>(null)
  const [calcKey, setCalcKey] = useState(0)

  const handleCalculate = useCallback(() => {
    const p = parseFloat(purchasePrice.replace(/[^\d.]/g, ''))
    const d = parseFloat(deposit.replace(/[^\d.]/g, '')) || 0
    const r = parseFloat(rate.replace(/[^\d.]/g, ''))
    const y = parseInt(years.replace(/[^\d]/g, ''))

    if (!p || p <= 0 || !r || r <= 0 || !y || y <= 0) return
    if (d >= p) return

    const res = calculateHomeLoan(p, d, r, y)
    setResult(res)
    setCalcKey(k => k + 1)
  }, [purchasePrice, deposit, rate, years])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleCalculate()
  }

  const handlePrint = () => window.print()

  const depositPercentage = result ? ((parseFloat(deposit) || 0) / parseFloat(purchasePrice) * 100).toFixed(1) : 0

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
            <span className="tool-chip active">Home Loan Calculator</span>
            <span className="tool-chip">Bond Calculator</span>
            <span className="tool-chip">Free</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl leading-tight mb-3">
            South African<br />
            <span style={{ color: 'var(--amber-light)' }}>Home Loan</span> Calculator
          </h1>
          <p className="text-sm opacity-60 max-w-lg leading-relaxed">
            Calculate your monthly home loan (bond) repayments. See how much you can afford
            and compare different scenarios with deposits and interest rates.
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="px-4 sm:px-8 pb-16 flex-1">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-6">

          {/* Input Panel */}
          <div className="space-y-5">
            <div className="rounded-2xl p-6 space-y-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}>
              {/* Purchase Price */}
              <div className="space-y-2">
                <label htmlFor={`${inputId}-price`} className="text-sm font-medium">Property Purchase Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm opacity-50">R</span>
                  <input
                    id={`${inputId}-price`}
                    type="number"
                    className="tax-input pl-7"
                    placeholder="e.g. 1500000"
                    value={purchasePrice}
                    onChange={e => setPurchasePrice(e.target.value)}
                    onKeyDown={handleKeyDown}
                    min="0"
                    aria-label="Property purchase price"
                  />
                </div>
              </div>

              {/* Deposit */}
              <div className="space-y-2">
                <label htmlFor={`${inputId}-deposit`} className="text-sm font-medium flex items-center gap-1.5">
                  Deposit (Optional)
                  <span className="ml-1 cursor-help" title="Money paid upfront to reduce loan amount"><span className="inline-flex items-center justify-center w-4 h-4 text-xs rounded-full opacity-50" style={{ background: 'var(--border-strong)' }}>i</span></span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm opacity-50">R</span>
                  <input
                    id={`${inputId}-deposit`}
                    type="number"
                    className="tax-input pl-7"
                    placeholder="e.g. 150000"
                    value={deposit}
                    onChange={e => setDeposit(e.target.value)}
                    onKeyDown={handleKeyDown}
                    min="0"
                    aria-label="Deposit amount"
                  />
                </div>
                {depositPercentage > 0 && (
                  <p className="text-xs opacity-50">{depositPercentage}% deposit</p>
                )}
              </div>

              {/* Interest Rate */}
              <div className="space-y-2">
                <label htmlFor={`${inputId}-rate`} className="text-sm font-medium">Interest Rate (%)
                </label>
                <div className="relative">
                  <input
                    id={`${inputId}-rate`}
                    type="number"
                    className="tax-input pr-12"
                    placeholder="e.g. 11.5"
                    value={rate}
                    onChange={e => setRate(e.target.value)}
                    onKeyDown={handleKeyDown}
                    min="0"
                    step="0.1"
                    aria-label="Annual interest rate"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-sm opacity-50">%</span>
                </div>
                <p className="text-xs opacity-50">Current prime rate is approximately 11.25%</p>
              </div>

              {/* Loan Term */}
              <div className="space-y-2">
                <label htmlFor={`${inputId}-years`} className="text-sm font-medium">Loan Term</label>
                <select
                  id={`${inputId}-years`}
                  className="tax-select"
                  value={years}
                  onChange={e => setYears(e.target.value)}
                >
                  <option value="">Select years</option>
                  {[5, 10, 15, 20, 25, 30].map(y => (
                    <option key={y} value={y}>{y} years</option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                className="btn-calculate"
                onClick={handleCalculate}
                disabled={!purchasePrice || !rate || !years}
                style={{ opacity: (!purchasePrice || !rate || !years) ? 0.55 : 1 }}
              >
                Calculate Repayment
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
              </div>
            )}

            {/* Info box */}
            <div className="rounded-xl p-4 text-xs space-y-1.5" style={{ background: 'rgba(212,162,68,0.06)', border: '1px solid var(--border)' }}>
              <p className="font-medium text-[var(--amber-light)] mb-2">Quick Facts</p>
              <div className="flex justify-between opacity-70">
                <span>Min. Deposit</span>
                <span className="font-mono">10-20%</span>
              </div>
              <div className="flex justify-between opacity-70">
                <span>Max. Loan Term</span>
                <span className="font-mono">30 years</span>
              </div>
              <div className="flex justify-between opacity-70">
                <span>LTV Ratio</span>
                <span className="font-mono">Up to 90%</span>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="space-y-4">
            {!result ? (
              <div className="rounded-2xl p-8 flex flex-col items-center justify-center text-center min-h-[320px] animate-scale-in" style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--border-strong)' }}>
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="mb-4 opacity-30">
                  <path d="M5 35V15L20 5L35 15V35H25V22H15V35H5Z" stroke="var(--amber)" strokeWidth="1.5" />
                </svg>
                <p className="text-sm opacity-50">Enter property price and loan details<br />to calculate your monthly repayment.</p>
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
                    {result.years} year loan at {result.rate}%
                  </p>
                </div>

                {/* Key metrics */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="result-card animate-fade-up afd-1">
                    <p className="text-xs opacity-50 mb-1">Loan Amount</p>
                    <p className="font-mono text-xl font-medium text-[var(--amber-light)]">
                      {fmtCurrency(result.loanAmount)}
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
                    <span className="text-sm opacity-70">Purchase Price</span>
                    <span className="font-mono font-medium">{fmtCurrency(parseFloat(purchasePrice))}</span>
                  </div>
                  <div className="result-card flex items-center justify-between animate-fade-up afd-2">
                    <span className="text-sm opacity-70">Deposit Paid</span>
                    <span className="font-mono font-medium text-[var(--amber-light)]">- {fmtCurrency(parseFloat(deposit) || 0)}</span>
                  </div>
                  <div className="result-card flex items-center justify-between animate-fade-up afd-3">
                    <span className="text-sm opacity-70">Loan Amount</span>
                    <span className="font-mono font-medium">{fmtCurrency(result.loanAmount)}</span>
                  </div>
                  <div className="result-card flex items-center justify-between animate-fade-up afd-3">
                    <span className="text-sm opacity-70">Total Interest</span>
                    <span className="font-mono font-medium">{fmtCurrency(result.totalInterest)}</span>
                  </div>
                  <div className="result-card flex items-center justify-between animate-fade-up afd-4" style={{ borderColor: 'var(--border-strong)' }}>
                    <span className="text-sm font-medium">Total Cost of Property</span>
                    <span className="font-mono font-medium text-[var(--amber-light)] text-lg">{fmtCurrency(result.totalPayment)}</span>
                  </div>
                </div>

                {/* Warning */}
                <div className="rounded-xl p-4 text-xs" style={{ background: 'rgba(212,162,68,0.06)', border: '1px solid var(--border)' }}>
                  <p className="font-medium text-[var(--amber-light)] mb-1">Important Notice</p>
                  <p className="opacity-70 leading-relaxed">
                    This is an estimate. Actual repayments may include initiation fees, bond registration costs,
                    and life insurance. Total interest shown does not include these additional costs.
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
            Consult a mortgage originator or bank for official quotation.
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