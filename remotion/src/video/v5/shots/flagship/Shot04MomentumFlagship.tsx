import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { ShotTransition } from '../../../../shared/animation/ShotTransition';
import { BloomEffect, LensFlare } from '../../../../shared/effects/BloomEffect';
import { Camera3D } from '../../../../shared/animation/Camera3D';
import { ThreeLayerStack } from '../../../../shared/visuals/ThreeLayerStack';
import { BeatSyncedGrid } from '../../../../shared/cinematic';
import { theme } from '../../../../shared/theme';
import { copy } from '../../../../shared/copy';
import { getVideoLayoutStyles, type VideoLayoutMode } from '../../../layout/VideoLayout';
import { V5_FLAGSHIP_SHOTS, V5_VIDEO_BPM } from '../../config';

interface Shot04MomentumFlagshipProps {
  layout?: VideoLayoutMode;
}

/**
 * Narrative Shot 5: Architecture (5s, 150 frames)
 * Three-layer architecture stack: Deterministic -> GenAI -> Human.
 */
export const Shot04MomentumFlagship: React.FC<Shot04MomentumFlagshipProps> = ({
  layout = 'landscape',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { safeArea, scaledSafeArea } = getVideoLayoutStyles(layout);
  const containerStyle = layout === 'portrait' ? scaledSafeArea : safeArea;

  // Bloom appears after all 3 layers (frame 90+)
  const bloomReveal = spring({
    frame: frame - 90,
    fps,
    config: { damping: 18, stiffness: 60 },
  });

  return (
    <ShotTransition
      durationInFrames={V5_FLAGSHIP_SHOTS.shot5.duration}
      enterType="fade"
      exitType="zoom-through"
      enterDuration={12}
      exitDuration={10}
    >
      <AbsoluteFill style={{ background: '#000' }}>
        {/* Subtle background grid */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.15 }}>
          <BeatSyncedGrid cellSize={60} bpm={V5_VIDEO_BPM} pulseIntensity={0.1} />
        </div>

        {/* Camera3D for procedural drift (frame 120+) */}
        <Camera3D
          perspective={1200}
          driftX={frame >= 120 ? 2 : 0}
          driftY={frame >= 120 ? 1.5 : 0}
        >
          <AbsoluteFill
            style={{
              ...containerStyle,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ position: 'relative' }}>
              {bloomReveal > 0.1 && (
                <div style={{ position: 'absolute', inset: -40, opacity: bloomReveal * 0.5 }}>
                  <BloomEffect color={theme.accent.cyan} intensity={0.6} rays={6} raySpread={360}>
                    <div style={{ width: '100%', height: '100%' }} />
                  </BloomEffect>
                </div>
              )}

              <ThreeLayerStack
                layers={copy.videoV5Flagship.shot5.layers}
                delay={10}
                stagger={30}
              />
            </div>
          </AbsoluteFill>
        </Camera3D>

        {/* LensFlare at center (frame 60+) */}
        {frame >= 58 && (
          <LensFlare
            x={50}
            y={50}
            color={theme.accent.cyan}
            intensity={interpolate(frame, [58, 75], [0, 0.6], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            })}
            streakLength={400}
            delay={0}
          />
        )}
      </AbsoluteFill>
    </ShotTransition>
  );
};
