"use client"

import { useEffect } from "react"
import { useLocale } from "@/lib/contexts/locale-context"
import { useWizardStore } from "@/lib/stores/wizard-store"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Pencil, AlertTriangle, FileImage } from "lucide-react"
import { cn } from "@/lib/utils"

interface StepConfirmProps {
  onValidChange: (isValid: boolean) => void
  onGoToStep: (step: number) => void
}

export function StepConfirm({ onValidChange, onGoToStep }: StepConfirmProps) {
  const { t } = useLocale()
  const { identity, contacts, branding, acknowledged, setAcknowledged } = useWizardStore()

  // Report validity
  useEffect(() => {
    onValidChange(acknowledged)
  }, [acknowledged, onValidChange])

  const tenantTypeName =
    identity.tenant_type === "HOLDING"
      ? t.tenantTypeHolding
      : t.tenantTypeIndependent

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          {t.confirm.title}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {t.confirm.description}
        </p>
      </div>

      {/* Immutability Warning */}
      <Alert variant="warning">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>{t.confirm.immutabilityWarning}</AlertTitle>
        <AlertDescription className="mt-2">
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>
              <span className="font-medium">{t.identity.tenantName}:</span>{" "}
              <code className="bg-muted px-1 rounded text-xs">{identity.tenant_name}</code>
            </li>
            <li>
              <span className="font-medium">{t.identity.tenantType}:</span>{" "}
              {tenantTypeName}
            </li>
          </ul>
        </AlertDescription>
      </Alert>

      {/* Identity Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base">{t.confirm.identitySection}</CardTitle>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onGoToStep(0)}
          >
            <Pencil className="h-4 w-4 me-1" />
            {t.confirm.editSection}
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground">{t.identity.tenantName}</p>
              <p className="text-sm font-mono">{identity.tenant_name}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t.identity.tenantType}</p>
              <Badge variant="secondary">{tenantTypeName}</Badge>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t.identity.companyFullname}</p>
              <p className="text-sm">{identity.company_fullname}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t.identity.companyShortname}</p>
              <p className="text-sm">{identity.company_shortname}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t.identity.nationalCode}</p>
              <p className="text-sm">{identity.national_code}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contacts Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base">{t.confirm.contactsSection}</CardTitle>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onGoToStep(1)}
          >
            <Pencil className="h-4 w-4 me-1" />
            {t.confirm.editSection}
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <p className="text-xs text-muted-foreground">{t.contacts.street}</p>
              <p className="text-sm">{contacts.street}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t.contacts.city}</p>
              <p className="text-sm">{contacts.city}, {contacts.province}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t.contacts.country}</p>
              <p className="text-sm">{t.countries[contacts.country as keyof typeof t.countries] || contacts.country}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t.contacts.postalCode}</p>
              <p className="text-sm">{contacts.postal_code}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t.contacts.phone}</p>
              <p className="text-sm" dir="ltr">{contacts.phone}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t.contacts.email}</p>
              <p className="text-sm" dir="ltr">{contacts.email}</p>
            </div>
            {contacts.website && (
              <div>
                <p className="text-xs text-muted-foreground">{t.contacts.website}</p>
                <p className="text-sm" dir="ltr">{contacts.website}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Branding Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base">{t.confirm.brandingSection}</CardTitle>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onGoToStep(2)}
          >
            <Pencil className="h-4 w-4 me-1" />
            {t.confirm.editSection}
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs text-muted-foreground">{t.branding.logo}</p>
              {branding.logo ? (
                <div className="flex items-center gap-2 mt-1">
                  <FileImage className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm truncate max-w-[150px]">{branding.logo.name}</span>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">-</p>
              )}
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t.branding.favicon}</p>
              {branding.favicon ? (
                <div className="flex items-center gap-2 mt-1">
                  <FileImage className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm truncate max-w-[150px]">{branding.favicon.name}</span>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">-</p>
              )}
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t.branding.defaultLocale}</p>
              <p className="text-sm">{t.locales[branding.default_locale]}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Acknowledgement Checkbox */}
      <div className="flex items-start gap-3 rounded-md border border-border p-4 bg-muted/30">
        <Checkbox
          id="acknowledged"
          checked={acknowledged}
          onCheckedChange={(checked) => setAcknowledged(checked === true)}
          className="mt-0.5"
        />
        <Label
          htmlFor="acknowledged"
          className={cn(
            "text-sm leading-relaxed cursor-pointer",
            !acknowledged && "text-muted-foreground"
          )}
        >
          {t.confirm.acknowledgement}
        </Label>
      </div>
    </div>
  )
}
