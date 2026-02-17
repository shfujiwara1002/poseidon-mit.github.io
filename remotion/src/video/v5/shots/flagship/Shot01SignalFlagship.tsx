import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { ShotTransition } from '../../../../shared/animation/ShotTransition';
import { CameraController, CameraEasing } from '../../../../shared/camera/CameraController';
import { AnimatedChartLine } from '../../../../shared/live-ui/AnimatedChart';
import { AnimatedCardReveal, ShakeElement, AnimatedEnginePill } from '../../../../shared/live-ui/AnimatedUI';
import { FocusableLayer } from '../../../../shared/cinematic/FocusableLayer';
import { GlitchEffect } from '../../../../shared/effects/GlitchEffect';
import { MetricHierarchy } from '../../../../shared/cinematic/ProgressiveReveal';
import { GlassRefraction } from '../../../../shared/cinematic/GlassRefraction';
import { theme } from '../../../../shared/theme';
import { getVideoLayoutStyles, type VideoLayoutMode } from '../../../layout/VideoLayout';
import { V5_FLAGSHIP_SHOTS } from '../../config';

interface Shot01SignalFlagshipProps {
  layout?: VideoLayoutMode;
}

/**
 * Shot 1: Hook (4s, 120 frames)
 * Dashboard appears -> camera zooms to chart -> FREEZE -> GlitchEffect -> fade to black.
 */
export const Shot01SignalFlagship: React.FC<Shot01SignalFlagshipProps> = ({
  layout = 'landscape',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { safeArea, scaledSafeArea } = getVideoLayoutStyles(layout);
  const containerStyle = layout === 'portrait' ? scaledSafeArea : safeArea;

  const chartData = [1280, 1320, 1405, 1490, 1580, 1710, 1820];

  // Glitch active window (frames 55-95)
  const glitchActive = frame >= 55 && frame < 95;
  const glitchIntensity = interpolate(frame, [55, 65, 85, 95], [0, 0.7, 0.7, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Scramble numbers (frames 80-100)
  const scrambleActive = frame >= 80 && frame < 100;
  const scrambleValue = scrambleActive
    ? `$${Math.floor(Math.sin(frame * 7.3) * 50000 + 50000).toLocaleString()}`
    : '$142,000';

  // Fade to black (frames 100-120)
  const fadeToBlack = interpolate(frame, [100, 120], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Chart focus (frames 20-80), metrics focus (frames 80-100)
  const chartFocused = frame < 80;

  return (
    <ShotTransition
      durationInFrames={V5_FLAGSHIP_SHOTS.shot1.duration}
      enterType="fade"
      exitType="blur-zoom"
      enterDuration={10}
      exitDuration={15}
    >
      <GlitchEffect active={glitchActive} intensity={glitchIntensity} sliceCount={8}>
        <ShakeElement active={glitchActive} intensity={5}>
          <CameraController
            keyframes={[
              { frame: 0, scale: 0.6, x: 0, y: 0 },
              { frame: 20, scale: 2.0, x: 15, y: -20, easing: CameraEasing.dramatic },
              { frame: 40, scale: 2.0, x: 15, y: -20 },
              { frame: 55, scale: 2.0, x: 15, y: -20 },
              { frame: 80, scale: 2.0, x: -15, y: 10, easing: CameraEasing.snappy },
              { frame: 100, scale: 1.5, x: 0, y: 0, easing: CameraEasing.zoomOut },
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
                <AnimatedCardReveal delay={2}>
                  <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 16, opacity: 0.9 }}>
                    Dashboard
                  </div>
                </AnimatedCardReveal>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, height: 'calc(100% - 50px)' }}>
                  {/* Chart panel */}
                  <FocusableLayer isFocused={chartFocused} blurAmount={8}>
                    <AnimatedCardReveal delay={4} direction="up">
                      <GlassRefraction intensity={0.5} glowColor={theme.accent.cyan} borderRadius={20}>
                        <div style={{ padding: 24 }}>
                          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>
                            System Pulse
                          </div>
                          <MetricHierarchy
                            primary={{ label: 'Net Worth', value: scrambleValue, color: theme.accent.cyan }}
                            supporting={[
                              { label: 'Cash Flow', value: scrambleActive ? '???' : '+$1,240', color: theme.accent.teal },
                              { label: 'Alerts', value: scrambleActive ? '!' : '2', color: theme.accent.teal },
                            ]}
                            zoomLevel={1}
                            delay={8}
                          />
                          <div style={{ marginTop: 16 }}>
                            <AnimatedChartLine
                              data={chartData}
                              width={520}
                              height={130}
                              color={theme.accent.cyan}
                              delay={10}
                              drawDuration={30}
                              showDotGrid
                            />
                          </div>
                        </div>
                      </GlassRefraction>
                    </AnimatedCardReveal>
                  </FocusableLayer>

                  {/* Side panel with engine pills */}
                  <FocusableLayer isFocused={!chartFocused} blurAmount={6}>
                    <AnimatedCardReveal delay={8} direction="right">
                      <GlassRefraction intensity={0.4} glowColor={theme.accent.violet} borderRadius={20}>
                        <div style={{ padding: 20 }}>
                          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>
                            Engines
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <AnimatedEnginePill engine="Protect" delay={14} active />
                            <AnimatedEnginePill engine="Grow" delay={18} active />
                            <AnimatedEnginePill engine="Execute" delay={22} active />
                            <AnimatedEnginePill engine="Govern" delay={26} active />
                          </div>
                        </div>
                      </GlassRefraction>
                    </AnimatedCardReveal>
                  </FocusableLayer>
                </div>
              </div>
            </AbsoluteFill>
          </CameraController>
        </ShakeElement>
      </GlitchEffect>

      {/* Fade to black */}
      {fadeToBlack > 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: `rgba(0,0,0,${fadeToBlack})`,
            zIndex: 50,
          }}
        />
      )}
    </ShotTransition>
  );
};
