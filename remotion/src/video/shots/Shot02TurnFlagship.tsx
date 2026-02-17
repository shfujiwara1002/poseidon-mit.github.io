
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { ShotTransition } from '../../shared/animation/ShotTransition';
import { CameraController, CameraEasing } from '../../shared/camera/CameraController';
import { theme } from '../../shared/theme';
import { SHOTS } from '../config';
import { GlassRefraction } from '../../shared/cinematic/GlassRefraction';
import { AnimatedEnginePill } from '../../shared/live-ui/AnimatedUI';

export const Shot02TurnFlagship: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // 1. GRID ANIMATION (Infinite Floor)
    const gridMove = interpolate(frame, [0, 100], [0, 100]); // Moves texture

    // 2. MONOLITH RISE ANIMATION
    const engines = ['Protect', 'Grow', 'Execute', 'Govern'] as const;
    const colors = {
        Protect: theme.accent.red,
        Grow: theme.accent.violet,
        Execute: theme.accent.amber,
        Govern: theme.accent.blue,
    };

    // 3. CAMERA ANIMATION
    // Start low and close, pull back and up
    const cameraKeyframes = [
        { frame: 0, scale: 2.5, x: 0, y: 300, rotateX: 20 },
        { frame: 120, scale: 0.9, x: 0, y: 0, rotateX: 0, easing: CameraEasing.smooth },
    ];

    return (
        <ShotTransition
            durationInFrames={SHOTS.shot2.duration}
            enterType="fade"
            exitType="push"
        >
            <CameraController keyframes={cameraKeyframes}>
                <AbsoluteFill style={{ background: theme.background.deepNavy, perspective: 2000 }}>

                    {/* --- 3D ENVIRONMENT --- */}
                    <div style={{
                        width: '100%',
                        height: '100%',
                        transformStyle: 'preserve-3d',
                        transform: 'rotateX(60deg) translateY(-300px) scale(2)',
                    }}>
                        {/* THE GRID */}
                        <AbsoluteFill style={{
                            width: '400%', // Oversize for movement
                            height: '400%',
                            left: '-150%',
                            top: '-150%',
                            backgroundSize: '100px 100px',
                            backgroundImage: `
                                linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), 
                                linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
                            `,
                            transform: `translateY(${gridMove}px)`,
                            maskImage: 'radial-gradient(circle at center, black 0%, transparent 70%)',
                        }} />
                    </div>

                    {/* --- MONOLITHS --- */}
                    <AbsoluteFill style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        transformStyle: 'preserve-3d',
                    }}>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: 120, // Wider gap for cinematic feel
                            transformStyle: 'preserve-3d',
                        }}>
                            {engines.map((eng, i) => {
                                const delay = i * 8;
                                const rise = spring({
                                    frame: frame - delay,
                                    fps,
                                    config: { damping: 14, mass: 1.2 }
                                });

                                const float = Math.sin((frame + i * 20) / 40) * 15;
                                const glowColor = colors[eng];

                                return (
                                    <div key={eng} style={{
                                        transform: `
                                            translateY(${(1 - rise) * 400 + float}px) 
                                            rotateY(${interpolate(rise, [0, 1], [45, 0])}deg)
                                        `,
                                        opacity: rise,
                                    }}>
                                        {/* THE MONOLITH */}
                                        <div style={{
                                            width: 220,
                                            height: 340,
                                            position: 'relative',
                                        }}>
                                            {/* Back Glow */}
                                            <div style={{
                                                position: 'absolute',
                                                inset: 0,
                                                background: glowColor,
                                                filter: 'blur(60px)',
                                                opacity: 0.2,
                                                transform: 'translateZ(-50px)'
                                            }} />

                                            <GlassRefraction
                                                intensity={0.3}
                                                borderRadius={24}
                                                glowColor={glowColor}
                                            >
                                                <div style={{
                                                    height: '100%',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'space-between',
                                                    padding: 30,
                                                    border: `1px solid ${glowColor}44`,
                                                    background: `linear-gradient(180deg, ${glowColor}11 0%, transparent 100%)`
                                                }}>
                                                    {/* Header */}
                                                    <div style={{
                                                        fontSize: 14,
                                                        fontFamily: theme.typography.fontUi,
                                                        color: glowColor,
                                                        letterSpacing: 2,
                                                        opacity: 0.8
                                                    }}>
                                                        MODULE 0{i + 1}
                                                    </div>

                                                    {/* Center Icon */}
                                                    <div style={{
                                                        alignSelf: 'center',
                                                        transform: 'scale(2)',
                                                        filter: `drop-shadow(0 0 20px ${glowColor}66)`
                                                    }}>
                                                        <AnimatedEnginePill engine={eng} active={true} />
                                                    </div>

                                                    {/* Footer Data */}
                                                    <div style={{
                                                        display: 'flex',
                                                        gap: 4,
                                                        flexDirection: 'column'
                                                    }}>
                                                        <div style={{ height: 2, width: '100%', background: `${glowColor}44` }} />
                                                        <div style={{ fontSize: 10, fontFamily: theme.typography.fontMono, color: 'rgba(255,255,255,0.4)' }}>
                                                            STATUS: ONLINE
                                                        </div>
                                                    </div>
                                                </div>
                                            </GlassRefraction>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </AbsoluteFill>

                    {/* --- CENTER TEXT --- */}
                    <AbsoluteFill style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 100, // Top layer
                        pointerEvents: 'none'
                    }}>
                        <h2 style={{
                            fontFamily: theme.typography.fontHeader,
                            fontSize: 64,
                            color: 'white',
                            opacity: interpolate(frame, [50, 80], [0, 1]),
                            transform: `translateY(${interpolate(frame, [50, 100], [40, 0])}px)`,
                            textShadow: '0 0 40px rgba(0,0,0,0.8), 0 0 10px rgba(255,255,255,0.2)',
                            letterSpacing: -1
                        }}>
                            Architecture you can see.
                        </h2>
                    </AbsoluteFill>

                </AbsoluteFill>
            </CameraController>
        </ShotTransition>
    );
};
