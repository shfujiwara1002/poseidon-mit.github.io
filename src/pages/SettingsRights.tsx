import React, { useState } from 'react';
import { ConsentScopePanel } from '../components/ConsentScopePanel';
import { DataRightsPanel } from '../components/DataRightsPanel';
import type { DataRight, DataRightAction } from '../components/DataRightsPanel';
import { DefinitionLine } from '../components/DefinitionLine';
import { PageShell } from '../components/PageShell';
import { GovernContractSet } from '../components/GovernContractSet';
import { MissionDataRows } from '../components/MissionDataRows';
import { MissionSectionHeader } from '../components/MissionSectionHeader';
import { MissionStatusChip } from '../components/MissionStatusChip';
import { PrivacyControlCard } from '../components/PrivacyControlCard';
import { ProofLine } from '../components/ProofLine';
import { mockPrivacyControls, mockDataExports } from '../services/mockGovern';
import type { PrivacyControl } from '../services/mockGovern';
import { getRouteScreenContract } from '../contracts/route-screen-contracts';

/* ────────────────────────────────────────────
   25. Settings > Data Rights
   Route: /settings/rights
   Spec: GDPR rights panel, consent scopes,
         data export, destructive delete
──────────────────────────────────────────── */

const gdprRights: DataRight[] = [
  { id: 'DR-1', title: 'Right to access', article: 'GDPR Art. 15', status: 'available', lastExercised: 'Never' },
  { id: 'DR-2', title: 'Right to portability', article: 'GDPR Art. 20', status: 'available', lastExercised: '5d ago' },
  { id: 'DR-3', title: 'Right to erasure', article: 'GDPR Art. 17', status: 'available', lastExercised: 'Never' },
  { id: 'DR-4', title: 'Right to restrict processing', article: 'GDPR Art. 18', status: 'available', lastExercised: 'Never' },
];

const dataRightActions: DataRightAction[] = [
  { id: 'DRA-1', type: 'export', label: 'Export as JSON', description: 'Download all your data in machine-readable format' },
  { id: 'DRA-2', type: 'export', label: 'Export as CSV', description: 'Download transaction data as spreadsheet' },
  { id: 'DRA-3', type: 'restrict', label: 'Restrict processing', description: 'Limit AI processing of your data' },
  { id: 'DRA-4', type: 'delete', label: 'Delete all data', description: 'Permanently remove all personal data', destructive: true },
];

const kpiSparklines = {
  scopes: [{ value: 4 }, { value: 4 }, { value: 5 }, { value: 5 }, { value: 5 }, { value: 5 }],
  exports: [{ value: 1 }, { value: 1 }, { value: 2 }, { value: 2 }, { value: 2 }, { value: 2 }],
  retention: [{ value: 90 }, { value: 90 }, { value: 90 }, { value: 90 }, { value: 90 }, { value: 90 }],
  sharing: [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
};

export const SettingsRights: React.FC = () => {
  const contract = getRouteScreenContract('settings-rights');
  const [controls, setControls] = useState<PrivacyControl[]>(mockPrivacyControls);
  const [consentGranted, setConsentGranted] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  const handleToggleControl = (category: string) => {
    setControls((prev) =>
      prev.map((item) =>
        item.category === category ? { ...item, enabled: !item.enabled } : item
      )
    );
  };

  const activeCount = controls.filter((c) => c.enabled).length;

  const mainContent = (
    <>
      {/* ── GDPR Rights panel ── */}
      <section className="engine-section" data-slot="data_rights">
        <MissionSectionHeader
          title="Your data rights"
          message="GDPR-compliant rights you can exercise at any time."
          contextCue="Each action is audit-logged and reversible within 30 days"
        />
        <DataRightsPanel rights={gdprRights} actions={dataRightActions} />
        <ProofLine
          claim="4 rights available"
          evidence="GDPR Articles 15, 17, 18, 20 | All exercisable"
          source="Data rights engine"
          basis="policy"
          sourceType="regulation"
        />
        <DefinitionLine
          metric="Rights availability"
          formula="available_rights / applicable_rights"
          unit="ratio"
          period="current"
          threshold="100%"
        />
      </section>

      {/* ── Data consent scopes ── */}
      <section className="engine-section" data-slot="consent_scope">
        <MissionSectionHeader
          title="Data consent scopes"
          message="Control what data categories Poseidon can process."
          contextCue="Changes take effect immediately and are audit-logged"
          right={
            <MissionStatusChip
              tone="primary"
              label={`${activeCount}/${controls.length} active`}
            />
          }
        />
        <div className="engine-item-list">
          {controls.map((control) => (
            <PrivacyControlCard
              key={control.category}
              control={control}
              onToggle={handleToggleControl}
            />
          ))}
        </div>
        <ProofLine
          claim="Consent tracked"
          evidence="Every toggle change is audit-logged | Revocable anytime"
          source="Consent engine"
          basis="real-time"
          sourceType="system"
        />
      </section>

      {/* ── Session consent scope ── */}
      <ConsentScopePanel
        scope="Data management and export operations"
        duration="Session-based"
        revocationPath="/settings/rights"
        dataCategories={['Transaction history', 'Personal info', 'AI decision logs']}
        granted={consentGranted}
        onToggle={setConsentGranted}
      />

      {/* ── Export history ── */}
      <article className="engine-card">
        <MissionSectionHeader
          title="Export history"
          message="Previous data export requests and their status."
        />
        <MissionDataRows
          items={mockDataExports.map((item) => ({
            id: item.id,
            title: `${item.format.toUpperCase()} export`,
            value: item.status,
            detail: item.requestedAt.toLocaleDateString('en-US'),
            tone: item.status === 'completed' ? ('healthy' as const) : ('warning' as const),
          }))}
        />
        <DefinitionLine
          metric="Export completion rate"
          formula="completed_exports / total_exports"
          unit="percentage"
          period="all time"
          threshold="100%"
        />
      </article>

      {/* ── Destructive: Delete my data ── */}
      <section className="engine-section engine-section--destructive">
        <MissionSectionHeader
          title="Delete my data"
          message="Permanently remove all personal data from Poseidon. This action cannot be undone."
          right={<MissionStatusChip tone="critical" label="Destructive" />}
        />
        <div className="consent-scope-panel">
          <input
            type="text"
            className="entry-input"
            placeholder="Type DELETE to confirm"
            value={deleteConfirmation}
            onChange={(e) => setDeleteConfirmation(e.target.value)}
            aria-label="Type DELETE to confirm data deletion"
          />
          <button
            type="button"
            className="entry-btn entry-btn--primary entry-btn--destructive"
            disabled={deleteConfirmation !== 'DELETE'}
          >
            {deleteConfirmation === 'DELETE'
              ? 'Permanently delete all data'
              : 'Type DELETE above to confirm'}
          </button>
        </div>
      </section>

      <GovernContractSet
        auditId="GV-2026-0212-RIGHTS"
        modelVersion="v3.2"
        explanationVersion="xai-1.1"
      />
    </>
  );

  const sideContent = (
    <article className="engine-card">
      <MissionSectionHeader
        title="Privacy summary"
        message="Aggregate data governance metrics."
      />
      <MissionDataRows
        items={[
          { id: 'YR-1', title: 'Active scopes', value: String(activeCount), tone: 'healthy' },
          { id: 'YR-2', title: 'Exports completed', value: '2', tone: 'primary' },
          { id: 'YR-3', title: '3rd party sharing', value: '1 partner', tone: 'warning' },
          { id: 'YR-4', title: 'Min retention', value: '90 days', tone: 'primary' },
        ]}
      />
      <DefinitionLine
        metric="Data minimization"
        formula="min(retention_period_per_category)"
        unit="days"
        period="current"
        threshold="< 365"
      />
    </article>
  );

  return (
    <PageShell
      slug="settings"
      contract={contract}
      fullWidth
      layout="engine"
      heroVariant="editorial"
      hero={{
        kicker: 'Data Rights',
        headline: 'Your data, your control.',
        subline: contract.oneScreenMessage,
        proofLine: {
          claim: 'GDPR compliant',
          evidence: 'Export, restrict, or delete anytime | All changes audit-logged',
          source: 'Data rights engine',
        },
        freshness: new Date(Date.now() - 10 * 60 * 1000),
        kpis: [
          { label: 'Active scopes', value: String(activeCount), definition: 'Data categories with active consent', accent: 'teal', sparklineData: kpiSparklines.scopes, sparklineColor: 'var(--state-healthy)' },
          { label: 'Exports', value: '2', definition: 'Data export requests', accent: 'blue', sparklineData: kpiSparklines.exports, sparklineColor: 'var(--state-primary)' },
          { label: 'Min retention', value: '90d', definition: 'Minimum data retention period', accent: 'cyan', sparklineData: kpiSparklines.retention, sparklineColor: '#00F0FF' },
          { label: '3rd party', value: '1', definition: 'Active third-party data sharing partners', accent: 'amber', sparklineData: kpiSparklines.sharing, sparklineColor: 'var(--state-warning)' },
        ],
      }}
      primaryFeed={mainContent}
      decisionRail={sideContent}
    />
  );
};

export default SettingsRights;
