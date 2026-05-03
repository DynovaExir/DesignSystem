"use client"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FieldWrapper } from "@/components/wizard/field-wrapper"
import { Banner } from "@/components/wizard/banner"
import type { ContactsStepData } from "@/lib/wizard-types"
import { toPersianDigits, toAsciiDigits } from "@/lib/utils"

interface StepContactsProps {
  data: ContactsStepData
  onChange: (data: ContactsStepData) => void
  serverError?: { message: string; field?: string }
}

// Sample provinces (Iran)
const PROVINCES = [
  "تهران",
  "اصفهان",
  "فارس",
  "خراسان رضوی",
  "آذربایجان شرقی",
  "مازندران",
  "البرز",
  "گیلان",
]

export function StepContacts({ data, onChange, serverError }: StepContactsProps) {
  const updateField = (field: keyof ContactsStepData, value: string) => {
    onChange({ ...data, [field]: value })
  }

  // Format phone on blur - convert to Persian digits for display
  const handlePhoneBlur = () => {
    const normalized = toAsciiDigits(data.phone)
    updateField("phone", toPersianDigits(normalized))
  }

  // Format postal code on blur - convert to Persian digits for display
  const handlePostalCodeBlur = () => {
    const normalized = toAsciiDigits(data.postal_code)
    updateField("postal_code", toPersianDigits(normalized))
  }

  const hasFieldError = (fieldName: string) =>
    serverError?.field === fieldName

  return (
    <div className="space-y-6">
      <h2 className="text-heading-lg text-color-text-default">اطلاعات تماس</h2>

      {/* Server error banner */}
      {serverError && (
        <Banner variant="danger">{serverError.message}</Banner>
      )}

      <div className="space-y-4">
        {/* Country */}
        <FieldWrapper label="کشور" htmlFor="country">
          <Select
            value={data.country}
            onValueChange={(value) => updateField("country", value)}
          >
            <SelectTrigger id="country">
              <SelectValue placeholder="انتخاب کشور" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ایران">ایران</SelectItem>
              <SelectItem value="افغانستان">افغانستان</SelectItem>
              <SelectItem value="عراق">عراق</SelectItem>
              <SelectItem value="ترکیه">ترکیه</SelectItem>
            </SelectContent>
          </Select>
        </FieldWrapper>

        {/* Province & City - Two columns */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FieldWrapper label="استان" htmlFor="province">
            <Select
              value={data.province}
              onValueChange={(value) => updateField("province", value)}
            >
              <SelectTrigger id="province">
                <SelectValue placeholder="انتخاب استان" />
              </SelectTrigger>
              <SelectContent>
                {PROVINCES.map((province) => (
                  <SelectItem key={province} value={province}>
                    {province}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FieldWrapper>

          <FieldWrapper label="شهر" htmlFor="city">
            <Input
              id="city"
              value={data.city}
              onChange={(e) => updateField("city", e.target.value)}
              placeholder="شهر"
            />
          </FieldWrapper>
        </div>

        {/* Postal Code */}
        <FieldWrapper
          label="کد پستی"
          htmlFor="postal_code"
          error={hasFieldError("postal_code") ? serverError?.message : undefined}
        >
          <Input
            id="postal_code"
            value={data.postal_code}
            onChange={(e) => updateField("postal_code", e.target.value)}
            onBlur={handlePostalCodeBlur}
            placeholder="۱۲۳۴۵۶۷۸۹۰"
            error={hasFieldError("postal_code")}
          />
        </FieldWrapper>

        {/* Street Address */}
        <FieldWrapper label="نشانی" htmlFor="street">
          <Input
            id="street"
            value={data.street}
            onChange={(e) => updateField("street", e.target.value)}
            placeholder="خیابان، کوچه، پلاک"
          />
        </FieldWrapper>

        {/* Phone */}
        <FieldWrapper label="تلفن تماس اصلی" htmlFor="phone">
          <Input
            id="phone"
            value={data.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            onBlur={handlePhoneBlur}
            placeholder="۰۲۱۱۲۳۴۵۶۷۸"
          />
        </FieldWrapper>

        {/* Email */}
        <FieldWrapper label="ایمیل اصلی" htmlFor="email">
          <Input
            id="email"
            type="email"
            dir="ltr"
            value={data.email}
            onChange={(e) => updateField("email", e.target.value)}
            placeholder="info@example.com"
          />
        </FieldWrapper>

        {/* Website */}
        <FieldWrapper label="وب‌سایت" htmlFor="website">
          <Input
            id="website"
            type="url"
            dir="ltr"
            value={data.website}
            onChange={(e) => updateField("website", e.target.value)}
            placeholder="https://example.com"
          />
        </FieldWrapper>
      </div>
    </div>
  )
}
