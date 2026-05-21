import { jsxs, jsx } from "react/jsx-runtime";
import { useId, useState, useCallback } from "react";
function calculateCompoundInterest(principal, annualRate, years, compounding, monthlyContribution) {
  const periodsPerYear = compounding === "monthly" ? 12 : compounding === "quarterly" ? 4 : 1;
  const ratePerPeriod = annualRate / 100 / periodsPerYear;
  let balance = principal;
  const yearlyBreakdown = [];
  for (let year = 1; year <= years; year++) {
    const startBalance = balance;
    for (let period = 0; period < periodsPerYear; period++) {
      balance = balance * (1 + ratePerPeriod);
      for (let month = 0; month < 12 / periodsPerYear; month++) {
        balance += monthlyContribution;
      }
    }
    yearlyBreakdown.push({
      year,
      balance: Math.round(balance),
      interestEarned: Math.round(balance - startBalance - monthlyContribution * 12)
    });
  }
  return {
    principal,
    totalAmount: Math.round(balance),
    totalInterest: Math.round(balance - principal - monthlyContribution * 12 * years),
    yearlyBreakdown
  };
}
function fmt(n) {
  return new Intl.NumberFormat("en-ZA", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(n);
}
function fmtCurrency(n) {
  return `R ${fmt(n)}`;
}
function InfoBadge({ text }) {
  return /* @__PURE__ */ jsx("span", { className: "ml-1 cursor-help", title: text, "aria-label": text, children: /* @__PURE__ */ jsx("span", { className: "inline-flex items-center justify-center w-4 h-4 text-xs rounded-full opacity-50", style: { background: "var(--border-strong)" }, children: "i" }) });
}
function ResultCard({ label, value, highlight = false }) {
  return /* @__PURE__ */ jsxs("div", { className: "result-card flex items-center justify-between", children: [
    /* @__PURE__ */ jsx("span", { className: "text-sm opacity-70", children: label }),
    /* @__PURE__ */ jsx("span", { className: `font-mono font-medium ${highlight ? "text-[var(--amber-light)] text-lg" : ""}`, children: value })
  ] });
}
function InterestCalculator() {
  const inputId = useId();
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");
  const [compounding, setCompounding] = useState("monthly");
  const [monthlyContribution, setMonthlyContribution] = useState("");
  const [result, setResult] = useState(null);
  const [calcKey, setCalcKey] = useState(0);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const handleCalculate = useCallback(() => {
    const p = parseFloat(principal.replace(/[^\d.]/g, ""));
    const r = parseFloat(rate.replace(/[^\d.]/g, ""));
    const y = parseInt(years.replace(/[^\d]/g, ""));
    const m = parseFloat(monthlyContribution.replace(/[^\d.]/g, "")) || 0;
    if (!p || p <= 0 || !r || r <= 0 || !y || y <= 0) return;
    const res = calculateCompoundInterest(p, r, y, compounding, m);
    setResult(res);
    setCalcKey((k) => k + 1);
  }, [principal, rate, years, compounding, monthlyContribution]);
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleCalculate();
  };
  const handlePrint = () => window.print();
  const handleShare = async () => {
    if (navigator.share && result) {
      try {
        await navigator.share({
          title: "CalcZA - Compound Interest Calculator",
          text: `Savings growth from ${fmtCurrency(result.principal)} at ${rate}% over ${years} years: ${fmtCurrency(result.totalAmount)}`,
          url: window.location.href
        });
      } catch (e) {
      }
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen flex flex-col", children: [
    /* @__PURE__ */ jsx("header", { className: "border-b border-[var(--border)] px-4 py-4 sm:px-8 no-print", children: /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("a", { href: "/", className: "flex items-center gap-3 no-underline", children: [
        /* @__PURE__ */ jsx("div", { className: "w-7 h-7 rounded-md flex items-center justify-center text-[#0d2a14] font-bold text-xs font-mono", style: { background: "var(--amber)" }, children: "ZA" }),
        /* @__PURE__ */ jsx("span", { className: "font-display text-lg tracking-tight text-[var(--cream)]", children: "CalcZA" })
      ] }),
      /* @__PURE__ */ jsxs("nav", { className: "hidden sm:flex items-center gap-6", children: [
        /* @__PURE__ */ jsx("a", { href: "/", className: "nav-link", children: "Tax" }),
        /* @__PURE__ */ jsx("a", { href: "/interest", className: "nav-link active", children: "Finance" }),
        /* @__PURE__ */ jsx("span", { className: "nav-link opacity-40 cursor-not-allowed", children: "Education" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "px-4 sm:px-8 pt-10 pb-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2 mb-5", children: [
        /* @__PURE__ */ jsx("span", { className: "tool-chip active", children: "Interest Calculator" }),
        /* @__PURE__ */ jsx("span", { className: "tool-chip", children: "Compound Growth" }),
        /* @__PURE__ */ jsx("span", { className: "tool-chip", children: "Free" })
      ] }),
      /* @__PURE__ */ jsxs("h1", { className: "font-display text-3xl sm:text-4xl lg:text-5xl leading-tight mb-3", children: [
        "Compound Interest",
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("span", { style: { color: "var(--amber-light)" }, children: "Calculator" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-sm opacity-60 max-w-lg leading-relaxed", children: "Calculate how your savings and investments grow over time with compound interest. Includes support for regular monthly contributions." })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "px-4 sm:px-8 pb-16 flex-1", children: /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "rounded-2xl p-6 space-y-5", style: { background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)" }, children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs("label", { htmlFor: `${inputId}-principal`, className: "text-sm font-medium flex items-center gap-1.5", children: [
              "Initial Investment",
              /* @__PURE__ */ jsx(InfoBadge, { text: "The amount you start with or have saved." })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm opacity-50", children: "R" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  id: `${inputId}-principal`,
                  type: "number",
                  className: "tax-input pl-7",
                  placeholder: "e.g. 50000",
                  value: principal,
                  onChange: (e) => setPrincipal(e.target.value),
                  onKeyDown: handleKeyDown,
                  min: "0",
                  "aria-label": "Initial investment amount"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs("label", { htmlFor: `${inputId}-rate`, className: "text-sm font-medium flex items-center gap-1.5", children: [
              "Annual Interest Rate",
              /* @__PURE__ */ jsx(InfoBadge, { text: "The yearly interest rate offered (%)." })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  id: `${inputId}-rate`,
                  type: "number",
                  className: "tax-input pr-12",
                  placeholder: "e.g. 8.5",
                  value: rate,
                  onChange: (e) => setRate(e.target.value),
                  onKeyDown: handleKeyDown,
                  min: "0",
                  step: "0.1",
                  "aria-label": "Annual interest rate"
                }
              ),
              /* @__PURE__ */ jsx("span", { className: "absolute right-3 top-1/2 -translate-y-1/2 font-mono text-sm opacity-50", children: "%" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs("label", { htmlFor: `${inputId}-years`, className: "text-sm font-medium flex items-center gap-1.5", children: [
              "Investment Period",
              /* @__PURE__ */ jsx(InfoBadge, { text: "Number of years you plan to invest." })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  id: `${inputId}-years`,
                  type: "number",
                  className: "tax-input pr-14",
                  placeholder: "e.g. 10",
                  value: years,
                  onChange: (e) => setYears(e.target.value),
                  onKeyDown: handleKeyDown,
                  min: "1",
                  "aria-label": "Investment period in years"
                }
              ),
              /* @__PURE__ */ jsx("span", { className: "absolute right-3 top-1/2 -translate-y-1/2 font-mono text-sm opacity-50", children: "years" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("label", { htmlFor: `${inputId}-compounding`, className: "text-sm font-medium", children: "Interest Compounding" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                id: `${inputId}-compounding`,
                className: "tax-select",
                value: compounding,
                onChange: (e) => setCompounding(e.target.value),
                children: [
                  /* @__PURE__ */ jsx("option", { value: "monthly", children: "Monthly (12x per year)" }),
                  /* @__PURE__ */ jsx("option", { value: "quarterly", children: "Quarterly (4x per year)" }),
                  /* @__PURE__ */ jsx("option", { value: "annually", children: "Annually (1x per year)" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs("label", { htmlFor: `${inputId}-contribution`, className: "text-sm font-medium flex items-center gap-1.5", children: [
              "Monthly Contribution (Optional)",
              /* @__PURE__ */ jsx(InfoBadge, { text: "Additional amount you add each month." })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm opacity-50", children: "R" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  id: `${inputId}-contribution`,
                  type: "number",
                  className: "tax-input pl-7",
                  placeholder: "e.g. 2000",
                  value: monthlyContribution,
                  onChange: (e) => setMonthlyContribution(e.target.value),
                  onKeyDown: handleKeyDown,
                  min: "0",
                  "aria-label": "Monthly contribution amount"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              className: "btn-calculate",
              onClick: handleCalculate,
              disabled: !principal || !rate || !years,
              style: { opacity: !principal || !rate || !years ? 0.55 : 1 },
              children: "Calculate Returns"
            }
          )
        ] }),
        result && /* @__PURE__ */ jsxs("div", { className: "flex gap-3 no-print", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: handlePrint,
              className: "flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all",
              style: { background: "rgba(255,255,255,0.04)", border: "1.5px solid var(--border-strong)", color: "var(--cream)" },
              children: "Print"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: handleShare,
              className: "flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all",
              style: { background: "rgba(255,255,255,0.04)", border: "1.5px solid var(--border-strong)", color: "var(--cream)" },
              children: "Share"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-xl p-4 text-xs space-y-1.5", style: { background: "rgba(212,162,68,0.06)", border: "1px solid var(--border)" }, children: [
          /* @__PURE__ */ jsx("p", { className: "font-medium text-[var(--amber-light)] mb-2", children: "Investment Tips" }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between opacity-70", children: [
            /* @__PURE__ */ jsx("span", { children: "High-Yield Savings" }),
            /* @__PURE__ */ jsx("span", { className: "font-mono", children: "5-8% p.a." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between opacity-70", children: [
            /* @__PURE__ */ jsx("span", { children: "Fixed Deposits" }),
            /* @__PURE__ */ jsx("span", { className: "font-mono", children: "7-9% p.a." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between opacity-70", children: [
            /* @__PURE__ */ jsx("span", { children: "Unit Trusts" }),
            /* @__PURE__ */ jsx("span", { className: "font-mono", children: "8-12% p.a." })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-4", children: !result ? /* @__PURE__ */ jsxs("div", { className: "rounded-2xl p-8 flex flex-col items-center justify-center text-center min-h-[320px] animate-scale-in", style: { background: "rgba(255,255,255,0.02)", border: "1px dashed var(--border-strong)" }, children: [
        /* @__PURE__ */ jsxs("svg", { width: "40", height: "40", viewBox: "0 0 40 40", fill: "none", className: "mb-4 opacity-30", children: [
          /* @__PURE__ */ jsx("circle", { cx: "20", cy: "20", r: "15", stroke: "var(--amber)", strokeWidth: "1.5" }),
          /* @__PURE__ */ jsx("path", { d: "M20 10V20L26 26", stroke: "var(--amber)", strokeWidth: "1.5", strokeLinecap: "round" })
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm opacity-50", children: [
          "Enter your investment details to see",
          /* @__PURE__ */ jsx("br", {}),
          "how your money can grow over time."
        ] })
      ] }) : /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "rounded-2xl p-6 animate-fade-up", style: { background: "rgba(212,162,68,0.08)", border: "1px solid var(--border-strong)" }, children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-widest opacity-60 mb-1 font-medium", children: "Final Balance" }),
          /* @__PURE__ */ jsx("p", { className: "font-display text-4xl sm:text-5xl", style: { color: "var(--amber-light)" }, children: fmtCurrency(result.totalAmount) }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs opacity-50 mt-1 font-mono", children: [
            "Started with ",
            fmtCurrency(result.principal)
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "result-card animate-fade-up afd-1", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs opacity-50 mb-1", children: "Total Interest" }),
            /* @__PURE__ */ jsx("p", { className: "font-mono text-2xl font-medium text-[var(--amber-light)]", children: fmtCurrency(result.totalInterest) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "result-card animate-fade-up afd-1", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs opacity-50 mb-1", children: "Growth Rate" }),
            /* @__PURE__ */ jsxs("p", { className: "font-mono text-2xl font-medium text-[var(--amber-light)]", children: [
              (result.totalInterest / result.principal * 100).toFixed(1),
              "%"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(ResultCard, { label: "Initial Investment", value: fmtCurrency(result.principal) }),
          /* @__PURE__ */ jsx(ResultCard, { label: "Total Contributions", value: fmtCurrency(parseInt(years) * 12 * (parseFloat(monthlyContribution) || 0)) }),
          /* @__PURE__ */ jsx(ResultCard, { label: "Total Interest Earned", value: fmtCurrency(result.totalInterest), highlight: true })
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => setShowBreakdown((s) => !s),
            className: "w-full rounded-xl py-3 px-4 text-sm font-medium flex items-center justify-between transition-all animate-fade-up afd-2 no-print",
            style: {
              background: showBreakdown ? "rgba(212,162,68,0.08)" : "rgba(255,255,255,0.03)",
              border: "1px solid var(--border)",
              color: "var(--amber-light)"
            },
            children: [
              /* @__PURE__ */ jsx("span", { children: "Yearly Breakdown" }),
              /* @__PURE__ */ jsx("svg", { width: "14", height: "14", viewBox: "0 0 14 14", fill: "none", style: { transform: showBreakdown ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.25s" }, children: /* @__PURE__ */ jsx("path", { d: "M2 5L7 10L12 5", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }) })
            ]
          }
        ),
        showBreakdown && /* @__PURE__ */ jsxs("div", { className: "rounded-2xl p-5 animate-scale-in", style: { background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)" }, children: [
          /* @__PURE__ */ jsxs("p", { className: "text-xs uppercase tracking-widest opacity-50 font-medium mb-4", children: [
            "Growth Over ",
            years,
            " Years"
          ] }),
          /* @__PURE__ */ jsx("div", { className: "space-y-2", children: result.yearlyBreakdown.map((item, i) => /* @__PURE__ */ jsxs("div", { className: "bracket-row", children: [
            /* @__PURE__ */ jsxs("span", { className: "text-xs opacity-70", children: [
              "Year ",
              item.year
            ] }),
            /* @__PURE__ */ jsx("span", { className: "font-mono text-xs text-[var(--amber-light)]", children: fmtCurrency(item.balance) }),
            /* @__PURE__ */ jsxs("span", { className: "font-mono text-xs opacity-60", children: [
              "+",
              fmtCurrency(item.interestEarned)
            ] })
          ] }, i)) })
        ] })
      ] }, calcKey) })
    ] }) }),
    /* @__PURE__ */ jsx("footer", { className: "mt-auto border-t px-4 sm:px-8 py-6 no-print", style: { borderColor: "var(--border)" }, children: /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsx("p", { className: "text-xs opacity-40 max-w-sm leading-relaxed", children: "This calculator provides estimates for educational purposes only. Returns are not guaranteed. Consult a financial advisor for personalized advice." }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 text-xs opacity-40", children: [
        /* @__PURE__ */ jsx("a", { href: "/faq", className: "hover:opacity-70", children: "FAQ" }),
        /* @__PURE__ */ jsx("a", { href: "/about", className: "hover:opacity-70", children: "About" })
      ] })
    ] }) })
  ] });
}
const SplitComponent = InterestCalculator;
export {
  SplitComponent as component
};
