import React, { useState, useMemo } from 'react';
import { AuditLinkChip } from './AuditLinkChip';
import type { AuditLogEntry } from '../services/mockGovern';

type SortField = 'timestamp' | 'engine' | 'confidence' | 'type';
type SortDirection = 'asc' | 'desc';

interface AuditLedgerTableProps {
  /** Audit log entries to display */
  entries: AuditLogEntry[];
  /** Callback when an entry is selected */
  onSelect?: (entry: AuditLogEntry) => void;
  /** Callback when user provides feedback */
  onFeedback?: (id: string, correct: boolean) => void;
}

const ENGINE_COLORS: Record<string, string> = {
  protect: 'var(--engine-protect, #22C55E)',
  grow: 'var(--engine-grow, #8B5CF6)',
  execute: 'var(--engine-execute, #EAB308)',
  govern: 'var(--engine-govern, #3B82F6)',
};

function relativeTime(date: Date): string {
  const mins = Math.floor((Date.now() - date.getTime()) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

/**
 * W-V3-GOV-AUDIT: AuditLedgerTable — sortable table with engine
 * color-coded rows. Used on GOV02.
 */
export const AuditLedgerTable: React.FC<AuditLedgerTableProps> = ({
  entries,
  onSelect,
  onFeedback,
}) => {
  const [sortField, setSortField] = useState<SortField>('timestamp');
  const [sortDir, setSortDir] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const sorted = useMemo(() => {
    const copy = [...entries];
    copy.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'timestamp':
          cmp = a.timestamp.getTime() - b.timestamp.getTime();
          break;
        case 'engine':
          cmp = a.engine.localeCompare(b.engine);
          break;
        case 'confidence':
          cmp = a.decision.explanation.confidence - b.decision.explanation.confidence;
          break;
        case 'type':
          cmp = a.decision.type.localeCompare(b.decision.type);
          break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return copy;
  }, [entries, sortField, sortDir]);

  const sortIcon = (field: SortField) => {
    if (sortField !== field) return ' ↕';
    return sortDir === 'asc' ? ' ↑' : ' ↓';
  };

  return (
    <div className="audit-ledger-table" data-widget="AuditLedgerTable">
      <table className="audit-ledger-table-inner">
        <thead>
          <tr>
            <th>
              <button type="button" className="audit-ledger-sort-btn" onClick={() => handleSort('timestamp')}>
                Time{sortIcon('timestamp')}
              </button>
            </th>
            <th>
              <button type="button" className="audit-ledger-sort-btn" onClick={() => handleSort('engine')}>
                Engine{sortIcon('engine')}
              </button>
            </th>
            <th>
              <button type="button" className="audit-ledger-sort-btn" onClick={() => handleSort('type')}>
                Decision{sortIcon('type')}
              </button>
            </th>
            <th>
              <button type="button" className="audit-ledger-sort-btn" onClick={() => handleSort('confidence')}>
                Confidence{sortIcon('confidence')}
              </button>
            </th>
            <th>Compliance</th>
            <th>Feedback</th>
            <th>Audit</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((entry) => (
            <tr
              key={entry.id}
              className="audit-ledger-row"
              style={{ borderLeft: `3px solid ${ENGINE_COLORS[entry.engine] ?? 'transparent'}` }}
              onClick={() => onSelect?.(entry)}
              role={onSelect ? 'button' : undefined}
              tabIndex={onSelect ? 0 : undefined}
              onKeyDown={(e) => { if (e.key === 'Enter' && onSelect) onSelect(entry); }}
            >
              <td className="audit-ledger-cell-time">
                {relativeTime(entry.timestamp)}
              </td>
              <td>
                <span className="audit-ledger-engine-badge" style={{ color: ENGINE_COLORS[entry.engine] }}>
                  {entry.engine}
                </span>
              </td>
              <td>{entry.decision.type.replace(/_/g, ' ')}</td>
              <td>
                <span className="audit-ledger-confidence">
                  {entry.decision.explanation.confidence}%
                </span>
              </td>
              <td className="audit-ledger-cell-compliance">
                {entry.complianceFlags.gdprCompliant && <span className="audit-ledger-flag audit-ledger-flag--pass">GDPR</span>}
                {entry.complianceFlags.ecoaCompliant && <span className="audit-ledger-flag audit-ledger-flag--pass">ECOA</span>}
                {entry.complianceFlags.ccpaCompliant && <span className="audit-ledger-flag audit-ledger-flag--pass">CCPA</span>}
              </td>
              <td>
                {entry.userFeedback ? (
                  <span className={`audit-ledger-feedback audit-ledger-feedback--${entry.userFeedback.correct ? 'correct' : 'incorrect'}`}>
                    {entry.userFeedback.correct ? 'Correct' : 'Incorrect'}
                  </span>
                ) : (
                  onFeedback && (
                    <div className="audit-ledger-feedback-actions" onClick={(e) => e.stopPropagation()}>
                      <button type="button" className="audit-ledger-fb-btn" onClick={() => onFeedback(entry.id, true)} title="Mark correct">&#10003;</button>
                      <button type="button" className="audit-ledger-fb-btn" onClick={() => onFeedback(entry.id, false)} title="Mark incorrect">&#10007;</button>
                    </div>
                  )
                )}
              </td>
              <td>
                <AuditLinkChip auditId={entry.id} to="/govern/audit-detail" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
