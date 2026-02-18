import React from 'react';
interface IconProps {
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}

export const IconGrowth: React.FC<IconProps> = ({ size = 24, color = 'var(--engine-grow)', style }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
      <path d="M23 6L13.5 15.5L8.5 10.5L1 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 6H23V12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M23 6L13.5 15.5L8.5 10.5L1 18" stroke={color} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.15" />
    </svg>
  );
};
