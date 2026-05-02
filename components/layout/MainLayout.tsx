"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n-context";
import { logout, refresh } from "@/lib/auth-mock";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { SessionTimeoutBanner } from "@/components/auth/SessionTimeoutBanner";
import { SessionExpiredDialog } from "@/components/auth/SessionExpiredDialog";

interface MainLayoutProps {
  children: React.ReactNode;
}

// Demo countdown: 10 seconds (in real app this would be 5 minutes = 300 seconds)
const DEMO_COUNTDOWN_SECONDS = 10;

export function MainLayout({ children }: MainLayoutProps) {
  const router = useRouter();
  const { t } = useI18n();

  const [timeRemaining, setTimeRemaining] = useState(DEMO_COUNTDOWN_SECONDS);
  const [showBanner, setShowBanner] = useState(true);
  const [isExpired, setIsExpired] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (isExpired || !showBanner) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsExpired(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isExpired, showBanner]);

  const handleExtendSession = useCallback(async () => {
    await refresh();
    setTimeRemaining(DEMO_COUNTDOWN_SECONDS);
    setShowBanner(false);
    // Show banner again after a short delay (demo purposes)
    setTimeout(() => setShowBanner(true), 2000);
  }, []);

  const handleLogout = useCallback(async () => {
    await logout();
    router.push("/login?logged_out=1");
  }, [router]);

  const handleSignInAgain = useCallback(() => {
    router.push("/login");
  }, [router]);

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar onLogout={handleLogout} />

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <Header onLogout={handleLogout} />

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          {/* Session timeout banner */}
          {showBanner && !isExpired && (
            <SessionTimeoutBanner
              timeRemaining={timeRemaining}
              onExtend={handleExtendSession}
              onLogout={handleLogout}
            />
          )}

          {/* Page content */}
          <div className={showBanner && !isExpired ? "mt-6" : ""}>
            {children}
          </div>
        </main>
      </div>

      {/* Session expired modal */}
      <SessionExpiredDialog open={isExpired} onSignIn={handleSignInAgain} />
    </div>
  );
}
