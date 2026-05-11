# Multicommerce — Product Bible
## From Market Research to Working Product to Acquisition Pitch

> *A founder's end-to-end journey: identifying a ₹300 Crore blind spot in India's D2C distribution infrastructure, building a working intelligence platform on top of it, and pitching it to the CEO of the platform that needs it most.*

---

## Table of Contents

1. [The Market We Set Out to Understand](#1-the-market-we-set-out-to-understand)
2. [The Mamaearth Deep Dive — A Real Case Study](#2-the-mamaearth-deep-dive--a-real-case-study)
3. [Prioritised Nightmares — Where Money Actually Leaks](#3-prioritised-nightmares--where-money-actually-leaks)
4. [The NPD Prediction Model — Numbers-First](#4-the-npd-prediction-model--numbers-first)
5. [Why Unicommerce Doesn't Solve This](#5-why-unicommerce-doesnt-solve-this)
6. [The Real Challenges and Trade-offs](#6-the-real-challenges-and-trade-offs)
7. [What We Built — Phase 1: Multicommerce](#7-what-we-built--phase-1-multicommerce)
8. [The Pitch — CEO of Unicommerce Perspective](#8-the-pitch--ceo-of-unicommerce-perspective)
9. [Technical Architecture](#9-technical-architecture)
10. [Revenue Model and Market Sizing](#10-revenue-model-and-market-sizing)
11. [The Three Paths Forward](#11-the-three-paths-forward)
12. [What's Next](#12-whats-next)

---

## 1. The Market We Set Out to Understand

### The Space

India's D2C consumer market is one of the fastest-growing ecosystems in the world. The companies operating in it fall into distinct verticals:

- **Beauty and Personal Care:** Mamaearth (Honasa Consumer), Nykaa, The Derma Co, Aqualogica, Purplle, SUGAR Cosmetics, Plum, mCaffeine
- **Apparel:** Bewakoof, SNITCH, The Souled Store, Biba
- **Home and Lifestyle:** Wakefit, The Sleep Company, Pepperfry
- **Health and Wellness:** Oziva, Kapiva, Wellbeing Nutrition

### The End-to-End Business Model

Every D2C brand in this space runs on three interconnected loops:

```
FORMULATION / R&D
       ↓
CONTRACT MANUFACTURING
       ↓
INBOUND WAREHOUSING
       ↓
ORDER MANAGEMENT (Online + Offline)
       ↓
DISTRIBUTION (Marketplace + D2C + Offline Trade)
       ↓
RETURNS / REVERSE LOGISTICS
       ↓
NEW PRODUCT DEVELOPMENT (fed by all of the above)
```

### The Core Hypothesis

These companies have the data. They are not using it efficiently enough to make decisions. The day-to-day operational firefighting prevents them from stepping back and building intelligence on top of their own systems.

The result: **revenue leaks at every handoff point** — and nobody has a unified view of where.

---

## 2. The Mamaearth Deep Dive — A Real Case Study

### Company Structure

**Honasa Consumer Limited** is the parent entity operating six brands: Mamaearth (flagship), The Derma Co, Aqualogica, BBlunt, Dr. Sheth's, and Staze. As of FY25, Honasa is India's largest digital-first BPC company by revenue.

| Metric | Value |
|--------|-------|
| FY25 Revenue | ₹2,067 Crore |
| Q1 FY26 Revenue | ₹595 Crore |
| Contract Manufacturers | 37 |
| Warehouses | 9 |
| Monthly Dispatches | 3 million+ |
| Offline Distributors | 550+ |
| Pin Codes Covered | 18,000+ |
| Fulfillment Rate | 99.99% (via Unicommerce) |

**Critical structural fact:** Honasa does NOT manufacture its own products. All production is outsourced to 37 contract manufacturers. Until May 2024, it had zero in-house R&D — it acquired CosmoGenesis Labs (5,000+ formulations) for ₹4 crore to bring formulation capability partially in-house.

### The End-to-End Product Journey

**Stage 1 — Formulation and R&D**
Consumer insights come from online communities and trend tracking. Until the CosmoGenesis acquisition, formulation was fully outsourced to third-party labs. Ghazal Alagh (CIO) leads product innovation. In FY23, Honasa launched 5.7× more SKUs than the BPC industry median — a decision that caused significant downstream problems.

**Stage 2 — Contract Manufacturing**
37 manufacturers receive formulations and specifications from Honasa and produce at agreed MOQs. Raw material sourcing is split between manufacturers and Honasa directly. There is no real-time production visibility — no system tells Honasa "Manufacturer X has completed 40,000 units of SKU Y and will ship by Date Z." This is managed via email and phone calls.

**Stage 3 — Inbound Warehousing**
Products arrive at 9 regional warehouses managed via Unicommerce WMS. FIFO/FEFO is critical because cosmetics have shelf-life constraints. 8.7 million+ units tracked in real time.

**Stage 4 — Order Processing**
Orders arrive from Mamaearth.com, Amazon, Flipkart, Nykaa, Firstcry, and 100,000+ offline retail points. Unicommerce centralises all order management. Monthly dispatches exceed 3 million with 99.99% fulfillment accuracy.

**Stage 5 — Distribution**
- Online (65% of revenue): fulfilled from regional warehouses via logistics partners
- Offline (35% of revenue): ~550 distributors across India on 30-day credit terms

**Stage 6 — Returns and Reverse Logistics**
COD orders carry 25-30% return rates industry-wide. Returns are processed through Unicommerce's returns module, but visibility into *why* returns happen and the quality of returned goods is limited.

### What Unicommerce Solved

Unicommerce was deployed around 2021-22 when Mamaearth's prior system "started to break" under rapid growth, causing data inconsistencies.

| Problem | Solution | Result |
|---------|----------|--------|
| Multi-channel order chaos | Centralised OMS | Single dashboard for all orders |
| Inventory inconsistency across warehouses | Real-time WMS sync | 8.7M+ units tracked accurately |
| Fulfillment errors | Barcode-driven WMS | 99.99% accuracy |
| B2B bulk orders | Bulk order creation with manual override | Up to 10,000 items per order |
| Regulatory compliance | Built-in e-invoicing and e-way bills | Seamless |
| Order growth | Scalable infrastructure | 144% order growth in 8 months |

**Unicommerce coverage estimate: 50-60% of Honasa's operational needs.**

---

## 3. Prioritised Nightmares — Where Money Actually Leaks

After mapping the full operational cycle, these are the top two nightmares in each function ranked by **impact × urgency × feasibility to solve:**

### Manufacturing

**M1 — Zero visibility into contract manufacturer output**
With 37 manufacturers, Honasa has no unified dashboard showing production status, batch completion, quality results, or shipping timelines. Production planning runs on purchase orders, email, and phone calls — not connected to demand signals. Estimated revenue impact: ₹50-80 Crore/year in delayed launches, stockouts, and write-offs.

**M2 — SKU proliferation without efficiency analysis**
Honasa launched 5.7× industry median SKUs in FY23. Varun Alagh admitted in Q2 FY25 earnings: *"We have gone too wide and need to narrow our focus."* Each failed SKU costs ₹38L-98L in direct waste (formulation + testing + production + packaging + marketing). At 30% failure rate across 50+ annual launches: ₹5.7-14.7 Crore in direct waste per year.

### Distribution

**D1 — No primary-to-secondary sales tracking (THE defining crisis)**
This is the largest single revenue leakage event in Indian D2C history. Honasa tracked what left their warehouse (primary sales) but had zero visibility into what distributors were actually selling to retail (secondary sales). The gap accumulated silently for 6+ months.

- Distributor burden: ₹300 Crore
- Stock returns absorbed: ₹100+ Crore
- Q2 FY25 net loss: ₹19 Crore (first post-IPO loss)
- Revenue drop: 7% to ₹462 Crore
- Distributors affected: 200+
- Stock crash: ₹440 → ₹260

**D2 — COD dependency and RTO-driven cash flow drain**
Industry data: 15-20% of D2C revenue lost through payment failures and COD returns. For Honasa's online revenue of ~₹1,344 Crore, at 5% RTO rate: ₹18 Crore/year in double logistics cost alone. Each RTO costs ₹80-150 in reverse logistics.

### New Product Development

**N1 — No data-driven NPD decision framework**
When deciding to launch a new product, Honasa relies on consumer community feedback, trend tracking, and instinct. No system ingests past launch performance, market size estimation, competitive landscape, cannibalisation risk, and manufacturing feasibility to produce a structured recommendation. New products contributed 9% of Q1 FY26 revenue (₹53.5 Crore). A 20% improvement in NPD success rate = ₹10-15 Crore incremental quarterly revenue.

**N2 — Cross-brand and intra-brand cannibalisation**
With 6 brands and 500+ SKUs, new launches routinely eat into existing product sales. Mamaearth's Vitamin C Face Wash competes with its own Rice Water Face Wash. The Derma Co's Niacinamide Serum competes with Mamaearth's Skin Correct Serum. Estimated cannibalisation: 3-5% of what should be incremental revenue. On ₹2,067 Crore FY25 revenue: ₹62-103 Crore annually.

---

## 4. The NPD Prediction Model — Numbers-First

### Identifying the White Space

Using Unicommerce API data and marketplace APIs, the model identifies:

**Data inputs required:**

| Data Point | Source | API Endpoint | Use |
|-----------|--------|-------------|-----|
| SKU-level sales velocity | Unicommerce | `GET /orders` | Demand signals by geography |
| Return rates by SKU | Unicommerce | `GET /return` | Quality/expectation mismatch |
| Inventory turnover | Unicommerce | `GET /inventory-snapshot` | Dead stock vs. fast movers |
| Product reviews | Amazon SP-API, Nykaa | Reviews endpoint | Sentiment analysis |
| Search trends | Google Trends API | Interest over time | Ingredient trend validation |
| Channel margin data | Unicommerce | `GET /products` | True margin per SKU per channel |
| Customer cohort overlap | Unicommerce | `GET /orders` → customer IDs | Cannibalisation signals |

### Example: Pigmentation Control Regimen Launch

**White space identified:** Mamaearth has no dedicated anti-pigmentation regimen bundle targeting ₹600-900 combo price. Trending ingredients: Alpha Arbutin (+180% YoY search), Kojic Acid (+120% YoY).

**Formulation decision:**
- Face Wash (100ml): 1% Kojic Acid + Liquorice Root + 2% Niacinamide
- Serum (30ml): 2% Alpha Arbutin + 1% Kojic Acid + Hyaluronic Acid
- Day Cream SPF30 (50g): 5% Niacinamide + 1% Alpha Arbutin + SPF30

**Manufacturer selection criteria:** Historical on-time delivery rate >95%, active ingredient expertise, MOQ compatibility, lead time reliability.

**Turnaround timeline:**

| Phase | Duration |
|-------|----------|
| Formulation validation (CosmoGenesis in-house) | 2 weeks |
| Accelerated stability testing | 4-6 weeks |
| Regulatory (CDSCO) | 2-4 weeks (parallel) |
| Pilot batch (5,000-10,000 units) | 2-3 weeks |
| Market test (3 cities, D2C only) | 4 weeks |
| Full production ramp (50,000+ units/SKU) | 6-8 weeks |
| **Total: Concept to Full Launch** | **16-22 weeks** |

**Revenue projection (cannibalisation-adjusted):**

| Scenario | Annual Revenue | Net New (after cannibalisation) |
|----------|---------------|--------------------------------|
| Conservative | ₹43.2 Crore | ₹32-37 Crore |
| Base Case | ₹94.8 Crore | ₹71-81 Crore |
| Optimistic | ₹188.4 Crore | ₹141-160 Crore |

### The Lifecycle Tracking Ratios

For every 10,000 units produced, the model tracks every handoff:

```
MANUFACTURED:     10,000 units
       ↓ 98% QC pass rate
WAREHOUSED:        9,800 units
       ↓ 99% fill rate
ORDERS FULFILLED:  9,702 units
       ↓ 88% first-attempt delivery
DELIVERED:         9,411 units
       ↓
RTO:                 291 units (3% target)
  → Repackaged:      218 units (75% of RTO)
  → Disposed:         44 units (15% of RTO)
  → QC Hold:          29 units (10% of RTO)

NET MONETISED: 9,629 units (96.3% recovery rate)
SYSTEM LOSS:     371 units (3.7%)
```

**Key ratios to track at every handoff:**

| Handoff | Ratio | Target |
|---------|-------|--------|
| Manufacture → Inventory | Production-to-Plan | ≥95% |
| Manufacture → Inventory | Inbound QC Pass Rate | ≥98% |
| Inventory → Order | Fill Rate | ≥99% |
| Inventory → Order | Stockout Rate | ≤2% |
| Order → Delivery | First-Attempt Success | ≥85% |
| Order → Delivery | SLA Compliance | ≥92% |
| Delivery → RTO | Overall RTO Rate | ≤12% |
| Delivery → RTO | COD RTO Rate | ≤18% |
| RTO → Repackage | Repackage Rate | ≥75% |
| RTO → Dispose | Write-off Rate | ≤15% |

---

## 5. Why Unicommerce Doesn't Solve This

Unicommerce is fundamentally a **transaction processing engine.** Their architecture, team, and revenue model are built around processing order volume. They charge per order processed. Their incentive is to handle more transactions faster — not to tell a brand "you're shipping too much to this distributor."

**The structural gap:**

Unicommerce's customer is the brand. Their user is the brand's warehouse operations team. Secondary sales tracking requires an entirely different user — the distributor — who is not Unicommerce's customer, pays them nothing, has no contractual obligation to them, and in many cases is a trader who has never used SaaS software.

**What exists today:**

| Solution | For Whom | Distributor Tracking | Cost |
|----------|----------|---------------------|------|
| Bizom / FieldAssist | HUL, ITC, Dabur (5,000+ distributors) | Yes — full DMS | ₹20L-2Cr/year |
| Unicommerce | D2C brands (200-500 distributors) | None | ₹15-50K/month |
| Multicommerce | D2C brands (200-500 distributors) | Yes — purpose-built | ₹25-40K/month |

The gap is between enterprise DMS for large FMCG (too expensive and complex) and Unicommerce (nothing after shipment). That gap is where 7,500+ Unicommerce clients sit.

**Should Unicommerce solve it?** Yes — and they know it. Their own D2C Report 2026 explicitly calls out sell-through and RTO as the biggest client challenges. But building it internally would take 18+ months, require them to onboard distributors as a new user type, and distract from their core Uniware business. It is faster and cheaper to acquire.

---

## 6. The Real Challenges and Trade-offs

These are the honest, unfiltered challenges in building Multicommerce:

### Challenge 1 — Distributor Adoption
Distributors in India are not SaaS users. Many are family-run businesses using paper registers or basic Tally. Getting them to log daily sell-through requires either: (a) the brand mandating it as a condition of distribution, or (b) giving the distributor enough value that they want to use it.

**Solution:** Dead-simple mobile app — three fields: SKU, quantity, retailer. Brand mandates usage in distribution agreement. Distributor gets their own sell-through analytics in return, protecting them from being overstocked.

### Challenge 2 — Data Accuracy and Gaming
Distributors have incentives to misreport. Under-reporting makes them appear overstocked (hoping the brand will offer discounts). Over-reporting gets them more allocation of fast-moving SKUs.

**Solution:** Triangulate with Unicommerce shipment data and marketplace regional sales. AI anomaly detection flags when a distributor's reported secondary sales are inconsistent with the geography's marketplace performance.

### Challenge 3 — Incentive Misalignment
Some distributors actively benefit from holding excess stock — they take product on credit, delay payment, and earn interest on the working capital arbitrage. Distributor inventory transparency threatens this practice.

**Mitigation:** Frame value proposition around protecting distributors from expiry risk and damaged relationships with brands. The Mamaearth crisis hurt distributors far more than it helped them. Transparency protects both sides.

### Challenge 4 — Cold Start Problem
The AI layer needs historical data to generate reliable alerts. On Day 1 with a new brand, there is zero secondary sales history. Predictions are unreliable for the first 60-90 days.

**Solution:** Seed with Unicommerce's existing primary sales data as a baseline. Show raw tracking in weeks 1-8 with no AI claims. Activate AI alerts from week 9. The free pilot period covers this gap — the brand gets 90 days of value-building before paying.

### Challenge 5 — Competition Risk
Bizom, FieldAssist, and BeatRoute are not asleep. The moment D2C brands scaling offline becomes a visible enough market, they will build downmarket versions of their enterprise products.

**Window:** 18-24 months before they catch up. The defence is the AI intelligence layer — they are workflow tools, not prediction tools. But this defence only holds if the AI delivers measurably better outcomes.

### Challenge 6 — Integration Complexity
Every brand uses a slightly different tech stack. Unicommerce for some, EasyEcom for others, Ginesys for a few. The platform must be OMS-agnostic to scale.

**Trade-off:** Go deep with Unicommerce first (faster to market, smaller TAM) vs. build OMS-agnostic from Day 1 (slower to market, larger TAM). Recommended: start Unicommerce-native, abstract the integration layer in months 4-6.

### Challenge 7 — Pricing
Brands already pay ₹15,000-50,000/month for Unicommerce. Adding another ₹25,000-40,000/month requires immediate, visible ROI. The Mamaearth crisis is the clearest possible case study — but most brands haven't had their crisis yet. You're selling prevention.

**Solution:** 90-day free pilot. Show the sell-through ratio deteriorating in real time. Let the data make the sale.

---

## 7. What We Built — Phase 1: Multicommerce

### Product Overview

**Multicommerce** is a standalone distributor sell-through intelligence platform, built to be Unicommerce-adjacent (not dependent on it, integrates deeply with it, can also integrate with other OMS platforms).

**One-line definition:** The system that tracks what distributors actually sell to retail (secondary sales) and compares it against what the brand shipped (primary sales), flagging inventory buildup before it becomes a crisis.

### The Two Users

**User 1 — The Distributor (mobile-first)**
Receives stock from brand warehouses. Sells to retail outlets. Today, nobody tracks what they sell onward. The mobile app gives them three fields: SKU, quantity, retailer. Dead simple. The value for them: their own sell-through analytics, protection from being forced to hold unsellable stock.

**User 2 — The Brand Operations Team (web dashboard)**
Currently sees only what Unicommerce shows: what shipped out of their warehouse. Multicommerce adds the visibility layer showing what distributors are actually selling. The moment any distributor's inventory days cross 45, it turns amber. At 60 days, red. At 90 days — where Mamaearth's crisis hit — it should never reach there.

### The Five Core Modules

**1. Overview Dashboard**
The single screen that would have caught the ₹300 Crore crisis. Shows:
- Overall sell-through ratio (the one number that predicts crisis or health)
- Primary vs. secondary sales trend chart (the widening gap is the warning)
- Critical distributor count with drill-down
- Risk breakdown: Healthy / At Risk / Critical

**2. Distributor Health Table**
Every distributor ranked by risk score. Click any distributor for:
- Their sell-through ratio and inventory days
- Top SKUs and their individual performance
- AI-generated risk assessment with specific recommended actions
- Trend direction (improving / stable / declining)

**3. SKU Intelligence**
Product-level sell-through across the entire distributor network:
- Horizontal bar chart sorted worst-to-best (red bars need action)
- Dead stock risk classification per SKU
- Return rate correlation
- Identifies when a slowdown is product-specific vs. territory-specific

**4. Alerts and Actions**
Every alert generated by the AI engine includes:
- Severity level (Critical / Warning / Info)
- Specific distributor, region, and SKU
- Quantified metric (78 days inventory, ratio dropped 0.82→0.61)
- Recommended action (not generic advice — specific next steps)

**5. AI Insights Engine (Powered by Claude)**
Natural language query interface with full context of the distribution network. Ask: "Which distributors need attention this week?" or "What's causing the Maharashtra inventory buildup?" and receive data-backed, specific answers referencing actual distributor names and numbers.

### What the Dashboard Is Not

- Not a replacement for Unicommerce — it integrates with it
- Not a general BI tool — it is purpose-built for distribution intelligence
- Not a field force automation tool — that is a different category (FieldAssist, BeatRoute)
- Not a demand forecasting tool in Phase 1 — that is Phase 2

### The Build Sequence

**Phase 1 (Months 1-4): Distributor Sell-Through Tracker**
The wedge product. Simple distributor mobile app + brand intelligence dashboard. Proves the concept, starts collecting secondary sales data, generates the first AI alerts.

**Phase 2 (Months 4-8): Demand Forecasting Layer**
With 6+ months of real secondary sales data, build the demand forecasting model. Tell brands: "Your sunscreen is selling through 2× faster in Bangalore than Delhi — shift 30% of next production to South warehouses." This is where Unicommerce-adjacent intelligence becomes genuinely predictive.

**Phase 3 (Months 8-14): NPD Decision Engine**
The premium product. Launch confidence scores, cannibalisation analysis, TAM estimation from first-party customer data, post-launch scorecards, manufacturing feasibility assessments. Built entirely on the data foundation laid in Phases 1 and 2.

---

## 8. The Pitch — CEO of Unicommerce Perspective

### What Kapil Makhija Is Thinking

If I am sitting in that chair, my questions are:

1. Why should I care? What am I losing by not having this?
2. Who else is building it? How long do I have before a competitor offers this to my clients?
3. How does this fit my stated AI strategy for FY26-27?
4. What does the revenue actually look like and is it worth the acquisition price?
5. Can I see a working product, not just slides?

### Using His Own Words

Three direct quotes from Kapil Makhija's Q4 FY26 earnings call and product launches:

> *"Every layer of complexity strengthens our relevance."*

Brands now juggle 8-12 channels vs. 3-4 five years ago. Offline distribution — the fastest-growing channel — has zero intelligence layer in Unicommerce today.

> *"AI enables brands to reduce revenue leakage while improving customer experience."*

Unicommerce launched Catalyst for abandoned cart recovery. The larger leakage — ₹300 Crore at one client — happens in offline distribution where there is no product.

> *"We will look to acquire businesses with strong AI elements at reasonable valuations."*

Unicommerce acquired Shipway for last-mile intelligence. The next logical acquisition is distribution intelligence — extending Uniware from warehouse to retail shelf.

### The Cost of Inaction

EasyEcom or Vinculum builds this first. Their clients get distribution intelligence from a competitor. Unicommerce's switching costs weaken. Churn rises. The window to acquire the category is 18-24 months.

### The Pitch Deck — 13 Slides

| Slide | Title | Purpose |
|-------|-------|---------|
| 1 | ₹300 Crore | The hook — a number that gets attention |
| 2 | The Blind Spot | What Unicommerce sees vs. what disappears |
| 3 | Why Now — In Your Own Words | Makhija's own quotes used against him |
| 4 | The Market Reality | Data from UC's own D2C Report 2026 + client reviews |
| 5 | The Market Gap | Competitor table — nobody serves D2C brands going offline |
| 6 | Introducing Multicommerce | The product in four features |
| 7 | How It Works | Integration architecture — zero Unicommerce backend changes |
| 8 | Prototype: Overview Dashboard | Annotated mockup of the crisis-catching screen |
| 9 | Prototype: Distributor + AI | Annotated mockup of the intelligence and chat layers |
| 10 | The Hard Parts | Four challenges addressed head-on |
| 11 | Revenue Opportunity | ₹15Cr Year 1 → ₹108Cr Year 3, benchmarked to UC's own revenue |
| 12 | Three Paths Forward | Acquire / Partner / White-Label |
| 13 | The Ask | Pilot, API access, 60-day decision |

---

## 9. Technical Architecture

### Integration Layer

Multicommerce sits on top of Unicommerce — not inside it. No changes to Unicommerce's core backend are required.

```
┌─────────────────────────────────────────────────────────────┐
│                    BRAND DASHBOARD                          │
│         (Health · Distributors · SKU Intel · AI Chat)       │
└─────────────────────────────┬───────────────────────────────┘
                              │
┌─────────────────────────────▼───────────────────────────────┐
│               MULTICOMMERCE ENGINE                          │
│   Sell-through calculation · Anomaly detection              │
│   AI alert generation · Demand signal analysis              │
└──────────────┬──────────────────────────┬───────────────────┘
               │                          │
┌──────────────▼──────────┐  ┌───────────▼──────────────────┐
│   UNICOMMERCE APIs      │  │  DISTRIBUTOR MOBILE APP      │
│   GET /orders           │  │  (NEW — secondary sales)     │
│   GET /inventory-       │  │  Daily sell-through logging  │
│        snapshot         │  │  SKU · Qty · Retailer        │
│   GET /return           │  └──────────────────────────────┘
│   GET /products         │
└─────────────────────────┘
```

### Unicommerce API Endpoints Used

| Endpoint | Fields Used | Purpose |
|----------|------------|---------|
| `GET /orders` | `skuCode`, `facilityCode`, `orderDate`, `paymentMethod`, `sellingPrice`, `shippingAddress` | Sales velocity, channel mix, geography |
| `GET /inventory-snapshot` | `skuCode`, `inventory`, `blockedInventory`, per facility | Real-time stock levels, dead stock detection |
| `GET /return` | `skuCode`, `marketplaceReturnReason`, `putawayQcComment` | Return rates, quality correlation |
| `GET /products` | `listingPrice`, `mrp`, `netSellerPayable`, `commissionPercentage`, `logisticsCost` | True margin per channel |

### Additional Data Sources

| Source | Data | Use |
|--------|------|-----|
| Amazon SP-API | Reviews, BSR, search terms | NPD signal, sentiment |
| Flipkart Seller API | Order data, return reasons | Secondary market data |
| Nykaa Brand Portal | Category sales, reviews | BPC-specific consumer data |
| Google Trends API | Ingredient search volume | NPD formulation validation |
| Distributor Mobile App | Secondary sales | The missing data layer |

### AI Architecture

The AI layer is powered by Claude AI. It receives:
- 12 months of distributor sell-through data
- SKU-level performance across all channels
- Alert history and outcome tracking
- Regional demand patterns

It outputs:
- Natural language responses to operational queries
- Risk assessments per distributor with specific recommended actions
- Anomaly detection alerts before they become crises
- In Phase 3: Launch confidence scores for new product decisions

### Tech Stack

**Frontend:** React with Recharts for data visualisation. Tailwind-compatible utility classes. DM Sans font family.

**Brand Colors (Unicommerce-aligned):**
```
Teal (primary):     #0891B2
Teal Dark:          #065F73
Teal Light:         #E0F7FA
Navy (text):        #1E293B
Body Text:          #334155
Light Text:         #64748B
Dim Text:           #94A3B8
Border:             #E2E8F0
Background:         #F8FAFB
Card Background:    #FFFFFF
Red (critical):     #DC2626
Amber (warning):    #D97706
Green (healthy):    #059669
```

**AI Integration:** Anthropic Claude API (`claude-sonnet-4-20250514`) via direct fetch from the frontend, with full distribution data context passed in the system prompt.

**Future Backend Requirements:**
- OMS integration connector (Unicommerce, EasyEcom, Ginesys)
- Distributor mobile app (React Native — iOS + Android)
- Real-time alerting pipeline
- Multi-brand tenant architecture
- Webhook support for Unicommerce events

---

## 10. Revenue Model and Market Sizing

### Unicommerce's Client Base as the TAM

| Segment | Count | Notes |
|---------|-------|-------|
| Total Unicommerce clients | 7,500+ brands | Disclosed in earnings |
| Offline-expanding D2C brands | ~3,000 (40%) | The addressable segment |
| Brands with 100+ distributors | ~1,500 | Initial ICP |
| Year 1 target | 500 clients | Conservative assumption |

### Pricing

**Standalone SaaS:** ₹25,000-40,000/month per brand (~₹3-5 Lakh/year)

**Unicommerce add-on:** ₹20,000-35,000/month (slightly lower, bundled through UC's sales motion)

### Revenue Projections

| Year | Clients | ARR |
|------|---------|-----|
| Year 1 | 500 | ₹15 Crore |
| Year 2 | 1,500 | ₹45 Crore |
| Year 3 | 3,000 | ₹108 Crore |

**Gross margin:** 85%+ (SaaS infrastructure + AI API costs are low relative to revenue)

**Context:** Unicommerce's FY26 revenue is ₹204 Crore. This adds ₹15 Crore in Year 1, scaling to more than half of their current revenue run-rate by Year 3 — a material new revenue line.

**Churn impact:** Brands that get distribution intelligence from inside Unicommerce's ecosystem are 15-20% less likely to switch to EasyEcom or Vinculum. At Unicommerce's current ARR, a 2% churn reduction is worth ₹4+ Crore annually.

### Precedent: The Shipway Acquisition

Unicommerce acquired Shipway (last-mile intelligence) in FY25. Same playbook — a point solution that extended Unicommerce's visibility beyond the warehouse in one direction (forward, to the customer's door). Multicommerce extends visibility in the other direction: forward, to the retail shelf via distributors. Identical strategic logic. The precedent is already set.

---

## 11. The Three Paths Forward

### Path A — Acquire

Full IP transfer. Multicommerce becomes the distribution intelligence team inside Unicommerce. All technology, data, and team integrates with Unicommerce's product organisation.

**Pros:** Fastest path to market, competitive moat locked, no revenue split, full control of roadmap.
**Best if:** Unicommerce wants to own the distribution intelligence category before competitors.

### Path B — Strategic Partnership

Multicommerce operates independently with deep Unicommerce integration. Revenue share model (70/30 or 60/40 in Unicommerce's favour). Joint go-to-market to Unicommerce's 7,500 client base.

**Pros:** Lower risk for Unicommerce, Multicommerce retains upside for direct sales to non-UC brands.
**Best if:** Unicommerce wants the capability without integration overhead or acquisition cost.

### Path C — White-Label License

Unicommerce licenses Multicommerce as "Unicommerce Distribution Intelligence." Their branding, our engine. Annual licensing fee plus per-client usage.

**Pros:** Fastest speed-to-market for Unicommerce, no equity transaction needed.
**Best if:** Unicommerce wants to expand the product surface under their brand with minimal internal development.

---

## 12. What's Next

### The Ask (Pitch Version)

1. **30-day pilot** with 2-3 Unicommerce clients actively scaling offline distribution
2. **Sandbox API access** to Unicommerce's Uniware REST APIs for integration development
3. **Decision on partnership path** within 60 days of pilot results

### The Build Roadmap (Independent Version)

**Immediate (Month 1-2):**
- Build distributor mobile app MVP (React Native)
- Connect Unicommerce API integration layer
- Deploy with 1-2 D2C brands doing offline expansion
- Collect real secondary sales data

**Short-term (Month 3-4):**
- Activate AI alert engine on live data
- Build distributor-facing analytics (their own sell-through view)
- Establish first paying customers
- Document ROI: crisis prevented, days of inventory reduced

**Medium-term (Month 4-8):**
- Add demand forecasting on top of secondary sales data
- Expand OMS integrations (EasyEcom, Ginesys)
- Scale to 20-30 brands
- Start acquisition conversations armed with real data

**Long-term (Month 8-14):**
- Build the NPD Decision Engine (Phase 3)
- Cross-vertical expansion: apparel, home goods, health
- Platform play: generalisable across any brand with distributor networks

---

## Appendix — Key Numbers Reference

| Metric | Value | Source |
|--------|-------|--------|
| Mamaearth distributor crisis (2023) | ₹300 Crore burden | AICPDF, Business Standard |
| Stock returns absorbed by Honasa | ₹100+ Crore | Honasa investor reports |
| Q2 FY25 net loss | ₹19 Crore | Honasa quarterly results |
| Revenue drop in crisis quarter | 7% to ₹462 Crore | Honasa quarterly results |
| Distributors affected | 200+ | AICPDF statements |
| D2C industry RTO rate | 20-25% | Razorpay, Unicommerce D2C Report 2026 |
| Tier 2/3 RTO rate | 35% | Unicommerce D2C Report 2026 |
| Honasa contract manufacturers | 37 | IPO prospectus |
| Honasa monthly dispatches | 3 million+ | Unicommerce case study |
| Honasa fulfillment rate | 99.99% | Unicommerce case study |
| Unicommerce total clients | 7,500+ | Earnings disclosure |
| Unicommerce FY26 revenue | ₹204 Crore | Annual report |
| Industry dead stock cost (global) | $1.77 trillion/year | IHL Group |
| COD share of D2C orders | 66% | Razorpay data |
| Mamaearth SKU launches vs. industry | 5.7× median | IPO prospectus |
| Alpha Arbutin search growth (India) | +180% YoY | Google Trends |

---

*Document compiled from: Unicommerce partnership announcement (Jan 2022), Business Standard distributor reporting (Nov 2023), The Core investigative report (Dec 2024), YourStory distribution analysis, Honasa investor presentations (FY24-FY26), Inc42 CosmoGenesis acquisition report (May 2024), Honasa IPO prospectus (Oct 2023), ICICI Securities equity research (Nov 2025, Feb 2026), AICPDF distributor federation statements, Unicommerce D2C Industry Report 2026, Kapil Makhija Q4 FY26 earnings call (May 2026), Razorpay RTO benchmark data, Capterra and G2 Unicommerce client reviews (Jan 2026).*

---

**Built by:** Multicommerce  
**Version:** 1.0  
**Date:** May 2026  
**Status:** Working prototype complete · Pitch deck ready · Seeking pilot brands and partnership conversation
