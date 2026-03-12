# GEO Content Structure — Implementation Plan

**Status:** Complete
**Date:** March 8, 2026
**Updated:** March 12, 2026 — OG image created; all core items complete

---

## Context

This plan documents the complete programmatic SEO and GEO (Generative Engine Optimization) infrastructure built for ROSES OS. The work captures organic search traffic through geo-targeted landing pages, FAQ content with schema markup, structured data across all pages, AI bot directives, and a meditation hub page — funneling search traffic into the enrollment flow and making content citable by AI-powered search engines (Google AI Overviews, Perplexity, ChatGPT search).

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
| Create | `public/og-image.jpg` | 1200x630 Open Graph image for social sharing previews |
| Create | `scripts/generate-og-image.mjs` | Node script to regenerate OG image from rose mandala |

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

## Verification Checklist

- [x] `pnpm build` — All geo pages generate without errors
- [x] `/sitemap.xml` includes all static + geo routes (including `/meditation` hub)
- [x] `/robots.txt` returns correct crawl directives + AI bot allow rules
- [x] JSON-LD validates on geo pages (Course, FAQ, Breadcrumb schemas)
- [x] Geo pages show correct timezone in schedule
- [x] Each geo page has unique title, description, and intro content
- [x] FAQ accordion opens/closes correctly
- [x] CTA links work (enrollment, offerings)

---

## Extended SEO & GEO Coverage (March 8, 2026)

Beyond the original geo-content plan, the following site-wide SEO and GEO improvements were implemented:

### Homepage SEO Fix
- Extracted homepage to server/client pattern (`HomeClient.tsx` + `page.tsx`)
- Added homepage-specific metadata (title, description, keywords, OG)
- Added WebSite + WebPage + Breadcrumb JSON-LD schemas

### Meditation Hub Page (`/meditation`)
- Created server-rendered hub page with location grid grouped by timezone region
- Added GEO-citable definitional paragraph about Rose Meditation
- Added ItemList schema linking all 20 city pages
- Added WebPage + Breadcrumb JSON-LD
- Added to sitemap

### FAQ Schemas on Content Pages
- **The Rose page** — 4 FAQs: What is Rose Meditation?, What is aura reading?, How does Rose Meditation work?, What are the 13 domains of coherence?
- **Offerings page** — 4 FAQs: How much do courses cost?, What timezones?, Do I need experience?, How are courses delivered?

### Structured Data Expansion
- **Offerings page** — Course schemas (Rose Meditation + Aura Reading) + WebPage + Breadcrumb JSON-LD
- **The Rose page** — WebPage + Breadcrumb + FAQPage JSON-LD
- **Community page** — WebPage + Breadcrumb JSON-LD
- **Guardians page** — WebPage + Breadcrumb JSON-LD

### Organization Schema Upgrade
- Changed `@type` from `Organization` to `['Organization', 'EducationalOrganization']`
- Added `description` field

### AI Bot Directives (GEO)
- Explicitly allowed GPTBot, ChatGPT-User, Google-Extended, PerplexityBot, Anthropic, ClaudeBot, Applebot-Extended in `robots.ts`

### Open Graph Image (March 12, 2026)
- Generated `public/og-image.jpg` (1200×630) using the backcover rose mandala artwork
- Layout: mandala on the left, "ROSES" brand name + "MEDITATION & AURA READING" tagline on the right, on Aura White (`#F7F5F2`) background
- Referenced site-wide via `siteConfig.ogImage` in `src/lib/seo.tsx` — all pages now show a branded preview card when shared on social media, Slack, Discord, etc.
- Added `scripts/generate-og-image.mjs` for easy regeneration if branding changes
- Removed TODO comment from `seo.tsx`

### Remaining TODOs
- [x] Create `og-image.jpg` (1200x630) and place in `/public` — uses backcover rose mandala
- [ ] Add social media URLs to Organization `sameAs` when ready
- [ ] Expand meditation hub to rich page with hero, FAQ section, CTA (future iteration)
