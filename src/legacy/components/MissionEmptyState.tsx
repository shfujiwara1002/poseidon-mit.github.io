import React from 'react';
import { Section } from './Section';

interface MissionEmptyStateProps {
  title: string;
  description: string;
  className?: string;
  action?: React.ReactNode;
}

/**
 * @deprecated Use `<Section.EmptyState>` from `./Section` directly.
 */
export function MissionEmptyState({ title, description, className, action }: MissionEmptyStateProps) {
  return <Section.EmptyState title={title} description={description} className={className} action={action} />;
}
