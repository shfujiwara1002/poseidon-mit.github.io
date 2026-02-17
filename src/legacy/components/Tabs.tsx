import React from 'react';

type TabItem = {
  id: string;
  label: string;
};

type TabsProps = {
  items: TabItem[];
  activeId: string;
  onChange?: (id: string) => void;
};

export const Tabs: React.FC<TabsProps> = ({ items, activeId, onChange }) => {
  return (
    <div className="tabs">
      <div className="tab-list" role="tablist">
        {items.map((item) => (
          <button
            key={item.id}
            className={`tab ${activeId === item.id ? 'active' : ''}`}
            onClick={() => onChange?.(item.id)}
            type="button"
            role="tab"
            aria-selected={activeId === item.id}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};
