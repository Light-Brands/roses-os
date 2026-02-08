# Digital Cultures - Agency Website

> Full AI development context for the Digital Cultures website.
> This file is loaded into every Claude conversation. Keep it accurate and up to date.

---

## Project Overview

**Client:** Digital Cultures
**Type:** Creative agency portfolio website
**Industry:** Marketing, Creative, Design
**Location:** Pittakio Megaro, Nikolaou I. Nikolaidi Ave 10, Paphos, Cyprus 8010

**Primary Goal:** Showcase the agency's work, establish credibility, and drive inquiries from potential clients.

**Brand Voice:** Confident but not arrogant. Professional but approachable. Clear and concise. Let the work speak for itself.

---

## Tech Stack

```yaml
Framework: Next.js 16+ (App Router)
Language: TypeScript (strict mode)
Styling: Tailwind CSS v4 + Custom Design Tokens
Animation: Framer Motion + GSAP
Icons: Lucide React
Images: Sharp optimization via Next.js Image
Database: Supabase (PostgreSQL) - when needed
Auth: Supabase Auth - for admin only
```

---

## Design Philosophy

This is NOT a typical SaaS landing page. This is a **premium agency portfolio** built on these principles:

1. **Breathing Minimalism** - Maximum whitespace with purposeful focal points. Let content breathe.
2. **Typography-First Hierarchy** - Text size and weight create the navigation structure. Type IS the design.
3. **Sophisticated Restraint** - Limited, near-monochrome palette. Strategic visual accents only.
4. **Subtle Motion** - Micro-interactions that enhance, never distract. No flashy animations.
5. **Progressive Disclosure** - Reveal information gradually. Don't overwhelm.

**Reference aesthetic:** Clean, minimal, confident. Think refined agency sites - not busy SaaS pages.

---

## Color System

The palette is deliberately restrained. Near-monochrome with strategic accents.

### Core Palette (use Tailwind classes mapped to these values)

```
BACKGROUNDS:
- bg-primary:     #E8E8E8    Light grey - main page background
- bg-secondary:   #FFFFFF    White - cards, elevated surfaces
- bg-tertiary:    #F5F5F5    Subtle variation sections

TEXT:
- text-primary:   #1A1A1A    Near black - headings, body
- text-secondary: #666666    Medium grey - supporting text
- text-tertiary:  #999999    Light grey - captions, metadata

ACCENTS:
- accent-primary: #000000    True black - emphasis, CTAs
- Interactive hover: #000000
- Interactive active: #333333
- Interactive disabled: #CCCCCC
```

### Color Rules

- **No bright colors** unless there's a strong reason. This is a monochrome-first design.
- Backgrounds are light grey (#E8E8E8), NOT pure white for the main canvas.
- Cards/surfaces use white (#FFFFFF) to create subtle elevation.
- Text is near-black (#1A1A1A), never pure black for body (except accent elements).
- Dark mode: Invert the palette. Dark backgrounds, light text. Same restraint.

---

## Typography System

Typography drives the entire visual hierarchy. Use generous sizing for display text.

### Type Scale (fluid with clamp)

```
display:  clamp(48px, 8vw, 96px)   - Hero headlines ONLY
h1:       clamp(36px, 5vw, 64px)   - Page titles
h2:       clamp(28px, 4vw, 48px)   - Section headers
h3:       clamp(20px, 3vw, 32px)   - Subsections
body-lg:  clamp(18px, 2vw, 24px)   - Intro/lead text
body:     16px                      - Standard body text
body-sm:  14px                      - Supporting text
caption:  12px                      - Labels, metadata
```

### Font Weights

```
light:    300  - Decorative use only (sparingly)
regular:  400  - Body text
medium:   500  - Navigation, emphasis, buttons
semibold: 600  - Subheadings
bold:     700  - Headlines (use sparingly for impact)
```

### Typography Rules

- **Letter spacing:** Display text uses -0.02em (tight). Body uses default.
- **Line height:** Display 1.1, headings 1.2, body 1.5-1.6
- **Max 1-2 font families.** Currently using Inter. Keep it cohesive.
- Headlines should feel confident and large. Don't be afraid of scale.

---

## Spacing & Layout

### Spatial Philosophy

Generous whitespace is a feature, not wasted space. The breathing room IS the design.

```
SPACING SCALE (8px base):
xs:   8px    - Tight element spacing
sm:   16px   - Related elements
md:   32px   - Component separation
lg:   64px   - Section breaks
xl:   128px  - Major section spacing
xxl:  256px  - Dramatic hero spacing
```

### Safe Margins

```
Mobile:  40px side margins
Tablet:  80px side margins
Desktop: 120px side margins
```

### Layout Patterns

- **Container max-width:** 1200px for content, full-bleed for hero/portfolio
- **Text max-width:** 65ch (~800px) for readability
- **Grid:** 12-column flexible, not rigidly followed
- **Project grid:** Seamless (0px gap), full-bleed cards

---

## Component API Quick Reference

### Button
```tsx
<Button
  variant="primary|secondary|outline|ghost|gradient|destructive"
  size="sm|md|lg|xl"
  loading={boolean}
  icon={<Icon />}
  iconPosition="left|right"
  fullWidth={boolean}
  href="/path"
>
  Label
</Button>
```

### Card
```tsx
<Card variant="default|elevated|bordered|glass|gradient" hover={boolean} href="/path">
  {children}
</Card>

<FeatureCard icon={Icon} title="Title" description="Desc" href="/path" gradient={boolean} />
<TestimonialCard quote="..." author={{ name, title, avatar }} rating={5} />
```

### Hero Sections
```tsx
<HeroCentered
  badge={{ text: "New", href: "/new" }}
  title="Main headline"
  titleHighlight="highlight"
  description="Supporting text"
  primaryCTA={{ label: "Get Started", href: "/start" }}
  secondaryCTA={{ label: "Learn More", href: "/about" }}
  trustedBy={[{ name: "Company", logo: "/logo.svg" }]}
/>

<HeroMinimal
  announcement={{ text: "Text", href: "/link" }}
  title="Headline"
  subtitle="Subheadline"
  primaryCTA={{ label: "Start", href: "/" }}
  secondaryCTA={{ label: "Docs", href: "/docs" }}
/>
```

### CTA Section
```tsx
<CTASection
  variant="simple|gradient|split|centered"
  title="Ready to start?"
  description="Join us"
  primaryCTA={{ label: "Get Started", href: "/" }}
  secondaryCTA={{ label: "Contact", href: "/contact" }}
/>
```

### Input, Modal, Toast, Tabs, Accordion
All available in `@/components/ui/`. See component files for full API.

---

## File Structure

```
src/
├── app/                      # Pages (App Router)
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Homepage
│   ├── api/                  # API routes
│   └── (admin)/              # Admin dashboard
├── components/
│   ├── ui/                   # Base components (Button, Card, Nav, Footer, etc.)
│   ├── sections/             # Page sections (Hero variants, CTA)
│   ├── admin/                # Admin-specific components
│   └── ai/                   # AI-powered components
├── design-system/
│   ├── tokens.ts             # All design token values
│   ├── theme.css             # CSS variables (light/dark)
│   └── DESIGN-PRINCIPLES.md  # Design guidelines
└── lib/
    ├── utils.ts              # cn() helper, utilities
    ├── seo.tsx               # SEO config & utilities
    ├── theme.tsx             # Theme provider & useTheme hook
    └── supabase/             # Database client
```

---

## Common Patterns

### Page Layout
```tsx
export default function Page() {
  return (
    <>
      <Navigation />
      <main>
        <HeroCentered {...heroProps} />
        <section className="section-padding">
          <div className="container-premium">
            {/* Content */}
          </div>
        </section>
        <CTASection {...ctaProps} />
      </main>
      <Footer />
    </>
  );
}
```

### Section Pattern
```tsx
<section className="section-padding">
  <div className="container-premium">
    <div className="max-w-3xl mx-auto text-center mb-16">
      <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mt-4 mb-6">
        Section Title
      </h2>
      <p className="text-lg text-muted-foreground">
        Section description
      </p>
    </div>
  </div>
</section>
```

### Dark Mode
```tsx
className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
```

### Animation (keep it subtle)
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: [0.4, 0.0, 0.2, 1] }}
>
```

---

## Pages (Planned)

1. **Homepage** - Hero, featured work, services overview, CTA
2. **Work/Portfolio** - Project grid, case studies
3. **About** - Agency story, team, values
4. **Services** - What Digital Cultures offers
5. **Contact** - Get in touch form, location info

---

## Critical Rules

1. **No hardcoded colors** - Use design token classes, never raw hex
2. **Generous whitespace** - When in doubt, add more space. This is a feature.
3. **Typography hierarchy** - Let text size/weight do the work. Don't rely on color for hierarchy.
4. **Both light/dark modes** - Test in both. Light mode is primary (grey bg), dark mode inverts.
5. **Subtle animation only** - Fade in, translate up. No bouncing, no flashy transitions.
6. **Mobile-first responsive** - Base styles for mobile, enhance with md:/lg:
7. **Use cn() for classes** - `className={cn('base', conditional && 'extra')}`
8. **TypeScript types** - Interfaces for all props
9. **Accessibility** - ARIA labels, keyboard nav, focus states, contrast compliance
10. **Let the work speak** - Portfolio imagery should be the star. UI gets out of the way.
