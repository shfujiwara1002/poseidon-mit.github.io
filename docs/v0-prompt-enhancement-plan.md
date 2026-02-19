# v0 Prompt Enhancement Plan — Poseidon.AI Screen Rebuild

> **Status**: 計画ドキュメント（実装前レビュー用）
> **Date**: 2026-02-18
> **Goal**: v0 が各画面で「何を構築すべきか」を具体的に理解できるレベルまで Prompt を拡充する
> **Architecture Note (2026-02-19)**: Active frontend is Vite-only. Canonical route files are `src/pages/*.tsx`. Legacy Next assets are archived under `legacy/next/`.

## Scope Alignment Note

- Functional scope: 16 units
- Route operation scope: 21 routes (19 pages + `/onboarding` alias + `/404`)
- Out of scope in this phase: `/trust`, `/recovery`, `/help`

## Quality Gate Update

- Added runtime gate: `npm run check:inline-style-hex`
- Scope: target 21-route operation pages
- Enforcement: `style={{...}}` and hardcoded hex are blocked unless listed in `docs/baselines/inline-style-hex-exceptions.json`
- Exception policy: owner + reason + expiresOn required, capped by `maxExceptions`

---

## 0. 問題診断

### 現状の `v0-screen-prompts.md` に欠落しているもの

| 欠落要素 | 影響 | 対応方針 |
|----------|------|----------|
| **視覚レイアウト仕様** | v0 がカラム構成・セクション順序を推測する必要がある | 各画面に wireframe-level の Section Map を追加 |
| **表示データの具体例** | 数値・ラベル・件数が不明で placeholder だらけの出力になる | Representative Mock Data を各画面 prompt に inline 化 |
| **コンポーネント構成指定** | v0 が独自コンポーネントを生成し、既存 facade と重複する | 使用コンポーネント一覧を明示 |
| **ユーザーシナリオ文脈** | 「この画面でユーザーは何を判断するか」が不在 | User Intent + Decision Point を各画面に追加 |
| **視覚的差別化ポイント** | 全画面が同じトーンになり「期待を何段階も上回る」完成度に達しない | Signature Visual Element を Tier 1 各画面に指定 |
| **画面間の情報継承** | 画面遷移時にデータが途切れ、統合感が出ない | Cross-screen Data Thread を定義 |

---

## 1. ユーザープロファイル分析

### 1.1 Primary: MIT 評価者（教員・業界評価者）

- **行動パターン**: QR スキャン → 3-5 画面を 60-90 秒で閲覧 → 印象形成
- **評価軸**: (1) 技術的統合の深さ (2) Governance の構造的組込み (3) 見た目の成熟度 (4) ビジネス実現性
- **判断ポイント**: 「これは学生プロジェクトか、実プロダクトか」を最初の 10 秒で決める
- **最適化**: Landing → Dashboard → Protect の 3 画面で「本物感」を確立する

### 1.2 Secondary: CTO Program 同期（技術リーダー）

- **行動パターン**: 特定エンジンに興味 → 深掘り → 技術的な裏付けを確認
- **評価軸**: アーキテクチャの整合性、SHAP 等の ML 実装の具体性
- **最適化**: Alert Detail の SHAP Waterfall、Scenarios の Monte Carlo が鍵

### 1.3 Tertiary: プレゼンテーション聴衆（一般）

- **行動パターン**: Landing のみ、または Landing → Dashboard で離脱
- **最適化**: Landing の「30 秒インパクト」に全力投下

---

## 2. シナリオ別画面優先度マトリクス

### 2.1 Golden Path（全ユーザー共通、30-90 秒）

```
Landing (10s) → Dashboard (20s) → Protect (15s) → Execute (15s) → Govern (10s)
```

この 5 画面が「期待を何段階も上回る」の成否を決める。各画面の v0 prompt に最大限の具体性を投入する。

### 2.2 Explorer Path（興味を持った評価者、+60 秒）

```
Protect → Alert Detail (SHAP 深掘り)
Dashboard → Grow → Scenarios (ML 予測力の証明)
Execute → History (監査証跡の一貫性確認)
Govern → Audit Ledger (1,247 件の実在感)
```

### 2.3 Completeness Path（網羅性を確認する評価者）

```
Settings, Onboarding, Pricing — 「ここまで作り込んでいるのか」という驚き
```

---

## 3. 画面別 Prompt 拡充仕様

### 凡例

- **Section Map**: 上から下への表示セクション順序（v0 がこの順序で構築）
- **Representative Data**: v0 が使う具体的なモックデータ値
- **Signature Visual**: その画面固有の「記憶に残る」視覚要素
- **Decision Point**: ユーザーがこの画面で行う判断
- **Cross-thread**: 他画面と共有するデータ要素（統合感の担保）

---

### 3.1 `/` Landing — "これは本物だ"

**Signature Visual**: Cinematic video hero + 4 つの live sparkline metrics strip

**Section Map** (上から下):

| # | Section | 内容 | Layout |
|---|---------|------|--------|
| 1 | **Nav Bar** | Logo "Poseidon.AI" + リンク (Platform, Governance, Pricing) + "Sign in" / "Open Dashboard" CTA | Sticky, glass-surface, 1 row |
| 2 | **Hero** | フルスクリーン video BG + badge "MIT CTO Program 2026" + headline "Safer, satisfying money decisions" + subhead 1 行 + Primary CTA "Open Dashboard" + Secondary "Watch Demo" | Center-aligned overlay on video, min-h-85vh |
| 3 | **Trust Badges** | "Bank-grade encryption" + "SOC 2 Type II" + "Read-only access" | Horizontal pill row under CTAs |
| 4 | **Live Metrics Strip** | 4-column grid: System Confidence 0.92, Decisions Audited 1,247, Threats Blocked 23, Response Time <200ms — each with 10-point sparkline | 4-col responsive grid, glass-surface cards |
| 5 | **Four Engines** | 2x2 grid cards: Protect (green), Grow (violet), Execute (amber), Govern (blue) — 各カードに icon + 1 行 description + confidence score + mini area chart | 2-col on desktop, 1-col mobile |
| 6 | **Governance Proof** | 3-pillar grid: Explainable (SHAP), Auditable (1,247 decisions), Reversible (one-click rollback) + proof bar (uptime 99.97%, last audit 2 min ago, model v3.2.1, 47 decisions today) | 3-col + full-width bar |
| 7 | **Footer** | 3-col: Brand column + Quick links + Legal | Standard footer |

**Representative Data**:
```
System Confidence: 0.92 (sparkline: uptrend)
Decisions Audited: 1,247
Threats Blocked: 23 (sparkline: downtrend = good)
Response Time: <200ms (sparkline: stable low)
Engine confidences: Protect 0.94, Grow 0.89, Execute 0.91, Govern 0.97
Uptime: 99.97%
Last audit: 2 min ago
Model version: v3.2.1
Decisions today: 47
```

**Decision Point**: "このプロダクトを触ってみるか" → Open Dashboard

**Cross-thread**: System Confidence 0.92, Threats Blocked 23, Decisions 1,247 は Dashboard/Protect/Govern でも同じ数値を使用すること

---

### 3.2 `/dashboard` — "全エンジンが連動している"

**Signature Visual**: 6-column BentoGrid with engine-colored accent borders + EngineHealthStrip のパルスアニメーション

**Section Map (Detail mode)**:

| # | Section | 内容 | Layout |
|---|---------|------|--------|
| 1 | **HeroSection** | 挨拶 "Good morning, Shinji" + 日時 + view mode toggle (Glance / Detail / Deep) + "Review Plan" CTA | Full-width header bar |
| 2 | **KpiGrid** | 6 KPI cards in 2x3 grid: (1) System Confidence 0.92 ↑2% (2) Active Threats 3 ↓1 (3) Queued Actions 5 (4) Monthly Savings $847 ↑12% (5) Goal Progress 73% (6) Audit Score 96/100 | 3-col grid (2 rows) |
| 3 | **EngineHealthStrip** | Horizontal strip: Protect 94% (green), Grow 89% (violet), Execute 91% (amber), Govern 97% (blue) — 各エンジンに status dot + percentage + mini bar | Full-width, 4 equal segments |
| 4 | **PrimaryFeed** | 左カラム 2/3 幅 — Alert/Action feed: (1) "Unusual $2,847 charge at Electronics Store" Critical (2) "Subscription optimization found: save $23/mo" Info (3) "Bill negotiation ready: phone plan -$15/mo" Action | Card list, chronological |
| 5 | **DecisionRail** | 右カラム 1/3 幅 — Pending decisions: (1) "Approve auto-save rule: $200/mo" (2) "Review investment rebalance" (3) "Confirm fraud alert action" — 各カードに confidence + engine badge | Sidebar card stack |

**Section Map (Glance mode)**:
- Single-panel summary: Trust Index ring (0.92) + 3 最重要 alerts + 1-click "Review Plan" CTA
- 情報量を 60% 削減、5 秒で状況把握可能

**Representative Data**:
```
User: Shinji
Date: February 18, 2026
System Confidence: 0.92 (↑2% from yesterday)
Active Threats: 3 (1 critical, 2 warning)
Queued Actions: 5
Monthly Savings: $847 (↑12% MoM)
Goal Progress: 73% (Emergency Fund target)
Audit Score: 96/100
Engine Health: Protect 94%, Grow 89%, Execute 91%, Govern 97%

Feed items:
  - CRITICAL: "Unusual $2,847 charge — Electronics Store, Checking ****4521" (Protect)
  - INFO: "Subscription optimization: cancel unused Streaming+ → save $23/mo" (Grow)
  - ACTION: "Bill negotiation ready: phone plan reduction $15/mo, confidence 0.91" (Execute)

Decision Rail:
  - "Auto-save $200/mo to Emergency Fund" — confidence 0.88, engine: Execute
  - "Rebalance: shift 5% from bonds to index" — confidence 0.82, engine: Grow
  - "Confirm block on suspicious merchant" — confidence 0.94, engine: Protect
```

**Decision Point**: "どのアラートを最初に対応するか" → Protect の Critical alert をクリック

**Cross-thread**:
- Active Threats 3 → Protect の ThreatTable に同じ 3 件が表示
- Queued Actions 5 → Execute の ActionQueue に同じ 5 件が表示
- Audit Score 96 → Govern の Compliance Score と一致
- $2,847 の不審取引は Protect → Alert Detail → Execute → Govern を通じて追跡可能

---

### 3.3 `/protect` — "AI が脅威を検知し、理由を説明できる"

**Signature Visual**: ThreatTable の Critical 行に赤いパルスアニメーション + ScoreRing の confidence visualization

**Section Map (Detail mode)**:

| # | Section | 内容 | Layout |
|---|---------|------|--------|
| 1 | **ProtectHero** | "Threat Detection" + shield icon (green) + "3 active signals" badge + view mode toggle + "Open Top Alert" CTA | Full-width header |
| 2 | **ThreatTable** (左 2/3) | 3 rows: (1) CRITICAL: Unusual transaction $2,847 — confidence 0.94 — "Electronics Store" (2) WARNING: Login from new device, São Paulo — confidence 0.87 (3) WARNING: Subscription price increase detected +$8/mo — confidence 0.78 — 各行に severity badge, engine timestamp, SHAP summary | Table with expandable rows |
| 3 | **ProtectSidebar** (右 1/3) | (a) ScoreRing: Composite Risk 0.12 (Low) (b) Model info: FraudDetectionV3.2, last retrained 3 days ago (c) Quick actions: Freeze card, Investigate, Escalate (d) ProofLine: "3 signals, Confidence 0.94, Model FraudDetectionV3.2" | Sidebar card stack |

**Representative Data**:
```
Threats:
  1. id: "THR-001", severity: "critical", title: "Unusual transaction pattern"
     amount: "$2,847.00", merchant: "TechElectro Store", account: "Checking ****4521"
     confidence: 0.94, time: "12 min ago", status: "unread"
     shapFactors: [
       { label: "Transaction amount (3.2x avg)", value: +0.31 },
       { label: "New merchant category", value: +0.22 },
       { label: "Weekend timing", value: +0.15 },
       { label: "Account history (5yr clean)", value: -0.18 },
       { label: "Location match (home city)", value: -0.06 }
     ]

  2. id: "THR-002", severity: "warning", title: "New device login"
     detail: "São Paulo, Brazil — iPhone 15 Pro"
     confidence: 0.87, time: "2 hours ago", status: "in-progress"
     shapFactors: [
       { label: "New geolocation", value: +0.35 },
       { label: "New device fingerprint", value: +0.20 },
       { label: "Known Apple ecosystem", value: -0.12 }
     ]

  3. id: "THR-003", severity: "warning", title: "Subscription price increase"
     detail: "StreamMax: $14.99 → $22.99/mo (+53%)"
     confidence: 0.78, time: "1 day ago", status: "unread"
     shapFactors: [
       { label: "Price change magnitude", value: +0.28 },
       { label: "No notification received", value: +0.15 },
       { label: "Active usage (high)", value: -0.10 }
     ]

Sidebar:
  Composite Risk Score: 0.12 (Low — scale 0-1 where 1 = critical)
  Model: FraudDetectionV3.2, retrained: Feb 15 2026
  Resolution rate: 94% within 4 hours
  False positive rate: 2.1%
```

**Decision Point**: "Critical alert を調査するか" → Alert Detail へ遷移

**Cross-thread**: THR-001 ($2,847) は Dashboard Feed の最初のアイテムと同一。Alert Detail で完全な SHAP waterfall として再表示。

---

### 3.4 `/protect/alert-detail` — "モデルの判断根拠を完全に可視化"

**Signature Visual**: **ShapWaterfall** — 横棒グラフで各 factor の寄与度を赤 (risk-up) / 青 (risk-down) で表示。MIT 評価者への最大の差別化要素。

**Section Map**:

| # | Section | 内容 | Layout |
|---|---------|------|--------|
| 1 | **Alert Header** | "Unusual Transaction Pattern" + CRITICAL badge + "12 min ago" + Back to Protect link | Full-width |
| 2 | **Summary Card** | Amount $2,847 + Merchant "TechElectro Store" + Account ****4521 + Confidence 0.94 ring | Glass card, key-value pairs |
| 3 | **ShapWaterfall** (MUST) | Base score 0.45 → final 0.94. 5 factors: Transaction amount +0.31 (red), New merchant +0.22 (red), Weekend timing +0.15 (red), Account history -0.18 (blue), Location match -0.06 (blue) | Full-width waterfall chart |
| 4 | **Evidence Timeline** | 5 steps: (1) Transaction detected 12:34 (2) Model scored 0.94 12:34 (3) Alert created 12:34 (4) Account flagged 12:35 (5) Awaiting review — now | Vertical timeline |
| 5 | **Similar Incidents** | 2-3 past alerts with outcomes: "Similar pattern 30d ago — resolved as fraud" | Card list |
| 6 | **Action Panel** | Primary: "Open Dispute Flow" + Secondary: "Back to Protect" + Tertiary: "Mark as Safe" | Bottom action bar |

**Representative Data** (ShapWaterfall):
```
baseScore: 0.45
factors: [
  { label: "Transaction amount (3.2x avg)", value: +0.31, direction: "risk" },
  { label: "New merchant category", value: +0.22, direction: "risk" },
  { label: "Weekend timing anomaly", value: +0.15, direction: "risk" },
  { label: "5-year clean account history", value: -0.18, direction: "safe" },
  { label: "Location within home city", value: -0.06, direction: "safe" }
]
finalScore: 0.94
threshold: 0.80 (auto-flag level)
model: "FraudDetectionV3.2"
auditId: "GV-2026-0218-PRT-DET"
```

**Decision Point**: "これは本当の不正か、誤検知か" → Dispute Flow or Mark as Safe

---

### 3.5 `/execute` — "人間の承認なしには何も実行しない"

**Signature Visual**: Approval queue の各カードに「Approve / Decline」ボタン + savings impact visualization

**Section Map (Detail mode)**:

| # | Section | 内容 | Layout |
|---|---------|------|--------|
| 1 | **ExecuteHero** | "Action Queue" + Zap icon (amber) + "5 pending actions" badge + view toggle + "Open Approval Queue" CTA | Full-width header |
| 2 | **ActionQueue** (左 2/3) | 5 action cards: (1) Auto-save $200/mo to Emergency Fund — confidence 0.88, projected: $2,400/yr (2) Cancel unused StreamPlus — save $23/mo — confidence 0.91 (3) Negotiate phone bill — save $15/mo — confidence 0.87 (4) Block suspicious merchant (from Protect THR-001) — confidence 0.94 (5) Rebalance portfolio 5% shift — projected gain $340/yr — confidence 0.82 — 各カードに Approve (green) / Decline (red) buttons | Card list with action buttons |
| 3 | **ExecuteSidebar** (右 1/3) | (a) Total pending savings: $1,416/yr (b) Execution success rate: 96% ring (c) Auto-save rules summary: 3 active, $600/mo (d) Last 5 executed actions with outcomes | Sidebar card stack |

**Representative Data**:
```
Actions:
  1. type: "auto-save", title: "Auto-save to Emergency Fund"
     amount: "$200/mo", projected: "$2,400/yr", confidence: 0.88
     engine: "execute", source: "Grow recommendation"

  2. type: "cancel", title: "Cancel StreamPlus subscription"
     savings: "$23/mo ($276/yr)", confidence: 0.91
     engine: "execute", source: "Grow optimization scan"
     reason: "No usage in 47 days"

  3. type: "negotiate", title: "Phone bill negotiation"
     savings: "$15/mo ($180/yr)", confidence: 0.87
     engine: "execute", source: "Grow analysis"
     provider: "Verizon", current: "$85/mo", target: "$70/mo"

  4. type: "block", title: "Block suspicious merchant"
     merchant: "TechElectro Store", confidence: 0.94
     engine: "protect→execute", source: "THR-001 investigation"

  5. type: "rebalance", title: "Portfolio rebalance"
     shift: "5% bonds → index funds", projected: "$340/yr gain"
     confidence: 0.82, engine: "grow→execute"

Sidebar:
  Total pending savings: $1,416/yr
  Success rate: 96%
  Active auto-rules: 3 ($600/mo total)
  Rollback coverage: 100% (30-day window)
```

**Decision Point**: "どのアクションを承認するか" → Approve individual actions

**Cross-thread**:
- Action #4 (Block merchant) は Protect THR-001 から連携
- Action #1 (Auto-save) は Grow の goal recommendation から連携
- 承認後は Govern の Audit Ledger に記録

---

### 3.6 `/govern` — "全ての意思決定が追跡可能"

**Signature Visual**: DecisionLedger テーブルの行ごとに engine-colored badge + audit ID chip + compliance score ring (96/100)

**Section Map (Detail mode)**:

| # | Section | 内容 | Layout |
|---|---------|------|--------|
| 1 | **GovernHero** | "Governance" + Scale icon (blue) + "1,247 decisions audited" badge + view toggle + "Open Audit Ledger" CTA | Full-width header |
| 2 | **DecisionLedger** (左 2/3) | Table: 10 most recent decisions with columns: Timestamp, Engine, Decision, Confidence, Audit ID, Status. Filter by engine. Example rows: "Feb 18 12:35 — Protect — Flagged THR-001 — 0.94 — GV-2026-0218-PRT — Pending Review" | Filterable table |
| 3 | **GovernSidebar** (右 1/3) | (a) Compliance Score ring: 96/100 (b) Category breakdown: Data Privacy 98, Fair Lending 94, AML/KYC 92, Consumer Protection 100 (c) Human review queue: 2 pending (d) Last full audit: 2 min ago (e) Model registry summary: 4 models, all approved | Sidebar card stack |

**Representative Data**:
```
Compliance: 96/100
Categories:
  Data Privacy: 98/100
  Fair Lending: 94/100
  AML/KYC: 92/100
  Consumer Protection: 100/100

Recent decisions (10 rows):
  1. Feb 18 12:35 | Protect | Flag THR-001 | 0.94 | GV-2026-0218-PRT-001 | Pending
  2. Feb 18 12:30 | Execute | Auto-save $200 | 0.88 | GV-2026-0218-EXC-012 | Approved
  3. Feb 18 11:45 | Grow    | Rebalance rec | 0.82 | GV-2026-0218-GRW-007 | Approved
  4. Feb 18 11:20 | Protect | Clear THR-099 | 0.71 | GV-2026-0218-PRT-099 | Resolved
  5. Feb 18 10:55 | Execute | Bill negotiate | 0.87 | GV-2026-0218-EXC-011 | In Progress
  ...

Total decisions: 1,247
Human reviews completed: 89
Model versions: FraudDetectionV3.2, ForecastV2.1, OptimizeV1.8, ComplianceV4.0
```

**Decision Point**: "ガバナンスが機能しているか確認" → Audit Ledger で詳細確認

**Cross-thread**:
- Audit ID GV-2026-0218-PRT-001 は Alert Detail の同一インシデントに紐付く
- Compliance Score 96 は Dashboard の Audit Score 96 と一致
- 1,247 decisions は Landing の "Decisions Audited" と一致

---

### 3.7 `/grow` — "AI が成長経路を予測し比較"

**Section Map (Detail mode)**:

| # | Section | 内容 | Layout |
|---|---------|------|--------|
| 1 | **HeroSection** | "Growth Engine" + TrendingUp icon (violet) + view toggle + "Review Growth Plan" CTA | Full-width header |
| 2 | **KpiGrid** | 4 KPI cards: (1) Net Worth $127,400 ↑3.2% (2) Monthly Savings Rate 24% (3) Goal Progress 73% (4) Forecast Confidence 0.89 | 4-col grid |
| 3 | **GoalsSection** (左 2/3) | 3 goal cards: (1) Emergency Fund: $7,300 / $10,000 — 73% — "On track: Jul 2026" (2) Vacation Fund: $1,200 / $3,000 — 40% — "Needs boost" (3) Investment Growth: +8.2% YTD — Target 10% | Goal cards with progress bars |
| 4 | **GrowSidebar** (右 1/3) | (a) 30-day forecast mini chart (b) Top recommendation: "Increase auto-save by $50/mo" (c) Scenario comparison link | Sidebar |

**Representative Data**:
```
Net Worth: $127,400 (↑3.2% MoM)
Monthly Savings Rate: 24% of income
Forecast Confidence: 0.89

Goals:
  1. Emergency Fund: $7,300 / $10,000 (73%) — ETA Jul 2026
  2. Vacation Fund: $1,200 / $3,000 (40%) — ETA Nov 2026
  3. Investment Growth: +8.2% YTD — Target 10%
```

---

### 3.8 `/grow/scenarios` — "What-if シミュレーション"

**Signature Visual**: Side-by-side scenario comparison with Monte Carlo confidence bands

**Section Map**:

| # | Section | 内容 | Layout |
|---|---------|------|--------|
| 1 | **Header** | "Scenario Comparison" + back to Grow | Full-width |
| 2 | **Scenario Cards** | 3 scenarios side-by-side: (A) Conservative: keep current pace (B) Moderate: +$100/mo savings (C) Aggressive: +$250/mo + rebalance | 3-col comparison |
| 3 | **Projection Chart** | Line chart with 3 trajectories + confidence bands (p10/p50/p90) over 12 months | Full-width chart |
| 4 | **Impact Summary** | Table: Emergency Fund ETA, Net Worth at 12mo, Risk level per scenario | Comparison table |
| 5 | **Action** | "Send to Execute" CTA for selected scenario | Bottom bar |

**Representative Data**:
```
Scenarios:
  A. Conservative: Current pace → Emergency Fund complete Sep 2026, NW $135k at 12mo
  B. Moderate: +$100/mo → Emergency Fund complete Jun 2026, NW $141k at 12mo
  C. Aggressive: +$250/mo + rebalance → Emergency Fund complete Apr 2026, NW $149k at 12mo
     Risk: Higher market exposure, less liquidity buffer

Confidence bands: p10/p50/p90 for each scenario
Model: ForecastV2.1
```

---

### 3.9 `/execute/history` — "実行済みアクションの監査証跡"

**Section Map**:

| # | Section | 内容 | Layout |
|---|---------|------|--------|
| 1 | **Header** | "Execution History" + back to Execute | Full-width |
| 2 | **Stats Bar** | Total executed: 47, Success rate: 96%, Total saved: $3,240 YTD | 3-col stats |
| 3 | **History Table** | Sortable/filterable table: Date, Action, Engine, Result, Savings, Audit ID | Full-width table |
| 4 | **Action** | "Open Govern Trace" CTA → /govern/audit | Bottom |

---

### 3.10 `/govern/audit` — "不変の意思決定台帳"

**Section Map**:

| # | Section | 内容 | Layout |
|---|---------|------|--------|
| 1 | **Header** | "Audit Ledger" + "1,247 entries" badge + back to Govern | Full-width |
| 2 | **Filter Bar** | Engine filter (all/protect/grow/execute/govern) + date range + severity | Filter chips |
| 3 | **Ledger Table** | Immutable log: ID, Timestamp, Engine, Decision Type, Confidence, Model, Outcome, Hash | Full-width table, paginated |
| 4 | **Integrity Proof** | "Ledger hash verified: SHA-256 ...a3f7" + "Last verification: 30 seconds ago" | Footer proof line |

---

### 3.11 `/settings` — "制御の深さ"

**Section Map**:

| # | Section | 内容 | Layout |
|---|---------|------|--------|
| 1 | **Header** | "Settings" + "Review Rights Controls" CTA | Full-width |
| 2 | **Profile Section** | Name, email, avatar, plan (Pro) | Card |
| 3 | **AI Configuration** | Automation level slider, explanation detail level, risk tolerance | Card with toggles/sliders |
| 4 | **Integrations** | 6 cards: Plaid (Connected), Stripe (Connected), Coinbase (Pending), QuickBooks (Not connected), Robinhood (Connected), Email (Configured) | 3-col grid of status cards |
| 5 | **Privacy & Data** | Data sharing toggles, export data button, delete account | Card |
| 6 | **Notifications** | Per-engine notification preferences | Toggle grid |

---

### 3.12 Onboarding (4-step)

**Shared Layout**: Progress bar (1/4 to 4/4) + bottom action bar + trust copy

#### `/onboarding/connect` (Step 1)
- 4 account type cards: Bank (Chase), Credit (Amex), Investment (Vanguard), Crypto (Coinbase)
- 各カードに "Connect" button + "Read-only access" trust badge
- Mock: Chase already connected (green check)

#### `/onboarding/goals` (Step 2)
- Goal selection grid: Emergency Fund, Debt Payoff, Investment Growth, Vacation, Home Down Payment, Retirement
- 各ゴールに icon + toggle select
- Mock: Emergency Fund + Investment Growth pre-selected

#### `/onboarding/consent` (Step 3)
- 明示的な consent boundaries: (a) "AI can analyze" (b) "AI can recommend" (c) "AI requires approval before acting" (d) "AI will never access without consent"
- 各境界に toggle + explanation

#### `/onboarding/complete` (Step 4)
- Success animation + summary: 2 accounts connected, 2 goals set, consent boundaries configured
- "Enter Dashboard" primary CTA

---

### 3.13 Auth & Public Pages

#### `/pricing`
- 3-tier cards: Starter ($0), Pro ($19/mo), Enterprise (Contact)
- Feature comparison table (8-10 features)
- Annual/monthly toggle
- FAQ accordion (5 items)

#### `/signup`
- Dual panel: Left = marketing (brand message + 3 trust points), Right = form (name, email, password, terms checkbox)
- SSO buttons: Apple, Google
- Mock: form must be editable (not readOnly)

#### `/login`
- Single-panel form: email + password + "Remember me" + "Forgot password"
- SSO buttons
- "Don't have an account? Sign up" link

---

## 4. Cross-Screen Data Thread（画面間データ整合性）

v0 が各画面を個別に生成しても、以下のデータが全画面で一致する必要がある。Prompt に明記すること。

| Data Point | Value | 使用画面 |
|------------|-------|----------|
| System Confidence | 0.92 | Landing, Dashboard |
| Decisions Audited | 1,247 | Landing, Govern, Govern/Audit |
| Threats Blocked | 23 | Landing, (Protect は "3 active" — 残り 20 は resolved) |
| Critical Alert (THR-001) | $2,847 TechElectro Store | Dashboard feed, Protect table, Alert Detail, Execute action #4 |
| Compliance Score | 96/100 | Dashboard (Audit Score), Govern |
| Emergency Fund Progress | 73% ($7,300/$10,000) | Dashboard KPI, Grow goals |
| Pending Actions | 5 | Dashboard, Execute queue |
| Monthly Savings | $847 | Dashboard KPI, Execute sidebar |
| Audit ID format | GV-YYYY-MMDD-XXX | All GovernFooter instances |
| User name | Shinji | Dashboard greeting, Settings profile |

---

## 5. 実行計画

### Phase 1: Prompt 文書の更新 (本ドキュメント承認後)

1. `docs/v0-screen-prompts.md` を本ドキュメントの Section 3 内容で更新
2. 各ルートの prompt template に以下を追加:
   - Section Map（セクション順序 + レイアウト指定）
   - Representative Data（具体的なモック値）
   - Signature Visual（差別化要素）
   - Cross-thread references（他画面との整合性注記）
3. `src/contracts/rebuild-contracts.ts` の `ScreenBlueprint` に `sectionMap` フィールドを追加検討

### Phase 2: Tier 1 画面の v0 投入 (最優先)

| 順序 | 画面 | 理由 |
|------|------|------|
| 1 | `/` Landing | First impression、他全画面の design tone を決定 |
| 2 | `/dashboard` | 最も複雑、他画面への navigation hub |
| 3 | `/protect` | SHAP による差別化の最大ポイント |
| 4 | `/protect/alert-detail` | ShapWaterfall が MIT 評価者への技術的証明 |
| 5 | `/execute` | Human-in-the-loop の具体的 UX |
| 6 | `/govern` | ガバナンスの集大成 |

### Phase 3: Tier 2 画面 (Explorer Path)

| 順序 | 画面 |
|------|------|
| 7 | `/grow` |
| 8 | `/grow/scenarios` |
| 9 | `/execute/history` |
| 10 | `/govern/audit` |
| 11 | `/settings` |

### Phase 4: Tier 3 + Auth (Completeness)

| 順序 | 画面 |
|------|------|
| 12 | Onboarding 4 steps |
| 13 | `/pricing` |
| 14 | `/signup` + `/login` |

---

## 6. Prompt Template (Enhanced)

以下が更新後の各画面 prompt の標準テンプレート:

```markdown
Create/refresh `src/pages/<Page>.tsx` for route `<route>`.

## Context
- User intent: <what the user is trying to decide on this screen>
- Previous screen: <where they came from>
- Next screen: <where the primary CTA leads>

## Section Map (top to bottom)
1. <Section name> — <content description> — <layout: full-width / 2-col / grid>
2. ...

## Representative Data
<concrete mock values that v0 should use — not placeholders>

## Signature Visual
<the one visual element that makes this screen memorable>

## Cross-Screen Data
<values that must match other screens>

## Technical Requirements
- Use shared imports: GovernFooter, AuroraPulse from @/components/poseidon
- GOVERNANCE_META from @/lib/governance-meta
- Motion presets from @/lib/motion-presets
- Background #0B1221
- Skip link + main landmark (id="main-content")
- CTA budget: Primary=1, Secondary<=1
- No style={{}} and no hardcoded hex
- For evidence-required routes, render ShapWaterfall
- GovernFooter: auditId={GOVERNANCE_META['<route>'].auditId} pageContext={GOVERNANCE_META['<route>'].pageContext}

## View Modes (app pages only)
- Glance: <simplified layout description>
- Detail: <standard layout — Section Map above>
- Deep: <same as Detail with expanded data>
```

---

## 7. 成功基準

| 基準 | 測定方法 |
|------|----------|
| v0 が Section Map 通りの画面を生成する | 生成出力のセクション順序を検証 |
| Representative Data が反映される | 画面内の数値が指定値と一致 |
| Cross-thread データが全画面で一致 | 5 画面を並べて数値照合 |
| Signature Visual が実装される | Landing の sparkline、Alert Detail の ShapWaterfall 等が存在 |
| 30 秒で Golden Path の印象が成立する | Landing → Dashboard を 30 秒で閲覧し「本物のプロダクト」と判断されるか |
| MIT 評価者の 5 軸をカバー | Integration depth, Governance, Technical sophistication, Polish, Business viability |

---

## 8. リスクと対策

| リスク | 影響 | 対策 |
|--------|------|------|
| v0 が長い prompt を truncate する | セクションが欠落 | 1 画面 1 prompt（分割投入）、最重要セクションを先頭に配置 |
| v0 がカスタムコンポーネントを生成する | facade との重複 | "Do NOT create custom components for: GovernFooter, ShapWaterfall, AuroraPulse" を明記 |
| Mock data の不整合 | 画面間で数値が食い違い、「モック感」が露呈 | Cross-Screen Data Thread を各 prompt に含める |
| v0 出力が mobile 非対応 | QR → 携帯で崩れる | "Mobile-first: 375px must be primary layout target" を全 prompt に追加 |
| SHAP Waterfall を v0 が正しく描画できない | 最重要差別化要素の喪失 | ShapWaterfall は既存コンポーネントを import する指示を明記 |

---

*End of plan document. 承認後、`v0-screen-prompts.md` を本内容で更新する。*
