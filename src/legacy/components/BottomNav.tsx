import React from 'react';
import { Link, useRouter } from '../router';
import { IconPulse, IconShield, IconGrowth, IconLightning, IconGovernance } from '../assets/icons';

const bottomNavItems = [
  { label: 'Dashboard', to: '/dashboard', icon: IconPulse },
  { label: 'Protect', to: '/protect', icon: IconShield },
  { label: 'Grow', to: '/grow', icon: IconGrowth },
  { label: 'Execute', to: '/execute', icon: IconLightning },
  { label: 'Govern', to: '/govern', icon: IconGovernance },
];

export const BottomNav: React.FC = () => {
  const { path } = useRouter();

  return (
    <nav className="bottom-nav" aria-label="Engine navigation">
      {bottomNavItems.map((item) => {
        const Icon = item.icon;
        const isActive = path === item.to || path.startsWith(`${item.to}/`);
        return (
          <Link
            key={item.label}
            to={item.to}
            className={`bottom-nav-item${isActive ? ' active' : ''}`}
            aria-current={isActive ? 'page' : undefined}
            onClick={(e) => {
              if (isActive) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          >
            <Icon size={20} />
            <span className="bottom-nav-label">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
