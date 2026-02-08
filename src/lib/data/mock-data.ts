// =============================================================================
// MOCK DATA — Digital Cultures
// TODO: Replace with CMS/Supabase data
// =============================================================================

import type { Project, ProjectDetail, Service, Stat, NavItem } from './types';

// =============================================================================
// NAVIGATION
// =============================================================================

export const navItems: NavItem[] = [
  { label: 'Work', href: '/work' },
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

// =============================================================================
// PROJECT CATEGORIES
// =============================================================================

export const projectCategories = [
  'Branding',
  'Art Direction',
  'Web Design',
  'Social Media',
  'Strategy',
  'Video',
  'Print',
  'Photography',
];

// =============================================================================
// PROJECTS (listing)
// =============================================================================

export const projects: Project[] = [
  {
    id: '1',
    title: 'Olympus Resort',
    category: 'Branding',
    client: 'Branding',
    image: '/projects/project-1.svg',
    href: '/work/olympus-resort',
  },
  {
    id: '2',
    title: 'Kypria Digital',
    category: 'Web Design',
    client: 'Web Design',
    image: '/projects/project-2.svg',
    href: '/work/kypria-digital',
  },
  {
    id: '3',
    title: 'Amara Collection',
    category: 'Art Direction',
    client: 'Art Direction',
    image: '/projects/project-3.svg',
    href: '/work/amara-collection',
  },
  {
    id: '4',
    title: 'Limassol Marina',
    category: 'Social Media',
    client: 'Social Media',
    image: '/projects/project-4.svg',
    href: '/work/limassol-marina',
  },
  {
    id: '5',
    title: 'Paphos Estates',
    category: 'Photography',
    client: 'Photography',
    image: '/projects/project-5.svg',
    href: '/work/paphos-estates',
  },
  {
    id: '6',
    title: 'Nea Ventures',
    category: 'Strategy',
    client: 'Strategy',
    image: '/projects/project-6.svg',
    href: '/work/nea-ventures',
  },
  {
    id: '7',
    title: 'Kolossi Studio',
    category: 'Branding',
    client: 'Branding',
    image: '/projects/project-1.svg',
    href: '/work/kolossi-studio',
  },
  {
    id: '8',
    title: 'Petra & Co',
    category: 'Video',
    client: 'Video',
    image: '/projects/project-2.svg',
    href: '/work/petra-co',
  },
  {
    id: '9',
    title: 'Akamas Wild',
    category: 'Print',
    client: 'Print',
    image: '/projects/project-3.svg',
    href: '/work/akamas-wild',
  },
];

// =============================================================================
// PROJECT DETAILS (for /work/[slug])
// =============================================================================

export const projectDetails: ProjectDetail[] = [
  {
    id: '1',
    slug: 'olympus-resort',
    title: 'Olympus Resort',
    category: 'Branding',
    client: 'Olympus Resort & Spa',
    year: '2024',
    location: 'Paphos, Cyprus',
    services: ['Brand Identity', 'Visual System', 'Collateral Design'],
    image: '/projects/project-1.svg',
    href: '/work/olympus-resort',
    overview:
      'A complete brand identity for a luxury resort nestled in the hills above Paphos. The visual language draws from Mediterranean light and Cypriot stone textures, creating a sense of timeless calm.',
    challenge:
      'Olympus Resort needed to differentiate itself in a crowded hospitality market while honouring the natural beauty of its hilltop setting. The existing identity felt generic and failed to communicate the property\'s distinct character.',
    approach:
      'We developed a restrained visual system built on warm neutrals and a custom wordmark inspired by classical Greek letterforms. Every touchpoint — from key cards to the website — carries the same quiet confidence.',
    result:
      'The new identity launched to strong guest feedback and a measurable increase in direct bookings. The brand now communicates luxury through restraint rather than excess.',
    gallery: [
      { src: '/projects/project-1.svg', alt: 'Olympus Resort brand overview', wide: true },
      { src: '/projects/project-2.svg', alt: 'Logo system' },
      { src: '/projects/project-3.svg', alt: 'Stationery suite' },
      { src: '/projects/project-4.svg', alt: 'Signage application', wide: true },
      { src: '/projects/project-5.svg', alt: 'Digital touchpoints' },
      { src: '/projects/project-6.svg', alt: 'Collateral materials' },
    ],
  },
  {
    id: '2',
    slug: 'kypria-digital',
    title: 'Kypria Digital',
    category: 'Web Design',
    client: 'Kypria Digital Solutions',
    year: '2024',
    location: 'Limassol, Cyprus',
    services: ['Web Design', 'UI/UX', 'Development'],
    image: '/projects/project-2.svg',
    href: '/work/kypria-digital',
    overview:
      'A high-performance website for a Limassol-based tech consultancy. The design prioritises clarity and speed, reflecting the client\'s own commitment to efficiency.',
    challenge:
      'Kypria\'s previous site was built on a dated CMS and loaded slowly. It didn\'t reflect the calibre of work the team was delivering. They needed a complete rebuild.',
    approach:
      'We designed a minimal, typography-led interface and built it on Next.js for speed. Content is structured around case studies and clear service descriptions.',
    result:
      'Page load times dropped by 70%, and the site now consistently converts visitors into qualified leads at twice the previous rate.',
    gallery: [
      { src: '/projects/project-2.svg', alt: 'Kypria Digital homepage', wide: true },
      { src: '/projects/project-3.svg', alt: 'Service page' },
      { src: '/projects/project-4.svg', alt: 'Case study layout' },
      { src: '/projects/project-5.svg', alt: 'Mobile responsive views', wide: true },
    ],
  },
  {
    id: '3',
    slug: 'amara-collection',
    title: 'Amara Collection',
    category: 'Art Direction',
    client: 'Amara Fashion House',
    year: '2023',
    location: 'Nicosia, Cyprus',
    services: ['Art Direction', 'Photography', 'Campaign Design'],
    image: '/projects/project-3.svg',
    href: '/work/amara-collection',
    overview:
      'Art direction for the spring/summer collection campaign. We crafted a visual narrative that blends Mediterranean warmth with contemporary minimalism.',
    challenge:
      'Amara wanted to elevate their visual output to match international fashion standards while retaining a distinctly Cypriot sensibility.',
    approach:
      'We directed a two-day shoot on location in Nicosia\'s old town, using natural light and muted backdrops to let the garments speak. Post-production was deliberately restrained.',
    result:
      'The campaign ran across social, print, and in-store, generating a 40% increase in engagement compared to the previous season.',
    gallery: [
      { src: '/projects/project-3.svg', alt: 'Amara campaign hero', wide: true },
      { src: '/projects/project-1.svg', alt: 'Look 1' },
      { src: '/projects/project-2.svg', alt: 'Look 2' },
      { src: '/projects/project-4.svg', alt: 'Behind the scenes' },
      { src: '/projects/project-5.svg', alt: 'Print deliverables', wide: true },
    ],
  },
  {
    id: '4',
    slug: 'limassol-marina',
    title: 'Limassol Marina',
    category: 'Social Media',
    client: 'Limassol Marina',
    year: '2024',
    location: 'Limassol, Cyprus',
    services: ['Social Media Strategy', 'Content Creation', 'Community Management'],
    image: '/projects/project-4.svg',
    href: '/work/limassol-marina',
    overview:
      'An ongoing social media programme that positions Limassol Marina as the Mediterranean\'s most desirable waterfront destination.',
    challenge:
      'The marina\'s social presence was inconsistent — a mix of stock photography and unplanned posts. They needed a cohesive content strategy.',
    approach:
      'We built a content calendar around lifestyle themes: sunrise sailings, waterfront dining, and seasonal events. Each post follows strict brand guidelines we established in month one.',
    result:
      'Follower growth of 120% in six months, with engagement rates consistently above industry benchmarks for luxury hospitality.',
    gallery: [
      { src: '/projects/project-4.svg', alt: 'Marina social grid', wide: true },
      { src: '/projects/project-5.svg', alt: 'Content samples' },
      { src: '/projects/project-6.svg', alt: 'Story templates' },
      { src: '/projects/project-1.svg', alt: 'Analytics overview', wide: true },
    ],
  },
  {
    id: '5',
    slug: 'paphos-estates',
    title: 'Paphos Estates',
    category: 'Photography',
    client: 'Paphos Estates Group',
    year: '2023',
    location: 'Paphos, Cyprus',
    services: ['Architecture Photography', 'Aerial Photography', 'Post-Production'],
    image: '/projects/project-5.svg',
    href: '/work/paphos-estates',
    overview:
      'Architectural and aerial photography for a portfolio of luxury villas and development sites across the Paphos region.',
    challenge:
      'The developer\'s existing photography was shot on smartphones and failed to communicate the quality of their properties to overseas buyers.',
    approach:
      'We shot over three weeks using a combination of ground-level and drone photography, timing each property for optimal natural light. Post-production enhanced without misrepresenting.',
    result:
      'The new imagery was deployed across their website, brochures, and listing platforms. Enquiry rates from international buyers increased significantly.',
    gallery: [
      { src: '/projects/project-5.svg', alt: 'Villa exterior', wide: true },
      { src: '/projects/project-6.svg', alt: 'Interior detail' },
      { src: '/projects/project-1.svg', alt: 'Aerial view' },
      { src: '/projects/project-2.svg', alt: 'Landscape context', wide: true },
    ],
  },
  {
    id: '6',
    slug: 'nea-ventures',
    title: 'Nea Ventures',
    category: 'Strategy',
    client: 'Nea Ventures Capital',
    year: '2024',
    location: 'Nicosia, Cyprus',
    services: ['Brand Strategy', 'Market Research', 'Positioning'],
    image: '/projects/project-6.svg',
    href: '/work/nea-ventures',
    overview:
      'Brand strategy and market positioning for a new venture capital firm focused on Mediterranean tech startups.',
    challenge:
      'As a new entrant in a competitive space, Nea Ventures needed a brand strategy that would immediately convey credibility and a clear investment thesis.',
    approach:
      'We conducted competitor analysis across European VC firms, interviewed founding partners, and developed a positioning framework that balances ambition with regional expertise.',
    result:
      'The strategy informed all subsequent brand and marketing decisions, helping Nea Ventures secure meetings with top-tier founders within their first quarter.',
    gallery: [
      { src: '/projects/project-6.svg', alt: 'Strategy framework', wide: true },
      { src: '/projects/project-1.svg', alt: 'Research findings' },
      { src: '/projects/project-2.svg', alt: 'Brand architecture' },
      { src: '/projects/project-3.svg', alt: 'Implementation roadmap', wide: true },
    ],
  },
  {
    id: '7',
    slug: 'kolossi-studio',
    title: 'Kolossi Studio',
    category: 'Branding',
    client: 'Kolossi Design Studio',
    year: '2023',
    location: 'Limassol, Cyprus',
    services: ['Brand Identity', 'Naming', 'Brand Guidelines'],
    image: '/projects/project-1.svg',
    href: '/work/kolossi-studio',
    overview:
      'Complete brand identity for an architecture and interior design studio, from naming through to a comprehensive brand guidelines document.',
    challenge:
      'The founders were operating under a placeholder name with no visual identity. They needed a brand that matched the sophistication of their architectural work.',
    approach:
      'We explored naming conventions rooted in Cypriot geography — Kolossi references the medieval castle in Limassol — and built a minimal identity system around geometric precision.',
    result:
      'The studio launched with a polished identity that immediately positioned them as a serious player in the Limassol design scene.',
    gallery: [
      { src: '/projects/project-1.svg', alt: 'Brand identity system', wide: true },
      { src: '/projects/project-3.svg', alt: 'Logo construction' },
      { src: '/projects/project-4.svg', alt: 'Typography system' },
      { src: '/projects/project-5.svg', alt: 'Guidelines document', wide: true },
    ],
  },
  {
    id: '8',
    slug: 'petra-co',
    title: 'Petra & Co',
    category: 'Video',
    client: 'Petra & Co Jewellers',
    year: '2024',
    location: 'Paphos, Cyprus',
    services: ['Video Production', 'Motion Graphics', 'Social Edits'],
    image: '/projects/project-2.svg',
    href: '/work/petra-co',
    overview:
      'A suite of brand films and social video content for an independent jewellery house, capturing the craft behind each piece.',
    challenge:
      'Petra & Co\'s products are handcrafted, but their digital presence didn\'t convey that story. They needed video content that showed the human touch.',
    approach:
      'We produced a hero brand film and a series of short-form social edits, filming in their workshop and showroom. The pacing is deliberately slow, letting viewers appreciate the detail.',
    result:
      'The brand film became the centrepiece of their website, and the social edits drove a notable uplift in engagement and in-store visits.',
    gallery: [
      { src: '/projects/project-2.svg', alt: 'Brand film still', wide: true },
      { src: '/projects/project-4.svg', alt: 'Workshop footage' },
      { src: '/projects/project-5.svg', alt: 'Social edit frames' },
      { src: '/projects/project-6.svg', alt: 'Motion graphics', wide: true },
    ],
  },
  {
    id: '9',
    slug: 'akamas-wild',
    title: 'Akamas Wild',
    category: 'Print',
    client: 'Akamas Wild Adventures',
    year: '2023',
    location: 'Akamas, Cyprus',
    services: ['Print Design', 'Illustration', 'Packaging'],
    image: '/projects/project-3.svg',
    href: '/work/akamas-wild',
    overview:
      'Print collateral and illustrated materials for an eco-tourism operator in the Akamas Peninsula, Cyprus\'s last wilderness.',
    challenge:
      'Akamas Wild needed printed materials — trail maps, information booklets, merchandise — that felt authentic to the rugged landscape without looking amateur.',
    approach:
      'We developed a hand-drawn illustration style inspired by topographic maps and botanical drawings. Every printed piece uses recycled paper stocks and soy-based inks.',
    result:
      'The materials are now distributed across visitor centres and partner hotels, earning praise for their quality and environmental consideration.',
    gallery: [
      { src: '/projects/project-3.svg', alt: 'Print collateral spread', wide: true },
      { src: '/projects/project-6.svg', alt: 'Trail map illustration' },
      { src: '/projects/project-1.svg', alt: 'Booklet interior' },
      { src: '/projects/project-2.svg', alt: 'Merchandise packaging', wide: true },
    ],
  },
];

// =============================================================================
// SERVICES
// =============================================================================

export const services: Service[] = [
  {
    id: 'branding',
    number: '01',
    title: 'Branding',
    description:
      'We build brand identities that resonate. From strategy and naming to visual systems and guidelines, we craft every element to communicate who you are.',
    capabilities: ['Brand Strategy', 'Visual Identity', 'Naming', 'Brand Guidelines', 'Tone of Voice'],
  },
  {
    id: 'web-design',
    number: '02',
    title: 'Web Design',
    description:
      'Websites that perform as beautifully as they look. We design and develop fast, responsive sites that convert visitors into clients.',
    capabilities: ['UI/UX Design', 'Responsive Design', 'Prototyping', 'Design Systems', 'Interaction Design'],
  },
  {
    id: 'social-media',
    number: '03',
    title: 'Social Media',
    description:
      'Strategic content that builds communities. We plan, create, and manage social presences that drive meaningful engagement.',
    capabilities: ['Content Strategy', 'Content Creation', 'Community Management', 'Paid Social', 'Analytics'],
  },
  {
    id: 'strategy',
    number: '04',
    title: 'Strategy',
    description:
      'Clear thinking before creative execution. We research, analyse, and define the strategic foundations that make creative work effective.',
    capabilities: ['Market Research', 'Competitor Analysis', 'Positioning', 'Go-to-Market', 'Brand Architecture'],
  },
  {
    id: 'video',
    number: '05',
    title: 'Video Production',
    description:
      'Films that tell your story with craft and intention. From brand documentaries to social edits, we produce video content that connects.',
    capabilities: ['Brand Films', 'Social Video', 'Motion Graphics', 'Drone Footage', 'Post-Production'],
  },
  {
    id: 'photography',
    number: '06',
    title: 'Photography',
    description:
      'Images that elevate perception. We shoot architecture, products, portraits, and lifestyle with a consistent editorial eye.',
    capabilities: ['Architecture', 'Product', 'Portrait', 'Lifestyle', 'Aerial / Drone'],
  },
  {
    id: 'print',
    number: '07',
    title: 'Print Design',
    description:
      'Tangible design that leaves a lasting impression. We create printed materials with the same care and precision as our digital work.',
    capabilities: ['Editorial Design', 'Packaging', 'Signage', 'Illustration', 'Production Management'],
  },
  {
    id: 'art-direction',
    number: '08',
    title: 'Art Direction',
    description:
      'Cohesive creative vision across every touchpoint. We direct shoots, campaigns, and creative projects to ensure consistency and impact.',
    capabilities: ['Campaign Direction', 'Shoot Direction', 'Creative Concepts', 'Visual Storytelling', 'Moodboarding'],
  },
];

// =============================================================================
// AGENCY STATS
// =============================================================================

export const agencyStats: Stat[] = [
  { value: '5+', label: 'Years' },
  { value: '80+', label: 'Projects' },
  { value: '40+', label: 'Clients' },
  { value: '6', label: 'Countries' },
];
