import React from 'react';
import { Link, useRouter } from '../router';

const engineTabs = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Engines', to: '/engines' },
  { label: 'Protect', to: '/protect' },
  { label: 'Grow', to: '/grow' },
  { label: 'Execute', to: '/execute' },
  { label: 'Govern', to: '/govern' },
  { label: 'Settings', to: '/settings' },
];

export const EngineTabs: React.FC = () => {
  const { path } = useRouter();
  return (
    <div className="engine-tabs" role="tablist" aria-label="Engine navigation">
      {engineTabs.map((tab) => (
        <Link
          key={tab.label}
          to={tab.to}
          className={`engine-tab ${path === tab.to ? 'active' : ''}`}
          role="tab"
          aria-selected={path === tab.to}
          {...(path === tab.to ? { 'aria-current': 'page' as const } : {})}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
};
