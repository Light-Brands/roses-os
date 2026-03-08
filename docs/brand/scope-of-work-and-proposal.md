# ROSES OS -- Scope of Work & Economic Proposal

**Prepared by:** Jennifer Brooke Lawless
**Date:** March 5, 2026
**Version:** 1.0 -- For Team Review

---

## Overview

This document outlines the scope, deliverables, and structure of the work being developed for the ROSES OS digital platform and brand system. It is intended to give the team full visibility into what has been built, what is in progress, and what remains -- so we can define clear agreements, ownership, and next steps together.

> *This document is intended as a starting point for conversation -- not a final agreement. All scope, pricing, and terms are open for discussion and adjustment together.*

---

## 1. What Has Been Built (Completed Work)

### 1.1 Full-Stack Web Platform
A complete Next.js 16 application with 23 pages, 65+ custom components, and a modular architecture designed for long-term scalability.

| Area | Details |
|------|---------|
| **Framework** | Next.js 16, React 19, TypeScript |
| **Pages** | 23 primary routes across 5 sections (public site, teaching, forms, admin UI scaffold, API) |
| **Components** | 65+ reusable components built from scratch |
| **Styling** | Tailwind CSS 4 with full custom design system |
| **Animation** | Framer Motion + GSAP for page transitions, scroll effects, micro-interactions |
| **3D Graphics** | Three.js / React Three Fiber -- custom 3D rose with shader effects, bloom, particles |
| **Backend** | Supabase integration (auth, database), 3 functional + 3 stub API endpoints |
| **AI Integration** | Google GenAI SDK for personalization features |

### 1.2 Teaching Platform (Password-Protected)
A dedicated teaching section with 3 levels of Rose Meditation content:

- **Level 1** -- 13 foundational techniques with visual slide cards
- **Level 2** -- Chakra system deep dive (7 chakras), Sacred Space, Golden Sticky Roses, Aura layer cleansing
- **Level 3** -- The Analyzer, advanced perception, energetic coherence

Each level includes:
- Visual teaching slide cards with custom illustrations
- Multilingual support (English, Spanish, Portuguese, Greek)
- Downloadable student manuals (PDF, all 4 languages)
- Teacher image download packs (ZIP)
- Technique reference data layer

### 1.3 Admin Dashboard (UI Scaffold)
Admin panel UI designed and built (8 pages, 4 components), currently using demo/mock data:
- Analytics dashboard layout (visitors, page views, traffic sources)
- User management interface with role-based design
- Content management and media library UI
- Feedback collection interface

*Note: The admin UI is built and styled but runs on demo data -- it is not yet connected to a live backend. This represents the front-end design and component work, not a functional admin system.*

### 1.4 Brand & Design System
A complete design system implemented across the platform:
- Custom color palette (Rose Clay Mauve, Antique Olive Brass, Light Terracotta, Peach Sand, Golden Ether, Aura White + 7 chakra colors)
- Typography system (Cormorant Garamond + Inter)
- Branded PDF generation with custom templates
- Sacred-tech minimalism design language
- Responsive design (mobile, tablet, desktop)
- Dark mode support
- Custom cursor, scroll progress, preloader, page transitions

### 1.5 Forms & Enrollment Flow
- Multi-step enrollment form
- Contribution flow with income-based tiers
- Contact form
- WhatsApp integration for direct guardian contact

### 1.6 Content & Documentation Architecture
All strategic and brand documentation living in the repository:

| Document | Size | Status |
|----------|------|--------|
| Brand DNA Master Document | ~80KB / 2,000 lines | Complete |
| Brand Book Content Plan | 575 lines, 13-section structure | ~75% content-ready |
| Founder Interview Questions | Prepared | Awaiting responses |
| Founder Decision Sheet | 29 consolidated decisions | Awaiting review |
| MDR Teachers Training Manual | Full curriculum | Complete |
| Program Presentation & Schedule | Multi-timezone | Complete |
| 4 Designer Project Plans | MDR, Brand Book, Manuals, Platform | Complete |

---

## 2. Work In Progress

### 2.1 MDR Teacher's Resource Manual (Visual Design)
- 46-page visual teaching aid for live sessions
- 5 sections with custom illustrations
- Chakra pages with color-coding and anatomically accurate placement
- Diverse representation across all figure illustrations
- Designer notes and specifications documented

**Status:** Design specifications complete. Visual production active. ETA: ASAP.

### 2.2 Student Manual Redesign
- Level 2 Manual -- standalone redesign
- Level 3 Manual -- 2026 edition update
- Level 1 Manual -- reimagine if timeline permits
- Greek-style / Yeva World aesthetic
- 4 languages each (12 PDF deliverables)

**Status:** Content ready. Visual design pending MDR completion. Deadline: March 15, 2026.

### 2.3 Brand Book Completion
- 110-130 page brand book (benchmarked against Zunya Brand Book)
- 13 sections mapped and structured
- ~75% content written and design-ready

**Blocked by:**
1. Founder stories and long Guardian bios (interview questions delivered, responses pending)
2. ~29 open decisions consolidated in Founder Decision Sheet

**Status:** Ready to move to visual design as soon as founder inputs are received.

---

## 3. Deliverables Summary

### Phase 1 -- Completed
| # | Deliverable | Description |
|---|-------------|-------------|
| 1 | **Web Platform MVP** | Full-stack Next.js application with 23 pages, 65+ components, 3D visualization, authentication, admin panel |
| 2 | **Teaching Platform** | 3-level password-protected teaching system with slides, manuals, multilingual support, downloads |
| 3 | **Design System** | Complete brand-aligned design system implemented across all platform sections |
| 4 | **Content Architecture** | Brand DNA, program materials, training manual, designer specs -- all documented and version-controlled |
| 5 | **Multilingual Infrastructure** | 4-language support (EN, ES, PT, EL) across teaching content and UI |
| 6 | **Admin Dashboard (UI Scaffold)** | 8 admin pages designed and built with demo data -- front-end ready, not yet connected to live backend |
| 7 | **API Layer** | 3 functional Supabase endpoints (content, media, feedback), 3 stub endpoints, auth integration |
| 8 | **3D Brand Experience** | Custom Three.js rose with shaders, particles, bloom -- unique brand differentiator |

### Phase 2 -- In Progress
| # | Deliverable | Description |
|---|-------------|-------------|
| 9 | **MDR Visual Manual** | 46-page teacher's resource manual with custom illustrations |
| 10 | **Student Manuals** | Redesigned Level 2 & Level 3 manuals in 4 languages (8-12 PDFs) |
| 11 | **Brand Book** | 110-130 page brand identity book with visual design |

### Phase 3 -- Proposed Next
| # | Deliverable | Description |
|---|-------------|-------------|
| 12 | **Platform UX Refinement** | Holistic UX review and flow optimization per Diego's suggestion |
| 13 | **GEO / Content Architecture** | 20 geo landing pages, FAQ with schema markup, Course structured data, sitemap/robots — programmatic SEO (Generative Engine Optimization). **Status: In Progress.** [Detailed plan →](../geo-content/implementation-plan.md) |
| 14 | **Rose App Foundation** | Initial architecture for the Rose App (daily practice -- spine of global expression) |
| 15 | **Aura Levels Integration** | Aura Reading Levels 1-5 content and teaching structure *(pending decision)* |
| 16 | **Animated Visual Technique Demos** | Upload and integrate existing animated visual aids demonstrating Rose Meditation techniques (grounding cord, golden sun, four roses, energy circuits, cleansing) into the website teaching platform |
| 17 | **Guardian & Testimonial Videos** | Upload and integrate existing guardian and testimonial videos on the guardians page and community page |

---

## 4. Value & Pricing

Pricing is structured around **milestone-based outcomes** -- each milestone has a fixed price tied to the completion and acceptance of specific deliverables, not hours worked. Payment is triggered when a milestone is delivered and accepted by the team.

Each milestone reflects two columns: **Market Value** (what this outcome would cost at standard industry rates from an agency or senior professional) and **Contribution Rate** (a mission-aligned rate at 10% of market value -- a 90% reduction that honors the shared purpose of the project).

The difference between market value and contribution rate can be settled through any combination of: **equity/ownership stake** in ROSES OS, **free program enrollment** (Rose Meditation, Aura, and community programs), and/or **Numa land allocation discount**.

---

### 4.1 Phase 1 -- Completed Milestones

#### Milestone 1: Core Platform & Design System

| Deliverable | Scope |
|-------------|-------|
| **Web Platform MVP** | 23 pages, 65+ components, responsive, animations, page transitions |
| **Design System** | Full color palette, typography, component library, dark mode, branded templates |
| **3D Brand Experience** | Custom Three.js rose, GLSL shaders, bloom/particles, 48 textures, responsive canvas |

**Acceptance Criteria:** Platform loads and renders all 23 pages with responsive design, design system applied consistently, 3D rose visualization functional across devices.

| | Market Value | Contribution Rate |
|--|--------------|-------------------|
| **Milestone 1 Total** | **$88,000** | **$8,800** |

---

#### Milestone 2: Teaching & Content Platform

| Deliverable | Scope |
|-------------|-------|
| **Teaching Platform** | 3 levels, visual slide cards, technique data layer, downloads, password protection |
| **Content Architecture** | Brand DNA (80KB), training manual, 4 designer specs, program materials |
| **Multilingual Infrastructure** | 4 languages (EN, ES, PT, EL) across teaching content and UI |

**Acceptance Criteria:** All 3 teaching levels accessible with password protection, slide cards and downloads functional, content available in all 4 languages, documentation complete and version-controlled.

| | Market Value | Contribution Rate |
|--|--------------|-------------------|
| **Milestone 2 Total** | **$50,000** | **$5,000** |

---

#### Milestone 3: Backend & Admin

| Deliverable | Scope |
|-------------|-------|
| **Admin Dashboard (UI Scaffold)** | 8 admin pages designed and built with demo data -- not yet connected to live backend |
| **API Layer & Backend** | 3 functional endpoints (content, media, feedback) with Supabase; 3 stub endpoints (enrollment, contribution, agreements); auth (OAuth + SSR) |

**Acceptance Criteria:** Admin UI renders all 8 pages with demo data, API endpoints return expected responses, authentication flow (OAuth + SSR) functional.

| | Market Value | Contribution Rate |
|--|--------------|-------------------|
| **Milestone 3 Total** | **$13,000** | **$1,300** |

---

| | Market Value | Contribution Rate |
|--|--------------|-------------------|
| **Phase 1 Total (All Milestones)** | **$151,000** | **$15,100** |

### 4.2 Phase 2 -- In-Progress Milestones

#### Milestone 4: MDR Teacher's Visual Manual

| Deliverable | Scope |
|-------------|-------|
| **MDR Teacher's Visual Manual** | 46-page manual, custom illustrations, chakra diagrams, diverse representation, print-ready |

**Acceptance Criteria:** 46-page print-ready PDF delivered with all custom illustrations, chakra diagrams with accurate placement, diverse representation across figures.

| | Market Value | Contribution Rate |
|--|--------------|-------------------|
| **Milestone 4 Total** | **$14,000** | **$1,400** |

---

#### Milestone 5: Student Manuals Redesign

| Deliverable | Scope |
|-------------|-------|
| **Student Manuals Redesign** | Level 2 + Level 3 manuals, 4 languages each (8-12 PDFs), Yeva World aesthetic |

**Acceptance Criteria:** Level 2 and Level 3 manuals delivered as print-ready PDFs in all 4 languages (8-12 total PDFs), Yeva World aesthetic applied consistently.

| | Market Value | Contribution Rate |
|--|--------------|-------------------|
| **Milestone 5 Total** | **$16,000** | **$1,600** |

---

#### Milestone 6: Brand Book

| Deliverable | Scope |
|-------------|-------|
| **Brand Book** | 110-130 page brand identity book, 13 sections, visual design, print-ready |

**Acceptance Criteria:** 110-130 page print-ready brand book delivered with all 13 sections complete, visual design applied, ready for distribution.

| | Market Value | Contribution Rate |
|--|--------------|-------------------|
| **Milestone 6 Total** | **$24,000** | **$2,400** |

---

| | Market Value | Contribution Rate |
|--|--------------|-------------------|
| **Phase 2 Total (All Milestones)** | **$54,000** | **$5,400** |

### 4.3 Phase 3 -- Proposed Project Milestones

Phase 3 is structured as **individual project milestones** -- each scoped as a standalone engagement with defined deliverables and acceptance criteria. Projects are proposed and agreed upon individually, with no ongoing retainer or support commitment.

#### Project Milestone Options

| Project | Deliverables | Market Value | Contribution Rate |
|---------|-------------|--------------|-------------------|
| **Platform UX Refinement** | Holistic UX review, flow optimization, implemented improvements -- accepted by team | $15,000 | $1,500 |
| **GEO / Content Architecture** | 20 geo landing pages (`/meditation/[city]`), FAQ content with schema markup (15 questions), Course structured data, sitemap, robots.txt, homepage SEO metadata — programmatic SEO for organic traffic. **Phase 1 complete (geo pages, FAQ, sitemap, robots, Course schema shipped). Phase 2 in progress (homepage metadata, docs).** [Detailed plan →](../geo-content/implementation-plan.md) | $12,000 | $1,200 |
| **Rose App Foundation** | Initial architecture and prototype for the Rose App (daily practice) | $25,000 | $2,500 |
| **Aura Levels Integration** | Aura Reading Levels 1-5 content and teaching structure *(pending decision)* | $18,000 | $1,800 |
| **Platform Maintenance Sprint** | Security audit, bug fixes, dependency updates, hosting optimization -- scoped per engagement | $9,000 | $900 |
| **Animated Visual Technique Demos** | Upload existing technique demonstration videos, build video player components, integrate into teaching platform organized by technique category | $12,000 | $1,200 |
| **Guardian & Testimonial Videos** | Upload existing guardian and testimonial videos, build video sections on guardians page and community page | $8,000 | $800 |

*Each project is scoped, priced, and accepted independently. No ongoing commitment -- projects are engaged as needed.*

---

### 4.4 Summary

| Phase | Market Value | Contribution Rate | Savings |
|-------|--------------|-------------------|---------|
| Phase 1 -- 3 Milestones (Completed) | $151,000 | $15,100 | 90% |
| Phase 2 -- 3 Milestones (In Progress) | $54,000 | $5,400 | 90% |
| Phase 3 -- Per-Project Milestones | Scoped per project | Scoped per project | 90% |
| | | | |
| **Total (Phases 1 & 2)** | **$205,000** | **$20,500** | **$184,500 in value contributed to the mission** |

The 90% difference between market value and contribution rate represents **$184,500 in value** being contributed directly to the mission -- in the same spirit of conscious contribution that ROSES OS extends to its community. This balance can be settled through any combination of equity, program enrollment, and/or Numa land discount (see Payment Structure Options below).

### 4.5 Milestone Payment Terms

- **Outcome-based:** Payment is tied to deliverable completion and team acceptance -- not hours tracked or time spent
- **Acceptance process:** Each milestone is reviewed by the team upon delivery; payment is triggered once accepted
- **Clear criteria:** Every milestone has defined acceptance criteria so both sides know exactly what "done" looks like
- **No time-tracking:** This structure removes hourly billing entirely -- what matters is the outcome, not the hours

---

### 4.6 Payment Structure Options

For the team to consider:

**Option A -- Equity**
- Full compensation settled through equity/ownership stake in ROSES OS
- Equity percentage to be discussed based on the project's corporate structure and valuation

**Option B -- Land Allocation (Numa Project)**
- Compensation settled through discounted land allocation within the Numa project
- Details to be defined based on Numa project structure, land valuation, and timeline

**Option C -- Program Enrollment**
- Compensation settled through free enrollment in ROSES OS programs (Rose Meditation, Aura, Teachers Training, community programs)
- Value of enrollment credited against the outstanding balance

**Option D -- Combined Settlement**
- Compensation settled through any combination of:
  - Equity/ownership stake in ROSES OS
  - Free program enrollment
  - Numa land allocation discount
- Proportions to be agreed upon together

*Open to discussing what works best for everyone. The goal is sustainability for the project and fairness for all contributors.*

---

### 4.7 Considerations for Discussion

- **Ownership & IP** -- How do we define ownership of the platform code, brand assets, and content? What belongs to the project vs. individual contributors?
- **Ongoing Maintenance** -- The platform requires ongoing technical maintenance, hosting, updates, and security. How is this accounted for?
- **Licensing** -- Are there licensing considerations for the teaching content, brand assets, or platform code?
- **Future Development** -- As the platform grows (Rose App, Aura levels, community features), how do we structure agreements for ongoing development?

---

## 5. Ownership & Licensing

> Points of Consideration for Collaboration and Stewardship

### Intellectual Property

All content, materials, teachings, visual assets, and platform infrastructure created under the ROSES OS ecosystem are the intellectual property of **ROSES OS**.

This includes -- but is not limited to -- written teachings, training manuals, meditation guides, brand materials, course content, digital platform code, and design systems.

Ownership of these materials remains with ROSES OS regardless of the contributors, collaborators, or partners involved in their creation or distribution.

### Teaching Use

Content produced within the ROSES OS ecosystem is **free to use for teaching purposes** by any individual who has been initiated into the Rose path.

This applies to personal teaching, group facilitation, workshops, courses, and other educational contexts -- whether offered freely or as part of a paid program. Initiated teachers and practitioners may use ROSES OS content to support their own teaching and the transmission of this work in the world.

### Conditions of Use

The following conditions apply to the use of ROSES OS content:

1. **Initiation** -- The individual must have been initiated into the Rose path through the ROSES OS lineage or its recognized transmission holders.
2. **Attribution** -- All use of ROSES OS content must credit ROSES OS as the source.
3. **Integrity of Transmission** -- The teachings must be shared without distortion. The essence, language, and energetic integrity of the original material must be preserved. Adaptations are welcome where they serve clarity, but the core transmission must remain whole.
4. **Sacred Use** -- In alignment with the agreements honored within this lineage -- confidentiality, co-responsibility, and trust -- materials should be shared only with those who are ready to receive them, and handled with the care they deserve.

### Platform & Infrastructure

The digital platform, codebase, design system, and technical infrastructure of ROSES OS remain proprietary to **ROSES OS** and its development partner, **LIGHT BRANDS**. These assets are not included in the teaching-use provisions above.

### A Living Agreement

This is not a static legal document. It is a living agreement, aligned with the spirit of The Codex:

> "Though it cannot be owned, it can be protected. Though it cannot be patented, it can be transmitted with integrity."

As the ecosystem grows, these terms may evolve -- always in service of the Rose, its guardians, and those called to carry the work forward.

---

## 6. Technical Infrastructure Notes

For context on the technical foundation that supports everything above:

| Infrastructure | Details |
|----------------|---------|
| **Repository** | GitHub (Light-Brands/roses-os) -- version-controlled, 127+ commits, 29+ merged PRs |
| **Hosting** | Production-ready Next.js deployment |
| **Database** | Supabase (PostgreSQL) with SSR auth |
| **AI Services** | Google GenAI integration |
| **Image Processing** | Sharp for optimization, jszip for batch downloads |
| **CI/CD** | GitHub-based workflow with pull request reviews |
| **Security** | Role-based access, password-protected teaching content, Supabase auth with OAuth |

---

## 7. Recommended Next Steps

1. **Team reviews this document** -- Ensure everyone has visibility into the full scope
2. **Founder inputs delivered** -- Stories, long bios, and decision sheet reviewed (unlocks Brand Book)
3. **Meeting scheduled** -- Dedicated session to discuss agreements, financials, and Phase 3 priorities
4. **UX review session** -- As Diego suggested, walk through the platform flow holistically with Dan's technical input
5. **Agreements finalized** -- Clear ownership, deliverables, and compensation structure documented

---

*This document lives in the ROSES OS repository at `docs/brand/scope-of-work-and-proposal.md` and can be updated as the conversation evolves.*
