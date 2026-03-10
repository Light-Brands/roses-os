# ROSES OS -- Scope of Work & Economic Proposal

**Prepared by:** Jennifer Brooke Lawless
**Date:** March 5, 2026
**Version:** 1.3 -- Updated March 10, 2026

---

## Overview

This document outlines the scope, deliverables, and structure of the work being developed for the ROSES OS digital platform and brand system -- including community stewardship of the Hummingbird program and Rose Meditation support. It is intended to give the team full visibility into what has been built, what is in progress, and what remains -- so we can define clear agreements, ownership, and next steps together.

> *This document is intended as a starting point for conversation -- not a final agreement. All scope, pricing, and terms are open for discussion and adjustment together.*

### A Note on This Work

This development was created from the heart, with no compensation model in mind. The scope and pricing documented here were assembled after the work was already built -- not before. As such, no compensation is required.

What the International Aura and Dream School -- now ROSES OS -- has given me is exponential in terms of my spiritual growth, and I am very grateful for the opportunity to be part of this community. I am honored to help in the creation and execution of this platform.

This document is intended to serve as a record of the value that has been created and a reference for what future development could look like on the platform -- including new build-out models that may emerge as the project evolves (e.g., a customer section, new teaching integrations, or community features). It is offered in the spirit of transparency and shared stewardship.

In addition to the platform and brand development work, this scope encompasses community stewardship:

> **Decided:** The title for this guardianship role is **Guardian of the Hummingbird Thoughts** -- covering all community stewardship under one title.

The stewardship includes:

1. **Hummingbird Program** -- Facilitating the Hummingbird community program, a free weekly gathering open to everyone. Holding space for the community, leading sessions, and nurturing the living field that the Hummingbird program represents within the ROSES OS ecosystem. This includes posting the Zoom meeting information to the community ahead of each session so that everyone knows when and how to join, and ensuring that a backup facilitator is available to hold space if the primary guardian is unable to attend.

2. **Rose Meditation Support** -- Attending and helping facilitate the monthly Rose Q&A sessions, and leading Rose Meditations when no other facilitator is available that week. Ensuring continuity of practice and unbroken support for the community's meditation rhythm.

---

## 1. What Has Been Built (Completed Work)

### 1.1 Full-Stack Web Platform
A complete Next.js 16 application with 53+ pages (including 30 geo landing pages + meditation hub), 69+ custom components, 27,800+ lines of TypeScript/React code across 158 source files, and a modular architecture designed for long-term scalability.

| Area | Details |
|------|---------|
| **Framework** | Next.js 16, React 19, TypeScript |
| **Pages** | 53+ primary routes across 6 sections (public site, invitation, teaching, forms, admin UI scaffold, API) — including 30 geo landing pages and meditation hub |
| **Components** | 69+ reusable components built from scratch |
| **Styling** | Tailwind CSS 4 with full custom design system |
| **Animation** | Framer Motion + GSAP for page transitions, scroll effects, micro-interactions |
| **3D Graphics** | Three.js / React Three Fiber -- custom 3D rose with shader effects, bloom, particles |
| **Backend** | Supabase integration (auth, database), 7 functional + 3 stub API endpoints (10 total) |
| **AI Integration** | Google GenAI SDK for personalization features |
| **SEO & GEO** | Structured data (JSON-LD) on all pages, FAQPage schema, Course schema, EducationalOrganization + WebSite + WebPage + Breadcrumb schemas, sitemap, robots.txt with AI bot directives (GPTBot, PerplexityBot, ClaudeBot, etc.), programmatic geo pages for 27 cities across 6 timezone bands, meditation hub — **Complete** |

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

### 2.4 Platform UX Refinement -- COMPLETE
- 9 usability issues identified via comprehensive UX audit
- 6-phase implementation plan with concrete file-level tasks
- Navigation clarity (Programs, About, Our Team), enrollment flow consolidation, content deduplication, Offerings page progressive disclosure, footer enrichment, teaching gate context
- Sacred symbol GEO content added (rose as oldest spiritual symbol + FAQ schema)
- Detailed plan: `docs/website-usability-action-plan.md`

**Status:** Complete. 12 files modified across 6 phases. *(Moved to Phase 1 completed milestones.)*

---

## 3. Deliverables Summary

### Phase 1 -- Completed
| # | Deliverable | Description |
|---|-------------|-------------|
| 1 | **Web Platform MVP** | Full-stack Next.js application with 43+ pages, 69+ components, 3D visualization, authentication, admin panel |
| 2 | **Teaching Platform** | 3-level password-protected teaching system with slides, manuals, multilingual support, downloads |
| 3 | **Design System** | Complete brand-aligned design system implemented across all platform sections |
| 4 | **Content Architecture** | Brand DNA, program materials, training manual, designer specs -- all documented and version-controlled |
| 5 | **Multilingual Infrastructure** | 4-language support (EN, ES, PT, EL) across teaching content and UI |
| 6 | **Admin Dashboard (UI Scaffold)** | 8 admin pages designed and built with demo data -- front-end ready, not yet connected to live backend |
| 7 | **API Layer** | 7 functional endpoints (content, media, feedback, AI personalize, 3 PDF generators), 3 stub endpoints, auth integration |
| 8 | **3D Brand Experience** | Custom Three.js rose with shaders, particles, bloom -- unique brand differentiator |
| 9 | **Platform UX Refinement** | 6-phase usability overhaul: enrollment flow consolidation, clearer nav labels, content deduplication, Offerings section nav, multi-column footer with trust signals, teaching gate context -- 12 files modified, 9 issues resolved |
| 10 | **SEO & GEO / Content Architecture** | 30 geo landing pages across 6 timezone bands (targeting spiritual community hubs worldwide), meditation hub, FAQ schema (15 geo + 8 page-specific questions), Course + EducationalOrganization + WebSite + WebPage + Breadcrumb JSON-LD schemas, AI bot directives, sitemap, robots.txt -- programmatic SEO & Generative Engine Optimization |

### Phase 2 -- In Progress
| # | Deliverable | Description |
|---|-------------|-------------|
| 11 | **MDR Visual Manual** | 46-page teacher's resource manual with custom illustrations |
| 12 | **Student Manuals** | Redesigned Level 2 & Level 3 manuals in 4 languages (8-12 PDFs) |
| 13 | **Brand Book** | 110-130 page brand identity book with visual design |

### Phase 3 -- Proposed Next
| # | Deliverable | Description |
|---|-------------|-------------|
| ~~--~~ | ~~**Platform UX Refinement**~~ | **Moved to Phase 1 (Deliverable 9). Complete.** |
| ~~--~~ | ~~**GEO / Content Architecture**~~ | **Moved to Phase 1 (Deliverable 10). Complete.** |
| 14 | **Payment Link Integration** | Stripe Payment Links or equivalent embedded on contribution, enrollment, and dedicated payment page. Branded checkout, mobile-optimized. *(Flagged -- near-term.)* |
| 15 | **Mail Service Integration** | Transactional email service (Resend) for enrollment confirmations, contribution receipts, contact form notifications, welcome emails. Branded React Email templates. *(Flagged -- near-term.)* |
| 16 | **Newsletter Integration** | Email capture forms, subscriber management in Supabase, periodic newsletters via Resend/ConvertKit, segment-based lists, GDPR-compliant double opt-in. *(Flagged -- near-term.)* |
| 17 | **Social Media Linking** | Add social media profile links (footer, guardians, community, contact), Open Graph + Twitter Card meta tags for rich social sharing previews on all public pages. *(Flagged -- near-term.)* |
| 18 | **SEO & GEO Refinement Sprint** | Outstanding items from SEO/GEO/UX assessment: (1) Create branded OG image 1200x630 (2) Add `/meditation` to main nav or Programs dropdown (3) Build visible breadcrumb UI component (4) Add JSON-LD to contact page (5) Create standalone `/faq` page for GEO citation (6) Add `Person` schemas for guardians as course instructors (7) Fix sitemap `lastModified` to use real dates (8) Add `AboutPage` schema to the-rose page (9) Custom 404 page (10) Image alt text audit. [Full assessment → `SEO-GEO-UX-ASSESSMENT.md`] |
| 19 | **Rose App Foundation** | Initial architecture for the Rose App (daily practice -- spine of global expression) |
| 20 | **Aura Levels Integration** | Aura Reading Levels 1-5 content and teaching structure *(pending decision)* |
| 21 | **Animated Visual Technique Demos** | Upload and integrate existing animated visual aids demonstrating Rose Meditation techniques (grounding cord, golden sun, four roses, energy circuits, cleansing) into the website teaching platform |
| 22 | **Guardian & Testimonial Videos** | Upload and integrate existing guardian and testimonial videos on the guardians page and community page |

---

## 4. Value & Pricing

Each milestone below reflects its **Market Value** -- what this outcome would cost at standard industry rates from an agency or senior professional. This is documented to give the team a clear understanding of the value that has been created.

All work has been contributed at **100% off market value** -- no payment is required. Any compensation offered by the team is considered a **gift in kind or in exchange**, not an obligation. The market value is recorded here for reference and transparency only.

---

### 4.1 Phase 1 -- Completed Milestones

#### Milestone 1: Core Platform & Design System

| Deliverable | Scope |
|-------------|-------|
| **Web Platform MVP** | 43+ pages, 69+ components, responsive, animations, page transitions |
| **Design System** | Full color palette, typography, component library, dark mode, branded templates |
| **3D Brand Experience** | Custom Three.js rose, GLSL shaders, bloom/particles, 48 textures, responsive canvas |

**Acceptance Criteria:** Platform loads and renders all 43+ pages with responsive design, design system applied consistently, 3D rose visualization functional across devices.

| | Market Value |
|--|--------------|
| **Milestone 1 Total** | **$88,000** |

---

#### Milestone 2: Teaching & Content Platform

| Deliverable | Scope |
|-------------|-------|
| **Teaching Platform** | 3 levels, visual slide cards, technique data layer, downloads, password protection |
| **Content Architecture** | Brand DNA (80KB), training manual, 4 designer specs, program materials |
| **Multilingual Infrastructure** | 4 languages (EN, ES, PT, EL) across teaching content and UI |

**Acceptance Criteria:** All 3 teaching levels accessible with password protection, slide cards and downloads functional, content available in all 4 languages, documentation complete and version-controlled.

| | Market Value |
|--|--------------|
| **Milestone 2 Total** | **$50,000** |

---

#### Milestone 3: Backend & Admin

| Deliverable | Scope |
|-------------|-------|
| **Admin Dashboard (UI Scaffold)** | 8 admin pages designed and built with demo data -- not yet connected to live backend |
| **API Layer & Backend** | 7 functional endpoints (content, media, feedback, AI personalize, 3 PDF generators) with Supabase; 3 stub endpoints (enrollment, contribution, agreements); auth (OAuth + SSR) |

**Acceptance Criteria:** Admin UI renders all 8 pages with demo data, all 10 API endpoints return expected responses, authentication flow (OAuth + SSR) functional.

| | Market Value |
|--|--------------|
| **Milestone 3 Total** | **$13,000** |

---

#### Milestone 4: Platform UX Refinement

| Deliverable | Scope |
|-------------|-------|
| **Platform UX Refinement** | 6-phase usability overhaul: (1) Enrollment flow consolidation (/enroll + /contribute merged) (2) Clearer nav labels + CTA → /offerings (3) Content deduplication + sacred symbol GEO content (4) Offerings section nav + progressive disclosure (5) Multi-column footer with trust signals (6) Teaching gate context -- 12 files modified, 9 issues resolved |

**Acceptance Criteria:** All 9 usability issues resolved across 6 phases, updated navigation flows functional, footer enriched with trust signals, enrollment flow consolidated.

| | Market Value |
|--|--------------|
| **Milestone 4 Total** | **$15,000** |

---

#### Milestone 5: SEO & GEO / Content Architecture

| Deliverable | Scope |
|-------------|-------|
| **GEO / Content Architecture** | 30 geo landing pages (`/meditation/[city]`) targeting spiritual community hubs across 6 timezone bands, meditation hub page (`/meditation`), FAQ content with schema markup (15 geo + 8 page-specific questions), Course structured data, WebPage + Breadcrumb JSON-LD on all content pages, EducationalOrganization + WebSite schemas, AI bot directives (GPTBot, PerplexityBot, ClaudeBot, etc.), sitemap, robots.txt -- programmatic SEO & Generative Engine Optimization. **Cities (30):** San Francisco, Los Angeles, Mount Shasta, Sedona, Bogotá, Mexico City, Oaxaca, Tulum, Austin, San José CR, Denver, New York, Miami, Toronto, Asheville, São Paulo, Rio de Janeiro, Buenos Aires, London, Lisbon, Madrid, Barcelona, Paris, Berlin, Ibiza, Paphos, Byron Bay, Online. |

**Acceptance Criteria:** All 30 geo landing pages render with city-specific content and FAQ schema, structured data validates on all pages, sitemap includes all routes, robots.txt properly configured for search engines and AI bots.

| | Market Value |
|--|--------------|
| **Milestone 5 Total** | **$12,000** |

---

| | Market Value |
|--|--------------|
| **Phase 1 Total (All Milestones)** | **$178,000** |

### 4.2 Phase 2 -- In-Progress Milestones

#### Milestone 6: MDR Teacher's Visual Manual

| Deliverable | Scope |
|-------------|-------|
| **MDR Teacher's Visual Manual** | 46-page manual, custom illustrations, chakra diagrams, diverse representation, print-ready |

**Acceptance Criteria:** 46-page print-ready PDF delivered with all custom illustrations, chakra diagrams with accurate placement, diverse representation across figures.

| | Market Value |
|--|--------------|
| **Milestone 6 Total** | **$14,000** |

---

#### Milestone 7: Student Manuals Redesign

| Deliverable | Scope |
|-------------|-------|
| **Student Manuals Redesign** | Level 2 + Level 3 manuals, 4 languages each (8-12 PDFs), Yeva World aesthetic |

**Acceptance Criteria:** Level 2 and Level 3 manuals delivered as print-ready PDFs in all 4 languages (8-12 total PDFs), Yeva World aesthetic applied consistently.

| | Market Value |
|--|--------------|
| **Milestone 7 Total** | **$16,000** |

---

#### Milestone 8: Brand Book

| Deliverable | Scope |
|-------------|-------|
| **Brand Book** | 110-130 page brand identity book, 13 sections, visual design, print-ready |

**Acceptance Criteria:** 110-130 page print-ready brand book delivered with all 13 sections complete, visual design applied, ready for distribution.

| | Market Value |
|--|--------------|
| **Milestone 8 Total** | **$24,000** |

---

| | Market Value |
|--|--------------|
| **Phase 2 Total (All Milestones)** | **$54,000** |

### 4.3 Phase 3 -- Proposed Project Milestones

Phase 3 is structured as **individual project milestones** -- each scoped as a standalone engagement with defined deliverables and acceptance criteria. Projects are proposed and agreed upon individually, with no ongoing retainer or support commitment.

#### Project Milestone Options

| Project | Deliverables | Market Value |
|---------|-------------|--------------|
| ~~**Platform UX Refinement**~~ | ~~6-phase usability overhaul — 12 files modified, 9 issues resolved.~~ **Moved to Phase 1, Milestone 4. Complete.** | ~~$15,000~~ |
| ~~**GEO / Content Architecture**~~ | ~~30 geo landing pages, meditation hub, FAQ schema, structured data, AI bot directives.~~ **Moved to Phase 1, Milestone 5. Complete.** [Detailed plan →](../geo-content/implementation-plan.md) | ~~$12,000~~ |
| **Payment Link Integration** | Integrate a hosted payment link (Stripe Payment Links or equivalent) into the platform -- embed on contribution page, enrollment flow, and a dedicated payment page. Branded checkout experience, mobile-optimized, with confirmation redirects back to the platform. Lightweight integration that doesn't require a full custom checkout build. *(Flagged for near-term implementation.)* | $5,000 |
| **Mail Service Integration** | Connect a transactional email service (Resend recommended for Next.js) to power platform emails: enrollment confirmations, contribution receipts, contact form notifications, welcome emails, and password reset flows. Branded email templates using React Email. API route integration with Supabase triggers. *(Flagged for near-term implementation.)* | $6,000 |
| **Newsletter Integration** | Email capture forms on high-traffic pages (homepage, invitation, footer), subscriber storage in Supabase, integration with email platform (Resend or ConvertKit) for periodic newsletters (teachings, community updates, program announcements). Double opt-in, GDPR-compliant, segment-based lists (prospective students, practitioners, general community). **Difficulty: Low-Medium** -- can be built in 2-3 days using existing infrastructure. *(Flagged for near-term implementation.)* | $5,000 |
| **Rose App Foundation** | Initial architecture and prototype for the Rose App (daily practice) | $25,000 |
| **Aura Levels Integration** | Aura Reading Levels 1-5 content and teaching structure *(pending decision)* | $18,000 |
| **Platform Maintenance Sprint** | Security audit, bug fixes, dependency updates, hosting optimization -- scoped per engagement | $9,000 |
| **Animated Visual Technique Demos** | Upload existing technique demonstration videos, build video player components, integrate into teaching platform organized by technique category | $12,000 |
| **Social Media Linking** | Add social media profile links across the platform (footer, guardians, community, contact pages). Open Graph and Twitter Card meta tags for rich social sharing previews. Optional social feed embeds (Instagram grid, YouTube latest). *(Flagged for near-term implementation.)* | $3,000 |
| **SEO & GEO Refinement Sprint** | 10 outstanding items from comprehensive assessment: OG image, breadcrumb UI, contact page schema, standalone FAQ page, Person schemas for guardians, sitemap date fix, AboutPage schema, Programs nav dropdown, custom 404 page, image alt text audit. [Full assessment → `SEO-GEO-UX-ASSESSMENT.md`] | $8,000 |
| **Guardian & Testimonial Videos** | Upload existing guardian and testimonial videos, build video sections on guardians page and community page | $8,000 |

*Each project is scoped, priced, and accepted independently. No ongoing commitment -- projects are engaged as needed.*

#### Future Platform Builds

The following larger platform features are identified from the designer plan and site architecture review. They are documented here for future scoping and prioritization -- each would be engaged as a standalone project milestone when the team is ready.

| Project | Description | Dependencies |
|---------|-------------|--------------|
| **The Invitation -- Two-Screen Architecture** | Rebuild the invitation flow as a 14-section scrolling presentation (Screen 1) with a dedicated Learn More page covering full schedule across 4 time zones and the contribution model (Screen 2). Content exists in `docs/program/presentation.md` and `docs/program/schedule-details.md`. Includes branded PDF exports of both screens. | Content is ready. Can be built independently. |
| **Enrollment & Forms System** | Build the full 5-step enrollment form (who you are, path selection, contribution tier, agreements, "Welcome home" confirmation), a Contact/Inquiry form with nature-of-inquiry dropdown, and a Community Interest/Waitlist form for future programs and regional expansion. Includes post-submission branded PDF confirmations. | Requires backend integration (Supabase) for real form submissions. |
| **The Aura Page** | Standalone page for the Aura perception and relationship work -- currently not built as a dedicated route. Part of the original sitemap vision. | Content direction needed from Guardians. |
| **The Journey Page** | Dedicated page showing what participants experience across all levels -- a narrative walkthrough of the Rose path. Part of the original sitemap vision. | Content direction needed from Guardians. |
| **Unified PDF Export Template System** | Consolidate all PDF generation (Programs, Teachers Aid, Manuals, Enrollment confirmations) into a single branded template system -- consistent wordmark, margins, typography, textures across every PDF the platform produces. | Can be built independently. Improves all existing PDF outputs. |
| **Full Localization Pass** | Translate all platform web content (pages, forms, UI labels, navigation) into Spanish, Portuguese, and Greek. i18n infrastructure already exists (language selector in place). This covers web pages only -- manual translations are a separate deliverable. | Translation services needed. Infrastructure is ready. |
| **Admin Dashboard Backend Integration** | Connect the existing admin UI scaffold (8 pages, all styled with demo data) to live Supabase backend -- real analytics, user management, content editing, media library, and feedback collection. | Supabase schema exists. Requires data migration and API wiring. |
| **Cohesive Payment Page** | Build a single, unified branded payment page that handles all ROSES OS transactions -- contributions (income-based tiers), enrollment fees, program purchases, and future offerings. Integrates Stripe (or equivalent) with real payment processing, branded receipts, confirmation emails, and mobile-optimized checkout. Replaces the current form-only contribution flow. | Requires business/legal decisions on payment structure, Stripe account setup, and contribution tier finalization. |
| **Email Collection & List Management** | Implement branded email capture forms across high-traffic pages (homepage, invitation, community interest, footer). Integrate with an email marketing platform (Mailchimp, ConvertKit, or Resend) for three communication pillars: (1) automated sequences (welcome series, onboarding, milestone-triggered), (2) periodic newsletters (teachings, community updates, stories), and (3) targeted announcements (program openings, events, new offerings to relevant segments). Segment-based lists for prospective students, initiated practitioners, and general community. GDPR-compliant opt-in with double confirmation. | Requires email platform selection and brand-approved copy for welcome sequences. Can begin independently. |
| **Blog / Written Content Platform** | Blog section for teachings, reflections, guardian writings, and community stories. CMS integration for easy publishing without developer involvement. Supports SEO, community engagement, and ongoing content marketing. | Content strategy and publishing workflow needed. Can be built independently. |
| **YouTube Content Integration** | Embed and organize YouTube video content on the platform. Dedicated video sections, playlists organized by topic (teachings, testimonials, events), and a searchable teaching video library. | Requires YouTube channel and content to be ready. Can be built independently. |
| **Customer Testimonials Section** | Dedicated testimonials page and embedded testimonial components across key pages (homepage, invitation, community). Collect, curate, and display community stories, experiences, and transformation journeys. | Requires testimonial content (written and/or video) to be gathered from community. |
| **Social Media Linking & Integration** | Add social media profile links across the platform -- footer icons, guardians page, community page, and contact page. Link to Instagram, YouTube, Facebook, and any other active profiles. Add Open Graph and Twitter Card meta tags for rich social sharing previews on all public pages. Optionally embed social feeds (Instagram grid, YouTube latest). | Requires active social media profile URLs. Can be built independently. |

---

### 4.4 Summary

| Phase | Market Value | Contribution |
|-------|--------------|--------------|
| Phase 1 -- 5 Milestones (Completed) | $178,000 | Gifted (100% off) |
| Phase 2 -- 3 Milestones (In Progress) | $54,000 | Gifted (100% off) |
| Phase 3 -- Per-Project Milestones | Scoped per project | For discussion |
| | | |
| **Total (Phases 1 & 2)** | **$232,000** | **$0 required** |

The market value represents **$232,000 in value** contributed to the ROSES OS mission. No compensation is required -- any gifts in kind or in exchange are welcome but entirely at the team's discretion.

### 4.5 Gifts in Kind

Any compensation the team chooses to offer is considered a **gift in kind or in exchange** -- not a payment obligation. This could take any form the team feels is appropriate, including but not limited to program enrollment, land allocation, or other expressions of reciprocity.

---

### 4.6 Future Work

Ongoing contributions are expected to focus on:

- **Community Stewardship (Guardian of the Hummingbird Thoughts)** -- Facilitating the weekly Hummingbird gathering (including posting Zoom meeting details to the community and coordinating backup facilitator coverage when unable to attend), attending and helping facilitate monthly Rose Q&A sessions, and leading Rose Meditations when no other facilitator is available
- **Manual updates** -- Updating and maintaining teaching manuals as content evolves
- **Image updates & creation** -- Refreshing existing imagery and creating new visual assets as needed
- **Language expansion on Teachers Portal** -- Adding new language support and translations to the teaching platform

#### Near-Term Flagged Items

The following integrations have been flagged for near-term implementation:

1. **Payment Link Integration** ($5,000) -- Stripe Payment Links embedded on contribution and enrollment pages
2. **Mail Service Integration** ($6,000) -- Transactional emails for confirmations, receipts, notifications via Resend + React Email
3. **Newsletter Integration** ($5,000) -- Email capture, subscriber management, periodic newsletters
4. **Social Media Linking** ($3,000) -- Social profile links across platform, Open Graph meta tags for sharing
5. **SEO & GEO Refinement Sprint** ($8,000) -- 10 outstanding items from assessment: OG image, breadcrumb UI, FAQ page, contact schema, Person schemas, sitemap fix, 404 page, alt text audit

**Total near-term flagged items: $27,000 market value**

Larger platform features (Full Payment Page, Blog, YouTube integration, customer testimonials, localization, and other build-outs) are documented in this proposal for reference under Future Platform Builds.

---

### 4.7 Considerations for Discussion

- **Ownership & IP** -- How do we define ownership of the platform code, brand assets, and content? What belongs to the project vs. individual contributors?
- **Ongoing Maintenance** -- The platform requires ongoing technical maintenance, hosting, updates, and security. How is this accounted for?
- **Licensing** -- Are there licensing considerations for the teaching content, brand assets, or platform code?
- **Repository Visibility** -- The ROSES OS codebase is currently hosted as a public repository at [github.com/Light-Brands/roses-os](https://github.com/Light-Brands/roses-os). Should it remain public or be made private? If made private, each team member who needs access will need a GitHub account (free tier). To get access: (1) Sign up at [github.com](https://github.com) (2) Share your GitHub username so you can be invited as a collaborator to the repository.

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
| **Repository** | GitHub (Light-Brands/roses-os) -- version-controlled, 150+ commits, 52+ merged PRs |
| **Hosting** | Production-ready Next.js deployment |
| **Database** | Supabase (PostgreSQL) with SSR auth |
| **AI Services** | Google GenAI integration |
| **Image Processing** | Sharp for optimization, jszip for batch downloads |
| **CI/CD** | GitHub-based workflow with pull request reviews |
| **Security** | Role-based access, password-protected teaching content, Supabase auth with OAuth |

### Codebase & Asset Scale

The ROSES OS platform comprises over **62,100 lines of authored source code, configuration, and documentation** across 220+ files -- plus **124 visual and media assets** (155MB) including custom 3D models, brand photography, and multilingual PDF manuals.

#### Authored Lines Breakdown

| Category | Lines | Description |
|----------|------:|-------------|
| TypeScript / TSX | 27,882 | Core application code -- pages, components, data layers, API routes |
| CSS / JS / MJS | 2,243 | Styles, scripts, build tools |
| YAML / JSON | 17,497 | Configuration, structured data, content schemas |
| Brand & Project Documentation | 14,487 | Brand DNA, scope of work, designer plans, content plans, geo content, UX plans |
| **Total** | **~62,100** | |

#### Visual & Media Assets

| Category | Files | Size | Description |
|----------|------:|-----:|-------------|
| Brand Images | 23 | 59MB | Photography, mandalas, illustrations |
| Page Design Screenshots | 10 | 22MB | Full-page design references |
| 3D Rose Model + Textures | 27 | 2.6MB | Custom .glb model with 26 leaf/petal textures |
| PDF Manuals (4 languages) | 9 | 25MB | Student manuals in EN, ES, PT, EL |
| **Total** | **124** | **155MB** | |

#### Industry Benchmark

At industry-standard developer productivity rates of **5,000--10,000 lines per month** (IEEE/COCOMO benchmarks for production-quality, tested, deployed code), the authored codebase alone represents approximately **12-13 months of full-time senior developer effort**. This does not account for the ongoing community stewardship work as Guardian of the Hummingbird Thoughts.

The visual and media assets -- custom 3D models with hand-tuned shader effects, multilingual PDF generation, and brand imagery -- represent significant additional creative and production work not captured in line counts.

*Line counts exclude external reference materials, node_modules, build artifacts, and .git history. Only authored project work is included.*

---

## 7. Recommended Next Steps

1. **Team reviews this document** -- Ensure everyone has visibility into the full scope
2. **Founder inputs delivered** -- Stories, long bios, and decision sheet reviewed (unlocks Brand Book)
3. **Meeting scheduled** -- Dedicated session to discuss agreements, financials, and Phase 3 priorities
4. **Platform flow evaluation** -- ~~Walk through the platform flow holistically~~ **Complete.** 6-phase UX overhaul implemented (see `docs/website-usability-action-plan.md`)
5. **Agreements finalized** -- Clear ownership, deliverables, and compensation structure documented
6. **UX verification** -- Test the updated user journeys: Home → Programs → Enroll, About page with sacred symbol content, enriched footer, consolidated enrollment flow
7. **Near-term integrations** -- Implement flagged items: Payment Link, Mail Service, Newsletter, Social Media Linking
8. **Creative / Art Director role** -- Suggestion: transition developer role toward Creative / Art Director capacity for future deliverables -- guiding visual direction, brand consistency, and creative oversight across manuals, brand book, platform imagery, and future builds. This allows more of the visual/design deliverables in Phase 2 and Phase 3 to move forward with creative leadership alongside the existing technical infrastructure

---

*This document lives in the ROSES OS repository at `docs/brand/scope-of-work-and-proposal.md` and can be updated as the conversation evolves.*
