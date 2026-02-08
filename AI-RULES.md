# AI Development Rules - Digital Cultures

Guidelines for AI-assisted development of the Digital Cultures agency website. Every component, page, and interaction must follow these rules.

---

## Design Identity

Digital Cultures is a creative agency. The website must feel **refined, confident, and minimal**. The design should get out of the way and let the work shine.

**Core Principles:**
- Breathing minimalism - generous whitespace is intentional
- Typography-first hierarchy - size and weight create structure
- Sophisticated restraint - near-monochrome, strategic accents only
- Subtle motion - enhance, never distract

---

## Color Rules

### The Palette is Monochrome-First

This is NOT a colorful SaaS site. The palette is deliberately restrained.

```tsx
// CORRECT - Restrained, monochrome
<div className="bg-[#E8E8E8] text-[#1A1A1A]">
<div className="bg-white text-neutral-900">
<button className="bg-black text-white">

// INCORRECT - Bright colors, gradients for no reason
<div className="bg-primary-500 text-white">
<div className="bg-gradient-to-r from-blue-500 to-purple-500">
```

### Light Mode (Primary)

| Role | Value | Tailwind | Usage |
|------|-------|----------|-------|
| Page background | #E8E8E8 | `bg-background` | Main canvas |
| Surface/cards | #FFFFFF | `bg-white` | Elevated elements |
| Subtle sections | #F5F5F5 | `bg-neutral-100` | Alternating sections |
| Heading text | #1A1A1A | `text-foreground` | All headings |
| Body text | #1A1A1A | `text-foreground` | Primary body |
| Supporting text | #666666 | `text-muted-foreground` | Secondary info |
| Caption text | #999999 | `text-neutral-400` | Metadata, labels |
| Accent/CTA | #000000 | `bg-black text-white` | Buttons, emphasis |
| Borders | #D4D4D4 | `border-border` | Dividers, outlines |

### Dark Mode (Inverted)

Same restraint. Dark backgrounds, light text. No neon accents.

| Role | Value | Tailwind |
|------|-------|----------|
| Page background | #0A0A0A | `dark:bg-background` |
| Surface/cards | #1A1A1A | `dark:bg-neutral-900` |
| Heading text | #F5F5F5 | `dark:text-neutral-100` |
| Body text | #E5E5E5 | `dark:text-neutral-200` |
| Supporting text | #999999 | `dark:text-neutral-400` |
| Accent/CTA | #FFFFFF | `dark:bg-white dark:text-black` |

### What to Avoid

- Bright primary/secondary brand colors in large areas
- Gradient backgrounds on sections (unless very subtle)
- Color as the primary way to distinguish hierarchy
- Neon or saturated accent colors

---

## Typography Rules

### Type Scale

Typography IS the design. Use confident, generous sizing.

| Level | Size | Weight | Tracking | Line Height | Usage |
|-------|------|--------|----------|-------------|-------|
| Display | clamp(48px, 8vw, 96px) | 700 | -0.02em | 1.1 | Hero only |
| H1 | clamp(36px, 5vw, 64px) | 700 | -0.02em | 1.1 | Page titles |
| H2 | clamp(28px, 4vw, 48px) | 600 | -0.01em | 1.2 | Section headers |
| H3 | clamp(20px, 3vw, 32px) | 600 | -0.01em | 1.3 | Subsections |
| Body large | clamp(18px, 2vw, 24px) | 400 | 0.01em | 1.4 | Intro/lead text |
| Body | 16px | 400 | 0 | 1.6 | Standard text |
| Body small | 14px | 400 | 0 | 1.5 | Supporting text |
| Caption | 12px | 500 | 0.02em | 1.4 | Labels, metadata |

### Typography Patterns

```tsx
// Hero headline - large, bold, tight
<h1 className="text-5xl md:text-7xl lg:text-[clamp(48px,8vw,96px)] font-bold tracking-tighter leading-[1.1]">

// Section heading
<h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight">

// Body lead text
<p className="text-lg md:text-xl text-muted-foreground leading-relaxed">

// Caption / metadata
<span className="text-xs font-medium uppercase tracking-wider text-neutral-500">
```

### Font Rules

- **One family:** Inter (already configured). Don't add more.
- **Weight range:** 300-700. Use 500 (medium) for nav/buttons, 600 for subheads, 700 for headlines.
- **Never use font-extrabold (800)** in this design. Max is bold (700).

---

## Spacing Rules

### The Philosophy

Whitespace is not empty space - it's breathing room. Be generous.

```tsx
// CORRECT - Generous spacing
<section className="py-24 lg:py-32">
<div className="space-y-8">
<div className="mb-16 lg:mb-24">

// INCORRECT - Cramped
<section className="py-8">
<div className="space-y-2">
<div className="mb-4">
```

### Section Spacing

```tsx
// Hero sections - dramatic spacing
<section className="min-h-screen py-32 lg:py-48">

// Standard sections - generous
<section className="py-20 lg:py-32">

// Between section header and content
<div className="mb-16 lg:mb-20">
```

### Safe Margins

```tsx
// Container with generous side margins
<div className="px-10 md:px-20 lg:px-[120px]">

// Or use container-premium utility
<div className="container-premium">
```

### Grid: 8px Base

All spacing must be multiples of 8px:

```tsx
// CORRECT
<div className="p-4">     // 16px
<div className="p-8">     // 32px
<div className="gap-8">   // 32px
<div className="mb-16">   // 64px

// INCORRECT
<div className="p-[18px]">  // Not on grid
<div className="p-5">       // 20px - not on 8px grid
```

---

## Animation Guidelines

### Philosophy: Subtle Enhancement

Animations should be felt, not seen. They guide attention, not demand it.

### Allowed Animations

```tsx
// Fade in + translate up (primary entrance)
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: [0.4, 0.0, 0.2, 1] }}
>

// Stagger children (for grids/lists)
const container = {
  animate: { transition: { staggerChildren: 0.1 } }
};

// Hover: subtle scale on images
className="transition-transform duration-400 hover:scale-[1.05]"

// Hover: opacity on links
className="transition-opacity duration-200 hover:opacity-60"
```

### Timing

| Duration | Use |
|----------|-----|
| 100ms | Active/press states |
| 200ms | Hover states, icon transitions |
| 300ms | Standard transitions |
| 400ms | Image hover, larger elements |
| 600ms | Entrance animations |

### Easing

```
Default: cubic-bezier(0.4, 0.0, 0.2, 1)  - smooth deceleration
```

### What to Avoid

- Bouncing animations
- Spring physics with visible overshoot
- Parallax effects (unless very subtle)
- Auto-playing anything
- Animations that delay content access
- Scale > 1.05 on hover
- Animation duration > 800ms

### Reduced Motion

Always respect user preferences:
```tsx
<motion.div
  initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
>
```

---

## Component Patterns

### Navigation

```
- Fixed position, translucent background with backdrop blur
- Height: 80px
- Logo left, nav items right
- Hover: opacity transition (not color change)
- Mobile: hamburger menu
```

### Project Cards (Portfolio)

```
- Full-bleed image background
- Overlay gradient (bottom to top, dark)
- Text: white, positioned bottom-left
- Hover: image scale 1.05, gradient intensifies
- Aspect ratio: 4:3 or 16:9
```

### Buttons

```tsx
// Primary: black bg, white text, pill shape
<Button variant="primary" className="rounded-full">

// Secondary: transparent, border, dark text
<Button variant="outline" className="rounded-full">

// Ghost: no border, underline on hover
<Button variant="ghost">
```

### Section Header Pattern

```tsx
<div className="max-w-2xl mb-16 lg:mb-20">
  <span className="text-sm font-medium uppercase tracking-wider text-neutral-500 mb-4 block">
    Section Label
  </span>
  <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight mb-6">
    Section Title
  </h2>
  <p className="text-lg text-muted-foreground leading-relaxed">
    Brief supporting description.
  </p>
</div>
```

---

## SEO

### Every Page Must Have

- Unique `<title>` (format: "Page | Digital Cultures")
- Meta description (150-160 chars)
- Open Graph tags
- Proper heading hierarchy (single h1, sequential h2-h6)
- Descriptive alt text on all images
- Semantic HTML structure

### Implementation

```tsx
export const metadata: Metadata = {
  title: 'Page Title | Digital Cultures',
  description: 'Clear description under 160 characters.',
  openGraph: {
    title: 'Page Title | Digital Cultures',
    description: 'Description for social sharing',
    images: ['/og-image.jpg'],
  },
};
```

---

## Accessibility

### Requirements

- WCAG AA compliance minimum (4.5:1 contrast for text, 3:1 for large text)
- Keyboard navigation for all interactive elements
- Focus indicators clearly visible (2px solid outline, 4px offset)
- ARIA labels where semantic HTML isn't sufficient
- Alt text on all meaningful images (empty alt for decorative)
- Skip to main content link
- Logical tab order following visual flow

---

## Performance

### Targets

| Metric | Target |
|--------|--------|
| Lighthouse Performance | 90+ |
| Lighthouse Accessibility | 100 |
| LCP | < 2.5s |
| FID | < 100ms |
| CLS | < 0.1 |

### Image Rules

- Always use `next/image`
- WebP format preferred
- Lazy load below-fold images
- Set explicit width/height to prevent CLS
- `priority` on hero/above-fold images
- Target < 200KB for hero images, < 100KB for thumbnails

---

## File Organization

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout (metadata, fonts, theme)
│   ├── page.tsx            # Homepage
│   ├── work/               # Portfolio pages
│   ├── about/              # About page
│   ├── services/           # Services page
│   ├── contact/            # Contact page
│   └── (admin)/            # Admin dashboard (route group)
├── components/
│   ├── ui/                 # Base UI components
│   └── sections/           # Page sections
├── design-system/
│   ├── tokens.ts           # Design tokens
│   └── theme.css           # CSS variables
└── lib/
    ├── utils.ts            # Utilities
    └── seo.tsx             # SEO helpers
```

---

## Import Patterns

```tsx
// Components
import { Button } from '@/components/ui/Button';
import { Card, FeatureCard } from '@/components/ui/Card';
import { Navigation } from '@/components/ui/Navigation';
import { Footer } from '@/components/ui/Footer';
import { HeroCentered } from '@/components/sections/HeroCentered';

// Utilities
import { cn } from '@/lib/utils';

// Design tokens (when needed programmatically)
import { colors, spacing, animation } from '@/design-system/tokens';
```

---

## Do's and Don'ts

### DO
- Use generous whitespace - it's the design
- Let typography create hierarchy
- Keep the palette restrained (greys, black, white)
- Use subtle entrance animations (fade + translate)
- Make portfolio images the focal point
- Test both light and dark modes
- Use semantic HTML
- Ensure keyboard navigation works

### DON'T
- Add bright colors without a strong reason
- Use bouncing or flashy animations
- Cram content together - always add breathing room
- Use gradients as section backgrounds
- Rely on color to create hierarchy (use size/weight instead)
- Hardcode any values - use tokens/classes
- Skip alt text on images
- Forget dark mode compatibility
