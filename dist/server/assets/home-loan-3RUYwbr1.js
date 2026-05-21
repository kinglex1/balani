import { jsxs, jsx } from "react/jsx-runtime";
import { useId, useState, useCallback } from "react";
function calculateHomeLoan(purchasePrice, deposit, interestRate, years) {
  const loanAmount = purchasePrice - deposit;
  const monthlyRate = interestRate / 100 / 12;
  const numPayments = years * 12;
  let monthlyPayment = 0;
  if (monthlyRate > 0) {
    monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
  } else {
    monthlyPayment = loanAmount / numPayments;
  }
  const totalPayment = monthlyPayment * numPayments;
  const totalInterest = totalPayment - loanAmount;
  return {
    loanAmount,
    monthlyPayment: Math.round(monthlyPayment),
    totalPayment: Math.round(totalPayment),
    totalInterest: Math.round(totalInterest),
    rate: interestRate,
    years
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
function HomeLoanCalculator() {
  const inputId = useId();
  const [purchasePrice, setPurchasePrice] = useState("");
  const [deposit, setDeposit] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");
  const [result, setResult] = useState(null);
  const [calcKey, setCalcKey] = useState(0);
  const handleCalculate = useCallback(() => {
    const p = parseFloat(purchasePrice.replace(/[^\d.]/g, ""));
    const d = parseFloat(deposit.replace(/[^\d.]/g, "")) || 0;
    const r = parseFloat(rate.replace(/[^\d.]/g, ""));
    const y = parseInt(years.replace(/[^\d]/g, ""));
    if (!p || p <= 0 || !r || r <= 0 || !y || y <= 0) return;
    if (d >= p) return;
    const res = calculateHomeLoan(p, d, r, y);
    setResult(res);
    setCalcKey((k) => k + 1);
  }, [purchasePrice, deposit, rate, years]);
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleCalculate();
  };
  const handlePrint = () => window.print();
  const depositPercentage = result ? ((parseFloat(deposit) || 0) / parseFloat(purchasePrice) * 100).toFixed(1) : 0;
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
        /* @__PURE__ */ jsx("span", { className: "tool-chip active", children: "Home Loan Calculator" }),
        /* @__PURE__ */ jsx("span", { className: "tool-chip", children: "Bond Calculator" }),
        /* @__PURE__ */ jsx("span", { className: "tool-chip", children: "Free" })
      ] }),
      /* @__PURE__ */ jsxs("h1", { className: "font-display text-3xl sm:text-4xl lg:text-5xl leading-tight mb-3", children: [
        "South African",
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("span", { style: { color: "var(--amber-light)" }, children: "Home Loan" }),
        " Calculator"
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-sm opacity-60 max-w-lg leading-relaxed", children: "Calculate your monthly home loan (bond) repayments. See how much you can afford and compare different scenarios with deposits and interest rates." })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "px-4 sm:px-8 pb-16 flex-1", children: /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "rounded-2xl p-6 space-y-5", style: { background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)" }, children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("label", { htmlFor: `${inputId}-price`, className: "text-sm font-medium", children: "Property Purchase Price" }),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm opacity-50", children: "R" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  id: `${inputId}-price`,
                  type: "number",
                  className: "tax-input pl-7",
                  placeholder: "e.g. 1500000",
                  value: purchasePrice,
                  onChange: (e) => setPurchasePrice(e.target.value),
                  onKeyDown: handleKeyDown,
                  min: "0",
                  "aria-label": "Property purchase price"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs("label", { htmlFor: `${inputId}-deposit`, className: "text-sm font-medium flex items-center gap-1.5", children: [
              "Deposit (Optional)",
              /* @__PURE__ */ jsx("span", { className: "ml-1 cursor-help", title: "Money paid upfront to reduce loan amount", children: /* @__PURE__ */ jsx("span", { className: "inline-flex items-center justify-center w-4 h-4 text-xs rounded-full opacity-50", style: { background: "var(--border-strong)" }, children: "i" }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm opacity-50", children: "R" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  id: `${inputId}-deposit`,
                  type: "number",
                  className: "tax-input pl-7",
                  placeholder: "e.g. 150000",
                  value: deposit,
                  onChange: (e) => setDeposit(e.target.value),
                  onKeyDown: handleKeyDown,
                  min: "0",
                  "aria-label": "Deposit amount"
                }
              )
            ] }),
            depositPercentage > 0 && /* @__PURE__ */ jsxs("p", { className: "text-xs opacity-50", children: [
              depositPercentage,
              "% deposit"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("label", { htmlFor: `${inputId}-rate`, className: "text-sm font-medium", children: "Interest Rate (%)" }),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  id: `${inputId}-rate`,
                  type: "number",
                  className: "tax-input pr-12",
                  placeholder: "e.g. 11.5",
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
            /* @__PURE__ */ jsx("p", { className: "text-xs opacity-50", children: "Current prime rate is approximately 11.25%" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("label", { htmlFor: `${inputId}-years`, className: "text-sm font-medium", children: "Loan Term" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                id: `${inputId}-years`,
                className: "tax-select",
                value: years,
                onChange: (e) => setYears(e.target.value),
                children: [
                  /* @__PURE__ */ jsx("option", { value: "", children: "Select years" }),
                  [5, 10, 15, 20, 25, 30].map((y) => /* @__PURE__ */ jsxs("option", { value: y, children: [
                    y,
                    " years"
                  ] }, y))
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              className: "btn-calculate",
              onClick: handleCalculate,
              disabled: !purchasePrice || !rate || !years,
              style: { opacity: !purchasePrice || !rate || !years ? 0.55 : 1 },
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
          /* @__PURE__ */ jsx("p", { className: "font-medium text-[var(--amber-light)] mb-2", children: "Quick Facts" }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between opacity-70", children: [
            /* @__PURE__ */ jsx("span", { children: "Min. Deposit" }),
            /* @__PURE__ */ jsx("span", { className: "font-mono", children: "10-20%" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between opacity-70", children: [
            /* @__PURE__ */ jsx("span", { children: "Max. Loan Term" }),
            /* @__PURE__ */ jsx("span", { className: "font-mono", children: "30 years" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between opacity-70", children: [
            /* @__PURE__ */ jsx("span", { children: "LTV Ratio" }),
            /* @__PURE__ */ jsx("span", { className: "font-mono", children: "Up to 90%" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-4", children: !result ? /* @__PURE__ */ jsxs("div", { className: "rounded-2xl p-8 flex flex-col items-center justify-center text-center min-h-[320px] animate-scale-in", style: { background: "rgba(255,255,255,0.02)", border: "1px dashed var(--border-strong)" }, children: [
        /* @__PURE__ */ jsx("svg", { width: "40", height: "40", viewBox: "0 0 40 40", fill: "none", className: "mb-4 opacity-30", children: /* @__PURE__ */ jsx("path", { d: "M5 35V15L20 5L35 15V35H25V22H15V35H5Z", stroke: "var(--amber)", strokeWidth: "1.5" }) }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm opacity-50", children: [
          "Enter property price and loan details",
          /* @__PURE__ */ jsx("br", {}),
          "to calculate your monthly repayment."
        ] })
      ] }) : /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "rounded-2xl p-6 animate-fade-up", style: { background: "rgba(212,162,68,0.08)", border: "1px solid var(--border-strong)" }, children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-widest opacity-60 mb-1 font-medium", children: "Monthly Repayment" }),
          /* @__PURE__ */ jsx("p", { className: "font-display text-4xl sm:text-5xl", style: { color: "var(--amber-light)" }, children: fmtCurrency(result.monthlyPayment) }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs opacity-50 mt-1 font-mono", children: [
            result.years,
            " year loan at ",
            result.rate,
            "%"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "result-card animate-fade-up afd-1", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs opacity-50 mb-1", children: "Loan Amount" }),
            /* @__PURE__ */ jsx("p", { className: "font-mono text-xl font-medium text-[var(--amber-light)]", children: fmtCurrency(result.loanAmount) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "result-card animate-fade-up afd-1", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs opacity-50 mb-1", children: "Total Interest" }),
            /* @__PURE__ */ jsx("p", { className: "font-mono text-xl font-medium text-[var(--amber-light)]", children: fmtCurrency(result.totalInterest) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "result-card flex items-center justify-between animate-fade-up afd-2", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm opacity-70", children: "Purchase Price" }),
            /* @__PURE__ */ jsx("span", { className: "font-mono font-medium", children: fmtCurrency(parseFloat(purchasePrice)) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "result-card flex items-center justify-between animate-fade-up afd-2", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm opacity-70", children: "Deposit Paid" }),
            /* @__PURE__ */ jsxs("span", { className: "font-mono font-medium text-[var(--amber-light)]", children: [
              "- ",
              fmtCurrency(parseFloat(deposit) || 0)
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "result-card flex items-center justify-between animate-fade-up afd-3", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm opacity-70", children: "Loan Amount" }),
            /* @__PURE__ */ jsx("span", { className: "font-mono font-medium", children: fmtCurrency(result.loanAmount) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "result-card flex items-center justify-between animate-fade-up afd-3", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm opacity-70", children: "Total Interest" }),
            /* @__PURE__ */ jsx("span", { className: "font-mono font-medium", children: fmtCurrency(result.totalInterest) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "result-card flex items-center justify-between animate-fade-up afd-4", style: { borderColor: "var(--border-strong)" }, children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: "Total Cost of Property" }),
            /* @__PURE__ */ jsx("span", { className: "font-mono font-medium text-[var(--amber-light)] text-lg", children: fmtCurrency(result.totalPayment) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-xl p-4 text-xs", style: { background: "rgba(212,162,68,0.06)", border: "1px solid var(--border)" }, children: [
          /* @__PURE__ */ jsx("p", { className: "font-medium text-[var(--amber-light)] mb-1", children: "Important Notice" }),
          /* @__PURE__ */ jsx("p", { className: "opacity-70 leading-relaxed", children: "This is an estimate. Actual repayments may include initiation fees, bond registration costs, and life insurance. Total interest shown does not include these additional costs." })
        ] })
      ] }, calcKey) })
    ] }) }),
    /* @__PURE__ */ jsx("footer", { className: "mt-auto border-t px-4 sm:px-8 py-6 no-print", style: { borderColor: "var(--border)" }, children: /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsx("p", { className: "text-xs opacity-40 max-w-sm leading-relaxed", children: "This calculator provides estimates for educational purposes only. Consult a mortgage originator or bank for official quotation." }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 text-xs opacity-40", children: [
        /* @__PURE__ */ jsx("a", { href: "/faq", className: "hover:opacity-70", children: "FAQ" }),
        /* @__PURE__ */ jsx("a", { href: "/about", className: "hover:opacity-70", children: "About" })
      ] })
    ] }) })
  ] });
}
const SplitComponent = HomeLoanCalculator;
export {
  SplitComponent as component
};
