/**
 * ProgressBar — animated fill bar with optional label and goal badge.
 */
import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../../shared/theme';

interface ProgressBarProps {
  fromPct: number;
  toPct: number;
  color?: string;
  label?: string;
  sublabel?: string;
  fillDuration?: number; // frames to animate fill
  delay?: number;
  showGoalBadge?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  fromPct,
  toPct,
  color = theme.accent.violet,
  label,
  sublabel,
  fillDuration = 40,
  delay = 0,
  showGoalBadge = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const elapsed = frame - delay;

  const springProgress = spring({
    frame: elapsed,
    fps,
    config: { damping: 22, stiffness: 50, mass: 0.8 },
  });

  const pct = interpolate(springProgress, [0, 1], [fromPct, toPct], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const isGoalReached = pct >= 99.5 && showGoalBadge;
  const goalBadgeOpacity = interpolate(elapsed - fillDuration, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div style={{ width: '100%' }}>
      {(label || sublabel) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontFamily: theme.typography.fontUi, fontSize: 14, color: 'rgba(255,255,255,0.75)' }}>
            {label}
          </span>
          <span style={{ fontFamily: theme.typography.fontMono, fontSize: 13, color }}>
            {sublabel ?? `${Math.round(pct)}%`}
          </span>
        </div>
      )}

      {/* Track */}
      <div
        style={{
          width: '100%',
          height: 8,
          borderRadius: 4,
          background: 'rgba(255,255,255,0.08)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Fill */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: `${pct}%`,
            borderRadius: 4,
            background: `linear-gradient(90deg, ${color}88 0%, ${color} 100%)`,
            boxShadow: `0 0 12px ${color}66`,
          }}
        />
      </div>

      {/* Goal badge */}
      {showGoalBadge && isGoalReached && (
        <div
          style={{
            opacity: goalBadgeOpacity,
            marginTop: 10,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: `${color}18`,
            border: `1px solid ${color}44`,
            borderRadius: 20,
            padding: '4px 12px',
          }}
        >
          <span style={{ color, fontSize: 12, fontWeight: 700 }}>✓ Goal reached</span>
        </div>
      )}
    </div>
  );
};
