import React from 'react';
import { EngineIconBadge } from './EngineIconBadge';
import { getEngineSemantic } from '../design-system/engine-semantic';

type EngineKey = 'Protect' | 'Grow' | 'Execute' | 'Govern';

interface EngineData {
  key: EngineKey;
  status: string;
  score: string;
  tone: 'teal' | 'violet' | 'amber' | 'blue';
}

interface EngineHealthStripProps {
  engines: EngineData[];
  selected: EngineKey;
  onSelect: (key: EngineKey) => void;
}

/**
 * DASH-02: Engine Health Strip — horizontal 4-engine comparison
 * Shows all 4 engines simultaneously with icon, status, and confidence score.
 */
export const EngineHealthStrip: React.FC<EngineHealthStripProps> = ({
  engines,
  selected,
  onSelect,
}) => {
  return (
    <div className="engine-health-strip">
      {engines.map((engine) => {
        const semantic = getEngineSemantic(engine.key);
        const scorePercent = `${Math.max(0, Math.min(100, parseFloat(engine.score) * 100))}%`;
        const isSelected = selected === engine.key;

        return (
          <button
            key={engine.key}
            type="button"
            className={`engine-health-cell${isSelected ? ' is-selected' : ''}`}
            onClick={() => onSelect(engine.key)}
            data-engine={engine.key}
            style={{
              '--engine-score-width': scorePercent,
            } as React.CSSProperties}
          >
            <EngineIconBadge engine={engine.key} size={20} />
            <div className="engine-health-info">
              <span className="engine-health-name">{engine.key}</span>
              <span className="engine-health-status">{engine.status}</span>
            </div>
            <div className="engine-health-score">
              <span className="engine-health-score-value">{engine.score}</span>
              <div className="engine-health-bar">
                <div className="engine-health-bar-fill" data-tone={semantic.tone} />
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
