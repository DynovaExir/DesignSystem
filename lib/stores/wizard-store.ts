import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type { TenantType, LocaleType } from "../schemas"

export interface IdentityData {
  tenant_name: string
  company_fullname: string
  company_shortname: string
  national_code: string
  tenant_type: TenantType | ""
}

export interface ContactsData {
  country: string
  province: string
  city: string
  postal_code: string
  street: string
  phone: string
  email: string
  website: string
}

export interface BrandingData {
  logo: File | null
  favicon: File | null
  default_locale: LocaleType
}

export interface WizardState {
  currentStep: number
  identity: IdentityData
  contacts: ContactsData
  branding: BrandingData
  acknowledged: boolean
  
  // Uniqueness validation state
  validationState: {
    tenant_name: "idle" | "checking" | "available" | "taken" | "error"
    company_fullname: "idle" | "checking" | "available" | "taken" | "error"
    company_shortname: "idle" | "checking" | "available" | "taken" | "error"
    national_code: "idle" | "checking" | "available" | "taken" | "error"
  }
  validationMessages: {
    tenant_name?: string
    company_fullname?: string
    company_shortname?: string
    national_code?: string
  }
  normalizedValues: {
    tenant_name?: string
    company_fullname?: string
    company_shortname?: string
    national_code?: string
  }
  
  // Submission state
  isSubmitting: boolean
  submitProgress: {
    tenant: "pending" | "in-progress" | "done" | "error"
    logo: "pending" | "in-progress" | "done" | "error" | "skipped"
    favicon: "pending" | "in-progress" | "done" | "error" | "skipped"
  }
  createdTenantId: string | null
  submitError: string | null
  
  // Actions
  setStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  setIdentity: (data: Partial<IdentityData>) => void
  setContacts: (data: Partial<ContactsData>) => void
  setBranding: (data: Partial<BrandingData>) => void
  setAcknowledged: (value: boolean) => void
  setValidationState: (
    field: keyof WizardState["validationState"],
    state: WizardState["validationState"][keyof WizardState["validationState"]]
  ) => void
  setValidationMessage: (
    field: keyof WizardState["validationMessages"],
    message: string | undefined
  ) => void
  setNormalizedValue: (
    field: keyof WizardState["normalizedValues"],
    value: string | undefined
  ) => void
  setIsSubmitting: (value: boolean) => void
  setSubmitProgress: (progress: Partial<WizardState["submitProgress"]>) => void
  setCreatedTenantId: (id: string | null) => void
  setSubmitError: (error: string | null) => void
  reset: () => void
}

const initialState = {
  currentStep: 0,
  identity: {
    tenant_name: "",
    company_fullname: "",
    company_shortname: "",
    national_code: "",
    tenant_type: "" as TenantType | "",
  },
  contacts: {
    country: "IR",
    province: "",
    city: "",
    postal_code: "",
    street: "",
    phone: "",
    email: "",
    website: "",
  },
  branding: {
    logo: null as File | null,
    favicon: null as File | null,
    default_locale: "fa" as LocaleType,
  },
  acknowledged: false,
  validationState: {
    tenant_name: "idle" as const,
    company_fullname: "idle" as const,
    company_shortname: "idle" as const,
    national_code: "idle" as const,
  },
  validationMessages: {},
  normalizedValues: {},
  isSubmitting: false,
  submitProgress: {
    tenant: "pending" as const,
    logo: "pending" as const,
    favicon: "pending" as const,
  },
  createdTenantId: null as string | null,
  submitError: null as string | null,
}

// Custom storage that handles File objects (which can't be serialized)
const wizardStorage = createJSONStorage<WizardState>(() => sessionStorage, {
  reviver: (_key, value) => {
    return value
  },
  replacer: (key, value) => {
    // Don't persist File objects
    if (key === "logo" || key === "favicon") {
      return null
    }
    return value
  },
})

export const useWizardStore = create<WizardState>()(
  persist(
    (set) => ({
      ...initialState,
      
      setStep: (step) => set({ currentStep: step }),
      
      nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 4) })),
      
      prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 0) })),
      
      setIdentity: (data) =>
        set((state) => ({
          identity: { ...state.identity, ...data },
        })),
      
      setContacts: (data) =>
        set((state) => ({
          contacts: { ...state.contacts, ...data },
        })),
      
      setBranding: (data) =>
        set((state) => ({
          branding: { ...state.branding, ...data },
        })),
      
      setAcknowledged: (value) => set({ acknowledged: value }),
      
      setValidationState: (field, state) =>
        set((s) => ({
          validationState: { ...s.validationState, [field]: state },
        })),
      
      setValidationMessage: (field, message) =>
        set((s) => ({
          validationMessages: { ...s.validationMessages, [field]: message },
        })),
      
      setNormalizedValue: (field, value) =>
        set((s) => ({
          normalizedValues: { ...s.normalizedValues, [field]: value },
        })),
      
      setIsSubmitting: (value) => set({ isSubmitting: value }),
      
      setSubmitProgress: (progress) =>
        set((state) => ({
          submitProgress: { ...state.submitProgress, ...progress },
        })),
      
      setCreatedTenantId: (id) => set({ createdTenantId: id }),
      
      setSubmitError: (error) => set({ submitError: error }),
      
      reset: () => set(initialState),
    }),
    {
      name: "dynova.tenant_wizard.draft",
      storage: wizardStorage,
      partialize: (state) => ({
        currentStep: state.currentStep,
        identity: state.identity,
        contacts: state.contacts,
        branding: {
          logo: null,
          favicon: null,
          default_locale: state.branding.default_locale,
        },
        acknowledged: state.acknowledged,
        validationState: state.validationState,
        validationMessages: state.validationMessages,
        normalizedValues: state.normalizedValues,
        isSubmitting: false,
        submitProgress: initialState.submitProgress,
        createdTenantId: null,
        submitError: null,
      }),
    }
  )
)
