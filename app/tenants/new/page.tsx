"use client"

import dynamic from "next/dynamic"

// Code-split the wizard
const WizardShell = dynamic(
  () => import("@/components/wizard/wizard-shell").then((mod) => mod.WizardShell),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    ),
  }
)

export default function NewTenantPage() {
  return <WizardShell />
}
