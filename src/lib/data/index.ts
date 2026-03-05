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
  openingSacredCompanion,
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
