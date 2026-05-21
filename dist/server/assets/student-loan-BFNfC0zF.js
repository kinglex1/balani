import { jsxs, jsx } from "react/jsx-runtime";
import { useId, useState, useCallback } from "react";
function calculateStudentLoan(tuition, annualInterestRate, years, graceYears = 0) {
  const studyInterest = tuition * (annualInterestRate / 100) * graceYears;
  const totalLoan = tuition + studyInterest;
  const repaymentYears = Math.max(1, years - graceYears);
  const monthlyRate = annualInterestRate / 100 / 12;
  const numPayments = repaymentYears * 12;
  let monthlyPayment = 0;
  if (monthlyRate > 0 && repaymentYears > 0) {
    monthlyPayment = totalLoan * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
  } else if (repaymentYears > 0) {
    monthlyPayment = totalLoan / numPayments;
  }
  const totalPayment = monthlyPayment * numPayments;
  const totalInterest = totalPayment - totalLoan;
  return {
    totalLoan: Math.round(totalLoan),
    monthlyPayment: Math.round(monthlyPayment),
    totalPayment: Math.round(totalPayment),
    totalInterest: Math.round(totalInterest),
    rate: annualInterestRate,
    years: repaymentYears
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
function StudentLoanCalculator() {
  const inputId = useId();
  const [tuition, setTuition] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");
  const [graceYears, setGraceYears] = useState("0");
  const [result, setResult] = useState(null);
  const [calcKey, setCalcKey] = useState(0);
  const handleCalculate = useCallback(() => {
    const t = parseFloat(tuition.replace(/[^\d.]/g, ""));
    const r = parseFloat(rate.replace(/[^\d.]/g, ""));
    const y = parseInt(years.replace(/[^\d]/g, ""));
    const g = parseInt(graceYears.replace(/[^\d]/g, "")) || 0;
    if (!t || t <= 0 || !r || r <= 0 || !y || y <= 0) return;
    const res = calculateStudentLoan(t, r, y, g);
    setResult(res);
    setCalcKey((k) => k + 1);
  }, [tuition, rate, years, graceYears]);
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
        /* @__PURE__ */ jsx("a", { href: "/interest", className: "nav-link", children: "Finance" }),
        /* @__PURE__ */ jsx("a", { href: "/student-loan", className: "nav-link active", children: "Education" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "px-4 sm:px-8 pt-10 pb-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2 mb-5", children: [
        /* @__PURE__ */ jsx("span", { className: "tool-chip active", children: "Student Loan Calculator" }),
        /* @__PURE__ */ jsx("span", { className: "tool-chip", children: "Bursary Calculator" }),
        /* @__PURE__ */ jsx("span", { className: "tool-chip", children: "Free" })
      ] }),
      /* @__PURE__ */ jsxs("h1", { className: "font-display text-3xl sm:text-4xl lg:text-5xl leading-tight mb-3", children: [
        "Student Loan",
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("span", { style: { color: "var(--amber-light)" }, children: "Calculator" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-sm opacity-60 max-w-lg leading-relaxed", children: "Calculate your student loan repayments. See how much you'll pay monthly after graduation and understand the total cost of your bursary or study loan." })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "px-4 sm:px-8 pb-16 flex-1", children: /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "rounded-2xl p-6 space-y-5", style: { background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)" }, children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs("label", { htmlFor: `${inputId}-tuition`, className: "text-sm font-medium flex items-center gap-1.5", children: [
              "Total Tuition/Fees",
              /* @__PURE__ */ jsx("span", { className: "ml-1 cursor-help", title: "Total cost of your entire degree", children: /* @__PURE__ */ jsx("span", { className: "inline-flex items-center justify-center w-4 h-4 text-xs rounded-full opacity-50", style: { background: "var(--border-strong)" }, children: "i" }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm opacity-50", children: "R" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  id: `${inputId}-tuition`,
                  type: "number",
                  className: "tax-input pl-7",
                  placeholder: "e.g. 180000",
                  value: tuition,
                  onChange: (e) => setTuition(e.target.value),
                  onKeyDown: handleKeyDown,
                  min: "0",
                  "aria-label": "Total tuition amount"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("label", { htmlFor: `${inputId}-rate`, className: "text-sm font-medium", children: "Interest Rate (per annum)" }),
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
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-xs opacity-50", children: "NSFAS rate is approximately 7-9%" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("label", { htmlFor: `${inputId}-years`, className: "text-sm font-medium", children: "Total Loan Period" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                id: `${inputId}-years`,
                className: "tax-select",
                value: years,
                onChange: (e) => setYears(e.target.value),
                children: [
                  /* @__PURE__ */ jsx("option", { value: "", children: "Select duration" }),
                  [2, 3, 4, 5, 6, 7].map((y) => /* @__PURE__ */ jsxs("option", { value: y, children: [
                    y,
                    " years"
                  ] }, y))
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs("label", { htmlFor: `${inputId}-grace`, className: "text-sm font-medium flex items-center gap-1.5", children: [
              "Grace Period (Years)",
              /* @__PURE__ */ jsx("span", { className: "ml-1 cursor-help", title: "Years after graduation before repayments start", children: /* @__PURE__ */ jsx("span", { className: "inline-flex items-center justify-center w-4 h-4 text-xs rounded-full opacity-50", style: { background: "var(--border-strong)" }, children: "i" }) })
            ] }),
            /* @__PURE__ */ jsx(
              "select",
              {
                id: `${inputId}-grace`,
                className: "tax-select",
                value: graceYears,
                onChange: (e) => setGraceYears(e.target.value),
                children: [0, 1, 2].map((y) => /* @__PURE__ */ jsxs("option", { value: y, children: [
                  y,
                  " year",
                  y > 1 ? "s" : ""
                ] }, y))
              }
            )
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              className: "btn-calculate",
              onClick: handleCalculate,
              disabled: !tuition || !rate || !years,
              style: { opacity: !tuition || !rate || !years ? 0.55 : 1 },
              children: "Calculate Repayment"
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
          /* @__PURE__ */ jsx("p", { className: "font-medium text-[var(--amber-light)] mb-2", children: "Student Loan Facts" }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between opacity-70", children: [
            /* @__PURE__ */ jsx("span", { children: "NSFAS Funding" }),
            /* @__PURE__ */ jsx("span", { className: "font-mono", children: "Up to R125k/year" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between opacity-70", children: [
            /* @__PURE__ */ jsx("span", { children: "Interest Rate" }),
            /* @__PURE__ */ jsx("span", { className: "font-mono", children: "7-10% p.a." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between opacity-70", children: [
            /* @__PURE__ */ jsx("span", { children: "Grace Period" }),
            /* @__PURE__ */ jsx("span", { className: "font-mono", children: "Up to 12 months" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-4", children: !result ? /* @__PURE__ */ jsxs("div", { className: "rounded-2xl p-8 flex flex-col items-center justify-center text-center min-h-[320px] animate-scale-in", style: { background: "rgba(255,255,255,0.02)", border: "1px dashed var(--border-strong)" }, children: [
        /* @__PURE__ */ jsxs("svg", { width: "40", height: "40", viewBox: "0 0 40 40", fill: "none", className: "mb-4 opacity-30", children: [
          /* @__PURE__ */ jsx("path", { d: "M20 8L8 14V26L20 32L32 26V14L20 8Z", stroke: "var(--amber)", strokeWidth: "1.5" }),
          /* @__PURE__ */ jsx("path", { d: "M20 16V26", stroke: "var(--amber)", strokeWidth: "1.5" })
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm opacity-50", children: [
          "Enter your student loan details to see",
          /* @__PURE__ */ jsx("br", {}),
          "monthly repayments after graduation."
        ] })
      ] }) : /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "rounded-2xl p-6 animate-fade-up", style: { background: "rgba(212,162,68,0.08)", border: "1px solid var(--border-strong)" }, children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-widest opacity-60 mb-1 font-medium", children: "Monthly Repayment" }),
          /* @__PURE__ */ jsx("p", { className: "font-display text-4xl sm:text-5xl", style: { color: "var(--amber-light)" }, children: fmtCurrency(result.monthlyPayment) }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs opacity-50 mt-1 font-mono", children: [
            "Repaying over ",
            result.years,
            " years"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "result-card animate-fade-up afd-1", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs opacity-50 mb-1", children: "Total Loan Amount" }),
            /* @__PURE__ */ jsx("p", { className: "font-mono text-xl font-medium text-[var(--amber-light)]", children: fmtCurrency(result.totalLoan) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "result-card animate-fade-up afd-1", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs opacity-50 mb-1", children: "Total Interest" }),
            /* @__PURE__ */ jsx("p", { className: "font-mono text-xl font-medium text-[var(--amber-light)]", children: fmtCurrency(result.totalInterest) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "result-card flex items-center justify-between animate-fade-up afd-2", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm opacity-70", children: "Tuition/Fees" }),
            /* @__PURE__ */ jsx("span", { className: "font-mono font-medium", children: fmtCurrency(parseFloat(tuition)) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "result-card flex items-center justify-between animate-fade-up afd-2", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm opacity-70", children: "Interest During Study" }),
            /* @__PURE__ */ jsx("span", { className: "font-mono font-medium", children: fmtCurrency(result.totalLoan - parseFloat(tuition)) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "result-card flex items-center justify-between animate-fade-up afd-3", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm opacity-70", children: "Total Loan" }),
            /* @__PURE__ */ jsx("span", { className: "font-mono font-medium text-[var(--amber-light)]", children: fmtCurrency(result.totalLoan) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "result-card flex items-center justify-between animate-fade-up afd-3", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm opacity-70", children: "Total Interest" }),
            /* @__PURE__ */ jsx("span", { className: "font-mono font-medium", children: fmtCurrency(result.totalInterest) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "result-card flex items-center justify-between animate-fade-up afd-4", style: { borderColor: "var(--border-strong)" }, children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: "Total to Repay" }),
            /* @__PURE__ */ jsx("span", { className: "font-mono font-medium text-[var(--amber-light)] text-lg", children: fmtCurrency(result.totalPayment) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-xl p-4 text-xs", style: { background: "rgba(212,162,68,0.06)", border: "1px solid var(--border)" }, children: [
          /* @__PURE__ */ jsx("p", { className: "font-medium text-[var(--amber-light)] mb-1", children: "Important Notice" }),
          /* @__PURE__ */ jsx("p", { className: "opacity-70 leading-relaxed", children: "This is an estimate. NSFAS and bank loans may have different terms. Interest may accrue during study or repayments may start immediately." })
        ] })
      ] }, calcKey) })
    ] }) }),
    /* @__PURE__ */ jsx("footer", { className: "mt-auto border-t px-4 sm:px-8 py-6 no-print", style: { borderColor: "var(--border)" }, children: /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsx("p", { className: "text-xs opacity-40 max-w-sm leading-relaxed", children: "This calculator provides estimates for educational purposes only. Contact NSFAS or your bank for official loan terms." }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 text-xs opacity-40", children: [
        /* @__PURE__ */ jsx("a", { href: "/faq", className: "hover:opacity-70", children: "FAQ" }),
        /* @__PURE__ */ jsx("a", { href: "/about", className: "hover:opacity-70", children: "About" })
      ] })
    ] }) })
  ] });
}
const SplitComponent = StudentLoanCalculator;
export {
  SplitComponent as component
};
