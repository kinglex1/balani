import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
const faqs = [
  {
    category: "Tax Calculator",
    questions: [
      {
        q: "How accurate is the SARS tax calculator?",
        a: "Our calculator uses the official 2025/2026 SARS tax brackets, rebates, and medical tax credits. While it provides highly accurate estimates, actual tax payable may vary based on your specific tax affairs. It should be used as a guide only."
      },
      {
        q: "What is the tax-free threshold?",
        a: "For the 2025/2026 tax year, the tax-free threshold is R95,750 for taxpayers under 65, R148,217 for those aged 65-74, and R165,689 for those 75 and older."
      },
      {
        q: "How are medical aid credits calculated?",
        a: "SARS provides monthly tax credits of R364 for the first two members on your medical aid and R246 per month for each additional member. These are deducted from your annual tax liability."
      },
      {
        q: "What are tax rebates?",
        a: "Tax rebates reduce your tax liability. For 2025/2026: Primary rebate is R17,235, Secondary (65+) is R9,444, and Tertiary (75+) is R3,145."
      }
    ]
  },
  {
    category: "Finance Calculators",
    questions: [
      {
        q: "How is compound interest calculated?",
        a: "Compound interest is calculated on both the initial principal and accumulated interest. We use the standard compound interest formula: A = P(1 + r/n)^(nt) for principal P, rate r, compounding n times per year, over t years."
      },
      {
        q: "What interest rate should I use for investments?",
        a: "Historical SA equity returns have been 10-14% p.a., balanced funds 8-10% p.a., and high-yield savings 5-8% p.a. We recommend being conservative and using 7-9% for planning purposes."
      },
      {
        q: "How much deposit do I need for a home loan?",
        a: "Most South African banks require a 10-20% deposit. A higher deposit improves your chances of approval and may result in a better interest rate."
      },
      {
        q: "What is prime rate?",
        a: "Prime rate is the benchmark interest rate set by South Africa's major banks. It's currently around 11.25%. Home loan rates are typically quoted as prime minus a spread."
      }
    ]
  },
  {
    category: "Student Loans",
    questions: [
      {
        q: "What is NSFAS?",
        a: "NSFAS (National Student Financial Aid Scheme) provides funding to eligible South African students. NSFAS loans have a lower interest rate and longer grace period than commercial loans."
      },
      {
        q: "When do student loan repayments start?",
        a: "This depends on your loan agreement. NSFAS typically has a 12-month grace period after graduation before repayments begin."
      }
    ]
  },
  {
    category: "General",
    questions: [
      {
        q: "Is CalcZA free to use?",
        a: "Yes, CalcZA is completely free with no sign-up required. We aim to provide accessible financial tools for all South Africans."
      },
      {
        q: "Is my data stored?",
        a: "No, all calculations happen locally in your browser. We do not store, collect, or share any of your financial information."
      },
      {
        q: "Is this financial advice?",
        a: "No, CalcZA provides calculators for educational and estimation purposes only. Always consult a qualified financial advisor or tax consultant for advice specific to your situation."
      }
    ]
  }
];
function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);
  return /* @__PURE__ */ jsxs("div", { className: "border-b border-[var(--border)] last:border-b-0", children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        onClick: () => setIsOpen(!isOpen),
        className: "w-full py-4 text-left flex items-center justify-between gap-4 hover:opacity-80 transition-opacity",
        children: [
          /* @__PURE__ */ jsx("span", { className: "font-medium text-left", children: question }),
          /* @__PURE__ */ jsx(
            "svg",
            {
              width: "20",
              height: "20",
              viewBox: "0 0 20 20",
              fill: "none",
              className: "flex-shrink-0 transition-transform duration-200",
              style: { transform: isOpen ? "rotate(180deg)" : "rotate(0)" },
              children: /* @__PURE__ */ jsx("path", { d: "M5 8L10 13L15 8", stroke: "var(--amber)", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" })
            }
          )
        ]
      }
    ),
    isOpen && /* @__PURE__ */ jsx("div", { className: "pb-4 text-sm opacity-70 leading-relaxed animate-fade-up", children: answer })
  ] });
}
function FAQ() {
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen flex flex-col", children: [
    /* @__PURE__ */ jsx("header", { className: "border-b border-[var(--border)] px-4 py-4 sm:px-8 no-print", children: /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("a", { href: "/", className: "flex items-center gap-3 no-underline", children: [
        /* @__PURE__ */ jsx("div", { className: "w-7 h-7 rounded-md flex items-center justify-center text-[#0d2a14] font-bold text-xs font-mono", style: { background: "var(--amber)" }, children: "ZA" }),
        /* @__PURE__ */ jsx("span", { className: "font-display text-lg tracking-tight text-[var(--cream)]", children: "CalcZA" })
      ] }),
      /* @__PURE__ */ jsxs("nav", { className: "hidden sm:flex items-center gap-6", children: [
        /* @__PURE__ */ jsx("a", { href: "/", className: "nav-link", children: "Tax" }),
        /* @__PURE__ */ jsx("a", { href: "/interest", className: "nav-link", children: "Finance" }),
        /* @__PURE__ */ jsx("a", { href: "/student-loan", className: "nav-link", children: "Education" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "px-4 sm:px-8 pt-10 pb-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-3xl mx-auto text-center", children: [
      /* @__PURE__ */ jsxs("h1", { className: "font-display text-3xl sm:text-4xl lg:text-5xl leading-tight mb-3", children: [
        "Frequently Asked",
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("span", { style: { color: "var(--amber-light)" }, children: "Questions" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-sm opacity-60 leading-relaxed", children: "Find answers to common questions about our calculators, taxes, and financial planning in South Africa." })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "px-4 sm:px-8 pb-16 flex-1", children: /* @__PURE__ */ jsxs("div", { className: "max-w-3xl mx-auto space-y-10", children: [
      faqs.map((category) => /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-medium mb-4", style: { color: "var(--amber-light)" }, children: category.category }),
        /* @__PURE__ */ jsx("div", { className: "rounded-2xl p-6", style: { background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)" }, children: category.questions.map((faq, i) => /* @__PURE__ */ jsx(FAQItem, { question: faq.q, answer: faq.a }, i)) })
      ] }, category.category)),
      /* @__PURE__ */ jsxs("div", { className: "rounded-2xl p-6 text-center", style: { background: "rgba(212,162,68,0.08)", border: "1px solid var(--border-strong)" }, children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm opacity-70 mb-3", children: "Still have questions?" }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm", children: [
          "Contact us at",
          " ",
          /* @__PURE__ */ jsx("a", { href: "mailto:support@calcza.co.za", className: "underline", style: { color: "var(--amber)" }, children: "support@calcza.co.za" })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("footer", { className: "mt-auto border-t px-4 sm:px-8 py-6 no-print", style: { borderColor: "var(--border)" }, children: /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsx("p", { className: "text-xs opacity-40 max-w-sm leading-relaxed", children: "CalcZA provides calculators for educational purposes only. Not financial or tax advice." }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 text-xs opacity-40", children: [
        /* @__PURE__ */ jsx("a", { href: "/faq", className: "hover:opacity-70", children: "FAQ" }),
        /* @__PURE__ */ jsx("a", { href: "/about", className: "hover:opacity-70", children: "About" })
      ] })
    ] }) })
  ] });
}
const SplitComponent = FAQ;
export {
  SplitComponent as component
};
