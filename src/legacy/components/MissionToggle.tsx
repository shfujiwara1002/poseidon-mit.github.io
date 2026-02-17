import { cn } from '@/lib/utils';

interface MissionToggleProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  description?: string;
  className?: string;
}

export function MissionToggle({ checked, onChange, label, description, className }: MissionToggleProps) {
  return (
    <button
      type="button"
      className={cn('mission-toggle', className)}
      data-checked={checked ? 'true' : 'false'}
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
    >
      <span className="mission-toggle-copy">
        <strong>{label}</strong>
        {description ? <span>{description}</span> : null}
      </span>
      <span className="mission-toggle-track" aria-hidden="true">
        <span className="mission-toggle-thumb" />
      </span>
    </button>
  );
}
