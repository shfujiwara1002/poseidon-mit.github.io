import React from 'react';
import { Section } from './Section';
import type { MissionTone } from './MissionStatusChip';

interface MissionActionItem {
  title: string;
  meta?: string;
  tone?: MissionTone;
}

interface MissionActionListProps {
  items: MissionActionItem[];
}

/**
 * @deprecated Use `<Section.ActionList>` from `./Section` directly.
 */
export const MissionActionList: React.FC<MissionActionListProps> = ({ items }) => {
  return <Section.ActionList items={items} />;
};
