import React from 'react';
interface IconProps {
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}

export const IconGovernance: React.FC<IconProps> = ({ size = 24, color = 'var(--engine-govern)', style }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
      <path d="M12 3V21" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M6 7L18 7" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M6 7V10C6 12 8 13 8 13C8 13 10 12 10 10V7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 7V10C14 12 16 13 16 13C16 13 18 12 18 10V7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};
