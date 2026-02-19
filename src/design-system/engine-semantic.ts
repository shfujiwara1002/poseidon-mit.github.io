type MissionTone = 'primary' | 'healthy' | 'warning' | 'critical' | 'neutral';

export type EngineSemanticKey = 'Protect' | 'Grow' | 'Execute' | 'Govern';

export interface EngineSemantic {
  key: EngineSemanticKey;
  tone: MissionTone;
  colorHex: string;
  colorToken: string;
  colorRgbToken: string;
  glowClass: string;
}

const ENGINE_SEMANTICS: Record<EngineSemanticKey, EngineSemantic> = {
  Protect: {
    key: 'Protect',
    tone: 'healthy',
    colorHex: '#14B8A6',
    colorToken: 'var(--state-healthy)',
    colorRgbToken: 'var(--state-healthy-rgb)',
    glowClass: 'icon-glow-teal',
  },
  Grow: {
    key: 'Grow',
    tone: 'primary',
    colorHex: '#8B5CF6',
    colorToken: 'var(--engine-grow)',
    colorRgbToken: '139, 92, 246',
    glowClass: 'icon-glow-violet',
  },
  Execute: {
    key: 'Execute',
    tone: 'warning',
    colorHex: '#F59E0B',
    colorToken: 'var(--state-warning)',
    colorRgbToken: 'var(--state-warning-rgb)',
    glowClass: 'icon-glow-amber',
  },
  Govern: {
    key: 'Govern',
    tone: 'primary',
    colorHex: '#3B82F6',
    colorToken: 'var(--state-primary)',
    colorRgbToken: 'var(--state-primary-rgb)',
    glowClass: 'icon-glow-blue',
  },
};

export function getEngineSemantic(engineKey: EngineSemanticKey): EngineSemantic {
  return ENGINE_SEMANTICS[engineKey];
}

export const ENGINE_SEMANTIC_KEYS = Object.freeze(
  Object.keys(ENGINE_SEMANTICS) as EngineSemanticKey[],
);
