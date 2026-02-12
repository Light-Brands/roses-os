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
}

/** Contribution tier (income-based) */
export interface ContributionTier {
  id: string;
  name: string;
  range: string;
  description: string;
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
  topic: string;
  time: TimeZoneEntry;
}

/** Timezone column entries */
export interface TimeZoneEntry {
  sanJose: string;
  newYork: string;
  brasilia: string;
  london: string;
}

/** Coherence domain (from The Codex) */
export interface CoherenceDomain {
  id: string;
  number: number;
  title: string;
  description: string;
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

/** Teaching technique */
export interface Technique {
  id: string;
  title: string;
  description: string;
  level: number;
  category: string;
}

/** Teaching level section */
export interface TeachingLevel {
  level: number;
  title: string;
  subtitle: string;
  description: string;
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
