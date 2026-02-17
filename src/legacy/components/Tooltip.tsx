import React, { useId, useState, useCallback } from 'react';

type TooltipProps = {
  content: string;
  children: React.ReactNode;
};

export const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const id = useId();
  const [dismissed, setDismissed] = useState(false);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setDismissed(true);
      setTimeout(() => setDismissed(false), 100);
    }
  }, []);

  return (
    <span
      className="tooltip"
      aria-describedby={id}
      onKeyDown={handleKeyDown}
    >
      {children}
      <span
        id={id}
        className="tooltip-content"
        role="tooltip"
        style={dismissed ? { opacity: 0 } : undefined}
      >
        {content}
      </span>
    </span>
  );
};
