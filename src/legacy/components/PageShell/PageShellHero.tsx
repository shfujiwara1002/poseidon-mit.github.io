import type { HeroVariant } from './PageShell';
import { HeroCommand } from './variants/HeroCommand';
import { HeroFocused } from './variants/HeroFocused';
import { HeroAnalytical } from './variants/HeroAnalytical';
import { HeroEditorial } from './variants/HeroEditorial';
import { HeroMinimal } from './variants/HeroMinimal';

const VARIANT_MAP: Record<HeroVariant, React.ComponentType> = {
  command: HeroCommand,
  focused: HeroFocused,
  analytical: HeroAnalytical,
  editorial: HeroEditorial,
  minimal: HeroMinimal,
};

export function PageShellHero({ variant }: { variant: HeroVariant }) {
  const HeroComponent = VARIANT_MAP[variant];
  return <HeroComponent />;
}
