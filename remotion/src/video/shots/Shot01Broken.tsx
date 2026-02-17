
import React, { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, random } from 'remotion';
import { ShotTransition } from '../../shared/animation/ShotTransition';
import { CameraController, CameraEasing } from '../../shared/camera/CameraController';
import { theme } from '../../shared/theme';
import { SHOTS } from '../config';

// A simple matrix-like rain or scrolling code component
const MatrixStream: React.FC<{ x: number; speed: number; delay: number; height: number }> = ({ x, speed, delay, height }) => {
    const frame = useCurrentFrame();
    const opacity = interpolate(frame, [0, 30], [0, 0.4]);

    // Characters to cycle through
    const chars = "01XYZE8492";

    const y = ((frame - delay) * speed) % (height + 200) - 200;

    return (
        <div style={{
            position: 'absolute',
            left: x,
            top: y,
            width: 20,
            color: theme.accent.cyan,
            fontFamily: theme.typography.fontMono,
            fontSize: 14,
            opacity,
            textShadow: '0 0 5px rgba(0,240,255,0.5)',
            writingMode: 'vertical-rl'
        }}>
            {chars.split('').map((c, i) => (
                <div key={i} style={{ opacity: random(i + x) > 0.5 ? 1 : 0.4 }}>{c}</div>
            ))}
        </div>
    );
};


export const Shot01Broken: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps, width, height } = useVideoConfig();

    // Generate streams
    const streams = useMemo(() => {
        return new Array(40).fill(0).map((_, i) => ({
            x: i * 50,
            speed: 10 + Math.random() * 15,
            delay: Math.random() * 20,
        }));
    }, []);

    // Camera Chaos: Shaky handheld feel
    const shakeX = Math.sin(frame / 2) * 2;
    const shakeY = Math.cos(frame / 3) * 2;

    // Glitch Effect
    const isGlitch = frame % 40 < 5 || (frame > 100 && frame < 120);
    const glitchOffset = isGlitch ? (Math.random() - 0.5) * 20 : 0;

    return (
        <ShotTransition
            durationInFrames={SHOTS.shot1.duration}
            enterType="fade"
            exitType="flash" // Flash into the "Turn"
        >
            <AbsoluteFill style={{ background: '#000' }}>

                {/* BACKGROUND: CHAOTIC DATA */}
                <AbsoluteFill style={{
                    transform: `translate(${shakeX + glitchOffset}px, ${shakeY}px) scale(1.1)`,
                    opacity: 0.6
                }}>
                    {streams.map((s, i) => (
                        <MatrixStream key={i} x={s.x} speed={s.speed} delay={s.delay} height={height} />
                    ))}
                </AbsoluteFill>

                {/* FOREGROUND: RED ERROR OVERLAYS */}
                {frame > 60 && (
                    <AbsoluteFill style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        mixBlendMode: 'difference'
                    }}>
                        <div style={{
                            fontFamily: theme.typography.fontMono,
                            fontSize: 120,
                            fontWeight: 900,
                            color: isGlitch ? theme.accent.red : '#333',
                            textTransform: 'uppercase',
                            letterSpacing: -5,
                            opacity: interpolate(frame, [60, 70], [0, 0.8])
                        }}>
                            ERR_404
                        </div>
                    </AbsoluteFill>
                )}

                {/* TEXT: "Black-box models..." */}
                <AbsoluteFill style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 10
                }}>
                    <h1 style={{
                        fontFamily: theme.typography.fontHeader,
                        fontSize: 80,
                        fontWeight: 700,
                        color: '#fff',
                        textAlign: 'center',
                        maxWidth: 800,
                        textShadow: '0 0 30px rgba(0,0,0,0.8)'
                    }}>
                        {frame < 80 ? "Black-box models..." : "Break trust."}
                    </h1>
                </AbsoluteFill>

                {/* VIGNETTE & GRAIN */}
                <AbsoluteFill style={{
                    background: 'radial-gradient(circle, transparent 40%, #000 100%)',
                    pointerEvents: 'none'
                }} />

            </AbsoluteFill>
        </ShotTransition>
    );
};
