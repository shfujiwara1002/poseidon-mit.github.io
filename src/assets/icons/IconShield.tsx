import React from 'react';
interface IconProps {
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}

export const IconShield: React.FC<IconProps> = ({ size = 24, color = 'var(--engine-protect)', style }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
      <path
        d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12 8V16" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M8 12H16" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};
