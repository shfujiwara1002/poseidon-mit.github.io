/**
 * EngineChip — bottom-right engine keyword chip.
 * Fixed-position label that fades in to identify the current engine.
 */
import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { theme } from '../../shared/theme';

type Engine = 'PROTECT' | 'GROW' | 'EXECUTE' | 'GOVERN';

const ENGINE_COLORS: Record<Engine, string> = {
  PROTECT: theme.accent.emerald,
  GROW:    theme.accent.violet,
  EXECUTE: theme.accent.amber,
  GOVERN:  theme.accent.blue,
};

interface EngineChipProps {
  engine: Engine;
  delay?: number;
}

export const EngineChip: React.FC<EngineChipProps> = ({ engine, delay = 0 }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame - delay, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const color = ENGINE_COLORS[engine];

  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        padding: '0 48px 40px 0',
      }}
    >
      <div
        style={{
          opacity,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: `${color}18`,
          border: `1px solid ${color}44`,
          borderRadius: 20,
          padding: '4px 12px',
          boxShadow: `0 0 12px ${color}22`,
        }}
      >
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: color,
            boxShadow: `0 0 6px ${color}`,
          }}
        />
        <span
          style={{
            fontFamily: theme.typography.fontMono,
            fontSize: 10,
            fontWeight: 600,
            color,
            letterSpacing: '0.12em',
          }}
        >
          {engine}
        </span>
      </div>
    </AbsoluteFill>
  );
};
