'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Locale, TeachingTranslations } from './types';

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TeachingTranslations | null;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = 'roses-os-locale';

async function loadTranslations(locale: Locale): Promise<TeachingTranslations> {
  const mod = await import(`@/content/teaching/${locale}.json`);
  return mod.default as TeachingTranslations;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [t, setT] = useState<TeachingTranslations | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem(STORAGE_KEY, newLocale);
    } catch {
      // localStorage unavailable
    }
  }, []);

  // Restore persisted locale on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
      if (stored && ['en', 'pt', 'es', 'el'].includes(stored)) {
        setLocaleState(stored);
      }
    } catch {
      // localStorage unavailable
    }
  }, []);

  // Load translations when locale changes
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    loadTranslations(locale)
      .then((data) => {
        if (!cancelled) setT(data);
      })
      .catch((err) => {
        console.error(`Failed to load translations for "${locale}":`, err);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => { cancelled = true; };
  }, [locale]);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, isLoading }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
}
