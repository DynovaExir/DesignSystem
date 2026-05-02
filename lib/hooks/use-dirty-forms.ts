"use client"

import { create } from "zustand"

interface DirtyFormsState {
  dirtyForms: Set<string>
  registerDirtyForm: (id: string) => void
  unregisterDirtyForm: (id: string) => void
  hasDirtyForms: () => boolean
  clearAllDirtyForms: () => void
}

export const useDirtyFormsStore = create<DirtyFormsState>((set, get) => ({
  dirtyForms: new Set(),
  
  registerDirtyForm: (id) =>
    set((state) => {
      const newSet = new Set(state.dirtyForms)
      newSet.add(id)
      return { dirtyForms: newSet }
    }),
  
  unregisterDirtyForm: (id) =>
    set((state) => {
      const newSet = new Set(state.dirtyForms)
      newSet.delete(id)
      return { dirtyForms: newSet }
    }),
  
  hasDirtyForms: () => get().dirtyForms.size > 0,
  
  clearAllDirtyForms: () => set({ dirtyForms: new Set() }),
}))

export function useDirtyForm(formId: string, isDirty: boolean) {
  const { registerDirtyForm, unregisterDirtyForm } = useDirtyFormsStore()
  
  if (isDirty) {
    registerDirtyForm(formId)
  } else {
    unregisterDirtyForm(formId)
  }
  
  return {
    unregister: () => unregisterDirtyForm(formId),
  }
}
