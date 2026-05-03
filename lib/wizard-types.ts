// Field validation states
export type FieldStatus = "idle" | "checking" | "available" | "taken" | "error" | "cooldown"

export interface FieldState {
  value: string
  status: FieldStatus
  message?: string
  normalized?: string
}

// Step 1 - Identity
export interface IdentityStepData {
  tenant_name: FieldState
  tenant_type: "HOLDING" | "INDEPENDENT"
  company_fullname: FieldState
  company_shortname: FieldState
  national_code: FieldState
}

// Step 2 - Contacts
export interface ContactsStepData {
  country: string
  province: string
  city: string
  postal_code: string
  street: string
  phone: string
  email: string
  website: string
}

// Step 3 - Branding
export interface BrandingStepData {
  logo: File | null
  logoPreview: string | null
  logoError: string | null
  favicon: File | null
  faviconPreview: string | null
  faviconError: string | null
  default_locale: "fa" | "en"
}

// Full wizard state
export interface WizardState {
  currentStep: number
  identity: IdentityStepData
  contacts: ContactsStepData
  branding: BrandingStepData
  acknowledged: boolean
}

// Submission states
export type SubmissionPhase =
  | "idle"
  | "creating-tenant"
  | "uploading-logo"
  | "uploading-favicon"
  | "success"
  | "partial-success"
  | "error"

export interface SubmissionState {
  phase: SubmissionPhase
  tenantId?: string
  logoResult?: { success: boolean; error?: string }
  faviconResult?: { success: boolean; error?: string }
  error?: string
  errorField?: string
}

// Initial state
export function createInitialWizardState(): WizardState {
  return {
    currentStep: 1,
    identity: {
      tenant_name: { value: "", status: "idle" },
      tenant_type: "INDEPENDENT",
      company_fullname: { value: "", status: "idle" },
      company_shortname: { value: "", status: "idle" },
      national_code: { value: "", status: "idle" },
    },
    contacts: {
      country: "ایران",
      province: "",
      city: "",
      postal_code: "",
      street: "",
      phone: "",
      email: "",
      website: "",
    },
    branding: {
      logo: null,
      logoPreview: null,
      logoError: null,
      favicon: null,
      faviconPreview: null,
      faviconError: null,
      default_locale: "fa",
    },
    acknowledged: false,
  }
}

// Session storage key
export const WIZARD_STORAGE_KEY = "dynova.tenant_wizard.draft"

// Save wizard state to session storage (excluding files)
export function saveWizardDraft(state: WizardState): void {
  const serializableState = {
    ...state,
    branding: {
      ...state.branding,
      logo: null,
      logoPreview: null,
      favicon: null,
      faviconPreview: null,
    },
  }
  try {
    sessionStorage.setItem(WIZARD_STORAGE_KEY, JSON.stringify(serializableState))
  } catch (e) {
    console.error("Failed to save wizard draft", e)
  }
}

// Load wizard state from session storage
export function loadWizardDraft(): WizardState | null {
  try {
    const saved = sessionStorage.getItem(WIZARD_STORAGE_KEY)
    if (saved) {
      return JSON.parse(saved) as WizardState
    }
  } catch (e) {
    console.error("Failed to load wizard draft", e)
  }
  return null
}

// Clear wizard draft
export function clearWizardDraft(): void {
  try {
    sessionStorage.removeItem(WIZARD_STORAGE_KEY)
  } catch (e) {
    console.error("Failed to clear wizard draft", e)
  }
}
