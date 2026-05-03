"use client"

import { useCallback } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FieldWrapper } from "@/components/wizard/field-wrapper"
import { FileUploadTile } from "@/components/wizard/file-upload-tile"
import { Banner } from "@/components/wizard/banner"
import type { BrandingStepData } from "@/lib/wizard-types"

interface StepBrandingProps {
  data: BrandingStepData
  onChange: (data: BrandingStepData) => void
  showFileNotice?: boolean
}

// File validation limits
const LOGO_MAX_SIZE = 500 * 1024 // 500KB
const LOGO_MIN_DIM = 128
const LOGO_MAX_DIM = 2048
const FAVICON_MAX_SIZE = 100 * 1024 // 100KB
const FAVICON_MIN_DIM = 16
const FAVICON_MAX_DIM = 512

export function StepBranding({ data, onChange, showFileNotice }: StepBrandingProps) {
  // Validate and process logo file
  const handleLogoSelect = useCallback(
    (file: File | null) => {
      if (!file) {
        onChange({ ...data, logo: null, logoPreview: null, logoError: null })
        return
      }

      // Check file type
      const validTypes = ["image/png", "image/svg+xml"]
      if (!validTypes.includes(file.type)) {
        onChange({
          ...data,
          logo: null,
          logoPreview: null,
          logoError: "فرمت نامعتبر. فقط PNG یا SVG مجاز است.",
        })
        return
      }

      // Check file size
      if (file.size > LOGO_MAX_SIZE) {
        onChange({
          ...data,
          logo: null,
          logoPreview: null,
          logoError: `حجم فایل بیش از حد مجاز است. حداکثر ۵۰۰ کیلوبایت.`,
        })
        return
      }

      // Check dimensions for non-SVG
      if (file.type === "image/png") {
        const reader = new FileReader()
        reader.onload = (e) => {
          const img = new window.Image()
          img.crossOrigin = "anonymous"
          img.onload = () => {
            if (
              img.width < LOGO_MIN_DIM ||
              img.height < LOGO_MIN_DIM ||
              img.width > LOGO_MAX_DIM ||
              img.height > LOGO_MAX_DIM
            ) {
              onChange({
                ...data,
                logo: null,
                logoPreview: null,
                logoError: `ابعاد نامعتبر. ابعاد باید بین ۱۲۸×۱۲۸ تا ۲۰۴۸×۲۰۴۸ باشد.`,
              })
            } else {
              onChange({
                ...data,
                logo: file,
                logoPreview: e.target?.result as string,
                logoError: null,
              })
            }
          }
          img.onerror = () => {
            onChange({
              ...data,
              logo: null,
              logoPreview: null,
              logoError: "خطا در خواندن تصویر.",
            })
          }
          img.src = e.target?.result as string
        }
        reader.readAsDataURL(file)
      } else {
        // SVG - create preview
        const reader = new FileReader()
        reader.onload = (e) => {
          // Simple unsafe SVG check - look for script tags
          const content = e.target?.result as string
          if (content.toLowerCase().includes("<script")) {
            onChange({
              ...data,
              logo: null,
              logoPreview: null,
              logoError: "SVG ناامن شناسایی شد.",
            })
            return
          }
          onChange({
            ...data,
            logo: file,
            logoPreview: e.target?.result as string,
            logoError: null,
          })
        }
        reader.readAsDataURL(file)
      }
    },
    [data, onChange]
  )

  // Validate and process favicon file
  const handleFaviconSelect = useCallback(
    (file: File | null) => {
      if (!file) {
        onChange({ ...data, favicon: null, faviconPreview: null, faviconError: null })
        return
      }

      // Check file type
      const validTypes = ["image/png", "image/x-icon", "image/vnd.microsoft.icon", "image/svg+xml"]
      if (!validTypes.includes(file.type)) {
        onChange({
          ...data,
          favicon: null,
          faviconPreview: null,
          faviconError: "فرمت نامعتبر. فقط PNG، ICO یا SVG مجاز است.",
        })
        return
      }

      // Check file size
      if (file.size > FAVICON_MAX_SIZE) {
        onChange({
          ...data,
          favicon: null,
          faviconPreview: null,
          faviconError: `حجم فایل بیش از حد مجاز است. حداکثر ۱۰۰ کیلوبایت.`,
        })
        return
      }

      // Check dimensions for PNG
      if (file.type === "image/png") {
        const reader = new FileReader()
        reader.onload = (e) => {
          const img = new window.Image()
          img.crossOrigin = "anonymous"
          img.onload = () => {
            if (
              img.width < FAVICON_MIN_DIM ||
              img.height < FAVICON_MIN_DIM ||
              img.width > FAVICON_MAX_DIM ||
              img.height > FAVICON_MAX_DIM
            ) {
              onChange({
                ...data,
                favicon: null,
                faviconPreview: null,
                faviconError: `ابعاد نامعتبر. ابعاد باید بین ۱۶×۱۶ تا ۵۱۲×۵۱۲ باشد.`,
              })
            } else {
              onChange({
                ...data,
                favicon: file,
                faviconPreview: e.target?.result as string,
                faviconError: null,
              })
            }
          }
          img.src = e.target?.result as string
        }
        reader.readAsDataURL(file)
      } else {
        // ICO or SVG - just create preview
        const reader = new FileReader()
        reader.onload = (e) => {
          onChange({
            ...data,
            favicon: file,
            faviconPreview: e.target?.result as string,
            faviconError: null,
          })
        }
        reader.readAsDataURL(file)
      }
    },
    [data, onChange]
  )

  return (
    <div className="space-y-6">
      <h2 className="text-heading-lg text-color-text-default">برندینگ</h2>

      {/* File re-selection notice after draft restore */}
      {showFileNotice && (
        <Banner variant="info">
          فایل‌های برندینگ پس از بازگشت باید دوباره انتخاب شوند.
        </Banner>
      )}

      <div className="space-y-6">
        {/* Logo Upload */}
        <FileUploadTile
          label="لوگو"
          caption="PNG یا SVG، حداکثر 500 کیلوبایت، ابعاد بین 128×128 تا 2048×2048"
          accept="image/png,image/svg+xml"
          file={data.logo}
          preview={data.logoPreview}
          error={data.logoError}
          onFileSelect={handleLogoSelect}
          onClear={() =>
            onChange({ ...data, logo: null, logoPreview: null, logoError: null })
          }
        />

        {/* Favicon Upload */}
        <FileUploadTile
          label="فاوآیکون"
          caption="PNG، ICO یا SVG، حداکثر 100 کیلوبایت، ابعاد بین 16×16 تا 512×512"
          accept="image/png,image/x-icon,image/vnd.microsoft.icon,image/svg+xml"
          file={data.favicon}
          preview={data.faviconPreview}
          error={data.faviconError}
          onFileSelect={handleFaviconSelect}
          onClear={() =>
            onChange({ ...data, favicon: null, faviconPreview: null, faviconError: null })
          }
        />

        {/* Default Locale */}
        <FieldWrapper label="زبان پیش‌فرض" htmlFor="default_locale">
          <Select
            value={data.default_locale}
            onValueChange={(value) =>
              onChange({ ...data, default_locale: value as "fa" | "en" })
            }
          >
            <SelectTrigger id="default_locale">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fa">فارسی</SelectItem>
              <SelectItem value="en">English</SelectItem>
            </SelectContent>
          </Select>
        </FieldWrapper>
      </div>
    </div>
  )
}
