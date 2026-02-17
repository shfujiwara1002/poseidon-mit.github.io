import React from 'react';
import {
    AbsoluteFill,
    useCurrentFrame,
    useVideoConfig,
    spring,
    interpolate,
    staticFile,
    Img,
    Easing,
} from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';
import { LightLeak } from '@remotion/light-leaks';
import { Audio } from '@remotion/media';

import { KineticText, LineReveal } from './shared/animation/KineticText';
import { DeviceFrame2D } from './shared/3d/DeviceMockup3D';
import { BloomEffect, LensFlare } from './shared/effects/BloomEffect';
import { CameraController, CameraEasing, type CameraKeyframe } from './shared/camera/CameraController';
import { beats, useBeatPulse } from './shared/animation/BeatSync';
import { theme } from './shared/theme';

/**
 * PoseidonProductDemo — Cinematic 30s product demo with TransitionSeries.
 *
 * Improvements over PoseidonHeroDemo:
 * - TransitionSeries with fade/slide transitions (no hard cuts)
 * - Light Leak overlays at key transition points
 * - Text exit animations (blur + fade out before transitions)
 * - Beat-locked bloom across all engine shots
 * - LensFlare per engine shot
 * - More dramatic per-shot camera keyframes
 * - Govern shot intentionally slower (restraint)
 *
 * Frame math:
 *   Sequences: 90+150+150+150+135+120+153 = 948
 *   Transitions: 12×4 = 48 (overlays don't consume)
 *   Total: 948 − 48 = 900 frames = 30.0s at 30fps
 */

const TRANSITION_FRAMES = 12;
const EXIT_FRAMES = 18; // text exit animation duration

const ENGINE_COLORS = {
    dashboard: '#00F0FF',
    protect: '#22C55E',
    grow: '#8B5CF6',
    execute: '#EAB308',
    govern: '#3B82F6',
} as const;

interface EngineConfig {
    label: string;
    tagline: string;
    color: string;
    screenAsset: string;
    deviceRotateY: number;
    lensFlare: { x: number; y: number; delay: number };
    cameraKeyframes: CameraKeyframe[];
}

const ENGINE_CONFIG: Record<string, EngineConfig> = {
    dashboard: {
        label: 'Dashboard',
        tagline: 'All engines. One view.',
        color: ENGINE_COLORS.dashboard,
        screenAsset: 'assets/screenshots/demo/dashboard.png',
        deviceRotateY: 10,
        lensFlare: { x: 65, y: 35, delay: 45 },
        cameraKeyframes: [
            { frame: 0, scale: 0.85, x: 0, y: 0 },
            { frame: beats(3), scale: 1.08, x: 5, y: -4, easing: CameraEasing.zoomIn },
            { frame: beats(7), scale: 1.15, x: -5, y: -8, easing: CameraEasing.smooth },
            { frame: beats(10), scale: 0.95, x: 0, y: 0, easing: CameraEasing.dramatic },
        ],
    },
    protect: {
        label: 'Protect',
        tagline: 'Threats caught before they land.',
        color: ENGINE_COLORS.protect,
        screenAsset: 'assets/screenshots/demo/protect.png',
        deviceRotateY: -15,
        lensFlare: { x: 30, y: 40, delay: 60 },
        cameraKeyframes: [
            { frame: 0, scale: 0.8, x: -10, y: 5 },
            { frame: beats(4), scale: 1.2, x: 12, y: -8, easing: CameraEasing.snappy },
            { frame: beats(8), scale: 1.05, x: -3, y: 2, easing: CameraEasing.smooth },
            { frame: beats(10), scale: 0.9, x: 0, y: 0, easing: CameraEasing.zoomOut },
        ],
    },
    grow: {
        label: 'Grow',
        tagline: "See tomorrow's opportunity today.",
        color: ENGINE_COLORS.grow,
        screenAsset: 'assets/screenshots/demo/grow.png',
        deviceRotateY: 18,
        lensFlare: { x: 70, y: 30, delay: 45 },
        cameraKeyframes: [
            { frame: 0, scale: 0.75, x: 15, y: 8 },
            { frame: beats(3), scale: 1.1, x: -8, y: -5, easing: CameraEasing.dramatic },
            { frame: beats(6), scale: 1.25, x: -12, y: -10, easing: CameraEasing.zoomIn },
            { frame: beats(10), scale: 0.95, x: 0, y: 0, easing: CameraEasing.smooth },
        ],
    },
    execute: {
        label: 'Execute',
        tagline: 'One tap to approve. Zero ambiguity.',
        color: ENGINE_COLORS.execute,
        screenAsset: 'assets/screenshots/demo/execute.png',
        deviceRotateY: -12,
        lensFlare: { x: 40, y: 45, delay: 45 },
        cameraKeyframes: [
            { frame: 0, scale: 0.85, x: -12, y: 5 },
            { frame: beats(3), scale: 1.15, x: 8, y: -6, easing: CameraEasing.snappy },
            { frame: beats(6), scale: 1.1, x: 3, y: -2, easing: CameraEasing.smooth },
            { frame: beats(9), scale: 0.9, x: 0, y: 0, easing: CameraEasing.zoomOut },
        ],
    },
    govern: {
        label: 'Govern',
        tagline: 'Every decision. Logged forever.',
        color: ENGINE_COLORS.govern,
        screenAsset: 'assets/screenshots/demo/govern.png',
        deviceRotateY: 5,
        lensFlare: { x: 50, y: 38, delay: 60 },
        cameraKeyframes: [
            { frame: 0, scale: 0.92, x: 3, y: -2 },
            { frame: beats(4), scale: 1.05, x: -2, y: 1, easing: CameraEasing.smooth },
            { frame: beats(8), scale: 0.98, x: 0, y: 0, easing: CameraEasing.smooth },
        ],
    },
};

/* ─── Main Composition ─────────────────────────────────────── */

export interface PoseidonProductDemoProps {
    enableAudio?: boolean;
    musicSrc?: string;
}

export const PoseidonProductDemo: React.FC<PoseidonProductDemoProps> = ({
    enableAudio = true,
    musicSrc = 'audio/poseidon-beat.wav',
}) => {
    return (
        <AbsoluteFill style={{ backgroundColor: '#000' }}>
            <TransitionSeries>
                {/* S1: Opening — 90 frames (6 beats) */}
                <TransitionSeries.Sequence durationInFrames={90}>
                    <ShotOpening />
                </TransitionSeries.Sequence>

                {/* C1: fade → Dashboard */}
                <TransitionSeries.Transition
                    presentation={fade()}
                    timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
                />

                {/* S2: Dashboard — 150 frames (10 beats) */}
                <TransitionSeries.Sequence durationInFrames={150}>
                    <ShotEngine engine="dashboard" />
                </TransitionSeries.Sequence>

                {/* C2: LightLeak overlay — cyan (does NOT consume timeline) */}
                <TransitionSeries.Overlay durationInFrames={24}>
                    <LightLeak seed={3} hueShift={180} />
                </TransitionSeries.Overlay>

                {/* S3: Protect — 150 frames (10 beats) */}
                <TransitionSeries.Sequence durationInFrames={150}>
                    <ShotEngine engine="protect" />
                </TransitionSeries.Sequence>

                {/* C3: slide from-right → Grow */}
                <TransitionSeries.Transition
                    presentation={slide({ direction: 'from-right' })}
                    timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
                />

                {/* S4: Grow — 150 frames (10 beats) */}
                <TransitionSeries.Sequence durationInFrames={150}>
                    <ShotEngine engine="grow" />
                </TransitionSeries.Sequence>

                {/* C4: LightLeak overlay — violet (does NOT consume timeline) */}
                <TransitionSeries.Overlay durationInFrames={24}>
                    <LightLeak seed={7} hueShift={260} />
                </TransitionSeries.Overlay>

                {/* S5: Execute — 135 frames (9 beats) */}
                <TransitionSeries.Sequence durationInFrames={135}>
                    <ShotEngine engine="execute" />
                </TransitionSeries.Sequence>

                {/* C5: fade → Govern */}
                <TransitionSeries.Transition
                    presentation={fade()}
                    timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
                />

                {/* S6: Govern — 120 frames (8 beats) */}
                <TransitionSeries.Sequence durationInFrames={120}>
                    <ShotEngine engine="govern" />
                </TransitionSeries.Sequence>

                {/* C6: fade → CTA */}
                <TransitionSeries.Transition
                    presentation={fade()}
                    timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
                />

                {/* S7: CTA — 153 frames (~10 beats) */}
                <TransitionSeries.Sequence durationInFrames={153}>
                    <ShotCTA />
                </TransitionSeries.Sequence>
            </TransitionSeries>

            {/* Audio — outside TransitionSeries, uses global frame */}
            {enableAudio && musicSrc && (
                <AudioTrack musicSrc={musicSrc} />
            )}
        </AbsoluteFill>
    );
};

/* ─── Audio Track ──────────────────────────────────────────── */

const AudioTrack: React.FC<{ musicSrc: string }> = ({ musicSrc }) => {
    return (
        <Audio
            src={staticFile(musicSrc)}
            volume={(f) =>
                interpolate(f, [0, 30, 840, 900], [0, 0.7, 0.7, 0], {
                    extrapolateLeft: 'clamp',
                    extrapolateRight: 'clamp',
                })
            }
        />
    );
};

/* ─── Exit Animation Hook ──────────────────────────────────── */

function useExitAnimation() {
    const frame = useCurrentFrame();
    const { durationInFrames } = useVideoConfig();

    const exitStart = durationInFrames - EXIT_FRAMES;
    const exitProgress = interpolate(
        frame,
        [exitStart, durationInFrames],
        [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
    );

    return {
        textOpacity: interpolate(exitProgress, [0, 1], [1, 0]),
        textBlur: interpolate(exitProgress, [0, 1], [0, 8]),
        textTranslateY: interpolate(exitProgress, [0, 1], [0, -20]),
        deviceScale: interpolate(exitProgress, [0, 1], [1, 1.04]),
        deviceOpacity: interpolate(exitProgress, [0, 1], [1, 0.3]),
    };
}

/* ─── Shot: Opening ────────────────────────────────────────── */

const ShotOpening: React.FC = () => {
    const frame = useCurrentFrame();
    const exit = useExitAnimation();
    const beatPulse = useBeatPulse(frame);

    return (
        <AbsoluteFill
            style={{
                background: theme.backgroundGradient,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 24,
            }}
        >
            {/* Aurora background */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: theme.aurora.layers,
                    opacity: theme.aurora.auroraOpacity,
                    filter: `blur(${theme.aurora.auroraBlur}px)`,
                }}
            />

            {/* Title with bloom */}
            <div
                style={{
                    opacity: exit.textOpacity,
                    filter: `blur(${exit.textBlur}px)`,
                    transform: `translateY(${exit.textTranslateY}px)`,
                }}
            >
                <BloomEffect
                    color="#00f0ff"
                    intensity={0.4 + beatPulse * 0.1}
                    rays={6}
                    raySpread={360}
                    revealDelay={10}
                >
                    <KineticText
                        text="Poseidon"
                        variant="blurReveal"
                        startFrame={8}
                        staggerFrames={3}
                        fontSize={120}
                        fontWeight={800}
                        color="#f8fafc"
                        textShadow={theme.neon.cyan.deep}
                        letterSpacing={-4}
                    />
                </BloomEffect>
            </div>

            <div
                style={{
                    opacity: exit.textOpacity,
                    filter: `blur(${exit.textBlur}px)`,
                    transform: `translateY(${exit.textTranslateY}px)`,
                }}
            >
                <LineReveal
                    text="AI-native wealth intelligence"
                    startFrame={30}
                    fontSize={32}
                    fontWeight={400}
                    color="rgba(255,255,255,0.65)"
                />
            </div>

            <LensFlare x={50} y={40} color="#00f0ff" intensity={0.6} delay={20} />
        </AbsoluteFill>
    );
};

/* ─── Shot: Engine ─────────────────────────────────────────── */

const ShotEngine: React.FC<{ engine: string }> = ({ engine }) => {
    const config = ENGINE_CONFIG[engine];
    if (!config) return null;

    const frame = useCurrentFrame();
    const exit = useExitAnimation();
    const beatPulse = useBeatPulse(frame);

    const bgOpacity = 0.08 + beatPulse * 0.04;

    return (
        <AbsoluteFill style={{ background: '#000' }}>
            {/* Beat-synced color wash background */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: `radial-gradient(ellipse 80% 60% at 50% 50%, ${config.color}${Math.round(bgOpacity * 255).toString(16).padStart(2, '0')}, transparent 70%)`,
                }}
            />

            <CameraController keyframes={config.cameraKeyframes}>
                <AbsoluteFill
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 32,
                        padding: 80,
                    }}
                >
                    {/* Engine label + tagline with exit animation */}
                    <div
                        style={{
                            textAlign: 'center',
                            zIndex: 2,
                            opacity: exit.textOpacity,
                            filter: `blur(${exit.textBlur}px)`,
                            transform: `translateY(${exit.textTranslateY}px)`,
                        }}
                    >
                        <KineticText
                            text={config.label}
                            variant="fadeUp"
                            startFrame={5}
                            staggerFrames={2}
                            fontSize={64}
                            fontWeight={700}
                            color="#f8fafc"
                            textShadow={`0 0 20px ${config.color}44`}
                        />
                        <LineReveal
                            text={config.tagline}
                            startFrame={18}
                            fontSize={24}
                            color="rgba(255,255,255,0.6)"
                            style={{ marginTop: 12 }}
                        />
                    </div>

                    {/* Device mockup with exit scale */}
                    <div
                        style={{
                            width: 1200,
                            height: 680,
                            zIndex: 1,
                            transform: `scale(${exit.deviceScale})`,
                            opacity: exit.deviceOpacity,
                        }}
                    >
                        <DeviceFrame2D
                            device="macbook"
                            startFrame={10}
                            rotateY={config.deviceRotateY}
                            rotateX={-5}
                            scale={0.92}
                            glowColor={config.color}
                        >
                            <Img
                                src={staticFile(config.screenAsset)}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </DeviceFrame2D>
                    </div>
                </AbsoluteFill>
            </CameraController>

            {/* Per-engine LensFlare */}
            <LensFlare
                x={config.lensFlare.x}
                y={config.lensFlare.y}
                color={config.color}
                intensity={0.4 + beatPulse * 0.1}
                delay={config.lensFlare.delay}
            />
        </AbsoluteFill>
    );
};

/* ─── Shot: CTA ────────────────────────────────────────────── */

const ShotCTA: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const beatPulse = useBeatPulse(frame);

    const s = spring({
        frame,
        fps,
        config: { damping: 14, stiffness: 80 },
    });

    return (
        <AbsoluteFill
            style={{
                background: theme.backgroundGradient,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 32,
            }}
        >
            {/* Aurora */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: theme.aurora.layers,
                    opacity: theme.aurora.auroraOpacity * 0.7,
                    filter: `blur(${theme.aurora.auroraBlur}px)`,
                }}
            />

            <BloomEffect color="#00f0ff" intensity={0.5 + beatPulse * 0.15} revealDelay={5}>
                <KineticText
                    text="Try Poseidon"
                    variant="scaleIn"
                    startFrame={5}
                    staggerFrames={2}
                    fontSize={80}
                    fontWeight={800}
                    color="#f8fafc"
                    textShadow={theme.neon.cyan.deep}
                    letterSpacing={-3}
                />
            </BloomEffect>

            <LineReveal
                text="poseidon-mit.github.io"
                startFrame={25}
                fontSize={28}
                fontWeight={500}
                color={theme.accent.cyan}
                textShadow={theme.neon.cyan.standard}
            />

            {/* Four engine badges */}
            <div
                style={{
                    display: 'flex',
                    gap: 24,
                    marginTop: 16,
                    opacity: interpolate(s, [0, 1], [0, 1]),
                    transform: `translateY(${interpolate(s, [0, 1], [20, 0])}px)`,
                }}
            >
                {(['Protect', 'Grow', 'Execute', 'Govern'] as const).map((name, i) => {
                    const colors: Record<string, string> = {
                        Protect: ENGINE_COLORS.protect,
                        Grow: ENGINE_COLORS.grow,
                        Execute: ENGINE_COLORS.execute,
                        Govern: ENGINE_COLORS.govern,
                    };
                    const delay = 30 + i * 4;
                    const badgeS = spring({
                        frame: frame - delay,
                        fps,
                        config: { damping: 12, stiffness: 100 },
                    });

                    return (
                        <div
                            key={name}
                            style={{
                                padding: '10px 24px',
                                borderRadius: 999,
                                background: `${colors[name]}18`,
                                border: `1px solid ${colors[name]}44`,
                                color: colors[name],
                                fontSize: 18,
                                fontWeight: 600,
                                fontFamily: theme.typography.fontUi,
                                opacity: badgeS,
                                transform: `scale(${interpolate(badgeS, [0, 1], [0.8, 1])})`,
                            }}
                        >
                            {name}
                        </div>
                    );
                })}
            </div>

            <LensFlare x={50} y={35} color="#00f0ff" intensity={0.5} delay={15} />
        </AbsoluteFill>
    );
};
