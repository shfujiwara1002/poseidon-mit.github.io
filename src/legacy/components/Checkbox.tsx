import React, { forwardRef, useId } from 'react';
import { cn } from '@/lib/utils';

type CheckboxProps = {
  label: string;
  helper?: string;
  error?: string;
  className?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>;

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
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
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            aria-describedby={describedBy}
            aria-invalid={props['aria-invalid'] ?? Boolean(error)}
            {...props}
          />
          <label htmlFor={inputId}>{label}</label>
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
Checkbox.displayName = 'Checkbox';
