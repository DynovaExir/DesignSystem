"use client"

import { cn } from "@/lib/utils"
import { toPersianDigits } from "@/lib/utils"
import { Upload, X, RefreshCw, Image as ImageIcon } from "lucide-react"
import { useRef } from "react"
import { Button } from "@/components/ui/button"

interface FileUploadTileProps {
  label: string
  caption: string
  accept: string
  file: File | null
  preview: string | null
  error: string | null
  onFileSelect: (file: File | null) => void
  onClear: () => void
  className?: string
}

export function FileUploadTile({
  label,
  caption,
  accept,
  file,
  preview,
  error,
  onFileSelect,
  onClear,
  className,
}: FileUploadTileProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      onFileSelect(selectedFile)
    }
    // Reset input so same file can be re-selected
    e.target.value = ""
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      onFileSelect(droppedFile)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  // Convert numbers in caption to Persian
  const persianCaption = caption.replace(/\d+/g, (match) => toPersianDigits(match))

  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-label-lg-semibold text-color-text-default">{label}</label>

      {/* Upload area */}
      {!file && !error && (
        <div
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className={cn(
            "flex h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-color-border-default bg-color-bg-subtle transition-colors hover:border-color-border-focus hover:bg-color-interactive-subtle"
          )}
        >
          <Upload className="h-8 w-8 text-color-icon-subtle" />
          <span className="text-body-sm-regular text-color-text-subtle">
            برای انتخاب کلیک یا فایل را رها کنید
          </span>
        </div>
      )}

      {/* Preview state */}
      {file && preview && !error && (
        <div className="flex items-start gap-4 rounded-lg border border-color-border-default bg-color-bg-subtle p-4">
          <div className="relative h-16 w-16 overflow-hidden rounded-md border border-color-border-default bg-color-bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt={label}
              className="h-full w-full object-contain"
            />
          </div>
          <div className="flex-1">
            <p className="text-body-sm-semibold text-color-text-default truncate max-w-[200px]">
              {file.name}
            </p>
            <p className="text-label-lg-regular text-color-text-subtle">
              {toPersianDigits(Math.round(file.size / 1024))} کیلوبایت
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={handleClick} className="h-auto px-2 py-1">
              تعویض
            </Button>
            <Button variant="ghost" onClick={onClear} className="h-auto px-2 py-1 text-color-status-danger">
              حذف
            </Button>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="flex items-center gap-4 rounded-lg border border-color-status-danger bg-color-status-danger-bg p-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-md border border-color-status-danger bg-color-bg-subtle">
            <ImageIcon className="h-8 w-8 text-color-status-danger" />
          </div>
          <div className="flex-1">
            <p className="text-body-sm-semibold text-color-status-danger">{error}</p>
          </div>
          <Button variant="ghost" onClick={handleClick} className="h-auto px-2 py-1">
            <RefreshCw className="h-4 w-4 me-1" />
            تلاش مجدد
          </Button>
        </div>
      )}

      {/* Caption */}
      <p className="text-label-lg-regular text-color-text-subtle">{persianCaption}</p>

      {/* Hidden input */}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="sr-only"
      />
    </div>
  )
}
