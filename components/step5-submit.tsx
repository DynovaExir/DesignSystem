'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { apiClient } from '@/lib/api-client';
import { useWizardStore } from '@/lib/store';
import { normalizePhoneNumber } from '@/lib/utils';

interface Step5Props {
  onBack: () => void;
  onSuccess: (tenantId: string) => void;
}

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

export function Step5Submit({ onBack, onSuccess }: Step5Props) {
  const { t } = useTranslation();
  const { identity, contacts, branding } = useWizardStore();
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [tenantId, setTenantId] = useState<string | null>(null);

  const handleSubmit = async () => {
    setStatus('submitting');
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append('tenant_name', identity.tenant_name);
      formData.append('tenant_type', identity.tenant_type);
      formData.append('address', contacts.address);
      formData.append('phone', normalizePhoneNumber(contacts.phone));
      formData.append('email', contacts.email);

      if (branding.logo) {
        formData.append('logo', branding.logo);
      }
      if (branding.favicon) {
        formData.append('favicon', branding.favicon);
      }

      const response = await fetch('/api/tenants/create', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          setErrorMessage(t('error.conflict'));
        } else {
          setErrorMessage(data.detail || t('error.global'));
        }
        setStatus('error');
        return;
      }

      setTenantId(data.id);
      setStatus('success');
      onSuccess(data.id);
    } catch (error) {
      setErrorMessage(t('error.networkError'));
      setStatus('error');
    }
  };

  useEffect(() => {
    if (status === 'idle') {
      handleSubmit();
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">{t('wizard.step5')}</h2>
        <p className="text-sm text-muted-foreground">
          Creating your tenant...
        </p>
      </div>

      <div className="min-h-48 flex items-center justify-center">
        {status === 'submitting' && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full border-4 border-border border-t-primary animate-spin" />
            <p className="text-sm text-muted-foreground">Processing your request...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-12 h-12 rounded-full bg-green-600/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">{t('success.created')}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Tenant ID: <span className="font-mono text-xs">{tenantId}</span>
              </p>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center gap-4 text-center max-w-md">
            <div className="w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">Something went wrong</p>
              <p className="text-sm text-destructive mt-1">{errorMessage}</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        {status !== 'submitting' && (
          <button
            onClick={onBack}
            disabled={status === 'submitting'}
            className="flex-1 btn btn-outline"
          >
            {t('wizard.back')}
          </button>
        )}
        {status === 'error' && (
          <button
            onClick={handleSubmit}
            className="flex-1 btn btn-primary"
          >
            Retry
          </button>
        )}
        {status === 'success' && (
          <button
            onClick={() => window.location.href = '/'}
            className="flex-1 btn btn-primary"
          >
            Back to Home
          </button>
        )}
      </div>
    </div>
  );
}
