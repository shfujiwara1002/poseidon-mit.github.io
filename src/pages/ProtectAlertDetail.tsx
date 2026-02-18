import React, { useState } from 'react';
import { useRouter } from '../router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  AlertTriangle,
  MapPin,
  CreditCard,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  CircleDot,
} from 'lucide-react';
import { usePageTitle } from '../hooks/use-page-title';
import { GovernFooter, ShapWaterfall, AuroraPulse } from '@/components/poseidon';
import { GOVERNANCE_META } from '@/lib/governance-meta';
import { fadeUp, staggerContainer as stagger } from '@/lib/motion-presets';

/* ═══════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════ */

interface EvidenceItem {
  id: string;
  title: string;
  score: number;
  details: string;
  model?: string;
}

interface TimelineStep {
  label: string;
  time: string;
  status: 'complete' | 'active';
}

interface SimilarIncident {
  title: string;
  time: string;
  result: string;
}

/* ═══════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════ */

const timelineSteps: TimelineStep[] = [
  { label: 'Signal detected', time: '14:28', status: 'complete' },
  { label: 'Analysis complete', time: '14:29', status: 'complete' },
  { label: 'Alert raised', time: '14:30', status: 'complete' },
  { label: 'User notified', time: '14:31', status: 'complete' },
  { label: 'Resolution pending', time: 'Now', status: 'active' },
];

const evidenceItems: EvidenceItem[] = [
  {
    id: 'e1',
    title: 'Transaction Pattern Deviation',
    score: 0.96,
    details: 'Amount 3.2x above category average ($1,312)',
    model: 'FraudDetection v3.2',
  },
  {
    id: 'e2',
    title: 'Merchant Risk Score',
    score: 0.87,
    details: 'Merchant flagged in 12 previous incidents',
    model: 'MerchantReputation v2.1',
  },
  {
    id: 'e3',
    title: 'Geographic Anomaly',
    score: 0.95,
    details: 'IP location 4,200 miles from usual pattern',
    model: 'GeoAnalyzer v1.8',
  },
  {
    id: 'e4',
    title: 'Velocity Check',
    score: 0.72,
    details: '3rd transaction in 2 hours (unusual)',
  },
  {
    id: 'e5',
    title: 'Behavioral Analysis',
    score: 0.91,
    details: 'Time of day deviates from 180-day pattern',
  },
];

const similarIncidents: SimilarIncident[] = [
  { title: 'MerchantX flagged', time: '2 weeks ago', result: 'Blocked' },
  { title: 'Unusual pattern', time: '3 weeks ago', result: 'Verified safe' },
  { title: 'High-risk geo', time: '1 month ago', result: 'Blocked' },
];

/* ═══════════════════════════════════════════
   UTILITY HELPERS
   ═══════════════════════════════════════════ */

function getScoreColor(s: number): string {
  if (s >= 0.9) return 'var(--state-critical)';
  if (s >= 0.8) return 'var(--state-warning)';
  return 'var(--engine-govern)';
}

function getScoreBg(s: number): string {
  if (s >= 0.9) return 'rgba(var(--state-critical-rgb),0.12)';
  if (s >= 0.8) return 'rgba(var(--state-warning-rgb),0.12)';
  return 'rgba(59,130,246,0.12)';
}

/* ═══════════════════════════════════════════
   GLASS CARD COMPONENT
   ═══════════════════════════════════════════ */

function GlassCard({
  children,
  className = '',
  borderColor,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { borderColor?: string }) {
  return (
    <div
      className={`rounded-2xl border border-white/[0.06] p-4 md:p-6 ${className}`}
      style={{
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
        ...(borderColor ? { borderLeftWidth: '2px', borderLeftColor: borderColor } : {}),
      }}
      {...props}
    >
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════
   HEADER
   ═══════════════════════════════════════════ */

function AlertHeader() {
  return (
    <motion.section
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-4"
    >
      <motion.div variants={fadeUp}>
        <button
          className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all hover:bg-white/[0.04] cursor-pointer"
          style={{ color: '#94A3B8', background: 'transparent', border: 'none' }}
          aria-label="Return to Protect dashboard"
        >
          <ArrowLeft size={16} />
          Back to Protect
        </button>
      </motion.div>

      <motion.div variants={fadeUp} className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-1">
          <h1
            className="text-xl md:text-3xl font-bold tracking-tight"
            style={{ fontFamily: 'var(--font-display)', color: '#F1F5F9' }}
          >
            Signal #PRT-2026-0216-003
          </h1>
          <span className="text-xs" style={{ color: '#64748B' }}>
            Detected: Today 14:28 | Updated: 14:30
          </span>
        </div>
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wider self-start"
          style={{ background: 'rgba(var(--state-critical-rgb),0.15)', color: 'var(--state-critical)' }}
          aria-label="Alert status: Critical"
        >
          <AlertTriangle size={12} />
          CRITICAL
        </span>
      </motion.div>
    </motion.section>
  );
}

/* ═══════════════════════════════════════════
   ALERT SUMMARY
   ═══════════════════════════════════════════ */

function AlertSummary() {
  return (
    <motion.div variants={fadeUp}>
      <GlassCard borderColor="#EF4444" className="engine-section flex flex-col gap-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-wider" style={{ color: '#64748B' }}>Merchant</span>
            <span className="text-sm font-semibold" style={{ color: '#F1F5F9' }}>MerchantX</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-wider" style={{ color: '#64748B' }}>Amount</span>
            <span className="text-lg font-bold font-mono tabular-nums" style={{ color: 'var(--state-critical)' }}>$4,200.00</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-wider" style={{ color: '#64748B' }}>Confidence</span>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-20 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div className="h-full rounded-full" style={{ width: '97%', background: 'var(--state-critical)' }} />
              </div>
              <span className="text-sm font-mono font-semibold" style={{ color: 'var(--state-critical)' }}>97%</span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-wider" style={{ color: '#64748B' }}>Alert type</span>
            <span className="text-sm" style={{ color: '#CBD5E1' }}>Unusual transaction pattern</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-wider" style={{ color: '#64748B' }}>Account</span>
            <div className="flex items-center gap-1">
              <CreditCard size={12} style={{ color: '#64748B' }} />
              <span className="text-sm font-mono" style={{ color: '#CBD5E1' }}>Checking ****4567</span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-wider" style={{ color: '#64748B' }}>Location</span>
            <div className="flex items-center gap-1">
              <MapPin size={12} style={{ color: '#64748B' }} />
              <span className="text-sm" style={{ color: '#CBD5E1' }}>Online | IP: 203.0.113.42</span>
            </div>
            <span className="text-[10px] font-semibold" style={{ color: 'var(--state-critical)' }}>Flagged region</span>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   TIMELINE
   ═══════════════════════════════════════════ */

function AlertTimeline() {
  return (
    <motion.div variants={fadeUp}>
      <GlassCard className="flex flex-col gap-4">
        {/* Desktop horizontal */}
        <div className="hidden md:flex items-center justify-between" role="list" aria-label="Alert timeline">
          {timelineSteps.map((step, i) => (
            <React.Fragment key={step.label}>
              <div className="flex flex-col items-center gap-2" role="listitem">
                <div
                  className={`flex items-center justify-center rounded-full ${step.status === 'active' ? 'animate-pulse' : ''}`}
                  style={{
                    width: 28,
                    height: 28,
                    background: step.status === 'complete'
                      ? 'rgba(16,185,129,0.15)'
                      : 'rgba(var(--state-warning-rgb),0.15)',
                  }}
                >
                  {step.status === 'complete' ? (
                    <CheckCircle2 size={14} style={{ color: 'var(--state-healthy)' }} />
                  ) : (
                    <CircleDot size={14} style={{ color: 'var(--state-warning)' }} />
                  )}
                </div>
                <span className="text-[10px] font-medium text-center" style={{ color: '#CBD5E1' }}>{step.label}</span>
                <span className="text-[10px] font-mono" style={{ color: '#64748B' }}>{step.time}</span>
              </div>
              {i < timelineSteps.length - 1 && (
                <div
                  className="flex-1 h-px mx-2"
                  style={{
                    background: i < timelineSteps.length - 2
                      ? 'var(--state-healthy)'
                      : 'linear-gradient(to right, #10B981, #F59E0B)',
                  }}
                  aria-hidden="true"
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Mobile vertical */}
        <div className="flex flex-col gap-0 md:hidden" role="list" aria-label="Alert timeline">
          {timelineSteps.map((step, i) => (
            <div key={step.label} className="flex items-start gap-3" role="listitem">
              <div className="flex flex-col items-center">
                <div
                  className={`flex items-center justify-center rounded-full shrink-0 ${step.status === 'active' ? 'animate-pulse' : ''}`}
                  style={{
                    width: 24,
                    height: 24,
                    background: step.status === 'complete'
                      ? 'rgba(16,185,129,0.15)'
                      : 'rgba(var(--state-warning-rgb),0.15)',
                  }}
                >
                  {step.status === 'complete' ? (
                    <CheckCircle2 size={12} style={{ color: 'var(--state-healthy)' }} />
                  ) : (
                    <CircleDot size={12} style={{ color: 'var(--state-warning)' }} />
                  )}
                </div>
                {i < timelineSteps.length - 1 && (
                  <div className="w-px h-6" style={{ background: 'rgba(255,255,255,0.08)' }} aria-hidden="true" />
                )}
              </div>
              <div className="flex items-center gap-2 pb-4">
                <span className="text-xs font-medium" style={{ color: '#CBD5E1' }}>{step.label}</span>
                <span className="text-[10px] font-mono" style={{ color: '#64748B' }}>{step.time}</span>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   EVIDENCE PANEL
   ═══════════════════════════════════════════ */

const shapFactors = [
  { name: 'Transaction velocity', value: 8.2 },
  { name: 'Geo anomaly', value: 5.7 },
  { name: 'Amount deviation', value: 4.1 },
  { name: 'Time pattern', value: -2.3 },
  { name: 'Account history', value: -1.8 },
];

function EvidencePanel() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <motion.section variants={stagger} initial="hidden" animate="visible" className="flex flex-col gap-4">
      <h2
        className="text-lg md:text-xl font-semibold"
        style={{ fontFamily: 'var(--font-display)', color: '#F1F5F9' }}
      >
        Evidence analysis
      </h2>

      <div className="flex flex-col gap-3">
        {evidenceItems.map((item) => {
          const expanded = expandedId === item.id;
          const color = getScoreColor(item.score);
          const bg = getScoreBg(item.score);
          return (
            <motion.div key={item.id} variants={fadeUp}>
              <GlassCard className="!p-0">
                <button
                  className="w-full flex items-center justify-between p-4 cursor-pointer text-left"
                  style={{ background: 'transparent', border: 'none' }}
                  onClick={() => setExpandedId(expanded ? null : item.id)}
                  aria-expanded={expanded}
                  aria-label={`${item.title}: score ${(item.score * 100).toFixed(0)}%`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="inline-flex items-center justify-center rounded-lg text-xs font-bold font-mono tabular-nums"
                      style={{ background: bg, color, width: 44, height: 28 }}
                    >
                      {item.score.toFixed(2)}
                    </span>
                    <span className="text-sm font-medium" style={{ color: '#F1F5F9' }}>{item.title}</span>
                  </div>
                  {expanded ? (
                    <ChevronUp size={16} style={{ color: '#64748B' }} />
                  ) : (
                    <ChevronDown size={16} style={{ color: '#64748B' }} />
                  )}
                </button>
                <AnimatePresence>
                  {expanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 flex flex-col gap-2" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                        <p className="text-xs leading-relaxed pt-3" style={{ color: '#94A3B8' }}>
                          {item.details}
                        </p>
                        {item.model && (
                          <span className="text-[10px] font-mono" style={{ color: '#64748B' }}>
                            Model: {item.model}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      {/* SHAP attribution waterfall */}
      <motion.div variants={fadeUp}>
        <GlassCard className="flex flex-col gap-3">
          <h3
            className="text-sm font-semibold"
            style={{ fontFamily: 'var(--font-display)', color: '#F1F5F9' }}
          >
            SHAP attribution
          </h3>
          <p className="text-[10px]" style={{ color: '#64748B' }}>
            Feature contribution to threat score
          </p>
          <ShapWaterfall factors={shapFactors} baseValue={42} className="mt-1" />
        </GlassCard>
      </motion.div>
    </motion.section>
  );
}

/* ═══════════════════════════════════════════
   SIDEBAR COMPONENTS
   ═══════════════════════════════════════════ */

function RecommendedActions() {
  const { navigate } = useRouter();
  return (
    <GlassCard data-slot="action_preview" className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold" style={{ fontFamily: 'var(--font-display)', color: '#F1F5F9' }}>
        Recommended actions
      </h3>
      <button
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        style={{
          background: 'linear-gradient(135deg, #EF4444, #DC2626)',
          color: '#ffffff',
          minHeight: '48px',
        }}
        aria-label="Block and investigate this transaction"
      >
        <XCircle size={16} />
        Block &amp; investigate
      </button>
      <button
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all hover:shadow-[0_0_12px_rgba(var(--state-warning-rgb),0.3)] cursor-pointer"
        style={{ borderColor: 'rgba(var(--state-warning-rgb),0.4)', color: 'var(--state-warning)', background: 'transparent', minHeight: '44px' }}
      >
        Request verification
      </button>
      <button
        className="w-full text-center text-sm font-medium transition-colors cursor-pointer"
        style={{ color: 'var(--state-healthy)', background: 'transparent', border: 'none', padding: '8px 0', minHeight: '44px' }}
        onClick={() => navigate('/protect/dispute')}
      >
        Open dispute
      </button>
      <p className="text-[10px] text-center" style={{ color: '#64748B' }}>
        AI recommends blocking (97% confidence)
      </p>
    </GlassCard>
  );
}

function SimilarIncidents() {
  return (
    <GlassCard className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold" style={{ fontFamily: 'var(--font-display)', color: '#F1F5F9' }}>
        Similar Incidents
      </h3>
      <div className="flex flex-col gap-0">
        {similarIncidents.map((item, i) => (
          <div
            key={i}
            className="flex items-center justify-between py-2.5"
            style={{
              borderBottom: i < similarIncidents.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
            }}
          >
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-medium" style={{ color: '#F1F5F9' }}>{item.title}</span>
              <span className="text-[10px]" style={{ color: '#64748B' }}>{item.time}</span>
            </div>
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
              style={{
                background: item.result === 'Blocked' ? 'rgba(var(--state-critical-rgb),0.12)' : 'rgba(16,185,129,0.12)',
                color: item.result === 'Blocked' ? 'var(--state-critical)' : 'var(--state-healthy)',
              }}
            >
              {item.result}
            </span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

function AccountContext() {
  const data = [
    { label: 'Account balance', value: '$12,847' },
    { label: 'Avg monthly spend', value: '$3,200' },
    { label: 'Risk score', value: 'Low (0.12)', color: 'var(--state-healthy)' },
    { label: 'Alerts this month', value: '2' },
  ];
  return (
    <GlassCard className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold" style={{ fontFamily: 'var(--font-display)', color: '#F1F5F9' }}>
        Account Context
      </h3>
      <div className="flex flex-col gap-3">
        {data.map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <span className="text-xs" style={{ color: '#64748B' }}>{item.label}</span>
            <span className="text-sm font-mono font-semibold tabular-nums" style={{ color: item.color || '#F1F5F9' }}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */

export function ProtectAlertDetail() {
  usePageTitle('Alert Details');
  return (
    <div className="relative min-h-screen w-full" style={{ background: '#0B1221' }}>
      <AuroraPulse color="var(--engine-protect)" intensity="subtle" />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-1/2 focus:-translate-x-1/2 focus:z-50 focus:rounded-xl focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
        style={{ background: 'var(--engine-protect)', color: '#0B1221' }}
      >
        Skip to main content
      </a>

      <div
        id="main-content"
        className="mx-auto flex flex-col gap-6 md:gap-8 px-4 py-6 md:px-6 md:py-8 lg:px-8"
        style={{ maxWidth: '1280px' }}
        role="main"
      >
        <AlertHeader />
        <AlertSummary />
        <AlertTimeline />

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 min-w-0 lg:w-2/3">
            <EvidencePanel />
          </div>
          <aside className="w-full lg:w-80 shrink-0 flex flex-col gap-4" aria-label="Alert actions sidebar">
            <RecommendedActions />
            <SimilarIncidents />
            <AccountContext />
          </aside>
        </div>

        <GovernFooter auditId={GOVERNANCE_META['/protect/alert-detail'].auditId} pageContext={GOVERNANCE_META['/protect/alert-detail'].pageContext} />
      </div>
    </div>
  );
}

export default ProtectAlertDetail;
