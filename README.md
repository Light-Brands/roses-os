# Oracle - Premium Next.js Boilerplate

A production-ready Next.js 14+ boilerplate with AI-first workflows. Build premium websites faster with Claude.

---

## Start Building in 60 Seconds

### Option 1: Interactive Setup (Recommended)

```bash
pnpm install
pnpm setup      # Interactive wizard
pnpm dev        # Start building
```

### Option 2: Just Paste to Claude

Copy this to Claude and start building:

```
Help me build a website using the Oracle Next.js Boilerplate.

I'm using: Next.js 14+, TypeScript, Tailwind v4, Framer Motion
Design: primary blue, secondary violet, 4px grid
Components: Button, Card, Input, Modal, Navigation, Footer, Hero sections

Rules: Use design tokens (bg-primary-500), 4px spacing, support dark mode

Interview me to understand my project:
1. Website name and what it does?
2. Type? (SaaS, Portfolio, Agency, Product, Blog)
3. What should visitors do?
4. What style? (minimal, bold, friendly, dark)
5. What pages?

Then create a plan and let's build!
```

### Option 3: Detailed Setup

See `PASTE-TO-CLAUDE.md` for the full prompt, or `KICKOFF.md` for comprehensive templates.

---

## Features

- **AI-First Development** - Setup wizard, prompt templates, and guidelines optimized for Claude
- **Premium Design System** - Apple/Vercel-inspired aesthetics with comprehensive design tokens
- **Full-Stack Ready** - Supabase integration for auth, database, and storage
- **20+ Components** - Button, Card, Input, Modal, Toast, Tabs, Navigation, and more
- **Hero Sections** - 3 variants with animations (Centered, Split, Minimal)
- **Dark Mode** - Automatic light/dark with CSS variables
- **Animations** - GSAP + Framer Motion built-in
- **TypeScript** - Strict type checking throughout
- **Performance** - 90+ Lighthouse scores
- **SEO** - Metadata utilities, structured data, sitemaps
- **CI/CD** - GitHub Actions for lint, test, deploy

---

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to see the example landing page.

---

## Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── globals.css           # Global styles + Tailwind config
│   ├── layout.tsx            # Root layout with SEO
│   └── page.tsx              # Example landing page
├── components/
│   ├── ui/                   # Base UI components
│   │   ├── Button.tsx        # Button with variants
│   │   ├── Card.tsx          # Card variants (Feature, Pricing, Testimonial)
│   │   ├── Navigation.tsx    # Responsive nav with animations
│   │   └── Footer.tsx        # Footer with newsletter
│   └── sections/             # Page sections
│       ├── HeroCentered.tsx  # Centered hero variant
│       ├── HeroSplit.tsx     # Split layout hero
│       ├── HeroMinimal.tsx   # Minimal animated hero
│       └── CTASection.tsx    # CTA section variants
├── design-system/
│   ├── tokens.ts             # Design token definitions
│   ├── theme.css             # CSS variables (light/dark)
│   └── DESIGN-PRINCIPLES.md  # Design guidelines
├── lib/
│   ├── utils.ts              # Utility functions
│   └── seo.tsx               # SEO utilities
└── AI-RULES.md               # AI development guidelines
```

---

## Design System

### Design Tokens

All design tokens are defined in `src/design-system/tokens.ts`:

- **Colors** - Primary, secondary, neutral palettes with 11 shades each
- **Typography** - Font families, sizes, weights, and line heights
- **Spacing** - 4px/8px base grid system
- **Shadows** - Subtle to prominent elevation system
- **Radius** - Consistent border radius scale
- **Animation** - Timing functions and durations

### Using Design Tokens

```tsx
// Always use design tokens via Tailwind classes
<div className="bg-primary-500 text-neutral-900 p-6 rounded-xl">
  <h2 className="text-3xl font-bold tracking-tight">Heading</h2>
  <p className="text-lg text-neutral-600">Body text</p>
</div>

// NEVER hardcode values
<div style={{ backgroundColor: '#5a6df2', padding: '24px' }}> // Bad
```

### Dark Mode

Dark mode is automatic via CSS variables:

```tsx
// These automatically adapt to light/dark mode
<div className="bg-background text-foreground border-border">
```

Toggle theme programmatically:

```tsx
document.documentElement.classList.toggle('dark');
```

---

## Components

### Button

```tsx
import { Button } from '@/components/ui/Button';

// Variants: primary, secondary, outline, ghost, gradient, destructive
<Button variant="primary" size="lg" icon={<ArrowRight />}>
  Get Started
</Button>

// As a link
<Button href="/pricing" variant="gradient">
  View Pricing
</Button>
```

### Cards

```tsx
import { FeatureCard, PricingCard, TestimonialCard } from '@/components/ui/Card';

<FeatureCard
  icon={Zap}
  title="Lightning Fast"
  description="Optimized for performance"
  gradient
/>
```

### Hero Sections

```tsx
import { HeroCentered, HeroSplit, HeroMinimal } from '@/components/sections';

<HeroCentered
  badge={{ text: 'New', href: '#' }}
  title="Build Premium Websites"
  titleHighlight="Premium"
  description="Ship faster with our boilerplate"
  primaryCta={{ label: 'Get Started', href: '#' }}
  secondaryCta={{ label: 'Learn More', href: '#' }}
/>
```

### CTA Section

```tsx
import { CTASection } from '@/components/sections/CTASection';

// Variants: simple, gradient, split, centered
<CTASection
  variant="gradient"
  title="Ready to start?"
  description="Get started today"
  primaryCta={{ label: 'Start Free', href: '#' }}
/>
```

---

## SEO

### Metadata Helper

```tsx
import { generateMetadata } from '@/lib/seo';

export const metadata = generateMetadata({
  title: 'Page Title',
  description: 'Page description',
  pathname: '/page-path',
});
```

### Structured Data

```tsx
import { JsonLd, generateFAQSchema } from '@/lib/seo';

<JsonLd data={generateFAQSchema([
  { question: 'What is this?', answer: 'A boilerplate.' }
])} />
```

---

## Animations

### GSAP

```tsx
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

gsap.from('.element', {
  y: 40,
  opacity: 0,
  duration: 0.8,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '.element',
    start: 'top 80%',
  },
});
```

### Framer Motion

```tsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
>
  Content
</motion.div>
```

---

## AI Development

When working with AI assistants, point them to:

1. **`AI-RULES.md`** - Comprehensive development guidelines
2. **`src/design-system/DESIGN-PRINCIPLES.md`** - Design rules
3. **`src/design-system/tokens.ts`** - Available design tokens

Key principles:

- Always use design tokens
- Never hardcode colors or spacing
- Test in both light and dark modes
- Follow component patterns

---

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animation**: GSAP, Framer Motion
- **Icons**: Lucide React
- **Images**: Sharp (via Next.js Image)

---

## Performance Targets

| Metric | Target |
|--------|--------|
| Lighthouse Performance | 90+ |
| Lighthouse Accessibility | 100 |
| LCP | < 2.5s |
| FID | < 100ms |
| CLS | < 0.1 |

---

## Deployment

Deploy instantly on Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Or build and deploy anywhere:

```bash
npm run build
npm start
```

---

## AI Development Resources

| File | Purpose |
|------|---------|
| `PASTE-TO-CLAUDE.md` | Quick-start prompt to paste to Claude |
| `KICKOFF.md` | Detailed project templates |
| `AI-RULES.md` | Development guidelines for AI |
| `.claude/project-context.md` | Full context file |
| `prompt-library/` | Mega-prompts for common tasks |

### Setup Commands

```bash
pnpm setup          # Interactive setup wizard
pnpm dev            # Start development
pnpm build          # Production build
pnpm lint           # Run linting
pnpm type-check     # TypeScript check
```

---

## Full Documentation

- `README-UPDATES.md` - All AI-first additions
- `ui-polish/ui-polish.md` - UI refinement guide
- `supabase/schema.sql` - Database schema

---

## License

MIT
