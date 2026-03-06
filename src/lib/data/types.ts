// =============================================================================
// SHARED TYPES — ROSES OS
// =============================================================================

/** Navigation item */
export interface NavItem {
  label: string;
  href: string;
}

/** Guardian (faculty member) */
export interface Guardian {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  /** Optional CSS object-position value for fine-tuning which part of the photo is visible in the circular crop (e.g. "center 20%") */
  imagePosition?: string;
  /** Optional scale factor for zooming into the photo (e.g. 1.1 for 10% zoom) */
  imageScale?: number;
}

/** Program offering */
export interface Program {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  dates: string;
  format: string;
  description: string;
  includes: string[];
  /** Price range summary shown on collapsed cards (e.g. "$222 – $777") */
  priceRange?: string;
}

/** Contribution tier (pay what feels right) */
export interface ContributionTier {
  id: string;
  name: string;
  range: string;
  description: string;
  /** Suggested price for the program (Rose Meditation + Aura Reading Level 1) */
  price: string;
}

/** Schedule stage */
export interface ScheduleStage {
  id: string;
  title: string;
  dateRange: string;
  sessions: ScheduleSession[];
}

/** Individual session within a stage */
export interface ScheduleSession {
  day: string;
  duration: string;
  time: TimeZoneEntry;
}

/** Timezone column entries */
export interface TimeZoneEntry {
  sanJose: string;
  bogota: string;
  newYork: string;
  brasilia: string;
  london: string;
  madrid: string;
}

/** Coherence domain (from The Codex) */
export interface CoherenceDomain {
  id: string;
  number: number;
  title: string;
  description: string;
}

/** Category of alternative words that can replace "Coherence" to vary tone */
export interface CoherenceAlternativeCategory {
  id: string;
  tone: string;
  words: string[];
}

/** Path level (Rose One/Two/Three) */
export interface PathLevel {
  id: string;
  level: number;
  title: string;
  subtitle: string;
  description: string;
  focus: string[];
}

/** Lineage timeline entry */
export interface LineageEntry {
  id: string;
  year: string;
  name: string;
  description: string;
}

/** Architecture layer */
export interface ArchitectureLayer {
  id: string;
  name: string;
  description: string;
}

/** Chakra data (for teacher section) */
export interface Chakra {
  id: string;
  number: number;
  name: string;
  sanskritName: string;
  color: string;
  location: string;
  element: string;
  balanced: string;
  unbalanced: string;
  blockages: string;
}

/** Teaching technique (legacy — kept for backward compatibility) */
export interface Technique {
  id: string;
  title: string;
  description: string;
  level: number;
  category: string;
}

/** A single step within a technique */
export interface TechniqueStep {
  order: number;
  instruction: string;
}

/** A sub-technique nested inside a parent technique */
export interface SubTechnique {
  id: string;
  title: string;
  description: string;
  steps?: TechniqueStep[];
}

/** Modular meditation technique sourced from the manuals */
export interface MeditationTechnique {
  id: string;
  /** Position in the meditation sequence (can be changed to reorder) */
  order: number;
  title: string;
  level: number;
  category:
    | 'preparation'
    | 'foundation'
    | 'protection'
    | 'energy-circuit'
    | 'cleansing'
    | 'gift'
    | 'closing';
  /** Short summary of purpose */
  description: string;
  /** Full teaching instruction from the manual */
  instruction: string;
  steps?: TechniqueStep[];
  subTechniques?: SubTechnique[];
  /** IDs of related TeachingSlide entries */
  linkedSlideIds?: string[];
}

/** Teaching level section */
export interface TeachingLevel {
  level: number;
  title: string;
  subtitle: string;
  description: string;
}

/** Teaching slide -- pairs an image with teaching text */
export interface TeachingSlide {
  id: string;
  slideNumber: number;
  concept: string;
  teachingText: string;
  originalImage?: string;
  reimaginedImage?: string;
  imageNote?: string;
  /** Whether this image is finalized and actively used on the website */
  final?: boolean;
  level: number;
  section?: string;
}

/** Chakra-specific teaching slide with detailed chakra data */
export interface ChakraSlideData extends TeachingSlide {
  sanskritName: string;
  chakraColor: string;
  element: string;
  coreStatement: string;
  focus: string;
  bodyLocation: string;
  energy: string;
  balanced: string[];
  unbalanced: string[];
  blockages: string;
  extraContent?: string;
}

/** Program agreement */
export interface Agreement {
  id: string;
  title: string;
  description: string;
}

/** Capacity (from The Codex) */
export interface Capacity {
  id: string;
  number: number;
  title: string;
  description: string;
}

/** Messaging pillar */
export interface MessagingPillar {
  id: string;
  title: string;
  description: string;
}

/** Brand quote */
export interface BrandQuote {
  id: string;
  text: string;
  attribution?: string;
}

/** Statistic */
export interface Stat {
  value: string;
  label: string;
}

/** Community program class session (date + time across timezones) */
export interface CommunityClassSession {
  date: string;
  time: TimeZoneEntry;
}

/** Community program schedule month */
export interface CommunityScheduleMonth {
  month: string;
  sessions: CommunityClassSession[];
}

/** Community program schedule cycle (group of months) */
export interface CommunityScheduleCycle {
  id: string;
  title: string;
  months: CommunityScheduleMonth[];
}

/** Investment option for community programs */
export interface InvestmentOption {
  id: string;
  label: string;
  period: string;
  price: string;
}

/** Detail section for community program (e.g. requirements, how classes work) */
export interface ProgramDetailSection {
  heading: string;
  body: string;
  bullets?: string[];
}

/** Ongoing community program or activity */
export interface CommunityProgram {
  id: string;
  title: string;
  description: string;
  schedule?: string;
  audience?: string;
  free: boolean;
  whatsappLink?: string;
  calendarLink?: string;
  googleCalendarUrl?: string;
  scheduleCycles?: CommunityScheduleCycle[];
  investment?: InvestmentOption[];
  /** Optional structured detail sections shown in the expanded area */
  detailSections?: ProgramDetailSection[];
  /** Facilitator names */
  facilitation?: string;
}
