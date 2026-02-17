import React from 'react';

type DropdownProps = {
  open: boolean;
  trigger: React.ReactNode;
  children: React.ReactNode;
};

export const Dropdown: React.FC<DropdownProps> = ({ open, trigger, children }) => {
  return (
    <div style={{ position: 'relative', display: 'inline-flex' }}>
      {trigger}
      {open && (
        <div className="glass-card dropdown-panel">
          <div className="engine-list">{children}</div>
        </div>
      )}
    </div>
  );
};
