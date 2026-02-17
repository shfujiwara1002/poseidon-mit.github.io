import React, { forwardRef } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const selectCva = cva('select', {
  variants: {
    size: {
      sm: 'select--sm',
      md: '',
      lg: 'select--lg',
    },
  },
  defaultVariants: { size: 'md' },
});

type SelectProps = {
  label?: string;
  helper?: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
} & Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'>;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, helper, error, size = 'md', className, children, ...props }, ref) => {
    return (
      <label className="form-field">
        {label && <span className="field-label">{label}</span>}
        <select
          ref={ref}
          className={cn(selectCva({ size }), error && 'is-error', props.disabled && 'is-disabled', className)}
          {...props}
        >
          {children}
        </select>
        {error ? (
          <span className="field-error">{error}</span>
        ) : helper ? (
          <span className="field-helper">{helper}</span>
        ) : null}
      </label>
    );
  },
);
Select.displayName = 'Select';
