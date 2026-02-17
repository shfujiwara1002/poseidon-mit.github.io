import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, CheckCircle2, AlertTriangle, User, ChevronDown } from 'lucide-react';
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

const auditEntry = {
  id: 'GV-2026-0212-001',
  engine: 'Protect',
  type: 'fraud_detected',
  timestamp: '12 minutes ago',
  model: { name: 'FraudDetectionV3.2', version: '3.2.1', accuracy: 99.7 },
  explanation: {
    summary:
      'Transaction flagged as fraudulent based on amount deviation (3x usual), location anomaly (5,000 km from usual), and time-of-day risk (03:00 AM local). All three signals exceeded their respective thresholds simultaneously.',
    confidence: 97,
  },
  topFactors: [
    { label: 'Amount deviation', contribution: 0.95, note: '3x typical transaction amount' },
    { label: 'Location anomaly', contribution: 0.92, note: '5,000 km from usual location' },
    { label: 'Time-of-day risk', contribution: 0.88, note: '03:00 AM local time' },
    { label: 'Merchant history', contribution: 0.72, note: 'First purchase at this merchant' },
  ],
  compliance: { gdpr: true, ecoa: true, ccpa: true },
  userFeedback: { correct: true, comment: 'Confirmed fraudulent transaction' },
};

const metaRows = [
  { label: 'Audit ID', value: auditEntry.id, highlight: false },
  { label: 'Engine', value: auditEntry.engine, highlight: false },
  { label: 'Decision type', value: auditEntry.type, highlight: true },
  { label: 'Timestamp', value: auditEntry.timestamp, highlight: false },
  { label: 'Model', value: `${auditEntry.model.name} v${auditEntry.model.version}`, highlight: false },
  { label: 'Model accuracy', value: `${auditEntry.model.accuracy}%`, highlight: false },
];

const complianceFlags = [
  { label: 'GDPR', compliant: auditEntry.compliance.gdpr },
  { label: 'ECOA', compliant: auditEntry.compliance.ecoa },
  { label: 'CCPA', compliant: auditEntry.compliance.ccpa },
];

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */

export function GovernAuditDetail() {
  return (
    <div className="min-h-screen w-full" style={{ background: '#0B1221' }}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-xl focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
        style={{ background: '#3B82F6', color: '#ffffff' }}
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
            to="/govern/audit"
            className="flex items-center gap-1.5 text-sm font-medium hover:opacity-80 transition-opacity"
            style={{ color: '#3B82F6' }}
          >
            <ArrowLeft className="h-4 w-4" />
            Audit Ledger
          </Link>
          <span className="text-white/20">/</span>
          <span className="text-sm text-white/50">Audit Detail</span>
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
            <FileText className="h-5 w-5" style={{ color: '#3B82F6' }} />
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#3B82F6' }}>
              Govern · Audit Detail
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Decision Reconstruction</h1>
          <p className="text-sm text-slate-400">
            Full decision audit for <code className="text-blue-400 bg-white/5 px-1 rounded">{auditEntry.id}</code> — Confidence {auditEntry.explanation.confidence}% · {auditEntry.timestamp}
          </p>
        </motion.div>

        {/* KPI bar */}
        <motion.div variants={fadeUp}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Confidence', value: `${auditEntry.explanation.confidence}%`, color: '#3B82F6' },
              { label: 'Factors', value: String(auditEntry.topFactors.length), color: '#00F0FF' },
              { label: 'Model accuracy', value: `${auditEntry.model.accuracy}%`, color: '#22C55E' },
              { label: 'Feedback rate', value: '95%', color: '#EAB308' },
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
            {/* Decision metadata */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 md:p-6">
              <h2 className="text-sm font-semibold text-white mb-4">Decision Metadata</h2>
              <div className="space-y-3">
                {metaRows.map((row) => (
                  <div key={row.label} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                    <span className="text-xs text-white/50">{row.label}</span>
                    <span className={`text-xs font-medium ${row.highlight ? 'text-amber-400' : 'text-white/80'}`}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Decision reconstruction */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 md:p-6" style={{ borderLeftWidth: 3, borderLeftColor: '#3B82F6' }}>
              <h2 className="text-sm font-semibold text-white mb-3">Decision Reconstruction</h2>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">{auditEntry.explanation.summary}</p>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-2 rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-blue-500" style={{ width: `${auditEntry.explanation.confidence}%` }} />
                </div>
                <span className="text-sm font-bold text-blue-400 shrink-0">{auditEntry.explanation.confidence}% confidence</span>
              </div>
              <div className="space-y-3">
                {auditEntry.topFactors.map((factor) => (
                  <div key={factor.label} className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/70">{factor.label}</span>
                      <span className="text-white/40">{factor.note}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-blue-400/70" style={{ width: `${factor.contribution * 100}%` }} />
                    </div>
                    <span className="text-[10px] text-white/30">Contribution: {factor.contribution.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Compliance flags */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 md:p-6">
              <h2 className="text-sm font-semibold text-white mb-4">Compliance Flags</h2>
              <div className="space-y-2.5">
                {complianceFlags.map((flag) => (
                  <div key={flag.label} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                    <span className="text-sm text-white/70">{flag.label}</span>
                    <span className={`flex items-center gap-1.5 text-xs font-semibold ${flag.compliant ? 'text-emerald-400' : 'text-red-400'}`}>
                      {flag.compliant ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}
                      {flag.compliant ? 'Compliant' : 'Non-compliant'}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-white/30 mt-3">All 3 regulatory frameworks satisfied · Source: Compliance engine</p>
            </div>
          </motion.div>

          {/* Side rail */}
          <aside className="w-full lg:w-72 shrink-0 flex flex-col gap-4" aria-label="Audit detail sidebar">
            {/* Contributing factors */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
              <div className="flex items-center gap-2 mb-3">
                <ChevronDown className="h-4 w-4 text-blue-400" />
                <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider">Contributing Factors</h3>
              </div>
              <div className="space-y-2.5">
                {auditEntry.topFactors.map((f) => (
                  <div key={f.label} className="flex items-center gap-2">
                    <span className="text-xs text-white/50 w-28 shrink-0 truncate">{f.label}</span>
                    <div className="flex-1 h-1.5 rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-blue-500/60" style={{ width: `${f.contribution * 100}%` }} />
                    </div>
                    <span className="text-xs text-white/40 w-8 text-right">{f.contribution.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* User feedback */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
              <div className="flex items-center gap-2 mb-3">
                <User className="h-4 w-4 text-blue-400" />
                <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider">User Feedback</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs text-white/50">Verdict</span>
                  <span className={`text-xs font-medium ${auditEntry.userFeedback.correct ? 'text-emerald-400' : 'text-red-400'}`}>
                    {auditEntry.userFeedback.correct ? 'Correct' : 'Incorrect'}
                  </span>
                </div>
                <div className="flex justify-between items-start gap-2">
                  <span className="text-xs text-white/50 shrink-0">Comment</span>
                  <span className="text-xs text-white/70 text-right">{auditEntry.userFeedback.comment}</span>
                </div>
              </div>
              <p className="text-xs text-white/30 mt-3">Human-validated · Source: Feedback system</p>
            </div>

            {/* Navigation */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
              <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-3">Related</h3>
              <div className="flex flex-col gap-2">
                <Link to="/govern/audit" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">← Back to Audit Ledger</Link>
                <Link to="/govern/oversight" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">Oversight Queue →</Link>
              </div>
            </div>
          </aside>
        </div>

        <GovernFooter />
      </motion.div>
    </div>
  );
}

export default GovernAuditDetail;
