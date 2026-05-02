import { z } from "zod"

export const TenantType = z.enum(["HOLDING", "INDEPENDENT_COMPANY"])
export type TenantType = z.infer<typeof TenantType>

export const LocaleSchema = z.enum(["fa", "en"])
export type LocaleType = z.infer<typeof LocaleSchema>

// Step 1: Identity Schema
export const identitySchema = z.object({
  tenant_name: z
    .string()
    .min(3, "tenantNameLength")
    .max(100, "tenantNameLength")
    .regex(/^[a-z0-9-]+$/, "tenantNamePattern"),
  company_fullname: z
    .string()
    .min(3, "companyFullnameLength")
    .max(255, "companyFullnameLength"),
  company_shortname: z
    .string()
    .min(2, "companyShortnameLength")
    .max(100, "companyShortnameLength"),
  national_code: z
    .string()
    .min(1, "nationalCodeLength")
    .max(50, "nationalCodeLength"),
  tenant_type: TenantType,
})

export type IdentityFormData = z.infer<typeof identitySchema>

// Step 2: Contacts Schema
export const contactsSchema = z.object({
  country: z.string().min(1, "countryRequired"),
  province: z.string().min(1, "provinceRequired"),
  city: z.string().min(1, "cityRequired"),
  postal_code: z.string().min(1, "postalCodeRequired"),
  street: z.string().min(1, "streetRequired"),
  phone: z
    .string()
    .min(1, "phoneRequired")
    .regex(/^[\d\s+()-]+$/, "phoneInvalid"),
  email: z.string().min(1, "emailRequired").email("emailInvalid"),
  website: z
    .string()
    .url("websiteInvalid")
    .optional()
    .or(z.literal("")),
})

export type ContactsFormData = z.infer<typeof contactsSchema>

// Step 3: Branding Schema
export const brandingSchema = z.object({
  logo: z
    .custom<File | null>()
    .optional()
    .nullable(),
  favicon: z
    .custom<File | null>()
    .optional()
    .nullable(),
  default_locale: LocaleSchema,
})

export type BrandingFormData = z.infer<typeof brandingSchema>

// Step 4: Confirm Schema (just acknowledgement)
export const confirmSchema = z.object({
  acknowledged: z.literal(true, {
    errorMap: () => ({ message: "acknowledgementRequired" }),
  }),
})

export type ConfirmFormData = z.infer<typeof confirmSchema>

// Combined tenant creation schema
export const createTenantSchema = z.object({
  // Identity
  tenant_name: identitySchema.shape.tenant_name,
  company_fullname: identitySchema.shape.company_fullname,
  company_shortname: identitySchema.shape.company_shortname,
  national_code: identitySchema.shape.national_code,
  tenant_type: identitySchema.shape.tenant_type,
  
  // Contacts
  country: contactsSchema.shape.country,
  province: contactsSchema.shape.province,
  city: contactsSchema.shape.city,
  postal_code: contactsSchema.shape.postal_code,
  street: contactsSchema.shape.street,
  phone: contactsSchema.shape.phone,
  email: contactsSchema.shape.email,
  website: contactsSchema.shape.website,
  
  // Branding
  logo: brandingSchema.shape.logo,
  favicon: brandingSchema.shape.favicon,
  default_locale: brandingSchema.shape.default_locale,
})

export type CreateTenantData = z.infer<typeof createTenantSchema>

// Tenant response from API
export interface Tenant {
  id: string
  tenant_name: string
  company_fullname: string
  company_shortname: string
  national_code: string
  tenant_type: TenantType
  country: string
  province: string
  city: string
  postal_code: string
  street: string
  phone: string
  email: string
  website?: string
  logo_url?: string
  favicon_url?: string
  default_locale: LocaleType
  created_at: string
  updated_at: string
}
