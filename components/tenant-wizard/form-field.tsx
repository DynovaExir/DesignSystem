"use client";

import { Info, Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FormFieldProps {
  label: string;
  tooltip?: string;
  required?: boolean;
  error?: string;
  success?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export function FormField({
  label,
  tooltip,
  required,
  error,
  success,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex items-center gap-1.5">
        <Label className="text-foreground">
          {label}
          {required && <span className="text-danger-500 mr-0.5">*</span>}
        </Label>
        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <div className="relative">
        {children}
        {(success || error) && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center">
            {success && !error && (
              <Check className="h-4 w-4 text-success-500" />
            )}
            {error && <AlertCircle className="h-4 w-4 text-danger-500" />}
          </div>
        )}
      </div>
      <div className="h-[19px] mt-1">
        {error && (
          <p className="text-xs text-danger-500">{error}</p>
        )}
      </div>
    </div>
  );
}

interface TextFieldProps {
  label: string;
  tooltip?: string;
  required?: boolean;
  error?: string;
  success?: boolean;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function TextField({
  label,
  tooltip,
  required,
  error,
  success,
  value,
  onChange,
  placeholder,
  className,
  disabled,
}: TextFieldProps) {
  return (
    <FormField
      label={label}
      tooltip={tooltip}
      required={required}
      error={error}
      success={success}
      className={className}
    >
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          "pl-10",
          error && "border-danger-500 focus-visible:ring-danger-500",
          success && !error && "border-success-500 focus-visible:ring-success-500"
        )}
      />
    </FormField>
  );
}
