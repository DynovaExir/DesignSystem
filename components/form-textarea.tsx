'use client';

import React from 'react';

interface FormTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  helpText?: string;
}

const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, error, helpText, className = '', ...props }, ref) => {
    const textareaId = props.id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="flex flex-col gap-2">
        <label
          htmlFor={textareaId}
          className="text-sm font-medium text-foreground"
        >
          {label}
        </label>
        <textarea
          ref={ref}
          id={textareaId}
          className={`
            w-full px-3 py-2 rounded-md border border-border bg-input text-foreground
            placeholder:text-muted-foreground
            focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background
            disabled:opacity-50 disabled:cursor-not-allowed
            resize-none
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

FormTextarea.displayName = 'FormTextarea';

export { FormTextarea };
