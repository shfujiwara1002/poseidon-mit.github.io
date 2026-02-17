/**
 * S1Hook — 0–3s (frames 0–90)
 * Problem hook: "$133/mo" floats up from darkness.
 */
import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../../shared/theme';

export const S1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Main number rises from below and glows
  const mainReveal = spring({ frame: frame - 8, fps, config: { damping: 20, stiffness: 50 } });
  const mainY = interpolate(mainReveal, [0, 1], [40, 0]);
  const mainOpacity = interpolate(frame, [0, 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Subtext fades in after main number
  const subOpacity = interpolate(frame, [28, 44], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Subtle zoom out — start close, pull back
  const scale = interpolate(frame, [0, 90], [1.06, 1.0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Fade out entire scene
  const fadeOut = interpolate(frame, [72, 90], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        background: theme.background.deepNavy,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        opacity: fadeOut,
        transform: `scale(${scale})`,
      }}
    >
      {/* Main number */}
      <div
        style={{
          opacity: mainOpacity,
          transform: `translateY(${mainY}px)`,
          fontFamily: theme.typography.fontMono,
          fontSize: 120,
          fontWeight: 300,
          color: 'rgba(255,255,255,0.95)',
          letterSpacing: '-0.04em',
          lineHeight: 1,
          textShadow: `0 0 60px rgba(0,240,255,0.20), 0 0 20px rgba(0,240,255,0.08)`,
        }}
      >
        $133<span style={{ fontSize: 56, color: 'rgba(255,255,255,0.55)', fontWeight: 300 }}>/mo</span>
      </div>

      {/* Subtext */}
      <div
        style={{
          marginTop: 20,
          opacity: subOpacity,
          fontFamily: theme.typography.fontMono,
          fontSize: 18,
          color: 'rgba(255,255,255,0.35)',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
        }}
      >
        hidden coordination tax
      </div>
    </AbsoluteFill>
  );
};
