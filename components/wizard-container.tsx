'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '@/lib/i18n';
import { WizardProgress } from '@/components/wizard-progress';
import { Step1TenantIdentity } from '@/components/step1-identity';
import { Step2Contacts } from '@/components/step2-contacts';
import { Step3Branding } from '@/components/step3-branding';
import { Step4Confirmation } from '@/components/step4-confirmation';
import { Step5Submit } from '@/components/step5-submit';
import { useWizardStore } from '@/lib/store';

const STEPS = [
  'Tenant Identity',
  'Contact Information',
  'Branding',
  'Confirm Details',
  'Submit',
];

interface WizardContainerProps {
  onSuccess: (tenantId: string) => void;
}

export function WizardContainer({ onSuccess }: WizardContainerProps) {
  const { t } = useTranslation();
  const currentStep = useWizardStore((state) => state.currentStep);
  const setCurrentStep = useWizardStore((state) => state.setCurrentStep);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Initialize i18n
    const preferredLang = localStorage.getItem('preferred-language') || 'en';
    i18n.changeLanguage(preferredLang);
    document.documentElement.lang = preferredLang;
    document.documentElement.dir = preferredLang === 'fa' ? 'rtl' : 'ltr';
  }, []);

  if (!mounted) {
    return null;
  }

  const handleNext = () => {
    setCurrentStep(Math.min(currentStep + 1, STEPS.length));
  };

  const handleBack = () => {
    setCurrentStep(Math.max(currentStep - 1, 1));
  };

  const handleEdit = (step: number) => {
    setCurrentStep(step);
  };

  const handleSuccess = (tenantId: string) => {
    onSuccess(tenantId);
  };

  return (
    <div className="space-y-8">
      <WizardProgress
        currentStep={currentStep}
        totalSteps={STEPS.length}
        steps={STEPS}
      />

      {currentStep === 1 && <Step1TenantIdentity onNext={handleNext} />}
      {currentStep === 2 && <Step2Contacts onNext={handleNext} onBack={handleBack} />}
      {currentStep === 3 && <Step3Branding onNext={handleNext} onBack={handleBack} />}
      {currentStep === 4 && (
        <Step4Confirmation onNext={handleNext} onBack={handleBack} onEdit={handleEdit} />
      )}
      {currentStep === 5 && <Step5Submit onBack={handleBack} onSuccess={handleSuccess} />}
    </div>
  );
}
