"use client"

import { useWizardStore } from "@/lib/wizard-store"
import { useT } from "@/lib/locale-context"
import { TenantType } from "@/lib/schemas"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Edit, Image as ImageIcon } from "lucide-react"

function SummarySection({
  title,
  step,
  children,
}: {
  title: string
  step: string
  children: React.ReactNode
}) {
  const t = useT()
  const { goToStep } = useWizardStore()

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between py-4">
        <CardTitle className="text-body-lg-semibold">{title}</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => goToStep(step as any)}
          className="gap-2"
        >
          <Edit className="h-4 w-4" />
          {t.wizard.confirm.editSection}
        </Button>
      </CardHeader>
      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  )
}

function SummaryRow({
  label,
  value,
  badge,
}: {
  label: string
  value: React.ReactNode
  badge?: React.ReactNode
}) {
  return (
    <div className="flex items-start justify-between py-2 border-b border-border last:border-0">
      <span className="text-body-sm-regular text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        {badge}
        <span className="text-body-sm-semibold text-foreground text-end">
          {value}
        </span>
      </div>
    </div>
  )
}

export function StepConfirm() {
  const t = useT()
  const { identity, contacts, branding, acknowledged, setAcknowledged } =
    useWizardStore()

  const tenantTypeLabel =
    identity.tenant_type === TenantType.HOLDING
      ? t.wizard.identity.tenantType.holding.title
      : t.wizard.identity.tenantType.independent.title

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h2 className="text-heading-lg text-foreground">
          {t.wizard.confirm.title}
        </h2>
        <p className="mt-1 text-body-sm-regular text-muted-foreground">
          {t.wizard.confirm.description}
        </p>
      </div>

      {/* Immutable Fields Warning */}
      <Alert variant="warning">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>{t.wizard.confirm.immutableBanner.title}</AlertTitle>
        <AlertDescription>
          <p className="mb-2">{t.wizard.confirm.immutableBanner.description}</p>
          <ul className="list-disc list-inside text-body-sm-regular">
            {t.wizard.confirm.immutableBanner.fields.map((field, i) => (
              <li key={i}>{field}</li>
            ))}
          </ul>
        </AlertDescription>
      </Alert>

      {/* Identity Summary */}
      <SummarySection title={t.wizard.confirm.sections.identity} step="identity">
        <div className="space-y-1">
          <SummaryRow
            label={t.wizard.identity.tenantName.label}
            value={identity.tenant_name}
            badge={
              <Badge variant="warning" className="text-label-sm-semibold">
                {t.wizard.identity.tenantName.immutable}
              </Badge>
            }
          />
          <SummaryRow
            label={t.wizard.identity.companyFullname.label}
            value={identity.company_fullname}
          />
          <SummaryRow
            label={t.wizard.identity.companyShortname.label}
            value={identity.company_shortname}
          />
          <SummaryRow
            label={t.wizard.identity.nationalCode.label}
            value={identity.national_code}
          />
          <SummaryRow
            label={t.wizard.identity.tenantType.label}
            value={tenantTypeLabel}
            badge={
              <Badge variant="warning" className="text-label-sm-semibold">
                {t.wizard.identity.tenantName.immutable}
              </Badge>
            }
          />
        </div>
      </SummarySection>

      {/* Contacts Summary */}
      <SummarySection title={t.wizard.confirm.sections.contacts} step="contacts">
        <div className="space-y-1">
          <SummaryRow
            label={t.wizard.contacts.address.title}
            value={
              <span className="text-end">
                {contacts.address.street}
                <br />
                <span className="text-muted-foreground">
                  {contacts.address.city}, {contacts.address.province},{" "}
                  {contacts.address.country}
                </span>
              </span>
            }
          />
          <SummaryRow
            label={t.wizard.contacts.address.postalCode.label}
            value={contacts.address.postal_code}
          />
          <SummaryRow
            label={t.wizard.contacts.contact.phone.label}
            value={<span dir="ltr">{contacts.phone}</span>}
          />
          <SummaryRow
            label={t.wizard.contacts.contact.email.label}
            value={<span dir="ltr">{contacts.email}</span>}
          />
          {contacts.website && (
            <SummaryRow
              label={t.wizard.contacts.contact.website.label}
              value={<span dir="ltr">{contacts.website}</span>}
            />
          )}
        </div>
      </SummarySection>

      {/* Branding Summary */}
      <SummarySection title={t.wizard.confirm.sections.branding} step="branding">
        <div className="space-y-4">
          <div className="flex items-center gap-6">
            {/* Logo Preview */}
            <div className="text-center">
              <p className="text-label-lg-semibold text-muted-foreground mb-2">
                {t.wizard.branding.logo.label}
              </p>
              {branding.logo?.preview ? (
                <div className="h-16 w-16 overflow-hidden rounded-md bg-muted mx-auto">
                  <img
                    src={branding.logo.preview}
                    alt=""
                    className="h-full w-full object-contain"
                  />
                </div>
              ) : (
                <div className="h-16 w-16 flex items-center justify-center rounded-md bg-muted mx-auto">
                  <ImageIcon className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Favicon Preview */}
            <div className="text-center">
              <p className="text-label-lg-semibold text-muted-foreground mb-2">
                {t.wizard.branding.favicon.label}
              </p>
              {branding.favicon?.preview ? (
                <div className="h-16 w-16 overflow-hidden rounded-md bg-muted mx-auto">
                  <img
                    src={branding.favicon.preview}
                    alt=""
                    className="h-full w-full object-contain"
                  />
                </div>
              ) : (
                <div className="h-16 w-16 flex items-center justify-center rounded-md bg-muted mx-auto">
                  <ImageIcon className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
            </div>
          </div>

          <SummaryRow
            label={t.wizard.branding.defaultLocale.label}
            value={t.locales[branding.default_locale as keyof typeof t.locales]}
          />
        </div>
      </SummarySection>

      {/* Acknowledgement Checkbox */}
      <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 p-4">
        <Checkbox
          id="acknowledge"
          checked={acknowledged}
          onCheckedChange={(checked) => setAcknowledged(checked === true)}
        />
        <Label
          htmlFor="acknowledge"
          className="text-body-sm-regular text-foreground cursor-pointer leading-relaxed"
        >
          {t.wizard.confirm.acknowledgement}
        </Label>
      </div>
    </div>
  )
}
