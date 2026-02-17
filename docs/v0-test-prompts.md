# Poseidon.AI — v0 Test Prompts (Standalone Full-Page Design)

> **Goal**: Generate 3 visually distinct, production-quality pages that v0 designs freely.
> These prompts intentionally do NOT reference any existing Poseidon components (PageShell, ScoreRing, etc.).
> v0 should treat each as a greenfield full-page React component.

---

## Background (paste into v0 as System Instructions)

```
You are designing screens for "Poseidon.AI" — an AI-powered financial command center.
This is a capstone project for the MIT Sloan CTO Program (Group 7, March 2026).
The audience is MIT faculty and CTO peers who will scan a QR code and browse 3-5 screens on their phones.

The product has 4 AI "engines":
- Protect (teal #0DD9B4) — real-time threat detection, fraud alerts, risk monitoring
- Grow (violet #9B6DFF) — net worth forecasting, goal tracking, Monte Carlo simulations
- Execute (gold/amber #FFB020) — action queue with human approval, savings automation
- Govern (blue #4E94FF) — audit trails, compliance scoring, explainability

Brand personality: "Trusted financial sentience." Calm authority, not flashy fintech.
Think Bloomberg Terminal meets Linear meets Vercel — information-dense but beautifully organized.

Technical stack: React + TypeScript + Tailwind CSS + shadcn/ui + Recharts + Framer Motion + Lucide icons.

Design rules:
- Dark theme ONLY. Base background: deep navy (#070d1a to #0a1225 range). Never white/light.
- Glass-morphism cards: backdrop-blur + subtle white border (border-white/[0.06-0.10]) + translucent bg (white/[0.02-0.05])
- Typography: Inter or system sans-serif. Large bold headlines, smaller muted secondary text.
- Use color sparingly — engine accent colors for emphasis only, not large fills.
- Subtle gradients and glows over flat color blocks.
- Dense information layout — this should feel like a real product with real data, not a marketing mockup.
- Every page must work at 375px mobile width (QR code → phone).
- Animations: subtle and purposeful. Stagger card entrances, fade-up on scroll, gentle hover lifts.
- Each page is a single default-exported React component. No routing, no external state management.
- Use shadcn/ui primitives (Card, Badge, Button, Tabs, Table, Progress, Separator, etc.)
- Use Recharts for any charts (AreaChart, BarChart, PieChart, etc.)
- Use Lucide React for icons
- Use Framer Motion for animations
```

---

## Integration notes (for developer, not for v0)

After v0 generates each page, the developer will:
1. Save as `src/pages/{PageName}.tsx`
2. Add route in `src/router/lazyRoutes.ts`
3. The page renders inside `<AppShell>` which only provides `<main id="main-content">{children}</main>` — no layout constraints
4. Replace hardcoded colors with CSS variables where appropriate (post-generation polish)
5. Wire up internal `<Link to="...">` for navigation between pages

No need to worry about PageShell, contracts, or slot systems. The v0 output IS the page.

---

## Prompt 1: Landing Page (`/`)

```
Create a full-page landing screen for "Poseidon.AI — Trusted Financial Sentience".

This is the FIRST thing MIT faculty see after scanning a QR code. It must feel like a real SaaS product — not a student project. Think Linear.app or Vercel's landing page but for fintech AI.

## Page structure (top to bottom, single scroll):

### 1. Navigation bar (sticky top)
- Left: "Poseidon.AI" logo text (bold, white) with a small trident/wave icon
- Center: nav links — "Product", "Trust", "Pricing" (text-sm, muted, hover:white)
- Right: "Sign in" ghost button + "Get Started" solid button (teal gradient)
- Glass background (backdrop-blur, bg-white/5, border-b border-white/5)

### 2. Hero section (centered, max-w-4xl)
- Large headline (text-5xl md:text-7xl, font-bold, white):
  "Safer satisfying money decisions — in one place."
- Subheadline (text-lg md:text-xl, text-slate-400, max-w-2xl):
  "Four AI engines working together. Every decision explainable, auditable, and reversible."
- Two buttons side by side:
  - "Open Dashboard →" (large, teal-to-cyan gradient bg, white text, rounded-xl, px-8 py-4, shadow-glow)
  - "Watch Demo" (ghost, border-white/10, with PlayCircle icon)
- Trust badge row beneath buttons (flex gap-6, text-xs text-slate-500):
  - Lock icon + "Bank-grade encryption"
  - Shield icon + "GDPR compliant"
  - ScrollText icon + "100% auditable"
- Subtle radial gradient glow behind the hero text (teal/blue, very low opacity)

### 3. Live metrics strip (full width, 4 cards in a row)
- 4 glass cards in a grid (1 col mobile, 2 col tablet, 4 col desktop)
- Each card: label (text-xs, uppercase, tracking-wide, slate-500), large value (text-2xl, font-bold, white), tiny Recharts AreaChart sparkline beneath (40x20px, no axes, just the filled area in engine color)
- Cards:
  - "System Confidence" — "0.92" — teal sparkline
  - "Decisions Audited" — "1,247" — blue sparkline
  - "Threats Blocked" — "23" — amber sparkline
  - "Response Time" — "<200ms" — green sparkline

### 4. Four Engine showcase (2x2 grid desktop, stacked mobile)
- Section header: "Four engines. One trusted system." (text-3xl font-bold white, centered)
- 4 large glass cards, each with:
  - Engine icon in a colored circle (bg-{color}/10, rounded-full, p-3)
  - Engine name (text-xl font-bold white)
  - One-sentence description (text-sm text-slate-400)
  - Confidence badge (font-mono, text-xs, colored pill bg-{color}/10 text-{color})
  - Hover: card lifts (translateY -2px), border glows in engine color, shadow intensifies
  - Content:
    - Protect: Shield icon, teal, "Real-time threat detection with explainable AI", 0.94
    - Grow: TrendingUp icon, violet, "Forecast-driven growth with Monte Carlo simulations", 0.89
    - Execute: Zap icon, amber, "Consent-first automation with reversible actions", 0.91
    - Govern: Scale icon, blue, "Full audit trail for every AI decision", 0.97

### 5. Governance proof section
- Header: "Governance by design, not by checkbox" (text-2xl font-bold white)
- 3 columns (stacked mobile):
  - "Explainable" — Brain icon in blue circle — "Every AI decision includes SHAP feature attribution"
  - "Auditable" — ScrollText icon — "1,247 decisions with full audit trails"
  - "Reversible" — RotateCcw icon — "One-click rollback on any automated action"
- Below: a slim proof bar — glass card, text-xs, monospace:
  "System uptime 99.97% · Last audit: 4m ago · Model version: v3.2.1 · Decisions today: 47"

### 6. Footer
- Centered: Shield icon + "MIT Sloan CTO Program · Group 7 · March 2026"
- "Privacy Policy · Terms of Service" links (text-xs, slate-600)

## Animations:
- Hero text fades up on load (opacity 0→1, y 30→0, duration 0.8s)
- Metrics strip staggers in (0.1s delay per card)
- Engine cards stagger in on scroll (viewport intersection trigger)
- Governance section fades up on scroll

## Key visual quality targets:
- The hero gradient glow should be very subtle — not a neon light show
- Cards should feel like frosted glass floating on a deep ocean
- Information density: this should feel data-rich and professional, not empty and "startup-y"
- The page should feel calm and authoritative — like Bloomberg Terminal's marketing site
```

---

## Prompt 2: Dashboard (`/dashboard`)

```
Create a full-page AI command center dashboard for "Poseidon.AI".

This is the main dashboard — the first "inside the app" screen users see. It should feel like a mission control center for personal finance. Think Bloomberg Terminal + Linear + Figma's dashboard — information-dense, beautifully organized, dark.

## Page structure:

### 1. Top navigation bar (sticky)
- Left: "Poseidon.AI" wordmark + trident icon
- Center: tab-style nav — Dashboard (active, white, underline), Protect, Grow, Execute, Govern, Settings
- Right: Bell icon (notification, with red dot badge "2"), User avatar circle
- Glass background (backdrop-blur-xl bg-white/5 border-b border-white/5)

### 2. Hero / Command strip (not a tall hero — compact and dense)
- Left side (flex-1):
  - Small muted badge: "Dashboard · Last updated 2m ago" with a green pulse dot
  - Headline (text-2xl md:text-3xl font-bold white): "Good morning. System confidence 0.92."
  - Subline (text-sm text-slate-400): "One unresolved alert. Three actions queued. Cash buffer at 14 days."
- Right side:
  - AI insight banner — a glass card (max-w-md) with:
    - Sparkles icon (teal) + "AI Recommendation" badge
    - Text: "Consolidate 3 overlapping subscriptions — projected save $140/mo"
    - Small "Review →" link in teal
- Background: very subtle radial gradient (dark blue → transparent, behind the strip)

### 3. KPI grid (4 cards in a row, responsive)
- 4 stat cards, each glass card:
  - Label (text-xs uppercase tracking-wide text-slate-500)
  - Value (text-2xl font-bold white)
  - Delta chip (text-xs, green bg for positive, red for negative): "+8.2%", "+12%", "↓ from Med", "-3"
  - Recharts AreaChart sparkline (60x24px, no axes, gradient fill in accent color, white stroke)
- Cards:
  - "Net Position" — "$847k" — "+8.2%" green — teal sparkline
  - "Cash Flow" — "+$4.1k" — "+12%" green — cyan sparkline
  - "Risk Level" — "Low" — "↓ from Med" green — blue sparkline
  - "Active Alerts" — "2" — "-3 resolved" green — amber sparkline

### 4. Engine health strip (horizontal row beneath KPIs)
- 4 small chips in a row, each showing:
  - Colored dot (teal/violet/amber/blue) + engine name + status + confidence
  - Example: [●] Protect · 0 threats · 0.94
  - One chip (selected) has a subtle glow ring around it
  - Clicking chips could filter dashboard content (show visual affordance)

### 5. Main content: two-column layout (stacks on mobile)

LEFT COLUMN (2/3 width — main feed):

Section A — "System Trust" panel:
  - A composite trust ring visualization:
    - Large circular progress ring (120x120px) showing 92/100
    - 4 colored arc segments around it (teal, violet, amber, blue — each engine's contribution)
    - Below the ring: 4 inline sub-scores with small trend arrows
    - "Protect 94 ↔ Grow 89 ↑ Execute 91 ↔ Govern 97 ↑"
  - Build the ring using SVG with stroke-dasharray or Recharts RadialBarChart

Section B — "Cash Flow Forecast" chart:
  - Glass card with section header "Cash Flow Forecast · 30d projection"
  - Recharts AreaChart (full card width, ~260px height):
    - X-axis: dates (text-xs, slate-600)
    - Y-axis: dollar amounts (text-xs, slate-600)
    - Historical data: solid teal line with gradient fill
    - Forecast data: dashed line with lighter gradient fill (confidence band)
    - Grid lines: very subtle (slate-800/30)
    - Dark tooltip on hover
  - Below chart: proof line — monospace text-xs text-slate-600:
    "Monte Carlo · 10,000 simulations · 90% confidence band · Model v3.2"

Section C — "Active Alerts" card:
  - Section header with badge count "2 active"
  - 2 alert items, each a small glass card row:
    - Severity badge: "Critical" (red) or "Warning" (amber)
    - Title: merchant name + amount
    - Timestamp: "14:28 UTC"
    - "View →" link
  - "See all alerts →" footer link

RIGHT COLUMN (1/3 width — decision rail):

Widget A — "Net Worth":
  - Large display: "$847,200" (text-3xl font-bold, white)
  - Trend: "+$12,400 (+1.5%)" in green with ArrowUpRight icon
  - "vs last month" muted text
  - Subtle purple glow behind the number

Widget B — "Risk Gauge":
  - Semi-circular arc gauge (SVG) showing 0.12 score
  - "Low" label in green, trend arrow pointing down with "-0.05"
  - Color zones on arc: green (0-0.3), amber (0.3-0.7), red (0.7-1.0)

Widget C — "Next Actions":
  - 3 action items, each with:
    - Urgency dot (red/amber/green)
    - Title + one-line description
    - Ghost "Execute →" button
  - Items:
    - [red] "Consolidate subscriptions" — "$140/mo savings"
    - [amber] "Adjust cash buffer" — "Current: 14d, Target: 21d"
    - [green] "Review vendor risk" — "Confidence 0.94"

Widget D — "Activity Timeline" (vertical):
  - 5 recent events, vertical timeline with:
    - Engine-colored dot on the timeline line
    - Timestamp (text-xs slate-500)
    - Event description (text-sm white)
  - Most recent at top

### 6. Governance footer bar (full width)
- Glass card strip at bottom:
  - Left: Shield check icon + "All systems verified" (green)
  - Center: "Audit ID: GV-2026-0215-DASH · Model v3.2 · SHAP v2.1"
  - Right: "Request human review →" ghost button

## Key quality targets:
- Information DENSITY is critical. This should feel like a real command center with real data.
- Two-column layout must feel balanced — not cramped, not sparse.
- Every section should feel like it contains actionable, meaningful information.
- Charts must use Recharts (not CSS-only), with proper dark theme styling.
- The trust ring SVG should be the visual centerpiece of the left column.
- Mobile: everything stacks vertically. KPIs become 2x2. Columns become single.
```

---

## Prompt 3: Protect Engine (`/protect`)

```
Create a full-page AI threat protection engine screen for "Poseidon.AI".

This is the Protect engine — real-time financial threat detection with explainable AI. It should feel like a security operations center (SOC dashboard) but for personal finance. Think CrowdStrike's Falcon console or Datadog's security monitoring — but more beautiful and calmer.

Teal (#0DD9B4) is the primary accent color for this entire page.

## Page structure:

### 1. Top navigation bar (same as dashboard — sticky glass bar)
- "Poseidon.AI" wordmark, nav tabs (Protect is active/highlighted in teal), notifications, avatar

### 2. Protect hero section (compact, action-oriented)
- Top-left: Back arrow + "Dashboard" breadcrumb link (text-xs text-slate-500)
- Badge row: Teal shield icon in circle + "Protect Engine" label + "● Continuous monitoring" green dot + "Last scan: 4m ago"
- Headline (text-2xl md:text-3xl font-bold white):
  "3 active signals. Confidence 0.94. No action required."
- AI insight card (glass, teal left border 2px):
  - Sparkles icon + "AI Insight" teal badge
  - "Unusual pattern detected at MerchantX — $4,200 charge deviates 3.2x from category average."
  - "Begin triage →" teal link
- Proof metadata (text-xs font-mono text-slate-600, flex row with · separators):
  "3 signals detected · Confidence 0.94 · Model: FraudDetection v3.2 · Basis: 180-day behavioral analysis"

### 3. KPI strip (4 metric cards)
- "Active Signals" — "3" (amber accent) — declining sparkline
- "Blocked Today" — "1" (teal accent) — flat sparkline
- "False Positive Rate" — "2.1%" (green accent) — declining sparkline (good)
- "Account Coverage" — "100%" (green accent) — flat high sparkline

### 4. Main content: two-column layout

LEFT COLUMN (2/3 — primary feed):

Section A — "Threat Triage Queue":
  - Section header: "Active Threats" with "3 pending" amber badge
  - 3 threat cards stacked vertically. Each card is a glass card with:
    - Left: severity badge — "Critical" (red, pulsing border) or "Warning" (amber) or "Info" (blue)
    - Center:
      - Title (font-semibold white): "Suspicious transaction — MerchantX"
      - Details row (text-sm slate-400): "$4,200 · Visa ****4532 · New York, NY · 14:28 UTC"
      - Confidence bar: horizontal progress bar (teal fill) with "94%" label
    - Right: two icon buttons — Eye (view detail), ShieldAlert (block)
    - Expanded state (show for first card):
      - "SHAP Explanation" subheader
      - 3 horizontal factor bars:
        - "Merchant history" — bar fills to 82% — "+0.82"
        - "Amount deviation" — bar fills to 71% — "+0.71"
        - "Geographic mismatch" — bar fills to 65% — "+0.65"
      - Each bar: label left, teal gradient bar, value right
      - Model metadata: "FraudDetection v3.2 · Trained: 180d · Accuracy: 97.2%"
  - Threat data for the 3 cards:
    1. Critical: "Suspicious transaction — MerchantX", $4,200, confidence 94%
    2. Warning: "Unusual login location — Tokyo", confidence 78%
    3. Info: "Recurring charge increase — Netflix", $22.99 (+$7), confidence 65%

Section B — "Recommended Actions":
  - 3 action items with urgency indicators:
    - [red dot] "Freeze card ending 4532" — "Immediate containment · Confidence 0.96"
    - [amber dot] "Investigate MerchantX" — "SLA: 24h · Confidence 0.91"
    - [green dot] "Update alert rules" — "Low priority · Confidence 0.88"
  - Each item has a ghost "Execute →" button

Section C — "Risk Definition" (small footer card):
  - Monospace glass card (text-xs):
    "Risk Score = weighted_sum(signal_confidence × severity_factor) · Unit: 0–1 · Period: rolling 24h · Threshold: >0.7 triggers alert"

RIGHT COLUMN (1/3 — evidence rail):

Widget A — "Overall Risk Score":
  - Large circular ring (ScoreRing-style): 94/100 in teal
  - Build with SVG: background circle (slate-800), foreground arc (teal gradient), centered text
  - Below ring: "Low risk — monitoring" status text
  - Subtle teal glow behind the ring

Widget B — "Category Breakdown":
  - 4 horizontal bar rows:
    - "Transaction patterns" — 92% bar — teal
    - "Merchant risk" — 87% bar — teal
    - "Geographic signals" — 95% bar — teal
    - "Behavioral match" — 91% bar — teal
  - Each: label left (text-sm), bar (rounded, height 8px, bg-slate-800 with teal fill), score right (text-sm font-mono)

Widget C — "Alert Timeline":
  - Vertical timeline with teal dots:
    - "Signal detected" — 14:28 — checkmark (completed)
    - "Analysis complete" — 14:29 — checkmark (completed)
    - "Alert raised" — 14:30 — checkmark (completed)
    - "Resolution pending" — Now — pulsing dot (active)
  - Timeline line: teal-500/30, dots: teal filled for complete, pulsing ring for active

Widget D — "Evidence Summary":
  - Glass card: "AI identified 3 correlated signals across 2 accounts in the last 6 hours."
  - Small teal info icon

### 5. Governance footer (full width)
- Glass strip:
  - Shield check icon + "Verified" green badge
  - "Audit: GV-2026-0215-PRT-SIG · FraudDetection v3.2 · SHAP v2.1"
  - "Request human review →" button

## Key quality targets:
- The first threat card should feel URGENT — the critical severity badge should pulse or glow subtly
- SHAP explanation bars must be clear and readable — this proves AI explainability
- The risk score ring should be the visual anchor of the right column
- Category breakdown bars should be clean and precise — Bloomberg-quality data viz
- Mobile: columns stack, threat cards become full-width, evidence rail moves below
- Color discipline: teal is the ONLY accent. No other engine colors on this page.
- Dense but organized: this should feel like a real security operations dashboard
```

---

## Usage

1. Open v0.dev
2. Paste the **Background** section into v0's system/custom instructions
3. Paste one prompt at a time into the chat
4. Generate → review → iterate in v0 until the visual quality is satisfactory
5. Export the React component
6. Save to `src/pages/{Landing,Dashboard,Protect}.tsx`
7. Wire up the route in `src/router/lazyRoutes.ts`
8. Replace hardcoded hex colors with CSS custom properties where needed
9. Test at 375px, 768px, and 1440px widths

## What to look for in v0 output

- **Visual distinctiveness**: Each page should have its own character. Not three copies of the same template.
- **Information density**: Dense data grids, charts with real Recharts code, compact card layouts.
- **Glass-morphism quality**: Subtle, not overwhelming. Cards should float, not glow like neon signs.
- **Mobile readiness**: Responsive grid, stacked columns, touch-friendly hit targets.
- **Chart quality**: Recharts AreaChart/BarChart with dark theme, proper axis styling, gradient fills.
- **Animation subtlety**: Framer Motion stagger + fade-up. Not bouncing or spinning.

## Comparison checklist

After generating all 3 pages, compare them:

| Aspect | Landing | Dashboard | Protect |
|--------|---------|-----------|---------|
| Hero height | Tall (full viewport) | Compact (strip) | Compact (action-oriented) |
| Layout | Single column scroll | Two-column + rail | Two-column + evidence rail |
| Primary chart | None (sparklines only) | Cash flow forecast + trust ring | SHAP explanation bars |
| CTA density | 2 buttons | 3 action items | Threat triage cards |
| Information density | Medium (marketing) | High (command center) | High (SOC dashboard) |
| Accent color | Multi-engine | Multi-engine | Teal only |
| Tone | "Welcome, this is real" | "You're in control" | "We're watching, you're safe" |
