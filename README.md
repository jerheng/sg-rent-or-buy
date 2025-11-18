# SG Rent or Buy

https://sg-rent-or-buy.vercel.app/

An interactive Singapore-focused rent vs. buy simulator that helps homeowners and renters compare the long-term financial impact of purchasing a property versus renting. 

The app models cash requirements (CPF + cash), loan repayments, housing grants, stamp duties, CPF growth, investment returns, and rental cash flow so users can see which path builds more net worth over time.

Initial conclusion: BTO's are almost always going to help you build significantly more wealth over time relative to the alternatives of purchasing resales or private condos/landed housing options, based on current economic conditions (19/11/2025) in Singapore.

## Key Features

- **Scenario modeling**: Toggle between HDB BTO, HDB resale, and private condo flows with configurable prices, interest rates, and age constraints.
- **Stamp duty + CPF logic**: Calculates BSD, ABSD, rental stamp duty, and CPF usage limits that mirror Singapore regulations.
- **Cash flow + net worth charts**: Visualizes cumulative costs, CPF balances, savings, and investments for rent vs. buy over a chosen time horizon.
- **Persisted assumptions**: Automatically stores your latest inputs in localStorage for quick what-if iterations.
- **Modern UI stack**: Built with React 18, Vite, shadcn/ui, Radix primitives, TanStack Query, Tailwind CSS, and TypeScript.

## Getting Started

### Prerequisites

- Node.js **20.19.0+** (Vite 7 requires Node 20 LTS or newer)
- npm 10+ (ships with the required Node version)

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Vite serves the app on [http://localhost:8080](http://localhost:8080) by default (configured in `vite.config.ts`).

### Production Build

```bash
npm run build
```

The optimized assets will be output to `dist/`. Use `npm run preview` to test the production build locally if needed.
