'use client';

import React from 'react';

interface FormInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helpText?: string;
  indicator?: React.ReactNode;
  isRtl?: boolean;
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, helpText, indicator, isRtl, className = '', ...props }, ref) => {
    const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-foreground"
          >
            {label}
          </label>
          {indicator}
        </div>
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full px-3 py-2 rounded-md border border-border bg-input text-foreground
            placeholder:text-muted-foreground
            focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors
            ${error ? 'border-destructive' : ''}
            ${className}
          `}
          {...props}
        />
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

FormInput.displayName = 'FormInput';

export { FormInput };
