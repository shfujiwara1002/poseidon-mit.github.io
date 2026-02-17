import { theme } from '../shared/theme';

export interface SankeyNode {
  id: string;
  label: string;
  color?: string;
}

export interface SankeyLink {
  source: string;
  target: string;
  value: number;
  color?: string;
}

export interface SankeyDiagramProps {
  nodes: SankeyNode[];
  links: SankeyLink[];
  width?: number;
  height?: number;
}

export function SankeyDiagram({ nodes, links, width = 800, height = 400 }: SankeyDiagramProps) {
  // Simple Sankey layout calculation
  const nodeMap = new Map(nodes.map(n => [n.id, n]));

  // Calculate node levels (source -> target depth)
  const levels = new Map<string, number>();
  const visited = new Set<string>();

  const calculateLevel = (nodeId: string, level: number = 0) => {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);
    levels.set(nodeId, Math.max(levels.get(nodeId) || 0, level));

    links
      .filter(link => link.source === nodeId)
      .forEach(link => calculateLevel(link.target, level + 1));
  };

  // Find root nodes (nodes with no incoming links)
  const rootNodes = nodes.filter(
    node => !links.some(link => link.target === node.id)
  );

  rootNodes.forEach(node => calculateLevel(node.id));

  // Group nodes by level
  const maxLevel = Math.max(...Array.from(levels.values()));
  const nodesByLevel = new Map<number, SankeyNode[]>();

  nodes.forEach(node => {
    const level = levels.get(node.id) || 0;
    if (!nodesByLevel.has(level)) nodesByLevel.set(level, []);
    nodesByLevel.get(level)!.push(node);
  });

  // Calculate positions
  const levelWidth = width / (maxLevel + 1);
  const nodeWidth = 20;
  const nodePadding = 20;

  const nodePositions = new Map<string, { x: number; y: number; height: number }>();

  nodesByLevel.forEach((levelNodes, level) => {
    const totalHeight = height - (levelNodes.length - 1) * nodePadding;
    const nodeHeight = totalHeight / levelNodes.length;

    levelNodes.forEach((node, index) => {
      const x = level * levelWidth + levelWidth / 2;
      const y = index * (nodeHeight + nodePadding);

      // Calculate node value (sum of incoming or outgoing links)
      const incomingValue = links
        .filter(link => link.target === node.id)
        .reduce((sum, link) => sum + link.value, 0);
      const outgoingValue = links
        .filter(link => link.source === node.id)
        .reduce((sum, link) => sum + link.value, 0);
      const value = Math.max(incomingValue, outgoingValue);

      const scaledHeight = Math.max(30, (value / 10000) * 100);

      nodePositions.set(node.id, { x, y, height: scaledHeight });
    });
  });

  return (
    <div className="w-full overflow-x-auto">
      <svg width={width} height={height} className="w-full h-full">
        <defs>
          {links.map((link, i) => (
            <linearGradient
              key={i}
              id={`gradient-${i}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor={link.color || theme.colors.info} stopOpacity="0.6" />
              <stop offset="100%" stopColor={link.color || theme.colors.info} stopOpacity="0.3" />
            </linearGradient>
          ))}
        </defs>

        {/* Links */}
        {links.map((link, index) => {
          const sourcePos = nodePositions.get(link.source);
          const targetPos = nodePositions.get(link.target);

          if (!sourcePos || !targetPos) return null;

          const sourceX = sourcePos.x + nodeWidth;
          const sourceY = sourcePos.y + sourcePos.height / 2;
          const targetX = targetPos.x;
          const targetY = targetPos.y + targetPos.height / 2;

          const thickness = Math.max(2, (link.value / 5000) * 30);

          // Curved path
          const midX = (sourceX + targetX) / 2;
          const path = `
            M ${sourceX} ${sourceY - thickness / 2}
            C ${midX} ${sourceY - thickness / 2}, ${midX} ${targetY - thickness / 2}, ${targetX} ${targetY - thickness / 2}
            L ${targetX} ${targetY + thickness / 2}
            C ${midX} ${targetY + thickness / 2}, ${midX} ${sourceY + thickness / 2}, ${sourceX} ${sourceY + thickness / 2}
            Z
          `;

          return (
            <g key={index}>
              <path
                d={path}
                fill={`url(#gradient-${index})`}
                opacity="0.7"
              />

              {/* Value label */}
              <text
                x={(sourceX + targetX) / 2}
                y={(sourceY + targetY) / 2}
                fill="#fff"
                fontSize="11"
                textAnchor="middle"
                dominantBaseline="middle"
                opacity="0.8"
              >
                ${link.value.toLocaleString()}
              </text>
            </g>
          );
        })}

        {/* Nodes */}
        {Array.from(nodePositions.entries()).map(([nodeId, pos]) => {
          const node = nodeMap.get(nodeId);
          if (!node) return null;

          return (
            <g key={nodeId}>
              <rect
                x={pos.x}
                y={pos.y}
                width={nodeWidth}
                height={pos.height}
                fill={node.color || theme.colors.info}
                rx="4"
              />

              <text
                x={pos.x + nodeWidth + 8}
                y={pos.y + pos.height / 2}
                fill="#fff"
                fontSize="12"
                dominantBaseline="middle"
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
