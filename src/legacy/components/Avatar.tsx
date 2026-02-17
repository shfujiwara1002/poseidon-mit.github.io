import React from 'react';

type AvatarProps = {
  initials: string;
};

export const Avatar: React.FC<AvatarProps> = ({ initials }) => {
  return <div className="avatar">{initials}</div>;
};
