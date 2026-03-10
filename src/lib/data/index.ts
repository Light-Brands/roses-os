export type {
  NavItem, Guardian, Program, ContributionTier,
  ScheduleStage, ScheduleSession, TimeZoneEntry,
  CoherenceDomain, CoherenceAlternativeCategory,
  PathLevel, LineageEntry,
  ArchitectureLayer, Chakra, Technique, TeachingLevel,
  TeachingSlide, ChakraSlideData,
  Agreement, Capacity, MessagingPillar, BrandQuote, Stat,
  CommunityProgram,
  CommunityClassSession, CommunityScheduleMonth,
  CommunityScheduleCycle, InvestmentOption,
  MeditationTechnique, TechniqueStep, SubTechnique,
} from './types';

export {
  openingAgreements,
  openingImportantToKnow,
  openingHistory,
  level1Slides,
  level2Slides,
  chakraSlides,
  level2CleansingSlides,
  level3Slides,
} from './teaching-slides';

export {
  level1Techniques,
  getLevel1TechniquesSorted,
  getTechniqueById,
  getTechniquesByCategory,
} from './level1-techniques';

export {
  level1ManualImages,
  level2ManualImages,
  level3ManualImages,
  supplementaryImages,
  allManualImageMappings,
} from './manual-image-mapping';

export type { ManualImageEntry, ManualImageMapping } from './manual-image-mapping';

export {
  manualPdfConfigs,
  teachersAidPdfConfig,
  getManualPdfConfig,
} from './manual-pdf-paths';

export type { ManualPdfConfig } from './manual-pdf-paths';

export type { GeoLocation, FAQItem } from './types';

export {
  geoLocations,
  geoFAQs,
  getLocationBySlug,
  getAllLocationSlugs,
  getScheduleForLocation,
  getRoseMeditationScheduleForLocation,
} from './geo-data';

export {
  navItems,
  guardians,
  programs,
  scheduleStages,
  roseMeditationScheduleStages,
  aura2ScheduleStages,
  contributionTiers,
  roseMeditationTiers,
  coherenceDomains,
  coherenceAlternatives,
  pathLevels,
  visiblePathLevels,
  lineageEntries,
  architectureLayers,
  chakras,
  techniques,
  teachingLevels,
  agreements,
  elevenCapacities,
  brandQuotes,
  messagingPillars,
  freePrograms,
  paidPrograms,
} from './mock-data';

export type { ImageEntry, ImageScope } from './image-registry';
export {
  imageRegistry,
  getSharedImages,
  getManualImages,
  getTeachingImages,
  getImageById,
} from './image-registry';
