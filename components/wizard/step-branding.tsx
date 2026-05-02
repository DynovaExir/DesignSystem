"use client"

import { useEffect } from "react"
import { useLocale } from "@/lib/contexts/locale-context"
import { useWizardStore } from "@/lib/stores/wizard-store"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { BrandingUploadTile } from "./branding-upload-tile"
import type { LocaleType } from "@/lib/schemas"

interface StepBrandingProps {
  onValidChange: (isValid: boolean) => void
}

export function StepBranding({ onValidChange }: StepBrandingProps) {
  const { t } = useLocale()
  const { branding, setBranding } = useWizardStore()

  // This step is always valid (files are optional)
  useEffect(() => {
    onValidChange(true)
  }, [onValidChange])

  const handleLogoChange = (file: File | null) => {
    setBranding({ logo: file })
  }

  const handleFaviconChange = (file: File | null) => {
    setBranding({ favicon: file })
  }

  const handleLocaleChange = (value: string) => {
    setBranding({ default_locale: value as LocaleType })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          {t.branding.title}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {t.branding.description}
        </p>
      </div>

      {/* Upload Tiles */}
      <div className="grid gap-6 sm:grid-cols-2">
        <BrandingUploadTile
          type="logo"
          file={branding.logo}
          onFileChange={handleLogoChange}
          maxSize={500 * 1024} // 500 KB
          minDimensions={{ width: 128, height: 128 }}
          maxDimensions={{ width: 2048, height: 2048 }}
          acceptedTypes={["image/png", "image/svg+xml"]}
        />

        <BrandingUploadTile
          type="favicon"
          file={branding.favicon}
          onFileChange={handleFaviconChange}
          maxSize={100 * 1024} // 100 KB
          minDimensions={{ width: 16, height: 16 }}
          maxDimensions={{ width: 512, height: 512 }}
          acceptedTypes={["image/png", "image/x-icon", "image/svg+xml"]}
        />
      </div>

      {/* Default Locale */}
      <div className="space-y-2 max-w-xs">
        <Label htmlFor="default_locale">{t.branding.defaultLocale}</Label>
        <Select
          value={branding.default_locale}
          onValueChange={handleLocaleChange}
        >
          <SelectTrigger id="default_locale">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fa">{t.locales.fa}</SelectItem>
            <SelectItem value="en">{t.locales.en}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
