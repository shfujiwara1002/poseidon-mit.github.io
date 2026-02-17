import { useState } from 'react';
import { Card } from './Card';
import { MissionDataRows } from './MissionDataRows';
import { MissionEvidencePanel } from './MissionEvidencePanel';
import { MissionStatusChip } from './MissionStatusChip';
import type { AuditLogEntry } from '../services/mockGovern';

export interface AuditLogCardProps {
  log: AuditLogEntry;
  onProvideFeedback?: (id: string, correct: boolean, comment?: string) => void;
}

function relativeLabel(date: Date) {
  const mins = Math.floor((Date.now() - date.getTime()) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return date.toLocaleDateString('en-US');
}

export function AuditLogCard({ log, onProvideFeedback }: AuditLogCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <Card variant="audit" tone="primary">
      <header className="audit-log-card-header">
        <strong>{log.decision.type.replace(/_/g, ' ')}</strong>
        <MissionStatusChip tone="primary" label={log.engine.toUpperCase()} />
      </header>

      <MissionDataRows
        items={[
          {
            id: `${log.id}-conf`,
            title: 'Confidence',
            value: `${log.decision.explanation.confidence}%`,
            detail: `Model ${log.decision.model.name} v${log.decision.model.version}`,
            tone: 'primary',
          },
          {
            id: `${log.id}-time`,
            title: 'Timestamp',
            value: relativeLabel(log.timestamp),
            detail: 'Govern trace record',
            tone: 'healthy',
          },
        ]}
      />

      <MissionEvidencePanel
        title="Explanation"
        summary={log.decision.explanation.naturalLanguage}
        tone="primary"
      />

      <div className="audit-log-card-compliance">
        {log.complianceFlags.gdprCompliant ? <MissionStatusChip tone="healthy" label="GDPR" /> : null}
        {log.complianceFlags.ecoaCompliant ? <MissionStatusChip tone="healthy" label="ECOA" /> : null}
        {log.complianceFlags.ccpaCompliant ? <MissionStatusChip tone="healthy" label="CCPA" /> : null}
      </div>

      <button type="button" className="entry-link-minor" onClick={() => setShowDetails((prev) => !prev)}>
        {showDetails ? 'Hide details ▲' : 'Show details ▼'}
      </button>

      {showDetails ? (
        <div className="audit-log-card-details">
          <pre>{JSON.stringify(log.decision.input, null, 2)}</pre>
          <pre>{JSON.stringify(log.decision.output, null, 2)}</pre>
        </div>
      ) : null}

      {log.userFeedback ? (
        <div className="audit-log-card-feedback">
          <MissionStatusChip tone={log.userFeedback.correct ? 'healthy' : 'critical'} label={log.userFeedback.correct ? 'Correct' : 'Incorrect'} />
          {log.userFeedback.comment ? <p>{log.userFeedback.comment}</p> : null}
        </div>
      ) : (
        <div className="mission-dual-actions">
          <button type="button" className="entry-btn entry-btn--ghost" onClick={() => onProvideFeedback?.(log.id, true)}>
            Mark correct
          </button>
          <button type="button" className="entry-btn entry-btn--ghost" onClick={() => onProvideFeedback?.(log.id, false)}>
            Mark incorrect
          </button>
        </div>
      )}
    </Card>
  );
}

