import React from 'react';
import { Link } from '../router';
import { DefinitionLine } from '../components/DefinitionLine';
import { PageShell } from '../components/PageShell';
import { ExplainableInsightPanel } from '../components/ExplainabilityPanel';
import { FactorsDropdown } from '../components/FactorsDropdown';
import { GovernContractSet } from '../components/GovernContractSet';
import { MissionDataRows } from '../components/MissionDataRows';
import { MissionSectionHeader } from '../components/MissionSectionHeader';
import { ProofLine } from '../components/ProofLine';
import { getRouteScreenContract } from '../contracts/route-screen-contracts';

/* ────────────────────────────────────────────
   24. Govern > Audit Detail
   Route: /govern/audit/:id
   Spec: Full decision reconstruction with
         factors, compliance flags, user feedback
──────────────────────────────────────────── */

const auditEntry = {
  id: 'GV-2026-0212-001',
  engine: 'protect',
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

const kpiSparklines = {
  confidence: [{ value: 94 }, { value: 95 }, { value: 96 }, { value: 96 }, { value: 97 }, { value: 97 }],
  factors: [{ value: 3 }, { value: 3 }, { value: 4 }, { value: 4 }, { value: 4 }, { value: 4 }],
  model: [{ value: 99.2 }, { value: 99.3 }, { value: 99.4 }, { value: 99.5 }, { value: 99.6 }, { value: 99.7 }],
  feedback: [{ value: 85 }, { value: 87 }, { value: 89 }, { value: 91 }, { value: 93 }, { value: 95 }],
};

export const GovernAuditDetail: React.FC = () => {
  const contract = getRouteScreenContract('govern-audit-detail');

  const mainContent = (
    <>
      {/* ── Decision metadata ── */}
      <section className="engine-section">
        <MissionSectionHeader
          title="Decision metadata"
          message="Complete record of the AI decision parameters and context."
        />
        <MissionDataRows
          items={[
            { id: 'DM-1', title: 'Audit ID', value: auditEntry.id, tone: 'primary' },
            { id: 'DM-2', title: 'Engine', value: auditEntry.engine, tone: 'primary' },
            { id: 'DM-3', title: 'Decision type', value: auditEntry.type, tone: 'warning' },
            { id: 'DM-4', title: 'Timestamp', value: auditEntry.timestamp, tone: 'primary' },
            { id: 'DM-5', title: 'Model', value: `${auditEntry.model.name} v${auditEntry.model.version}`, tone: 'primary' },
            { id: 'DM-6', title: 'Model accuracy', value: `${auditEntry.model.accuracy}%`, tone: 'healthy' },
          ]}
        />
        <DefinitionLine
          metric="Model accuracy"
          formula="correct_predictions / total_predictions"
          unit="percentage"
          period="30 days rolling"
          threshold="> 95%"
        />
      </section>

      {/* ── Decision reconstruction via ExplainableInsightPanel ── */}
      <ExplainableInsightPanel
        title="Decision reconstruction"
        summary={auditEntry.explanation.summary}
        topFactors={auditEntry.topFactors}
        confidence={auditEntry.explanation.confidence / 100}
        recency={auditEntry.timestamp}
        governMeta={{
          auditId: auditEntry.id,
          modelVersion: `v${auditEntry.model.version}`,
          explanationVersion: 'xai-1.1',
          timestamp: new Date().toISOString(),
        }}
      />

      {/* ── Compliance flags ── */}
      <article className="engine-card">
        <MissionSectionHeader
          title="Compliance flags"
          message="Regulatory framework adherence for this decision."
        />
        <MissionDataRows
          items={[
            { id: 'CF-1', title: 'GDPR', value: auditEntry.compliance.gdpr ? 'Compliant' : 'Non-compliant', tone: auditEntry.compliance.gdpr ? 'healthy' as const : 'critical' as const },
            { id: 'CF-2', title: 'ECOA', value: auditEntry.compliance.ecoa ? 'Compliant' : 'Non-compliant', tone: auditEntry.compliance.ecoa ? 'healthy' as const : 'critical' as const },
            { id: 'CF-3', title: 'CCPA', value: auditEntry.compliance.ccpa ? 'Compliant' : 'Non-compliant', tone: auditEntry.compliance.ccpa ? 'healthy' as const : 'critical' as const },
          ]}
        />
        <ProofLine
          claim="Full compliance"
          evidence="All 3 regulatory frameworks satisfied"
          source="Compliance engine"
          basis="per-decision"
          sourceType="system"
        />
      </article>

      <GovernContractSet
        auditId={auditEntry.id}
        modelVersion={`v${auditEntry.model.version}`}
        explanationVersion="xai-1.1"
      />
    </>
  );

  const sideContent = (
    <>
      {/* ── Contributing factors dropdown ── */}
      <article className="engine-card" data-slot="factors_dropdown">
        <MissionSectionHeader
          title="Contributing factors"
          message="All factors that influenced this decision."
        />
        <FactorsDropdown
          allFactors={auditEntry.topFactors}
          whyItMatters="Each factor represents a signal that contributed to the AI decision. The contribution score indicates relative importance in the final output."
        />
      </article>

      {/* ── User feedback ── */}
      <article className="engine-card">
        <MissionSectionHeader
          title="User feedback"
          message="Human validation of this decision."
        />
        <MissionDataRows
          items={[
            { id: 'UF-1', title: 'Verdict', value: auditEntry.userFeedback.correct ? 'Correct' : 'Incorrect', tone: auditEntry.userFeedback.correct ? 'healthy' as const : 'critical' as const },
            { id: 'UF-2', title: 'Comment', value: auditEntry.userFeedback.comment ?? 'None', tone: 'primary' },
          ]}
        />
        <ProofLine
          claim="Human-validated"
          evidence="Decision confirmed correct by user"
          source="Feedback system"
          basis="per-decision"
          sourceType="human"
        />
      </article>

      {/* ── Navigation ── */}
      <article className="engine-card">
        <MissionSectionHeader
          title="Related"
          message="Navigate to related governance surfaces."
        />
        <div className="dashboard-side-actions">
          <Link className="entry-btn entry-btn--ghost" to="/govern/audit">Back to ledger</Link>
          <Link className="entry-btn entry-btn--ghost" to="/govern/oversight">Oversight queue</Link>
        </div>
      </article>
    </>
  );

  return (
    <PageShell
      slug="govern"
      contract={contract}
      layout="engine"
      heroVariant="analytical"
      hero={{
        kicker: 'Audit Detail',
        headline: 'Full decision reconstruction.',
        subline: contract.oneScreenMessage,
        proofLine: {
          claim: `Confidence ${auditEntry.explanation.confidence}%`,
          evidence: `${auditEntry.topFactors.length} factors | Model accuracy ${auditEntry.model.accuracy}%`,
          source: auditEntry.model.name,
        },
        freshness: new Date(Date.now() - 12 * 60 * 1000),
        kpis: [
          { label: 'Confidence', value: `${auditEntry.explanation.confidence}%`, definition: 'Model confidence in this decision', accent: 'blue', sparklineData: kpiSparklines.confidence, sparklineColor: 'var(--state-primary)' },
          { label: 'Factors', value: String(auditEntry.topFactors.length), definition: 'Contributing factors analyzed', accent: 'cyan', sparklineData: kpiSparklines.factors, sparklineColor: '#00F0FF' },
          { label: 'Model accuracy', value: `${auditEntry.model.accuracy}%`, definition: 'Historical accuracy of this model', accent: 'teal', sparklineData: kpiSparklines.model, sparklineColor: 'var(--state-healthy)' },
          { label: 'Feedback rate', value: '95%', definition: 'Users providing feedback on similar decisions', accent: 'amber', sparklineData: kpiSparklines.feedback, sparklineColor: 'var(--state-warning)' },
        ],
      }}
      primaryFeed={mainContent}
      decisionRail={sideContent}
    />
  );
};

export default GovernAuditDetail;
