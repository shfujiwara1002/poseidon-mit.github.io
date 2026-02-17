import { motion } from 'framer-motion';
import { useAutonomy, AutonomyLevel } from '../contexts/AutonomyContext';

const levelIcons: Record<AutonomyLevel, string> = {
  0: '\u270B', // Raised hand
  1: '\u{1F91D}', // Handshake
  2: '\u26A1', // Lightning
  3: '\u{1F680}', // Rocket
};

const levelColors: Record<AutonomyLevel, string> = {
  0: '#22C55E',
  1: '#3B82F6',
  2: '#8B5CF6',
  3: '#EAB308',
};

export function AutonomyDial({ compact = false }: { compact?: boolean }) {
  const { autonomyLevel, setAutonomyLevel, config } = useAutonomy();

  const levels: AutonomyLevel[] = [0, 1, 2, 3];

  return (
    <div className="space-y-3">
      {!compact && (
        <div className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.72)' }}>
          AI Autonomy Level
        </div>
      )}
      <div className="flex gap-2">
        {levels.map((level) => {
          const isActive = autonomyLevel === level;
          const { name, description } = config.labels[level];
          return (
            <motion.button
              key={level}
              onClick={() => setAutonomyLevel(level)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 rounded-lg p-3 text-left transition-colors touch-target"
              style={{
                backgroundColor: isActive ? `${levelColors[level]}20` : 'rgba(255,255,255,0.04)',
                border: `1px solid ${isActive ? `${levelColors[level]}60` : 'rgba(255,255,255,0.08)'}`,
              }}
              aria-pressed={isActive}
              aria-label={`${name}: ${description}`}
            >
              <div className="text-lg mb-1">{levelIcons[level]}</div>
              <div className="text-xs font-semibold" style={{ color: isActive ? levelColors[level] : '#f8fafc' }}>
                {name}
              </div>
              {!compact && (
                <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {description}
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
