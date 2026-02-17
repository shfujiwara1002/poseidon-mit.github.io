import React from 'react';

type TagProps = {
  children: React.ReactNode;
};

export const Tag: React.FC<TagProps> = ({ children }) => {
  return <span className="tag">{children}</span>;
};
