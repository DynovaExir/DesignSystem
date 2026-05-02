'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '@/lib/i18n';

export function LocaleToggle() {
  const { i18n: i18nInstance } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleToggle = async (lng: string) => {
    await i18nInstance.changeLanguage(lng);
    document.documentElement.lang = lng;
    document.documentElement.dir = lng === 'fa' ? 'rtl' : 'ltr';
    localStorage.setItem('preferred-language', lng);
  };

  const currentLng = i18nInstance.language;

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleToggle('en')}
        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
          currentLng === 'en'
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground hover:bg-muted/80'
        }`}
        aria-label="Switch to English"
        aria-pressed={currentLng === 'en'}
      >
        EN
      </button>
      <button
        onClick={() => handleToggle('fa')}
        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
          currentLng === 'fa'
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground hover:bg-muted/80'
        }`}
        aria-label="Switch to Farsi"
        aria-pressed={currentLng === 'fa'}
      >
        فا
      </button>
    </div>
  );
}
