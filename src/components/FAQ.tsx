import { useState } from 'react'

const faqs = [
  {
    category: 'Tax Calculator',
    questions: [
      {
        q: 'How accurate is the SARS tax calculator?',
        a: 'Our calculator uses the official 2025/2026 SARS tax brackets, rebates, and medical tax credits. While it provides highly accurate estimates, actual tax payable may vary based on your specific tax affairs. It should be used as a guide only.',
      },
      {
        q: 'What is the tax-free threshold?',
        a: 'For the 2025/2026 tax year, the tax-free threshold is R95,750 for taxpayers under 65, R148,217 for those aged 65-74, and R165,689 for those 75 and older.',
      },
      {
        q: 'How are medical aid credits calculated?',
        a: 'SARS provides monthly tax credits of R364 for the first two members on your medical aid and R246 per month for each additional member. These are deducted from your annual tax liability.',
      },
      {
        q: 'What are tax rebates?',
        a: 'Tax rebates reduce your tax liability. For 2025/2026: Primary rebate is R17,235, Secondary (65+) is R9,444, and Tertiary (75+) is R3,145.',
      },
    ],
  },
  {
    category: 'Finance Calculators',
    questions: [
      {
        q: 'How is compound interest calculated?',
        a: 'Compound interest is calculated on both the initial principal and accumulated interest. We use the standard compound interest formula: A = P(1 + r/n)^(nt) for principal P, rate r, compounding n times per year, over t years.',
      },
      {
        q: 'What interest rate should I use for investments?',
        a: 'Historical SA equity returns have been 10-14% p.a., balanced funds 8-10% p.a., and high-yield savings 5-8% p.a. We recommend being conservative and using 7-9% for planning purposes.',
      },
      {
        q: 'How much deposit do I need for a home loan?',
        a: 'Most South African banks require a 10-20% deposit. A higher deposit improves your chances of approval and may result in a better interest rate.',
      },
      {
        q: 'What is prime rate?',
        a: 'Prime rate is the benchmark interest rate set by South Africa\'s major banks. It\'s currently around 11.25%. Home loan rates are typically quoted as prime minus a spread.',
      },
    ],
  },
  {
    category: 'Student Loans',
    questions: [
      {
        q: 'What is NSFAS?',
        a: 'NSFAS (National Student Financial Aid Scheme) provides funding to eligible South African students. NSFAS loans have a lower interest rate and longer grace period than commercial loans.',
      },
      {
        q: 'When do student loan repayments start?',
        a: 'This depends on your loan agreement. NSFAS typically has a 12-month grace period after graduation before repayments begin.',
      },
    ],
  },
  {
    category: 'General',
    questions: [
      {
        q: 'Is CalcZA free to use?',
        a: 'Yes, CalcZA is completely free with no sign-up required. We aim to provide accessible financial tools for all South Africans.',
      },
      {
        q: 'Is my data stored?',
        a: 'No, all calculations happen locally in your browser. We do not store, collect, or share any of your financial information.',
      },
      {
        q: 'Is this financial advice?',
        a: 'No, CalcZA provides calculators for educational and estimation purposes only. Always consult a qualified financial advisor or tax consultant for advice specific to your situation.',
      },
    ],
  },
]

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-[var(--border)] last:border-b-0">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 text-left flex items-center justify-between gap-4 hover:opacity-80 transition-opacity"
      >
        <span className="font-medium text-left">{question}</span>
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          className="flex-shrink-0 transition-transform duration-200"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }}
        >
          <path d="M5 8L10 13L15 8" stroke="var(--amber)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {isOpen && (
        <div className="pb-4 text-sm opacity-70 leading-relaxed animate-fade-up">
          {answer}
        </div>
      )}
    </div>
  )
}

export default function FAQ() {
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

      {/* Hero */}
      <div className="px-4 sm:px-8 pt-10 pb-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl leading-tight mb-3">
            Frequently Asked<br />
            <span style={{ color: 'var(--amber-light)' }}>Questions</span>
          </h1>
          <p className="text-sm opacity-60 leading-relaxed">
            Find answers to common questions about our calculators, taxes, and financial planning in South Africa.
          </p>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="px-4 sm:px-8 pb-16 flex-1">
        <div className="max-w-3xl mx-auto space-y-10">
          {faqs.map((category) => (
            <div key={category.category}>
              <h2 className="text-lg font-medium mb-4" style={{ color: 'var(--amber-light)' }}>
                {category.category}
              </h2>
              <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}>
                {category.questions.map((faq, i) => (
                  <FAQItem key={i} question={faq.q} answer={faq.a} />
                ))}
              </div>
            </div>
          ))}

          {/* Contact */}
          <div className="rounded-2xl p-6 text-center" style={{ background: 'rgba(212,162,68,0.08)', border: '1px solid var(--border-strong)' }}>
            <p className="text-sm opacity-70 mb-3">Still have questions?</p>
            <p className="text-sm">
              Contact us at{' '}
              <a href="mailto:support@calcza.co.za" className="underline" style={{ color: 'var(--amber)' }}>
                support@calcza.co.za
              </a>
            </p>
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