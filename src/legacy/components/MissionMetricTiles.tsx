import { Section, type MetricTileItem } from './Section';

export type { MetricTileItem as MissionMetricTileItem };

interface MissionMetricTilesProps {
  items: MetricTileItem[];
  className?: string;
}

/**
 * @deprecated Use `<Section.MetricTiles>` from `./Section` directly.
 */
export function MissionMetricTiles({ items, className }: MissionMetricTilesProps) {
  return <Section.MetricTiles items={items} className={className} />;
}
