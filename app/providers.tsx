'use client';

import React, { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n';
import { interceptApiCall } from '@/lib/mock-api';

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Setup mock API interceptor
    const originalFetch = window.fetch;

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
      const method = init?.method || 'GET';

      // Intercept API calls
      if (url.startsWith('/api/')) {
        const body = init?.body;
        let parsedBody = null;

        if (body) {
          if (body instanceof FormData) {
            parsedBody = body;
          } else if (typeof body === 'string') {
            try {
              parsedBody = JSON.parse(body);
            } catch {
              parsedBody = body;
            }
          }
        }

        return interceptApiCall(url, method, parsedBody);
      }

      // Fall back to original fetch for other requests
      return originalFetch(input, init);
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
}
