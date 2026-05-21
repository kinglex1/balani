import { jsxs, jsx } from "react/jsx-runtime";
function About() {
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
    /* @__PURE__ */ jsx("div", { className: "px-4 sm:px-8 py-10 flex-1", children: /* @__PURE__ */ jsxs("div", { className: "max-w-3xl mx-auto", children: [
      /* @__PURE__ */ jsxs("h1", { className: "font-display text-3xl sm:text-4xl lg:text-5xl leading-tight mb-6", children: [
        "About ",
        /* @__PURE__ */ jsx("span", { style: { color: "var(--amber-light)" }, children: "CalcZA" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "rounded-2xl p-6", style: { background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)" }, children: [
          /* @__PURE__ */ jsx("h2", { className: "font-display text-xl mb-3", children: "Our Mission" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm opacity-70 leading-relaxed", children: "CalcZA provides free, accurate, and easy-to-use financial calculators for South Africans. We believe everyone deserves access to quality financial tools, regardless of their background or financial literacy level. Our calculators help you understand taxes, plan investments, and make informed financial decisions." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-2xl p-6", style: { background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)" }, children: [
          /* @__PURE__ */ jsx("h2", { className: "font-display text-xl mb-3", children: "What We Offer" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4 text-sm opacity-70 leading-relaxed", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "font-medium text-[var(--amber-light)] mb-1", children: "Tax Calculators" }),
              /* @__PURE__ */ jsx("p", { children: "Calculate your SARS income tax, including rebates, medical credits, and UIF contributions for the 2025/2026 tax year." })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "font-medium text-[var(--amber-light)] mb-1", children: "Finance Calculators" }),
              /* @__PURE__ */ jsx("p", { children: "Plan your financial future with compound interest, home loan, and investment return calculators." })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "font-medium text-[var(--amber-light)] mb-1", children: "Education Calculators" }),
              /* @__PURE__ */ jsx("p", { children: "Understand the true cost of student loans and plan for your education funding." })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-2xl p-6", style: { background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)" }, children: [
          /* @__PURE__ */ jsx("h2", { className: "font-display text-xl mb-3", children: "Privacy First" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm opacity-70 leading-relaxed", children: "Your privacy matters. All calculations happen locally in your browser - we never store, collect, or transmit your financial data. No sign-up required, no cookies, no tracking. Just fast, private calculations." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-2xl p-6", style: { background: "rgba(212,162,68,0.06)", border: "1px solid var(--border)" }, children: [
          /* @__PURE__ */ jsx("h2", { className: "font-display text-xl mb-3", children: "Important Disclaimer" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm opacity-70 leading-relaxed", children: "CalcZA calculators provide estimates for educational and planning purposes only. While we strive for accuracy, we cannot guarantee the completeness or reliability of the calculations. These tools do not constitute financial, legal, or tax advice. Always consult qualified professionals for advice specific to your situation." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-2xl p-6", style: { background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)" }, children: [
          /* @__PURE__ */ jsx("h2", { className: "font-display text-xl mb-3", children: "Get In Touch" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm opacity-70 leading-relaxed", children: "Have feedback or suggestions? We'd love to hear from you." }),
          /* @__PURE__ */ jsxs("p", { className: "text-sm mt-2", children: [
            "Email:",
            " ",
            /* @__PURE__ */ jsx("a", { href: "mailto:support@calcza.co.za", className: "underline", style: { color: "var(--amber)" }, children: "support@calcza.co.za" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-center text-xs opacity-40", children: [
          /* @__PURE__ */ jsxs("p", { children: [
            "CalcZA © 2025-",
            (/* @__PURE__ */ new Date()).getFullYear(),
            ". Free calculators for South Africans."
          ] }),
          /* @__PURE__ */ jsx("p", { className: "mt-1", children: "Not affiliated with SARS or any government institution." })
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
const SplitComponent = About;
export {
  SplitComponent as component
};
