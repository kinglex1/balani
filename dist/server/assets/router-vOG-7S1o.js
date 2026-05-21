import { createRootRoute, HeadContent, Scripts, createFileRoute, lazyRouteComponent, createRouter as createRouter$1 } from "@tanstack/react-router";
import { jsxs, jsx } from "react/jsx-runtime";
const Route$7 = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "SARS Income Tax Calculator 2026 | CalcZA — Free SA Tax Tools" },
      {
        name: "description",
        content: "Free South African income tax calculator for the 2025/2026 SARS tax year. Instantly calculate PAYE, effective rate, rebates, UIF, and medical aid credits. No sign-up required."
      },
      { name: "keywords", content: "SARS tax calculator, South Africa income tax 2026, PAYE calculator, SA tax bracket 2025/2026, CalcZA" },
      { name: "author", content: "CalcZA" },
      { name: "theme-color", content: "#0d3320" },
      { property: "og:title", content: "SARS Income Tax Calculator 2026 | CalcZA" },
      {
        property: "og:description",
        content: "Free, accurate PAYE calculator for South Africa. 2025/2026 tax year. Includes rebates, UIF, and medical credits."
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" }
    ],
    links: [
      { rel: "canonical", href: "https://calcza.co.za" }
    ]
  }),
  shellComponent: RootDocument
});
function RootDocument({ children }) {
  return /* @__PURE__ */ jsxs("html", { lang: "en-ZA", children: [
    /* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
const $$splitComponentImporter$6 = () => import("./student-loan-BFNfC0zF.js");
const Route$6 = createFileRoute("/student-loan")({
  component: lazyRouteComponent($$splitComponentImporter$6, "component"),
  head: () => ({
    meta: [{
      title: "Student Loan Calculator | CalcZA - NSFAS & Bursary Calculator"
    }, {
      name: "description",
      content: "Calculate your South African student loan repayments. See how much your NSFAS or university bursary will cost after graduation."
    }, {
      name: "keywords",
      content: "student loan calculator South Africa, NSFAS calculator, bursary calculator, study loan"
    }]
  })
});
const $$splitComponentImporter$5 = () => import("./investment-DgYXkJSf.js");
const Route$5 = createFileRoute("/investment")({
  component: lazyRouteComponent($$splitComponentImporter$5, "component"),
  head: () => ({
    meta: [{
      title: "Investment Returns Calculator | CalcZA - Unit Trust & RA Calculator"
    }, {
      name: "description",
      content: "Calculate potential investment returns in South Africa. See how your money could grow with unit trusts, retirement annuities, and other investments."
    }, {
      name: "keywords",
      content: "investment calculator South Africa, unit trust returns, retirement annuity calculator, investment growth"
    }]
  })
});
const $$splitComponentImporter$4 = () => import("./interest-Yf9yTQXe.js");
const Route$4 = createFileRoute("/interest")({
  component: lazyRouteComponent($$splitComponentImporter$4, "component"),
  head: () => ({
    meta: [{
      title: "Compound Interest Calculator | CalcZA - Free South African Financial Tools"
    }, {
      name: "description",
      content: "Calculate compound interest and investment growth in South Africa. See how your savings grow with regular contributions and different compounding periods."
    }, {
      name: "keywords",
      content: "compound interest calculator South Africa, investment growth, savings calculator, CalcZA"
    }]
  })
});
const $$splitComponentImporter$3 = () => import("./home-loan-3RUYwbr1.js");
const Route$3 = createFileRoute("/home-loan")({
  component: lazyRouteComponent($$splitComponentImporter$3, "component"),
  head: () => ({
    meta: [{
      title: "Home Loan Calculator | CalcZA - South African Bond Calculator"
    }, {
      name: "description",
      content: "Calculate your South African home loan (bond) monthly repayments. See how much property you can afford with our free mortgage calculator."
    }, {
      name: "keywords",
      content: "home loan calculator South Africa, bond calculator, mortgage calculator, property affordability"
    }]
  })
});
const $$splitComponentImporter$2 = () => import("./faq-C4o-_qiF.js");
const Route$2 = createFileRoute("/faq")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component"),
  head: () => ({
    meta: [{
      title: "FAQ | CalcZA - Frequently Asked Questions"
    }, {
      name: "description",
      content: "Find answers to frequently asked questions about South African taxes, investments, home loans, and student loans. Learn how CalcZA calculators work."
    }, {
      name: "keywords",
      content: "South Africa tax FAQ, finance calculator questions, student loan FAQ, CalcZA help"
    }]
  })
});
const $$splitComponentImporter$1 = () => import("./about-Dh7H2ecQ.js");
const Route$1 = createFileRoute("/about")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component"),
  head: () => ({
    meta: [{
      title: "About | CalcZA - Free South African Financial Calculators"
    }, {
      name: "description",
      content: "Learn about CalcZA - free, accurate financial calculators for South Africans. Calculate taxes, investments, home loans, and student loans."
    }, {
      name: "keywords",
      content: "about CalcZA, South Africa calculators, free financial tools"
    }]
  })
});
const $$splitComponentImporter = () => import("./index-XIHoaIH1.js");
const Route = createFileRoute("/")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const StudentLoanRoute = Route$6.update({
  id: "/student-loan",
  path: "/student-loan",
  getParentRoute: () => Route$7
});
const InvestmentRoute = Route$5.update({
  id: "/investment",
  path: "/investment",
  getParentRoute: () => Route$7
});
const InterestRoute = Route$4.update({
  id: "/interest",
  path: "/interest",
  getParentRoute: () => Route$7
});
const HomeLoanRoute = Route$3.update({
  id: "/home-loan",
  path: "/home-loan",
  getParentRoute: () => Route$7
});
const FaqRoute = Route$2.update({
  id: "/faq",
  path: "/faq",
  getParentRoute: () => Route$7
});
const AboutRoute = Route$1.update({
  id: "/about",
  path: "/about",
  getParentRoute: () => Route$7
});
const IndexRoute = Route.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$7
});
const rootRouteChildren = {
  IndexRoute,
  AboutRoute,
  FaqRoute,
  HomeLoanRoute,
  InterestRoute,
  InvestmentRoute,
  StudentLoanRoute
};
const routeTree = Route$7._addFileChildren(rootRouteChildren)._addFileTypes();
const router = createRouter$1({
  routeTree,
  scrollRestoration: true,
  defaultPreloadStaleTime: 0
});
const { getRouter, createRouter } = {
  getRouter: () => router,
  createRouter
};
export {
  createRouter,
  getRouter
};
