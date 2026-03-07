export type Locale = 'en' | 'pt' | 'es' | 'el';

export const LOCALES: { code: Locale; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'pt', label: 'Portugu\u00eas' },
  { code: 'es', label: 'Espa\u00f1ol' },
  { code: 'el', label: '\u0395\u03bb\u03bb\u03b7\u03bd\u03b9\u03ba\u03ac' },
];

export interface TeachingTranslations {
  ui: {
    teacherVisualAidManual: string;
    facilitatorCompanion: string;
    selectTeachingLevel: string;
    allLevels: string;
    level: string;
    slide: string;
    designerNote: string;
    downloadPdf: string;
    sacredSpace: string;
    theChakraSystem: string;
    cleansingAndRecovery: string;
    goldenStickyRoses: string;
    balancedExpression: string;
    unbalancedExpression: string;
    primaryBlockages: string;
    color: string;
    element: string;
    location: string;
    energy: string;
    focus: string;
    lineage: string;
    rosesOs: string;
    exportTeachersAidPdf: string;
    downloadImages: string;
    preparingDownload: string;
  };
  opening: {
    agreements: {
      title: string;
      text: string;
      items: string[];
    };
    sacredCompanion: {
      title: string;
      paragraphs: string[];
      guidelinesTitle: string;
      guidelinesItems: string[];
      closing: string;
    };
    history: {
      title: string;
      text: string;
      lineage: string;
    };
  };
  levels: {
    [key: string]: {
      title: string;
      subtitle: string;
      description: string;
    };
  };
  slides: {
    [slideId: string]: {
      concept: string;
      teachingText: string;
    };
  };
  chakras: {
    [chakraId: string]: {
      concept: string;
      teachingText: string;
      focus: string;
      energy: string;
      bodyLocation: string;
      balanced: string[];
      unbalanced: string[];
      blockages: string;
      extraContent?: string;
    };
  };
}
