import React from 'react';

type TextareaProps = {
  label?: string;
  helper?: string;
  error?: string;
  className?: string;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea: React.FC<TextareaProps> = ({ label, helper, error, className, ...props }) => {
  const inputClass = ['textarea', error ? 'is-error' : '', props.disabled ? 'is-disabled' : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <label className="form-field">
      {label && <span className="field-label">{label}</span>}
      <textarea className={inputClass} {...props} />
      {error ? <span className="field-error">{error}</span> : helper ? <span className="field-helper">{helper}</span> : null}
    </label>
  );
};
