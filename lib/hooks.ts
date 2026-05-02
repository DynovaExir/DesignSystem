'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

export type UniquenessStatus = 'idle' | 'checking' | 'available' | 'taken' | 'cooldown' | 'error';

export interface UseUniquenessCheckerOptions {
  field: string;
  debounceMs?: number;
  context?: string;
  onStatusChange?: (status: UniquenessStatus) => void;
}

export function useUniquenessChecker({
  field,
  debounceMs = 500,
  context,
  onStatusChange,
}: UseUniquenessCheckerOptions) {
  const [status, setStatus] = useState<UniquenessStatus>('idle');
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout>();
  const abortControllerRef = useRef<AbortController>();

  const updateStatus = useCallback((newStatus: UniquenessStatus) => {
    setStatus(newStatus);
    onStatusChange?.(newStatus);
  }, [onStatusChange]);

  const check = useCallback(
    async (value: string) => {
      if (!value || value.length < 3) {
        updateStatus('idle');
        setIsAvailable(null);
        return;
      }

      // Clear previous debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Set up new abort controller
      abortControllerRef.current = new AbortController();

      debounceTimerRef.current = setTimeout(async () => {
        try {
          updateStatus('checking');
          const available = await apiClient.checkUniqueness(field, value, context);
          setIsAvailable(available);
          updateStatus(available ? 'available' : 'taken');
        } catch (error) {
          if (error instanceof Error) {
            if (error.message === 'COOLDOWN') {
              updateStatus('cooldown');
              setIsAvailable(null);
            } else {
              updateStatus('error');
              setIsAvailable(null);
            }
          }
        }
      }, debounceMs);
    },
    [field, context, debounceMs, updateStatus]
  );

  const reset = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    updateStatus('idle');
    setIsAvailable(null);
  }, [updateStatus]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return { status, isAvailable, check, reset };
}

export function useFormDirtyState() {
  const [isDirty, setIsDirty] = useState(false);

  const markDirty = useCallback(() => {
    setIsDirty(true);
  }, []);

  const reset = useCallback(() => {
    setIsDirty(false);
  }, []);

  return { isDirty, markDirty, reset };
}
