import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { theme } from '../theme';

interface CursorWaypoint {
  frame: number;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  clickAt?: boolean;
}

interface AnimatedCursorProps {
  waypoints: readonly CursorWaypoint[];
  color?: string;
  size?: number;
}

/**
 * Animated SVG cursor that moves between waypoints using spring physics.
 * Click ripple effect on waypoints marked with clickAt.
 */
export const AnimatedCursor: React.FC<AnimatedCursorProps> = ({
  waypoints,
  color = theme.accent.cyan,
  size = 24,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (waypoints.length === 0) return null;

  // Find current segment
  let segIdx = 0;
  for (let i = 0; i < waypoints.length - 1; i++) {
    if (frame >= waypoints[i].frame) segIdx = i;
  }

  const current = waypoints[segIdx];
  const next = waypoints[Math.min(segIdx + 1, waypoints.length - 1)];

  // Spring-based progress between waypoints
  const prog = current === next
    ? 1
    : spring({
        frame: frame - current.frame,
        fps,
        config: { damping: 20, mass: 1.2, stiffness: 60 },
        durationInFrames: Math.max(1, next.frame - current.frame),
      });

  const cx = interpolate(prog, [0, 1], [current.x, next.x]);
  const cy = interpolate(prog, [0, 1], [current.y, next.y]);

  // Cursor visibility: fade in at first waypoint
  const visible = frame >= waypoints[0].frame - 5;
  const fadeIn = interpolate(
    frame,
    [waypoints[0].frame - 5, waypoints[0].frame],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 100,
        opacity: fadeIn,
      }}
    >
      {/* Cursor arrow */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        style={{
          position: 'absolute',
          left: `${cx}%`,
          top: `${cy}%`,
          transform: 'translate(-2px, -2px)',
          filter: `drop-shadow(0 0 6px ${color})`,
        }}
      >
        <path
          d="M5 3l14 8-7 2-3 7z"
          fill={color}
          stroke="rgba(0,0,0,0.5)"
          strokeWidth={1}
        />
      </svg>

      {/* Click ripple effects */}
      {waypoints.map((wp, i) => {
        if (!wp.clickAt) return null;
        const rippleFrame = frame - wp.frame;
        if (rippleFrame < -2 || rippleFrame > 20) return null;

        const rippleProgress = interpolate(rippleFrame, [0, 20], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${wp.x}%`,
              top: `${wp.y}%`,
              width: 40 * (1 + rippleProgress),
              height: 40 * (1 + rippleProgress),
              borderRadius: '50%',
              border: `2px solid ${color}`,
              transform: 'translate(-50%, -50%)',
              opacity: 1 - rippleProgress,
              pointerEvents: 'none',
            }}
          />
        );
      })}
    </div>
  );
};
