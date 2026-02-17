import { PageShell } from './PageShell';
import type { HeroConfig } from './PageShell';
import { getRouteScreenContract } from '../contracts/route-screen-contracts';
import type { ScreenContract } from '../contracts/screen-contract';

export type { HeroConfig };

type EngineSlug = 'protect' | 'grow' | 'execute' | 'govern' | 'settings';

export interface EnginePageShellProps {
  slug: EngineSlug;
  heroConfig: HeroConfig;
  mainContent: React.ReactNode;
  sideContent?: React.ReactNode;
  railContent?: React.ReactNode;
  fullWidth?: boolean;
  contract?: ScreenContract;
}

/**
 * @deprecated Use `PageShell` from `./PageShell` instead.
 * EnginePageShell is now a thin wrapper that delegates to PageShell.
 * It will be removed in a future phase.
 */
export function EnginePageShell({
  slug,
  heroConfig,
  mainContent,
  sideContent,
  railContent,
  fullWidth = false,
  contract,
}: EnginePageShellProps) {
  const resolvedContract = contract ?? getRouteScreenContract(slug);

  return (
    <PageShell
      slug={slug}
      contract={resolvedContract}
      hero={{
        ...heroConfig,
        proofLine: heroConfig.proofLine ?? {
          claim: 'Engine status',
          evidence: 'Legacy shell fallback',
          source: 'EnginePageShell',
        },
      }}
      heroVariant="command"
      primaryFeed={mainContent}
      decisionRail={sideContent}
      rail={railContent}
      fullWidth={fullWidth}
      layout="engine"
    />
  );
}
