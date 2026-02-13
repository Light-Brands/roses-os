'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';

type Theme = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';
type StyleVariant = 'default' | 'rose-clay';

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  styleVariant: StyleVariant;
  setStyleVariant: (variant: StyleVariant) => void;
  toggleStyleVariant: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  const stored = localStorage.getItem('theme');
  if (stored === 'light' || stored === 'dark' || stored === 'system') {
    return stored;
  }
  // Default to light mode if no preference is stored
  return 'light';
}

function getStoredStyle(): StyleVariant {
  if (typeof window === 'undefined') return 'default';
  const stored = localStorage.getItem('style-variant');
  if (stored === 'rose-clay') return 'rose-clay';
  return 'default';
}

function applyTheme(theme: ResolvedTheme) {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

function applyStyleVariant(variant: StyleVariant) {
  const root = document.documentElement;
  if (variant === 'default') {
    root.removeAttribute('data-style');
  } else {
    root.setAttribute('data-style', variant);
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light');
  const [styleVariant, setStyleVariantState] = useState<StyleVariant>('default');
  const [mounted, setMounted] = useState(false);

  // Initialize theme on mount
  useEffect(() => {
    const storedTheme = getStoredTheme();
    const resolved = storedTheme === 'system' ? getSystemTheme() : storedTheme;
    const storedStyle = getStoredStyle();

    setThemeState(storedTheme);
    setResolvedTheme(resolved);
    setStyleVariantState(storedStyle);
    applyTheme(resolved);
    applyStyleVariant(storedStyle);
    setMounted(true);
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    if (!mounted) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        const newResolved = e.matches ? 'dark' : 'light';
        setResolvedTheme(newResolved);
        applyTheme(newResolved);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, mounted]);

  const setTheme = useCallback((newTheme: Theme) => {
    const resolved = newTheme === 'system' ? getSystemTheme() : newTheme;

    setThemeState(newTheme);
    setResolvedTheme(resolved);
    applyTheme(resolved);
    localStorage.setItem('theme', newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    const newResolved = resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(newResolved);
  }, [resolvedTheme, setTheme]);

  const setStyleVariant = useCallback((variant: StyleVariant) => {
    setStyleVariantState(variant);
    applyStyleVariant(variant);
    localStorage.setItem('style-variant', variant);
  }, []);

  const toggleStyleVariant = useCallback(() => {
    const next = styleVariant === 'default' ? 'rose-clay' : 'default';
    setStyleVariant(next);
  }, [styleVariant, setStyleVariant]);

  // Always provide context value, even before mount, to prevent errors
  const contextValue: ThemeContextValue = {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
    styleVariant,
    setStyleVariant,
    toggleStyleVariant,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  // Return safe defaults during SSR/static generation
  if (context === undefined) {
    return {
      theme: 'light',
      resolvedTheme: 'light',
      setTheme: () => {},
      toggleTheme: () => {},
      styleVariant: 'default',
      setStyleVariant: () => {},
      toggleStyleVariant: () => {},
    };
  }
  return context;
}
