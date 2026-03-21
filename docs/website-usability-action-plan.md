# Website Usability Action Plan

> **STATUS: IMPLEMENTED** — All 6 phases complete. 9 of 10 usability issues resolved. See commit history on `claude/review-website-usability-4AlDb`.

**Decisions made:**
- Navigation labels → **Clearer labels** (Programs, About, Our Team) — page titles keep brand language
- Enrollment flow → **Keep contact-only**, merged /enroll + /contribute into single 3-step page
- Main CTA → **Points to /offerings** (let people browse programs first)
- Footer → **Multi-column layout** with trust signals, contact, social placeholders
- Mobile performance → **Deferred** (not in current scope)
- Sacred symbol GEO content → **Added** (rose as oldest spiritual symbol + 2 FAQs + SEO keywords)

---

## Phase 1: Fix the Enrollment Flow

**Issues addressed:** #2 (broken enroll flow), #10 (contact vs enroll confusion)

**Problem:** `/enroll` is just WhatsApp/email contact info. `/contribute` has a FormStepper showing "Step 1: Enroll, Step 2: Contribute" — implying the user completed a form in step 1, but they didn't. `/contact` shows the exact same WhatsApp/email info.

### Tasks

- [ ] **1a. Merge `/enroll` and `/contribute` into one page at `/enroll`**
  - File: `src/app/(forms)/enroll/page.tsx`
  - Combine agreements, WhatsApp/email contact, and contribution tiers into a single cohesive page
  - Use `FormStepper` with clear labels: "Review Agreements → Contact Dara → Choose Contribution"
  - Pull `ContributionForm` and `contributionTiers` into this page

- [ ] **1b. Remove or redirect `/contribute`**
  - File: `src/app/(forms)/contribute/page.tsx`
  - Either delete the route or add a redirect to `/enroll`

- [ ] **1c. Reframe `/contact` as "General Inquiries"**
  - File: `src/app/(site)/contact/ContactClient.tsx`
  - Change heading from "Reach Out" to "General Inquiries"
  - Add note: "Looking to enroll? Visit our enrollment page" with link to `/enroll`
  - Keep WhatsApp/email but frame as for questions, partnerships, press inquiries

**Files:**
- `src/app/(forms)/enroll/page.tsx` — rebuild
- `src/app/(forms)/contribute/page.tsx` — delete or redirect
- `src/app/(site)/contact/ContactClient.tsx` — reframe
- `src/components/forms/FormStepper.tsx` — update step labels

---

## Phase 2: Simplify the Entry Journey + Fix Nav Labels

**Issues addressed:** #1 (entry journey), #5 (nav labels)

**Problem:** Home "Begin" → `/invitation` → "Learn More" → eventually "Enroll" — that's 3-4 pages before any action. Nav uses insider language.

### Tasks

- [ ] **2a. Update navigation labels and CTA**
  - File: `src/lib/data/mock-data.ts`
  - Change `navItems`:
    ```
    "Offerings"  → "Programs"
    "The Rose"   → "About"
    "Guardians"  → "Our Team"
    "Community"  → keep
    "Contact"    → keep
    ```
  - Footer updates automatically (uses same `navItems`)

- [ ] **2b. Change CTA button to point to /offerings**
  - File: `src/components/ui/Navigation.tsx`
  - Change default CTA from `{ label: 'Begin', href: '/invitation' }` to `{ label: 'Get Started', href: '/offerings' }`

- [ ] **2c. Update Home page CTAs**
  - File: `src/app/(site)/HomeClient.tsx`
  - Hero primary CTA: "Begin Your Journey" → link to `/offerings` (not `/invitation`)
  - Hero secondary CTA: "Explore The Rose" → link to `/the-rose` — keep
  - Bottom CTA: "Enter the Rose Field" → link to `/offerings`

- [ ] **2d. Update Invitation page CTAs**
  - File: `src/app/(invitation)/invitation/page.tsx`
  - Final CTA should point to `/enroll` directly (not `/invitation/learn-more`)
  - `/invitation` becomes an optional page for people who received a direct invite, not the main funnel

---

## Phase 3: Reduce Content Overlap

**Issues addressed:** #3 (content overlap), #9 (consolidated About)

**Problem:** Home, Invitation, and The Rose all explain "what is International Aura School." Visitors read the same thing 3 times.

### Tasks

- [ ] **3a. Trim the Home page — give it a distinct job: Hook + Social Proof + CTA**
  - File: `src/app/(site)/HomeClient.tsx`
  - Keep: Hero, Pillars/Architecture, Who It's For, Stats counters, final CTA
  - Remove or shorten: "Core Questions" / "Two Questions" section (duplicates The Rose)
  - Shorten: "Brand Essence" to 2-3 sentences, add "Learn more" link to About (The Rose)

- [ ] **3b. Trim the Invitation page — give it a distinct job: Personal Welcome + Direct CTA**
  - File: `src/app/(invitation)/invitation/page.tsx`
  - Remove or replace `ProgramsSection` with a one-line "See our programs" link to `/offerings`
  - Remove or shrink `GuardiansLink` to a brief mention
  - Keep: Hero welcome animation, brief "what this is" text, CTA to enroll

- [ ] **3c. Keep The Rose page as the deep-dive — add "Our Story" section**
  - File: `src/app/(site)/the-rose/TheRoseClient.tsx`
  - This page already serves as the full philosophy explanation — keep all content
  - Add a brief "Our Story" or lineage section if not already there (avoids needing a separate `/about` route)
  - Link to "Our Team" (Guardians) from this page

---

## Phase 4: Simplify the Offerings Page

**Issue addressed:** #4 (overloaded offerings page)

**Problem:** Programs + schedules + timezone selectors + contribution tiers + FAQ all stacked on one 709-line page.

### Tasks

- [ ] **4a. Add anchor-based tab navigation at the top**
  - File: `src/app/(site)/offerings/OfferingsClient.tsx`
  - Add a sticky tab bar near the top: "Programs" | "Schedule" | "Contribution" | "FAQ"
  - Use smooth scroll to section on click (no separate routes needed)
  - Highlight active tab based on scroll position

- [ ] **4b. Collapse contribution tiers by default**
  - File: `src/app/(site)/offerings/OfferingsClient.tsx`
  - Move contribution info to its own section (instead of expanding inside each program card)
  - Or: link to `/enroll` where contribution now lives after Phase 1
  - This removes ~30% of per-card content

- [ ] **4c. Collapse schedule tables by default**
  - File: `src/app/(site)/offerings/OfferingsClient.tsx`
  - Show a summary line per program (e.g., "Tuesdays & Thursdays, starting April 2026")
  - Add a "View full schedule" expand/toggle
  - Keep timezone selector for when expanded

- [ ] **4d. Add "Enroll" buttons on program cards**
  - Each program card should have a clear CTA → `/enroll`
  - Makes the path: Home → Programs → pick one → Enroll (2-3 clicks)

---

## Phase 5: Mobile Performance

**Issue addressed:** #6 (heavy 3D + animations on mobile)

**Problem:** Home page loads a 1.3MB GLB 3D model, Three.js canvas, GSAP particle field, and 7+ animated sections. Could lag on mid-range phones.

### Tasks

- [ ] **5a. Disable 3D rose on mobile — show static image instead**
  - File: `src/components/three/HeroSphere.tsx`
  - Add a viewport width check (`< 768px` or `< 1024px`)
  - Show a pre-rendered static rose image (WebP) on mobile instead of Three.js canvas
  - Existing `prefersReducedMotion` pattern can be extended for this
  - **Designer task:** Take a screenshot of the 3D rose at a nice angle and save as `/public/images/rose-static.webp`

- [ ] **5b. Disable ConsciousnessField (floating petals) on mobile**
  - File: `src/components/three/ConsciousnessField.tsx`
  - Already skips when `prefersReducedMotion` is true — add the same `< 768px` check
  - Saves GSAP + DOM overhead for 20 floating elements

- [ ] **5c. Make mobile CTA more prominent**
  - File: `src/app/(site)/HomeClient.tsx`
  - On mobile, the CTA may be below the fold after the hero. Options:
    - Move CTA buttons above the 3D element on small screens
    - Or add a sticky "Get Started" bar at the bottom on mobile

---

## Phase 6: Enrich the Footer

**Issue addressed:** #7 (sparse footer)

**Problem:** Footer only has nav links and copyright. Missing contact info, trust signals, and social proof.

### Tasks

- [ ] **6a. Redesign footer as multi-column layout**
  - File: `src/components/ui/Footer.tsx`
  - **Column 1:** Logo + tagline ("A living operating system for spiritual development")
  - **Column 2:** Navigation links (already present, will update with new labels)
  - **Column 3:** Contact info (WhatsApp, email) + link to `/enroll`
  - **Column 4:** Social links (placeholder icons — fill in URLs later)
  - **Bottom bar:** Copyright + "For Teachers" link

- [ ] **6b. Add trust signals**
  - Reuse stats from Home page: "30+ Years", "5,000+ Initiates", "50+ Countries"
  - Or add a brief testimonial quote
  - Data already exists in `src/lib/data/mock-data.ts` (stats array)

---

## Phase 7: Teaching Section Context

**Issue addressed:** #8 (password gate has no context)

**Problem:** Teaching is only in footer. Password gate shows no explanation for visitors who stumble onto it.

### Tasks

- [ ] **7a. Add explanatory text to password gate**
  - File: `src/components/teaching/PasswordGate.tsx`
  - Add text below the PIN input: "This area is for enrolled practitioners. Your access code is provided when you enroll."
  - Add a link: "Not enrolled yet? Start here →" pointing to `/enroll`

- [ ] **7b. Keep Teaching out of main nav** (intentional for practitioners only)
  - The footer placement is deliberate — no change needed to nav

---

## Implementation Order

| Priority | Phase | Effort | Impact |
|----------|-------|--------|--------|
| 1st | **Phase 2** — Nav labels + CTA | Small (data file changes) | High — immediate clarity |
| 2nd | **Phase 1** — Enrollment flow | Medium (merge 2 pages) | High — fixes broken UX |
| 3rd | **Phase 4** — Offerings tabs | Medium (UI refactor) | High — reduces overwhelm |
| 4th | **Phase 5** — Mobile performance | Medium (conditional rendering) | High — faster mobile |
| 5th | **Phase 3** — Content overlap | Medium-Large (content editing) | Medium — cleaner story |
| 6th | **Phase 6** — Footer | Small-Medium (layout) | Medium — professionalism |
| 7th | **Phase 7** — Teaching context | Small (text addition) | Low — edge case |

---

## Verification Checklist

After implementation, test these flows:

- [ ] **New visitor:** Home → "Get Started" → Programs → pick one → Enroll → see agreements + contact + contribute
- [ ] **Curious visitor:** Home → "About" (The Rose) → deep philosophy → Enroll
- [ ] **Direct invite:** `/invitation` → welcome → Enroll (skips browsing)
- [ ] **Mobile:** Home loads fast (no 3D), CTA visible above fold, scroll is smooth
- [ ] **Contact vs Enroll:** `/contact` clearly says "general inquiries", links to `/enroll`
- [ ] **Teaching:** Footer → "For Teachers" → password gate shows explanation + enroll link
- [ ] **No dead ends:** Every page has a clear next step (CTA to programs or enroll)
- [ ] **No content repetition:** Home, About, and Invitation each tell a different part of the story

---

## Files Summary

| File | Phase | Change |
|------|-------|--------|
| `src/lib/data/mock-data.ts` | 2 | Update nav labels + CTA |
| `src/components/ui/Navigation.tsx` | 2 | Verify CTA href update |
| `src/app/(forms)/enroll/page.tsx` | 1 | Merge enroll + contribute |
| `src/app/(forms)/contribute/page.tsx` | 1 | Delete or redirect |
| `src/app/(site)/contact/ContactClient.tsx` | 1 | Reframe as general inquiries |
| `src/components/forms/FormStepper.tsx` | 1 | Update step labels |
| `src/app/(site)/HomeClient.tsx` | 2, 3, 5 | Update CTAs, trim content, mobile CTA |
| `src/app/(site)/offerings/OfferingsClient.tsx` | 4 | Add tabs, collapse sections, add enroll buttons |
| `src/app/(invitation)/invitation/page.tsx` | 2, 3 | Update CTAs, trim programs/guardians |
| `src/app/(site)/the-rose/TheRoseClient.tsx` | 3 | Add "Our Story" section |
| `src/components/three/HeroSphere.tsx` | 5 | Mobile fallback to static image |
| `src/components/three/ConsciousnessField.tsx` | 5 | Mobile skip |
| `src/components/ui/Footer.tsx` | 6 | Multi-column layout + trust signals |
| `src/components/teaching/PasswordGate.tsx` | 7 | Add explanatory text |

---

## Related Documents

| Document | Path |
|----------|------|
| Usability Review (issues list) | [`docs/project-plan-for-designer-action-steps.md`](project-plan-for-designer-action-steps.md) |
| Master Design Brief | [`docs/project-plan-for-designer.md`](project-plan-for-designer.md) |
| Brand Book | [`docs/project-plan-for-designer-brand-book.md`](project-plan-for-designer-brand-book.md) |
