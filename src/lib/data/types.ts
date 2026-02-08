// =============================================================================
// SHARED TYPES — Digital Cultures
// =============================================================================

/** Base project type (used in listings / cards) */
export interface Project {
  id: string;
  title: string;
  category: string;
  client?: string;
  image: string;
  href: string;
}

/** Gallery image for project detail pages */
export interface GalleryImage {
  src: string;
  alt: string;
  /** If true, spans two columns in the gallery grid */
  wide?: boolean;
}

/** Extended project type with full detail for /work/[slug] pages */
export interface ProjectDetail extends Project {
  slug: string;
  year: string;
  location: string;
  services: string[];
  overview: string;
  challenge: string;
  approach: string;
  result: string;
  gallery: GalleryImage[];
}

/** Service offering */
export interface Service {
  id: string;
  number: string;
  title: string;
  description: string;
  capabilities: string[];
}

/** Statistic (used on About page) */
export interface Stat {
  value: string;
  label: string;
}

/** Navigation item */
export interface NavItem {
  label: string;
  href: string;
}
