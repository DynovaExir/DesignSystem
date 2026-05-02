'use client';

import { useTranslation } from 'react-i18next';

interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

export function WizardProgress({ currentStep, totalSteps, steps }: WizardProgressProps) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'fa';

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-foreground">
          {t('wizard.title')}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t('wizard.progress', { current: currentStep, total: totalSteps })}
        </p>
      </div>

      <div className="flex gap-2">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <div key={step} className="flex items-center gap-2">
              <div
                className={`
                  flex items-center justify-center w-8 h-8 rounded-full font-medium text-sm transition-colors
                  ${isActive
                    ? 'bg-primary text-primary-foreground'
                    : isCompleted
                      ? 'bg-green-600 text-white'
                      : 'bg-muted text-muted-foreground'
                  }
                `}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  stepNumber
                )}
              </div>
              <span
                className={`text-sm font-medium hidden sm:inline ${
                  isActive ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {step}
              </span>
              {stepNumber < steps.length && (
                <div className="w-8 h-1 rounded-full mx-1 bg-border" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
