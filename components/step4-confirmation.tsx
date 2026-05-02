'use client';

import { useTranslation } from 'react-i18next';
import { useWizardStore } from '@/lib/store';

interface Step4Props {
  onNext: () => void;
  onBack: () => void;
  onEdit: (step: number) => void;
}

export function Step4Confirmation({ onNext, onBack, onEdit }: Step4Props) {
  const { t } = useTranslation();
  const { identity, contacts, branding } = useWizardStore();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">{t('wizard.step4')}</h2>
        <p className="text-sm text-muted-foreground">
          Review your information before creating the tenant.
        </p>
      </div>

      {/* Identity Section */}
      <div className="border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-foreground">{t('confirm.section.identity')}</h3>
          <button
            onClick={() => onEdit(1)}
            className="text-sm text-primary hover:text-primary/80 font-medium"
          >
            {t('confirm.edit')}
          </button>
        </div>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground">{t('form.tenant_name')}</p>
            <p className="text-sm text-foreground font-medium">{identity.tenant_name}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t('form.tenant_type')}</p>
            <p className="text-sm text-foreground font-medium capitalize">{identity.tenant_type}</p>
          </div>
        </div>
      </div>

      {/* Contacts Section */}
      <div className="border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-foreground">{t('confirm.section.contact')}</h3>
          <button
            onClick={() => onEdit(2)}
            className="text-sm text-primary hover:text-primary/80 font-medium"
          >
            {t('confirm.edit')}
          </button>
        </div>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground">{t('form.address')}</p>
            <p className="text-sm text-foreground font-medium whitespace-pre-wrap">{contacts.address}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t('form.phone')}</p>
            <p className="text-sm text-foreground font-medium">{contacts.phone}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t('form.email')}</p>
            <p className="text-sm text-foreground font-medium">{contacts.email}</p>
          </div>
        </div>
      </div>

      {/* Branding Section */}
      <div className="border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-foreground">{t('confirm.section.branding')}</h3>
          <button
            onClick={() => onEdit(3)}
            className="text-sm text-primary hover:text-primary/80 font-medium"
          >
            {t('confirm.edit')}
          </button>
        </div>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground">{t('form.logo')}</p>
            <p className="text-sm text-foreground font-medium">
              {branding.logo ? branding.logo.name : 'Not provided'}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t('form.favicon')}</p>
            <p className="text-sm text-foreground font-medium">
              {branding.favicon ? branding.favicon.name : 'Not provided'}
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 btn btn-outline"
        >
          {t('wizard.back')}
        </button>
        <button
          onClick={onNext}
          className="flex-1 btn btn-primary"
        >
          {t('wizard.next')}
        </button>
      </div>
    </div>
  );
}
