# Multicommerce

Sell-Through Intelligence Layer for D2C Brands — a pitch product for Unicommerce.

## What it is

Multicommerce extends Unicommerce's visibility from the warehouse to the retail shelf. It tracks distributor sell-through ratios, generates AI-powered risk alerts, and provides a natural-language insights engine over the distribution network.

- **Root route** (`/`) — the full pitch page with slide deck carousel
- **Prototype route** (`/prototype`) — the live dashboard with 6 views and AI chat

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Requirements

Create a `.env.local` file with your Anthropic API key:

```
ANTHROPIC_API_KEY=sk-ant-...
```

The AI chat in the prototype calls `/api/chat` server-side — the key is never exposed to the browser.

## Tech stack

- Next.js 14 (App Router)
- TypeScript
- Recharts, Lucide React
- Anthropic SDK (`@anthropic-ai/sdk`)
- Deployed on Vercel with GitHub auto-deploy
