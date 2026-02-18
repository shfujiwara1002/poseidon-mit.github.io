import React from 'react';
interface VisualWireframeProps {
  width?: number;
  height?: number;
  color?: string;
  style?: React.CSSProperties;
}

export const VisualWireframe: React.FC<VisualWireframeProps> = ({
  width = 300,
  height = 200,
  color = 'var(--accent-blue)',
  style,
}) => {
  return (
    <div
      className="visual-wireframe"
      style={{
        width: '100%',
        maxWidth: width,
        height,
        background: 'rgba(255,255,255,0.05)',
        border: `1px solid ${color}`,
        borderRadius: 8,
        display: 'flex',
        flexDirection: 'column',
        padding: 10,
        gap: 8,
        ...style,
      }}
    >
      <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
        <div className="wireframe-dot" style={{ width: 10, height: 10, borderRadius: '50%', background: color, opacity: 0.5 }} />
        <div className="wireframe-bar" style={{ width: '40%', height: 6, background: color, opacity: 0.3, borderRadius: 3 }} />
      </div>
      <div style={{ display: 'flex', gap: 8, flex: 1 }}>
        <div className="wireframe-block" style={{ width: '30%', height: '100%', background: color, opacity: 0.1, borderRadius: 4 }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
          <div className="wireframe-block" style={{ width: '100%', height: 30, background: color, opacity: 0.1, borderRadius: 4 }} />
          <div className="wireframe-block" style={{ width: '100%', height: 30, background: color, opacity: 0.1, borderRadius: 4 }} />
          <div className="wireframe-block" style={{ width: '70%', height: 30, background: color, opacity: 0.1, borderRadius: 4 }} />
        </div>
      </div>
    </div>
  );
};
