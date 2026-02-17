import React from 'react';
import { Section } from './Section';

interface MissionMetadataStripProps {
  items: React.ReactNode[];
  className?: string;
  compact?: boolean;
}

/**
 * @deprecated Use `<Section.MetadataStrip>` from `./Section` directly.
 */
export const MissionMetadataStrip: React.FC<MissionMetadataStripProps> = ({
  items,
  className,
  compact = false,
}) => {
  return <Section.MetadataStrip items={items} compact={compact} className={className} />;
};
