import React, { forwardRef, useId } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const inputCva = cva('input', {
  variants: {
    size: {
      sm: 'input--sm',
      md: '',
      lg: 'input--lg',
    },
  },
  defaultVariants: { size: 'md' },
});

type TextInputProps = {
  label?: string;
  helper?: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>;

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, helper, error, size = 'md', className, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const helperId = helper ? `${inputId}-helper` : undefined;
    const errorId = error ? `${inputId}-error` : undefined;

    return (
      <div className="form-field">
        {label && (
          <label className="field-label" htmlFor={inputId}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(inputCva({ size }), error && 'is-error', props.disabled && 'is-disabled', className)}
          aria-describedby={errorId ?? helperId}
          aria-invalid={Boolean(error)}
          {...props}
        />
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
TextInput.displayName = 'TextInput';
