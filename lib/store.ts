import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TenantIdentity {
  tenant_name: string;
  tenant_type: 'enterprise' | 'startup' | 'nonprofit';
}

export interface TenantContacts {
  address: string;
  phone: string;
  email: string;
}

export interface TenantBranding {
  logo?: File;
  favicon?: File;
}

export interface WizardState {
  // Form data
  identity: TenantIdentity;
  contacts: TenantContacts;
  branding: TenantBranding;
  
  // UI state
  currentStep: number;
  isDirty: boolean;
  isSubmitting: boolean;
  error: string | null;
  
  // Actions
  setIdentity: (data: TenantIdentity) => void;
  setContacts: (data: TenantContacts) => void;
  setBranding: (data: TenantBranding) => void;
  setCurrentStep: (step: number) => void;
  setIsDirty: (dirty: boolean) => void;
  setIsSubmitting: (submitting: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  identity: {
    tenant_name: '',
    tenant_type: 'enterprise' as const,
  },
  contacts: {
    address: '',
    phone: '',
    email: '',
  },
  branding: {},
  currentStep: 1,
  isDirty: false,
  isSubmitting: false,
  error: null,
};

export const useWizardStore = create<WizardState>()(
  persist(
    (set) => ({
      ...initialState,
      setIdentity: (data) => set({ identity: data, isDirty: true }),
      setContacts: (data) => set({ contacts: data, isDirty: true }),
      setBranding: (data) => set({ branding: data, isDirty: true }),
      setCurrentStep: (step) => set({ currentStep: step }),
      setIsDirty: (dirty) => set({ isDirty: dirty }),
      setIsSubmitting: (submitting) => set({ isSubmitting: submitting }),
      setError: (error) => set({ error }),
      reset: () => set(initialState),
    }),
    {
      name: 'wizard-storage',
      storage: typeof window !== 'undefined' ? localStorage : undefined,
    }
  )
);
