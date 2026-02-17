import React from 'react';
import { PageShell } from './PageShell';
import type { ScreenContract } from '../contracts/screen-contract';

type AccentColor = 'cyan' | 'teal' | 'violet' | 'amber' | 'blue' | 'red';

type ShellLayout = 'dashboard' | 'engine';
type SemanticMode = 'state-first' | 'engine-first';

export interface KPIConfig {
  label: string;
  value: string;
  delta?: string;
  definition: string;
  accent?: AccentColor;
  sparklineData?: Array<{ value: number }>;
  sparklineColor?: string;
}

export interface HeroConfig {
  kicker: string;
  headline: string;
  subline: string;
  proofLine: { claim: string; evidence: string; source: string };
  heroAction?: {
    label: string;
    text: string;
    cta?: { label: string; to: string };
  };
  freshness: Date;
  kpis: KPIConfig[];
}

export interface CommandCenterShellProps {
  slug: string;
  contract: ScreenContract;
  hero: HeroConfig;
  primaryFeed: React.ReactNode;
  decisionRail?: React.ReactNode;
  rail?: React.ReactNode;
  governControls?: React.ReactNode;
  fullWidth?: boolean;
  layout?: ShellLayout;
  semanticMode?: SemanticMode;
}

/**
 * @deprecated Use `PageShell` from `./PageShell` instead.
 * CommandCenterShell is now a thin wrapper that delegates to PageShell.
 * It will be removed in a future phase.
 */
export function CommandCenterShell({
  slug,
  contract,
  hero,
  primaryFeed,
  decisionRail,
  rail,
  governControls,
  fullWidth = false,
  layout = 'engine',
  semanticMode = 'state-first',
}: CommandCenterShellProps) {
  return (
    <PageShell
      slug={slug}
      contract={contract}
      hero={hero}
      heroVariant="command"
      primaryFeed={primaryFeed}
      decisionRail={decisionRail}
      rail={rail}
      governControls={governControls}
      fullWidth={fullWidth}
      layout={layout}
      semanticMode={semanticMode}
    />
  );
}
