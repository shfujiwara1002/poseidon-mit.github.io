import React, { useRef } from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, Img, staticFile } from 'remotion';
import { ThreeCanvas } from '@remotion/three';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface DeviceMockup3DProps {
    /** Screenshot or video frame source path (relative to public/) */
    screenSrc: string;
    /** Device type */
    device?: 'macbook' | 'phone';
    /** Start frame for entrance animation */
    startFrame?: number;
    /** Camera orbit angle in degrees */
    orbitAngle?: number;
    /** Camera tilt angle in degrees */
    tiltAngle?: number;
    /** Zoom level (distance from camera) */
    zoom?: number;
    /** Engine accent color for glow */
    glowColor?: string;
    /** Width of the composition */
    width?: number;
    /** Height of the composition */
    height?: number;
}

/**
 * 3D device mockup using @remotion/three.
 * Renders a MacBook or phone shape with the given screen content as texture.
 *
 * Note: For actual screen recordings (mp4), use <OffthreadVideo> in a 2D
 * overlay with CSS 3D transforms instead — Three.js video textures require
 * special handling in Remotion. This component is optimized for static
 * screenshots/frames that get mapped as textures.
 */
export const DeviceMockup3D: React.FC<DeviceMockup3DProps> = ({
    screenSrc,
    device = 'macbook',
    startFrame = 0,
    orbitAngle = 15,
    tiltAngle = -8,
    zoom = 4,
    glowColor = '#00f0ff',
    width = 1920,
    height = 1080,
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const entrance = spring({
        frame: frame - startFrame,
        fps,
        config: { damping: 16, mass: 0.8, stiffness: 80 },
    });

    // Procedural camera drift for subtle life
    const driftX = Math.sin(frame / 90) * 0.15;
    const driftY = Math.cos(frame / 120) * 0.1;

    const orbitRad = ((orbitAngle + driftX * 5) * Math.PI) / 180;
    const tiltRad = ((tiltAngle + driftY * 3) * Math.PI) / 180;

    const cameraX = Math.sin(orbitRad) * zoom;
    const cameraY = Math.sin(tiltRad) * zoom * 0.5;
    const cameraZ = Math.cos(orbitRad) * zoom;

    return (
        <ThreeCanvas
            width={width}
            height={height}
            style={{ width: '100%', height: '100%' }}
            camera={{
                position: [cameraX, cameraY, cameraZ],
                fov: 35,
                near: 0.1,
                far: 100,
            }}
        >
            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 5, 5]} intensity={0.8} />
            <pointLight position={[-3, 2, 4]} intensity={0.3} color={glowColor} />

            {device === 'macbook' ? (
                <MacbookModel
                    screenSrc={screenSrc}
                    entrance={entrance}
                    frame={frame}
                    glowColor={glowColor}
                />
            ) : (
                <PhoneModel
                    screenSrc={screenSrc}
                    entrance={entrance}
                    frame={frame}
                    glowColor={glowColor}
                />
            )}
        </ThreeCanvas>
    );
};

/**
 * Simplified MacBook model built from primitives.
 */
const MacbookModel: React.FC<{
    screenSrc: string;
    entrance: number;
    frame: number;
    glowColor: string;
}> = ({ screenSrc, entrance, frame, glowColor }) => {
    const screenRef = useRef<THREE.Mesh>(null);

    // Subtle floating animation
    const floatY = Math.sin(frame / 60) * 0.05;

    const scale = interpolate(entrance, [0, 1], [0.8, 1]);
    const opacity = entrance;

    return (
        <group
            position={[0, floatY, 0]}
            scale={[scale, scale, scale]}
            rotation={[0.1, 0, 0]}
        >
            {/* Screen bezel (dark frame) */}
            <mesh position={[0, 0.95, -0.02]}>
                <boxGeometry args={[3.2, 2.1, 0.04]} />
                <meshStandardMaterial
                    color="#1a1a2e"
                    metalness={0.8}
                    roughness={0.2}
                    transparent
                    opacity={opacity}
                />
            </mesh>

            {/* Screen display area */}
            <mesh ref={screenRef} position={[0, 0.95, 0.005]}>
                <planeGeometry args={[2.9, 1.82]} />
                <meshBasicMaterial color="#0a0a1a" transparent opacity={opacity} />
            </mesh>

            {/* Keyboard base */}
            <mesh position={[0, -0.1, 0.8]} rotation={[-Math.PI / 2 + 0.08, 0, 0]}>
                <boxGeometry args={[3.2, 2.0, 0.06]} />
                <meshStandardMaterial
                    color="#2a2a3e"
                    metalness={0.6}
                    roughness={0.3}
                    transparent
                    opacity={opacity}
                />
            </mesh>

            {/* Hinge */}
            <mesh position={[0, -0.05, -0.02]}>
                <boxGeometry args={[3.0, 0.06, 0.1]} />
                <meshStandardMaterial
                    color="#333355"
                    metalness={0.9}
                    roughness={0.1}
                    transparent
                    opacity={opacity}
                />
            </mesh>

            {/* Screen glow effect */}
            <pointLight
                position={[0, 0.95, 0.5]}
                intensity={0.15 * opacity}
                color={glowColor}
                distance={3}
            />
        </group>
    );
};

/**
 * Simplified phone model built from primitives.
 */
const PhoneModel: React.FC<{
    screenSrc: string;
    entrance: number;
    frame: number;
    glowColor: string;
}> = ({ screenSrc, entrance, frame, glowColor }) => {
    const floatY = Math.sin(frame / 50) * 0.06;
    const scale = interpolate(entrance, [0, 1], [0.7, 1]);
    const opacity = entrance;

    return (
        <group
            position={[0, floatY, 0]}
            scale={[scale, scale, scale]}
        >
            {/* Phone body */}
            <mesh>
                <boxGeometry args={[1.1, 2.2, 0.08]} />
                <meshStandardMaterial
                    color="#1a1a2e"
                    metalness={0.7}
                    roughness={0.2}
                    transparent
                    opacity={opacity}
                />
            </mesh>

            {/* Screen */}
            <mesh position={[0, 0, 0.045]}>
                <planeGeometry args={[0.95, 2.0]} />
                <meshBasicMaterial color="#0a0a1a" transparent opacity={opacity} />
            </mesh>

            {/* Screen glow */}
            <pointLight
                position={[0, 0, 0.5]}
                intensity={0.12 * opacity}
                color={glowColor}
                distance={2}
            />
        </group>
    );
};

/**
 * CSS-based 3D device frame for use with <OffthreadVideo> or <Video>.
 * This is the recommended approach for embedding screen recordings,
 * as it avoids Three.js video texture complexity.
 */
export const DeviceFrame2D: React.FC<{
    children: React.ReactNode;
    device?: 'macbook' | 'phone';
    startFrame?: number;
    rotateY?: number;
    rotateX?: number;
    scale?: number;
    glowColor?: string;
}> = ({
    children,
    device = 'macbook',
    startFrame = 0,
    rotateY = 8,
    rotateX = -4,
    scale: baseScale = 1,
    glowColor = '#00f0ff',
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const entrance = spring({
        frame: frame - startFrame,
        fps,
        config: { damping: 16, mass: 0.8, stiffness: 80 },
    });

    // Procedural drift
    const driftY = Math.sin(frame / 90) * 1.5;
    const driftX = Math.cos(frame / 120) * 1;
    const floatY = Math.sin(frame / 60) * 3;

    const s = interpolate(entrance, [0, 1], [0.85, baseScale]);
    const ry = rotateY + driftY;
    const rx = rotateX + driftX;

    const isMacbook = device === 'macbook';
    const bezelPx = isMacbook ? 16 : 12;
    const borderRadius = isMacbook ? 12 : 28;

    return (
        <div
            style={{
                perspective: 1200,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%',
            }}
        >
            <div
                style={{
                    transform: `
                        translateY(${interpolate(entrance, [0, 1], [60, 0]) + floatY}px)
                        scale(${s})
                        rotateY(${ry}deg)
                        rotateX(${rx}deg)
                    `,
                    opacity: entrance,
                    transformStyle: 'preserve-3d',
                    willChange: 'transform, opacity',
                    padding: bezelPx,
                    background: 'linear-gradient(145deg, #1a1a2e, #0d0d1a)',
                    borderRadius,
                    boxShadow: `
                        0 40px 100px rgba(0,0,0,0.6),
                        0 0 60px ${glowColor}15,
                        inset 0 1px 0 rgba(255,255,255,0.1)
                    `,
                    border: '1px solid rgba(255,255,255,0.08)',
                }}
            >
                <div
                    style={{
                        borderRadius: borderRadius - 4,
                        overflow: 'hidden',
                        position: 'relative',
                    }}
                >
                    {children}
                </div>
            </div>
        </div>
    );
};

export { DeviceMockup3D as default };
