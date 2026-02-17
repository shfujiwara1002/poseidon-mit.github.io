import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

interface FocusableLayerProps {
  children: React.ReactNode;
  isFocused: boolean;
  blurAmount?: number;
  dimAmount?: number;
  transitionFrames?: number;
}

/**
 * Boolean-driven depth-of-field wrapper.
 * Blurs and dims children when not focused; sharp and bright when focused.
 */
export const FocusableLayer: React.FC<FocusableLayerProps> = ({
  children,
  isFocused,
  blurAmount = 8,
  dimAmount = 0.4,
  transitionFrames = 15,
}) => {
  const frame = useCurrentFrame();

  // Simple approach: when focused, blur=0 opacity=1; when not, blur=blurAmount opacity=(1-dimAmount)
  // Use frame-based smooth transition by tracking via interpolate
  const targetBlur = isFocused ? 0 : blurAmount;
  const targetOpacity = isFocused ? 1 : 1 - dimAmount;

  return (
    <div
      style={{
        filter: targetBlur > 0 ? `blur(${targetBlur}px)` : 'none',
        opacity: targetOpacity,
        transition: `filter ${transitionFrames * 33}ms ease-out, opacity ${transitionFrames * 33}ms ease-out`,
      }}
    >
      {children}
    </div>
  );
};
