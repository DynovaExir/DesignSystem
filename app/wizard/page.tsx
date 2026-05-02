'use client';

import { useState } from 'react';
import { AppShell } from '@/components/app-shell';
import { LocaleToggle } from '@/components/locale-toggle';
import { WizardContainer } from '@/components/wizard-container';
import Link from 'next/link';

export default function WizardPage() {
  const [completed, setCompleted] = useState(false);
  const [tenantId, setTenantId] = useState<string | null>(null);

  const handleSuccess = (id: string) => {
    setTenantId(id);
    setCompleted(true);
  };

  if (completed && tenantId) {
    return (
      <AppShell
        header={
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-foreground">
              Dynova
            </Link>
            <LocaleToggle />
          </div>
        }
      >
        <div className="flex flex-col items-center justify-center min-h-96 gap-6">
          <div className="w-16 h-16 rounded-full bg-green-600/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">Tenant Created!</h1>
            <p className="text-muted-foreground mb-6">
              Your tenant has been successfully created.
            </p>
            <div className="bg-muted p-4 rounded-lg mb-6">
              <p className="text-xs text-muted-foreground">Tenant ID</p>
              <p className="font-mono text-sm text-foreground break-all">{tenantId}</p>
            </div>
            <Link href="/" className="btn btn-primary">
              Back to Home
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      header={
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-foreground">
            Dynova
          </Link>
          <LocaleToggle />
        </div>
      }
    >
      <WizardContainer onSuccess={handleSuccess} />
    </AppShell>
  );
}
