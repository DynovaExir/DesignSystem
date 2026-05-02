'use client';

import { useRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormInput } from '@/components/form-input';
import { FormSelect } from '@/components/form-select';
import { UniquenessIndicator } from '@/components/uniqueness-indicator';
import { useUniquenessChecker } from '@/lib/hooks';
import { useWizardStore, type TenantIdentity } from '@/lib/store';

interface Step1Props {
  onNext: () => void;
}

export function Step1TenantIdentity({ onNext }: Step1Props) {
  const { t, i18n } = useTranslation();
  const identity = useWizardStore((state) => state.identity);
  const setIdentity = useWizardStore((state) => state.setIdentity);
  
  const [formData, setFormData] = useState<TenantIdentity>(identity);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { status: nameStatus, isAvailable, check: checkName } = useUniquenessChecker({
    field: 'tenant_name',
    context: formData.tenant_type,
  });

  const nameCheckTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (nameCheckTimeoutRef.current) {
      clearTimeout(nameCheckTimeoutRef.current);
    }
    
    if (formData.tenant_name.length >= 3) {
      nameCheckTimeoutRef.current = setTimeout(() => {
        checkName(formData.tenant_name);
      }, 300);
    }
    
    return () => {
      if (nameCheckTimeoutRef.current) {
        clearTimeout(nameCheckTimeoutRef.current);
      }
    };
  }, [formData.tenant_name, checkName]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.tenant_name) {
      newErrors.tenant_name = t('form.tenant_name.required');
    } else if (formData.tenant_name.length < 3) {
      newErrors.tenant_name = t('form.tenant_name.minLength');
    } else if (formData.tenant_name.length > 50) {
      newErrors.tenant_name = t('form.tenant_name.maxLength');
    } else if (nameStatus === 'taken') {
      newErrors.tenant_name = t('form.tenant_name.taken');
    } else if (nameStatus === 'checking') {
      newErrors.tenant_name = t('form.tenant_name.checking');
    }

    if (!formData.tenant_type) {
      newErrors.tenant_type = t('form.tenant_type.required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      setIdentity(formData);
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">{t('wizard.step1')}</h2>
        <p className="text-sm text-muted-foreground">
          Provide your tenant identity information. Tenant names are globally unique and cannot be changed later.
        </p>
      </div>

      <FormInput
        label={t('form.tenant_name')}
        placeholder={t('form.tenant_name.placeholder')}
        value={formData.tenant_name}
        onChange={(e) => setFormData({ ...formData, tenant_name: e.target.value })}
        error={errors.tenant_name}
        indicator={<UniquenessIndicator status={nameStatus} showText={false} />}
        disabled={false}
        dir={i18n.language === 'fa' ? 'rtl' : 'ltr'}
      />

      <FormSelect
        label={t('form.tenant_type')}
        value={formData.tenant_type}
        onChange={(e) => setFormData({ ...formData, tenant_type: e.target.value as 'enterprise' | 'startup' | 'nonprofit' })}
        error={errors.tenant_type}
        options={[
          { value: 'enterprise', label: t('form.tenant_type.options.enterprise') },
          { value: 'startup', label: t('form.tenant_type.options.startup') },
          { value: 'nonprofit', label: t('form.tenant_type.options.nonprofit') },
        ]}
      />

      <button
        onClick={handleNext}
        disabled={nameStatus === 'checking' || nameStatus === 'cooldown'}
        className="w-full btn btn-primary"
      >
        {t('wizard.next')}
      </button>
    </div>
  );
}
