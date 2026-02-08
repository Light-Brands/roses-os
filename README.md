# Digital Cultures

Agency website for Digital Cultures - a marketing, creative, and design agency based in Paphos, Cyprus.

---

## Tech Stack

- **Framework:** Next.js 16+ (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4 + custom design tokens
- **Animation:** Framer Motion + GSAP
- **Icons:** Lucide React
- **Images:** Sharp via Next.js Image
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth (admin only)

---

## Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

---

## Project Structure

```
src/
├── app/                      # Pages (App Router)
│   ├── globals.css           # Global styles + Tailwind config
│   ├── layout.tsx            # Root layout with SEO
│   ├── page.tsx              # Homepage
│   ├── (admin)/              # Admin dashboard (route group)
│   └── api/                  # API routes
├── components/
│   ├── ui/                   # Base UI components
│   ├── sections/             # Page section components
│   ├── admin/                # Admin panel components
│   └── ai/                   # AI-powered components
├── design-system/
│   ├── tokens.ts             # Design token definitions
│   ├── theme.css             # CSS variables (light/dark)
│   └── DESIGN-PRINCIPLES.md  # Design guidelines
└── lib/
    ├── utils.ts              # Utility functions (cn, etc.)
    ├── seo.tsx               # SEO configuration & utilities
    ├── theme.tsx             # Theme provider & hook
    └── supabase/             # Database client
```

---

## Design System

### Philosophy

- **Breathing minimalism** - generous whitespace, purposeful focal points
- **Typography-first** - text size and weight create the hierarchy
- **Monochrome restraint** - near-monochrome palette, strategic accents only
- **Subtle motion** - micro-interactions that enhance, never distract

### Color Palette

| Role | Light Mode | Dark Mode |
|------|-----------|-----------|
| Page background | #E8E8E8 | #0A0A0A |
| Surface/cards | #FFFFFF | #1A1A1A |
| Primary text | #1A1A1A | #F5F5F5 |
| Supporting text | #666666 | #999999 |
| Accent/CTA | #000000 | #FFFFFF |

### Typography

Inter font family. Display headlines up to 96px (fluid clamp). Tight letter spacing on headings. Generous line height on body text.

### Spacing

8px base grid. Generous section padding (py-20 to py-32). Safe margins: 40px mobile, 80px tablet, 120px desktop.

---

## Key Files

| File | Purpose |
|------|---------|
| `AI-RULES.md` | Development rules for AI-assisted work |
| `.claude/project-context.md` | Full context for Claude sessions |
| `src/design-system/tokens.ts` | All design token values |
| `src/design-system/DESIGN-PRINCIPLES.md` | Design guidelines |
| `src/lib/seo.tsx` | SEO configuration |

---

## Scripts

```bash
pnpm dev            # Development server
pnpm build          # Production build
pnpm start          # Start production
pnpm lint           # Run ESLint
pnpm type-check     # TypeScript check
```

---

## Deployment

Deploy on Vercel:

```bash
pnpm build
```

Or deploy anywhere that supports Node.js.

---

## License

Private - Digital Cultures
