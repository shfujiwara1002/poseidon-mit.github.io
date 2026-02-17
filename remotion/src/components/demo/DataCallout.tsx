/**
 * DataCallout — slide-in data annotation overlay.
 * Renders a JetBrains Mono styled callout that slides in from the left.
 * Usage: wrap in <Sequence from={startFrame}> to control timing.
 */
import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { theme } from '../../shared/theme';

interface DataCalloutProps {
  text: string;
  position?: 'left' | 'center-bottom';
  color?: string;
}

export const DataCallout: React.FC<DataCalloutProps> = ({
  text,
  position = 'left',
  color = theme.accent.cyan,
}) => {
  const frame = useCurrentFrame();

  // Slide in from left over 12 frames, hold, fade out at 90
  const slideIn = interpolate(frame, [0, 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame, [80, 96], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const opacity = Math.min(slideIn, fadeOut);
  const translateX = interpolate(slideIn, [0, 1], [-32, 0]);

  const isCenter = position === 'center-bottom';

  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        display: 'flex',
        alignItems: isCenter ? 'flex-end' : 'flex-start',
        justifyContent: isCenter ? 'center' : 'flex-start',
        padding: isCenter ? '0 0 80px 0' : '160px 0 0 140px',
      }}
    >
      <div
        style={{
          opacity,
          transform: `translateX(${translateX}px)`,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: 'rgba(8,12,24,0.88)',
          border: `1px solid ${color}33`,
          borderLeft: `3px solid ${color}`,
          borderRadius: 8,
          padding: '8px 16px',
          boxShadow: `0 4px 24px rgba(0,0,0,0.4), 0 0 12px ${color}18`,
          backdropFilter: 'blur(12px)',
        }}
      >
        <span
          style={{
            fontFamily: theme.typography.fontMono,
            fontSize: 15,
            color: 'rgba(255,255,255,0.92)',
            letterSpacing: '0.01em',
          }}
        >
          {text}
        </span>
      </div>
    </AbsoluteFill>
  );
};
