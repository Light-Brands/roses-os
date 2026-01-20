/**
 * Design Tokens
 * Premium design system tokens inspired by Apple/Vercel aesthetics
 * All values are carefully crafted for visual harmony
 */

// =============================================================================
// COLOR PALETTE
// =============================================================================

export const colors = {
  // Primary - Deep, sophisticated blue with purple undertones
  primary: {
    50: '#f0f4ff',
    100: '#e0e8ff',
    200: '#c7d4fe',
    300: '#a4b8fc',
    400: '#7c93f8',
    500: '#5a6df2',
    600: '#4450e6',
    700: '#3840cb',
    800: '#3036a4',
    900: '#2d3382',
    950: '#1c1f4d',
  },

  // Secondary - Warm, elegant violet
  secondary: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7c22ce',
    800: '#6821a8',
    900: '#581c87',
    950: '#3b0764',
  },

  // Neutral - Carefully balanced grays with subtle warmth
  neutral: {
    0: '#ffffff',
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e8e8e8',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0a0a0a',
  },

  // Accent colors for variety
  accent: {
    success: {
      light: '#ecfdf5',
      default: '#10b981',
      dark: '#059669',
    },
    warning: {
      light: '#fffbeb',
      default: '#f59e0b',
      dark: '#d97706',
    },
    error: {
      light: '#fef2f2',
      default: '#ef4444',
      dark: '#dc2626',
    },
    info: {
      light: '#eff6ff',
      default: '#3b82f6',
      dark: '#2563eb',
    },
  },

  // Gradient definitions
  gradients: {
    primary: 'linear-gradient(135deg, #5a6df2 0%, #a855f7 100%)',
    secondary: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
    subtle: 'linear-gradient(135deg, #f0f4ff 0%, #faf5ff 100%)',
    dark: 'linear-gradient(135deg, #171717 0%, #262626 100%)',
    glass: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
    mesh: 'radial-gradient(at 40% 20%, #5a6df2 0px, transparent 50%), radial-gradient(at 80% 0%, #a855f7 0px, transparent 50%), radial-gradient(at 0% 50%, #ec4899 0px, transparent 50%)',
  },
} as const;

// =============================================================================
// TYPOGRAPHY
// =============================================================================

export const typography = {
  // Font families
  fonts: {
    sans: 'var(--font-sans, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
    mono: 'var(--font-mono, ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace)',
    display: 'var(--font-display, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
  },

  // Font sizes with line heights (following a perfect fourth scale ~1.333)
  scale: {
    // Display sizes - for hero headlines
    '7xl': { fontSize: '4.5rem', lineHeight: '1', letterSpacing: '-0.025em' },      // 72px
    '6xl': { fontSize: '3.75rem', lineHeight: '1', letterSpacing: '-0.025em' },     // 60px
    '5xl': { fontSize: '3rem', lineHeight: '1.1', letterSpacing: '-0.02em' },       // 48px

    // Heading sizes
    '4xl': { fontSize: '2.25rem', lineHeight: '1.15', letterSpacing: '-0.02em' },   // 36px
    '3xl': { fontSize: '1.875rem', lineHeight: '1.2', letterSpacing: '-0.015em' },  // 30px
    '2xl': { fontSize: '1.5rem', lineHeight: '1.25', letterSpacing: '-0.01em' },    // 24px
    'xl': { fontSize: '1.25rem', lineHeight: '1.35', letterSpacing: '-0.01em' },    // 20px

    // Body sizes
    'lg': { fontSize: '1.125rem', lineHeight: '1.6', letterSpacing: '0' },          // 18px
    'base': { fontSize: '1rem', lineHeight: '1.6', letterSpacing: '0' },            // 16px
    'sm': { fontSize: '0.875rem', lineHeight: '1.5', letterSpacing: '0' },          // 14px

    // Caption/small sizes
    'xs': { fontSize: '0.75rem', lineHeight: '1.5', letterSpacing: '0.01em' },      // 12px
    '2xs': { fontSize: '0.625rem', lineHeight: '1.5', letterSpacing: '0.02em' },    // 10px
  },

  // Font weights
  weights: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
} as const;

// =============================================================================
// SPACING (4px/8px base grid)
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

// Container max widths
export const containers = {
  xs: '480px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1440px',
  full: '100%',
} as const;

// =============================================================================
// SHADOWS
// =============================================================================

export const shadows = {
  // Subtle shadows for cards and elevated surfaces
  xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',

  // Colored shadows for interactive elements
  primary: '0 4px 14px 0 rgb(90 109 242 / 0.25)',
  primaryLg: '0 10px 40px 0 rgb(90 109 242 / 0.35)',
  secondary: '0 4px 14px 0 rgb(168 85 247 / 0.25)',

  // Inner shadows
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  innerLg: 'inset 0 4px 8px 0 rgb(0 0 0 / 0.1)',

  // Glass effect shadows
  glass: '0 8px 32px 0 rgb(0 0 0 / 0.08)',
  glassLg: '0 16px 64px 0 rgb(0 0 0 / 0.12)',

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
// ANIMATIONS
// =============================================================================

export const animation = {
  // Timing functions - premium easing curves
  easing: {
    // Standard easing
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',

    // Premium/smooth easing
    smooth: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    smoothOut: 'cubic-bezier(0, 0, 0.25, 1)',
    smoothIn: 'cubic-bezier(0.25, 0, 1, 1)',

    // Spring-like easing
    spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',

    // Apple-style easing
    apple: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    appleIn: 'cubic-bezier(0.42, 0, 1, 1)',
    appleOut: 'cubic-bezier(0, 0, 0.58, 1)',
  },

  // Durations
  duration: {
    instant: '0ms',
    faster: '100ms',
    fast: '150ms',
    normal: '200ms',
    relaxed: '300ms',
    slow: '400ms',
    slower: '500ms',
    lazy: '700ms',
    glacial: '1000ms',
  },

  // Spring configurations (for Framer Motion)
  spring: {
    snappy: { type: 'spring', stiffness: 400, damping: 30 },
    smooth: { type: 'spring', stiffness: 200, damping: 25 },
    bouncy: { type: 'spring', stiffness: 300, damping: 15 },
    gentle: { type: 'spring', stiffness: 120, damping: 20 },
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
