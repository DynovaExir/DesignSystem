"use client";

import { useState, useCallback, useEffect } from "react";
import { X, Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { StepIndicator } from "./step-indicator";
import { Step1BaseInfo } from "./steps/step-1-base-info";
import { Step2SupplementaryInfo } from "./steps/step-2-supplementary-info";
import { Step3BrandContact } from "./steps/step-3-brand-contact";
import { Step4Confirmation } from "./steps/step-4-confirmation";

interface TenantWizardPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const steps = [
  { id: 1, label: "اطلاعات پایه" },
  { id: 2, label: "اطلاعات تکمیلی" },
  { id: 3, label: "اطلاعات برند و تماس" },
];

// Simulated existing data for validation demo
// Try entering "نمونه" for shortName to see error state
// Try entering "10101234567" for nationalCode when company is selected to see error
const existingShortNames = ["نمونه", "شرکت آزمون"];
const existingNationalCodesByType = {
  company: ["10101234567"],
  holding: ["10109876543"],
};

export function TenantWizardPanel({ isOpen, onClose }: TenantWizardPanelProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [validationError, setValidationError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data
  const [step1Data, setStep1Data] = useState({
    fullName: "",
    country: "",
    shortName: "",
    nationalCode: "",
    technicalName: "",
    tenantType: null as "company" | "holding" | null,
  });

  const [step2Data, setStep2Data] = useState({
    registrationType: "",
    registrationDate: "",
    tags: [] as string[],
  });

  const [step3Data, setStep3Data] = useState({
    email: "",
    phone: "",
    website: "",
    logo: null as File | null,
    logoPreview: "",
    favicon: null as File | null,
    faviconPreview: "",
  });

  const [fileErrors, setFileErrors] = useState<{
    logo?: string;
    favicon?: string;
  }>({});

  const handleFileError = (field: "logo" | "favicon", error: string | undefined) => {
    setFileErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  };

  // Validation states
  const [step1Validation, setStep1Validation] = useState<{
    fullName?: { error?: string; success?: boolean };
    shortName?: { error?: string; success?: boolean };
    nationalCode?: { error?: string; success?: boolean };
  }>({});

  // Single field validation (on blur)
  const validateField = useCallback(
    (field: "fullName" | "shortName" | "nationalCode") => {
      setStep1Validation((prev) => {
        const newValidation = { ...prev };

        if (field === "fullName") {
          if (step1Data.fullName) {
            newValidation.fullName = { success: true };
          } else {
            newValidation.fullName = undefined;
          }
        }

        if (field === "shortName") {
          if (step1Data.shortName) {
            if (existingShortNames.includes(step1Data.shortName)) {
              newValidation.shortName = { error: "این مقدار قبلاً ثبت شده است" };
            } else {
              newValidation.shortName = { success: true };
            }
          } else {
            newValidation.shortName = undefined;
          }
        }

        if (field === "nationalCode") {
          if (step1Data.nationalCode && step1Data.tenantType) {
            const existingCodes =
              existingNationalCodesByType[step1Data.tenantType] || [];
            if (existingCodes.includes(step1Data.nationalCode)) {
              newValidation.nationalCode = {
                error: "این مقدار قبلاً ثبت شده است",
              };
            } else {
              // Check if exists in opposite type (show success with no error)
              newValidation.nationalCode = { success: true };
            }
          } else if (step1Data.nationalCode) {
            // Has value but no type selected yet
            newValidation.nationalCode = { success: true };
          } else {
            newValidation.nationalCode = undefined;
          }
        }

        return newValidation;
      });
    },
    [step1Data]
  );

  // Re-validate national code when tenant type changes
  useEffect(() => {
    if (step1Data.nationalCode && step1Data.tenantType) {
      validateField("nationalCode");
    }
  }, [step1Data.tenantType]);

  const canProceed = () => {
    if (currentStep === 1) {
      return (
        step1Data.fullName &&
        step1Data.country &&
        step1Data.shortName &&
        step1Data.nationalCode &&
        step1Data.technicalName &&
        step1Data.tenantType &&
        !step1Validation.shortName?.error &&
        !step1Validation.nationalCode?.error
      );
    }
    if (currentStep === 2) {
      return step2Data.registrationType && step2Data.registrationDate;
    }
    if (currentStep === 3) {
      return step3Data.email && step3Data.phone;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!confirmed) return;

    setIsSubmitting(true);
    setValidationError(undefined);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simulate random validation error (for demo)
    if (Math.random() > 0.7) {
      setValidationError(
        "تداخل داده‌ای شناسایی شد. لطفاً به مرحله قبل بازگردید و اطلاعات را اصلاح کنید."
      );
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    onClose();
  };

  const handleClose = () => {
    // Reset form state
    setCurrentStep(1);
    setConfirmed(false);
    setValidationError(undefined);
    setStep1Data({
      fullName: "",
      country: "",
      shortName: "",
      nationalCode: "",
      technicalName: "",
      tenantType: null,
    });
    setStep2Data({
      registrationType: "",
      registrationDate: "",
      tags: [],
    });
    setStep3Data({
      email: "",
      phone: "",
      website: "",
      logo: null,
      logoPreview: "",
      favicon: null,
      faviconPreview: "",
    });
    setStep1Validation({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-neutral-900/30 z-40" />

      {/* Panel */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-card shadow-lg transition-all duration-300",
          isExpanded ? "w-full" : "w-[560px]"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleClose}
              className="rounded-lg p-2 hover:bg-muted transition-colors"
              aria-label="بستن"
            >
              <X className="h-5 w-5 text-foreground" />
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="rounded-lg p-2 hover:bg-muted transition-colors"
              aria-label={isExpanded ? "کوچک کردن" : "بزرگ کردن"}
            >
              {isExpanded ? (
                <Minimize2 className="h-5 w-5 text-foreground" />
              ) : (
                <Maximize2 className="h-5 w-5 text-foreground" />
              )}
            </button>
          </div>
          <h2 className="text-lg font-semibold text-foreground">ساخت سازمان</h2>
        </div>

        {/* Step Indicator */}
        {currentStep < 4 && (
          <StepIndicator steps={steps} currentStep={currentStep} />
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {currentStep === 1 && (
            <Step1BaseInfo
              data={step1Data}
              onChange={setStep1Data}
              validation={step1Validation}
              onValidate={validateField}
            />
          )}
          {currentStep === 2 && (
            <Step2SupplementaryInfo
              data={step2Data}
              onChange={setStep2Data}
              tenantType={step1Data.tenantType}
            />
          )}
          {currentStep === 3 && (
            <Step3BrandContact
              data={step3Data}
              onChange={setStep3Data}
              fileErrors={fileErrors}
              onFileError={handleFileError}
            />
          )}
          {currentStep === 4 && (
            <Step4Confirmation
              formData={{
                step1: step1Data,
                step2: step2Data,
                step3: step3Data,
              }}
              confirmed={confirmed}
              onConfirmChange={setConfirmed}
              validationError={validationError}
            />
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-border px-6 py-4">
          <div>
            {currentStep > 1 && (
              <Button variant="tertiary" onClick={handlePrevious}>
                {currentStep === 4 ? "بازگشت" : "مرحله قبل"}
              </Button>
            )}
          </div>
          <div>
            {currentStep < 4 ? (
              <Button
                variant="default"
                onClick={handleNext}
                disabled={!canProceed()}
              >
                مرحله بعد
              </Button>
            ) : (
              <Button
                variant="default"
                onClick={handleSubmit}
                disabled={!confirmed || isSubmitting}
              >
                {isSubmitting ? "در حال ارسال..." : "تایید ساخت"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
