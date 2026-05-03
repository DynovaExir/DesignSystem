"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Banner } from "@/components/wizard/banner"
import type { WizardState } from "@/lib/wizard-types"
import { toPersianDigits } from "@/lib/utils"
import { Image as ImageIcon } from "lucide-react"

interface StepConfirmProps {
  wizardState: WizardState
  acknowledged: boolean
  onAcknowledgedChange: (value: boolean) => void
  onEditStep: (step: number) => void
}

export function StepConfirm({
  wizardState,
  acknowledged,
  onAcknowledgedChange,
  onEditStep,
}: StepConfirmProps) {
  const { identity, contacts, branding } = wizardState

  const tenantTypeLabel = identity.tenant_type === "HOLDING" ? "هلدینگ" : "شرکت مستقل"
  const localeLabel = branding.default_locale === "fa" ? "فارسی" : "English"

  return (
    <div className="space-y-6">
      <h2 className="text-heading-lg text-color-text-default">تأیید</h2>

      {/* Immutability warning banner */}
      <Banner variant="warning">
        پس از ایجاد، مقادیر &quot;شناسه فنی مستأجر&quot; و &quot;نوع مستأجر&quot; قابل تغییر نخواهند بود.
      </Banner>

      {/* Identity Section */}
      <SummarySection title="هویت" onEdit={() => onEditStep(1)}>
        <SummaryRow label="شناسه فنی مستأجر" value={identity.tenant_name.value} ltr />
        <SummaryRow label="نوع مستأجر" value={tenantTypeLabel} />
        <SummaryRow label="نام کامل قانونی شرکت" value={identity.company_fullname.value} />
        <SummaryRow label="نام کوتاه شرکت" value={identity.company_shortname.value} />
        <SummaryRow
          label="شناسه ملی"
          value={toPersianDigits(identity.national_code.normalized || identity.national_code.value)}
        />
      </SummarySection>

      {/* Contacts Section */}
      <SummarySection title="اطلاعات تماس" onEdit={() => onEditStep(2)}>
        <SummaryRow label="کشور" value={contacts.country} />
        <SummaryRow label="استان" value={contacts.province} />
        <SummaryRow label="شهر" value={contacts.city} />
        <SummaryRow label="کد پستی" value={contacts.postal_code} />
        <SummaryRow label="نشانی" value={contacts.street} />
        <SummaryRow label="تلفن" value={contacts.phone} />
        <SummaryRow label="ایمیل" value={contacts.email} ltr />
        <SummaryRow label="وب‌سایت" value={contacts.website} ltr />
      </SummarySection>

      {/* Branding Section */}
      <SummarySection title="برندینگ" onEdit={() => onEditStep(3)}>
        <div className="flex items-start gap-6">
          {/* Logo Preview */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-label-lg-semibold text-color-text-subtle">لوگو</span>
            {branding.logoPreview ? (
              <div className="h-16 w-16 overflow-hidden rounded-md border border-color-border-default bg-color-bg-subtle">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={branding.logoPreview}
                  alt="لوگو"
                  className="h-full w-full object-contain"
                />
              </div>
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-md border border-color-border-default bg-color-bg-muted">
                <ImageIcon className="h-6 w-6 text-color-icon-subtle" />
                <span className="sr-only">بدون لوگو</span>
              </div>
            )}
            {!branding.logoPreview && (
              <span className="text-label-lg-regular text-color-text-subtle">بدون لوگو</span>
            )}
          </div>

          {/* Favicon Preview */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-label-lg-semibold text-color-text-subtle">فاوآیکون</span>
            {branding.faviconPreview ? (
              <div className="h-16 w-16 overflow-hidden rounded-md border border-color-border-default bg-color-bg-subtle p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={branding.faviconPreview}
                  alt="فاوآیکون"
                  className="h-full w-full object-contain"
                />
              </div>
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-md border border-color-border-default bg-color-bg-muted">
                <ImageIcon className="h-6 w-6 text-color-icon-subtle" />
                <span className="sr-only">بدون فاوآیکون</span>
              </div>
            )}
            {!branding.faviconPreview && (
              <span className="text-label-lg-regular text-color-text-subtle">بدون فاوآیکون</span>
            )}
          </div>
        </div>
        <SummaryRow label="زبان پیش‌فرض" value={localeLabel} />
      </SummarySection>

      {/* Acknowledgement */}
      <div className="flex items-start gap-3 rounded-lg border border-color-border-default bg-color-bg-subtle p-4">
        <Checkbox
          id="acknowledge"
          checked={acknowledged}
          onCheckedChange={(checked) => onAcknowledgedChange(checked === true)}
          className="mt-0.5"
        />
        <Label htmlFor="acknowledge" className="cursor-pointer font-normal leading-relaxed">
          این موضوع را درک کرده‌ام و تأیید می‌کنم.
        </Label>
      </div>
    </div>
  )
}

// Section component
interface SummarySectionProps {
  title: string
  onEdit: () => void
  children: React.ReactNode
}

function SummarySection({ title, onEdit, children }: SummarySectionProps) {
  return (
    <div className="rounded-lg border border-color-border-default bg-color-bg-subtle">
      <div className="flex items-center justify-between border-b border-color-border-default px-4 py-3">
        <h3 className="text-body-sm-semibold text-color-text-default">{title}</h3>
        <Button variant="ghost" onClick={onEdit} className="h-auto px-2 py-1 text-body-sm-regular">
          ویرایش
        </Button>
      </div>
      <div className="space-y-2 px-4 py-3">{children}</div>
    </div>
  )
}

// Row component
interface SummaryRowProps {
  label: string
  value: string
  ltr?: boolean
}

function SummaryRow({ label, value, ltr }: SummaryRowProps) {
  if (!value) return null

  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="text-label-lg-regular text-color-text-subtle shrink-0">{label}</span>
      <span
        className="text-body-sm-regular text-color-text-default text-end break-words"
        dir={ltr ? "ltr" : undefined}
      >
        {value}
      </span>
    </div>
  )
}
