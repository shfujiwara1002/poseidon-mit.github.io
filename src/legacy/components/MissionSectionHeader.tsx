import React from 'react';
import { Section } from './Section';

interface MissionSectionHeaderProps {
  title: string;
  /** One-screen message capturing the section's purpose (Pillar 2, Rule 1) */
  message?: string;
  /** Transition intent explaining why to navigate next (Rule 8) */
  contextCue?: string;
  /** Optional icon rendered before the title */
  icon?: React.ReactNode;
  /** Optional right-aligned content (e.g. status chips) */
  right?: React.ReactNode;
}

/**
 * SectionHeader — screen/section header with mission context.
 * Implements "One Screen, One Message" principle and "Transition Intent" rule.
 *
 * @deprecated Use `<Section.Header>` from `./Section` directly.
 */
export const MissionSectionHeader: React.FC<MissionSectionHeaderProps> = (props) => {
  return <Section.Header {...props} />;
};
