/**
 * Dashboard Block — Poseidon化 version
 *
 * Architecture B adaptation of the command-center dashboard.
 * Applies the 10-step Poseidon化 checklist:
 *  1. React Router imports (no Next.js)
 *  2. Layer 1 shadcn/ui CSS verified
 *  3. GlassCard wrapping all cards
 *  4. Engine props on all facade components
 *  5. GovernFooter via PageShell
 *  6. ProofLine evidence rows
 *  7. Framer Motion presets (fadeUp, stagger)
 *  8. Sparkline + ScoreRing for KPI numbers
 *  9. Mobile-first responsive (375px safe)
 * 10. Accessibility (aria-labels, keyboard nav)
 */
import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from '@/router'

// Poseidon facades
import {
  GlassCard,
  EngineBadge,
  ScoreRing,
  TrustPulse,
  ProofLine,
  NeonText,
  Sparkline,
} from '@/components/poseidon'

// Layout
import { PageShell } from '@/components/layout'
import { Section } from '@/components/layout'

// Motion presets
import {
  fadeUp,
  staggerContainer,
  staggerItem,
  pageTransition,
  pageTransitionConfig,
} from '@/lib/motion-presets'

// Existing domain components (kept as-is, wrapped in GlassCard)
import { TrustIndexCard } from '@/components/TrustIndexCard'
import { ExplainableInsightPanel } from '@/components/ExplainabilityPanel'
import { ForecastBandChart } from '@/components/ForecastBandChart'
import { AlertsHub } from '@/components/AlertsHub'
import { DashboardInsightsPanel } from '@/components/DashboardInsightsPanel'
import { NetWorthHero } from '@/components/NetWorthHero'
import { RiskScoreDial } from '@/components/RiskScoreDial'
import { MissionActionList } from '@/components/MissionActionList'
import { ActivityTimeline } from '@/components/ActivityTimeline'
import { EngineHealthStrip } from '@/components/EngineHealthStrip'
import type { EngineKey } from '@/components/EngineIconBadge'

// Services & hooks
import { generateCashFlowForecast } from '@/services/mockGrow'
import { useTimeContext } from '@/hooks/useTimeContext'

// ── Static mock data ─────────────────────────────────────────

const engineRows: Array<{
  key: EngineKey
  status: string
  score: string
  tone: 'teal' | 'violet' | 'amber' | 'blue'
}> = [
  { key: 'Protect', status: '0 threats in 24h', score: '0.94', tone: 'teal' },
  { key: 'Grow', status: 'Forecast recalculated 2h ago', score: '0.89', tone: 'violet' },
  { key: 'Execute', status: '3 actions awaiting review', score: '0.91', tone: 'amber' },
  { key: 'Govern', status: 'Last audit pass: clean', score: '0.97', tone: 'blue' },
]

const trustComponents: Array<{
  label: string
  score: number
  trend: 'up' | 'down' | 'stable'
}> = [
  { label: 'Protect', score: 94, trend: 'stable' },
  { label: 'Grow', score: 89, trend: 'up' },
  { label: 'Execute', score: 91, trend: 'stable' },
  { label: 'Govern', score: 97, trend: 'up' },
]

const actionQueue = [
  {
    title: 'Consolidate 3 overlapping subscriptions',
    meta: 'Projected save $140/mo (92% confidence)',
    tone: 'warning' as const,
  },
  {
    title: 'Adjust cash buffer target',
    meta: 'Current: 14d | Target: 21d (Protect threshold)',
    tone: 'primary' as const,
  },
  {
    title: 'Review flagged vendor risk',
    meta: 'Confidence 0.94 | Source: Protect anomaly detector',
    tone: 'warning' as const,
  },
]

const kpiData = {
  netPosition: [780, 795, 810, 805, 830, 847],
  cashFlow: [3.2, 3.8, 3.5, 4.0, 3.9, 4.1],
  risk: [3, 2, 2, 1, 1, 1],
  alerts: [5, 4, 3, 2, 3, 2],
}

// ── Component ────────────────────────────────────────────────

export function DashboardBlock() {
  const [selectedEngine, setSelectedEngine] = useState<EngineKey>('Protect')
  const { period, greeting } = useTimeContext()
  const forecastData = useMemo(() => generateCashFlowForecast(30), [])

  // ── Hero ──
  const hero = (
    <div className="relative px-4 py-6 md:px-6 md:py-8">
      {/* Ambient trust pulse glow */}
      <TrustPulse engine="dashboard" size={300} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto">
        <p className="text-xs font-medium tracking-widest uppercase text-white/40 mb-1">
          Dashboard
        </p>
        <NeonText engine="dashboard" as="h1" gradient className="text-2xl md:text-3xl font-bold mb-2">
          {greeting}
        </NeonText>
        <p className="text-sm text-white/50 mb-4">
          System confidence: 0.92 across 4 engines. One unresolved alert. Three actions queued.
        </p>

        {/* KPI strip */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-3"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {[
            { label: 'Net position', value: '$847k', delta: '+8.2%', data: kpiData.netPosition, engine: 'protect' as const },
            { label: 'Cash flow', value: '+$4.1k', delta: '+12%', data: kpiData.cashFlow, engine: 'dashboard' as const },
            { label: 'Risk', value: 'Low', delta: 'Down from Med', data: kpiData.risk, engine: 'govern' as const },
            { label: 'Alerts', value: '2', delta: '-3 resolved', data: kpiData.alerts, engine: 'execute' as const },
          ].map((kpi) => (
            <motion.div key={kpi.label} variants={staggerItem}>
              <GlassCard engine={kpi.engine} blur="sm" className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[11px] text-white/40 truncate">{kpi.label}</p>
                  <p className="text-lg font-bold font-mono leading-tight">{kpi.value}</p>
                  <p className="text-[11px] text-white/50">{kpi.delta}</p>
                </div>
                <Sparkline data={kpi.data} engine={kpi.engine} width={64} height={24} />
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>

        {/* Hero action callout */}
        <motion.div variants={fadeUp} initial="initial" animate="animate" transition={{ delay: 0.3 }}>
          <GlassCard engine="execute" blur="sm" className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <EngineBadge engine="execute" size="sm" glow>Top recommendation</EngineBadge>
            <span className="text-sm text-white/70 flex-1">
              Consolidate 3 overlapping subscriptions — projected save $140/mo (92% confidence)
            </span>
            <Link
              className="text-xs font-medium text-amber-400 hover:text-amber-300 shrink-0"
              to="/execute"
            >
              Review in Execute →
            </Link>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  )

  return (
    <PageShell engine="dashboard" hero={hero}>
      <motion.div
        variants={pageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={pageTransitionConfig}
      >
        {/* Engine health strip */}
        <div className="mb-5">
          <EngineHealthStrip
            engines={engineRows}
            selected={selectedEngine}
            onSelect={setSelectedEngine}
          />
        </div>

        {/* Two-column layout: primary feed + decision rail */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* ── PRIMARY FEED (2/3) ── */}
          <motion.div
            className="lg:col-span-2 flex flex-col gap-5"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {/* Section 1: Trust Pulse */}
            <motion.div variants={staggerItem}>
              <Section title="System trust" subtitle="Composite confidence across all four engines." engine="dashboard">
                <GlassCard engine="dashboard">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    <ScoreRing value={92} label="Trust" size="lg" engine="dashboard" />
                    <div className="flex-1 min-w-0">
                      <TrustIndexCard
                        score={92}
                        trend="stable"
                        components={trustComponents}
                        updatedAt="2 hours ago"
                      />
                    </div>
                  </div>
                  <ProofLine
                    source="Real-time weighted composite — Protect 0.94 | Grow 0.89 | Execute 0.91 | Govern 0.97"
                    confidence={92}
                    timestamp="2h ago"
                    engine="dashboard"
                  />
                </GlassCard>
              </Section>
            </motion.div>

            {/* Section 2: AI Insight / Explainable Panel */}
            <motion.div variants={staggerItem}>
              <Section title="AI insight" engine="grow">
                <GlassCard engine="grow">
                  <ExplainableInsightPanel
                    title="Top recommendation rationale"
                    summary="Consolidate 3 overlapping subscriptions across streaming, productivity, and storage. Combined monthly cost: $287. Deduplicated target: $147."
                    topFactors={[
                      { label: 'Cost overlap', contribution: 0.82, note: '$140/mo redundant' },
                      { label: 'Usage frequency', contribution: 0.45, note: '2 of 3 used < 1x/week' },
                      { label: 'Contract flexibility', contribution: 0.71, note: 'All month-to-month' },
                    ]}
                    confidence={0.92}
                    recency="2h ago"
                    governMeta={{
                      auditId: 'GV-2026-0212-DASH-REC',
                      modelVersion: 'v3.2',
                      explanationVersion: 'xai-2.1',
                      timestamp: new Date().toISOString(),
                    }}
                  />
                  <ProofLine
                    source="Grow engine model v3.2 — subscription analysis"
                    confidence={92}
                    engine="grow"
                  />
                </GlassCard>
              </Section>
            </motion.div>

            {/* Section 3: Cash flow forecast */}
            <motion.div variants={staggerItem}>
              <Section
                title="Cash flow forecast"
                subtitle={`Projection driven by ${selectedEngine} engine signals.`}
                engine="grow"
              >
                <GlassCard engine="grow">
                  <div className="w-full overflow-x-auto -mx-1 px-1">
                    <ForecastBandChart data={forecastData} height={260} historicalCount={5} />
                  </div>
                  <ProofLine
                    source="Monte Carlo simulation — 1000 paths, 90% confidence band — Grow engine model v3.2"
                    confidence={90}
                    engine="grow"
                  />
                </GlassCard>
              </Section>
            </motion.div>

            {/* Section 4: Alerts Hub */}
            <motion.div variants={staggerItem}>
              <Section title="Alerts" engine="protect">
                <GlassCard engine="protect">
                  <AlertsHub />
                </GlassCard>
              </Section>
            </motion.div>

            {/* Section 5: Insights */}
            <motion.div variants={staggerItem}>
              <Section
                title={period === 'morning' ? 'Morning briefing' : 'Day in review'}
                engine="dashboard"
              >
                <GlassCard engine="dashboard">
                  <DashboardInsightsPanel variant={period === 'morning' ? 'morning' : 'evening'} />
                </GlassCard>
              </Section>
            </motion.div>
          </motion.div>

          {/* ── DECISION RAIL (1/3) ── */}
          <motion.div
            className="flex flex-col gap-5"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {/* Net worth hero */}
            <motion.div variants={staggerItem}>
              <GlassCard engine="grow">
                <NetWorthHero
                  total="$847,200"
                  change="+$12,400 (+1.5%)"
                  trend="up"
                  period="vs last month"
                  glowColor="var(--engine-grow)"
                />
                <ProofLine
                  source="Linked account balances — net of pending transfers"
                  engine="grow"
                />
              </GlassCard>
            </motion.div>

            {/* Risk gauge */}
            <motion.div variants={staggerItem}>
              <GlassCard engine="protect">
                <h3 className="text-sm font-semibold text-green-400 mb-3">Threat level</h3>
                <div className="flex items-center gap-4">
                  <ScoreRing value={12} label="Risk" size="sm" engine="protect" />
                  <RiskScoreDial score={0.12} band="low" trend="down" trendDelta="-0.05" />
                </div>
                <ProofLine
                  source="Protect threat model — 0 critical signals, 1 medium (resolved), trend declining"
                  confidence={94}
                  engine="protect"
                />
              </GlassCard>
            </motion.div>

            {/* Next best actions */}
            <motion.div variants={staggerItem}>
              <GlassCard engine="execute">
                <h3 className="text-sm font-semibold text-amber-400 mb-1">Next best actions</h3>
                <p className="text-[11px] text-white/40 mb-3">Ranked by projected impact across all engines.</p>
                <MissionActionList items={actionQueue} />
                <ProofLine
                  source="Execute engine priority queue — ranked by projected impact, model v3.2"
                  confidence={91}
                  engine="execute"
                />
                <div className="flex gap-2 mt-3">
                  <Link
                    className="text-xs font-medium text-amber-400 hover:text-amber-300"
                    to="/execute"
                  >
                    Open action queue →
                  </Link>
                  <Link
                    className="text-xs font-medium text-blue-400 hover:text-blue-300"
                    to="/govern"
                  >
                    Audit trail →
                  </Link>
                </div>
              </GlassCard>
            </motion.div>

            {/* Activity timeline */}
            <motion.div variants={staggerItem}>
              <GlassCard engine="dashboard">
                <ActivityTimeline />
                <ProofLine
                  source="Activity ledger — Execute (2), Protect (1), Grow (1), Govern (1) — last 12h"
                  engine="dashboard"
                />
              </GlassCard>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </PageShell>
  )
}

export default DashboardBlock
