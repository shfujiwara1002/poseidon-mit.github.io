import { useState, type ReactNode } from 'react';
import { AlertTriangle, ShieldAlert, Banknote, BarChart3 } from 'lucide-react';
import { SignalEvidenceDecisionCard } from './SignalEvidenceDecisionCard';
import type { ThreatAlert } from '../services/mockProtect';

export interface ThreatAlertCardProps {
  alert: ThreatAlert;
  onApprove?: (id: string) => void;
  onBlock?: (id: string) => void;
  onLearnMore?: (id: string) => void;
  summaryMaxLinesDesktop?: number;
  summaryMaxLinesMobile?: number;
  detailsDefault?: 'collapsed' | 'expanded';
}

const typeConfig: Record<ThreatAlert['type'], { icon: ReactNode; label: string }> = {
  fraud: { icon: <ShieldAlert size={20} />, label: 'Possible Fraud' },
  overdraft: { icon: <AlertTriangle size={20} />, label: 'Overdraft Risk' },
  subscription_leak: { icon: <Banknote size={20} />, label: 'Subscription Waste' },
  unusual_spending: { icon: <BarChart3 size={20} />, label: 'Unusual Spending' },
};

function formatTimestamp(date: Date) {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 0) {
    const futureDays = Math.ceil(-diffMs / (1000 * 60 * 60 * 24));
    return `in ${futureDays} day${futureDays !== 1 ? 's' : ''}`;
  }
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  return date.toLocaleDateString('en-US');
}

export function ThreatAlertCard({
  alert,
  onApprove,
  onBlock,
  onLearnMore,
  summaryMaxLinesDesktop,
  summaryMaxLinesMobile,
  detailsDefault = 'collapsed',
}: ThreatAlertCardProps) {
  const [expanded, setExpanded] = useState(detailsDefault === 'expanded');
  const typeInfo = typeConfig[alert.type];

  return (
    <SignalEvidenceDecisionCard
      signal={{
        title: typeInfo.label,
        severity: alert.severity,
        timestampLabel: formatTimestamp(alert.transaction.timestamp),
        amountLabel: `$${alert.transaction.amount.toLocaleString()}`,
        merchantLabel: alert.transaction.merchant,
        locationLabel: alert.transaction.location,
        icon: typeInfo.icon,
      }}
      evidence={{
        summary: alert.aiExplanation.reason,
        confidenceLabel: `Confidence ${alert.aiExplanation.confidence}%`,
        sourceLabel: 'Model v3.2',
        falsePositiveRateLabel: `FP rate ${alert.aiExplanation.falsePositiveRate}%`,
        factors: alert.aiExplanation.shapValues,
      }}
      decision={{
        status: alert.status,
        primaryLabel: 'Block',
        secondaryLabel: 'Approve',
        tertiaryLabel: onLearnMore ? 'Details' : undefined,
        onPrimary: () => onBlock?.(alert.id),
        onSecondary: () => onApprove?.(alert.id),
        onTertiary: onLearnMore ? () => onLearnMore(alert.id) : undefined,
      }}
      expanded={expanded}
      onToggleExpanded={setExpanded}
      summaryMaxLinesDesktop={summaryMaxLinesDesktop}
      summaryMaxLinesMobile={summaryMaxLinesMobile}
      detailsDefault={detailsDefault}
    />
  );
}
