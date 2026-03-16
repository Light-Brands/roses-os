/**
 * Standardized image size constants used across components.
 *
 * Centralizes dimensions so every usage stays consistent and
 * changes only need to happen in one place.
 */

// ---------------------------------------------------------------------------
// Logo / Brand mark
// ---------------------------------------------------------------------------

/** Small logo used in page transitions */
export const LOGO_SM = 40;

/** Default logo used in preloader and general branding */
export const LOGO_MD = 48;

/** Large logo on the teaching page hero */
export const LOGO_LG = 72;

// ---------------------------------------------------------------------------
// Avatars
// ---------------------------------------------------------------------------

/** Compact avatar (admin header inline) — Tailwind w-8/h-8 = 32px */
export const AVATAR_SM = 32;

/** Dropdown / menu avatar — Tailwind w-10/h-10 = 40px */
export const AVATAR_MD = 40;

/** Testimonial card avatar */
export const AVATAR_LG = 44;

// ---------------------------------------------------------------------------
// Guardian photos (circular, responsive via Tailwind + sizes attr)
// ---------------------------------------------------------------------------

/** Mobile guardian circle — Tailwind w-32/h-32 = 128px */
export const GUARDIAN_PHOTO_SM = 128;

/** Desktop guardian circle — Tailwind w-40/h-40 = 160px */
export const GUARDIAN_PHOTO_LG = 160;

export const GUARDIAN_SIZES = `(min-width: 768px) ${GUARDIAN_PHOTO_LG}px, ${GUARDIAN_PHOTO_SM}px`;

// ---------------------------------------------------------------------------
// Page hero decorative image
// ---------------------------------------------------------------------------

export const PAGE_HERO_IMAGE = 448;

export const PAGE_HERO_SIZES = '(min-width: 768px) 448px, 100vw';

// ---------------------------------------------------------------------------
// Teaching slide cards (aspect ratio set via Tailwind aspect-[16/10])
// ---------------------------------------------------------------------------

export const SLIDE_ASPECT = '16/10';

export const SLIDE_SIZES = '(max-width: 768px) 100vw, 720px';

export const SLIDE_THUMB_SIZES = '80px';
