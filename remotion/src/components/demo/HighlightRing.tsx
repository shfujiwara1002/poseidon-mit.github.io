/**
 * HighlightRing — animated pulsing ring overlay at a specific screen position.
 *
 * Props:
 *   cx, cy  — center position as fraction of the 1920×1080 frame (0–1)
 *   radius  — outer ring radius in pixels (default 48)
 *   color   — ring color hex
 *   delay   — frame offset before animation starts (default 0)
 */
import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface HighlightRingProps {
  cx: number;
  cy: number;
  radius?: number;
  color: string;
  delay?: number;
}

const FRAME_W = 1920;
const FRAME_H = 1080;

export const HighlightRing: React.FC<HighlightRingProps> = ({
  cx,
  cy,
  radius = 48,
  color,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - delay;

  // Appear spring
  const appear = spring({
    frame: localFrame,
    fps,
    config: { damping: 18, stiffness: 55 },
  });

  const opacity = interpolate(appear, [0, 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Pulse: oscillate scale every ~40 frames
  const pulse = interpolate(
    Math.sin((localFrame / 40) * Math.PI * 2),
    [-1, 1],
    [0.92, 1.08],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  const x = cx * FRAME_W;
  const y = cy * FRAME_H;

  return (
    <svg
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        overflow: 'visible',
        pointerEvents: 'none',
        opacity,
      }}
      viewBox={`0 0 ${FRAME_W} ${FRAME_H}`}
      preserveAspectRatio="none"
    >
      {/* Outer glow ring */}
      <circle
        cx={x}
        cy={y}
        r={radius * pulse}
        fill="none"
        stroke={color}
        strokeWidth={3}
        opacity={0.6}
        filter={`drop-shadow(0 0 8px ${color}88)`}
      />
      {/* Inner bright ring */}
      <circle
        cx={x}
        cy={y}
        r={radius * pulse * 0.65}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        opacity={0.9}
      />
      {/* Center dot */}
      <circle
        cx={x}
        cy={y}
        r={4}
        fill={color}
        opacity={0.8}
      />
    </svg>
  );
};
