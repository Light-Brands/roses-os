/**
 * Design Tokens - Digital Cultures
 * Monochrome-first design system with typographic hierarchy
 * Palette: greys, black, white. No bright colors.
 */

// =============================================================================
// COLOR PALETTE
// =============================================================================

export const colors = {
  // Primary - Dark/black accent scale for CTAs, interactive elements, emphasis
  // primary-500 is the main interactive color (#1A1A1A near-black)
  primary: {
    50: '#F5F5F5',
    100: '#E8E8E8',
    200: '#D4D4D4',
    300: '#A3A3A3',
    400: '#525252',
    500: '#1A1A1A',  // Main CTA / interactive color
    600: '#0A0A0A',  // Hover state
    700: '#050505',
    800: '#020202',
    900: '#000000',
    950: '#000000',
  },

  // Secondary - Neutral mid-tones for supporting elements
  secondary: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E8E8E8',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#666666',  // Supporting text color
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0A0A0A',
  },

  // Neutral - Pure grey scale for backgrounds, text, borders
  neutral: {
    0: '#FFFFFF',
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E8E8E8',  // Main page background (light mode)
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0A0A0A',  // Main page background (dark mode)
  },

  // Status colors - kept minimal, only used for functional feedback
  accent: {
    success: {
      light: '#ecfdf5',
      default: '#10b981',
      dark: '#059669',
      subtle: '#d1fae5',
    },
    warning: {
      light: '#fffbeb',
      default: '#f59e0b',
      dark: '#d97706',
      subtle: '#fef3c7',
    },
    error: {
      light: '#fef2f2',
      default: '#ef4444',
      dark: '#dc2626',
      subtle: '#fee2e2',
    },
    info: {
      light: '#f5f5f5',
      default: '#525252',
      dark: '#404040',
      subtle: '#E8E8E8',
    },
  },

  // Gradients - monochrome, subtle
  gradients: {
    primary: 'linear-gradient(135deg, #1A1A1A 0%, #000000 100%)',
    secondary: 'linear-gradient(135deg, #404040 0%, #1A1A1A 100%)',
    subtle: 'linear-gradient(135deg, #F5F5F5 0%, #E8E8E8 100%)',
    dark: 'linear-gradient(135deg, #0A0A0A 0%, #171717 100%)',
    glass: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 100%)',
    mesh: 'radial-gradient(ellipse 80% 50% at 35% 20%, rgba(0, 0, 0, 0.04) 0px, transparent 50%), radial-gradient(ellipse 60% 40% at 75% 80%, rgba(0, 0, 0, 0.03) 0px, transparent 50%)',
    text: 'linear-gradient(135deg, #1A1A1A 0%, #525252 100%)',
  },
} as const;

// =============================================================================
// TYPOGRAPHY
// =============================================================================

export const typography = {
  // Font families - Poppins
  fonts: {
    sans: 'var(--font-sans, "Poppins", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
    mono: 'var(--font-mono, ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace)',
    display: 'var(--font-sans, "Poppins", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
  },

  // Font sizes - fluid scale for typography-first hierarchy
  scale: {
    // Display sizes - hero headlines, confident and large
    '7xl': { fontSize: '4.5rem', lineHeight: '1.1', letterSpacing: '-0.02em' },     // 72px
    '6xl': { fontSize: '3.75rem', lineHeight: '1.1', letterSpacing: '-0.02em' },    // 60px
    '5xl': { fontSize: '3rem', lineHeight: '1.1', letterSpacing: '-0.02em' },       // 48px

    // Heading sizes
    '4xl': { fontSize: '2.25rem', lineHeight: '1.15', letterSpacing: '-0.015em' },  // 36px
    '3xl': { fontSize: '1.875rem', lineHeight: '1.2', letterSpacing: '-0.01em' },   // 30px
    '2xl': { fontSize: '1.5rem', lineHeight: '1.25', letterSpacing: '-0.01em' },    // 24px
    'xl': { fontSize: '1.25rem', lineHeight: '1.35', letterSpacing: '-0.005em' },   // 20px

    // Body sizes
    'lg': { fontSize: '1.125rem', lineHeight: '1.6', letterSpacing: '0' },          // 18px
    'base': { fontSize: '1rem', lineHeight: '1.6', letterSpacing: '0' },            // 16px
    'sm': { fontSize: '0.875rem', lineHeight: '1.5', letterSpacing: '0' },          // 14px

    // Caption/small sizes
    'xs': { fontSize: '0.75rem', lineHeight: '1.5', letterSpacing: '0.02em' },      // 12px
    '2xs': { fontSize: '0.625rem', lineHeight: '1.5', letterSpacing: '0.02em' },    // 10px
  },

  // Font weights - max bold (700), no extrabold
  weights: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },

  // Heading weights - lighter, especially h1 (used by globals/theme base styles)
  headingWeights: {
    h1: 400,
    h2: 600,
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
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  3.5: '0.875rem',  // 14px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  11: '2.75rem',    // 44px
  12: '3rem',       // 48px
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  28: '7rem',       // 112px
  32: '8rem',       // 128px
  36: '9rem',       // 144px
  40: '10rem',      // 160px
  44: '11rem',      // 176px
  48: '12rem',      // 192px
  52: '13rem',      // 208px
  56: '14rem',      // 224px
  60: '15rem',      // 240px
  64: '16rem',      // 256px
  72: '18rem',      // 288px
  80: '20rem',      // 320px
  96: '24rem',      // 384px
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
  xl: '1200px',   // Content max-width
  '2xl': '1440px',
  full: '100%',
} as const;

// =============================================================================
// SHADOWS - Pure black, no color tinting
// =============================================================================

export const shadows = {
  // Elevation shadows - clean black
  xs: '0 1px 2px 0 rgb(0 0 0 / 0.04)',
  sm: '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.06), 0 2px 4px -2px rgb(0 0 0 / 0.04)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.06), 0 4px 6px -4px rgb(0 0 0 / 0.03)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.06), 0 8px 10px -6px rgb(0 0 0 / 0.03)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.15)',

  // Inner shadows
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.04)',
  innerLg: 'inset 0 4px 8px 0 rgb(0 0 0 / 0.06)',
  innerSubtle: 'inset 0 1px 2px 0 rgb(0 0 0 / 0.02)',

  // Glass effect shadows
  glass: '0 8px 32px 0 rgb(0 0 0 / 0.06)',
  glassLg: '0 16px 64px 0 rgb(0 0 0 / 0.08)',

  // Elevation levels
  elevation1: '0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px 0 rgb(0 0 0 / 0.03)',
  elevation2: '0 4px 8px 0 rgb(0 0 0 / 0.05), 0 2px 4px 0 rgb(0 0 0 / 0.03)',
  elevation3: '0 12px 24px 0 rgb(0 0 0 / 0.06), 0 4px 8px 0 rgb(0 0 0 / 0.03)',
  elevation4: '0 24px 48px 0 rgb(0 0 0 / 0.08), 0 8px 16px 0 rgb(0 0 0 / 0.04)',

  // Hover
  cardHover: '0 4px 20px 0 rgb(0 0 0 / 0.1)',

  none: 'none',
} as const;

// =============================================================================
// BORDER RADIUS
// =============================================================================

export const radius = {
  none: '0',
  xs: '0.125rem',   // 2px
  sm: '0.25rem',    // 4px
  md: '0.375rem',   // 6px
  DEFAULT: '0.5rem', // 8px
  lg: '0.75rem',    // 12px
  xl: '1rem',       // 16px
  '2xl': '1.25rem', // 20px
  '3xl': '1.5rem',  // 24px
  '4xl': '2rem',    // 32px
  full: '9999px',
} as const;

// =============================================================================
// ANIMATIONS - Subtle, purposeful
// =============================================================================

export const animation = {
  // Easing functions
  easing: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',

    // Primary easing - smooth deceleration
    smooth: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
    smoothOut: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
    smoothIn: 'cubic-bezier(0.4, 0.0, 1, 1)',

    // Hover / micro-interaction
    hover: 'cubic-bezier(0.33, 1, 0.68, 1)',
    press: 'cubic-bezier(0.4, 0, 0.6, 1)',

    // Entrance / reveal
    reveal: 'cubic-bezier(0.16, 1, 0.3, 1)',
    exit: 'cubic-bezier(0.7, 0, 1, 0.5)',
  },

  // Durations
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
  },

  // Spring configs for Framer Motion - gentle, no overshoot
  spring: {
    snappy: { type: 'spring' as const, stiffness: 500, damping: 35 },
    smooth: { type: 'spring' as const, stiffness: 200, damping: 30 },
    gentle: { type: 'spring' as const, stiffness: 120, damping: 20 },
  },

  // Stagger
  stagger: {
    fast: 0.04,
    normal: 0.08,
    relaxed: 0.1,
    slow: 0.12,
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
