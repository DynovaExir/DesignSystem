'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormFileUpload } from '@/components/form-file-upload';
import { useWizardStore, type TenantBranding } from '@/lib/store';

interface Step3Props {
  onNext: () => void;
  onBack: () => void;
}

export function Step3Branding({ onNext, onBack }: Step3Props) {
  const { t } = useTranslation();
  const branding = useWizardStore((state) => state.branding);
  const setBranding = useWizardStore((state) => state.setBranding);
  
  const [formData, setFormData] = useState<TenantBranding>(branding);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.logo) {
      if (!['image/png', 'image/svg+xml'].includes(formData.logo.type)) {
        newErrors.logo = t('form.logo.error');
      }
      if (formData.logo.size > 2 * 1024 * 1024) {
        newErrors.logo = 'Logo must be smaller than 2MB';
      }
    }

    if (formData.favicon) {
      if (!['image/png', 'image/x-icon', 'image/vnd.microsoft.icon'].includes(formData.favicon.type)) {
        newErrors.favicon = t('form.favicon.error');
      }
      if (formData.favicon.size > 500 * 1024) {
        newErrors.favicon = 'Favicon must be smaller than 500KB';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      setBranding(formData);
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">{t('wizard.step3')}</h2>
        <p className="text-sm text-muted-foreground">
          Upload your organization&apos;s branding assets (optional).
        </p>
      </div>

      <FormFileUpload
        label={t('form.logo')}
        accept="image/png,image/svg+xml"
        maxSize={2 * 1024 * 1024}
        value={formData.logo || null}
        onChange={(file) => setFormData({ ...formData, logo: file || undefined })}
        error={errors.logo}
        helpText={t('form.logo.hint')}
      />

      <FormFileUpload
        label={t('form.favicon')}
        accept="image/png,image/x-icon,image/vnd.microsoft.icon"
        maxSize={500 * 1024}
        value={formData.favicon || null}
        onChange={(file) => setFormData({ ...formData, favicon: file || undefined })}
        error={errors.favicon}
        helpText={t('form.favicon.hint')}
      />

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 btn btn-outline"
        >
          {t('wizard.back')}
        </button>
        <button
          onClick={handleNext}
          className="flex-1 btn btn-primary"
        >
          {t('wizard.next')}
        </button>
      </div>
    </div>
  );
}
