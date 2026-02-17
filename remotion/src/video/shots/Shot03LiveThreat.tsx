
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { interpolateColors } from 'remotion';
import { ShotTransition } from '../../shared/animation/ShotTransition';
import { CameraController, CameraEasing } from '../../shared/camera/CameraController';
import { DSAreaChart } from '../../shared/web-ui/DSAreaChart';
import { AnimatedCardReveal, ShakeElement } from '../../shared/live-ui/AnimatedUI';
import { AnimatedAuditLog } from '../../shared/live-ui/AnimatedList';
import { AnimatedCursor } from '../../shared/live-ui/AnimatedCursor';
import { FocusableLayer } from '../../shared/cinematic/FocusableLayer';
import { CountUpText } from '../../shared/animation/CountUpText';
import { GlassRefraction } from '../../shared/cinematic/GlassRefraction';
import { BloomEffect } from '../../shared/effects/BloomEffect';
import { theme } from '../../shared/theme';
import { getVideoLayoutStyles, type VideoLayoutMode } from '../layout/VideoLayout';
import { SHOTS } from '../config';

interface Shot03LiveThreatProps {
    layout?: VideoLayoutMode;
}

/**
 * SHOT 3: The Proof (Rebuilt High-Fidelity)
 * 
 * Narrative: "Threats caught in milliseconds. Every decision... fully auditable."
 * Visuals: 
 * - Split screen Glass Dashboard (Chart Left, Log Right).
 * - Live Cursor interaction.
 * - Violent red glitch event.
 */
export const Shot03LiveThreat: React.FC<Shot03LiveThreatProps> = ({
    layout = 'landscape',
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const { safeArea, scaledSafeArea } = getVideoLayoutStyles(layout);
    const containerStyle = layout === 'portrait' ? scaledSafeArea : safeArea;

    // Timing Constants
    const T = {
        CHART_START: 10,
        SPIKE_EVENT: 70,
        CARD_SLAM: 75,
        AUDIT_START: 110,
    };

    const isSpike = frame >= T.SPIKE_EVENT;

    // Data & Colors
    const baseData = [
        { name: '00:00', value: 1200 },
        { name: '00:05', value: 1250 },
        { name: '00:10', value: 1220 },
        { name: '00:15', value: 1280 },
        { name: '00:20', value: 1300 },
        { name: '00:25', value: 1290 },
        { name: '00:30', value: 1350 }
    ];

    const spikeData = [
        ...baseData,
        { name: '00:35', value: 2800 },
        { name: '00:40', value: 400 },
        { name: '00:45', value: 2800 }
    ];

    const chartData = isSpike ? spikeData : baseData;

    const chartColor = interpolateColors(
        frame,
        [T.SPIKE_EVENT, T.SPIKE_EVENT + 5],
        [theme.accent.teal, theme.accent.red]
    );

    // Focus Logic
    const chartFocused = frame < 90;
    const auditFocused = frame >= 90;

    // Anomaly Card
    const cardReveal = spring({
        frame: frame - T.CARD_SLAM,
        fps,
        config: { damping: 14, mass: 0.6, stiffness: 200 },
    });
    const cardY = interpolate(cardReveal, [0, 1], [-50, 0]);

    // Camera
    const cameraKeyframes = [
        { frame: 0, scale: 1.1, x: 0, y: 0 },
        { frame: 60, scale: 1.2, x: 5, y: 0, easing: CameraEasing.linear },
        { frame: 75, scale: 1.4, x: 5, y: -10, easing: CameraEasing.dramatic }, // Snap to spike
        { frame: 120, scale: 1.4, x: -15, y: 20, easing: CameraEasing.smooth }, // Pan to Audit
        { frame: 240, scale: 1.0, x: 0, y: 0, easing: CameraEasing.smooth },
    ];

    return (
        <ShotTransition
            durationInFrames={SHOTS.shot3.duration}
            enterType="zoom-through"
            exitType="fade"
            enterDuration={15}
            exitDuration={15}
        >
            <CameraController keyframes={cameraKeyframes}>
                <AbsoluteFill style={{ background: theme.backgroundGradient, color: 'white', fontFamily: theme.typography.fontUi }}>
                    <div style={{ ...containerStyle, display: 'flex', flexDirection: 'column', height: '100%' }}>

                        {/* Header */}
                        <AnimatedCardReveal delay={5}>
                            <div style={{ fontSize: 28, fontWeight: 600, marginBottom: 24, color: theme.text.primary, textShadow: '0 0 20px rgba(0,0,0,0.5)' }}>
                                Live Threat Detection
                            </div>
                        </AnimatedCardReveal>

                        {/* SPLIT GRID LAYOUT */}
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, flex: 1 }}>

                            {/* LEFT: CHART PANEL */}
                            <FocusableLayer isFocused={chartFocused} blurAmount={8} dimAmount={0.3}>
                                <AnimatedCardReveal delay={10} direction="up">
                                    <GlassRefraction intensity={0.5} glowColor={theme.accent.teal} borderRadius={24}>
                                        <div style={{ padding: 32, height: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                                                <h3 style={{ margin: 0, fontSize: 18, color: theme.text.muted }}>Transaction Volume</h3>
                                                <div style={{ fontFamily: theme.typography.fontMono, color: chartColor, fontWeight: 'bold' }}>
                                                    {isSpike ? 'CRITICAL ALERT' : 'Monitoring'}
                                                </div>
                                            </div>

                                            <div style={{ flex: 1, minHeight: 0 }}>
                                                <DSAreaChart
                                                    data={chartData}
                                                    dataKey="value"
                                                    engine="protect"
                                                    height={300}
                                                    className="h-full w-full"
                                                />
                                            </div>

                                            {/* Bloom on spike */}
                                            {isSpike && frame < 90 && (
                                                <div style={{ position: 'absolute', top: '30%', right: '20%' }}>
                                                    <BloomEffect color={theme.accent.red} intensity={1.0} pulseFrequency={10}>
                                                        <div style={{ width: 40, height: 40, background: theme.accent.red, borderRadius: '50%', filter: 'blur(10px)' }} />
                                                    </BloomEffect>
                                                </div>
                                            )}
                                        </div>
                                    </GlassRefraction>
                                </AnimatedCardReveal>
                            </FocusableLayer>


                            {/* RIGHT: AUDIT PANEL */}
                            <FocusableLayer isFocused={auditFocused} blurAmount={8} dimAmount={0.3}>
                                <AnimatedCardReveal delay={15} direction="right">
                                    <GlassRefraction intensity={0.4} glowColor={theme.accent.amber} borderRadius={24}>
                                        <div style={{ padding: 24, height: '100%' }}>
                                            <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 16, color: theme.text.muted }}>
                                                Audit Trail
                                            </div>

                                            <div style={{ transform: 'scale(0.9)', transformOrigin: 'top left' }}>
                                                <AnimatedAuditLog
                                                    delay={T.AUDIT_START}
                                                    stagger={8}
                                                    entries={[
                                                        { id: 'LOG-9942', engine: 'Protect', action: 'Vector Identified', time: '14:02:45', status: 'Flagged' },
                                                        { id: 'LOG-9943', engine: 'Govern', action: 'Auto-Freeze #8821', time: '14:02:45', status: 'Approved' },
                                                        { id: 'LOG-9944', engine: 'Execute', action: 'Notify Admin', time: '14:02:45', status: 'Sent' },
                                                    ]}
                                                />
                                            </div>
                                        </div>
                                    </GlassRefraction>
                                </AnimatedCardReveal>
                            </FocusableLayer>

                        </div>
                    </div>

                    {/* OVERLAYS */}

                    {/* Anomaly Card (Absolute) */}
                    <div style={{
                        position: 'absolute',
                        top: '40%',
                        left: '35%',
                        transform: `translateY(${cardY}px)`,
                        opacity: interpolate(cardReveal, [0, 1], [0, 1]),
                        zIndex: 10
                    }}>
                        <ShakeElement active={isSpike && frame < T.SPIKE_EVENT + 20} intensity={5}>
                            <GlassRefraction intensity={0.9} glowColor={theme.accent.red} borderRadius={16}>
                                <div style={{ padding: '24px 48px', border: `1px solid ${theme.accent.red}` }}>
                                    <div style={{ fontSize: 42, fontWeight: 800, color: theme.accent.red, marginBottom: 8, textShadow: '0 0 20px rgba(255,0,0,0.6)' }}>
                                        ANOMALY
                                    </div>
                                    <div style={{ fontSize: 20, fontFamily: theme.typography.fontMono, color: 'white' }}>
                                        Confidence: <CountUpText target={99.9} startFrame={T.CARD_SLAM} duration={30} decimals={1} suffix="%" color="white" />
                                    </div>
                                </div>
                            </GlassRefraction>
                        </ShakeElement>
                    </div>

                    {/* Red Bloom Flash */}
                    <div style={{
                        position: 'absolute', inset: 0,
                        background: theme.accent.red,
                        opacity: interpolate(frame, [T.SPIKE_EVENT, T.SPIKE_EVENT + 5, T.SPIKE_EVENT + 20], [0, 0.3, 0]),
                        pointerEvents: 'none',
                        mixBlendMode: 'overlay',
                        zIndex: 5
                    }} />

                    {/* Cursor Animation */}
                    <AnimatedCursor
                        color={theme.accent.cyan}
                        waypoints={[
                            { frame: 20, x: 20, y: 80 }, // Start bottom left
                            { frame: 60, x: 60, y: 40 }, // Move to chart
                            { frame: 120, x: 85, y: 60, clickAt: true }, // Click on Audit panel
                        ]}
                    />

                </AbsoluteFill>
            </CameraController>
        </ShotTransition>
    );
};
