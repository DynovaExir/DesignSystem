'use client';

import { useTranslation } from 'react-i18next';
import { UniquenessStatus } from '@/lib/hooks';

interface UniquenessIndicatorProps {
  status: UniquenessStatus;
  showText?: boolean;
}

export function UniquenessIndicator({ status, showText = true }: UniquenessIndicatorProps) {
  const { t } = useTranslation();

  if (status === 'idle') {
    return null;
  }

  const getContent = () => {
    switch (status) {
      case 'checking':
        return {
          icon: (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ),
          text: t('form.tenant_name.checking'),
          color: 'text-muted-foreground',
        };
      case 'available':
        return {
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ),
          text: t('form.tenant_name.available'),
          color: 'text-green-500',
        };
      case 'taken':
        return {
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ),
          text: t('form.tenant_name.taken'),
          color: 'text-destructive',
        };
      case 'cooldown':
        return {
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          text: t('form.tenant_name.cooldown'),
          color: 'text-muted-foreground',
        };
      case 'error':
        return {
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          text: t('error.networkError'),
          color: 'text-destructive',
        };
    }
  };

  const content = getContent();

  return (
    <div className={`flex items-center gap-2 text-sm ${content.color}`}>
      {content.icon}
      {showText && <span>{content.text}</span>}
    </div>
  );
}
