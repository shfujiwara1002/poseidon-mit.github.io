import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Target, TrendingUp } from 'lucide-react';
import { Link } from '../router';
import { GovernFooter } from '../components/dashboard/GovernFooter';

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.2, 0.8, 0.2, 1] } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

/* ═══════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════ */

const goal = { name: 'Emergency Fund', current: 8160, target: 12000 };
const progressPct = Math.round((goal.current / goal.target) * 100);
const remaining = goal.target - goal.current;

const contributionData = [
  { month: 'Sep', amount: 400 }, { month: 'Oct', amount: 500 },
  { month: 'Nov', amount: 450 }, { month: 'Dec', amount: 550 },
  { month: 'Jan', amount: 500 }, { month: 'Feb', amount: 520 },
];

const milestones = [
  { label: 'Goal created', date: 'Jan 2026', done: true },
  { label: '$2k saved', date: 'Jan 15', done: true },
  { label: '$5k saved', date: 'Feb 1', done: true },
  { label: '$8k saved (current)', date: 'Feb 15', done: false, current: true },
  { label: '$12k target', date: 'May 2026', done: false },
];

const healthCategories = [
  { name: 'Savings rate', score: 85 },
  { name: 'Consistency', score: 78 },
  { name: 'Growth rate', score: 72 },
];

const circumference = 2 * Math.PI * 40;

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */

export function GrowGoalDetail() {
  return (
    <div className="min-h-screen w-full" style={{ background: '#0B1221' }}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-xl focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
        style={{ background: '#8B5CF6', color: '#ffffff' }}
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
            style={{ color: '#8B5CF6' }}
          >
            <ArrowLeft className="h-4 w-4" />
            Grow
          </Link>
          <span className="text-white/20">/</span>
          <span className="text-sm text-white/50">Goal Detail</span>
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
            <Target className="h-5 w-5" style={{ color: '#8B5CF6' }} />
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#8B5CF6' }}>
              Grow · Goal Detail
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">{goal.name}</h1>
          <p className="text-sm text-slate-400">
            On track — {progressPct}% complete · Projected completion: May 2026 · Confidence 0.87
          </p>
        </motion.div>

        {/* KPI bar */}
        <motion.div variants={fadeUp}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Progress', value: `${progressPct}%`, color: '#8B5CF6' },
              { label: 'Monthly avg', value: '$500', color: '#22C55E' },
              { label: 'Confidence', value: '0.87', color: '#00F0FF' },
              { label: 'Months left', value: '3', color: '#EAB308' },
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
            {/* Progress ring + amounts */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 md:p-6 flex flex-col md:flex-row items-center gap-6">
              <div className="relative shrink-0" aria-label={`${progressPct}% progress`}>
                <svg width="96" height="96" viewBox="0 0 96 96" aria-hidden="true">
                  <circle cx="48" cy="48" r="40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                  <circle
                    cx="48" cy="48" r="40" fill="none" stroke="#8B5CF6" strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${(progressPct / 100) * circumference} ${circumference}`}
                    transform="rotate(-90 48 48)"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-white">{progressPct}%</span>
                  <span className="text-[10px] text-white/40">Progress</span>
                </div>
              </div>
              <div className="flex-1 w-full">
                <p className="text-lg font-semibold text-white">${goal.current.toLocaleString()} saved</p>
                <p className="text-sm text-slate-400 mt-0.5">of ${goal.target.toLocaleString()} target · ${remaining.toLocaleString()} remaining</p>
                <div className="mt-3 h-2 rounded-full bg-white/10">
                  <div className="h-full rounded-full transition-all" style={{ width: `${progressPct}%`, background: '#8B5CF6' }} />
                </div>
                <p className="text-xs text-white/40 mt-1">On track — Projected completion May 2026</p>
              </div>
            </div>

            {/* Monthly contributions */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 md:p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-4 w-4" style={{ color: '#8B5CF6' }} />
                <h2 className="text-sm font-semibold text-white">Monthly Contributions</h2>
              </div>
              <div className="flex items-end gap-2 h-20 mb-2">
                {contributionData.map((d) => (
                  <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full rounded-sm"
                      style={{ height: `${(d.amount / 600) * 100}%`, background: d.amount >= 500 ? '#8B5CF6' : 'rgba(139,92,246,0.4)' }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between">
                {contributionData.map((d) => (
                  <div key={d.month} className="flex-1 text-center">
                    <p className="text-[10px] text-white/30">{d.month}</p>
                    <p className="text-[10px] text-white/50">${d.amount}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 mt-3">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-[10px] text-white/30">Target: $500/mo</span>
              </div>
              <p className="text-xs text-white/30 mt-2">Projected completion: May 2026 · Confidence 0.87 · GoalTracker v2.1</p>
            </div>

            {/* AI recommendation */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 md:p-6" style={{ borderLeftWidth: 3, borderLeftColor: '#8B5CF6' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold" style={{ background: 'rgba(139,92,246,0.2)', color: '#8B5CF6' }}>AI</div>
                <div>
                  <p className="text-sm font-semibold text-white">AI Recommendation</p>
                  <p className="text-xs text-white/50 mt-1">Increasing monthly contribution by $100 would accelerate completion by 3 weeks.</p>
                </div>
              </div>
              <p className="text-xs text-white/30">+$100/mo brings completion to early May 2026 · Acceleration possible · GoalTracker v2.1</p>
              <div className="flex gap-3 mt-4">
                <Link
                  to="/execute"
                  className="px-4 py-2 rounded-lg text-white text-xs font-semibold hover:opacity-90 transition-opacity"
                  style={{ background: '#8B5CF6' }}
                >
                  Add Funds
                </Link>
                <Link to="/grow" className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/60 text-xs hover:bg-white/10 transition-colors">
                  Back to Grow
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Side rail */}
          <aside className="w-full lg:w-72 shrink-0 flex flex-col gap-4" aria-label="Goal detail sidebar">
            {/* Goal health */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
              <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-3">Goal Health</h3>
              <div className="space-y-3">
                {healthCategories.map((cat) => (
                  <div key={cat.name}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-white/50">{cat.name}</span>
                      <span className="text-white/70">{cat.score}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/10">
                      <div className="h-full rounded-full" style={{ width: `${cat.score}%`, background: '#8B5CF6' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Milestones */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
              <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-3">Goal Milestones</h3>
              <div className="space-y-3">
                {milestones.map((m) => (
                  <div key={m.label} className="flex items-start gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full mt-0.5 shrink-0 ${m.done ? 'bg-emerald-400' : m.current ? 'bg-violet-400 animate-pulse' : 'bg-white/20'}`} />
                    <div>
                      <p className={`text-xs ${m.done ? 'text-white/50 line-through' : m.current ? 'text-white font-medium' : 'text-white/50'}`}>{m.label}</p>
                      <p className="text-[10px] text-white/30">{m.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
              <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-3">Statistics</h3>
              <div className="space-y-2.5">
                {[
                  { label: 'Total saved', value: `$${goal.current.toLocaleString()}`, color: 'text-violet-400' },
                  { label: 'Remaining', value: `$${remaining.toLocaleString()}`, color: 'text-white/70' },
                  { label: 'Avg monthly', value: '$493', color: 'text-white/70' },
                  { label: 'Best month', value: '$550 (Dec)', color: 'text-emerald-400' },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between">
                    <span className="text-xs text-white/50">{row.label}</span>
                    <span className={`text-xs font-medium ${row.color}`}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>

        <GovernFooter />
      </motion.div>
    </div>
  );
}

export default GrowGoalDetail;
