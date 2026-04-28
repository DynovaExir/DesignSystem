"use client";

import { Upload, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

interface FileUploadProps {
  label: string;
  accept: string;
  value: File | null;
  previewUrl?: string;
  onChange: (file: File | null) => void;
  error?: string;
}

export function FileUpload({
  label,
  accept,
  value,
  previewUrl,
  onChange,
  error,
}: FileUploadProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onChange(file);
  };

  const handleRemove = () => {
    onChange(null);
  };

  return (
    <div className="space-y-1.5">
      <Label className="text-foreground">{label}</Label>
      <div
        className={cn(
          "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors",
          error
            ? "border-danger-500 bg-danger-100/30"
            : value
            ? "border-success-500 bg-success-100/30"
            : "border-border hover:border-border-strong hover:bg-muted/50"
        )}
      >
        {value && previewUrl ? (
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <img
                src={previewUrl}
                alt="Preview"
                className="h-16 w-16 rounded-lg object-cover"
              />
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="flex items-center gap-1 text-xs text-danger-500 hover:text-danger-500/80"
            >
              <X className="h-3.5 w-3.5" />
              حذف سند
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center gap-2 cursor-pointer">
            <div className="rounded-lg bg-muted p-3">
              <Upload className="h-5 w-5 text-muted-foreground" />
            </div>
            <span className="text-xs text-muted-foreground">آپلود سند</span>
            <input
              type="file"
              accept={accept}
              onChange={handleFileChange}
              className="sr-only"
            />
          </label>
        )}
      </div>
      {error && (
        <div className="flex items-center gap-1.5 text-xs text-danger-500">
          <AlertCircle className="h-3.5 w-3.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
