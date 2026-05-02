"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n-context";
import { exchangeCode } from "@/lib/auth-mock";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { DynovaLogo } from "@/components/common/DynovaLogo";
import { AlertCircle } from "lucide-react";

export function CallbackLoader() {
  const router = useRouter();
  const { t } = useI18n();

  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Mock code exchange
        const result = await exchangeCode("mock-code");
        if (result.success) {
          // Navigate to app dashboard
          router.push("/app");
        } else {
          setIsError(true);
          setIsLoading(false);
        }
      } catch {
        setIsError(true);
        setIsLoading(false);
      }
    };

    handleCallback();
  }, [router]);

  const handleTryAgain = () => {
    router.push("/login");
  };

  const handleBack = () => {
    router.push("/login");
  };

  const handleSimulateError = () => {
    setIsError(true);
    setIsLoading(false);
  };

  if (isError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 px-4">
        <DynovaLogo size="lg" className="mb-8" />

        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle>{t("callback.error.title")}</AlertTitle>
          <AlertDescription className="mt-2">
            {t("callback.error.description")}
          </AlertDescription>
          <div className="mt-4 flex gap-3">
            <Button onClick={handleTryAgain} size="sm">
              {t("callback.tryAgain")}
            </Button>
            <Button onClick={handleBack} variant="outline" size="sm">
              {t("callback.back")}
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 px-4"
      aria-busy="true"
      role="status"
    >
      <DynovaLogo size="lg" className="mb-8" />

      <Spinner size="lg" className="mb-6" />

      <h1 className="text-heading-lg text-foreground">{t("callback.title")}</h1>
      <p className="mt-2 text-body-md text-text-secondary">
        {t("callback.subtitle")}
      </p>

      {/* Hidden test toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleSimulateError}
        className="fixed bottom-4 end-4 text-text-disabled hover:text-text-secondary"
      >
        {t("callback.simulateError")}
      </Button>
    </div>
  );
}
