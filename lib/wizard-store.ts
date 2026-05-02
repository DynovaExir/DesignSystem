import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import {
  type WizardStep,
  type IdentityFormData,
  type ContactsFormData,
  type BrandingFormData,
  TenantType,
  DefaultLocale,
  WIZARD_STEPS,
  getStepIndex,
} from "./schemas"

interface WizardState {
  // Current step
  currentStep: WizardStep
  
  // Form data per step
  identity: IdentityFormData
  contacts: ContactsFormData
  branding: BrandingFormData
  
  // Confirmation acknowledgement
  acknowledged: boolean
  
  // Submission state
  isSubmitting: boolean
  submitProgress: {
    creating: "idle" | "loading" | "success" | "error"
    uploadingLogo: "idle" | "loading" | "success" | "error"
    uploadingFavicon: "idle" | "loading" | "success" | "error"
    completing: "idle" | "loading" | "success" | "error"
  }
  createdTenantId: string | null
  submitError: string | null
  
  // Actions
  setStep: (step: WizardStep) => void
  nextStep: () => void
  prevStep: () => void
  goToStep: (step: WizardStep) => void
  
  setIdentity: (data: Partial<IdentityFormData>) => void
  setContacts: (data: Partial<ContactsFormData>) => void
  setBranding: (data: Partial<BrandingFormData>) => void
  setAcknowledged: (acknowledged: boolean) => void
  
  setSubmitting: (isSubmitting: boolean) => void
  setSubmitProgress: (progress: Partial<WizardState["submitProgress"]>) => void
  setCreatedTenantId: (id: string | null) => void
  setSubmitError: (error: string | null) => void
  
  reset: () => void
  canProceed: (step: WizardStep) => boolean
}

const initialIdentity: IdentityFormData = {
  tenant_name: "",
  company_fullname: "",
  company_shortname: "",
  national_code: "",
  tenant_type: TenantType.HOLDING,
}

const initialContacts: ContactsFormData = {
  address: {
    country: "",
    province: "",
    city: "",
    postal_code: "",
    street: "",
  },
  phone: "",
  email: "",
  website: "",
}

const initialBranding: BrandingFormData = {
  logo: null,
  favicon: null,
  default_locale: DefaultLocale.FA,
}

const initialSubmitProgress = {
  creating: "idle" as const,
  uploadingLogo: "idle" as const,
  uploadingFavicon: "idle" as const,
  completing: "idle" as const,
}

export const useWizardStore = create<WizardState>()(
  persist(
    (set, get) => ({
      currentStep: "identity",
      identity: initialIdentity,
      contacts: initialContacts,
      branding: initialBranding,
      acknowledged: false,
      isSubmitting: false,
      submitProgress: initialSubmitProgress,
      createdTenantId: null,
      submitError: null,

      setStep: (step) => set({ currentStep: step }),
      
      nextStep: () => {
        const { currentStep } = get()
        const currentIndex = getStepIndex(currentStep)
        if (currentIndex < WIZARD_STEPS.length - 1) {
          set({ currentStep: WIZARD_STEPS[currentIndex + 1] })
        }
      },
      
      prevStep: () => {
        const { currentStep } = get()
        const currentIndex = getStepIndex(currentStep)
        if (currentIndex > 0) {
          set({ currentStep: WIZARD_STEPS[currentIndex - 1] })
        }
      },
      
      goToStep: (step) => set({ currentStep: step }),

      setIdentity: (data) =>
        set((state) => ({
          identity: { ...state.identity, ...data },
        })),

      setContacts: (data) =>
        set((state) => ({
          contacts: {
            ...state.contacts,
            ...data,
            address: {
              ...state.contacts.address,
              ...(data.address || {}),
            },
          },
        })),

      setBranding: (data) =>
        set((state) => ({
          branding: { ...state.branding, ...data },
        })),

      setAcknowledged: (acknowledged) => set({ acknowledged }),
      
      setSubmitting: (isSubmitting) => set({ isSubmitting }),
      
      setSubmitProgress: (progress) =>
        set((state) => ({
          submitProgress: { ...state.submitProgress, ...progress },
        })),
      
      setCreatedTenantId: (id) => set({ createdTenantId: id }),
      
      setSubmitError: (error) => set({ submitError: error }),

      reset: () =>
        set({
          currentStep: "identity",
          identity: initialIdentity,
          contacts: initialContacts,
          branding: initialBranding,
          acknowledged: false,
          isSubmitting: false,
          submitProgress: initialSubmitProgress,
          createdTenantId: null,
          submitError: null,
        }),

      canProceed: (step) => {
        const state = get()
        switch (step) {
          case "identity":
            return (
              state.identity.tenant_name.length >= 3 &&
              state.identity.company_fullname.length >= 3 &&
              state.identity.company_shortname.length >= 2 &&
              state.identity.national_code.length >= 1 &&
              !!state.identity.tenant_type
            )
          case "contacts":
            return (
              !!state.contacts.address.country &&
              !!state.contacts.address.province &&
              !!state.contacts.address.city &&
              !!state.contacts.address.postal_code &&
              !!state.contacts.address.street &&
              !!state.contacts.phone &&
              !!state.contacts.email
            )
          case "branding":
            return true // Branding is optional
          case "confirm":
            return state.acknowledged
          default:
            return true
        }
      },
    }),
    {
      name: "dynova.tenant_wizard.draft",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        currentStep: state.currentStep,
        identity: state.identity,
        contacts: state.contacts,
        branding: {
          ...state.branding,
          // Don't persist file objects
          logo: state.branding.logo ? { file: null, preview: state.branding.logo.preview } : null,
          favicon: state.branding.favicon ? { file: null, preview: state.branding.favicon.preview } : null,
        },
        acknowledged: state.acknowledged,
      }),
    }
  )
)
