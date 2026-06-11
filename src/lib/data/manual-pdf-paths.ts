/**
 * Manual PDF Paths — Locale-Aware
 *
 * Provides per-locale paths and labels for each manual level.
 * Used by ManualPdfButton to automatically switch the download link
 * when the user changes language via the LanguageSelector.
 */

import type { Locale } from '@/lib/i18n/types';

export interface ManualPdfConfig {
  level: number;
  paths: Partial<Record<Locale, string>>;
  labels: Partial<Record<Locale, string>>;
}

/**
 * Per-locale label builders for the per-level student manual button.
 * Each embeds the level number so the button reads e.g. "Baixar Manual do Nível 3"
 * instead of a generic "Baixar Manual do Estudante" repeated across every level.
 * Locales without a builder (ru, uk) fall back to the English label in the button.
 */
const manualLabelBuilders: Partial<Record<Locale, (level: number) => string>> = {
  en: (level) => `Download Level ${level} Manual`,
  es: (level) => `Descargar Manual del Nivel ${level}`,
  pt: (level) => `Baixar Manual do Nível ${level}`,
  el: (level) => `Λήψη Εγχειριδίου Επιπέδου ${level}`,
};

function manualLabels(level: number): Partial<Record<Locale, string>> {
  return Object.fromEntries(
    Object.entries(manualLabelBuilders).map(([locale, build]) => [locale, build(level)]),
  ) as Partial<Record<Locale, string>>;
}

export const manualPdfConfigs: ManualPdfConfig[] = [
  {
    level: 1,
    paths: {
      en: '/resources/manuals/Rose-Level-1-Manual-EN.pdf',
      es: '/resources/manuals/Rose-Level-1-Manual-ES.pdf',
      pt: '/resources/manuals/Rose-Level-1-Manual-PT.pdf',
      el: '/resources/manuals/Rose-Level-1-Manual-EL.pdf',
    },
    labels: manualLabels(1),
  },
  {
    level: 2,
    paths: {
      en: '/resources/manuals/Rose-Level-2-Manual-EN.pdf',
      es: '/resources/manuals/Rose-Level-2-Manual-ES.pdf',
      pt: '/resources/manuals/Rose-Level-2-Manual-PT.pdf',
    },
    labels: manualLabels(2),
  },
  {
    level: 3,
    paths: {
      en: '/resources/manuals/Rose-Level-3-Manual-EN.pdf',
      es: '/resources/manuals/Rose-Level-3-Manual-ES.pdf',
      pt: '/resources/manuals/Rose-Level-3-Manual-PT.pdf',
    },
    labels: manualLabels(3),
  },
];

/** Full Teachers Aid PDF — all levels combined, per locale */
export const teachersAidPdfConfig: Omit<ManualPdfConfig, 'level'> = {
  paths: {
    en: '/resources/manuals/ROSES-OS-Teachers-Aid-EN.pdf',
    es: '/resources/manuals/ROSES-OS-Teachers-Aid-ES.pdf',
    pt: '/resources/manuals/ROSES-OS-Teachers-Aid-PT.pdf',
    el: '/resources/manuals/ROSES-OS-Teachers-Aid-EL.pdf',
  },
  labels: {
    en: 'Download Teachers Aid PDF',
    es: 'Descargar PDF de Ayuda para Profesores',
    pt: 'Baixar PDF de Auxílio ao Professor',
    el: 'Λήψη PDF Βοηθήματος Δασκάλου',
  },
};

/** Helper to get a config by level number */
export function getManualPdfConfig(level: number): ManualPdfConfig | undefined {
  return manualPdfConfigs.find((c) => c.level === level);
}
