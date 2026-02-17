import { useState, useEffect } from 'react';
import { theme } from '../shared/theme';

interface Node {
  id: string;
  name: string;
  icon: string;
  color: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface Edge {
  source: string;
  target: string;
  label: string;
  strength: number;
}

export interface EngineNetworkGraphProps {
  width?: number;
  height?: number;
}

export function EngineNetworkGraph({ width = 600, height = 400 }: EngineNetworkGraphProps) {
  const nodes: Node[] = [
    { id: 'protect', name: 'PROTECT', icon: 'P', color: theme.colors.success, x: 150, y: 200, vx: 0, vy: 0 },
    { id: 'grow', name: 'GROW', icon: 'G', color: theme.colors.info, x: 450, y: 200, vx: 0, vy: 0 },
    { id: 'execute', name: 'EXECUTE', icon: 'E', color: theme.colors.warning, x: 300, y: 100, vx: 0, vy: 0 },
    { id: 'govern', name: 'GOVERN', icon: 'V', color: theme.colors.neutral, x: 300, y: 300, vx: 0, vy: 0 }
  ];

  const edges: Edge[] = [
    { source: 'protect', target: 'execute', label: 'Threats → Actions', strength: 0.9 },
    { source: 'grow', target: 'execute', label: 'Predictions → Actions', strength: 0.85 },
    { source: 'execute', target: 'govern', label: 'Actions → Audit', strength: 1.0 },
    { source: 'protect', target: 'govern', label: 'Detections → Audit', strength: 0.95 },
    { source: 'grow', target: 'govern', label: 'Forecasts → Audit', strength: 0.9 },
    { source: 'protect', target: 'grow', label: 'Risk → Adjust', strength: 0.7 }
  ];

  const [animatedNodes, setAnimatedNodes] = useState(nodes);
  const [pulseIndex, setPulseIndex] = useState(0);

  // Simple force simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedNodes(prev => {
        return prev.map(node => {
          // Apply forces from edges
          let fx = 0;
          let fy = 0;

          edges.forEach(edge => {
            if (edge.source === node.id || edge.target === node.id) {
              const other = prev.find(n => n.id === (edge.source === node.id ? edge.target : edge.source));
              if (other) {
                const dx = other.x - node.x;
                const dy = other.y - node.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const targetDist = 150;
                const force = (dist - targetDist) * 0.01 * edge.strength;
                fx += (dx / dist) * force;
                fy += (dy / dist) * force;
              }
            }
          });

          // Center force
          const cx = width / 2;
          const cy = height / 2;
          const dx = cx - node.x;
          const dy = cy - node.y;
          fx += dx * 0.001;
          fy += dy * 0.001;

          // Update velocity and position
          const newVx = (node.vx + fx) * 0.9;
          const newVy = (node.vy + fy) * 0.9;
          const newX = Math.max(40, Math.min(width - 40, node.x + newVx));
          const newY = Math.max(40, Math.min(height - 40, node.y + newVy));

          return { ...node, vx: newVx, vy: newVy, x: newX, y: newY };
        });
      });
    }, 50);

    return () => clearInterval(interval);
  }, [width, height]);

  // Pulse animation
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseIndex(prev => (prev + 1) % edges.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getNodePosition = (id: string) => {
    const node = animatedNodes.find(n => n.id === id);
    return node || { x: 0, y: 0 };
  };

  return (
    <div className="relative" style={{ width: `${width}px`, height: `${height}px` }}>
      <svg width={width} height={height} className="w-full h-full">
        {/* Edges */}
        <defs>
          {edges.map((_, i) => (
            <marker
              key={i}
              id={`arrow-${i}`}
              markerWidth="10"
              markerHeight="10"
              refX="25"
              refY="3"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path
                d="M0,0 L0,6 L9,3 z"
                fill={pulseIndex === i ? theme.colors.info : 'rgba(255,255,255,0.3)'}
              />
            </marker>
          ))}
        </defs>

        {edges.map((edge, i) => {
          const source = getNodePosition(edge.source);
          const target = getNodePosition(edge.target);
          const isPulsing = pulseIndex === i;

          return (
            <g key={i}>
              <line
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                stroke={isPulsing ? theme.colors.info : 'rgba(255,255,255,0.15)'}
                strokeWidth={isPulsing ? 3 : 2}
                strokeDasharray={isPulsing ? '0' : '5,5'}
                markerEnd={`url(#arrow-${i})`}
                style={{ transition: 'all 0.3s' }}
              />

              {/* Edge label */}
              <text
                x={(source.x + target.x) / 2}
                y={(source.y + target.y) / 2}
                fill={isPulsing ? theme.colors.info : theme.colors.neutral}
                fontSize="10"
                textAnchor="middle"
                style={{
                  pointerEvents: 'none',
                  opacity: isPulsing ? 1 : 0.6,
                  transition: 'all 0.3s'
                }}
              >
                {edge.label}
              </text>

              {/* Animated pulse */}
              {isPulsing && (
                <circle
                  cx={source.x}
                  cy={source.y}
                  r="4"
                  fill={theme.colors.info}
                >
                  <animateMotion
                    dur="2s"
                    path={`M ${source.x} ${source.y} L ${target.x} ${target.y}`}
                    repeatCount="1"
                  />
                </circle>
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {animatedNodes.map((node) => (
          <g key={node.id} style={{ cursor: 'pointer' }}>
            {/* Outer glow */}
            <circle
              cx={node.x}
              cy={node.y}
              r="35"
              fill={`${node.color}15`}
              stroke={node.color}
              strokeWidth="1"
              opacity="0.3"
            />

            {/* Node circle */}
            <circle
              cx={node.x}
              cy={node.y}
              r="28"
              fill="rgba(10, 14, 26, 0.9)"
              stroke={node.color}
              strokeWidth="2"
            />

            {/* Icon */}
            <text
              x={node.x}
              y={node.y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="20"
            >
              {node.icon}
            </text>

            {/* Label */}
            <text
              x={node.x}
              y={node.y + 45}
              fill="#fff"
              fontSize="11"
              fontWeight="600"
              textAnchor="middle"
            >
              {node.name}
            </text>
          </g>
        ))}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-sm rounded-lg p-3 border border-white/10">
        <div className="text-xs text-gray-400 space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-cyan-400" />
            <span>Active data flow</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-white/20 border-t border-dashed" />
            <span>Idle dependency</span>
          </div>
        </div>
      </div>
    </div>
  );
}
