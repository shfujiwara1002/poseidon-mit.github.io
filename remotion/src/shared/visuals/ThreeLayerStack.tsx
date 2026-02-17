import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { GlassRefraction } from '../cinematic/GlassRefraction';
import { theme } from '../theme';

interface LayerData {
  label: string;
  sublabel: string;
  color: string;
}

interface ThreeLayerStackProps {
  layers: readonly LayerData[];
  delay?: number;
  stagger?: number;
}

const CARD_WIDTH = 600;
const CARD_HEIGHT = 100;

/**
 * Three-layer architecture stack with CSS perspective depth,
 * spring-animated card reveals, and SVG flow lines.
 */
export const ThreeLayerStack: React.FC<ThreeLayerStackProps> = ({
  layers,
  delay = 0,
  stagger = 30,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Flow lines animation (appears after all 3 layers)
  const flowDelay = delay + stagger * layers.length;
  const flowDuration = 30;
  const flowProgress = interpolate(
    frame - flowDelay,
    [0, flowDuration],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        perspective: 1200,
        perspectiveOrigin: '50% 50%',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column-reverse',
          alignItems: 'center',
          gap: 32,
          position: 'relative',
        }}
      >
        {layers.map((layer, index) => {
          const layerDelay = delay + index * stagger;
          const reveal = spring({
            frame: frame - layerDelay,
            fps,
            config: { damping: 14, mass: 0.8, stiffness: 100 },
          });

          const translateY = interpolate(reveal, [0, 1], [80, 0]);
          const opacity = interpolate(reveal, [0, 1], [0, 1]);
          const translateZ = index * 40;

          return (
            <div
              key={layer.label}
              style={{
                transform: `translateY(${translateY}px) translateZ(${translateZ}px)`,
                opacity,
                width: CARD_WIDTH,
              }}
            >
              <GlassRefraction
                intensity={0.5}
                glowColor={layer.color}
                borderRadius={16}
              >
                <div
                  style={{
                    padding: '20px 32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    minHeight: CARD_HEIGHT,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 22,
                        fontWeight: 700,
                        color: '#f8fafc',
                        fontFamily: theme.typography.fontHeader,
                      }}
                    >
                      {layer.label}
                    </div>
                    <div
                      style={{
                        fontSize: 14,
                        color: 'rgba(255,255,255,0.6)',
                        marginTop: 4,
                        fontFamily: theme.typography.fontUi,
                      }}
                    >
                      {layer.sublabel}
                    </div>
                  </div>
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: layer.color,
                      boxShadow: `0 0 12px ${layer.color}, 0 0 24px ${layer.color}66`,
                    }}
                  />
                </div>
              </GlassRefraction>
            </div>
          );
        })}

        {/* SVG flow lines connecting layers */}
        {flowProgress > 0 && (
          <svg
            style={{
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 4,
              height: '100%',
              overflow: 'visible',
              pointerEvents: 'none',
            }}
          >
            <line
              x1={2}
              y1={0}
              x2={2}
              y2="100%"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth={2}
              strokeDasharray="8 4"
              strokeDashoffset={interpolate(flowProgress, [0, 1], [200, 0])}
            />
            <circle
              cx={2}
              r={4}
              cy={`${interpolate(flowProgress, [0, 1], [100, 0])}%`}
              fill={theme.accent.cyan}
              filter={`drop-shadow(0 0 6px ${theme.accent.cyan})`}
              opacity={flowProgress}
            />
          </svg>
        )}
      </div>
    </div>
  );
};
