# SEO, GEO & UX Navigation Assessment — ROSES OS

**Date:** March 10, 2026
**Site:** rosesos.com
**Stack:** Next.js 16 (App Router), TypeScript, Tailwind CSS v4, React 19

---

## 1. SEO Assessment

### What's Working Well

| Area | Details |
|------|---------|
| **Metadata per page** | Every public page exports static or dynamic `metadata` with unique title, description, and keywords. The root layout sets a global `title.template` (`%s \| ROSES OS`). |
| **Canonical URLs** | `metadataBase` is set globally; the `generateMetadata()` helper produces `alternates.canonical` for each page. |
| **Structured data (JSON-LD)** | Rich schema on most pages — `WebPage`, `BreadcrumbList`, `FAQPage`, `Course`, `WebSite`, and `Organization` (root layout). The offerings page includes two `Course` schemas with real pricing. |
| **Sitemap** | Dynamic `sitemap.ts` covers all static routes + dynamically generated `/meditation/[location]` geo pages, with appropriate `changeFrequency` and `priority` values. |
| **robots.ts** | Properly disallows `/admin/`, `/api/`, `/teaching/`. |
| **Font loading** | Google Fonts loaded with `display: 'swap'` — good for CLS and LCP. |
| **Viewport & theme-color** | Properly configured via `export const viewport` (correct Next.js 14+ pattern). |
| **Favicons & manifest** | Full favicon set (ico, 16px, 32px, apple-touch-icon) + PWA `manifest.json`. |
| **GoogleBot directives** | Explicit `max-image-preview: large`, `max-snippet: -1`, `max-video-preview: -1` — allows rich result display. |

### Issues & Gaps

| Severity | Issue | Location | Recommendation |
|----------|-------|----------|----------------|
| **High** | **OG image missing** | `public/og-image.jpg` does not exist (TODO in `seo.tsx:12`). Every page references it. | Create a 1200x630 branded OG image. Without it, social shares and link previews show no image. |
| **High** | **Contact page has no JSON-LD** | `src/app/(site)/contact/page.tsx` | Add `WebPage` + `BreadcrumbList` schemas at minimum. Consider `ContactPoint` schema for WhatsApp/email. |
| **Medium** | **Organization `sameAs` is empty** | `seo.tsx:113-114` | Add social profile URLs once live (Instagram, YouTube, etc.). This feeds the Knowledge Panel. |
| **Medium** | **No `hreflang` or locale alternates** | Root layout + sitemap | The site serves a global audience (50+ countries) with i18n infrastructure in the teaching layout. If multi-language pages are planned, add `hreflang` tags and locale-specific sitemap entries. |
| **Medium** | **`lastModified: new Date()` in sitemap** | `sitemap.ts:20,28` | This regenerates the timestamp on every build/request, which sends false freshness signals to crawlers. Use actual content-update dates or static dates. |
| **Low** | **No `alt` text audit on images** | Various components | Only ~23 instances of `alt=` across 15 component files. Audit all `<img>` and Next.js `<Image>` tags for descriptive alt text — critical for image SEO and accessibility. |
| **Low** | **Invitation & enrollment pages not in sitemap** | `sitemap.ts` | `/invitation/learn-more` and `/enroll` are not listed. If these should be indexable, add them. |
| **Low** | **TypeScript build errors ignored** | `next.config.ts` | `ignoreBuildErrors: true` may mask SEO-impacting issues (e.g., missing metadata exports). |

---

## 2. GEO (Generative Engine Optimization) Assessment

### What's Working Well

| Area | Details |
|------|---------|
| **AI crawler access** | `robots.ts` explicitly allows GPTBot, ChatGPT-User, Google-Extended, PerplexityBot, Anthropic, ClaudeBot, and Applebot-Extended. This is ahead of most competitors. |
| **Geo-targeted landing pages** | `/meditation/[location]` with city-specific intro copy, localized keywords, and timezone-aware schedules. Each page generates dynamic metadata, FAQ schema, breadcrumbs, and course schemas. |
| **Rich FAQ content** | Offerings page includes 4 structured FAQs with natural-language Q&A — ideal for AI citation and featured snippets. |
| **Clear entity identity** | Organization schema with `EducationalOrganization` type, consistent brand name ("ROSES OS"), and descriptive copy throughout. AI models can easily identify what the organization does. |
| **Descriptive, natural-language content** | Page descriptions read like answers to user questions (e.g., "A living consciousness ecosystem offering Rose Meditation and Aura Reading courses online"). |

### Issues & Gaps

| Severity | Issue | Recommendation |
|----------|-------|----------------|
| **High** | **No dedicated FAQ page** | Create a standalone `/faq` page aggregating all FAQs across offerings, meditation, and general topics. AI engines heavily cite FAQ pages. |
| **High** | **No "About" structured data** | The `/the-rose` page has `WebPage` + `FAQPage` schemas but no `AboutPage` schema type. Use `@type: "AboutPage"` to strengthen entity understanding. |
| **Medium** | **No author/expert attribution** | Course and content pages don't link to guardian profiles via `author` or `instructor` schema properties. AI engines value E-E-A-T signals (expertise, authoritativeness). Add `Person` schemas for guardians and link them as course instructors. |
| **Medium** | **No blog/article content** | There is no `/blog` or `/articles` section. Long-form, topical content (e.g., "What is aura reading?", "How rose meditation works") provides massive surface area for AI citation and organic search. |
| **Medium** | **Limited keyword diversity** | Keywords are concentrated around "rose meditation" and "aura reading." Consider expanding to adjacent queries: "how to see auras," "chakra meditation for beginners," "clairvoyant development," "spiritual awakening course." |
| **Low** | **No `speakable` schema** | Adding `speakable` structured data to key sections would help voice assistants (Google Assistant, Siri) surface your content in spoken answers. |

---

## 3. UX Navigation Assessment

### What's Working Well

| Area | Details |
|------|---------|
| **Clean information architecture** | 5 top-level nav items (Programs, Community, About, Our Team, Contact) + a prominent "Begin" CTA. Not overwhelming — users can quickly orient. |
| **Centered logo pattern** | Logo is absolutely centered on desktop with nav links left and CTA right — a polished, balanced layout. |
| **Smart scroll behavior** | Nav hides on scroll-down (reducing visual clutter) and reappears on scroll-up. The threshold (`8px`) prevents jittery toggling. |
| **Mobile menu** | Full-screen slide panel from right with staggered animations, focus trap, Escape-to-close, and body scroll lock. Accessible and smooth. |
| **Skip-to-content link** | Present in site layout (`sr-only` → visible on focus). Good accessibility practice. |
| **Active state indicators** | Animated underline (`layoutId="nav-active-underline"`) with spring physics. Nested route matching (`pathname.startsWith(href)`) correctly highlights parent pages. |
| **CTA always visible** | "Begin" / "Get Started" button appears in both desktop and mobile nav, plus a mobile-specific compact version. |
| **Footer as secondary nav** | Full navigation column, contact links (WhatsApp, email, enrollment CTA), trust signals (30+ years, 5000+ initiates, 50+ countries). |
| **Touch targets** | Hamburger button has `min-w-[44px] min-h-[44px]` — meets WCAG 2.5.5 (44x44 minimum). |
| **`aria-current="page"`** | Applied on both header and footer nav for active routes. Screen readers correctly announce the current page. |

### Issues & Gaps

| Severity | Issue | Recommendation |
|----------|-------|----------------|
| **High** | **No breadcrumb UI** | Breadcrumb JSON-LD exists for SEO, but there's no visible breadcrumb component on pages. Users on `/meditation/san-francisco` have no visual trail back to `/meditation`. Add a `<Breadcrumb>` component — helps both UX wayfinding and SEO (Google often displays breadcrumbs in SERPs). |
| **High** | **"Meditation" not in main nav** | `/meditation` is a key content area with geo sub-pages, but it's not a top-level nav item. Users must discover it through the offerings page or direct links. Consider adding it to the nav or making it a dropdown under "Programs." |
| **Medium** | **No dropdown/mega-menu for Programs** | Offerings, meditation, and enrollment are distinct journeys but grouped under a single "Programs" link. A dropdown showing sub-pages would improve discoverability without adding clutter. |
| **Medium** | **Footer "Follow" section is empty** | "Coming soon" placeholder for social links. Either populate it or remove the section — empty sections signal an incomplete site to users. |
| **Medium** | **Nav CTA label inconsistency** | Desktop CTA defaults to "Get Started" in the component (`NavigationProps`) but the site layout overrides it to "Begin." Both `/offerings` and `/invitation` are used as CTA targets. Align on a single label and destination site-wide. |
| **Medium** | **No search functionality** | With geo-specific pages, multiple offerings, and a teaching section, users have no way to search for content. Consider adding a search bar or command palette (especially valuable as content grows). |
| **Low** | **Custom cursor may hinder usability** | `CustomCursor` component replaces the system cursor. This can confuse users, reduce perceived click target areas, and cause issues on touch devices or with assistive technology. Ensure it degrades gracefully. |
| **Low** | **Preloader adds time-to-interactive** | The `Preloader` component delays content display. Ensure it's fast (<1s) and doesn't hurt Core Web Vitals (LCP, FID). |
| **Low** | **No 404 page** | No custom `not-found.tsx` was found. A branded 404 page with navigation links prevents dead-end user journeys and retains visitors. |

---

## 4. Priority Action Items

### Immediate (High Impact)

1. **Create the OG image** (`public/og-image.jpg`, 1200x630) — affects every social share
2. **Add `/meditation` to the main nav** or as a sub-item under Programs
3. **Build a visible breadcrumb component** and render it on all inner pages
4. **Add JSON-LD to the contact page** (WebPage + BreadcrumbList + ContactPoint)
5. **Create a standalone `/faq` page** with aggregated FAQs for GEO citation

### Short-Term (Medium Impact)

6. Add `Person` schemas for guardians and link as course instructors
7. Fix sitemap `lastModified` to use real dates instead of `new Date()`
8. Add a dropdown/sub-nav for the Programs section
9. Populate or remove the empty "Follow" social section in the footer
10. Consider launching a blog for long-form topical content

### Long-Term (Strategic)

11. Implement multi-language support with `hreflang` tags
12. Add site search functionality
13. Expand keyword strategy to adjacent meditation/spiritual queries
14. Add `speakable` schema for voice assistant optimization
15. Audit all images for descriptive alt text

---

*Assessment generated from codebase analysis of the ROSES OS repository.*
