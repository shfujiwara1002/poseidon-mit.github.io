import React from 'react';
interface IconProps {
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}

export const IconBrain: React.FC<IconProps> = ({ size = 24, color = 'var(--accent-cyan)', style }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
      <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2" />
      <circle cx="12" cy="4" r="2" fill={color} fillOpacity="0.6" />
      <circle cx="20" cy="12" r="2" fill={color} fillOpacity="0.6" />
      <circle cx="12" cy="20" r="2" fill={color} fillOpacity="0.6" />
      <circle cx="4" cy="12" r="2" fill={color} fillOpacity="0.6" />
      <path d="M12 9V6" stroke={color} strokeWidth="1.5" />
      <path d="M12 15V18" stroke={color} strokeWidth="1.5" />
      <path d="M15 12H18" stroke={color} strokeWidth="1.5" />
      <path d="M9 12H6" stroke={color} strokeWidth="1.5" />
      <path d="M14.12 14.12L16.5 16.5" stroke={color} strokeWidth="1.5" />
      <path d="M9.88 9.88L7.5 7.5" stroke={color} strokeWidth="1.5" />
      <path d="M14.12 9.88L16.5 7.5" stroke={color} strokeWidth="1.5" />
      <path d="M9.88 14.12L7.5 16.5" stroke={color} strokeWidth="1.5" />
    </svg>
  );
};
