import React from 'react';

type SignalColor = 'cyan' | 'teal' | 'violet' | 'amber' | 'blue' | 'red';

interface SignalRowProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  color?: SignalColor;
}

interface SignalGroupProps {
  children: React.ReactNode;
}

const colorVar: Record<SignalColor, string> = {
  cyan: 'var(--accent-cyan)',
  teal: 'var(--accent-teal)',
  violet: 'var(--accent-violet)',
  amber: 'var(--accent-amber)',
  blue: 'var(--accent-blue)',
  red: 'var(--accent-red)',
};

export const SignalRow: React.FC<SignalRowProps> = ({ icon, label, value, color = 'cyan' }) => (
  <div className="signal-row">
    <span className="signal-icon" style={{ color: colorVar[color] }}>{icon}</span>
    <span className="signal-label">{label}</span>
    {value && <span className="signal-value" style={{ color: colorVar[color] }}>{value}</span>}
  </div>
);

export const SignalGroup: React.FC<SignalGroupProps> = ({ children }) => (
  <div className="signal-group">{children}</div>
);
