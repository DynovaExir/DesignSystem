"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useI18n } from "@/lib/i18n-context";
import { startLogin } from "@/lib/auth-mock";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { DynovaLogo } from "@/components/common/DynovaLogo";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { X, AlertCircle, CheckCircle2 } from "lucide-react";

export function LoginCard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useI18n();

  const [isLoading, setIsLoading] = useState(false);
  const [showLoggedOutBanner, setShowLoggedOutBanner] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for success/error states from URL
  useEffect(() => {
    const loggedOut = searchParams.get("logged_out");
    const errorParam = searchParams.get("error");

    if (loggedOut === "1") {
      setShowLoggedOutBanner(true);
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setShowLoggedOutBanner(false);
      }, 5000);
      return () => clearTimeout(timer);
    }

    if (errorParam) {
      const errorKey =
        errorParam === "invalid_state"
          ? "login.error.invalid_state"
          : errorParam === "access_denied"
          ? "login.error.access_denied"
          : "login.error.generic";
      setError(t(errorKey as Parameters<typeof t>[0]));
    }
  }, [searchParams, t]);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await startLogin();
      // Navigate to callback page (mocked)
      router.push("/auth/callback");
    } catch {
      setIsLoading(false);
      setError(t("login.error.generic"));
    }
  };

  const handleDismissBanner = () => {
    setShowLoggedOutBanner(false);
  };

  const handleTryAgain = () => {
    setError(null);
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen flex-col bg-neutral-50">
      {/* Header with logo */}
      <header className="p-6">
        <DynovaLogo size="lg" />
      </header>

      {/* Main content */}
      <main className="flex flex-1 items-center justify-center px-4 pb-12">
        <div className="w-full max-w-md">
          {/* Success banner */}
          {showLoggedOutBanner && (
            <Alert variant="success" className="mb-6 flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              <AlertDescription className="flex-1">
                {t("login.loggedOut")}
              </AlertDescription>
              <button
                onClick={handleDismissBanner}
                className="shrink-0 text-success-700 hover:text-success-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-success-500 focus-visible:ring-offset-2 rounded-sm"
                aria-label={t("common.dismiss")}
              >
                <X className="h-4 w-4" />
              </button>
            </Alert>
          )}

          {/* Error alert */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-5 w-5" />
              <AlertTitle>{t("login.error.generic")}</AlertTitle>
              <AlertDescription className="mt-2 flex items-center gap-3">
                <span>{error}</span>
                <button
                  onClick={handleTryAgain}
                  className="text-danger-700 underline underline-offset-2 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger-500 focus-visible:ring-offset-2 rounded-sm"
                >
                  {t("login.back")}
                </button>
              </AlertDescription>
            </Alert>
          )}

          {/* Login card */}
          <div className="rounded-lg bg-card p-8 shadow-sm">
            <div className="text-center">
              <h1 className="text-display-xl text-foreground">
                {t("login.title")}
              </h1>
              <p className="mt-3 text-body-md text-text-secondary">
                {t("login.subtitle")}
              </p>
            </div>

            <div className="mt-8">
              <Button
                onClick={handleLogin}
                disabled={isLoading}
                aria-busy={isLoading}
                size="lg"
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Spinner size="sm" color="white" />
                    <span>{t("common.loading")}</span>
                  </>
                ) : (
                  t("login.cta")
                )}
              </Button>

              <p className="mt-4 text-center text-body-sm text-text-secondary">
                {t("login.redirectNote")}
              </p>
            </div>

            {/* Language switcher */}
            <div className="mt-8 flex justify-center">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center">
        <p className="text-label-xs text-text-disabled">
          {t("footer.copyright")} &middot; {t("footer.version")}
        </p>
      </footer>
    </div>
  );
}
