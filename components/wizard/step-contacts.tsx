"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useLocale } from "@/lib/contexts/locale-context"
import { useWizardStore } from "@/lib/stores/wizard-store"
import { contactsSchema, type ContactsFormData } from "@/lib/schemas"
import { normalizeText } from "@/lib/normalize"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface StepContactsProps {
  onValidChange: (isValid: boolean) => void
}

export function StepContacts({ onValidChange }: StepContactsProps) {
  const { t } = useLocale()
  const { contacts, setContacts } = useWizardStore()

  const {
    register,
    formState: { errors, isValid },
    setValue,
    watch,
    trigger,
  } = useForm<ContactsFormData>({
    resolver: zodResolver(contactsSchema),
    mode: "onChange",
    defaultValues: {
      country: contacts.country || "IR",
      province: contacts.province,
      city: contacts.city,
      postal_code: contacts.postal_code,
      street: contacts.street,
      phone: contacts.phone,
      email: contacts.email,
      website: contacts.website,
    },
  })

  const formValues = watch()

  // Sync form values to store
  useEffect(() => {
    setContacts(formValues)
  }, [formValues, setContacts])

  // Report validity
  useEffect(() => {
    onValidChange(isValid)
  }, [isValid, onValidChange])

  // Normalize phone and postal code on blur
  const handlePhoneBlur = () => {
    const normalized = normalizeText(formValues.phone, "phone")
    if (normalized !== formValues.phone) {
      setValue("phone", normalized)
      trigger("phone")
    }
  }

  const handlePostalCodeBlur = () => {
    const normalized = normalizeText(formValues.postal_code, "postal_code")
    if (normalized !== formValues.postal_code) {
      setValue("postal_code", normalized)
      trigger("postal_code")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          {t.contacts.title}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {t.contacts.description}
        </p>
      </div>

      {/* Address Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-foreground">{t.contacts.address}</h3>
        
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Country */}
          <div className="space-y-2">
            <Label htmlFor="country">{t.contacts.country}</Label>
            <Select
              value={formValues.country}
              onValueChange={(value) => {
                setValue("country", value)
                trigger("country")
              }}
            >
              <SelectTrigger id="country">
                <SelectValue placeholder={t.contacts.country} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IR">{t.countries.IR}</SelectItem>
                <SelectItem value="AE">{t.countries.AE}</SelectItem>
                <SelectItem value="TR">{t.countries.TR}</SelectItem>
              </SelectContent>
            </Select>
            {errors.country && (
              <p className="text-xs text-destructive">
                {t.validation[errors.country.message as keyof typeof t.validation]}
              </p>
            )}
          </div>

          {/* Province */}
          <div className="space-y-2">
            <Label htmlFor="province">{t.contacts.province}</Label>
            <Input
              id="province"
              {...register("province")}
              className={cn(errors.province && "border-destructive")}
            />
            {errors.province && (
              <p className="text-xs text-destructive">
                {t.validation[errors.province.message as keyof typeof t.validation]}
              </p>
            )}
          </div>

          {/* City */}
          <div className="space-y-2">
            <Label htmlFor="city">{t.contacts.city}</Label>
            <Input
              id="city"
              {...register("city")}
              className={cn(errors.city && "border-destructive")}
            />
            {errors.city && (
              <p className="text-xs text-destructive">
                {t.validation[errors.city.message as keyof typeof t.validation]}
              </p>
            )}
          </div>

          {/* Postal Code */}
          <div className="space-y-2">
            <Label htmlFor="postal_code">{t.contacts.postalCode}</Label>
            <Input
              id="postal_code"
              {...register("postal_code")}
              className={cn(errors.postal_code && "border-destructive")}
              onBlur={handlePostalCodeBlur}
            />
            {errors.postal_code && (
              <p className="text-xs text-destructive">
                {t.validation[errors.postal_code.message as keyof typeof t.validation]}
              </p>
            )}
          </div>
        </div>

        {/* Street Address */}
        <div className="space-y-2">
          <Label htmlFor="street">{t.contacts.street}</Label>
          <Textarea
            id="street"
            {...register("street")}
            className={cn(errors.street && "border-destructive")}
            rows={3}
          />
          {errors.street && (
            <p className="text-xs text-destructive">
              {t.validation[errors.street.message as keyof typeof t.validation]}
            </p>
          )}
        </div>
      </div>

      {/* Communication Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-foreground">{t.contacts.communication}</h3>
        
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">{t.contacts.phone}</Label>
            <Input
              id="phone"
              type="tel"
              {...register("phone")}
              className={cn(errors.phone && "border-destructive")}
              onBlur={handlePhoneBlur}
              dir="ltr"
            />
            {errors.phone && (
              <p className="text-xs text-destructive">
                {t.validation[errors.phone.message as keyof typeof t.validation]}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">{t.contacts.email}</Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              className={cn(errors.email && "border-destructive")}
              dir="ltr"
            />
            {errors.email && (
              <p className="text-xs text-destructive">
                {t.validation[errors.email.message as keyof typeof t.validation]}
              </p>
            )}
          </div>
        </div>

        {/* Website */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="website">{t.contacts.website}</Label>
            <span className="text-xs text-muted-foreground">({t.optional})</span>
          </div>
          <Input
            id="website"
            type="url"
            {...register("website")}
            className={cn(errors.website && "border-destructive")}
            placeholder="https://"
            dir="ltr"
          />
          {errors.website && (
            <p className="text-xs text-destructive">
              {t.validation[errors.website.message as keyof typeof t.validation]}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
