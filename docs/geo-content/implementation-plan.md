# GEO Content Structure — Implementation Plan

**Status:** Phase 1 Complete | Phase 2 In Progress
**Date:** March 8, 2026
**Document:** Also available as [ROSES-OS-GEO-Content-Plan.docx](./ROSES-OS-GEO-Content-Plan.docx)

---

## Context

ROSES OS currently has zero geo-targeted or question-answering content. All pages are static brand/marketing pages. People searching "meditation classes New York", "aura reading course online", or "what is rose meditation" will never find the site. This plan adds programmatic SEO infrastructure: geo-targeted landing pages per city, FAQ content with schema markup, a sitemap, robots file, and Course structured data — all designed to capture organic search traffic and funnel it into the enrollment flow.

---

## Why This Matters (SEO Strategy)

| SEO Gap | Solution |
|---------|----------|
| No pages targeting "[service] + [city]" queries | Geo landing pages at `/meditation/[location]` |
| No content answering "what is..." / "how does..." queries | FAQ sections with FAQPage schema (Google "People Also Ask") |
| No sitemap.xml — Google can't efficiently discover pages | Auto-generated sitemap via Next.js |
| No robots.txt — no crawl directives | Proper robots file blocking admin/teaching |
| No Course structured data | Rich results for course dates, prices, format |
| No breadcrumb schema | Better SERP display with navigation trail |
| Unused schema generators sitting in seo.tsx | Activate `generateFAQSchema()`, `generateBreadcrumbSchema()`, `generateWebPageSchema()` |

**Target queries this captures:**
- "meditation classes [city]" — geo pages
- "aura reading course online" — `/meditation/online` page
- "what is rose meditation" — FAQ schema → People Also Ask
- "chakra cleansing meditation" — FAQ content
- "clairvoyance training online" — FAQ + online page
- "energy healing [city]" — geo pages with city keywords

---

## What We're Building

### 1. Geo Landing Pages (20 pages)

Dynamic route at `/meditation/[location]` — one page per target city plus an "online" catch-all.

**Cities by timezone (mapped to existing schedule data):**

| Timezone | Cities | Schedule Column |
|----------|--------|-----------------|
| Pacific Time | San Francisco, Los Angeles | `sanJose` |
| Colombia / Central | Bogotá, Mexico City | `bogota` |
| Eastern Time | New York, Miami, Toronto | `newYork` |
| Brasília Time | São Paulo, Rio de Janeiro, Buenos Aires | `brasilia` |
| GMT | London, Lisbon | `london` |
| CET | Madrid, Barcelona, Paris, Berlin, Paphos | `madrid` |
| Non-geo | Online (catch-all) | All timezones |

**Each page includes:**
- Hero with city-specific title (e.g. "Rose Meditation & Aura Reading in New York")
- Unique intro paragraph per city (prevents duplicate content)
- Course cards (Rose Meditation + Aura Reading Level 1)
- Schedule filtered to the local timezone
- FAQ accordion (15 questions with FAQPage schema)
- CTA linking to enrollment

**Each page has structured data:**
- Course schema (schema.org/Course) with real dates and prices
- FAQPage schema for Google "People Also Ask"
- Breadcrumb schema (Home > Meditation > City)
- WebPage schema

### 2. FAQ Content (15 questions)

Questions targeting real search queries, embedded in every geo page:

| Category | Questions |
|----------|-----------|
| **About** | What is Rose Meditation? · How does aura reading work? · What is chakra cleansing meditation? · What is clairvoyance training? · Is this a religious practice? |
| **Logistics** | Do I need prior experience? · How are classes delivered? · What timezones do you support? · How long is Rose Meditation? · How long is Aura Reading? · Can I take Rose Meditation standalone? |
| **Practice** | What will I learn? · What happens after the course? |
| **Pricing** | How much do courses cost? · What is "pay what feels right"? |

### 3. Sitemap (`/sitemap.xml`)

Auto-generated sitemap including all static routes (homepage, offerings, community, etc.) and all 20 geo pages. Updates automatically when cities are added.

### 4. Robots (`/robots.txt`)

Allows crawling of all public pages. Blocks `/admin/`, `/api/`, `/teaching/` from search engines. Points to sitemap.

### 5. Course Schema

schema.org/Course structured data for each program offering:
- Course name, description, provider
- CourseInstance with start/end dates, online delivery mode
- Offer with price (starting tier) and availability

---

## Technical Implementation

### Files Created / Modified

| Action | File | Purpose |
|--------|------|---------|
| Edit | `src/lib/data/types.ts` | Add `GeoLocation` and `FAQItem` interfaces |
| Create | `src/lib/data/geo-data.ts` | 20 locations, 15 FAQs, helper functions |
| Edit | `src/lib/data/index.ts` | Re-export geo data |
| Edit | `src/lib/seo.tsx` | Add `generateCourseSchema()` |
| Create | `src/components/sections/LocalSchedule.tsx` | Timezone-filtered schedule table |
| Create | `src/components/sections/FAQSection.tsx` | Accordion FAQ component |
| Create | `src/app/(site)/meditation/[location]/page.tsx` | Dynamic geo landing page |
| Create | `src/app/sitemap.ts` | Auto-generated sitemap |
| Create | `src/app/robots.ts` | Crawl directives |
| Create | `docs/geo-content/city-targeting-questions.md` | Founder review doc for city list |

### Architecture Decisions

- **Server-rendered pages** — Geo pages are server components for maximum SEO benefit (full HTML delivered to crawlers)
- **Static generation** — All geo pages are pre-built at deploy time via `generateStaticParams()` (fast load times)
- **Data-driven** — All content lives in `geo-data.ts` following the existing `mock-data.ts` pattern. Adding a city = adding one data entry
- **Reuses existing components** — `PageHero`, `ProgramCard`, existing SEO utilities
- **Unique content per page** — Each city gets a unique intro, timezone-specific schedule, and localized keywords to avoid duplicate content penalties

### How to Add a New City

Add an entry to `src/lib/data/geo-data.ts`:

```typescript
{
  id: 'seattle',
  slug: 'seattle',
  city: 'Seattle',
  region: 'Washington',
  country: 'United States',
  timezoneKey: 'sanJose',
  timezoneLabel: 'Pacific Time (PT)',
  intro: 'Join Rose Meditation and Aura Reading courses from Seattle...',
  keywords: ['meditation classes seattle', 'aura reading course seattle'],
}
```

The page at `/meditation/seattle` is automatically generated with all content, schema, and sitemap inclusion.

---

## Phase 2: Homepage Metadata & Documentation

**Status:** In Progress

### What Was Missing

The homepage (`src/app/(site)/page.tsx`) — the most important page for SEO — had no `metadata` export. Every other page in the site (offerings, the-rose, community, contact, guardians) already followed the server-wrapper pattern with metadata, but the homepage was a single `'use client'` file with no SEO metadata at all.

### What We Did

1. **Renamed** `src/app/(site)/page.tsx` → `src/app/(site)/HomeClient.tsx` (preserving the existing client component)
2. **Created** new `src/app/(site)/page.tsx` as a server wrapper with full metadata:
   - Title: "ROSES OS — Remember Who You Are"
   - Description targeting core search queries (rose meditation, aura reading, consciousness)
   - 12 SEO keywords
   - OpenGraph metadata for social sharing
3. **Updated** scope of work to reflect GEO Phase 1 completion
4. **Generated** this implementation plan as a `.docx` document

### Files Modified (Phase 2)

| Action | File | Purpose |
|--------|------|---------|
| Rename | `src/app/(site)/page.tsx` → `HomeClient.tsx` | Move client component |
| Create | `src/app/(site)/page.tsx` | Server wrapper with homepage metadata |
| Edit | `docs/brand/scope-of-work-and-proposal.md` | Update GEO milestone status |
| Edit | `docs/geo-content/implementation-plan.md` | Add Phase 2 section |
| Create | `docs/geo-content/generate-geo-plan-docx.py` | Python script to generate .docx |
| Create | `docs/geo-content/ROSES-OS-GEO-Content-Plan.docx` | Generated .docx deliverable |

---

## Verification Checklist

### Phase 1
- [x] `pnpm build` — All geo pages generate without errors
- [x] `/sitemap.xml` includes all static + geo routes
- [x] `/robots.txt` returns correct crawl directives
- [x] JSON-LD validates on geo pages (Course, FAQ, Breadcrumb schemas)
- [x] Geo pages show correct timezone in schedule
- [x] Each geo page has unique title, description, and intro content
- [x] FAQ accordion opens/closes correctly
- [x] CTA links work (enrollment, offerings)

### Phase 2
- [ ] Homepage exports metadata (title, description, keywords, openGraph)
- [ ] HomeClient.tsx renders correctly when imported by new page.tsx
- [ ] `.docx` document generated and matches brand styling
- [ ] Scope of work updated with GEO progress
