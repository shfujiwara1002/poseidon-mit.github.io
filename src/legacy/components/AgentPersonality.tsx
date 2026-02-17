import { useAutonomy, AutonomyLevel } from '../contexts/AutonomyContext';

interface PersonalityConfig {
  name: string;
  avatar: string;
  color: string;
  tone: string;
}

const personalities: Record<AutonomyLevel, PersonalityConfig> = {
  0: { name: 'Guardian', avatar: '\u{1F6E1}', color: '#22C55E', tone: 'cautious' },
  1: { name: 'Advisor', avatar: '\u{1F4AC}', color: '#3B82F6', tone: 'balanced' },
  2: { name: 'Navigator', avatar: '\u{1F9ED}', color: '#8B5CF6', tone: 'confident' },
  3: { name: 'Optimizer', avatar: '\u{1F680}', color: '#EAB308', tone: 'proactive' },
};

interface AgentPersonalityProps {
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
  showTone?: boolean;
  className?: string;
}

export function AgentPersonality({ size = 'md', showName = true, showTone = false, className = '' }: AgentPersonalityProps) {
  const { autonomyLevel } = useAutonomy();
  const personality = personalities[autonomyLevel];

  const sizes = {
    sm: { avatar: 'w-6 h-6 text-sm', text: 'text-xs' },
    md: { avatar: 'w-8 h-8 text-lg', text: 'text-sm' },
    lg: { avatar: 'w-10 h-10 text-xl', text: 'text-base' },
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className={`${sizes[size].avatar} rounded-full flex items-center justify-center`}
        style={{ backgroundColor: `${personality.color}20`, border: `1px solid ${personality.color}40` }}
      >
        {personality.avatar}
      </div>
      {showName && (
        <div>
          <div className={`${sizes[size].text} font-medium`} style={{ color: '#f8fafc' }}>
            {personality.name}
          </div>
          {showTone && (
            <div className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
              {personality.tone} mode
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function useAgentPersonality() {
  const { autonomyLevel } = useAutonomy();
  return personalities[autonomyLevel];
}
