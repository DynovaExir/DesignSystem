"use client";

import { useI18n } from "@/lib/i18n-context";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface SessionTimeoutBannerProps {
  timeRemaining: number; // in seconds
  onExtend: () => void;
  onLogout: () => void;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function SessionTimeoutBanner({
  timeRemaining,
  onExtend,
  onLogout,
}: SessionTimeoutBannerProps) {
  const { t } = useI18n();

  return (
    <div
      className="sticky top-0 z-40 flex items-center justify-between gap-4 rounded-md bg-warning-100 px-4 py-3 text-warning-700 shadow-sm"
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-center gap-3">
        <AlertTriangle className="h-5 w-5 shrink-0" aria-hidden="true" />
        <span className="text-body-md font-semibold">
          {t("session.warning", { time: formatTime(timeRemaining) })}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Button onClick={onExtend} size="sm">
          {t("session.staySignedIn")}
        </Button>
        <Button onClick={onLogout} variant="outline" size="sm">
          {t("session.logout")}
        </Button>
      </div>
    </div>
  );
}
