"use client"

import { useWizardStore } from "@/lib/wizard-store"
import { useT } from "@/lib/locale-context"
import { DefaultLocale } from "@/lib/schemas"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { BrandingUploadTile } from "./branding-upload-tile"

export function StepBranding() {
  const t = useT()
  const { branding, setBranding } = useWizardStore()

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h2 className="text-heading-lg text-foreground">
          {t.wizard.branding.title}
        </h2>
        <p className="mt-1 text-body-sm-regular text-muted-foreground">
          {t.wizard.branding.description}
        </p>
      </div>

      {/* Upload Tiles */}
      <div className="grid gap-6 sm:grid-cols-2">
        {/* Logo */}
        <BrandingUploadTile
          label={t.wizard.branding.logo.label}
          hint={t.wizard.branding.logo.hint}
          accept="image/png,image/svg+xml,.png,.svg"
          maxSize={500 * 1024}
          minWidth={128}
          minHeight={128}
          maxWidth={2048}
          maxHeight={2048}
          value={branding.logo}
          onChange={(value) => setBranding({ logo: value })}
        />

        {/* Favicon */}
        <BrandingUploadTile
          label={t.wizard.branding.favicon.label}
          hint={t.wizard.branding.favicon.hint}
          accept="image/png,image/svg+xml,image/x-icon,image/vnd.microsoft.icon,.png,.svg,.ico"
          maxSize={100 * 1024}
          minWidth={16}
          minHeight={16}
          maxWidth={512}
          maxHeight={512}
          value={branding.favicon}
          onChange={(value) => setBranding({ favicon: value })}
        />
      </div>

      {/* Default Locale */}
      <div className="space-y-2">
        <Label htmlFor="default_locale">
          {t.wizard.branding.defaultLocale.label}
        </Label>
        <Select
          value={branding.default_locale}
          onValueChange={(value) =>
            setBranding({ default_locale: value as typeof DefaultLocale[keyof typeof DefaultLocale] })
          }
        >
          <SelectTrigger id="default_locale" className="max-w-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={DefaultLocale.FA}>
              {t.locales.fa}
            </SelectItem>
            <SelectItem value={DefaultLocale.EN}>
              {t.locales.en}
            </SelectItem>
          </SelectContent>
        </Select>
        <p className="text-label-lg-regular text-muted-foreground">
          {t.wizard.branding.defaultLocale.hint}
        </p>
      </div>
    </div>
  )
}
