import React from 'react';
import {
    AbsoluteFill,
    Sequence,
    useCurrentFrame,
    useVideoConfig,
    spring,
    interpolate,
    staticFile,
    Img,
    Audio,
    OffthreadVideo,
} from 'remotion';
import { KineticText, LineReveal } from './shared/animation/KineticText';
import { DeviceFrame2D } from './shared/3d/DeviceMockup3D';
import { BloomEffect, LensFlare } from './shared/effects/BloomEffect';
import { CameraController, CameraEasing, type CameraKeyframe } from './shared/camera/CameraController';
import { BEAT_IN_FRAMES, beats, useBeatPulse } from './shared/animation/BeatSync';
import { theme } from './shared/theme';

/**
 * PoseidonHeroDemo — Apple-quality 30s hero product demo.
 *
 * Architecture:
 * - 7 shots, beat-synced to music
 * - Screen recordings embedded via <OffthreadVideo> in DeviceFrame2D
 * - Falls back to static screenshots if recordings aren't available
 * - KineticText for Apple-style typography
 * - Bloom/LensFlare for cinematic punch
 *
 * To use with screen recordings:
 *   Place files in remotion/public/assets/recordings/
 *     - dashboard.mp4, protect.mp4, grow.mp4, execute.mp4, govern.mp4
 *
 * To use with screenshots (default):
 *   Place files in remotion/public/assets/screenshots/demo/
 *     - dashboard.png, protect.png, grow.png, execute.png, govern.png
 */

const FPS = 30;
const DURATION = 900; // 30 seconds

// Shot timings (beat-aligned at 120 BPM)
const SHOTS = {
    opening:  { from: 0,   duration: beats(6) },   // 0-3s
    overview: { from: beats(6), duration: beats(10) }, // 3-8s
    protect:  { from: beats(16), duration: beats(10) }, // 8-13s
    grow:     { from: beats(26), duration: beats(10) }, // 13-18s
    execute:  { from: beats(36), duration: beats(10) }, // 18-23s
    govern:   { from: beats(46), duration: beats(8) },  // 23-27s
    cta:      { from: beats(54), duration: beats(6) },   // 27-30s
} as const;

// Engine colors
const ENGINE_COLORS = {
    dashboard: '#00F0FF',
    protect: '#22C55E',
    grow: '#8B5CF6',
    execute: '#EAB308',
    govern: '#3B82F6',
} as const;

export interface PoseidonHeroDemoProps {
    /** Use video recordings instead of screenshots */
    useRecordings?: boolean;
    /** Enable audio track */
    enableAudio?: boolean;
    /** Music source (relative to public/) */
    musicSrc?: string;
    /** Voiceover source (relative to public/) */
    voSrc?: string;
}

export const PoseidonHeroDemo: React.FC<PoseidonHeroDemoProps> = ({
    useRecordings = false,
    enableAudio = true,
    musicSrc = 'audio/poseidon-beat.wav',
    voSrc,
}) => {
    const frame = useCurrentFrame();
    const { durationInFrames } = useVideoConfig();

    // Music volume envelope
    const musicVolume = interpolate(
        frame,
        [0, 30, durationInFrames - 60, durationInFrames],
        [0, 0.7, 0.7, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
    );

    return (
        <AbsoluteFill style={{ backgroundColor: '#000' }}>
            {/* === SHOT 1: Opening === */}
            <Sequence from={SHOTS.opening.from} durationInFrames={SHOTS.opening.duration}>
                <ShotOpening />
            </Sequence>

            {/* === SHOT 2: Overview (Dashboard) === */}
            <Sequence from={SHOTS.overview.from} durationInFrames={SHOTS.overview.duration}>
                <ShotEngine
                    label="Dashboard"
                    tagline="All engines. One view."
                    color={ENGINE_COLORS.dashboard}
                    screenAsset={useRecordings ? 'assets/recordings/dashboard.mp4' : 'assets/screenshots/demo/dashboard.png'}
                    isVideo={useRecordings}
                    cameraKeyframes={[
                        { frame: 0, scale: 0.9, x: 0, y: 0 },
                        { frame: beats(5), scale: 1.05, x: 5, y: -3, easing: CameraEasing.smooth },
                        { frame: beats(10), scale: 0.95, x: -2, y: 2, easing: CameraEasing.dramatic },
                    ]}
                />
            </Sequence>

            {/* === SHOT 3: Protect === */}
            <Sequence from={SHOTS.protect.from} durationInFrames={SHOTS.protect.duration}>
                <ShotEngine
                    label="Protect"
                    tagline="Threats caught before they land."
                    color={ENGINE_COLORS.protect}
                    screenAsset={useRecordings ? 'assets/recordings/protect.mp4' : 'assets/screenshots/demo/protect.png'}
                    isVideo={useRecordings}
                    deviceRotateY={-10}
                    cameraKeyframes={[
                        { frame: 0, scale: 0.85, x: -5, y: 0 },
                        { frame: beats(4), scale: 1.1, x: 8, y: -5, easing: CameraEasing.zoomIn },
                        { frame: beats(10), scale: 0.9, x: 0, y: 0, easing: CameraEasing.zoomOut },
                    ]}
                />
            </Sequence>

            {/* === SHOT 4: Grow === */}
            <Sequence from={SHOTS.grow.from} durationInFrames={SHOTS.grow.duration}>
                <ShotEngine
                    label="Grow"
                    tagline="See tomorrow's opportunity today."
                    color={ENGINE_COLORS.grow}
                    screenAsset={useRecordings ? 'assets/recordings/grow.mp4' : 'assets/screenshots/demo/grow.png'}
                    isVideo={useRecordings}
                    deviceRotateY={12}
                    cameraKeyframes={[
                        { frame: 0, scale: 0.8, x: 10, y: 5 },
                        { frame: beats(5), scale: 1.15, x: -5, y: -8, easing: CameraEasing.dramatic },
                        { frame: beats(10), scale: 0.95, x: 0, y: 0, easing: CameraEasing.smooth },
                    ]}
                />
            </Sequence>

            {/* === SHOT 5: Execute === */}
            <Sequence from={SHOTS.execute.from} durationInFrames={SHOTS.execute.duration}>
                <ShotEngine
                    label="Execute"
                    tagline="One tap to approve. Zero ambiguity."
                    color={ENGINE_COLORS.execute}
                    screenAsset={useRecordings ? 'assets/recordings/execute.mp4' : 'assets/screenshots/demo/execute.png'}
                    isVideo={useRecordings}
                    deviceRotateY={-8}
                    cameraKeyframes={[
                        { frame: 0, scale: 0.85, x: -8, y: 3 },
                        { frame: beats(4), scale: 1.1, x: 6, y: -4, easing: CameraEasing.snappy },
                        { frame: beats(10), scale: 0.9, x: 0, y: 0, easing: CameraEasing.smooth },
                    ]}
                />
            </Sequence>

            {/* === SHOT 6: Govern === */}
            <Sequence from={SHOTS.govern.from} durationInFrames={SHOTS.govern.duration}>
                <ShotEngine
                    label="Govern"
                    tagline="Every decision. Logged forever."
                    color={ENGINE_COLORS.govern}
                    screenAsset={useRecordings ? 'assets/recordings/govern.mp4' : 'assets/screenshots/demo/govern.png'}
                    isVideo={useRecordings}
                    deviceRotateY={6}
                    cameraKeyframes={[
                        { frame: 0, scale: 0.9, x: 5, y: -3 },
                        { frame: beats(4), scale: 1.08, x: -3, y: 2, easing: CameraEasing.smooth },
                        { frame: beats(8), scale: 0.95, x: 0, y: 0, easing: CameraEasing.dramatic },
                    ]}
                />
            </Sequence>

            {/* === SHOT 7: CTA === */}
            <Sequence from={SHOTS.cta.from} durationInFrames={SHOTS.cta.duration}>
                <ShotCTA />
            </Sequence>

            {/* === Audio === */}
            {enableAudio && musicSrc && (
                <Audio src={staticFile(musicSrc)} volume={musicVolume} />
            )}
            {enableAudio && voSrc && (
                <Audio src={staticFile(voSrc)} volume={0.9} />
            )}
        </AbsoluteFill>
    );
};

/* ─── Shot Components ────────────────────────────────────────── */

const ShotOpening: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

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

            {/* Bloom behind title */}
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

            <LineReveal
                text="AI-native wealth intelligence"
                startFrame={30}
                fontSize={32}
                fontWeight={400}
                color="rgba(255,255,255,0.65)"
            />

            <LensFlare x={50} y={40} color="#00f0ff" intensity={0.6} delay={20} />
        </AbsoluteFill>
    );
};

const ShotEngine: React.FC<{
    label: string;
    tagline: string;
    color: string;
    screenAsset: string;
    isVideo: boolean;
    deviceRotateY?: number;
    cameraKeyframes: CameraKeyframe[];
}> = ({
    label,
    tagline,
    color,
    screenAsset,
    isVideo,
    deviceRotateY = 8,
    cameraKeyframes,
}) => {
    const frame = useCurrentFrame();

    return (
        <AbsoluteFill style={{ background: '#000' }}>
            {/* Subtle color wash background */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: `radial-gradient(ellipse 80% 60% at 50% 50%, ${color}12, transparent 70%)`,
                }}
            />

            <CameraController keyframes={cameraKeyframes}>
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
                    {/* Engine label + tagline */}
                    <div style={{ textAlign: 'center', zIndex: 2 }}>
                        <KineticText
                            text={label}
                            variant="fadeUp"
                            startFrame={5}
                            staggerFrames={2}
                            fontSize={64}
                            fontWeight={700}
                            color="#f8fafc"
                            textShadow={`0 0 20px ${color}44`}
                        />
                        <LineReveal
                            text={tagline}
                            startFrame={18}
                            fontSize={24}
                            color="rgba(255,255,255,0.6)"
                            style={{ marginTop: 12 }}
                        />
                    </div>

                    {/* Device mockup with screen content */}
                    <div style={{ width: 1200, height: 680, zIndex: 1 }}>
                        <DeviceFrame2D
                            device="macbook"
                            startFrame={10}
                            rotateY={deviceRotateY}
                            rotateX={-5}
                            scale={0.92}
                            glowColor={color}
                        >
                            {isVideo ? (
                                <OffthreadVideo
                                    src={staticFile(screenAsset)}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            ) : (
                                <Img
                                    src={staticFile(screenAsset)}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            )}
                        </DeviceFrame2D>
                    </div>
                </AbsoluteFill>
            </CameraController>
        </AbsoluteFill>
    );
};

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
