import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, GitBranch, Zap } from 'lucide-react';
import { Link } from '../router';
import { GovernFooter, ForecastBand, AuroraPulse } from '@/components/poseidon'
import { GOVERNANCE_META } from '@/lib/governance-meta'
import { usePageTitle } from '../hooks/use-page-title';
import { fadeUp, staggerContainer as stagger } from '@/lib/motion-presets';

/* ═══════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════ */

const scenarios = [
  { id: 'A', name: 'Aggressive Savings', income: '+0%', expense: '-20%', projectedBalance: '$48,200', delta: '+$8,400', runway: '+42 days', confidence: 82, risk: 'Medium', riskColor: 'text-amber-400', riskBg: 'bg-amber-500/20' },
  { id: 'B', name: 'Moderate Growth', income: '+10%', expense: '-5%', projectedBalance: '$44,600', delta: '+$4,800', runway: '+26 days', confidence: 91, risk: 'Low', riskColor: 'text-emerald-400', riskBg: 'bg-emerald-500/20' },
  { id: 'C', name: 'Conservative Hold', income: '+0%', expense: '+0%', projectedBalance: '$39,800', delta: '—', runway: 'Baseline', confidence: 96, risk: 'Minimal', riskColor: 'text-blue-400', riskBg: 'bg-blue-500/20' },
];

const scenarioFactors = [
  { label: 'Income stability', contribution: 0.94 },
  { label: 'Expense variance', contribution: 0.78 },
  { label: 'Savings rate impact', contribution: 0.85 },
  { label: 'Market conditions', contribution: 0.62 },
  { label: 'Seasonal patterns', contribution: -0.15 },
];

const forecastData: { x: number; median: number; low: number; high: number }[] = [
  { x: 0, median: 100, low: 95, high: 105 },
  { x: 1, median: 108, low: 98, high: 118 },
  { x: 2, median: 115, low: 100, high: 132 },
  { x: 3, median: 124, low: 104, high: 148 },
  { x: 4, median: 132, low: 108, high: 162 },
  { x: 5, median: 141, low: 112, high: 178 },
  { x: 6, median: 150, low: 115, high: 195 },
  { x: 7, median: 158, low: 118, high: 210 },
];

const horizonOptions = ['30d', '90d', '1yr'] as const;


/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */

export function GrowScenarios() {
  usePageTitle('Growth Scenarios');
  const [activeScenario, setActiveScenario] = useState('B');
  const [horizon, setHorizon] = useState<(typeof horizonOptions)[number]>('1yr');
  const [incomeAdj, setIncomeAdj] = useState(10);
  const [expenseAdj, setExpenseAdj] = useState(-5);
  const [_dirty, setDirty] = useState(false);

  const selected = scenarios.find((s) => s.id === activeScenario) ?? scenarios[1];

  return (
    <div className="relative min-h-screen w-full" style={{ background: '#0B1221' }}>
      <AuroraPulse color="var(--engine-grow)" intensity="subtle" />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-xl focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
        style={{ background: 'var(--engine-grow)', color: '#ffffff' }}
      >
        Skip to main content
      </a>

      <nav
        className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/[0.06]"
        style={{ background: 'rgba(11,18,33,0.8)' }}
        aria-label="Breadcrumb"
      >
        <div className="mx-auto px-4 md:px-6 lg:px-8 h-14 flex items-center gap-2" style={{ maxWidth: '1280px' }}>
          <Link
            to="/grow"
            className="flex items-center gap-1.5 text-sm font-medium hover:opacity-80 transition-opacity"
            style={{ color: 'var(--engine-grow)' }}
          >
            <ArrowLeft className="h-4 w-4" />
            Grow
          </Link>
          <span className="text-white/20">/</span>
          <span className="text-sm text-white/50">Scenarios</span>
        </div>
      </nav>

      <motion.div
        id="main-content"
        className="mx-auto flex flex-col gap-6 md:gap-8 px-4 py-6 md:px-6 md:py-8 lg:px-8"
        style={{ maxWidth: '1280px' }}
        variants={stagger}
        initial="hidden"
        animate="visible"
        role="main"
      >
        {/* Hero */}
        <motion.div variants={fadeUp} className="flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-1">
            <GitBranch className="h-5 w-5" style={{ color: 'var(--engine-grow)' }} />
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--engine-grow)' }}>
              Grow · Scenarios
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Financial Scenarios</h1>
          <p className="text-sm text-slate-400">Model financial outcomes under different assumptions — 10,000 Monte Carlo simulations.</p>
        </motion.div>

        {/* KPI bar */}
        <motion.div variants={fadeUp}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Scenarios', value: '3', color: 'var(--engine-grow)' },
              { label: 'Best delta', value: '+$8.4k', color: 'var(--engine-protect)' },
              { label: 'Avg confidence', value: '0.90', color: 'var(--engine-dashboard)' },
              { label: 'Horizon', value: horizon, color: 'var(--engine-govern)' },
            ].map((kpi) => (
              <div key={kpi.label} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
                <p className="text-xs text-white/40 mb-1">{kpi.label}</p>
                <p className="text-2xl font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 2-column layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main feed */}
          <motion.div variants={fadeUp} className="flex-1 min-w-0 lg:w-2/3 flex flex-col gap-4">
            {/* Scenario Controls */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 md:p-6">
              <h2 className="text-sm font-semibold text-white mb-4">Scenario Controls</h2>

              <div className="space-y-5">
                <div>
                  <label className="text-xs text-white/50 uppercase tracking-wider block mb-1">Scenario Name</label>
                  <input
                    type="text"
                    defaultValue={selected.name}
                    className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1"
                    style={{ '--tw-ring-color': 'var(--engine-grow)' } as React.CSSProperties}
                  />
                </div>

                <div>
                  <span className="text-xs text-white/50 uppercase tracking-wider block mb-1">
                    Income Adjustment: {incomeAdj > 0 ? '+' : ''}{incomeAdj}%
                  </span>
                  <input
                    type="range" min={-50} max={100} value={incomeAdj}
                    onChange={(e) => { setIncomeAdj(Number(e.target.value)); setDirty(true); }}
                    className="w-full cursor-pointer accent-violet-500"
                  />
                  <div className="flex justify-between text-[10px] text-white/30"><span>-50%</span><span>+100%</span></div>
                </div>

                <div>
                  <span className="text-xs text-white/50 uppercase tracking-wider block mb-1">
                    Expense Adjustment: {expenseAdj > 0 ? '+' : ''}{expenseAdj}%
                  </span>
                  <input
                    type="range" min={-50} max={50} value={expenseAdj}
                    onChange={(e) => { setExpenseAdj(Number(e.target.value)); setDirty(true); }}
                    className="w-full cursor-pointer accent-violet-500"
                  />
                  <div className="flex justify-between text-[10px] text-white/30"><span>-50%</span><span>+50%</span></div>
                </div>

                <div>
                  <span className="text-xs text-white/50 uppercase tracking-wider block mb-2">Forecast Horizon</span>
                  <div className="flex gap-2">
                    {horizonOptions.map((h) => (
                      <button
                        key={h}
                        onClick={() => setHorizon(h)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${horizon === h ? 'text-violet-300 border-violet-500/40' : 'text-white/50 border-white/10 bg-white/5 hover:bg-white/10'}`}
                        style={horizon === h ? { background: 'rgba(139,92,246,0.15)' } : {}}
                      >
                        {h}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    className="flex-1 rounded-xl text-white text-sm font-semibold py-2.5 hover:opacity-90 transition-opacity"
                    style={{ background: 'var(--engine-grow)' }}
                  >
                    Run Scenario
                  </button>
                  <button
                    onClick={() => { setIncomeAdj(10); setExpenseAdj(-5); setDirty(false); }}
                    className="rounded-xl bg-white/5 border border-white/10 text-white/60 text-sm px-4 py-2.5 hover:bg-white/10 transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </div>
              <p className="text-xs text-white/30 mt-3">10,000 Monte Carlo simulations · Confidence bands from historical variance · ScenarioEngine v1.4</p>
            </div>

            {/* Forecast visualization */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 md:p-6">
              <h2 className="text-sm font-semibold text-white mb-4">Forecast Projection ({horizon})</h2>
              <div className="h-48 rounded-xl flex flex-col items-center justify-center gap-2" style={{ background: 'linear-gradient(to bottom, rgba(139,92,246,0.1), transparent)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <ForecastBand data={forecastData} width={320} height={120} engine="grow" className="mx-auto" />
                <p className="text-2xl font-bold" style={{ color: 'var(--engine-grow)' }}>{selected.projectedBalance}</p>
              </div>
              <p className="text-xs text-white/30 mt-2">Projected balance: {selected.projectedBalance} · Delta: {selected.delta} · Horizon: {horizon}</p>
            </div>

            {/* Results comparison */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 md:p-6">
              <h2 className="text-sm font-semibold text-white mb-4">Results Comparison</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4" style={{ borderLeftWidth: 2, borderLeftColor: 'rgba(255,255,255,0.2)' }}>
                  <p className="text-xs text-white/50 uppercase tracking-wider">Baseline</p>
                  <p className="text-2xl font-bold text-white mt-1">$39,800</p>
                  <div className="mt-3 space-y-1 text-xs text-white/50">
                    <p>Delta: <span className="text-white/70">—</span></p>
                    <p>Runway: <span className="text-white/70">Baseline</span></p>
                    <p>Confidence: <span className="text-white/70">96%</span></p>
                  </div>
                </div>
                <div className="rounded-xl border border-violet-500/30 bg-violet-500/5 p-4" style={{ borderLeftWidth: 2, borderLeftColor: 'var(--engine-grow)' }}>
                  <p className="text-xs uppercase tracking-wider" style={{ color: 'var(--engine-grow)' }}>{selected.name}</p>
                  <p className="text-2xl font-bold text-white mt-1">{selected.projectedBalance}</p>
                  <div className="mt-3 space-y-1 text-xs text-white/50">
                    <p>Delta: <span className="text-violet-300">{selected.delta}</span></p>
                    <p>Runway: <span className="text-violet-300">{selected.runway}</span></p>
                    <p>Confidence: <span className="text-violet-300">{selected.confidence}%</span></p>
                  </div>
                </div>
              </div>
            </div>

            {/* AI recommendation */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 md:p-6" style={{ borderLeftWidth: 2, borderLeftColor: 'var(--engine-grow)' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold" style={{ background: 'rgba(139,92,246,0.2)', color: 'var(--engine-grow)' }}>AI</div>
                <div>
                  <p className="text-sm text-white">Scenario B is achievable with <span className="font-semibold" style={{ color: 'var(--engine-grow)' }}>91% probability</span>.</p>
                  <p className="text-xs text-white/50 mt-1">Based on your income stability and historical expense patterns, moderate growth has the best risk-adjusted return.</p>
                </div>
              </div>
              <p className="text-xs text-white/30 mt-2 mb-4">91% achievability · Historical spending patterns + income stability · Monte Carlo simulation</p>
              <div className="flex gap-3">
                <Link
                  to="/execute"
                  className="px-4 py-2 rounded-lg text-white text-xs font-semibold hover:opacity-90 transition-opacity"
                  style={{ background: 'var(--engine-grow)' }}
                >
                  Send to Execute
                </Link>
                <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/60 text-xs hover:bg-white/10 transition-colors">Save Scenario</button>
              </div>
            </div>
          </motion.div>

          {/* Side rail */}
          <aside className="w-full lg:w-72 shrink-0 flex flex-col gap-4" aria-label="Scenarios sidebar">
            {/* Scenario selector */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
              <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-3">Saved Scenarios</h3>
              <div className="space-y-2">
                {scenarios.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setActiveScenario(s.id)}
                    className={`w-full text-left rounded-xl p-3 transition-colors border ${activeScenario === s.id ? 'border-violet-500/30' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                    style={activeScenario === s.id ? { background: 'rgba(139,92,246,0.08)' } : {}}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-white">{s.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${s.riskBg} ${s.riskColor}`}>{s.risk}</span>
                    </div>
                    <p className="text-xs text-white/40 mt-1">Delta: {s.delta} · Conf: {s.confidence}%</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Confidence ring */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 flex flex-col items-center">
              <div className="relative" aria-label={`Scenario confidence: ${selected.confidence}%`}>
                <svg width="80" height="80" viewBox="0 0 80 80" aria-hidden="true">
                  <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
                  <circle
                    cx="40" cy="40" r="32" fill="none" stroke="var(--engine-grow)" strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${(selected.confidence / 100) * 2 * Math.PI * 32} ${2 * Math.PI * 32}`}
                    transform="rotate(-90 40 40)"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-bold text-white">{selected.confidence}%</span>
                </div>
              </div>
              <p className="text-xs text-white/50 mt-2">Confidence</p>
              <p className="text-[10px] text-white/30 text-center">Monte Carlo confidence for {selected.name}</p>
            </div>

            {/* Projection factors */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="h-4 w-4" style={{ color: 'var(--engine-grow)' }} />
                <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider">Projection Factors</h3>
              </div>
              <div className="space-y-2.5">
                {scenarioFactors.map((f) => (
                  <div key={f.label} className="flex items-center gap-2">
                    <span className="text-xs text-white/50 w-28 shrink-0 truncate">{f.label}</span>
                    <div className="flex-1 h-1.5 rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${Math.abs(f.contribution) * 100}%`, background: f.contribution > 0 ? 'var(--engine-grow)' : 'var(--state-critical)', opacity: 0.7 }}
                      />
                    </div>
                    <span className="text-xs text-white/40 w-8 text-right">{f.contribution > 0 ? '+' : ''}{f.contribution.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>

        <GovernFooter auditId={GOVERNANCE_META['/grow/scenarios'].auditId} pageContext={GOVERNANCE_META['/grow/scenarios'].pageContext} />
      </motion.div>
    </div>
  );
}

export default GrowScenarios;
