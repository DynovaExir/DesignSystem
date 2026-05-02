"use client";

import { useI18n } from "@/lib/i18n-context";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n";

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();

  const options: { value: Locale; label: string }[] = [
    { value: "fa", label: t("language.fa") },
    { value: "en", label: t("language.en") },
  ];

  return (
    <div
      className="inline-flex items-center rounded-full border border-border-default bg-neutral-100 p-0.5"
      role="radiogroup"
      aria-label="Language selection"
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={locale === option.value}
          onClick={() => setLocale(option.value)}
          className={cn(
            "px-3 py-1 text-body-sm font-semibold rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
            locale === option.value
              ? "bg-card text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
