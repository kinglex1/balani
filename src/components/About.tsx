export default function About() {
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
            <a href="/student-loan" className="nav-link">Education</a>
          </nav>
        </div>
      </header>

      {/* Content */}
      <div className="px-4 sm:px-8 py-10 flex-1">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl leading-tight mb-6">
            About <span style={{ color: 'var(--amber-light)' }}>CalcZA</span>
          </h1>

          <div className="space-y-8">
            {/* Mission */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}>
              <h2 className="font-display text-xl mb-3">Our Mission</h2>
              <p className="text-sm opacity-70 leading-relaxed">
                CalcZA provides free, accurate, and easy-to-use financial calculators for South Africans.
                We believe everyone deserves access to quality financial tools, regardless of their background
                or financial literacy level. Our calculators help you understand taxes, plan investments,
                and make informed financial decisions.
              </p>
            </div>

            {/* What We Offer */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}>
              <h2 className="font-display text-xl mb-3">What We Offer</h2>
              <div className="space-y-4 text-sm opacity-70 leading-relaxed">
                <div>
                  <h3 className="font-medium text-[var(--amber-light)] mb-1">Tax Calculators</h3>
                  <p>Calculate your SARS income tax, including rebates, medical credits, and UIF contributions for the 2025/2026 tax year.</p>
                </div>
                <div>
                  <h3 className="font-medium text-[var(--amber-light)] mb-1">Finance Calculators</h3>
                  <p>Plan your financial future with compound interest, home loan, and investment return calculators.</p>
                </div>
                <div>
                  <h3 className="font-medium text-[var(--amber-light)] mb-1">Education Calculators</h3>
                  <p>Understand the true cost of student loans and plan for your education funding.</p>
                </div>
              </div>
            </div>

            {/* Privacy */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}>
              <h2 className="font-display text-xl mb-3">Privacy First</h2>
              <p className="text-sm opacity-70 leading-relaxed">
                Your privacy matters. All calculations happen locally in your browser - we never store,
                collect, or transmit your financial data. No sign-up required, no cookies, no tracking.
                Just fast, private calculations.
              </p>
            </div>

            {/* Disclaimer */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(212,162,68,0.06)', border: '1px solid var(--border)' }}>
              <h2 className="font-display text-xl mb-3">Important Disclaimer</h2>
              <p className="text-sm opacity-70 leading-relaxed">
                CalcZA calculators provide estimates for educational and planning purposes only.
                While we strive for accuracy, we cannot guarantee the completeness or reliability
                of the calculations. These tools do not constitute financial, legal, or tax advice.
                Always consult qualified professionals for advice specific to your situation.
              </p>
            </div>

            {/* Contact */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}>
              <h2 className="font-display text-xl mb-3">Get In Touch</h2>
              <p className="text-sm opacity-70 leading-relaxed">
                Have feedback or suggestions? We&apos;d love to hear from you.
              </p>
              <p className="text-sm mt-2">
                Email:{' '}
                <a href="mailto:support@calcza.co.za" className="underline" style={{ color: 'var(--amber)' }}>
                  support@calcza.co.za
                </a>
              </p>
            </div>

            {/* Copyright */}
            <div className="text-center text-xs opacity-40">
              <p>CalcZA © 2025-{new Date().getFullYear()}. Free calculators for South Africans.</p>
              <p className="mt-1">Not affiliated with SARS or any government institution.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-auto border-t px-4 sm:px-8 py-6 no-print" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs opacity-40 max-w-sm leading-relaxed">
            CalcZA provides calculators for educational purposes only.
            Not financial or tax advice.
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