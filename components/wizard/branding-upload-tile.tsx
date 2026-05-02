"use client"

import { useCallback, useRef, useState } from "react"
import { useT } from "@/lib/locale-context"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Upload, X, RefreshCw, Image as ImageIcon } from "lucide-react"

interface BrandingUploadTileProps {
  label: string
  hint: string
  accept: string
  maxSize: number
  minWidth?: number
  minHeight?: number
  maxWidth?: number
  maxHeight?: number
  value: { file: File | null; preview: string | null } | null
  onChange: (value: { file: File; preview: string } | null) => void
  error?: string
}

export function BrandingUploadTile({
  label,
  hint,
  accept,
  maxSize,
  minWidth = 16,
  minHeight = 16,
  maxWidth = 2048,
  maxHeight = 2048,
  value,
  onChange,
  error,
}: BrandingUploadTileProps) {
  const t = useT()
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  const validateFile = useCallback(
    async (file: File): Promise<string | null> => {
      // Check file size
      if (file.size > maxSize) {
        return t.validation.fileSize
      }

      // Check file type
      const allowedTypes = accept.split(",").map((t) => t.trim())
      const isValidType = allowedTypes.some((type) => {
        if (type.startsWith(".")) {
          return file.name.toLowerCase().endsWith(type)
        }
        return file.type === type
      })
      if (!isValidType) {
        return t.validation.fileType
      }

      // Check image dimensions (skip for SVG)
      if (!file.type.includes("svg")) {
        return new Promise((resolve) => {
          const img = new globalThis.Image()
          img.onload = () => {
            URL.revokeObjectURL(img.src)
            if (
              img.width < minWidth ||
              img.height < minHeight ||
              img.width > maxWidth ||
              img.height > maxHeight
            ) {
              resolve(t.validation.fileDimensions)
            } else {
              resolve(null)
            }
          }
          img.onerror = () => {
            URL.revokeObjectURL(img.src)
            resolve(t.validation.fileType)
          }
          img.src = URL.createObjectURL(file)
        })
      }

      return null
    },
    [accept, maxSize, minWidth, minHeight, maxWidth, maxHeight, t.validation]
  )

  const handleFile = useCallback(
    async (file: File) => {
      const error = await validateFile(file)
      if (error) {
        setValidationError(error)
        return
      }

      setValidationError(null)
      const preview = URL.createObjectURL(file)
      onChange({ file, preview })
    },
    [validateFile, onChange]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragging(false)

      const file = e.dataTransfer.files[0]
      if (file) {
        handleFile(file)
      }
    },
    [handleFile]
  )

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        handleFile(file)
      }
    },
    [handleFile]
  )

  const handleRemove = useCallback(() => {
    if (value?.preview) {
      URL.revokeObjectURL(value.preview)
    }
    onChange(null)
    setValidationError(null)
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }, [value, onChange])

  const handleReplace = useCallback(() => {
    inputRef.current?.click()
  }, [])

  const displayError = error || validationError

  return (
    <div className="space-y-2">
      <label className="text-label-lg-semibold text-foreground">{label}</label>

      <div
        className={cn(
          "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors",
          isDragging && "border-primary bg-primary-100/20",
          displayError && "border-danger-500",
          !isDragging && !displayError && "border-border hover:border-primary/50"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="sr-only"
          id={`upload-${label}`}
        />

        {value?.preview ? (
          <div className="flex flex-col items-center gap-4">
            {/* Preview */}
            <div className="relative h-24 w-24 overflow-hidden rounded-md bg-muted">
              <img
                src={value.preview}
                alt=""
                className="h-full w-full object-contain"
              />
            </div>

            {/* File info */}
            {value.file && (
              <p className="text-label-lg-regular text-muted-foreground">
                {value.file.name} ({(value.file.size / 1024).toFixed(1)} KB)
              </p>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="tertiary"
                size="sm"
                onClick={handleReplace}
              >
                <RefreshCw className="h-4 w-4" />
                {t.wizard.branding.logo.replace}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemove}
              >
                <X className="h-4 w-4" />
                {t.wizard.branding.logo.remove}
              </Button>
            </div>
          </div>
        ) : (
          <label
            htmlFor={`upload-${label}`}
            className="flex cursor-pointer flex-col items-center gap-3"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Upload className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="text-body-sm-regular text-muted-foreground">
                {t.wizard.branding.logo.dragDrop}{" "}
                <span className="text-primary">{t.wizard.branding.logo.browse}</span>
              </p>
            </div>
          </label>
        )}
      </div>

      {/* Hint or Error */}
      {displayError ? (
        <p className="text-label-lg-regular text-danger-500">{displayError}</p>
      ) : (
        <p className="text-label-lg-regular text-muted-foreground">{hint}</p>
      )}
    </div>
  )
}
