import { Section } from './Section';
import type { MissionTone } from './MissionStatusChip';

interface MissionEvidencePanelProps {
  title: string;
  summary: string;
  meta?: string;
  tone?: MissionTone;
  className?: string;
}

/**
 * @deprecated Use `<Section.Evidence>` from `./Section` directly.
 */
export function MissionEvidencePanel({
  title,
  summary,
  meta,
  tone = 'primary',
  className,
}: MissionEvidencePanelProps) {
  return <Section.Evidence title={title} summary={summary} meta={meta} tone={tone} className={className} />;
}
