/**
 * ApproveButton — animated approve button with ripple effect.
 * clickFrame: frame within this component's local frame where click happens.
 */
import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { theme } from '../../shared/theme';

interface ApproveButtonProps {
  clickFrame: number;       // local frame when button is "clicked"
  color?: string;
  label?: string;
  confirmedLabel?: string;
}

export const ApproveButton: React.FC<ApproveButtonProps> = ({
  clickFrame,
  color = theme.accent.emerald,
  label = 'Approve',
  confirmedLabel = '✓ Approved',
}) => {
  const frame = useCurrentFrame();
  const isClicked = frame >= clickFrame;

  // Ripple scale: expands from 0 to 3x then fades
  const rippleScale = interpolate(frame - clickFrame, [0, 20], [0.5, 3.0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const rippleOpacity = interpolate(frame - clickFrame, [0, 20], [0.6, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Pulse before click
  const prePulse = !isClicked
    ? Math.sin((frame / 18) * Math.PI) * 0.04 + 1
    : 1;

  const confirmedOpacity = interpolate(frame - clickFrame, [0, 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Ripple */}
      {isClicked && (
        <div
          style={{
            position: 'absolute',
            width: 120,
            height: 40,
            borderRadius: 10,
            background: color,
            opacity: rippleOpacity,
            transform: `scale(${rippleScale})`,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Button */}
      <div
        style={{
          position: 'relative',
          padding: '10px 28px',
          borderRadius: 10,
          background: isClicked ? `${color}22` : `${color}18`,
          border: `1.5px solid ${isClicked ? color : `${color}66`}`,
          cursor: 'pointer',
          transform: `scale(${prePulse})`,
          boxShadow: isClicked ? `0 0 20px ${color}44` : `0 0 8px ${color}18`,
          transition: 'all 0.1s',
        }}
      >
        <span
          style={{
            fontFamily: theme.typography.fontUi,
            fontSize: 15,
            fontWeight: 600,
            color: isClicked
              ? color
              : 'rgba(255,255,255,0.9)',
            opacity: isClicked ? confirmedOpacity : 1,
          }}
        >
          {isClicked ? confirmedLabel : label}
        </span>
      </div>
    </div>
  );
};
