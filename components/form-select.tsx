'use client';

import React from 'react';

interface FormSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  helpText?: string;
  options: Array<{ value: string; label: string }>;
}

const FormSelect = React.forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ label, error, helpText, options, className = '', ...props }, ref) => {
    const selectId = props.id || `select-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="flex flex-col gap-2">
        <label
          htmlFor={selectId}
          className="text-sm font-medium text-foreground"
        >
          {label}
        </label>
        <select
          ref={ref}
          id={selectId}
          className={`
            w-full px-3 py-2 rounded-md border border-border bg-input text-foreground
            focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors
            ${error ? 'border-destructive' : ''}
            ${className}
          `}
          {...props}
        >
          <option value="">{props.placeholder || 'Select an option'}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {helpText && !error && (
          <p className="text-xs text-muted-foreground">{helpText}</p>
        )}
        {error && (
          <p className="text-xs text-destructive" role="alert">{error}</p>
        )}
      </div>
    );
  }
);

FormSelect.displayName = 'FormSelect';

export { FormSelect };
