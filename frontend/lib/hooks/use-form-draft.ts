'use client';

import { useState, useEffect, useCallback } from 'react';

interface UseFormDraftOptions<T> {
  key: string;
  initialValue: T;
  debounceMs?: number;
}

export function useFormDraft<T extends Record<string, any>>({
  key,
  initialValue,
  debounceMs = 1000,
}: UseFormDraftOptions<T>) {
  const storageKey = `workmatch_draft_${key}`;

  // Initialize state with saved draft or initial value
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;

    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...initialValue, ...parsed };
      }
    } catch (e) {
      console.error('Error loading draft:', e);
    }
    return initialValue;
  });

  const [hasDraft, setHasDraft] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Check if draft exists on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const saved = localStorage.getItem(storageKey);
      setHasDraft(!!saved);
    } catch (e) {
      console.error('Error checking draft:', e);
    }
  }, [storageKey]);

  // Debounced save to localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const timeoutId = setTimeout(() => {
      try {
        // Only save if there's actual content
        const hasContent = Object.values(value).some(
          v => v !== '' && v !== null && v !== undefined
        );

        if (hasContent) {
          localStorage.setItem(storageKey, JSON.stringify(value));
          setHasDraft(true);
          setLastSaved(new Date());
        }
      } catch (e) {
        console.error('Error saving draft:', e);
      }
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [value, storageKey, debounceMs]);

  // Update a single field
  const updateField = useCallback(<K extends keyof T>(field: K, fieldValue: T[K]) => {
    setValue(prev => ({ ...prev, [field]: fieldValue }));
  }, []);

  // Clear the draft
  const clearDraft = useCallback(() => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(storageKey);
      setValue(initialValue);
      setHasDraft(false);
      setLastSaved(null);
    } catch (e) {
      console.error('Error clearing draft:', e);
    }
  }, [storageKey, initialValue]);

  // Restore from draft
  const restoreDraft = useCallback(() => {
    if (typeof window === 'undefined') return;

    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        setValue({ ...initialValue, ...parsed });
      }
    } catch (e) {
      console.error('Error restoring draft:', e);
    }
  }, [storageKey, initialValue]);

  return {
    value,
    setValue,
    updateField,
    clearDraft,
    restoreDraft,
    hasDraft,
    lastSaved,
  };
}
