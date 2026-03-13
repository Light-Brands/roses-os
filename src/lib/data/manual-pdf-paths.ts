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

export const manualPdfConfigs: ManualPdfConfig[] = [
  {
    level: 1,
    paths: {
      en: '/resources/manuals/ROSES-OS-Level-1-Manual-EN.pdf',
      es: '/resources/manuals/ROSES-OS-Level-1-Manual-ES.pdf',
      pt: '/resources/manuals/ROSES-OS-Level-1-Manual-PT.pdf',
      el: '/resources/manuals/ROSES-OS-Level-1-Manual-EL.pdf',
    },
    labels: {
      en: 'Download Student Manual',
      es: 'Descargar Manual del Estudiante',
      pt: 'Baixar Manual do Estudante',
      el: 'Λήψη Εγχειριδίου Μαθητή',
    },
  },
  {
    level: 2,
    paths: {
      en: '/resources/manuals/ROSES-OS-Level-2-Manual-EN.pdf',
    },
    labels: {
      en: 'Download Student Manual',
      es: 'Descargar Manual del Estudiante',
      pt: 'Baixar Manual do Estudante',
      el: 'Λήψη Εγχειριδίου Μαθητή',
    },
  },
  {
    level: 3,
    paths: {
      en: '/resources/manuals/ROSES-OS-Level-3-Manual-EN.pdf',
    },
    labels: {
      en: 'Download Student Manual',
      es: 'Descargar Manual del Estudiante',
      pt: 'Baixar Manual do Estudante',
      el: 'Λήψη Εγχειριδίου Μαθητή',
    },
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
