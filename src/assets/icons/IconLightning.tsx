import React from 'react';
interface IconProps {
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}

export const IconLightning: React.FC<IconProps> = ({ size = 24, color = 'var(--accent-amber)', style }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
      <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill={color} fillOpacity="0.2" />
    </svg>
  );
};
