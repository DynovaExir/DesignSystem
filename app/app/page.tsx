"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import { useI18n } from "@/lib/i18n-context";

function DashboardContent() {
  const { t } = useI18n();

  return (
    <div className="rounded-lg border border-border-default bg-card p-6 shadow-sm">
      <h1 className="text-heading-lg text-foreground">
        {t("breadcrumb.dashboard")}
      </h1>
      <p className="mt-2 text-body-md text-text-secondary">
        {t("login.subtitle")}
      </p>

      {/* Placeholder content cards */}
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-md border border-border-default bg-neutral-50 p-4"
          >
            <div className="h-4 w-24 rounded bg-neutral-200" />
            <div className="mt-3 h-8 w-16 rounded bg-neutral-200" />
            <div className="mt-2 h-3 w-32 rounded bg-neutral-100" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AppPage() {
  return (
    <MainLayout>
      <DashboardContent />
    </MainLayout>
  );
}
