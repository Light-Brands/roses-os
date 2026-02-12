/**
 * Design Tokens — ROSES OS
 * Warm, sacred design system with organic curves and contemplative rhythm
 * Palette: warm whites, rose clay, deep earth, soft gold, sage mist
 */

// =============================================================================
// COLOR PALETTE
// =============================================================================

export const colors = {
  // Brand Core
  brand: {
    warmWhite: '#FAF8F5',
    softIvory: '#F5F0EB',
    mutedStone: '#E8E0D8',
    roseClay: '#9C6F6E',
    deepEarth: '#3B2F2F',
    charcoalVeil: '#2C2C2C',
  },

  // Accents
  accent: {
    softGold: '#C4A86B',
    sageMist: '#A3B5A6',
    dustyLavender: '#B8A9C9',
  },

  // Rose scale (for field usage)
  rose: {
    50: '#FDF8F7',
    100: '#FAF0EE',
    200: '#F5E1DD',
    300: '#E8C4BF',
    400: '#D4A09A',
    500: '#9C6F6E',
    600: '#8A5E5D',
    700: '#6E4A49',
    800: '#523737',
    900: '#3B2828',
    950: '#2A1C1C',
  },

  // Warm neutrals (replacing cold greys)
  warm: {
    0: '#FFFFFF',
    50: '#FAF8F5',
    100: '#F5F0EB',
    200: '#E8E0D8',
    300: '#D4C8BE',
    400: '#B5A89D',
    500: '#8C7E73',
    600: '#6B5F56',
    700: '#504540',
    800: '#3B2F2F',
    900: '#2A2020',
    950: '#1A1716',
  },

  // Chakra colors (for teacher section)
  chakra: {
    root: '#C0392B',
    sacral: '#E67E22',
    solarPlexus: '#F1C40F',
    heart: '#27AE60',
    throat: '#2980B9',
    thirdEye: '#8E44AD',
    crown: '#9B59B6',
  },

  // Status colors — warm-shifted
  status: {
    success: {
      light: '#F0F7F2',
      default: '#5B9A6F',
      dark: '#3D7A52',
      subtle: '#E3F0E7',
    },
    warning: {
      light: '#FDF8F0',
      default: '#C4A86B',
      dark: '#A68D55',
      subtle: '#F7F0E0',
    },
    error: {
      light: '#FDF5F4',
      default: '#C0392B',
      dark: '#A32F24',
      subtle: '#F5E3E0',
    },
    info: {
      light: '#F5F0EB',
      default: '#6B5F56',
      dark: '#504540',
      subtle: '#E8E0D8',
    },
  },

  // Gradients — warm, organic
  gradients: {
    primary: 'linear-gradient(135deg, #3B2F2F 0%, #1A1716 100%)',
    secondary: 'linear-gradient(135deg, #6B5F56 0%, #3B2F2F 100%)',
    subtle: 'linear-gradient(135deg, #FAF8F5 0%, #F5F0EB 100%)',
    dark: 'linear-gradient(135deg, #1A1716 0%, #2A2020 100%)',
    glass: 'linear-gradient(135deg, rgba(250,248,245,0.1) 0%, rgba(250,248,245,0.03) 100%)',
    rose: 'linear-gradient(135deg, #9C6F6E 0%, #6E4A49 100%)',
    gold: 'linear-gradient(135deg, #C4A86B 0%, #A68D55 100%)',
    mesh: 'radial-gradient(ellipse 80% 50% at 35% 20%, rgba(156,111,110,0.06) 0px, transparent 50%), radial-gradient(ellipse 60% 40% at 75% 80%, rgba(196,168,107,0.04) 0px, transparent 50%)',
  },
} as const;

// =============================================================================
// TYPOGRAPHY
// =============================================================================

export const typography = {
  // Font families — Cormorant Garamond (display) + Inter (body)
  fonts: {
    serif: 'var(--font-serif, "Cormorant Garamond", Georgia, "Times New Roman", serif)',
    sans: 'var(--font-sans, "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
    mono: 'var(--font-mono, ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace)',
    display: 'var(--font-serif, "Cormorant Garamond", Georgia, "Times New Roman", serif)',
  },

  // Font sizes — fluid scale
  scale: {
    '7xl': { fontSize: '4.5rem', lineHeight: '1.1', letterSpacing: '-0.02em' },
    '6xl': { fontSize: '3.75rem', lineHeight: '1.1', letterSpacing: '-0.02em' },
    '5xl': { fontSize: '3rem', lineHeight: '1.1', letterSpacing: '-0.02em' },
    '4xl': { fontSize: '2.25rem', lineHeight: '1.15', letterSpacing: '-0.015em' },
    '3xl': { fontSize: '1.875rem', lineHeight: '1.2', letterSpacing: '-0.01em' },
    '2xl': { fontSize: '1.5rem', lineHeight: '1.3', letterSpacing: '-0.01em' },
    'xl': { fontSize: '1.25rem', lineHeight: '1.4', letterSpacing: '-0.005em' },
    'lg': { fontSize: '1.125rem', lineHeight: '1.7', letterSpacing: '0' },
    'base': { fontSize: '1rem', lineHeight: '1.7', letterSpacing: '0' },
    'sm': { fontSize: '0.875rem', lineHeight: '1.6', letterSpacing: '0' },
    'xs': { fontSize: '0.75rem', lineHeight: '1.5', letterSpacing: '0.02em' },
    '2xs': { fontSize: '0.625rem', lineHeight: '1.5', letterSpacing: '0.02em' },
  },

  // Font weights
  weights: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },

  // Heading weights — lighter, contemplative
  headingWeights: {
    h1: 400,
    h2: 500,
    h3: 600,
    h4: 600,
    h5: 600,
    h6: 600,
  },
} as const;

// =============================================================================
// SPACING (8px base grid)
// =============================================================================

export const spacing = {
  px: '1px',
  0: '0',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  3.5: '0.875rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
  11: '2.75rem',
  12: '3rem',
  14: '3.5rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  28: '7rem',
  32: '8rem',
  36: '9rem',
  40: '10rem',
  44: '11rem',
  48: '12rem',
  52: '13rem',
  56: '14rem',
  60: '15rem',
  64: '16rem',
  72: '18rem',
  80: '20rem',
  96: '24rem',
} as const;

// =============================================================================
// BREAKPOINTS
// =============================================================================

export const breakpoints = {
  xs: '480px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export const containers = {
  xs: '480px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1200px',
  '2xl': '1440px',
  full: '100%',
} as const;

// =============================================================================
// SHADOWS — Warm-tinted from Deep Earth
// =============================================================================

export const shadows = {
  xs: '0 1px 2px 0 rgb(59 47 47 / 0.04)',
  sm: '0 1px 3px 0 rgb(59 47 47 / 0.06), 0 1px 2px -1px rgb(59 47 47 / 0.04)',
  md: '0 4px 6px -1px rgb(59 47 47 / 0.06), 0 2px 4px -2px rgb(59 47 47 / 0.04)',
  lg: '0 10px 15px -3px rgb(59 47 47 / 0.06), 0 4px 6px -4px rgb(59 47 47 / 0.03)',
  xl: '0 20px 25px -5px rgb(59 47 47 / 0.06), 0 8px 10px -6px rgb(59 47 47 / 0.03)',
  '2xl': '0 25px 50px -12px rgb(59 47 47 / 0.15)',

  // Inner shadows
  inner: 'inset 0 2px 4px 0 rgb(59 47 47 / 0.04)',
  innerLg: 'inset 0 4px 8px 0 rgb(59 47 47 / 0.06)',
  innerSubtle: 'inset 0 1px 2px 0 rgb(59 47 47 / 0.02)',

  // Glass effect shadows
  glass: '0 8px 32px 0 rgb(59 47 47 / 0.06)',
  glassLg: '0 16px 64px 0 rgb(59 47 47 / 0.08)',

  // Rose & Gold variants
  rose: '0 4px 16px 0 rgb(156 111 110 / 0.15)',
  gold: '0 4px 16px 0 rgb(196 168 107 / 0.15)',

  // Elevation levels
  elevation1: '0 1px 3px 0 rgb(59 47 47 / 0.05), 0 1px 2px 0 rgb(59 47 47 / 0.03)',
  elevation2: '0 4px 8px 0 rgb(59 47 47 / 0.05), 0 2px 4px 0 rgb(59 47 47 / 0.03)',
  elevation3: '0 12px 24px 0 rgb(59 47 47 / 0.06), 0 4px 8px 0 rgb(59 47 47 / 0.03)',
  elevation4: '0 24px 48px 0 rgb(59 47 47 / 0.08), 0 8px 16px 0 rgb(59 47 47 / 0.04)',

  // Hover
  cardHover: '0 4px 20px 0 rgb(59 47 47 / 0.1)',

  none: 'none',
} as const;

// =============================================================================
// BORDER RADIUS
// =============================================================================

export const radius = {
  none: '0',
  xs: '0.125rem',
  sm: '0.25rem',
  md: '0.375rem',
  DEFAULT: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  '2xl': '1.25rem',
  '3xl': '1.5rem',
  '4xl': '2rem',
  full: '9999px',
} as const;

// =============================================================================
// ANIMATIONS — Organic, contemplative
// =============================================================================

export const animation = {
  // Easing functions
  easing: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    smooth: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
    smoothOut: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
    smoothIn: 'cubic-bezier(0.4, 0.0, 1, 1)',
    hover: 'cubic-bezier(0.33, 1, 0.68, 1)',
    press: 'cubic-bezier(0.4, 0, 0.6, 1)',
    reveal: 'cubic-bezier(0.16, 1, 0.3, 1)',
    exit: 'cubic-bezier(0.7, 0, 1, 0.5)',
    // Organic curves
    breathe: 'cubic-bezier(0.45, 0.05, 0.55, 0.95)',
    sacred: 'cubic-bezier(0.25, 0.8, 0.25, 1)',
    gentleReveal: 'cubic-bezier(0.22, 0.68, 0.36, 1)',
  },

  // Durations — extended for contemplative feel
  duration: {
    instant: '0ms',
    micro: '75ms',
    faster: '100ms',
    fast: '150ms',
    normal: '200ms',
    relaxed: '300ms',
    slow: '400ms',
    slower: '500ms',
    deliberate: '600ms',
    meditative: '800ms',
    contemplative: '1200ms',
  },

  // Spring configs for Framer Motion — breathing feel
  spring: {
    snappy: { type: 'spring' as const, stiffness: 500, damping: 35 },
    smooth: { type: 'spring' as const, stiffness: 200, damping: 30 },
    gentle: { type: 'spring' as const, stiffness: 120, damping: 20 },
    breathing: { type: 'spring' as const, stiffness: 80, damping: 18 },
  },

  // Stagger
  stagger: {
    fast: 0.04,
    normal: 0.08,
    relaxed: 0.1,
    slow: 0.12,
    contemplative: 0.16,
  },
} as const;

// =============================================================================
// Z-INDEX SCALE
// =============================================================================

export const zIndex = {
  hide: -1,
  base: 0,
  raised: 1,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  toast: 1600,
  tooltip: 1700,
  max: 9999,
} as const;

// =============================================================================
// BLUR VALUES
// =============================================================================

export const blur = {
  none: '0',
  xs: '2px',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '24px',
  '3xl': '40px',
} as const;

// =============================================================================
// EXPORT ALL TOKENS
// =============================================================================

export const tokens = {
  colors,
  typography,
  spacing,
  breakpoints,
  containers,
  shadows,
  radius,
  animation,
  zIndex,
  blur,
} as const;

export type Tokens = typeof tokens;
export default tokens;
