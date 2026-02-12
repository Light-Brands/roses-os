# ROSES OS

> The Operating System of Remembrance

ROSES OS is a remembrance ecosystem — spiritual-modern consciousness technology that restores inner symmetry and coherence. It is not a self-improvement brand. It is an operating system of coherence — where intuition becomes precise and presence becomes sovereign.

---

## Project Overview

This repository contains the **ROSES OS web platform**: the public site, invitation flow, program content, teaching materials, and admin tooling. Documentation, brand system, and project planning live in `docs/`, aligned with the [Light-Brands/roses-os](https://github.com/Light-Brands/roses-os) documentation repo.

**Core programs (reflected on the site):**

- **The Rose** — Core inner technology (3 progressive levels) that restores coherence across emotional, mental, and energetic systems
- **The Aura** — Perception sharpening, relationship work, and leadership empowerment
- **Rose + Aura Combined** — Integrated learning path

**What’s built:**

- **Public site** — Home, The Rose, Programs, Guardians, The Codex, Community, Contact
- **Invitation** — Invitation and Learn more pages with contribution tiers and schedule
- **Forms** — Enrollment, contribution, and agreements (with API routes)
- **Teaching** — Level 1, 2, and 3 content with sidebar nav and password gate
- **Admin** — Dashboard (login, analytics, content, feedback, media, users, settings)
- **Design system** — Warm palette, typography, page transitions, preloader (rose logo), responsive nav and footer

---

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS v4 + design tokens (`src/design-system/`)
- **Animation:** Framer Motion, GSAP, Three.js (hero sphere, rose model)
- **Icons:** Lucide React
- **Database / Auth:** Supabase (optional; schema in `supabase/`)

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

## Repository Structure

```
roses-os/
├── README.md                 — This file
├── docs/                      — Brand, foundation, program, training (see Key Documents)
├── public/                    — Static assets (rose.png, favicons, models)
├── scripts/                   — generate-favicons.mjs, etc.
├── src/
│   ├── app/
│   │   ├── (site)/            — Public pages: home, the-rose, programs, guardians, the-codex, community, contact
│   │   ├── (invitation)/      — Invitation + learn-more
│   │   ├── (forms)/           — enroll, contribute, agreements
│   │   ├── (teaching)/        — teaching hub + level-1, level-2, level-3
│   │   ├── (admin)/           — Admin dashboard
│   │   ├── api/               — API routes (enrollment, contribution, agreements, etc.)
│   │   └── layout.tsx, globals.css
│   ├── components/
│   │   ├── ui/                — Navigation, Logo, Footer, Preloader, PageTransition, etc.
│   │   ├── sections/          — PageHero, DomainGrid, LineageTimeline, ContributionTiers, etc.
│   │   ├── forms/             — EnrollmentForm, ContributionForm, AgreementsForm
│   │   ├── teaching/          — LevelNav, PasswordGate, TechniqueCard, ChakraChart
│   │   └── three/             — HeroSphere, RoseModel, RoseCanvas
│   ├── design-system/         — tokens.ts, theme.css, DESIGN-PRINCIPLES.md
│   └── lib/                   — utils, theme, transition, data, supabase, seo
└── supabase/                  — schema.sql (optional)
```

---

## Key Documents (in `docs/`)

| Document                        | Path                                           | Purpose                                                                              |
| ------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------ |
| **Brand DNA**                   | docs/brand/brand-dna.md                        | Brand identity, visual system, and web design decisions                              |
| **The Codex**                   | docs/foundation/the-codex.md                   | Foundational philosophy: coherence, lineage, architecture, manifesto                 |
| **Technologies of Remembrance** | docs/technology/technologies-of-remembrance.md| The Rose as a modern inner technology                                                |
| **Presentation**                | docs/program/presentation.md                   | Public invitation content for the Rose and Aura programs                            |
| **Schedule Details**            | docs/program/schedule-details.md               | Program schedule, time zones, contribution model                                     |
| **Training Manual**             | docs/training/mdr-teachers-training-manual.md | Teacher training content for Rose Meditation Levels 1–3                             |
| **Project Plan**                | docs/project-plan-for-designer.md              | Design brief for the web platform                                                   |

---

## Scripts

```bash
pnpm dev          # Development server
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # ESLint
pnpm type-check   # TypeScript check
pnpm icons        # Generate favicons from source
```

---

## Deployment

Build and deploy to Vercel or any Node-friendly host:

```bash
pnpm build
```

---

## About

Designed & developed by **LIGHT BRANDS**.  
Documentation and planning: [github.com/Light-Brands/roses-os](https://github.com/Light-Brands/roses-os).
