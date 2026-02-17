
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { ShotTransition } from '../../shared/animation/ShotTransition';
import { CameraController, CameraEasing } from '../../shared/camera/CameraController';
import { theme } from '../../shared/theme';
import { SHOTS } from '../config';
import { GlassCard } from '../../shared/web-ui/GlassCard';
import { Shield, TrendingUp, Zap, Scale } from 'lucide-react';

export const Shot02TurnWebUI: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // 1. GRID ANIMATION (Infinite Floor)
    const gridMove = interpolate(frame, [0, 100], [0, 100]);

    // 2. MONOLITH RISE ANIMATION
    const engines = [
        { name: 'Protect', icon: Shield, color: theme.accent.red, label: 'MODULE 01' },
        { name: 'Grow', icon: TrendingUp, color: theme.accent.violet, label: 'MODULE 02' },
        { name: 'Execute', icon: Zap, color: theme.accent.amber, label: 'MODULE 03' },
        { name: 'Govern', icon: Scale, color: theme.accent.blue, label: 'MODULE 04' },
    ];

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

                    {/* --- GLASS CARDS (WEB UI) --- */}
                    <AbsoluteFill style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        transformStyle: 'preserve-3d',
                    }}>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: 60, // Wider gap for cinematic feel
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
                                const Icon = eng.icon;

                                return (
                                    <div key={eng.name} style={{
                                        transform: `
                                            translateY(${(1 - rise) * 400 + float}px) 
                                            rotateY(${interpolate(rise, [0, 1], [45, 0])}deg)
                                        `,
                                        opacity: rise,
                                    }}>
                                        {/* THE GLASS CARD */}
                                        <GlassCard
                                            className="flex flex-col justify-between"
                                            style={{
                                                width: 220,
                                                height: 340,
                                                borderColor: eng.color,
                                                background: `linear-gradient(180deg, ${eng.color}11 0%, rgba(255,255,255,0.03) 100%)`
                                            }}
                                        >
                                            {/* Header */}
                                            <div style={{
                                                fontSize: 14,
                                                fontFamily: theme.typography.fontUi,
                                                color: eng.color,
                                                letterSpacing: 2,
                                                opacity: 0.8,
                                                textTransform: 'uppercase'
                                            }}>
                                                {eng.label}
                                            </div>

                                            {/* Center Icon */}
                                            <div style={{
                                                alignSelf: 'center',
                                                transform: 'scale(2.5)',
                                                filter: `drop-shadow(0 0 20px ${eng.color}66)`,
                                                color: eng.color
                                            }}>
                                                <Icon size={48} strokeWidth={1.5} />
                                            </div>

                                            {/* Footer Data */}
                                            <div style={{
                                                display: 'flex',
                                                gap: 8,
                                                flexDirection: 'column'
                                            }}>
                                                <div style={{ height: 1, width: '100%', background: `${eng.color}44` }} />
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <div style={{ fontSize: 12, fontFamily: theme.typography.fontUi, color: 'white', fontWeight: 600 }}>
                                                        {eng.name}
                                                    </div>
                                                    <div style={{ fontSize: 10, fontFamily: theme.typography.fontMono, color: 'rgba(255,255,255,0.4)' }}>
                                                        ONLINE
                                                    </div>
                                                </div>
                                            </div>
                                        </GlassCard>
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
