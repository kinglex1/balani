import { jsxs, jsx } from "react/jsx-runtime";
import { useId, useState, useCallback } from "react";
function calculateInvestmentReturns(initial, monthly, years, expectedReturn) {
  const annualRate = expectedReturn / 100;
  let finalValue = initial;
  let totalContributions = initial;
  for (let month = 0; month < years * 12; month++) {
    finalValue = finalValue * (1 + annualRate / 12) + monthly;
    totalContributions += monthly;
  }
  const totalGrowth = finalValue - totalContributions;
  const annualizedReturn = (Math.pow(finalValue / initial, 1 / years) - 1) * 100;
  return {
    initialInvestment: initial,
    monthlyContribution: monthly,
    finalValue: Math.round(finalValue),
    totalContributions,
    totalGrowth: Math.round(totalGrowth),
    annualizedReturn: Math.round(annualizedReturn * 100) / 100
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
function InvestmentCalculator() {
  const inputId = useId();
  const [initial, setInitial] = useState("");
  const [monthly, setMonthly] = useState("");
  const [years, setYears] = useState("");
  const [returnRate, setReturnRate] = useState("");
  const [result, setResult] = useState(null);
  const [calcKey, setCalcKey] = useState(0);
  const handleCalculate = useCallback(() => {
    const i = parseFloat(initial.replace(/[^\d.]/g, ""));
    const m = parseFloat(monthly.replace(/[^\d.]/g, ""));
    const y = parseInt(years.replace(/[^\d]/g, ""));
    const r = parseFloat(returnRate.replace(/[^\d.]/g, ""));
    if (!i && !m || !y || !r) return;
    const res = calculateInvestmentReturns(i || 0, m || 0, y, r);
    setResult(res);
    setCalcKey((k) => k + 1);
  }, [initial, monthly, years, returnRate]);
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleCalculate();
  };
  const handlePrint = () => window.print();
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
        /* @__PURE__ */ jsx("span", { className: "tool-chip active", children: "Investment Calculator" }),
        /* @__PURE__ */ jsx("span", { className: "tool-chip", children: "Unit Trusts" }),
        /* @__PURE__ */ jsx("span", { className: "tool-chip", children: "Retirement" })
      ] }),
      /* @__PURE__ */ jsxs("h1", { className: "font-display text-3xl sm:text-4xl lg:text-5xl leading-tight mb-3", children: [
        "Investment Returns",
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("span", { style: { color: "var(--amber-light)" }, children: "Calculator" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-sm opacity-60 max-w-lg leading-relaxed", children: "See how your investments could grow over time. Calculate potential returns from unit trusts, retirement annuities, and other investment vehicles." })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "px-4 sm:px-8 pb-16 flex-1", children: /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "rounded-2xl p-6 space-y-5", style: { background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)" }, children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("label", { htmlFor: `${inputId}-initial`, className: "text-sm font-medium", children: "Initial Investment (Lump Sum)" }),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm opacity-50", children: "R" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  id: `${inputId}-initial`,
                  type: "number",
                  className: "tax-input pl-7",
                  placeholder: "e.g. 50000",
                  value: initial,
                  onChange: (e) => setInitial(e.target.value),
                  onKeyDown: handleKeyDown,
                  min: "0",
                  "aria-label": "Initial investment amount"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("label", { htmlFor: `${inputId}-monthly`, className: "text-sm font-medium", children: "Monthly Contribution" }),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm opacity-50", children: "R" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  id: `${inputId}-monthly`,
                  type: "number",
                  className: "tax-input pl-7",
                  placeholder: "e.g. 2000",
                  value: monthly,
                  onChange: (e) => setMonthly(e.target.value),
                  onKeyDown: handleKeyDown,
                  min: "0",
                  "aria-label": "Monthly contribution"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("label", { htmlFor: `${inputId}-years`, className: "text-sm font-medium", children: "Investment Period" }),
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
            /* @__PURE__ */ jsxs("label", { htmlFor: `${inputId}-return`, className: "text-sm font-medium flex items-center gap-1.5", children: [
              "Expected Annual Return",
              /* @__PURE__ */ jsx("span", { className: "ml-1 cursor-help", title: "The average annual return you expect to earn", children: /* @__PURE__ */ jsx("span", { className: "inline-flex items-center justify-center w-4 h-4 text-xs rounded-full opacity-50", style: { background: "var(--border-strong)" }, children: "i" }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  id: `${inputId}-return`,
                  type: "number",
                  className: "tax-input pr-12",
                  placeholder: "e.g. 10",
                  value: returnRate,
                  onChange: (e) => setReturnRate(e.target.value),
                  onKeyDown: handleKeyDown,
                  min: "0",
                  step: "0.5",
                  "aria-label": "Expected annual return"
                }
              ),
              /* @__PURE__ */ jsx("span", { className: "absolute right-3 top-1/2 -translate-y-1/2 font-mono text-sm opacity-50", children: "%" })
            ] })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              className: "btn-calculate",
              onClick: handleCalculate,
              disabled: !years || !returnRate,
              style: { opacity: !years || !returnRate ? 0.55 : 1 },
              children: "Calculate Returns"
            }
          )
        ] }),
        result && /* @__PURE__ */ jsx("div", { className: "flex gap-3 no-print", children: /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: handlePrint,
            className: "flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all",
            style: { background: "rgba(255,255,255,0.04)", border: "1.5px solid var(--border-strong)", color: "var(--cream)" },
            children: "Print"
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-xl p-4 text-xs space-y-1.5", style: { background: "rgba(212,162,68,0.06)", border: "1px solid var(--border)" }, children: [
          /* @__PURE__ */ jsx("p", { className: "font-medium text-[var(--amber-light)] mb-2", children: "Historical Returns (SA)" }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between opacity-70", children: [
            /* @__PURE__ */ jsx("span", { children: "Top Equity Funds" }),
            /* @__PURE__ */ jsx("span", { className: "font-mono", children: "10-14% p.a." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between opacity-70", children: [
            /* @__PURE__ */ jsx("span", { children: "Balanced Funds" }),
            /* @__PURE__ */ jsx("span", { className: "font-mono", children: "8-10% p.a." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between opacity-70", children: [
            /* @__PURE__ */ jsx("span", { children: "Retirement Annuity" }),
            /* @__PURE__ */ jsx("span", { className: "font-mono", children: "9-11% p.a." })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-4", children: !result ? /* @__PURE__ */ jsxs("div", { className: "rounded-2xl p-8 flex flex-col items-center justify-center text-center min-h-[320px] animate-scale-in", style: { background: "rgba(255,255,255,0.02)", border: "1px dashed var(--border-strong)" }, children: [
        /* @__PURE__ */ jsxs("svg", { width: "40", height: "40", viewBox: "0 0 40 40", fill: "none", className: "mb-4 opacity-30", children: [
          /* @__PURE__ */ jsx("path", { d: "M10 30L20 10L30 30", stroke: "var(--amber)", strokeWidth: "1.5" }),
          /* @__PURE__ */ jsx("path", { d: "M14 24H26", stroke: "var(--amber)", strokeWidth: "1.5" })
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm opacity-50", children: [
          "Enter your investment details to see",
          /* @__PURE__ */ jsx("br", {}),
          "projected growth over time."
        ] })
      ] }) : /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "rounded-2xl p-6 animate-fade-up", style: { background: "rgba(212,162,68,0.08)", border: "1px solid var(--border-strong)" }, children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-widest opacity-60 mb-1 font-medium", children: "Projected Final Value" }),
          /* @__PURE__ */ jsx("p", { className: "font-display text-4xl sm:text-5xl", style: { color: "var(--amber-light)" }, children: fmtCurrency(result.finalValue) }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs opacity-50 mt-1 font-mono", children: [
            "After ",
            years,
            " years at ",
            returnRate,
            "% p.a."
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "result-card animate-fade-up afd-1", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs opacity-50 mb-1", children: "Total Contributions" }),
            /* @__PURE__ */ jsx("p", { className: "font-mono text-xl font-medium text-[var(--amber-light)]", children: fmtCurrency(result.totalContributions) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "result-card animate-fade-up afd-1", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs opacity-50 mb-1", children: "Investment Growth" }),
            /* @__PURE__ */ jsx("p", { className: "font-mono text-xl font-medium text-[var(--amber-light)]", children: fmtCurrency(result.totalGrowth) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "result-card flex items-center justify-between animate-fade-up afd-2", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm opacity-70", children: "Initial Investment" }),
            /* @__PURE__ */ jsx("span", { className: "font-mono font-medium", children: fmtCurrency(result.initialInvestment) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "result-card flex items-center justify-between animate-fade-up afd-2", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm opacity-70", children: "Total Monthly Contributions" }),
            /* @__PURE__ */ jsx("span", { className: "font-mono font-medium", children: fmtCurrency(result.totalContributions - result.initialInvestment) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "result-card flex items-center justify-between animate-fade-up afd-3", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm opacity-70", children: "Total Growth" }),
            /* @__PURE__ */ jsx("span", { className: "font-mono font-medium text-[var(--amber-light)]", children: fmtCurrency(result.totalGrowth) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "result-card flex items-center justify-between animate-fade-up afd-3", style: { borderColor: "var(--border-strong)" }, children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: "Final Value" }),
            /* @__PURE__ */ jsx("span", { className: "font-mono font-medium text-[var(--amber-light)] text-lg", children: fmtCurrency(result.finalValue) })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "rounded-xl p-4 text-xs", style: { background: "rgba(212,162,68,0.06)", border: "1px solid var(--border)" }, children: /* @__PURE__ */ jsx("p", { className: "opacity-70 leading-relaxed", children: "Past performance is not indicative of future returns. These calculations are for illustrative purposes only and do not constitute financial advice." }) })
      ] }, calcKey) })
    ] }) }),
    /* @__PURE__ */ jsx("footer", { className: "mt-auto border-t px-4 sm:px-8 py-6 no-print", style: { borderColor: "var(--border)" }, children: /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsx("p", { className: "text-xs opacity-40 max-w-sm leading-relaxed", children: "This calculator provides estimates for educational purposes only. Consult a financial advisor for personalized investment advice." }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 text-xs opacity-40", children: [
        /* @__PURE__ */ jsx("a", { href: "/faq", className: "hover:opacity-70", children: "FAQ" }),
        /* @__PURE__ */ jsx("a", { href: "/about", className: "hover:opacity-70", children: "About" })
      ] })
    ] }) })
  ] });
}
const SplitComponent = InvestmentCalculator;
export {
  SplitComponent as component
};
