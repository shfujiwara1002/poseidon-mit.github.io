import React from 'react';
import { Shield, TrendingUp, Zap, Scale } from 'lucide-react';
import { getEngineSemantic } from '../design-system/engine-semantic';

export type EngineKey = 'Protect' | 'Grow' | 'Execute' | 'Govern';

const engineIconMap: Record<EngineKey, React.ElementType> = {
  Protect: Shield,
  Grow: TrendingUp,
  Execute: Zap,
  Govern: Scale,
};

interface EngineIconBadgeProps {
  engine: EngineKey;
  size?: number;
}

export function EngineIconBadge({ engine, size = 20 }: EngineIconBadgeProps) {
  const Icon = engineIconMap[engine];
  const semantic = getEngineSemantic(engine);
  const sizeClass = size <= 14 ? 'engine-icon-badge--sm' : size <= 16 ? 'engine-icon-badge--md' : 'engine-icon-badge--lg';

  return (
    <span
      className={['engine-icon-badge', semantic.glowClass, sizeClass].join(' ')}
      data-widget="EngineIconBadge"
      data-engine={engine}
    >
      <Icon
        className="engine-icon-badge__icon"
        size={size}
        strokeWidth={2.2}
      />
    </span>
  );
}
