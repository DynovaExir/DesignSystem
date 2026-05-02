'use client';

import React, { useRef } from 'react';

interface FormFileUploadProps {
  label: string;
  accept?: string;
  maxSize?: number;
  error?: string;
  helpText?: string;
  value?: File | null;
  onChange?: (file: File | null) => void;
  disabled?: boolean;
}

const FormFileUpload = React.forwardRef<HTMLInputElement, FormFileUploadProps>(
  ({ label, accept, maxSize = 2 * 1024 * 1024, error, helpText, value, onChange, disabled }, ref) => {
    const fileInputId = `file-${Math.random().toString(36).substr(2, 9)}`;
    const dragRef = useRef<HTMLDivElement>(null);

    const handleFileChange = (file: File | null) => {
      if (file && maxSize && file.size > maxSize) {
        return;
      }
      onChange?.(file);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      handleFileChange(file);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      dragRef.current?.classList.add('border-primary', 'bg-primary/5');
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      dragRef.current?.classList.remove('border-primary', 'bg-primary/5');
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      dragRef.current?.classList.remove('border-primary', 'bg-primary/5');
      const file = e.dataTransfer.files?.[0] || null;
      handleFileChange(file);
    };

    return (
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground">{label}</label>
        <div
          ref={dragRef}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative rounded-md border-2 border-dashed border-border p-6 transition-colors
            ${!disabled && 'cursor-pointer hover:border-primary/50'}
            ${error ? 'border-destructive' : ''}
          `}
        >
          <input
            ref={ref}
            id={fileInputId}
            type="file"
            accept={accept}
            onChange={handleInputChange}
            disabled={disabled}
            className="sr-only"
          />
          <label htmlFor={fileInputId} className={!disabled ? 'cursor-pointer' : ''}>
            <div className="flex flex-col items-center gap-2 text-center">
              <svg
                className="w-8 h-8 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {value ? value.name : 'Click to upload or drag and drop'}
                </p>
                {!value && helpText && (
                  <p className="text-xs text-muted-foreground">{helpText}</p>
                )}
              </div>
            </div>
          </label>
        </div>
        {error && (
          <p className="text-xs text-destructive" role="alert">{error}</p>
        )}
      </div>
    );
  }
);

FormFileUpload.displayName = 'FormFileUpload';

export { FormFileUpload };
