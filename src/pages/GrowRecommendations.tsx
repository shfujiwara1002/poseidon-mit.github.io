import React from 'react';
import { Link } from '../router';
import { ActionOutcomePreview } from '../components/ActionOutcomePreview';
import { DefinitionLine } from '../components/DefinitionLine';
import { PageShell } from '../components/PageShell';
import { ExplainableInsightPanel } from '../components/ExplainabilityPanel';
import { FactorsDropdown } from '../components/FactorsDropdown';
import { GovernContractSet } from '../components/GovernContractSet';
import { MissionSectionHeader } from '../components/MissionSectionHeader';
import { ProofLine } from '../components/ProofLine';
import { getRouteScreenContract } from '../contracts/route-screen-contracts';

/* ────────────────────────────────────────────
   21. Grow > AI Recommendations
   Route: /grow/recommendations
   Spec: Ranked AI-curated actions with
         explainable factors + projected impact
──────────────────────────────────────────── */

const recommendations = [
  {
    id: 'REC-001',
    title: 'Consolidate streaming subscriptions',
    summary:
      'Three overlapping streaming services detected. Consolidating to a single premium plan saves $28/mo while maintaining 95% content coverage.',
    topFactors: [
      { label: 'Usage overlap', contribution: 0.91, note: '3 services with 60% content overlap' },
      { label: 'Cost reduction', contribution: 0.88, note: '$28/mo potential savings' },
      { label: 'Content coverage', contribution: 0.82, note: '95% coverage with premium plan' },
    ],
    confidence: 0.89,
    impact: '$336/yr',
    auditId: 'GV-2026-0212-REC1',
    reversibleWindow: '30 days',
    sideEffects: ['Recurring billing changes', 'Service transition period ~48h'],
  },
  {
    id: 'REC-002',
    title: 'Increase emergency fund contribution',
    summary:
      'Current buffer covers 14 days of expenses. Increasing to 21 days reduces income-gap risk by 34%, improving overall financial resilience.',
    topFactors: [
      { label: 'Buffer adequacy', contribution: 0.76, note: 'Below recommended 30-day threshold' },
      { label: 'Income stability', contribution: 0.94, note: 'Stable monthly salary detected' },
      { label: 'Risk reduction', contribution: 0.85, note: '34% income-gap risk decrease' },
    ],
    confidence: 0.91,
    impact: 'Risk -34%',
    auditId: 'GV-2026-0212-REC2',
    reversibleWindow: 'Anytime',
    sideEffects: ['Reduced discretionary budget ~$120/mo'],
  },
  {
    id: 'REC-003',
    title: 'Renegotiate internet plan',
    summary:
      'Market rate for equivalent speed tier is $20 lower than current bill. Auto-negotiation via partner API available with 72% historical success rate.',
    topFactors: [
      { label: 'Market comparison', contribution: 0.95, note: '$20/mo above market rate' },
      { label: 'Service equivalence', contribution: 0.88, note: 'Same speed tier available' },
      { label: 'Negotiation success', contribution: 0.72, note: '72% historical success rate' },
    ],
    confidence: 0.84,
    impact: '$240/yr',
    auditId: 'GV-2026-0212-REC3',
    reversibleWindow: '24h',
    sideEffects: ['Account re-provisioning may take 24h', 'Current promotional rates may be lost'],
  },
];

const kpiSparklines = {
  active: [{ value: 2 }, { value: 2 }, { value: 3 }, { value: 3 }, { value: 3 }, { value: 3 }],
  impact: [{ value: 400 }, { value: 450 }, { value: 500 }, { value: 550 }, { value: 576 }, { value: 576 }],
  confidence: [{ value: 0.84 }, { value: 0.85 }, { value: 0.86 }, { value: 0.87 }, { value: 0.88 }, { value: 0.88 }],
  adopted: [{ value: 60 }, { value: 65 }, { value: 68 }, { value: 72 }, { value: 75 }, { value: 78 }],
};

export const GrowRecommendations: React.FC = () => {
  const contract = getRouteScreenContract('grow-recommendations');

  const mainContent = (
    <>
      <section className="engine-section">
        <MissionSectionHeader
          title="Evidence-backed recommendations"
          message="Each recommendation includes explainable factors and projected impact. Select one to route to Execute."
          contextCue="Ranked by composite score: impact x confidence x feasibility"
        />

        <div className="engine-item-list">
          {recommendations.map((rec) => (
            <div key={rec.id}>
              <ExplainableInsightPanel
                title={rec.title}
                summary={rec.summary}
                topFactors={rec.topFactors}
                confidence={rec.confidence}
                recency="Updated 30m ago"
                governMeta={{
                  auditId: rec.auditId,
                  modelVersion: 'v2.1',
                  explanationVersion: 'xai-1.0',
                  timestamp: new Date().toISOString(),
                }}
                actions={
                  <Link className="entry-btn entry-btn--primary" to="/execute">
                    Send to Execute
                  </Link>
                }
              />

              <ActionOutcomePreview
                outcome={`Applying this recommendation: expected ${rec.impact} impact.`}
                reversibleWindow={rec.reversibleWindow}
                sideEffects={rec.sideEffects}
                impact={rec.impact}
              />

              <ProofLine
                claim={`Recommendation ${rec.id}`}
                evidence={`Confidence ${(rec.confidence * 100).toFixed(0)}% | Impact: ${rec.impact}`}
                source="Grow engine v2.1"
                basis="30 days analysis"
                sourceType="model"
              />
            </div>
          ))}
        </div>

        <DefinitionLine
          metric="Recommendation score"
          formula="impact x confidence x feasibility"
          unit="composite score"
          period="30 days rolling"
        />
      </section>

      <GovernContractSet
        auditId="GV-2026-0212-RECS"
        modelVersion="v2.1"
        explanationVersion="xai-1.0"
      />
    </>
  );

  const sideContent = (
    <>
      <article className="engine-card" data-slot="factors_dropdown">
        <MissionSectionHeader
          title="Shared factors"
          message="Common factors across all recommendations."
        />
        <FactorsDropdown
          allFactors={[
            { label: 'Spending efficiency', contribution: 0.92, note: 'Optimization potential high' },
            { label: 'Market comparison', contribution: 0.88, note: 'Below-market rates detected' },
            { label: 'Usage patterns', contribution: 0.84, note: 'Underutilized services identified' },
            { label: 'Income alignment', contribution: 0.78, note: 'Savings rate below target' },
          ]}
          whyItMatters="These factors appear across multiple recommendations, indicating systemic optimization opportunities in your financial profile."
        />
      </article>

      <article className="engine-card">
        <MissionSectionHeader
          title="Impact summary"
          message="Aggregate impact if all recommendations are adopted."
        />
        <ProofLine
          claim="Total potential savings"
          evidence="$576/yr across 3 recommendations"
          source="Grow analysis"
          basis="12 months projection"
          sourceType="model"
        />
        <DefinitionLine
          metric="Aggregate impact"
          formula="sum(recommendation_impact)"
          unit="dollars / year"
          period="12 months forward"
        />
      </article>
    </>
  );

  return (
    <PageShell
      slug="grow"
      contract={contract}
      layout="engine"
      heroVariant="focused"
      hero={{
        kicker: 'Recommendations',
        headline: 'Actionable growth opportunities.',
        subline: contract.oneScreenMessage,
        proofLine: {
          claim: '3 active recommendations',
          evidence: 'Each with explainable factors and impact estimate',
          source: 'Grow engine v2.1',
        },
        freshness: new Date(Date.now() - 30 * 60 * 1000),
        kpis: [
          { label: 'Active', value: '3', definition: 'Recommendations ready for action', accent: 'violet', sparklineData: kpiSparklines.active, sparklineColor: 'var(--engine-grow)' },
          { label: 'Total impact', value: '$576/yr', definition: 'Combined annual savings if all adopted', accent: 'teal', sparklineData: kpiSparklines.impact, sparklineColor: 'var(--state-healthy)' },
          { label: 'Avg confidence', value: '0.88', definition: 'Average model confidence across recommendations', accent: 'cyan', sparklineData: kpiSparklines.confidence, sparklineColor: '#00F0FF' },
          { label: 'Adoption rate', value: '78%', definition: 'Historical rate of recommendation adoption', accent: 'blue', sparklineData: kpiSparklines.adopted, sparklineColor: 'var(--state-primary)' },
        ],
      }}
      primaryFeed={mainContent}
      decisionRail={sideContent}
    />
  );
};

export default GrowRecommendations;
