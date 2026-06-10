// =============================================================================
// GEO CONTENT DATA — International Aura and Dream School
// =============================================================================

import type { GeoLocation, FAQItem, TimeZoneEntry } from './types';
import { scheduleStages, roseMeditationScheduleStages } from './mock-data';

// =============================================================================
// LOCATIONS
// =============================================================================

export const geoLocations: GeoLocation[] = [
  // ─── Online (non-geo catch-all) ───────────────────────────────────────────
  {
    id: 'online',
    slug: 'online',
    city: 'Online',
    region: '',
    country: '',
    timezoneKey: null,
    timezoneLabel: 'Multiple Timezones',
    intro:
      'Join Rose Meditation and Aura Reading courses from anywhere in the world. All classes are delivered live online with multi-timezone scheduling across the Americas, Europe, and beyond — no travel required. Connect with a global community of 5,000+ initiates from the comfort of your home.',
    keywords: [
      'online meditation course',
      'aura reading course online',
      'learn meditation online',
      'virtual meditation class',
      'online energy healing course',
      'clairvoyance training online',
    ],
  },

  // ─── Pacific Time ─────────────────────────────────────────────────────────
  {
    id: 'san-francisco',
    slug: 'san-francisco',
    city: 'San Francisco',
    region: 'California',
    country: 'United States',
    timezoneKey: 'mexicoCity',
    timezoneLabel: 'Pacific Time (PT)',
    intro:
      'Join Rose Meditation and Aura Reading courses from San Francisco. Live online classes run at convenient Pacific Time hours — morning sessions fit naturally into your Bay Area routine. Connect with a global community of practitioners without leaving home.',
    keywords: [
      'meditation classes san francisco',
      'aura reading course san francisco',
      'energy healing san francisco',
      'meditation course bay area',
    ],
  },
  {
    id: 'los-angeles',
    slug: 'los-angeles',
    city: 'Los Angeles',
    region: 'California',
    country: 'United States',
    timezoneKey: 'mexicoCity',
    timezoneLabel: 'Pacific Time (PT)',
    intro:
      'Join Rose Meditation and Aura Reading courses from Los Angeles. Live online classes are scheduled for Pacific Time — attend from anywhere in LA with morning and midday sessions. No commute, no traffic, just presence.',
    keywords: [
      'meditation classes los angeles',
      'aura reading course los angeles',
      'energy healing los angeles',
      'spiritual development la',
    ],
  },

  {
    id: 'mount-shasta',
    slug: 'mount-shasta',
    city: 'Mount Shasta',
    region: 'California',
    country: 'United States',
    timezoneKey: 'mexicoCity',
    timezoneLabel: 'Pacific Time (PT)',
    intro:
      'Join Rose Meditation and Aura Reading courses from Mount Shasta, California. Live online classes at Pacific Time hours — morning sessions that align with the sacred energy of the mountain. Connect with a global community of 5,000+ initiates from one of the world\'s most revered spiritual power centers.',
    keywords: [
      'meditation classes mount shasta',
      'spiritual retreat mount shasta',
      'aura reading course mount shasta',
      'energy healing mount shasta california',
      'meditation mount shasta ca',
      'spiritual community shasta',
    ],
  },

  {
    id: 'sedona',
    slug: 'sedona',
    city: 'Sedona',
    region: 'Arizona',
    country: 'United States',
    timezoneKey: 'mexicoCity',
    timezoneLabel: 'Mountain Standard Time (MST)',
    intro:
      'Join Rose Meditation and Aura Reading courses from Sedona, Arizona — one of the world\'s most recognized energy vortex sites. Live online classes at Mountain Standard Time hours — morning sessions that align with the red rock energy. Connect with a global community of 5,000+ initiates from the heart of the desert.',
    keywords: [
      'meditation classes sedona',
      'spiritual retreat sedona arizona',
      'aura reading course sedona',
      'energy healing sedona',
      'vortex meditation sedona',
      'spiritual community sedona az',
    ],
  },

  // ─── Colombia / Central America Time ──────────────────────────────────────
  {
    id: 'bogota',
    slug: 'bogota',
    city: 'Bogotá',
    region: '',
    country: 'Colombia',
    timezoneKey: 'mexicoCity',
    timezoneLabel: 'Colombia Time (COT)',
    intro:
      'Únete a los cursos de Meditación con Rosas y Lectura de Aura desde Bogotá. Todas las clases en vivo están programadas en horario de Colombia — sesiones matutinas y de mediodía que se integran a tu día. Join Rose Meditation and Aura Reading courses from Bogotá with classes at convenient Colombia Time hours.',
    keywords: [
      'meditation classes bogota',
      'aura reading course bogota',
      'meditacion bogota',
      'lectura de aura bogota',
      'curso meditacion colombia',
    ],
  },
  {
    id: 'mexico-city',
    slug: 'mexico-city',
    city: 'Mexico City',
    region: '',
    country: 'Mexico',
    timezoneKey: 'mexicoCity',
    timezoneLabel: 'Central Time (CST)',
    intro:
      'Join Rose Meditation and Aura Reading courses from Mexico City. Live online classes are scheduled at hours that work for Central Time — no need to travel. Conecta con una comunidad global de más de 5,000 iniciados desde la comodidad de tu hogar.',
    keywords: [
      'meditation classes mexico city',
      'clases meditacion ciudad de mexico',
      'aura reading course mexico',
      'curso lectura de aura mexico',
    ],
  },

  {
    id: 'oaxaca',
    slug: 'oaxaca',
    city: 'Oaxaca',
    region: 'Oaxaca',
    country: 'Mexico',
    timezoneKey: 'mexicoCity',
    timezoneLabel: 'Central Time (CST)',
    intro:
      'Join Rose Meditation and Aura Reading courses from Oaxaca, Mexico. Live online classes at Central Time hours — morning and midday sessions that complement the ancestral energy of this sacred land. Conecta con una comunidad global de más de 5,000 iniciados desde uno de los centros espirituales más profundos de México.',
    keywords: [
      'meditation classes oaxaca',
      'retiro espiritual oaxaca',
      'aura reading course oaxaca mexico',
      'meditacion oaxaca',
      'energy healing oaxaca',
      'curso meditacion oaxaca',
    ],
  },
  {
    id: 'tulum',
    slug: 'tulum',
    city: 'Tulum',
    region: 'Quintana Roo',
    country: 'Mexico',
    timezoneKey: 'mexicoCity',
    timezoneLabel: 'Central Time (CST)',
    intro:
      'Join Rose Meditation and Aura Reading courses from Tulum. Live online classes at Central Time hours — perfect for your rhythm in the Riviera Maya. Conecta con una comunidad global de más de 5,000 iniciados sin salir de tu santuario en el Caribe.',
    keywords: [
      'meditation classes tulum',
      'meditation tulum mexico',
      'aura reading course tulum',
      'retiro espiritual tulum',
      'energy healing tulum',
      'curso meditacion tulum',
    ],
  },
  {
    id: 'austin',
    slug: 'austin',
    city: 'Austin',
    region: 'Texas',
    country: 'United States',
    timezoneKey: 'mexicoCity',
    timezoneLabel: 'Central Time (CT)',
    intro:
      'Join Rose Meditation and Aura Reading courses from Austin, Texas. Live online classes run at convenient Central Time hours — morning and midday sessions that fit your schedule. Connect with a global community of 5,000+ initiates from the comfort of your home.',
    keywords: [
      'meditation classes austin',
      'aura reading course austin texas',
      'energy healing austin',
      'spiritual development austin',
      'meditation course texas',
    ],
  },
  {
    id: 'san-jose-costa-rica',
    slug: 'san-jose-costa-rica',
    city: 'San José',
    region: '',
    country: 'Costa Rica',
    timezoneKey: 'mexicoCity',
    timezoneLabel: 'Central Standard Time (CST)',
    intro:
      'Join Rose Meditation and Aura Reading courses from San José, Costa Rica. Live online classes at Central Time hours — morning and midday sessions that complement the pura vida rhythm. Conecta con una comunidad global de más de 5,000 iniciados desde la comodidad de tu hogar.',
    keywords: [
      'meditation classes costa rica',
      'aura reading course costa rica',
      'meditacion san jose costa rica',
      'curso lectura de aura costa rica',
      'retiro espiritual costa rica',
    ],
  },

  {
    id: 'denver',
    slug: 'denver',
    city: 'Denver',
    region: 'Colorado',
    country: 'United States',
    timezoneKey: 'mexicoCity',
    timezoneLabel: 'Mountain Time (MT)',
    intro:
      'Join Rose Meditation and Aura Reading courses from Denver, Colorado. Live online classes at Mountain Time hours — morning sessions that align with the mile-high rhythm. Connect with a global community of 5,000+ initiates from the comfort of your home.',
    keywords: [
      'meditation classes denver',
      'aura reading course denver',
      'energy healing denver colorado',
      'spiritual development denver',
      'meditation course colorado',
    ],
  },

  // ─── Eastern Time ─────────────────────────────────────────────────────────
  {
    id: 'new-york',
    slug: 'new-york',
    city: 'New York',
    region: 'New York',
    country: 'United States',
    timezoneKey: 'newYork',
    timezoneLabel: 'Eastern Time (ET)',
    intro:
      'Join Rose Meditation and Aura Reading courses from New York. All live classes run at convenient Eastern Time hours — morning through early afternoon sessions that fit your schedule. Connect with a global community of 5,000+ initiates without leaving the city.',
    keywords: [
      'meditation classes new york',
      'aura reading course new york',
      'energy healing new york',
      'meditation course nyc',
      'spiritual development new york',
    ],
  },
  {
    id: 'miami',
    slug: 'miami',
    city: 'Miami',
    region: 'Florida',
    country: 'United States',
    timezoneKey: 'newYork',
    timezoneLabel: 'Eastern Time (ET)',
    intro:
      'Join Rose Meditation and Aura Reading courses from Miami. Live online classes at Eastern Time hours — morning and midday sessions designed for your rhythm. A vibrant Latin American and international community awaits.',
    keywords: [
      'meditation classes miami',
      'aura reading course miami',
      'energy healing miami',
      'spiritual classes miami',
    ],
  },
  {
    id: 'toronto',
    slug: 'toronto',
    city: 'Toronto',
    region: 'Ontario',
    country: 'Canada',
    timezoneKey: 'newYork',
    timezoneLabel: 'Eastern Time (ET)',
    intro:
      'Join Rose Meditation and Aura Reading courses from Toronto. Live online classes are scheduled for Eastern Time — attend from anywhere in the GTA. Connect with practitioners across 50+ countries from the comfort of your home.',
    keywords: [
      'meditation classes toronto',
      'aura reading course toronto',
      'energy healing toronto',
      'meditation course canada',
    ],
  },

  {
    id: 'asheville',
    slug: 'asheville',
    city: 'Asheville',
    region: 'North Carolina',
    country: 'United States',
    timezoneKey: 'newYork',
    timezoneLabel: 'Eastern Time (ET)',
    intro:
      'Join Rose Meditation and Aura Reading courses from Asheville, North Carolina. Live online classes at Eastern Time hours — morning and midday sessions that complement the mountain energy of the Blue Ridge. Connect with a global community of 5,000+ initiates.',
    keywords: [
      'meditation classes asheville',
      'aura reading course asheville nc',
      'energy healing asheville',
      'spiritual community asheville',
      'meditation course north carolina',
    ],
  },

  // ─── Brasilia Time ────────────────────────────────────────────────────────
  {
    id: 'sao-paulo',
    slug: 'sao-paulo',
    city: 'São Paulo',
    region: '',
    country: 'Brazil',
    timezoneKey: 'brasilia',
    timezoneLabel: 'Brasília Time (BRT)',
    intro:
      'Participe dos cursos de Meditação com Rosas e Leitura de Aura a partir de São Paulo. Todas as aulas ao vivo acontecem no horário de Brasília — sessões matutinas e vespertinas que se encaixam na sua rotina. Join Rose Meditation and Aura Reading courses from São Paulo with classes at Brasília Time hours.',
    keywords: [
      'meditacao sao paulo',
      'curso leitura de aura sao paulo',
      'meditation classes sao paulo',
      'aura reading course brazil',
      'meditacao online brasil',
    ],
  },
  {
    id: 'rio-de-janeiro',
    slug: 'rio-de-janeiro',
    city: 'Rio de Janeiro',
    region: '',
    country: 'Brazil',
    timezoneKey: 'brasilia',
    timezoneLabel: 'Brasília Time (BRT)',
    intro:
      'Participe dos cursos de Meditação com Rosas e Leitura de Aura a partir do Rio de Janeiro. Aulas ao vivo no horário de Brasília — conecte-se com uma comunidade global de mais de 5.000 iniciados. Join from Rio with classes at convenient Brasília Time hours.',
    keywords: [
      'meditacao rio de janeiro',
      'curso leitura de aura rio',
      'meditation classes rio de janeiro',
      'aura reading course rio',
    ],
  },
  {
    id: 'buenos-aires',
    slug: 'buenos-aires',
    city: 'Buenos Aires',
    region: '',
    country: 'Argentina',
    timezoneKey: 'brasilia',
    timezoneLabel: 'Argentina Time (ART)',
    intro:
      'Sumate a los cursos de Meditación con Rosas y Lectura de Aura desde Buenos Aires. Las clases en vivo se programan en horario de Argentina — sesiones de mañana y tarde que se integran a tu día. Join from Buenos Aires with classes at convenient local hours.',
    keywords: [
      'meditacion buenos aires',
      'lectura de aura buenos aires',
      'meditation classes buenos aires',
      'curso meditacion argentina',
    ],
  },

  // ─── GMT / London Time ────────────────────────────────────────────────────
  {
    id: 'london',
    slug: 'london',
    city: 'London',
    region: '',
    country: 'United Kingdom',
    timezoneKey: 'london',
    timezoneLabel: 'Greenwich Mean Time (GMT)',
    intro:
      'Join Rose Meditation and Aura Reading courses from London. Live online classes run at afternoon and evening GMT hours — perfect for fitting around your day. Connect with a global community of 5,000+ initiates across 50+ countries.',
    keywords: [
      'meditation classes london',
      'aura reading course london',
      'energy healing london',
      'meditation course uk',
      'spiritual development london',
    ],
  },
  {
    id: 'lisbon',
    slug: 'lisbon',
    city: 'Lisbon',
    region: '',
    country: 'Portugal',
    timezoneKey: 'london',
    timezoneLabel: 'Western European Time (WET)',
    intro:
      'Participe dos cursos de Meditação com Rosas e Leitura de Aura a partir de Lisboa. Aulas ao vivo à tarde e noite — horário perfeito para Portugal. Join from Lisbon with afternoon and evening class times that fit your schedule.',
    keywords: [
      'meditacao lisboa',
      'curso leitura de aura lisboa',
      'meditation classes lisbon',
      'aura reading course portugal',
    ],
  },

  // ─── CET / Madrid Time ────────────────────────────────────────────────────
  {
    id: 'madrid',
    slug: 'madrid',
    city: 'Madrid',
    region: '',
    country: 'Spain',
    timezoneKey: 'london',
    timezoneLabel: 'Central European Time (CET)',
    intro:
      'Únete a los cursos de Meditación con Rosas y Lectura de Aura desde Madrid. Clases en vivo por la tarde y noche en horario CET. Join Rose Meditation and Aura Reading courses from Madrid with afternoon and evening class times.',
    keywords: [
      'meditacion madrid',
      'lectura de aura madrid',
      'meditation classes madrid',
      'curso meditacion espana',
    ],
  },
  {
    id: 'barcelona',
    slug: 'barcelona',
    city: 'Barcelona',
    region: '',
    country: 'Spain',
    timezoneKey: 'london',
    timezoneLabel: 'Central European Time (CET)',
    intro:
      'Join Rose Meditation and Aura Reading courses from Barcelona. Live online classes at CET afternoon and evening hours — no travel required. Conecta con una comunidad global de practicantes desde la comodidad de tu hogar.',
    keywords: [
      'meditation classes barcelona',
      'meditacion barcelona',
      'aura reading course barcelona',
      'curso lectura de aura barcelona',
    ],
  },
  {
    id: 'paris',
    slug: 'paris',
    city: 'Paris',
    region: '',
    country: 'France',
    timezoneKey: 'london',
    timezoneLabel: 'Central European Time (CET)',
    intro:
      'Rejoignez les cours de Méditation de la Rose et de Lecture d\'Aura depuis Paris. Les cours en direct se déroulent l\'après-midi et le soir, heure CET. Join Rose Meditation and Aura Reading courses from Paris with afternoon and evening class times.',
    keywords: [
      'meditation classes paris',
      'aura reading course paris',
      'cours meditation paris',
      'developpement spirituel paris',
    ],
  },
  {
    id: 'berlin',
    slug: 'berlin',
    city: 'Berlin',
    region: '',
    country: 'Germany',
    timezoneKey: 'london',
    timezoneLabel: 'Central European Time (CET)',
    intro:
      'Join Rose Meditation and Aura Reading courses from Berlin. Live online classes at CET afternoon and evening hours — connect with a global community of 5,000+ initiates from the comfort of your home.',
    keywords: [
      'meditation classes berlin',
      'aura reading course berlin',
      'energy healing berlin',
      'meditation kurs berlin',
    ],
  },
  {
    id: 'ibiza',
    slug: 'ibiza',
    city: 'Ibiza',
    region: 'Balearic Islands',
    country: 'Spain',
    timezoneKey: 'london',
    timezoneLabel: 'Central European Time (CET)',
    intro:
      'Join Rose Meditation and Aura Reading courses from Ibiza. Live online classes at CET afternoon and evening hours — deepen your practice from the island of transformation. Conecta con una comunidad global de más de 5,000 iniciados sin salir de la isla.',
    keywords: [
      'meditation classes ibiza',
      'spiritual retreat ibiza',
      'aura reading course ibiza',
      'energy healing ibiza',
      'retiro espiritual ibiza',
      'meditation ibiza spain',
    ],
  },
  {
    id: 'paphos',
    slug: 'paphos',
    city: 'Paphos',
    region: '',
    country: 'Cyprus',
    timezoneKey: 'london',
    timezoneLabel: 'Eastern European Time (EET)',
    intro:
      'Join Rose Meditation and Aura Reading courses from Paphos, Cyprus — home to the International Aura and Dream School guardians and Digital Cultures. Live online classes with afternoon and evening session times. Experience the birthplace of this living ecosystem.',
    keywords: [
      'meditation classes paphos',
      'meditation classes cyprus',
      'aura reading course cyprus',
      'energy healing paphos',
      'spiritual development cyprus',
    ],
  },
  // ─── AEST / Australia ──────────────────────────────────────────────────────
  {
    id: 'byron-bay',
    slug: 'byron-bay',
    city: 'Byron Bay',
    region: 'New South Wales',
    country: 'Australia',
    timezoneKey: null,
    timezoneLabel: 'Australian Eastern Time (AEST)',
    intro:
      'Join Rose Meditation and Aura Reading courses from Byron Bay, Australia. Live online classes are scheduled across multiple timezone bands — evening sessions available for Australian Eastern Time. Connect with a global community of 5,000+ initiates from one of the world\'s most beloved spiritual and wellness destinations.',
    keywords: [
      'meditation classes byron bay',
      'spiritual retreat byron bay',
      'aura reading course byron bay',
      'energy healing byron bay australia',
      'meditation course australia',
      'spiritual community byron bay',
    ],
  },
];

// =============================================================================
// FAQS
// =============================================================================

export const geoFAQs: FAQItem[] = [
  {
    id: 'what-is-rose-meditation',
    question: 'What is Rose Meditation?',
    answer:
      'Rose Meditation is a practice that uses the image and energy of the rose to cleanse and protect your aura — your energetic field. Through simple yet powerful techniques, you learn to release energies that don\'t belong to you (from people, places, memories, or situations) and return to the presence of your own essence. It is the foundational practice of the International Aura and Dream School ecosystem, developed over 30+ years and practiced by 5,000+ initiates across 50+ countries.',
    category: 'about',
  },
  {
    id: 'how-does-aura-reading-work',
    question: 'How does aura reading work?',
    answer:
      'Aura Reading is the practice of seeing, feeling, and listening to the energy that moves within and around a person. By awakening your subtle senses — clairvoyance (clear seeing), clairsentience (clear feeling), and clairaudience (clear hearing) — you learn to read the layers of someone\'s energetic field. Each reading becomes a conscious exchange where both the reader and the person being read are touched and transformed. The course teaches you these abilities through guided practice with fellow students.',
    category: 'about',
  },
  {
    id: 'what-is-chakra-cleansing',
    question: 'What is chakra cleansing meditation?',
    answer:
      'Chakra cleansing is a core component of Rose Meditation. Your chakras are energy centers that run along the central axis of your body. Over time, they accumulate energies from your environment, relationships, and experiences. Through the rose meditation technique, you learn to cleanse each chakra — releasing what doesn\'t serve you and restoring your natural energetic balance. This is not a belief system but a practical technique you can feel working from your very first session.',
    category: 'about',
  },
  {
    id: 'what-is-clairvoyance-training',
    question: 'What is clairvoyance training?',
    answer:
      'Clairvoyance literally means "clear seeing." In the International Aura and Dream School system, clairvoyance training is part of the Aura Reading course where you learn to perceive energy visually through your inner sight (the 6th chakra). This isn\'t about seeing the future — it\'s about developing the ability to see energy as it exists right now: colors, images, and patterns in someone\'s aura that reveal their inner state. Everyone has this capacity; the training simply helps you remember and develop it.',
    category: 'about',
  },
  {
    id: 'is-this-religious',
    question: 'Is this a religious practice?',
    answer:
      'No. International Aura and Dream School is not affiliated with any religion, dogma, or belief system. It is a practical, experiential path — a set of techniques and practices for working with your own energy and consciousness. People from all backgrounds, faiths, and walks of life participate. The only requirement is your openness to explore your own inner landscape.',
    category: 'about',
  },
  {
    id: 'need-prior-experience',
    question: 'Do I need prior meditation or spiritual experience?',
    answer:
      'No prior experience is needed. Rose Meditation Level 1 is designed for complete beginners. The techniques are simple and practical — if you can close your eyes and imagine a rose, you can do this work. Many students come with zero meditation background and report feeling the effects from their very first session.',
    category: 'logistics',
  },
  {
    id: 'how-are-classes-delivered',
    question: 'How are the classes delivered?',
    answer:
      'All classes are delivered live online via video conferencing. You attend in real time with a teacher and fellow students — this is not pre-recorded content. Classes include guided meditations, teaching, practice sessions, and Q&A. The live format is essential because the energy work and aura readings happen between real people in real time. Recordings are not provided as substitutes for live attendance.',
    category: 'logistics',
  },
  {
    id: 'what-timezones',
    question: 'What timezones do you support?',
    answer:
      'Classes are scheduled across 4 major timezone bands to accommodate students worldwide: Mexico City (Central Time), New York (Eastern Time), Brasília (Brazil / Argentina), and London (UK / Portugal / Europe). Practice sessions are offered in multiple time slots so you can choose what fits your schedule.',
    category: 'logistics',
  },
  {
    id: 'how-long-rose-meditation',
    question: 'How long is the Rose Meditation course?',
    answer:
      'Rose Meditation spans 2 immersive days with two 3-hour sessions each day. In just those 2 days, you learn the complete foundation: how to ground yourself, cleanse your aura, protect your energy, and meditate with roses. You leave with a daily practice you can use for life.',
    category: 'logistics',
  },
  {
    id: 'how-long-aura-reading',
    question: 'How long is the Aura Reading course?',
    answer:
      'Aura Reading Level 1 is a multi-month program running from March through June 2026. It begins with the 2-day Rose Meditation foundation, followed by Aura Reading classes spread across select dates and weekly practice sessions. Daily Rose Meditation guidance is included throughout. You can choose from practice time slots that fit your schedule.',
    category: 'logistics',
  },
  {
    id: 'rose-meditation-standalone',
    question: 'Can I take Rose Meditation without Aura Reading?',
    answer:
      'Yes. Rose Meditation is offered as a standalone 2-day course. It is a complete practice in itself — you don\'t need to continue to Aura Reading unless you feel called to. Many people take Rose Meditation on its own and develop a lifelong daily practice with it. If you do want to continue, Rose Meditation is also included as the first 2 days of the Aura Reading course.',
    category: 'logistics',
  },
  {
    id: 'what-will-i-learn',
    question: 'What will I learn in the course?',
    answer:
      'In Rose Meditation, you learn: grounding, running your earth and cosmic energy, cleansing your aura and chakras with roses, creating energetic protection, and establishing a daily meditation practice. In Aura Reading Level 1, you additionally learn: how to see and read another person\'s aura, how to give and receive aura readings, developing your clairvoyance, clairsentience, and clairaudience, and working with energy in a conscious, ethical way.',
    category: 'practice',
  },
  {
    id: 'what-happens-after',
    question: 'What happens after the course?',
    answer:
      'After completing a course, you gain access to the International Aura and Dream School community — a living ecosystem of continued practice. This includes free weekly gatherings, ongoing Rose Meditation guidances, practitioner meetings, and the opportunity to continue with advanced programs like Aura Reading Level 2, Aura for Life, and eventually Teachers Training. The path unfolds at your own pace.',
    category: 'practice',
  },
  {
    id: 'how-much-does-it-cost',
    question: 'How much do the courses cost?',
    answer:
      'International Aura and Dream School uses a "pay what feels right" contribution model with three tiers: Seed (a gentle entry), Bloom (a balanced exchange), and Canopy (a generous offering that supports accessibility for others). Rose Meditation ranges from $222 to $777. The full Aura Reading Level 1 (which includes Rose Meditation) ranges from $888 to $2,111. Your presence matters more than the amount.',
    category: 'pricing',
  },
  {
    id: 'pay-what-feels-right',
    question: 'What is the "pay what feels right" model?',
    answer:
      'Rather than a fixed price, International Aura and Dream School offers three contribution tiers so you can choose what aligns with your current financial season. The Seed tier is for those in a quieter financial period. The Bloom tier reflects a balanced exchange. The Canopy tier is a generous offering that helps make the work accessible to others. There is no difference in what you receive — all tiers access the same complete course and community.',
    category: 'pricing',
  },
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/** Get a location by its URL slug */
export function getLocationBySlug(slug: string): GeoLocation | undefined {
  return geoLocations.find((loc) => loc.slug === slug);
}

/** Get all location slugs for static params */
export function getAllLocationSlugs(): string[] {
  return geoLocations.map((loc) => loc.slug);
}

/** Get the schedule for a specific location, extracting only its timezone column */
export function getScheduleForLocation(
  location: GeoLocation,
  stages: typeof scheduleStages = scheduleStages
): { title: string; dateRange: string; sessions: { day: string; duration: string; time: string }[] }[] {
  if (!location.timezoneKey) {
    // Online — return null, page will show all timezones
    return [];
  }

  const key = location.timezoneKey;

  return stages.map((stage) => ({
    title: stage.title,
    dateRange: stage.dateRange,
    sessions: stage.sessions
      .filter((session) => session.time[key] !== '-')
      .map((session) => ({
        day: session.day,
        duration: session.duration,
        time: session.time[key],
      })),
  }));
}

/** Get Rose Meditation schedule for a location */
export function getRoseMeditationScheduleForLocation(location: GeoLocation) {
  return getScheduleForLocation(location, roseMeditationScheduleStages);
}
