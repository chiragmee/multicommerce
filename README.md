# Multicommerce — Sell-Through Intelligence Layer

> A pitch product built for Unicommerce demonstrating how D2C brands can get shelf-level visibility across distributor networks.

**Live:** [multicommerce-app.vercel.app](https://multicommerce-app.vercel.app)

---

## The Problem

D2C brands using Unicommerce have good upstream visibility — but lose sight of inventory the moment it reaches the distributor. Sell-through ratios, retail shelf occupancy, and stockout risk are invisible until it's too late to act.

This prototype demonstrates what a Sell-Through Intelligence Layer would look like if built natively into Unicommerce.

---

## What It Does

### `/` — Pitch Page
A full slide-deck experience that frames the problem, the market opportunity, and the product proposal for Unicommerce stakeholders.

### `/prototype` — Live Dashboard
An interactive prototype with 6 operational views:
- **Overview** — Sell-through ratios across the distributor network at a glance
- **Distributor Drill-down** — Per-distributor performance, stock levels, and velocity
- **Risk Alerts** — AI-flagged stockout risks, slow movers, and shelf gaps
- **SKU Performance** — Sales velocity and replenishment signals per SKU
- **AI Insights Chat** — Natural language query over the distribution network ("Which distributors in Maharashtra are underperforming on SKU X?")
- **Reports** — Export-ready summaries by region, distributor, or SKU

---

## Why It Was Built This Way

The pitch uses a dual-track structure — a narrative pitch page + a live prototype — because telling is weaker than showing. The prototype lets stakeholders interact with the actual UX rather than imagining it from a slide.

The AI chat demonstrates the highest-value use case: unstructured querying over complex distributor data without needing SQL or navigating multiple dashboards.

---

## Tech Stack

| | |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Charts | Recharts |
| Icons | Lucide React |
| AI Chat | Anthropic Claude (via `/api/chat` — server-side, key never exposed to browser) |
| Deployment | Vercel |

---

## Running Locally

### Prerequisites
- Node.js 18+
- An [Anthropic](https://anthropic.com) API key (for the AI chat in `/prototype`)

```bash
git clone https://github.com/chiragmee/multicommerce.git
cd multicommerce
npm install
```

Create a `.env.local` file:
```
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

```bash
npm run dev
```

- [http://localhost:3000](http://localhost:3000) — pitch page
- [http://localhost:3000/prototype](http://localhost:3000/prototype) — live dashboard

---

## Context

Built as part of a Unicommerce product pitch. The goal: demonstrate product thinking, UX design, and technical execution together — not just a deck.

---

## Author

Chirag Mewara · Product Manager · [chirag-mewara-portfolio.vercel.app](https://chirag-mewara-portfolio.vercel.app)
