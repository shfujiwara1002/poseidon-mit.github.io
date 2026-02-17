import React from 'react';
import {
    AbsoluteFill,
    useCurrentFrame,
    useVideoConfig,
    spring,
    interpolate,
    staticFile,
    Sequence,
} from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { LightLeak } from '@remotion/light-leaks';
import { Video, Audio } from '@remotion/media';

import { KineticText, LineReveal } from './shared/animation/KineticText';
import { BloomEffect, LensFlare } from './shared/effects/BloomEffect';
import { CameraController, CameraEasing, type CameraKeyframe } from './shared/camera/CameraController';
import { beats, useBeatPulse } from './shared/animation/BeatSync';
import { theme } from './shared/theme';

/**
 * PoseidonScreenDemo — Cinematic 30s product demo using Screen Studio recording.
 *
 * Uses real screen recording from Screen Studio inside a device mockup with
 * TransitionSeries, LightLeaks, and cinematic camera effects.
 *
 * Recording timeline (42.8s total, DELL U4025QW 2560×2160):
 *   2.9s–12.7s: Login/email entry flow (zoom range 1)
 *   19s–42s:    Engine page navigation (zoom range 2)
 *
 * Frame math:
 *   Sequences: 75 + 270 + 480 + 99 = 924
 *   Transitions: 12 × 2 = 24
 *   Total: 924 − 24 = 900 frames = 30.0s at 30fps
 */

const RECORDING_SRC = 'assets/recordings/poseidon-demo.mp4';
const TRANSITION_FRAMES = 12;
const EXIT_FRAMES = 18;

const ENGINE_COLORS = {
    dashboard: '#00F0FF',
    protect: '#22C55E',
    grow: '#8B5CF6',
    execute: '#EAB308',
    govern: '#3B82F6',
} as const;

/* ─── Main Composition ─────────────────────────────────────── */

export interface PoseidonScreenDemoProps {
    enableAudio?: boolean;
    musicSrc?: string;
}

export const PoseidonScreenDemo: React.FC<PoseidonScreenDemoProps> = ({
    enableAudio = true,
    musicSrc = 'audio/poseidon-beat.wav',
}) => {
    return (
        <AbsoluteFill style={{ backgroundColor: '#000' }}>
            <TransitionSeries>
                {/* S1: Opening — 75 frames (2.5s) */}
                <TransitionSeries.Sequence durationInFrames={75}>
                    <ShotOpening />
                </TransitionSeries.Sequence>

                {/* C1: fade → Login Flow */}
                <TransitionSeries.Transition
                    presentation={fade()}
                    timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
                />

                {/* S2: Login Flow — 270 frames (9s) — recording 2.9s→12.7s @1.0x */}
                <TransitionSeries.Sequence durationInFrames={270}>
                    <ShotRecording
                        trimStartSec={2.9}
                        trimEndSec={12.7}
                        playbackRate={1.0}
                        label="Seamless Onboarding"
                        sublabel="Email login in seconds"
                        accentColor={ENGINE_COLORS.dashboard}
                        cameraKeyframes={[
                            { frame: 0, scale: 0.88, x: 0, y: 0 },
                            { frame: beats(3), scale: 1.05, x: 3, y: -5, easing: CameraEasing.smooth },
                            { frame: beats(6), scale: 1.1, x: -2, y: -8, easing: CameraEasing.zoomIn },
                            { frame: beats(9), scale: 0.95, x: 0, y: 0, easing: CameraEasing.zoomOut },
                        ]}
                    />
                </TransitionSeries.Sequence>

                {/* C2: LightLeak overlay — cyan (does NOT consume timeline) */}
                <TransitionSeries.Overlay durationInFrames={18}>
                    <LightLeak seed={3} hueShift={180} />
                </TransitionSeries.Overlay>

                {/* S3: Engine Tour — 480 frames (16s) — recording 19s→42s @1.44x */}
                <TransitionSeries.Sequence durationInFrames={480}>
                    <ShotRecording
                        trimStartSec={19.0}
                        trimEndSec={42.0}
                        playbackRate={1.44}
                        label="Five Engines. One Platform."
                        sublabel="Navigate your entire wealth stack"
                        accentColor={ENGINE_COLORS.grow}
                        cameraKeyframes={[
                            { frame: 0, scale: 0.82, x: -5, y: 3 },
                            { frame: beats(4), scale: 1.08, x: 8, y: -6, easing: CameraEasing.dramatic },
                            { frame: beats(8), scale: 1.15, x: -4, y: -10, easing: CameraEasing.zoomIn },
                            { frame: beats(12), scale: 1.05, x: 2, y: -3, easing: CameraEasing.smooth },
                            { frame: beats(16), scale: 0.92, x: 0, y: 0, easing: CameraEasing.zoomOut },
                        ]}
                        showEngineTimeline
                    />
                </TransitionSeries.Sequence>

                {/* C3: fade → CTA */}
                <TransitionSeries.Transition
                    presentation={fade()}
                    timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
                />

                {/* S4: CTA — 99 frames (3.3s) */}
                <TransitionSeries.Sequence durationInFrames={99}>
                    <ShotCTA />
                </TransitionSeries.Sequence>
            </TransitionSeries>

            {/* Audio — outside TransitionSeries */}
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
                    revealDelay={8}
                >
                    <KineticText
                        text="Poseidon"
                        variant="blurReveal"
                        startFrame={6}
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
                    text="See it in action"
                    startFrame={25}
                    fontSize={32}
                    fontWeight={400}
                    color="rgba(255,255,255,0.65)"
                />
            </div>

            <LensFlare x={50} y={40} color="#00f0ff" intensity={0.6} delay={15} />
        </AbsoluteFill>
    );
};

/* ─── Shot: Recording ──────────────────────────────────────── */

interface ShotRecordingProps {
    trimStartSec: number;
    trimEndSec: number;
    playbackRate: number;
    label: string;
    sublabel: string;
    accentColor: string;
    cameraKeyframes: CameraKeyframe[];
    showEngineTimeline?: boolean;
}

const ShotRecording: React.FC<ShotRecordingProps> = ({
    trimStartSec,
    trimEndSec,
    playbackRate,
    label,
    sublabel,
    accentColor,
    cameraKeyframes,
    showEngineTimeline = false,
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const exit = useExitAnimation();
    const beatPulse = useBeatPulse(frame);

    // Device frame entrance animation
    const deviceEntrance = spring({
        frame,
        fps,
        config: { damping: 14, stiffness: 80 },
    });

    const deviceScale = interpolate(deviceEntrance, [0, 1], [0.85, 1]);
    const deviceOpacity = interpolate(deviceEntrance, [0, 1], [0, 1]);

    // Background glow
    const bgOpacity = 0.06 + beatPulse * 0.03;

    return (
        <AbsoluteFill style={{ background: '#000' }}>
            {/* Beat-synced color wash */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: `radial-gradient(ellipse 80% 60% at 50% 50%, ${accentColor}${Math.round(bgOpacity * 255).toString(16).padStart(2, '0')}, transparent 70%)`,
                }}
            />

            <CameraController keyframes={cameraKeyframes}>
                <AbsoluteFill
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 24,
                        padding: 60,
                    }}
                >
                    {/* Label + sublabel */}
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
                            text={label}
                            variant="fadeUp"
                            startFrame={5}
                            staggerFrames={2}
                            fontSize={48}
                            fontWeight={700}
                            color="#f8fafc"
                            textShadow={`0 0 20px ${accentColor}44`}
                        />
                        <LineReveal
                            text={sublabel}
                            startFrame={18}
                            fontSize={22}
                            color="rgba(255,255,255,0.55)"
                            style={{ marginTop: 8 }}
                        />
                    </div>

                    {/* Device mockup with recording */}
                    <div
                        style={{
                            width: 1400,
                            height: 780,
                            zIndex: 1,
                            transform: `scale(${deviceScale})`,
                            opacity: deviceOpacity,
                            borderRadius: 16,
                            overflow: 'hidden',
                            boxShadow: `0 0 60px ${accentColor}22, 0 25px 80px rgba(0,0,0,0.6)`,
                            border: `1px solid rgba(255,255,255,0.08)`,
                            position: 'relative',
                        }}
                    >
                        {/* Glass frame bezel */}
                        <div
                            style={{
                                position: 'absolute',
                                inset: 0,
                                borderRadius: 16,
                                border: `1px solid rgba(255,255,255,0.12)`,
                                pointerEvents: 'none',
                                zIndex: 3,
                            }}
                        />

                        {/* The actual recording */}
                        <Video
                            src={staticFile(RECORDING_SRC)}
                            muted
                            playbackRate={playbackRate}
                            trimBefore={trimStartSec * fps}
                            trimAfter={trimEndSec * fps}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                            }}
                        />

                        {/* Subtle vignette overlay on device */}
                        <div
                            style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.3) 100%)',
                                pointerEvents: 'none',
                                zIndex: 2,
                            }}
                        />
                    </div>

                    {/* Engine timeline indicator (for S3 only) */}
                    {showEngineTimeline && <EngineTimeline accentColor={accentColor} />}
                </AbsoluteFill>
            </CameraController>

            {/* LensFlare */}
            <LensFlare
                x={65}
                y={30}
                color={accentColor}
                intensity={0.35 + beatPulse * 0.08}
                delay={30}
            />
        </AbsoluteFill>
    );
};

/* ─── Engine Timeline (shows which engine page is active) ───── */

const ENGINE_PAGES = [
    { name: 'Dashboard', color: ENGINE_COLORS.dashboard, startPct: 0 },
    { name: 'Protect', color: ENGINE_COLORS.protect, startPct: 0.09 },
    { name: 'Grow', color: ENGINE_COLORS.grow, startPct: 0.22 },
    { name: 'Execute', color: ENGINE_COLORS.execute, startPct: 0.43 },
    { name: 'Govern', color: ENGINE_COLORS.govern, startPct: 0.65 },
] as const;

const EngineTimeline: React.FC<{ accentColor: string }> = () => {
    const frame = useCurrentFrame();
    const { durationInFrames, fps } = useVideoConfig();
    const progress = frame / durationInFrames;

    return (
        <div
            style={{
                display: 'flex',
                gap: 12,
                marginTop: 8,
                zIndex: 3,
            }}
        >
            {ENGINE_PAGES.map((engine, i) => {
                const nextStart = ENGINE_PAGES[i + 1]?.startPct ?? 1.0;
                const isActive = progress >= engine.startPct && progress < nextStart;
                const isPast = progress >= nextStart;

                const badgeS = spring({
                    frame: frame - Math.round(engine.startPct * durationInFrames),
                    fps,
                    config: { damping: 12, stiffness: 100 },
                });

                const opacity = isActive ? 1 : isPast ? 0.4 : Math.max(0, badgeS) * 0.3;

                return (
                    <div
                        key={engine.name}
                        style={{
                            padding: '6px 16px',
                            borderRadius: 999,
                            background: isActive ? `${engine.color}28` : 'rgba(255,255,255,0.04)',
                            border: `1px solid ${isActive ? engine.color + '66' : 'rgba(255,255,255,0.08)'}`,
                            color: isActive ? engine.color : 'rgba(255,255,255,0.4)',
                            fontSize: 14,
                            fontWeight: isActive ? 600 : 400,
                            fontFamily: theme.typography.fontUi,
                            opacity,
                            transform: `scale(${isActive ? 1.05 : 1})`,
                            transition: 'none',
                        }}
                    >
                        {engine.name}
                    </div>
                );
            })}
        </div>
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
                startFrame={20}
                fontSize={28}
                fontWeight={500}
                color={theme.accent.cyan}
                textShadow={theme.neon.cyan.standard}
            />

            {/* Engine badges */}
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
                    const delay = 25 + i * 3;
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

            <LensFlare x={50} y={35} color="#00f0ff" intensity={0.5} delay={10} />
        </AbsoluteFill>
    );
};
