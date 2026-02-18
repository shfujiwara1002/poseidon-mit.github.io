import React from 'react';
interface IconProps {
  size?: number;
  type: 'check' | 'cross' | 'play';
  color?: string;
  style?: React.CSSProperties;
}

export const IconSupport: React.FC<IconProps> = ({ size = 24, type, color, style }) => {
  const finalColor = color || (type === 'check' ? 'var(--engine-grow)' : type === 'cross' ? 'var(--engine-protect)' : 'white');

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
      {type === 'check' && (
        <path d="M20 6L9 17L4 12" stroke={finalColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      )}
      {type === 'cross' && (
        <g>
          <path d="M18 6L6 18" stroke={finalColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 6L18 18" stroke={finalColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}
      {type === 'play' && (
        <path d="M5 3L19 12L5 21V3Z" fill={finalColor} stroke={finalColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
};
