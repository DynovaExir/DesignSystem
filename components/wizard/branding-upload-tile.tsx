"use client"

import { useCallback, useState, useRef } from "react"
import { useLocale } from "@/lib/contexts/locale-context"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Upload, X, RefreshCw, Image as ImageIcon, FileImage } from "lucide-react"

interface BrandingUploadTileProps {
  type: "logo" | "favicon"
  file: File | null
  onFileChange: (file: File | null) => void
  error?: string
  maxSize: number // in bytes
  minDimensions: { width: number; height: number }
  maxDimensions: { width: number; height: number }
  acceptedTypes: string[]
  className?: string
}

export function BrandingUploadTile({
  type,
  file,
  onFileChange,
  error,
  maxSize,
  minDimensions,
  maxDimensions,
  acceptedTypes,
  className,
}: BrandingUploadTileProps) {
  const { t } = useLocale()
  const [isDragging, setIsDragging] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [localError, setLocalError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const config = type === "logo" ? t.branding.logo : t.branding.favicon
  const description = type === "logo" ? t.branding.logoDesc : t.branding.faviconDesc

  const validateFile = useCallback(
    async (selectedFile: File): Promise<string | null> => {
      // Check file type
      const isValidType = acceptedTypes.some((acceptedType) => {
        if (acceptedType.includes("*")) {
          const baseType = acceptedType.split("/")[0]
          return selectedFile.type.startsWith(baseType)
        }
        return selectedFile.type === acceptedType
      })

      if (!isValidType) {
        return type === "logo"
          ? t.validation.logoWrongType
          : t.validation.faviconWrongType
      }

      // Check file size
      if (selectedFile.size > maxSize) {
        return type === "logo"
          ? t.validation.logoTooLarge
          : t.validation.faviconTooLarge
      }

      // Check dimensions for images (not SVG)
      if (!selectedFile.type.includes("svg")) {
        return new Promise((resolve) => {
          const img = new window.Image()
          img.onload = () => {
            URL.revokeObjectURL(img.src)
            if (
              img.width < minDimensions.width ||
              img.height < minDimensions.height ||
              img.width > maxDimensions.width ||
              img.height > maxDimensions.height
            ) {
              resolve(
                type === "logo"
                  ? t.validation.logoDimensions
                  : t.validation.faviconDimensions
              )
            } else {
              resolve(null)
            }
          }
          img.onerror = () => {
            URL.revokeObjectURL(img.src)
            resolve(t.validation.logoWrongType)
          }
          img.src = URL.createObjectURL(selectedFile)
        })
      }

      return null
    },
    [acceptedTypes, maxSize, minDimensions, maxDimensions, type, t.validation]
  )

  const handleFile = useCallback(
    async (selectedFile: File) => {
      const validationError = await validateFile(selectedFile)
      if (validationError) {
        setLocalError(validationError)
        return
      }

      setLocalError(null)
      onFileChange(selectedFile)

      // Create preview
      const url = URL.createObjectURL(selectedFile)
      setPreviewUrl(url)
    },
    [validateFile, onFileChange]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragging(false)

      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile) {
        handleFile(droppedFile)
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
      const selectedFile = e.target.files?.[0]
      if (selectedFile) {
        handleFile(selectedFile)
      }
    },
    [handleFile]
  )

  const handleRemove = useCallback(() => {
    onFileChange(null)
    setPreviewUrl(null)
    setLocalError(null)
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }, [onFileChange])

  const handleReplace = useCallback(() => {
    inputRef.current?.click()
  }, [])

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const displayError = localError || error

  return (
    <div className={cn("flex flex-col", className)}>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !file && inputRef.current?.click()}
        className={cn(
          "relative flex flex-col items-center justify-center rounded-md border-2 border-dashed p-6 transition-colors cursor-pointer",
          isDragging && "border-primary bg-primary/5",
          !isDragging && !file && "border-border hover:border-primary/50",
          file && "border-primary/30 bg-muted/30 cursor-default",
          displayError && "border-destructive"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={acceptedTypes.join(",")}
          onChange={handleInputChange}
          className="sr-only"
          aria-label={config}
        />

        {file && previewUrl ? (
          <div className="flex flex-col items-center gap-4 w-full">
            {/* Preview */}
            <div className="relative h-20 w-20 rounded-md border border-border bg-background p-2 flex items-center justify-center">
              {file.type.includes("svg") ? (
                <FileImage className="h-10 w-10 text-muted-foreground" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewUrl}
                  alt={config}
                  className="max-h-full max-w-full object-contain"
                />
              )}
            </div>

            {/* File info */}
            <div className="text-center">
              <p className="text-sm font-medium truncate max-w-[200px]">
                {file.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(file.size)}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  handleReplace()
                }}
              >
                <RefreshCw className="h-4 w-4 me-1" />
                {t.replace}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemove()
                }}
              >
                <X className="h-4 w-4 me-1" />
                {t.remove}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-center">
            {type === "logo" ? (
              <ImageIcon className="h-10 w-10 text-muted-foreground" />
            ) : (
              <Upload className="h-10 w-10 text-muted-foreground" />
            )}
            <div>
              <p className="text-sm font-medium">{config}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {t.branding.dragDrop}{" "}
                <span className="text-primary">{t.branding.clickToBrowse}</span>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-xs text-muted-foreground mt-2">{description}</p>

      {/* Error */}
      {displayError && (
        <p className="text-xs text-destructive mt-1">{displayError}</p>
      )}
    </div>
  )
}
