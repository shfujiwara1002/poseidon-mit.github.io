import React from 'react';

type GlowColor = 'cyan' | 'teal' | 'violet' | 'amber' | 'blue' | 'red';

interface GlowPulseProps {
  color?: GlowColor;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const glowColorMap: Record<GlowColor, string> = {
  cyan: 'rgba(0, 240, 255, 0.5)',
  teal: 'rgba(21, 225, 194, 0.5)',
  violet: 'rgba(143, 107, 255, 0.5)',
  amber: 'rgba(255, 176, 0, 0.5)',
  blue: 'rgba(88, 166, 255, 0.5)',
  red: 'rgba(255, 75, 85, 0.5)',
};

export const GlowPulse: React.FC<GlowPulseProps> = ({
  color = 'cyan',
  children,
  className,
  style,
}) => (
  <span
    className={`glow-pulse${className ? ` ${className}` : ''}`}
    style={{
      '--glow-color': glowColorMap[color],
      display: 'inline-flex',
      ...style,
    } as React.CSSProperties}
  >
    {children}
  </span>
);
