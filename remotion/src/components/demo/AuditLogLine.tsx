/**
 * AuditLogLine — single audit log entry with typewriter reveal.
 */
import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { theme } from '../../shared/theme';

interface AuditLogLineProps {
  id: string;
  action: 'BLOCKED' | 'APPROVED' | 'FORECAST';
  merchant: string;
  amount: string;
  aiPct: number;
  human: boolean;
  delay: number;       // frame offset before this line starts typing
  highlight?: boolean; // green highlight for last entry
}

const ACTION_COLORS = {
  BLOCKED:  '#EF4444',
  APPROVED: '#22C55E',
  FORECAST: '#8B5CF6',
};

export const AuditLogLine: React.FC<AuditLogLineProps> = ({
  id, action, merchant, amount, aiPct, human, delay, highlight = false,
}) => {
  const frame = useCurrentFrame();
  const elapsed = frame - delay;

  // Reveal characters over 20 frames
  const fullText = `${id}  ${action.padEnd(8)}  ${merchant.padEnd(16)} AI:${aiPct}%  ${human ? 'Human:✓' : 'Auto:—'}`;
  const charsToShow = Math.max(0, Math.floor(interpolate(elapsed, [0, 22], [0, fullText.length], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })));

  const opacity = interpolate(elapsed, [0, 6], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const actionColor = ACTION_COLORS[action];

  return (
    <div
      style={{
        opacity,
        display: 'flex',
        alignItems: 'center',
        gap: 0,
        padding: '6px 12px',
        borderRadius: 6,
        background: highlight ? 'rgba(34,197,94,0.06)' : 'transparent',
        border: highlight ? '1px solid rgba(34,197,94,0.18)' : '1px solid transparent',
        fontFamily: theme.typography.fontMono,
        fontSize: 13,
        color: 'rgba(255,255,255,0.75)',
      }}
    >
      <span style={{ color: 'rgba(255,255,255,0.35)', minWidth: 120 }}>{id.slice(0, charsToShow)}</span>
      <span style={{ color: actionColor, minWidth: 90, fontWeight: 600 }}>
        {elapsed > 4 ? action.slice(0, Math.max(0, charsToShow - id.length - 2)) : ''}
      </span>
      <span style={{ color: 'rgba(255,255,255,0.6)', flex: 1 }}>
        {elapsed > 8 ? fullText.slice(id.length + action.length + 2, charsToShow) : ''}
      </span>
    </div>
  );
};
