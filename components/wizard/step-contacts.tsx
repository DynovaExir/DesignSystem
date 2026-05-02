"use client"

import { useWizardStore } from "@/lib/wizard-store"
import { useT } from "@/lib/locale-context"
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

// Mock data for countries/provinces/cities
const COUNTRIES = [
  { value: "IR", label: { fa: "ایران", en: "Iran" } },
  { value: "AE", label: { fa: "امارات", en: "UAE" } },
  { value: "TR", label: { fa: "ترکیه", en: "Turkey" } },
]

const PROVINCES: Record<string, Array<{ value: string; label: { fa: string; en: string } }>> = {
  IR: [
    { value: "tehran", label: { fa: "تهران", en: "Tehran" } },
    { value: "isfahan", label: { fa: "اصفهان", en: "Isfahan" } },
    { value: "fars", label: { fa: "فارس", en: "Fars" } },
  ],
  AE: [
    { value: "dubai", label: { fa: "دبی", en: "Dubai" } },
    { value: "abudhabi", label: { fa: "ابوظبی", en: "Abu Dhabi" } },
  ],
  TR: [
    { value: "istanbul", label: { fa: "استانبول", en: "Istanbul" } },
    { value: "ankara", label: { fa: "آنکارا", en: "Ankara" } },
  ],
}

const CITIES: Record<string, Array<{ value: string; label: { fa: string; en: string } }>> = {
  tehran: [
    { value: "tehran-city", label: { fa: "تهران", en: "Tehran" } },
    { value: "karaj", label: { fa: "کرج", en: "Karaj" } },
  ],
  isfahan: [
    { value: "isfahan-city", label: { fa: "اصفهان", en: "Isfahan" } },
    { value: "kashan", label: { fa: "کاشان", en: "Kashan" } },
  ],
  fars: [
    { value: "shiraz", label: { fa: "شیراز", en: "Shiraz" } },
  ],
  dubai: [
    { value: "dubai-city", label: { fa: "دبی", en: "Dubai" } },
  ],
  abudhabi: [
    { value: "abudhabi-city", label: { fa: "ابوظبی", en: "Abu Dhabi" } },
  ],
  istanbul: [
    { value: "istanbul-city", label: { fa: "استانبول", en: "Istanbul" } },
  ],
  ankara: [
    { value: "ankara-city", label: { fa: "آنکارا", en: "Ankara" } },
  ],
}

export function StepContacts() {
  const t = useT()
  const { contacts, setContacts } = useWizardStore()

  const provinces = PROVINCES[contacts.address.country] || []
  const cities = CITIES[contacts.address.province] || []

  const handleCountryChange = (value: string) => {
    setContacts({
      address: {
        ...contacts.address,
        country: value,
        province: "",
        city: "",
      },
    })
  }

  const handleProvinceChange = (value: string) => {
    setContacts({
      address: {
        ...contacts.address,
        province: value,
        city: "",
      },
    })
  }

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h2 className="text-heading-lg text-foreground">
          {t.wizard.contacts.title}
        </h2>
        <p className="mt-1 text-body-sm-regular text-muted-foreground">
          {t.wizard.contacts.description}
        </p>
      </div>

      {/* Address Section */}
      <div className="space-y-4">
        <h3 className="text-body-lg-semibold text-foreground">
          {t.wizard.contacts.address.title}
        </h3>

        {/* Country / Province / City Row */}
        <div className="grid gap-4 sm:grid-cols-3">
          {/* Country */}
          <div className="space-y-2">
            <Label htmlFor="country">
              {t.wizard.contacts.address.country.label}
            </Label>
            <Select
              value={contacts.address.country}
              onValueChange={handleCountryChange}
            >
              <SelectTrigger id="country">
                <SelectValue placeholder={t.wizard.contacts.address.country.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((country) => (
                  <SelectItem key={country.value} value={country.value}>
                    {country.label.fa}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Province */}
          <div className="space-y-2">
            <Label htmlFor="province">
              {t.wizard.contacts.address.province.label}
            </Label>
            <Select
              value={contacts.address.province}
              onValueChange={handleProvinceChange}
              disabled={!contacts.address.country}
            >
              <SelectTrigger id="province">
                <SelectValue placeholder={t.wizard.contacts.address.province.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {provinces.map((province) => (
                  <SelectItem key={province.value} value={province.value}>
                    {province.label.fa}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* City */}
          <div className="space-y-2">
            <Label htmlFor="city">
              {t.wizard.contacts.address.city.label}
            </Label>
            <Select
              value={contacts.address.city}
              onValueChange={(value) =>
                setContacts({ address: { ...contacts.address, city: value } })
              }
              disabled={!contacts.address.province}
            >
              <SelectTrigger id="city">
                <SelectValue placeholder={t.wizard.contacts.address.city.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city.value} value={city.value}>
                    {city.label.fa}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Postal Code */}
        <div className="space-y-2">
          <Label htmlFor="postal_code">
            {t.wizard.contacts.address.postalCode.label}
          </Label>
          <Input
            id="postal_code"
            value={contacts.address.postal_code}
            onChange={(e) =>
              setContacts({
                address: { ...contacts.address, postal_code: e.target.value },
              })
            }
            onBlur={(e) => {
              const normalized = normalizeText(e.target.value, "postal_code")
              setContacts({
                address: { ...contacts.address, postal_code: normalized },
              })
            }}
            placeholder={t.wizard.contacts.address.postalCode.placeholder}
            className="max-w-xs"
          />
        </div>

        {/* Street Address */}
        <div className="space-y-2">
          <Label htmlFor="street">
            {t.wizard.contacts.address.street.label}
          </Label>
          <Textarea
            id="street"
            value={contacts.address.street}
            onChange={(e) =>
              setContacts({
                address: { ...contacts.address, street: e.target.value },
              })
            }
            placeholder={t.wizard.contacts.address.street.placeholder}
            rows={3}
          />
        </div>
      </div>

      {/* Contact Methods Section */}
      <div className="space-y-4">
        <h3 className="text-body-lg-semibold text-foreground">
          {t.wizard.contacts.contact.title}
        </h3>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone">
            {t.wizard.contacts.contact.phone.label}
          </Label>
          <Input
            id="phone"
            type="tel"
            value={contacts.phone}
            onChange={(e) => setContacts({ phone: e.target.value })}
            onBlur={(e) => {
              const normalized = normalizeText(e.target.value, "phone")
              setContacts({ phone: normalized })
            }}
            placeholder={t.wizard.contacts.contact.phone.placeholder}
            className="max-w-xs"
            dir="ltr"
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">
            {t.wizard.contacts.contact.email.label}
          </Label>
          <Input
            id="email"
            type="email"
            value={contacts.email}
            onChange={(e) => setContacts({ email: e.target.value })}
            placeholder={t.wizard.contacts.contact.email.placeholder}
            className="max-w-md"
            dir="ltr"
          />
        </div>

        {/* Website */}
        <div className="space-y-2">
          <Label htmlFor="website">
            {t.wizard.contacts.contact.website.label}
            <span className="ms-2 text-muted-foreground">({t.common.optional})</span>
          </Label>
          <Input
            id="website"
            type="url"
            value={contacts.website || ""}
            onChange={(e) => setContacts({ website: e.target.value })}
            placeholder={t.wizard.contacts.contact.website.placeholder}
            className="max-w-md"
            dir="ltr"
          />
        </div>
      </div>
    </div>
  )
}
