import React from 'react';

type AlertProps = {
  variant?: 'default' | 'error' | 'success';
  children: React.ReactNode;
};

export const Alert: React.FC<AlertProps> = ({ variant = 'default', children }) => {
  return <div className={`alert ${variant !== 'default' ? `alert-${variant}` : ''}`}>{children}</div>;
};
