import { Section, type DataRowItem } from './Section';

export type { DataRowItem as MissionDataRowItem };

interface MissionDataRowsProps {
  items: DataRowItem[];
  className?: string;
}

/**
 * @deprecated Use `<Section.DataRows>` from `./Section` directly.
 */
export function MissionDataRows({ items, className }: MissionDataRowsProps) {
  return <Section.DataRows items={items} className={className} />;
}
