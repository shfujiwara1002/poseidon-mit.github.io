import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { ShotTransition } from '../../../../shared/animation/ShotTransition';
import { CameraController, CameraEasing } from '../../../../shared/camera/CameraController';
import { AnimatedChartLine } from '../../../../shared/live-ui/AnimatedChart';
import { AnimatedCardReveal, ShakeElement } from '../../../../shared/live-ui/AnimatedUI';
import { AnimatedCursor } from '../../../../shared/live-ui/AnimatedCursor';
import { AnimatedAuditLog } from '../../../../shared/live-ui/AnimatedList';
import { FocusableLayer } from '../../../../shared/cinematic/FocusableLayer';
import { CountUpText } from '../../../../shared/animation/CountUpText';
import { GlassRefraction } from '../../../../shared/cinematic/GlassRefraction';
import { BloomEffect } from '../../../../shared/effects/BloomEffect';
import { theme } from '../../../../shared/theme';
import { copy } from '../../../../shared/copy';
import { getVideoLayoutStyles, type VideoLayoutMode } from '../../../layout/VideoLayout';
import { V5_FLAGSHIP_SHOTS } from '../../config';

interface Shot03ClarityFlagshipProps {
  layout?: VideoLayoutMode;
}

/**
 * HERO SHOT — Proof-Protect (6s, 180 frames)
 * Threat detection with component-focus cinematography.
 * Camera zooms aggressively to isolate chart, then audit panel.
 */
export const Shot03ClarityFlagship: React.FC<Shot03ClarityFlagshipProps> = ({
  layout = 'landscape',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { safeArea, scaledSafeArea } = getVideoLayoutStyles(layout);
  const containerStyle = layout === 'portrait' ? scaledSafeArea : safeArea;

  // Chart data with anomaly spike at index 6 (frame 50+)
  const normalData = [1280, 1320, 1350, 1390, 1420, 1450];
  const spikeValue = frame >= 50 ? 2400 : 1450;
  const chartData = [...normalData, spikeValue];

  // Chart color: teal -> red during spike
  const chartColorProgress = interpolate(frame, [50, 60], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const chartColor = chartColorProgress > 0.5 ? theme.accent.red : theme.accent.teal;

  // Focus states
  const chartFocused = frame < 90;
  const auditFocused = frame >= 90;

  // Anomaly card slam-in (frame 70)
  const anomalyReveal = spring({
    frame: frame - 70,
    fps,
    config: { damping: 12, mass: 0.8, stiffness: 150 },
  });

  // CountUp overlay (frames 120-155)
  const countUpOpacity = interpolate(frame, [120, 125, 155, 160], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <ShotTransition
      durationInFrames={V5_FLAGSHIP_SHOTS.shot3.duration}
      enterType="zoom-through"
      exitType="flash"
      enterDuration={12}
      exitDuration={10}
    >
      <CameraController
        keyframes={[
          { frame: 0, scale: 0.6, x: 0, y: 0 },
          { frame: 20, scale: 2.2, x: 15, y: -20, easing: CameraEasing.dramatic },
          { frame: 70, scale: 2.2, x: 15, y: -20 },
          { frame: 90, scale: 2.0, x: -10, y: 20, easing: CameraEasing.smooth },
          { frame: 140, scale: 2.0, x: -10, y: 20 },
          { frame: 160, scale: 0.7, x: 0, y: 0, easing: CameraEasing.zoomOut },
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
            <AnimatedCardReveal delay={3}>
              <div style={{ fontSize: 26, fontWeight: 600, marginBottom: 18 }}>
                {copy.videoV5Flagship.shot3.panelTitle}
              </div>
            </AnimatedCardReveal>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, height: 'calc(100% - 60px)' }}>
              {/* LEFT: Chart panel */}
              <FocusableLayer isFocused={chartFocused} blurAmount={8} dimAmount={0.3}>
                <AnimatedCardReveal delay={5} direction="up">
                  <GlassRefraction intensity={0.5} glowColor={theme.accent.teal} borderRadius={20}>
                    <div style={{ padding: 24, position: 'relative' }}>
                      <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>
                        {copy.videoV5Flagship.shot3.chartLabel}
                      </div>

                      <AnimatedChartLine
                        data={chartData}
                        width={560}
                        height={180}
                        color={chartColor}
                        delay={10}
                        drawDuration={30}
                        showDotGrid
                        glow
                      />

                      {/* Bloom on spike */}
                      {frame >= 50 && frame < 90 && (
                        <div style={{ position: 'absolute', top: '20%', right: '15%' }}>
                          <BloomEffect color={theme.accent.red} intensity={0.9} pulseFrequency={8}>
                            <div style={{ width: 20, height: 20 }} />
                          </BloomEffect>
                        </div>
                      )}
                    </div>
                  </GlassRefraction>
                </AnimatedCardReveal>
              </FocusableLayer>

              {/* RIGHT: Audit panel */}
              <FocusableLayer isFocused={auditFocused} blurAmount={8} dimAmount={0.3}>
                <AnimatedCardReveal delay={12} direction="right">
                  <GlassRefraction intensity={0.45} glowColor={theme.accent.amber} borderRadius={20}>
                    <div style={{ padding: 20 }}>
                      <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>
                        Audit Trail
                      </div>

                      {frame >= 90 && (
                        <AnimatedAuditLog
                          entries={[{
                            id: 'G-PF-0192',
                            engine: 'Protect' as const,
                            action: 'Flag unauthorized transfer $2,847',
                            time: '02:14',
                            status: 'BLOCKED',
                          }]}
                          delay={0}
                          stagger={10}
                        />
                      )}
                    </div>
                  </GlassRefraction>
                </AnimatedCardReveal>
              </FocusableLayer>
            </div>
          </div>
        </AbsoluteFill>
      </CameraController>

      {/* Anomaly detected card — slams in from right at frame 70 */}
      {frame >= 68 && (
        <div
          style={{
            position: 'absolute',
            top: '35%',
            right: `${interpolate(anomalyReveal, [0, 1], [-300, 40])}px`,
            opacity: anomalyReveal,
            zIndex: 10,
          }}
        >
          <ShakeElement active={frame >= 70 && frame < 85} intensity={2}>
            <GlassRefraction intensity={0.6} glowColor={theme.accent.red} borderRadius={14}>
              <div style={{ padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 10, height: 10, borderRadius: '50%',
                  backgroundColor: theme.accent.red,
                  boxShadow: `0 0 8px ${theme.accent.red}`,
                }} />
                <span style={{
                  fontSize: 18, fontWeight: 700, color: theme.accent.red,
                  textShadow: `0 0 10px ${theme.accent.red}88`,
                  fontFamily: theme.typography.fontMono,
                }}>
                  {copy.videoV5Flagship.shot3.anomalyCard}
                </span>
              </div>
            </GlassRefraction>
          </ShakeElement>
        </div>
      )}

      {/* CountUpText overlay: 99.7% */}
      {countUpOpacity > 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 20,
            opacity: countUpOpacity,
          }}
        >
          <CountUpText
            target={copy.videoV5Flagship.shot3.accuracy}
            startFrame={120}
            duration={25}
            decimals={1}
            suffix="%"
            fontSize={120}
            color={theme.accent.cyan}
          />
        </div>
      )}

      {/* Animated cursor */}
      <AnimatedCursor
        waypoints={[
          { frame: 25, x: 35, y: 45 },
          { frame: 70, x: 72, y: 38, clickAt: true },
          { frame: 95, x: 78, y: 65 },
          { frame: 110, x: 82, y: 68, clickAt: true },
        ]}
        color={theme.accent.cyan}
      />
    </ShotTransition>
  );
};
