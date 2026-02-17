import React, { forwardRef, useId } from 'react';
import { cn } from '@/lib/utils';

type ToggleProps = {
  label?: string;
  helper?: string;
  error?: string;
  className?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>;

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  ({ label, helper, error, className, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const helperId = helper ? `${inputId}-helper` : undefined;
    const errorId = error ? `${inputId}-error` : undefined;
    const describedBy = [props['aria-describedby'], errorId ?? helperId]
      .filter(Boolean)
      .join(' ') || undefined;

    return (
      <div className={cn('check-control-wrap', className)}>
        <div className="check-control">
          <span className="toggle">
            <input
              ref={ref}
              id={inputId}
              type="checkbox"
              aria-describedby={describedBy}
              aria-invalid={props['aria-invalid'] ?? Boolean(error)}
              {...props}
            />
            <span className="toggle-track">
              <span className="toggle-thumb" />
            </span>
          </span>
          {label && <label htmlFor={inputId}>{label}</label>}
        </div>
        {error ? (
          <span id={errorId} className="field-error">
            {error}
          </span>
        ) : helper ? (
          <span id={helperId} className="field-helper">
            {helper}
          </span>
        ) : null}
      </div>
    );
  },
);
Toggle.displayName = 'Toggle';
