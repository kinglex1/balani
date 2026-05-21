import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useId, useCallback } from "react";
const TAX_BRACKETS = [
  { min: 0, max: 237100, base: 0, rate: 0.18 },
  { min: 237101, max: 370500, base: 42678, rate: 0.26 },
  { min: 370501, max: 512800, base: 77362, rate: 0.31 },
  { min: 512801, max: 673e3, base: 121475, rate: 0.36 },
  { min: 673001, max: 857900, base: 179147, rate: 0.39 },
  { min: 857901, max: 1817e3, base: 251258, rate: 0.41 },
  { min: 1817001, max: Infinity, base: 644489, rate: 0.45 }
];
const REBATES = {
  primary: 17235,
  secondary: 9444,
  // 65+
  tertiary: 3145
  // 75+
};
const MEDICAL_CREDITS = {
  firstTwo: 364,
  // per month, per member (first 2)
  additional: 246
  // per month, per additional member
};
function calculateTax(grossAnnual, ageGroup, medicalAids, period) {
  const income = period === "monthly" ? grossAnnual * 12 : grossAnnual;
  let grossTax = 0;
  let activeBracketIndex = 0;
  let marginalRate = 0.18;
  TAX_BRACKETS.map((bracket, i) => {
    let taxInBracket = 0;
    if (income >= bracket.min) {
      const taxableInBracket = Math.min(income, bracket.max === Infinity ? income : bracket.max) - bracket.min + 1;
      if (taxableInBracket > 0) {
        taxInBracket = bracket.base === 0 && i === 0 ? taxableInBracket * bracket.rate : income > bracket.min ? (Math.min(income, bracket.max === Infinity ? income : bracket.max) - bracket.min + 1) * bracket.rate : 0;
        activeBracketIndex = i;
        marginalRate = bracket.rate;
      }
    }
    return { bracket, taxInBracket };
  });
  const activeBracket = TAX_BRACKETS.findIndex((b, i) => {
    return income >= b.min && (b.max === Infinity || income <= b.max);
  });
  if (activeBracket >= 0) {
    const b = TAX_BRACKETS[activeBracket];
    grossTax = b.base + (income - b.min + (activeBracket === 0 ? 0 : 1)) * b.rate;
    activeBracketIndex = activeBracket;
    marginalRate = b.rate;
  }
  let totalRebates = REBATES.primary;
  if (ageGroup === "age65to74") totalRebates += REBATES.secondary;
  if (ageGroup === "age75plus") totalRebates += REBATES.secondary + REBATES.tertiary;
  const annualMedical = Math.max(0, medicalAids - 2) * MEDICAL_CREDITS.additional * 12 + Math.min(medicalAids, 2) * MEDICAL_CREDITS.firstTwo * 12;
  const medCredits = medicalAids > 0 ? annualMedical : 0;
  const netTax = Math.max(0, grossTax - totalRebates - medCredits);
  const uifMonthly = Math.min(income / 12 * 0.01, 177.12);
  const uifAnnual = uifMonthly * 12;
  const takeHome = income - netTax - uifAnnual;
  const effectiveRate = income > 0 ? netTax / income * 100 : 0;
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
      if (income < bracket.min) return { bracket, taxInBracket: 0 };
      const upperBound = bracket.max === Infinity ? income : Math.min(income, bracket.max);
      const amount = (upperBound - bracket.min + (i === 0 ? 0 : 1)) * bracket.rate;
      return { bracket, taxInBracket: Math.max(0, amount) };
    })
  };
}
function fmt(n, decimals = 0) {
  return new Intl.NumberFormat("en-ZA", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(n);
}
function fmtCurrency(n) {
  return `R ${fmt(n)}`;
}
function InfoBadge({ text }) {
  return /* @__PURE__ */ jsx(
    "span",
    {
      title: text,
      className: "tooltip-trigger ml-1",
      "aria-label": text,
      children: "i"
    }
  );
}
function ResultRow({
  label,
  value,
  highlight = false,
  muted = false,
  info,
  animClass = ""
}) {
  return /* @__PURE__ */ jsxs("div", { className: `result-card flex items-center justify-between gap-4 animate-fade-up ${animClass}`, children: [
    /* @__PURE__ */ jsxs("div", { className: `text-sm ${muted ? "opacity-60" : ""}`, children: [
      label,
      info && /* @__PURE__ */ jsx(InfoBadge, { text: info })
    ] }),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: `font-mono text-right font-medium ${highlight ? "text-[var(--amber-light)] text-lg" : muted ? "opacity-60 text-sm" : ""}`,
        children: value
      }
    )
  ] });
}
function TaxBar({ label, value, total, color }) {
  const pct = total > 0 ? Math.min(100, value / total * 100) : 0;
  return /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center text-sm", children: [
      /* @__PURE__ */ jsx("span", { className: "opacity-70", children: label }),
      /* @__PURE__ */ jsxs("span", { className: "font-mono text-xs opacity-80", children: [
        fmt(pct, 1),
        "%"
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "tax-bar-track", children: /* @__PURE__ */ jsx(
      "div",
      {
        className: "tax-bar-fill",
        style: { width: `${pct}%`, background: color }
      }
    ) })
  ] });
}
function SARSTaxCalculator() {
  const [income, setIncome] = useState("");
  const [period, setPeriod] = useState("annual");
  const [ageGroup, setAgeGroup] = useState("under65");
  const [medAids, setMedAids] = useState("0");
  const [result, setResult] = useState(null);
  const [showBrackets, setShowBrackets] = useState(false);
  const [calcKey, setCalcKey] = useState(0);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const inputId = useId();
  const handleCalculate = useCallback(() => {
    const raw = parseFloat(income.replace(/[^\d.]/g, ""));
    if (!raw || raw <= 0) return;
    const res = calculateTax(raw, ageGroup, parseInt(medAids) || 0, period);
    setResult(res);
    setCalcKey((k) => k + 1);
    setShowBrackets(false);
  }, [income, period, ageGroup, medAids]);
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
        /* @__PURE__ */ jsx("a", { href: "/", className: "nav-link active", style: { color: "var(--amber-light)", borderBottomColor: "rgba(212,162,68,0.4)" }, children: "Tax" }),
        /* @__PURE__ */ jsx("a", { href: "/interest", className: "nav-link", children: "Finance" }),
        /* @__PURE__ */ jsx("a", { href: "/student-loan", className: "nav-link", children: "Education" }),
        /* @__PURE__ */ jsx("a", { href: "/faq", className: "nav-link", children: "FAQ" })
      ] }),
      /* @__PURE__ */ jsx("button", { className: "sm:hidden p-2 rounded-lg hover:bg-white/10", onClick: () => setMobileNavOpen(true), "aria-label": "Open menu", children: /* @__PURE__ */ jsx("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", children: /* @__PURE__ */ jsx("path", { d: "M3 12H21M3 6H21M3 18H21", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" }) }) })
    ] }) }),
    mobileNavOpen && /* @__PURE__ */ jsx("div", { className: "mobile-nav-overlay no-print", onClick: () => setMobileNavOpen(false) }),
    /* @__PURE__ */ jsx("div", { className: `fixed top-0 right-0 h-full w-72 max-w-[85vw] z-50 transform transition-transform duration-300 no-print ${mobileNavOpen ? "translate-x-0" : "translate-x-full"}`, style: { background: "var(--forest-mid)" }, children: /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-8", children: [
        /* @__PURE__ */ jsx("span", { className: "font-display text-lg text-[var(--cream)]", children: "Menu" }),
        /* @__PURE__ */ jsx("button", { onClick: () => setMobileNavOpen(false), className: "p-2 rounded-lg hover:bg-white/10", "aria-label": "Close menu", children: /* @__PURE__ */ jsx("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", children: /* @__PURE__ */ jsx("path", { d: "M18 6L6 18M6 6L18 18", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" }) }) })
      ] }),
      /* @__PURE__ */ jsxs("nav", { className: "space-y-1", children: [
        /* @__PURE__ */ jsx("a", { href: "/", onClick: () => setMobileNavOpen(false), className: "block py-3 px-4 rounded-lg text-sm font-medium nav-link active", children: "Tax" }),
        /* @__PURE__ */ jsx("a", { href: "/interest", onClick: () => setMobileNavOpen(false), className: "block py-3 px-4 rounded-lg text-sm font-medium nav-link", children: "Finance" }),
        /* @__PURE__ */ jsx("a", { href: "/home-loan", onClick: () => setMobileNavOpen(false), className: "block py-3 px-4 rounded-lg text-sm font-medium nav-link", children: "Home Loan" }),
        /* @__PURE__ */ jsx("a", { href: "/investment", onClick: () => setMobileNavOpen(false), className: "block py-3 px-4 rounded-lg text-sm font-medium nav-link", children: "Investment" }),
        /* @__PURE__ */ jsx("a", { href: "/student-loan", onClick: () => setMobileNavOpen(false), className: "block py-3 px-4 rounded-lg text-sm font-medium nav-link", children: "Student Loan" }),
        /* @__PURE__ */ jsx("a", { href: "/faq", onClick: () => setMobileNavOpen(false), className: "block py-3 px-4 rounded-lg text-sm font-medium nav-link", children: "FAQ" }),
        /* @__PURE__ */ jsx("a", { href: "/about", onClick: () => setMobileNavOpen(false), className: "block py-3 px-4 rounded-lg text-sm font-medium nav-link", children: "About" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "px-4 sm:px-8 pt-10 pb-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2 mb-5", children: [
        /* @__PURE__ */ jsxs("span", { className: "tool-chip active", children: [
          /* @__PURE__ */ jsx("svg", { width: "10", height: "10", viewBox: "0 0 10 10", fill: "none", children: /* @__PURE__ */ jsx("circle", { cx: "5", cy: "5", r: "4", fill: "var(--amber)" }) }),
          "SARS 2025/2026"
        ] }),
        /* @__PURE__ */ jsx("span", { className: "tool-chip", children: "Free" }),
        /* @__PURE__ */ jsx("span", { className: "tool-chip", children: "No sign-up" })
      ] }),
      /* @__PURE__ */ jsxs("h1", { className: "font-display text-3xl sm:text-4xl lg:text-5xl leading-tight mb-3", style: { fontStyle: "normal" }, children: [
        "South African",
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("span", { style: { color: "var(--amber-light)" }, children: "Income Tax" }),
        " Calculator"
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-sm opacity-60 max-w-lg leading-relaxed", children: "Accurate PAYE estimates for the 2025/2026 tax year. Includes rebates, UIF, and medical tax credits. Not financial advice." })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "px-4 sm:px-8 pb-16 flex-1", children: /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "rounded-2xl p-6 space-y-5",
            style: { background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)" },
            children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxs("label", { htmlFor: `${inputId}-income`, className: "text-sm font-medium flex items-center gap-1.5", children: [
                  "Gross Income",
                  /* @__PURE__ */ jsx(InfoBadge, { text: "Your total income before any deductions or tax." })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsx(
                    "span",
                    {
                      className: "absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm opacity-50 pointer-events-none",
                      children: "R"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      id: `${inputId}-income`,
                      type: "number",
                      className: "tax-input pl-7",
                      placeholder: "e.g. 450000",
                      value: income,
                      onChange: (e) => setIncome(e.target.value),
                      onKeyDown: handleKeyDown,
                      min: "0",
                      step: "1000",
                      "aria-label": "Gross income in Rands"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: "Income Period" }),
                /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-2", children: ["annual", "monthly"].map((p) => /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setPeriod(p),
                    className: "py-2.5 px-3 rounded-lg text-sm font-medium transition-all",
                    style: {
                      background: period === p ? "rgba(212, 162, 68, 0.18)" : "rgba(255,255,255,0.04)",
                      border: `1.5px solid ${period === p ? "rgba(212,162,68,0.5)" : "var(--border-strong)"}`,
                      color: period === p ? "var(--amber-light)" : "var(--cream)"
                    },
                    children: p === "annual" ? "Annual" : "Monthly"
                  },
                  p
                )) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxs("label", { htmlFor: `${inputId}-age`, className: "text-sm font-medium flex items-center gap-1.5", children: [
                  "Age Group",
                  /* @__PURE__ */ jsx(InfoBadge, { text: "Your age determines which rebates you qualify for." })
                ] }),
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    id: `${inputId}-age`,
                    className: "tax-select",
                    value: ageGroup,
                    onChange: (e) => setAgeGroup(e.target.value),
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "under65", children: "Under 65" }),
                      /* @__PURE__ */ jsx("option", { value: "age65to74", children: "65 – 74" }),
                      /* @__PURE__ */ jsx("option", { value: "age75plus", children: "75 and older" })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxs("label", { htmlFor: `${inputId}-med`, className: "text-sm font-medium flex items-center gap-1.5", children: [
                  "Medical Aid Dependants",
                  /* @__PURE__ */ jsx(InfoBadge, { text: "Total members on your medical aid (including yourself). First two earn R364/month credit each; R246/month for each additional member." })
                ] }),
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    id: `${inputId}-med`,
                    className: "tax-select",
                    value: medAids,
                    onChange: (e) => setMedAids(e.target.value),
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "0", children: "None" }),
                      [1, 2, 3, 4, 5, 6, 7, 8].map((n) => /* @__PURE__ */ jsxs("option", { value: n, children: [
                        n,
                        " member",
                        n > 1 ? "s" : ""
                      ] }, n))
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
                  disabled: !income,
                  style: { opacity: !income ? 0.55 : 1 },
                  children: "Calculate Tax"
                }
              )
            ]
          }
        ),
        result && /* @__PURE__ */ jsx("div", { className: "flex gap-3 no-print", children: /* @__PURE__ */ jsx("button", { type: "button", onClick: handlePrint, className: "flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all", style: { background: "rgba(255,255,255,0.04)", border: "1.5px solid var(--border-strong)", color: "var(--cream)" }, children: "Print" }) }),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "rounded-xl p-4 text-xs space-y-1.5",
            style: { background: "rgba(212,162,68,0.06)", border: "1px solid var(--border)" },
            children: [
              /* @__PURE__ */ jsx("p", { className: "font-medium text-[var(--amber-light)] mb-2 text-xs tracking-wide uppercase", children: "2025/2026 Tax-Free Thresholds" }),
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between opacity-70", children: [
                /* @__PURE__ */ jsx("span", { children: "Under 65" }),
                /* @__PURE__ */ jsx("span", { className: "font-mono", children: "R 95,750" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between opacity-70", children: [
                /* @__PURE__ */ jsx("span", { children: "Age 65–74" }),
                /* @__PURE__ */ jsx("span", { className: "font-mono", children: "R 148,217" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between opacity-70", children: [
                /* @__PURE__ */ jsx("span", { children: "Age 75+" }),
                /* @__PURE__ */ jsx("span", { className: "font-mono", children: "R 165,689" })
              ] })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-4", children: !result ? /* @__PURE__ */ jsxs(
        "div",
        {
          className: "rounded-2xl p-8 flex flex-col items-center justify-center text-center min-h-[320px] animate-scale-in",
          style: { background: "rgba(255,255,255,0.02)", border: "1px dashed var(--border-strong)" },
          children: [
            /* @__PURE__ */ jsxs("svg", { width: "40", height: "40", viewBox: "0 0 40 40", fill: "none", className: "mb-4 opacity-30", children: [
              /* @__PURE__ */ jsx("rect", { x: "6", y: "4", width: "28", height: "32", rx: "3", stroke: "var(--amber)", strokeWidth: "1.5" }),
              /* @__PURE__ */ jsx("line", { x1: "12", y1: "13", x2: "28", y2: "13", stroke: "var(--amber)", strokeWidth: "1.5", strokeLinecap: "round" }),
              /* @__PURE__ */ jsx("line", { x1: "12", y1: "20", x2: "28", y2: "20", stroke: "var(--amber)", strokeWidth: "1.5", strokeLinecap: "round" }),
              /* @__PURE__ */ jsx("line", { x1: "12", y1: "27", x2: "22", y2: "27", stroke: "var(--amber)", strokeWidth: "1.5", strokeLinecap: "round" })
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "text-sm opacity-50", children: [
              "Enter your income details and hit",
              /* @__PURE__ */ jsx("br", {}),
              "Calculate Tax to see your breakdown."
            ] })
          ]
        }
      ) : /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "rounded-2xl p-6 animate-fade-up",
            style: { background: "rgba(212,162,68,0.08)", border: "1px solid var(--border-strong)" },
            children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-widest opacity-60 mb-1 font-medium", children: "Annual Take-Home Pay" }),
              /* @__PURE__ */ jsx("p", { className: "font-display text-4xl sm:text-5xl", style: { color: "var(--amber-light)" }, children: fmtCurrency(result.takeHomePay) }),
              /* @__PURE__ */ jsxs("p", { className: "text-xs opacity-50 mt-1 font-mono", children: [
                fmtCurrency(result.takeHomePay / 12),
                " / month"
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "rounded-2xl p-5 space-y-3.5 animate-fade-up afd-1",
            style: { background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)" },
            children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-widest opacity-50 font-medium", children: "Breakdown of Gross Income" }),
              /* @__PURE__ */ jsx(
                TaxBar,
                {
                  label: "Take-Home Pay",
                  value: result.takeHomePay,
                  total: result.grossIncome,
                  color: "var(--amber)"
                }
              ),
              /* @__PURE__ */ jsx(
                TaxBar,
                {
                  label: "Income Tax (PAYE)",
                  value: result.netTax,
                  total: result.grossIncome,
                  color: "#6b9e7a"
                }
              ),
              /* @__PURE__ */ jsx(
                TaxBar,
                {
                  label: "UIF (Employee)",
                  value: result.uifEmployee,
                  total: result.grossIncome,
                  color: "#4a7a5a"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "result-card animate-fade-up afd-2", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs opacity-50 mb-1", children: "Effective Rate" }),
            /* @__PURE__ */ jsxs("p", { className: "font-mono text-2xl font-medium", style: { color: "var(--amber-light)" }, children: [
              fmt(result.effectiveRate, 2),
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "result-card animate-fade-up afd-2", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs opacity-50 mb-1", children: "Marginal Rate" }),
            /* @__PURE__ */ jsxs("p", { className: "font-mono text-2xl font-medium", style: { color: "var(--amber-light)" }, children: [
              fmt(result.marginalRate, 0),
              "%"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(
            ResultRow,
            {
              label: "Gross Income",
              value: fmtCurrency(result.grossIncome),
              animClass: "afd-3"
            }
          ),
          /* @__PURE__ */ jsx(
            ResultRow,
            {
              label: "Gross Tax (before rebates)",
              value: fmtCurrency(result.grossTax),
              animClass: "afd-3"
            }
          ),
          /* @__PURE__ */ jsx(
            ResultRow,
            {
              label: "Tax Rebates",
              value: `− ${fmtCurrency(result.rebates)}`,
              muted: true,
              info: `Primary rebate R${fmt(REBATES.primary)}${ageGroup !== "under65" ? ` + secondary R${fmt(REBATES.secondary)}` : ""}${ageGroup === "age75plus" ? ` + tertiary R${fmt(REBATES.tertiary)}` : ""}`,
              animClass: "afd-4"
            }
          ),
          result.medicalCredits > 0 && /* @__PURE__ */ jsx(
            ResultRow,
            {
              label: "Medical Aid Credits",
              value: `− ${fmtCurrency(result.medicalCredits)}`,
              muted: true,
              info: `${medAids} member${parseInt(medAids) > 1 ? "s" : ""} × monthly credits × 12`,
              animClass: "afd-4"
            }
          ),
          /* @__PURE__ */ jsx(
            ResultRow,
            {
              label: "Net Income Tax (PAYE)",
              value: fmtCurrency(result.netTax),
              highlight: true,
              animClass: "afd-5"
            }
          ),
          /* @__PURE__ */ jsx(
            ResultRow,
            {
              label: "UIF (Employee 1%)",
              value: `− ${fmtCurrency(result.uifEmployee)}`,
              muted: true,
              info: "Unemployment Insurance Fund: 1% of income, capped at R177.12/month.",
              animClass: "afd-5"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => setShowBrackets((s) => !s),
            className: "w-full rounded-xl py-3 px-4 text-sm font-medium flex items-center justify-between transition-all animate-fade-up afd-6",
            style: {
              background: showBrackets ? "rgba(212,162,68,0.08)" : "rgba(255,255,255,0.03)",
              border: "1px solid var(--border)",
              color: "var(--amber-light)"
            },
            children: [
              /* @__PURE__ */ jsx("span", { children: "Tax Bracket Breakdown" }),
              /* @__PURE__ */ jsx(
                "svg",
                {
                  width: "14",
                  height: "14",
                  viewBox: "0 0 14 14",
                  fill: "none",
                  style: { transform: showBrackets ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.25s" },
                  children: /* @__PURE__ */ jsx("path", { d: "M2 5L7 10L12 5", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" })
                }
              )
            ]
          }
        ),
        showBrackets && /* @__PURE__ */ jsxs(
          "div",
          {
            className: "rounded-2xl p-5 animate-scale-in",
            style: { background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)" },
            children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-widest opacity-50 font-medium mb-4", children: "2025/2026 SARS Brackets" }),
              /* @__PURE__ */ jsx("div", { className: "space-y-1", children: TAX_BRACKETS.map((bracket, i) => {
                const isActive = i === result.activeBracketIndex;
                const maxLabel = bracket.max === Infinity ? "and above" : `– R${fmt(bracket.max)}`;
                return /* @__PURE__ */ jsxs("div", { className: `bracket-row ${isActive ? "active-bracket" : ""}`, children: [
                  /* @__PURE__ */ jsxs("span", { className: `text-xs ${isActive ? "font-medium" : "opacity-60"}`, children: [
                    "R",
                    fmt(bracket.min),
                    " ",
                    maxLabel
                  ] }),
                  /* @__PURE__ */ jsxs("span", { className: `font-mono text-xs ${isActive ? "text-[var(--amber-light)]" : "opacity-50"}`, children: [
                    Math.round(bracket.rate * 100),
                    "%"
                  ] }),
                  isActive && /* @__PURE__ */ jsx(
                    "span",
                    {
                      className: "text-xs px-1.5 py-0.5 rounded font-medium",
                      style: { background: "rgba(212,162,68,0.2)", color: "var(--amber)" },
                      children: "You"
                    }
                  )
                ] }, i);
              }) }),
              /* @__PURE__ */ jsx("p", { className: "text-xs opacity-40 mt-4 leading-relaxed", children: "South Africa uses a progressive tax system. You only pay the higher rate on income above each bracket's threshold." })
            ]
          }
        )
      ] }, calcKey) })
    ] }) }),
    /* @__PURE__ */ jsx(
      "footer",
      {
        className: "mt-auto border-t px-4 sm:px-8 py-6",
        style: { borderColor: "var(--border)" },
        children: /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3", children: [
          /* @__PURE__ */ jsxs("p", { className: "text-xs opacity-40 max-w-sm leading-relaxed", children: [
            "Results are estimates only. For official SARS guidance visit",
            " ",
            /* @__PURE__ */ jsx("span", { className: "underline", style: { color: "var(--amber)" }, children: "sars.gov.za" }),
            ". CalcZA is not affiliated with SARS or the South African government."
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 text-xs opacity-40", children: [
            /* @__PURE__ */ jsx("span", { children: "Tax Year: 2025/2026" }),
            /* @__PURE__ */ jsx("span", { className: "w-1 h-1 rounded-full bg-current" }),
            /* @__PURE__ */ jsx("span", { children: "Free & No Ads" })
          ] })
        ] })
      }
    )
  ] });
}
const SplitComponent = SARSTaxCalculator;
export {
  SplitComponent as component
};
