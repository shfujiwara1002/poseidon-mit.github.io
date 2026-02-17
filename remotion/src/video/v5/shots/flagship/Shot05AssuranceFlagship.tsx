import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { ShotTransition } from '../../../../shared/animation/ShotTransition';
import { CameraController, CameraEasing } from '../../../../shared/camera/CameraController';
import { AnimatedAuditLog } from '../../../../shared/live-ui/AnimatedList';
import { AnimatedCardReveal } from '../../../../shared/live-ui/AnimatedUI';
import { AnimatedCursor } from '../../../../shared/live-ui/AnimatedCursor';
import { FocusableLayer } from '../../../../shared/cinematic/FocusableLayer';
import { GlassRefraction } from '../../../../shared/cinematic/GlassRefraction';
import { theme } from '../../../../shared/theme';
import { copy } from '../../../../shared/copy';
import { getVideoLayoutStyles, type VideoLayoutMode } from '../../../layout/VideoLayout';
import { V5_FLAGSHIP_SHOTS } from '../../config';

interface Shot05AssuranceFlagshipProps {
  layout?: VideoLayoutMode;
}

/**
 * Narrative Shot 4: Proof-Govern (5s, 150 frames)
 * Audit ledger with component-focus camera + cursor interaction.
 */
export const Shot05AssuranceFlagship: React.FC<Shot05AssuranceFlagshipProps> = ({
  layout = 'landscape',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { safeArea, scaledSafeArea } = getVideoLayoutStyles(layout);
  const containerStyle = layout === 'portrait' ? scaledSafeArea : safeArea;

  // Focus: first entry focused 30-60, all entries 60+
  const entryFocused = frame >= 30 && frame < 60;

  // Status badge transition: "Pending" -> "Blocked" at frame 50
  const statusChanged = frame >= 50;
  const statusFlash = interpolate(frame, [50, 55], [0.8, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Compliance badges (frame 60+)
  const badgeReveal = spring({
    frame: frame - 65,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  // Modify first entry status for the transition
  const entries = copy.videoV5Flagship.shot4.auditEntries.map((entry, i) => ({
    ...entry,
    status: i === 0 && statusChanged ? 'Blocked' : entry.status,
  }));

  return (
    <ShotTransition
      durationInFrames={V5_FLAGSHIP_SHOTS.shot4.duration}
      enterType="push"
      exitType="fade"
      enterDuration={10}
      exitDuration={12}
    >
      <CameraController
        keyframes={[
          { frame: 0, scale: 0.8, x: 0, y: 0 },
          { frame: 30, scale: 2.5, x: -5, y: -15, easing: CameraEasing.dramatic },
          { frame: 60, scale: 2.5, x: -5, y: -15 },
          { frame: 80, scale: 1.2, x: 0, y: 5, easing: CameraEasing.smooth },
          { frame: 120, scale: 0.8, x: 0, y: 0, easing: CameraEasing.zoomOut },
        ]}
      >
        <AbsoluteFill
          style={{
            background: theme.backgroundGradient,
            color: 'white',
            fontFamily: theme.typography.fontUi,
          }}
        >
          <div style={{ ...containerStyle, display: 'block' }}>
            <AnimatedCardReveal delay={4}>
              <div style={{ fontSize: 24, fontWeight: 600, marginBottom: 20 }}>
                Governance Audit Trail
              </div>
            </AnimatedCardReveal>

            <FocusableLayer isFocused={!entryFocused || frame < 30} blurAmount={6} dimAmount={0.2}>
              <AnimatedCardReveal delay={6} direction="up">
                <GlassRefraction intensity={0.5} glowColor={theme.accent.blue} borderRadius={20}>
                  <div style={{ padding: 24 }}>
                    <AnimatedAuditLog entries={entries} delay={8} stagger={10} />
                  </div>
                </GlassRefraction>
              </AnimatedCardReveal>
            </FocusableLayer>

            {/* Compliance badges (frame 65+) */}
            {frame >= 60 && (
              <div
                style={{
                  display: 'flex',
                  gap: 16,
                  marginTop: 24,
                  opacity: badgeReveal,
                  transform: `translateY(${interpolate(badgeReveal, [0, 1], [20, 0])}px)`,
                }}
              >
                {copy.videoV5Flagship.shot4.badges.map((badge) => (
                  <div
                    key={badge}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 8,
                      backgroundColor: 'rgba(59, 130, 246, 0.15)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      fontSize: 13,
                      fontWeight: 600,
                      color: theme.accent.blue,
                      fontFamily: theme.typography.fontMono,
                    }}
                  >
                    {badge}
                  </div>
                ))}
              </div>
            )}
          </div>
        </AbsoluteFill>
      </CameraController>

      {/* Status change red flash overlay */}
      {statusFlash > 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: `rgba(239, 68, 68, ${statusFlash * 0.15})`,
            pointerEvents: 'none',
            zIndex: 5,
          }}
        />
      )}

      {/* Animated cursor */}
      <AnimatedCursor
        waypoints={[
          { frame: 15, x: 30, y: 50 },
          { frame: 40, x: 65, y: 42, clickAt: true },
          { frame: 70, x: 50, y: 80 },
        ]}
        color={theme.accent.blue}
      />
    </ShotTransition>
  );
};
