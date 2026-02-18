import React from 'react';
interface IconProps {
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}

export const IconVault: React.FC<IconProps> = ({ size = 24, color = 'var(--engine-protect)', style }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <rect x="3" y="3" width="18" height="18" rx="2" stroke={color} strokeWidth="2" />
      <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2" />
      <path d="M12 9V8" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M12 16V15" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M9 12H8" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M16 12H15" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M18 6L16 8" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};
