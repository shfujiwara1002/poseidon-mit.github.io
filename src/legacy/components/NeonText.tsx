import React from 'react';

type NeonColor = 'cyan' | 'teal' | 'violet' | 'amber' | 'blue' | 'red';

type NeonIntensity = 'standard' | 'deep' | 'sharper';

type ElementTag = 'span' | 'div' | 'p' | 'h1' | 'h2' | 'h3';

interface NeonTextProps {
  color: NeonColor;
  intensity?: NeonIntensity;
  gradient?: boolean;
  as?: ElementTag;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

const gradientMap: Record<NeonColor, string> = {
  cyan: 'var(--text-gradient-cyan)',
  teal: 'var(--text-gradient-teal)',
  violet: 'var(--text-gradient-violet)',
  amber: 'var(--text-gradient-amber)',
  blue: 'var(--text-gradient-blue)',
  red: 'linear-gradient(90deg, #fca5a5 0%, #ef4444 100%)',
};

const accentMap: Record<NeonColor, string> = {
  cyan: 'var(--accent-cyan)',
  teal: 'var(--accent-teal)',
  violet: 'var(--accent-violet)',
  amber: 'var(--accent-amber)',
  blue: 'var(--accent-blue)',
  red: 'var(--accent-red)',
};

const neonMap: Record<NeonIntensity, Record<NeonColor, string>> = {
  standard: {
    cyan: 'var(--neon-cyan)',
    teal: 'var(--neon-teal)',
    violet: 'var(--neon-violet)',
    amber: 'var(--neon-amber)',
    blue: 'var(--neon-blue)',
    red: 'var(--neon-red)',
  },
  deep: {
    cyan: 'var(--neon-cyan-deep)',
    teal: 'var(--neon-teal-deep)',
    violet: 'var(--neon-violet-deep)',
    amber: 'var(--neon-amber-deep)',
    blue: 'var(--neon-blue-deep)',
    red: 'var(--neon-red-deep)',
  },
  sharper: {
    cyan: 'var(--neon-cyan-sharper)',
    teal: 'var(--neon-teal-sharper)',
    violet: 'var(--neon-violet-sharper)',
    amber: 'var(--neon-amber-sharper)',
    blue: 'var(--neon-blue-sharper)',
    red: 'var(--neon-red-sharper)',
  },
};

export const NeonText: React.FC<NeonTextProps> = ({
  color,
  intensity = 'standard',
  gradient = false,
  as: Tag = 'span',
  style,
  children,
}) => {
  if (gradient) {
    return (
      <Tag
        style={{
          background: gradientMap[color],
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          WebkitTextFillColor: 'transparent',
          textShadow: 'var(--text-shadow-neon)',
          ...style,
        }}
      >
        {children}
      </Tag>
    );
  }

  return (
    <Tag
      style={{
        color: accentMap[color],
        textShadow: neonMap[intensity][color],
        ...style,
      }}
    >
      {children}
    </Tag>
  );
};
