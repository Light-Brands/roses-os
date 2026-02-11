# ROSES OS -- Project Plan for Designer

> Everything the designer needs to understand, reference, and deliver.

---

## 1. PROJECT OVERVIEW

ROSES OS is a spiritual-modern consciousness technology brand. The design work centers on a **unified web platform** -- a single, living digital environment where all ROSES OS content is accessible online and downloadable as PDF. The platform replaces the need for separate standalone decks, fillable PDFs, and disconnected web forms. Everything lives on the web; everything can be taken offline.

**Core concept:** One web platform. All content accessible in-browser. All content downloadable as beautifully formatted PDF.

**Brand philosophy:** "Apple-level minimalism inside a temple." Sacred-tech minimalism -- earthy, grounded, warm, and quiet. Never loud, never busy, never hype-driven.

**Key reference documents (in this repo):**

| Document | Path | What it contains |
|---|---|---|
| Brand DNA (master bible) | `docs/brand/brand-dna.md` | Complete brand identity, visual system, color palette, typography, design book, web guidelines |
| Brand Identity (summary) | `docs/brand/brand-identity.md` | Condensed brand essence, colors, fonts, UI components, sitemap |
| Visual Aid Manual Plan | `docs/plan-mdr.md` | Structure, scope, and brand rules for the Teacher Visual Aid Manual |
| Invitation Presentation | `docs/program/presentation.md` | Full content for the public-facing invitation deck |
| Training Manual | `docs/training/mdr-teachers-training-manual.md` | Teaching content for Levels 1-3 (source material for the visual aid deck) |
| Source Files | `docs/source-materials/` | Original Keynote presentation and brand guideline document |

---

## 2. WHAT NEEDS TO BE DESIGNED

The project is a **single web platform** with distinct sections. Every section is designed web-first and includes a **"Download as PDF"** option that produces a beautifully formatted, print-ready document. No standalone decks or separate fillable PDFs -- the web is the source of truth, and PDFs are an export.

There are **five platform sections**, in priority order:

---

### Section A -- Teacher Visual Aid Manual

**What it is:** A password-protected section of the web platform that teachers access while guiding live sessions. Not a student workbook -- a facilitator's visual companion, accessible in-browser and downloadable as PDF for offline use.

**Access:** Password-protected area (password: 4444). Teachers log in or enter the password to access this section.

**Purpose:**
- Support teachers in explaining energetic concepts clearly
- Provide consistent visual references across all facilitators
- Reduce cognitive load during live teaching
- Accessible on any device during a live session (tablet, laptop, phone)

**Content structure (5 sections, each a page or scroll section on the web):**

1. **Introduction** -- Purpose of Rose Meditation, how to use the manual, teaching posture, safety and consent
2. **Energetic Foundations** -- Grounding Cord, Golden Sun, Earth & Cosmos Circuits, The Rose (roots/stem/bloom), The Aura (7 layers), Roses of Protection
3. **Chakras 1-7** (the core section) -- One consistent layout per chakra, each containing:
   - Name (English + Sanskrit)
   - Body location
   - Color, element
   - Core statement (I AM, I FEEL, I CAN, I LOVE, I SPEAK & I LISTEN, I SEE, I KNOW)
   - Focus, balanced/unbalanced expression, primary blockages
   - Teaching cues
4. **Level-specific teaching flows** -- Level 1 (foundations), Level 2 (sacred space + chakra activation), Level 3 (the Analyzer + advanced perception)
5. **Teaching Agreements** -- Core agreements and sacred use guidelines

**Chakra reference table:**

| # | Chakra | Sanskrit | Statement | Color | Element |
|---|--------|----------|-----------|-------|---------|
| 1 | Root | Muladhara | I AM | Red | Earth |
| 2 | Sacral | Svadhisthana | I FEEL | Orange | Water |
| 3 | Solar Plexus | Manipura | I CAN | Yellow | Fire |
| 4 | Heart | Anahata | I LOVE | Green/Pink | Air |
| 5 | Throat | Vishuddha | I SPEAK & I LISTEN | Light Blue | Ether |
| 6 | Third Eye | Ajna | I SEE | Indigo | Light |
| 7 | Crown | Sahasrara | I KNOW | Violet/White | Consciousness |

**Design rules specific to this section:**
- Non-chakra pages use the warm neutral background (rose clay / peachy neutral)
- Each chakra page uses its correct chakra color as the dominant color
- Harmonize saturation across chakra pages so the section feels cohesive
- Gold accents for headings, dividers, key phrases -- used intentionally, never decoratively
- Some existing Procreate diagrams may need to be digitally redrawn or strengthened
- Illustrations needed: seated meditation posture, grounding cord, golden sun, aura layers, chakra body placements, the rose (roots/stem/bloom), roses of protection, the Analyzer

**PDF download:** A "Download PDF" button at the top of the section exports the entire manual as a formatted, password-protected PDF -- designed for print or offline reference. The PDF should mirror the web layout as closely as possible.

---

### Section B -- The Invitation (Public-Facing)

**What it is:** The outward-facing section of the platform that introduces The Rose and Aura to prospective participants. A threshold, not a sales pitch. Designed as a flowing, scroll-based web experience that can also be downloaded as a presentation-ready PDF.

**Full content is in:** `docs/program/presentation.md`

**Page flow (sections on a single scrolling page or a multi-page flow):**

1. **Title** -- "ROSES OS -- A Seamless Path to Inner Freedom"
2. **The Invitation** -- Einstein quote, the need for new inner tools
3. **Welcome to the Rose** -- What it restores; "When the Rose awakens, Genius awakens"
4. **What the Rose Is** -- Three-point simplicity (awareness, coherence, real choice)
5. **The Two Questions** -- Awareness + coherence
6. **Who This Is For** -- Founders, creators, parents, healers, leaders
7. **You Feel It** -- Poetic quote spread (full-width, presence-oriented)
8. **What You Will Experience** -- The Rose / Aura / Human Journey
9. **What This Journey Awakens** -- Intuition / Leadership / Highest Potential
10. **The Frequency** -- "A frequency you cultivate"
11. **Your Path** -- Option 1 (The Rose), +Aura 1, contribution model table
12. **The Guardians** -- Profiles for Angelina, Diego, Dara, Peggy (photos framed with white border, `#FFFFFF`, 4-6px)
13. **Begin** -- "Start your journey. Welcome home."

**Design rules specific to this section:**
- Generous whitespace -- every section should breathe
- Quote spreads are full-width, silent, centered
- Guardian photos framed with clean white borders for reverent separation from background
- Contribution table should feel inviting, not transactional
- Tone: a quiet invitation, not a sales deck
- On the web, sections can use subtle scroll-triggered transitions (fade-in, parallax) to create a meditative pace

**PDF download:** A "Download PDF" button exports this section as a beautifully formatted presentation-style PDF -- suitable for sharing, screen sharing, or printing. The PDF should read as a cohesive deck (one section per page).

---

### Section C -- Forms (Enrollment, Contribution & Agreements)

**What they are:** Interactive web forms integrated directly into the platform. These are the primary touchpoint where someone transitions from visitor to participant. They must feel like a continuation of the brand experience -- a sacred threshold, not a checkout flow. Completed forms can be downloaded as PDF for personal records.

**Forms needed:**

#### 1. Begin Your Journey (Enrollment)
- Multi-step flow, not a single long page
- Step 1: Who you are (name, email, location)
- Step 2: Your path (program selection with brief descriptions)
- Step 3: Contribution (income tier selection with the brand's invitational language, not price tags)
  - Income tiers: Under $30K / $30K-$70K / Above $70K USD
  - Chosen contribution amount
  - Payment method preference
  - Space for personal note (optional)
- Step 4: Agreements (acknowledgment of core agreements and sacred use)
  - Core agreements: punctuality, confidentiality, co-responsibility, trust, patience, empathy, compassion
  - Sacred use agreement -- material is for initiated students only, not to be shared or used to teach independently
  - Exception acknowledgment (supporting children under care)
- Step 5: Confirmation ("Welcome home." -- warm confirmation with next steps)

#### 2. Contact / Inquiry Form
- Name, email
- Nature of inquiry (dropdown: General, Programs, Guardians, Collaboration)
- Message field
- Simple, minimal -- no CAPTCHA clutter if avoidable

#### 3. Community Interest / Waitlist
- Name, email
- Location / language
- What draws them to the work (optional, open text)
- Used for future programs and regional expansions

**Design rules for forms:**
- Follow all platform UI component specs (pill-shaped buttons, 20px border radius cards, etc.)
- Multi-step forms use a subtle progress indicator -- minimal, not a numbered stepper
- Field styling: warm-toned backgrounds (Golden Ether or Peach Sand), soft borders in Gilded Clay (`#A8896D`)
- Active/focused fields: border shifts to Antique Olive Brass (`#9E956B`)
- Submit buttons: pill-shaped, olive gold, with calm invitational labels ("Continue," "Begin," "Submit with Gratitude")
- Error states: gentle, never alarming -- warm language ("This field needs your attention") with Light Terracotta (`#C4836C`) as the indicator color, not red
- Success states: Rose Clay Mauve confirmation with a breathing moment before redirect
- Mobile-first responsive design -- many participants will access from phones
- Accessibility: WCAG 2.1 AA compliant (contrast ratios, keyboard navigation, screen reader labels)
- No dark patterns, no urgency indicators, no countdown timers

**Contribution tier selection (special component):**
- Three cards side by side (stacked on mobile)
- Each card shows the income range and invitational description from the contribution model
- Selected card gets a subtle Rose Clay Mauve border glow
- No "best value" badges or pricing psychology -- this is devotion, not commerce

**PDF download:** After submission, participants receive a "Download your confirmation" option that generates a branded PDF summary of their enrollment, selected contribution tier, and signed agreements -- a personal record.

---

### Section D -- The Platform Pages (Website)

**What it is:** The public-facing pages of the ROSES OS web platform -- "a threshold, not a marketing site." These pages frame the entire experience and house all other sections.

**Sitemap:**

1. **Home** -- Entry point, brand essence, invitation to explore
2. **The Rose** -- Core technology (Levels 1-3)
3. **The Aura** -- Perception and relationship work
4. **The Journey** -- What participants experience
5. **The Guardians** -- Facilitators and lineage
6. **Begin** -- Enrollment and contribution model (links to Section C forms)
7. **Journal / Library** -- Content and resources (later phase)

**UI component specs:**
- Buttons: pill-shaped, olive gold accent (`#9E956B`), calm and inviting
- Cards: soft stone feel, 20px border radius, subtle tactile presence
- Navigation: minimal, disappearing on scroll, unobtrusive
- Hero sections: full-width, breathing space, centered typography
- Spacing: generous whitespace throughout -- every element has room to breathe

**PDF download:** Key content pages (The Rose, The Aura, The Journey) include a "Download as PDF" option so visitors can take the information with them. The PDF should be a clean, branded document -- not a raw browser print.

---

### Section E -- PDF Export System (Cross-Platform Feature)

**What it is:** A unified PDF export system that works across the entire platform. This is not a separate section visitors see, but a design and development deliverable that ensures every downloadable PDF feels like a first-class ROSES OS artifact.

**Requirements:**
- Every PDF export uses the same branded template: ROSES OS wordmark, Aura White background, consistent margins and typography
- PDFs are formatted for both screen reading and print (A4 / Letter)
- Cormorant Garamond for headers, Inter for body -- matching the web exactly
- Subtle brand texture on each page (clay, linen, or fogged light -- light enough to print cleanly)
- Rose Clay Mauve (`#9C6F6E`) for section headers and dividers
- Antique Olive Brass (`#9E956B`) for accent lines
- Page numbers, section headers in footer
- Teacher Visual Aid Manual PDF is password-protected (password: 4444); all other PDFs are open
- Illustrations and diagrams must render cleanly in both web and PDF formats (SVG preferred)

**PDF types across the platform:**

| Source Section | PDF Type | Access |
|---|---|---|
| Teacher Visual Aid Manual | Full manual export | Password-protected (4444) |
| The Invitation | Presentation-style PDF (one section per page) | Public |
| Forms (post-submission) | Confirmation summary with signed agreements | Per-participant |
| The Rose / The Aura / The Journey | Content page exports | Public |

**Design principle:** The PDF should feel intentional -- not like a printed webpage, but like a designed document that happens to share content with the web. Same information, optimized for the medium.

---

## 3. VISUAL IDENTITY SYSTEM

The designer must follow this system across the entire platform -- web and PDF.

### Color Palette

#### Primary Colors (Warm, Earthy, Gender-Neutral)

| Color | HEX | Role |
|---|---|---|
| **Rose Clay Mauve** | `#9C6F6E` | THE signature color -- field color, not accent. The "human interface layer" of ROSES OS |
| Warm Rose-Clay Brown | `#9B6A66` to `#9E6F6B` | Dusty mauve tones, supporting warmth |
| Light Terracotta | `#C4836C` to `#CB8E7E` | Sun-warmed clay accents, grounding and luminous |

#### Secondary / Neutral Colors

| Color | HEX | Role |
|---|---|---|
| Gilded Clay | `#A8896D` | Warm neutral |
| Honeyed Stone | `#C7AE8C` | Background support |
| Peach Sand | `#EBD6C1` | Light background |
| Golden Ether | `#F5E8E2` | Warm blush background, pairs with gold |
| Aura White | `#F7F5F2` | Primary background |
| Soft Charcoal | `#3F3E3C` | Text, dark elements |

#### Accent

| Color | HEX | Role |
|---|---|---|
| **Antique Olive Brass** | `#9E956B` | Accent, buttons, highlights -- "like gold in a temple" |

**Rules:**
- No bright colors
- No harsh contrasts
- Gold is used intentionally, never decoratively
- Chakra pages are the only exception where vivid color is used (each chakra's true color)

### Typography

| Use | Typeface | Character |
|---|---|---|
| Headlines | **Cormorant Garamond** | Elegant, serif, devotional, timeless |
| Body text | **Inter** | Clean, modern, readable, tech-quiet |

**Hierarchy:** Titles > Subtitles > Body > Callouts -- consistent across web and PDF.

### Texture & Visual Language

- Clay, linen, stone, paper, soft fogged light
- Soft gradients, subtle particle or light textures
- Calm, grounded, sacred-tech feel
- No overly busy visuals
- Centered, calm, devotional layouts

### Imagery Style

- Warm, reverent photography for guardian portraits
- Energetic diagrams: clean, minimal, precise
- Illustrations should feel hand-touched but refined (not clinical, not messy)
- Body/anatomy references should be anatomically grounded but energetically expressive

---

## 4. PRODUCTION PHASES

### Phase 1 -- Foundation & Design System

- [ ] Review all brand documents in this repo
- [ ] Review source Keynote file (`docs/source-materials/Rose + Aura - Invite .key`)
- [ ] Review source brand guideline document (`docs/source-materials/Brand Guideline Guide-compressed.docx`)
- [ ] Finalize color palette application (confirm swatches work together on screen and in print)
- [ ] Lock typography choices and create type scale (web + PDF)
- [ ] Design the web platform's core UI component library:
  - Navigation and global layout
  - Page templates (content page, scroll-based presentation, protected section)
  - Card components, button styles, spacing tokens
  - Form field components (inputs, dropdowns, textareas, checkboxes)
  - Form interaction states (default, hover, focus, error, success)
  - Contribution tier selection component (card-based)
  - PDF download button component
- [ ] Design the branded PDF template system:
  - PDF page layout (margins, headers, footers, page numbers)
  - PDF-optimized typography and color application
  - Background textures for PDF (must print cleanly)
- [ ] Create background textures and visual assets (clay, linen, stone, fogged light)
- [ ] Establish responsive breakpoints (mobile, tablet, desktop)

### Phase 2 -- Platform Pages (Section D)

- [ ] Design Home page -- entry point, brand essence, clear navigation to all sections
- [ ] Design The Rose page -- core technology explained (Levels 1-3)
- [ ] Design The Aura page -- perception and relationship work
- [ ] Design The Journey page -- what participants experience
- [ ] Design The Guardians page -- facilitator profiles with photo framing
- [ ] Design Begin page -- enrollment gateway, links to forms
- [ ] Design mobile responsive versions of all pages
- [ ] Design "Download as PDF" integration for content pages (The Rose, The Aura, The Journey)
- [ ] Verify accessibility (WCAG 2.1 AA)

### Phase 3 -- Teacher Visual Aid Manual (Section A)

- [ ] Design the password-protected entry gate for this section
- [ ] Build Introduction pages (purpose, how to use, teaching posture, safety and consent)
- [ ] Build Energetic Foundations pages (grounding cord, golden sun, earth & cosmos, the rose, the aura, roses of protection)
- [ ] Create or refine illustrations for each energetic concept
- [ ] Build Chakra 1-7 pages (one per chakra, consistent layout)
- [ ] Build Level-specific teaching flow pages
- [ ] Build Teaching Agreements pages
- [ ] Update/digitally strengthen any existing Procreate diagrams
- [ ] Design the PDF export for this section (full manual as password-protected PDF)
- [ ] Review all pages for consistency (layout, color, typography, iconography)
- [ ] Test the section on tablet and mobile (teachers will use these devices during live sessions)

### Phase 4 -- The Invitation (Section B)

- [ ] Build all 13 sections following the content in `docs/program/presentation.md`
- [ ] Design the scrolling web experience with section transitions
- [ ] Design quote spreads (full-width, presence-oriented)
- [ ] Design Guardian profile sections with photo framing
- [ ] Design contribution model table (inviting, not transactional)
- [ ] Design the PDF export for this section (presentation-style, one section per page)
- [ ] Review for brand consistency with the platform and Section A

### Phase 5 -- Forms (Section C)

- [ ] Build Begin Your Journey multi-step enrollment flow (5 steps)
- [ ] Build Contact / Inquiry form
- [ ] Build Community Interest / Waitlist form
- [ ] Design post-submission confirmation pages
- [ ] Design the PDF export for form confirmations (branded summary of enrollment + agreements)
- [ ] Design mobile responsive versions of all forms
- [ ] Verify accessibility (WCAG 2.1 AA)
- [ ] Review for brand consistency with all platform sections

### Phase 6 -- PDF Export System (Section E) & Integration

- [ ] Finalize the branded PDF template across all sections
- [ ] Test PDF exports for: Teacher Visual Aid Manual, The Invitation, form confirmations, content pages
- [ ] Verify PDFs render correctly across readers (browser, Acrobat, Preview)
- [ ] Verify illustrations and diagrams render cleanly in both web and PDF (SVG assets)
- [ ] Test password protection on Teacher Visual Aid Manual PDF
- [ ] End-to-end review: navigate the full platform, download all PDF types, verify brand coherence
- [ ] Internal review with Guardians and facilitators
- [ ] Address feedback and refine

### Phase 7 -- Localization

- [ ] Translate all platform content to Portuguese and Spanish
  - Maintain identical layouts, swap text only
  - Respect linguistic nuance (not literal translation)
- [ ] Verify translated content works in both web and PDF formats
- [ ] Test all forms in translated versions
- [ ] Deliver platform access to teachers and set up credentials

---

## 5. DESIGN PRINCIPLES -- THE NON-NEGOTIABLES

These principles must guide every design decision:

1. **Silence is sacred** -- Whitespace is not empty. It is intentional breathing room.
2. **Warmth over polish** -- The brand should feel like clay, not chrome.
3. **Centered and calm** -- Layouts are devotional, not dynamic. Centered, not asymmetric.
4. **Gold is earned** -- Use `#9E956B` for emphasis, never decoration.
5. **No hype** -- Nothing should feel urgent, loud, or sales-driven. This is an invitation, not a pitch.
6. **Consistency is coherence** -- Same background style, same layout logic, same color rules, same iconography style across every page and PDF.
7. **Texture has meaning** -- Clay, linen, stone, paper evoke earthiness and groundedness. Use them with intention.
8. **The Rose Clay Mauve (`#9C6F6E`) is the brand** -- It is the field, not the accent. It should feel like home.

---

## 6. VOICE & TONE REFERENCE (FOR COPY ON THE PLATFORM)

The designer should understand the language world they are designing for:

- **Simplicity** -- Clear, unadorned
- **Reverence** -- Sacred without being religious
- **Clarity** -- Precise, never vague
- **Spaciousness** -- Room to breathe in every message
- **Calm authority** -- Grounded, never forceful

**Key phrases that appear across materials:**
- "The Operating System of Remembrance"
- "When the Rose awakens, Genius awakens"
- "Not techniques, but instruments of consciousness"
- "You are the mountain, not the summit"
- "This is not learning. This is remembering."
- "Welcome home."

---

## 7. FILE DELIVERY EXPECTATIONS

| Deliverable | Format | Notes |
|---|---|---|
| Web Platform Design | Figma (or equivalent) | Complete component library, page designs, responsive breakpoints, interaction states, design tokens, developer-ready specs |
| PDF Template System | Figma (or equivalent) + sample PDF exports | Branded PDF template with typography, margins, headers/footers. Sample exports for each PDF type |
| Teacher Visual Aid Manual | Web section design + PDF export design | Password-protected PDF export (4444). Web section must work on tablet during live sessions |
| The Invitation | Web section design + PDF export design | PDF optimized for screen sharing (one section per page) |
| Forms | Web form designs | Multi-step enrollment flow, contact, waitlist. All interaction states. Post-submission PDF confirmation design |
| Platform Pages | Web page designs | All 7 sitemap pages, responsive, with PDF download integration for content pages |
| Assets | SVG/PNG | All illustrations, icons, textures exported as reusable assets. SVG preferred for cross-medium rendering (web + PDF) |

---

## 8. LANGUAGE VERSIONS REQUIRED

**Phase 1 languages:**
1. English (primary)
2. Portuguese (secondary)
3. Spanish

All platform content and PDF exports must support all three languages with identical layouts and text-only swaps. The web platform should support language switching (via navigation or URL path). PDF exports should generate in the user's selected language. Translations should respect linguistic nuance -- not be literal word-for-word translations.

---

## 9. STRATEGIC CONTEXT

This work is more than design production. The web platform is a unified digital home for ROSES OS that demonstrates:

- Design coherence across every touchpoint
- Educational clarity for teachers and participants
- Energetic intelligence embedded in every interaction
- Platform readiness for future growth (app, additional programs, regional expansion)

The web-first approach means content is always current, always accessible, and always shareable -- while PDF downloads ensure nothing is lost when someone is offline, in a session, or wants a personal record. One source of truth, two mediums.

It shows: *"This is how we think, teach, and build."*

The designer is building the visual foundation for an entire ecosystem. Every decision made now carries forward.
