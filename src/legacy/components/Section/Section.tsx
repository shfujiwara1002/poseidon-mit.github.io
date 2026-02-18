import React, { createContext, useContext, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { MissionStatusChip, type MissionTone } from '../MissionStatusChip';

// ── Section Context ──────────────────────────────────────────
interface SectionContextValue {
  tone: MissionTone;
}

const SectionContext = createContext<SectionContextValue>({
  tone: 'primary',
});

export function useSection() {
  return useContext(SectionContext);
}

// ── CVA Definitions ──────────────────────────────────────────
const sectionCva = cva('', {
  variants: {
    variant: {
      default: '',
      detail: 'mission-detail-section',
      dashboard: 'dashboard-section',
      settings: 'settings-section',
    },
  },
  defaultVariants: { variant: 'default' },
});

type SectionCvaProps = VariantProps<typeof sectionCva>;

// ── Section Root ─────────────────────────────────────────────
export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  variant?: NonNullable<SectionCvaProps['variant']>;
  tone?: MissionTone;
  as?: 'section' | 'div' | 'article';
}

const SectionRoot = forwardRef<HTMLElement, SectionProps>(
  ({ variant = 'default', tone = 'primary', as: Tag = 'section', className, children, ...props }, ref) => {
    return (
      <SectionContext.Provider value={{ tone }}>
        <Tag
          ref={ref as never}
          className={cn(sectionCva({ variant }), className)}
          data-tone={tone}
          {...props}
        >
          {children}
        </Tag>
      </SectionContext.Provider>
    );
  },
);
SectionRoot.displayName = 'Section';

// ── Section.Header ───────────────────────────────────────────
export interface SectionHeaderProps extends React.HTMLAttributes<HTMLElement> {
  title: string;
  message?: string;
  contextCue?: string;
  icon?: React.ReactNode;
  right?: React.ReactNode;
}

const SectionHeader = forwardRef<HTMLElement, SectionHeaderProps>(
  ({ title, message, contextCue, icon, right, className, ...props }, ref) => {
    return (
      <header
        ref={ref as never}
        data-widget="MissionSectionHeader"
        className={cn('mission-section-header', className)}
        {...props}
      >
        <div className="mission-section-header-top">
          <div className="mission-section-header-title">
            {icon && <span className="mission-section-header-icon">{icon}</span>}
            <strong>{title}</strong>
          </div>
          {right}
        </div>
        {message && <p className="mission-section-header-message">{message}</p>}
        {contextCue && <span className="mission-section-header-cue">{contextCue}</span>}
      </header>
    );
  },
);
SectionHeader.displayName = 'Section.Header';

// ── Section.DataRows ─────────────────────────────────────────
export interface DataRowItem {
  id: string;
  title: string;
  value?: string;
  detail?: string;
  meta?: string;
  tone?: MissionTone;
}

export interface SectionDataRowsProps extends React.HTMLAttributes<HTMLDivElement> {
  items: DataRowItem[];
}

const SectionDataRows = forwardRef<HTMLDivElement, SectionDataRowsProps>(
  ({ items, className, ...props }, ref) => {
    const { tone: sectionTone } = useContext(SectionContext);
    return (
      <div ref={ref} className={cn('mission-data-rows', className)} {...props}>
        {items.map((item) => {
          const tone = item.tone ?? sectionTone;
          return (
            <article key={item.id} className="mission-data-row" data-tone={tone}>
              <div className="mission-data-row-main">
                <strong>{item.title}</strong>
                {item.detail ? <span>{item.detail}</span> : null}
              </div>
              <div className="mission-data-row-side">
                {item.value ? <em>{item.value}</em> : null}
                {item.meta ? <MissionStatusChip tone={tone} label={item.meta} /> : null}
              </div>
            </article>
          );
        })}
      </div>
    );
  },
);
SectionDataRows.displayName = 'Section.DataRows';

// ── Section.ActionList ───────────────────────────────────────
export interface ActionListItem {
  title: string;
  meta?: string;
  tone?: MissionTone;
}

export interface SectionActionListProps extends React.HTMLAttributes<HTMLUListElement> {
  items: ActionListItem[];
}

const SectionActionList = forwardRef<HTMLUListElement, SectionActionListProps>(
  ({ items, className, ...props }, ref) => {
    const { tone: sectionTone } = useContext(SectionContext);
    return (
      <ul
        ref={ref}
        className={cn('dashboard-action-list', className)}
        data-widget="MissionActionList"
        {...props}
      >
        {items.map((item) => {
          const tone = item.tone ?? sectionTone;
          return (
            <li key={`${item.title}-${item.meta ?? ''}`} data-tone={tone}>
              <div className="dashboard-action-header">
                <strong>{item.title}</strong>
                {item.meta ? <MissionStatusChip tone={tone} label={item.meta} /> : null}
              </div>
            </li>
          );
        })}
      </ul>
    );
  },
);
SectionActionList.displayName = 'Section.ActionList';

// ── Section.MetricTiles ──────────────────────────────────────
export interface MetricTileItem {
  id: string;
  label: string;
  value: string;
  meta?: string;
  tone?: MissionTone;
}

export interface SectionMetricTilesProps extends React.HTMLAttributes<HTMLDivElement> {
  items: MetricTileItem[];
}

const SectionMetricTiles = forwardRef<HTMLDivElement, SectionMetricTilesProps>(
  ({ items, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('mission-metric-tiles', className)} {...props}>
        {items.map((item) => (
          <article key={item.id} className="mission-metric-tile" data-tone={item.tone ?? 'primary'}>
            <small>{item.label}</small>
            <strong>{item.value}</strong>
            {item.meta ? <span>{item.meta}</span> : null}
          </article>
        ))}
      </div>
    );
  },
);
SectionMetricTiles.displayName = 'Section.MetricTiles';

// ── Section.Evidence ─────────────────────────────────────────
export interface SectionEvidenceProps extends React.HTMLAttributes<HTMLElement> {
  title: string;
  summary: string;
  meta?: string;
  tone?: MissionTone;
}

const SectionEvidence = forwardRef<HTMLElement, SectionEvidenceProps>(
  ({ title, summary, meta, tone: toneProp, className, ...props }, ref) => {
    const { tone: sectionTone } = useContext(SectionContext);
    const tone = toneProp ?? sectionTone;
    return (
      <section
        ref={ref as never}
        className={cn('mission-evidence-panel', className)}
        data-tone={tone}
        {...props}
      >
        <div className="mission-evidence-panel-header">
          <strong>{title}</strong>
          {meta ? <MissionStatusChip tone={tone} label={meta} /> : null}
        </div>
        <p>{summary}</p>
      </section>
    );
  },
);
SectionEvidence.displayName = 'Section.Evidence';

// ── Section.EmptyState ───────────────────────────────────────
export interface SectionEmptyStateProps extends React.HTMLAttributes<HTMLElement> {
  title: string;
  description: string;
  action?: React.ReactNode;
  illustration?: React.ReactNode;
}

const SectionEmptyState = forwardRef<HTMLElement, SectionEmptyStateProps>(
  ({ title, description, action, illustration, className, ...props }, ref) => {
    return (
      <article ref={ref as never} className={cn('mission-empty-state', className)} {...props}>
        <div className="mission-empty-state-illustration" aria-hidden="true">
          {illustration ?? (
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
              <circle cx="12" cy="12" r="2.5" fill="currentColor" />
              <circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" strokeOpacity="0.55" strokeWidth="1.5" />
            </svg>
          )}
        </div>
        <strong>{title}</strong>
        <p>{description}</p>
        {action ? <div className="mission-empty-state-action">{action}</div> : null}
      </article>
    );
  },
);
SectionEmptyState.displayName = 'Section.EmptyState';

// ── Section.MetadataStrip ────────────────────────────────────
export interface SectionMetadataStripProps extends React.HTMLAttributes<HTMLDivElement> {
  items: React.ReactNode[];
  compact?: boolean;
}

const SectionMetadataStrip = forwardRef<HTMLDivElement, SectionMetadataStripProps>(
  ({ items, compact = false, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('entry-chip-row', compact && 'entry-chip-row--compact', className)}
        data-widget="MissionMetadataStrip"
        {...props}
      >
        {items.map((item, index) => (
          <span key={`mission-meta-${index}`}>{item}</span>
        ))}
      </div>
    );
  },
);
SectionMetadataStrip.displayName = 'Section.MetadataStrip';

// ── Section.Actions ──────────────────────────────────────────
export interface SectionActionsProps extends React.HTMLAttributes<HTMLDivElement> {}

const SectionActions = forwardRef<HTMLDivElement, SectionActionsProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('mission-dual-actions', className)} {...props}>
        {children}
      </div>
    );
  },
);
SectionActions.displayName = 'Section.Actions';

// ── Compound Export ──────────────────────────────────────────
export const Section = Object.assign(SectionRoot, {
  Header: SectionHeader,
  DataRows: SectionDataRows,
  ActionList: SectionActionList,
  MetricTiles: SectionMetricTiles,
  Evidence: SectionEvidence,
  EmptyState: SectionEmptyState,
  MetadataStrip: SectionMetadataStrip,
  Actions: SectionActions,
});
