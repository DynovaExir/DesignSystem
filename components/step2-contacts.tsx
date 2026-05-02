'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormInput } from '@/components/form-input';
import { FormTextarea } from '@/components/form-textarea';
import { isValidEmail, isValidPhoneNumber, formatPhoneNumber, fromPersianDigits } from '@/lib/utils';
import { useWizardStore, type TenantContacts } from '@/lib/store';

interface Step2Props {
  onNext: () => void;
  onBack: () => void;
}

export function Step2Contacts({ onNext, onBack }: Step2Props) {
  const { t, i18n } = useTranslation();
  const contacts = useWizardStore((state) => state.contacts);
  const setContacts = useWizardStore((state) => state.setContacts);
  
  const [formData, setFormData] = useState<TenantContacts>(contacts);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.address) {
      newErrors.address = t('form.address.required');
    }

    if (!formData.phone) {
      newErrors.phone = t('form.phone.required');
    } else if (!isValidPhoneNumber(formData.phone)) {
      newErrors.phone = t('form.phone.invalid');
    }

    if (!formData.email) {
      newErrors.email = t('form.email.required');
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = t('form.email.invalid');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      setContacts(formData);
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">{t('wizard.step2')}</h2>
        <p className="text-sm text-muted-foreground">
          Provide your organization&apos;s contact information.
        </p>
      </div>

      <FormTextarea
        label={t('form.address')}
        placeholder={t('form.address.placeholder')}
        value={formData.address}
        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        error={errors.address}
        rows={3}
        dir={i18n.language === 'fa' ? 'rtl' : 'ltr'}
      />

      <FormInput
        label={t('form.phone')}
        placeholder={t('form.phone.placeholder')}
        type="tel"
        value={formData.phone}
        onChange={(e) => {
          let value = e.target.value;
          value = formatPhoneNumber(value);
          setFormData({ ...formData, phone: value });
        }}
        error={errors.phone}
        dir={i18n.language === 'fa' ? 'rtl' : 'ltr'}
      />

      <FormInput
        label={t('form.email')}
        placeholder={t('form.email.placeholder')}
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        error={errors.email}
        dir={i18n.language === 'fa' ? 'rtl' : 'ltr'}
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
