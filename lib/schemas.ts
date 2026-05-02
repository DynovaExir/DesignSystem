import { z } from "zod"

// Tenant types
export const TenantType = {
  HOLDING: "HOLDING",
  INDEPENDENT_COMPANY: "INDEPENDENT_COMPANY",
} as const

export type TenantType = (typeof TenantType)[keyof typeof TenantType]

// Locale types
export const DefaultLocale = {
  FA: "fa",
  EN: "en",
} as const

export type DefaultLocale = (typeof DefaultLocale)[keyof typeof DefaultLocale]

// Step 1: Identity Schema
export const identitySchema = z.object({
  tenant_name: z
    .string()
    .min(3, "minLength")
    .max(100, "maxLength")
    .regex(/^[a-z0-9-]+$/, "tenantName"),
  company_fullname: z
    .string()
    .min(3, "minLength")
    .max(255, "maxLength"),
  company_shortname: z
    .string()
    .min(2, "minLength")
    .max(100, "maxLength"),
  national_code: z
    .string()
    .min(1, "required")
    .max(50, "maxLength"),
  tenant_type: z.enum([TenantType.HOLDING, TenantType.INDEPENDENT_COMPANY]),
})

export type IdentityFormData = z.infer<typeof identitySchema>

// Step 2: Contacts Schema
export const contactsSchema = z.object({
  address: z.object({
    country: z.string().min(1, "required"),
    province: z.string().min(1, "required"),
    city: z.string().min(1, "required"),
    postal_code: z.string().min(1, "required"),
    street: z.string().min(1, "required"),
  }),
  phone: z.string().min(1, "required"),
  email: z.string().email("email"),
  website: z.string().url("url").optional().or(z.literal("")),
})

export type ContactsFormData = z.infer<typeof contactsSchema>

// Step 3: Branding Schema
export const brandingSchema = z.object({
  logo: z
    .object({
      file: z.instanceof(File).nullable(),
      preview: z.string().nullable(),
    })
    .nullable(),
  favicon: z
    .object({
      file: z.instanceof(File).nullable(),
      preview: z.string().nullable(),
    })
    .nullable(),
  default_locale: z.enum([DefaultLocale.FA, DefaultLocale.EN]),
})

export type BrandingFormData = z.infer<typeof brandingSchema>

// Combined schema for create tenant
export const createTenantSchema = z.object({
  identity: identitySchema,
  contacts: contactsSchema,
  branding: brandingSchema,
})

export type CreateTenantData = z.infer<typeof createTenantSchema>

// Validation response from server
export interface ValidationResponse {
  available: boolean
  normalized?: string
  error?: string
}

// Tenant response from server
export interface TenantResponse {
  id: string
  tenant_name: string
  company_fullname: string
  company_shortname: string
  national_code: string
  tenant_type: TenantType
  created_at: string
}

// Uniqueness check status
export type UniquenessStatus =
  | "idle"
  | "checking"
  | "available"
  | "taken"
  | "error"
  | "cooldown"

// Wizard step
export type WizardStep = "identity" | "contacts" | "branding" | "confirm" | "submit"

export const WIZARD_STEPS: WizardStep[] = ["identity", "contacts", "branding", "confirm", "submit"]

export function getStepIndex(step: WizardStep): number {
  return WIZARD_STEPS.indexOf(step)
}

export function getStepByIndex(index: number): WizardStep {
  return WIZARD_STEPS[index] || "identity"
}
