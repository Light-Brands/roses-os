# MDR Teacher's Resource Manual -- Designer Plan

> Design brief for the Teacher Visual Aid Manual -- the facilitator's companion for teaching Rose Meditation.
>
> **Updated March 2026** -- Image inventory aligned with live site filenames (slides 1-44). All images match `src/lib/data/teaching-slides.ts`. Includes complete image inventory, full teaching text for each slide, and integration plan for the website's `/teaching` section.

---

## At a Glance

| Item | Detail |
|------|--------|
| **What** | A password-protected teacher's resource manual for guiding live Rose Meditation sessions |
| **Where** | rosesos.com/teaching (behind PIN gate, password: 4444) with "For Teachers" link in the site footer |
| **Format** | Web-first presentation optimized for tablet/laptop, with PDF download for printing or offline use |
| **Content** | Levels 1--3 of Rose Meditation: energetic foundations, chakra system, advanced perception |
| **Source material** | `docs/training/mdr-teachers-training-manual.md` (complete teaching text and visual descriptions) |
| **Source plan** | `docs/source-materials/plan-mdr.md` (original MDR content plan and brand guidelines) |
| **Original visuals PDF** | `docs/source-materials/MDR - VISUAL SUPPORT - FEB2024.pdf` (the original 46-page visual presentation) |
| **Original images** | `public/rose med images/` -- files with "original" in the name (hand-drawn tradition illustrations) |
| **Reimagined images** | `public/rose med images/` -- files without "original" in the name (modernized versions) |
| **Brand tone** | Sacred-tech minimalism -- earthy, grounded, warm, quiet. Never busy, never loud. |
| **Languages** | English (primary), Portuguese, Spanish, Greek -- identical layouts, text-only swaps per language |
| **Priority** | This is the current deliverable. Everything else comes later. |

---

## 1. PURPOSE

This manual is a facilitator's visual companion -- not a student workbook. Teachers access it on a tablet or laptop during live sessions to support clear, consistent teaching of energetic concepts across all facilitators.

**Goals:**

- Support teachers in explaining energetic concepts clearly
- Provide consistent visual references across all facilitators
- Reduce cognitive load during live teaching
- Accessible on any device during a live session (tablet preferred, laptop secondary)

### Scope

**Included:**

- **Level 1:** Foundational energetic awareness
- **Level 2:** Chakra activation & regulation
- **Level 3:** Energetic coherence, flow, and integration

**Not included:**

- Full advanced Rose Meditation
- Aura reading initiation practices
- Advanced diagnostics or perception training

*(These are reserved for initiated students only)*

---

## 2. PLATFORM PLACEMENT

The manual lives on the ROSES OS website at `/teaching`, protected by a 4-digit PIN gate (password: 4444).

- A **"For Teachers"** link appears in the site footer navigation bar
- The link leads to `/teaching`, which triggers the password gate
- Once authenticated (session-based), teachers access the manual content
- A **"Download PDF"** button at the top of the section exports the entire manual as a formatted PDF for print or offline reference

**Device priority:** Tablet and laptop first. Phone is tertiary -- this is a teaching tool, not a consumer product.

### Current Website Structure

The teaching section already exists on the website with this structure:

| Route | Purpose |
|-------|---------|
| `/teaching` | Landing page -- level selector (behind password gate) |
| `/teaching/level-1` | Level 1: Foundation -- techniques + chakra chart |
| `/teaching/level-2` | Level 2: Deepening -- techniques + chakra chart |
| `/teaching/level-3` | Level 3: Teaching -- techniques + chakra chart |

**What needs to change:** The current pages show generic technique cards and a chakra accordion chart. The designer's work will replace this with the full visual aid manual -- illustration-rich slides with the teaching text below, organized as a scrollable presentation per level. Each "slide" combines an image (original or reimagined) with the corresponding teaching words.

---

## 3. IMAGE INVENTORY -- ORIGINALS & REIMAGINED

All images live in `public/rose med images/`. The designer has **two versions** for nearly every teaching concept:

1. **Original images** -- Hand-drawn stick-and-line illustrations from the tradition, marked with "original" in the filename. These are the most accurate depictions of the energetic structures. They are the **source of truth** for what should be shown. **New designs must reflect what the originals depict** -- the energetic structures, placements, and relationships shown in the originals are what is real and must be preserved.
2. **Reimagined images** -- Modernized, elevated versions that honor the originals while bringing them into the ROSES OS brand language. These are the larger PNG files without "original" in the filename. The reimagined images are there for **feel** -- they show the target for clothing, design style, and overall aesthetic direction. They are not the accuracy reference.

**The designer should use both sets.** The originals define *what* to show. The reimagined versions define *how it should feel*. The new designs must always honor the connection between old and new -- paying homage to the original tradition while elevating it into the modern brand language. Where a reimagined image exists, use it as inspiration for feel, clothing, and design style. The original should remain accessible as a supplementary reference that teachers may prefer for accuracy.

**Representation matters.** All new imagery must include both male and female figures and represent a wide variety of types of people, nationalities, and ethnicities -- not just white people. The figures should reflect the whole world. The designer is encouraged to create their own diverse examples and interpretations -- the reimagined images are there as **inspiration**, not as exact templates. Each figure should feel fresh and unique. Use the reimagined images as a starting point for feel and aesthetic direction, then bring your own vision to the diversity of people represented.

### Complete Image-to-Concept Mapping

Below is the **complete inventory** of every image used on the site, organized by slide number and teaching concept. All filenames match the live site at `rosesos.com/teaching` (defined in `src/lib/data/teaching-slides.ts`). All image files live in `public/rose med images/`.

#### Level 1 -- Foundational Practices (Slides 1-18)

| Slide | Concept | Reimagined Image | Original Image |
|-------|---------|-----------------|---------------|
| 1 | **The Rose** -- Foundational symbol and energetic tool. Roots, stem, bloom. | `level-1/01-the-rose.PNG` | -- |
| 2 | **Meditation Posture** -- Seated upright, feet flat, hands on knees, eyes closed. | `level-1/02-meditation-posture.PNG` | -- |
| 3 | **Grounding Cord** -- Energy connection from base of spine into the center of the Earth. | `level-1/03-grounding-cord.jpeg` | -- |
| 4 | **Golden Sun** -- Radiant golden sun above the head, restoring personal life-force energy. | `level-1/04-golden-sun.png` | -- |
| 5 | **Aura Exercise** -- Golden silhouette surrounded by concentric layers of glowing energy. | `level-1/05-aura-exercise.PNG` | `level-1/05-auraexercise-original.PNG` |
| 6 | **Expansion of Grounding Cord** -- Grounding cord expands with the aura, anchoring the entire energy field into the Earth. | `level-1/06-expansion-grounding-cord.jpeg` | `level-1/06-grounding-cord-expansion-original.PNG` |
| 7 | **Golden Sun Fills You** -- Golden sun above the crown pours golden light down, filling the entire aura and body. | `level-1/07-golden-sun-fills.png` | `level-1/07-expansion-fill-with-golden-sun-original.PNG` |
| 8 | **Earth Circuit** -- Energy rising through feet and legs into the body. | `level-1/08-earth-energy.PNG` | -- |
| 9 | **Cosmos Circuit** -- Cosmic energy descending through the crown into the body. | `level-1/09-cosmos-circuit.jpeg` | `level-1/09-cosmos-original.PNG` |
| 10 | **Combined Earth + Cosmos Circuit** -- Both flows active simultaneously through the body. | `level-1/10-cosmosearth.PNG` | -- |
| 11 | **The Rose (as Energetic Tool)** -- Roots, stem, bloom in detail. Functions: place, move, open, close, release. | `level-1/11-therosegold.PNG` | `level-1/11-therosegold.PNG` |
| 12 | **Roses of Protection, Observation, and Separation** -- Roses at the edges of the aura as energetic sentinels. | `level-1/12-four-roses.PNG` | `level-1/12-four-roses-original.PNG` |
| 13 | **Cleansing Rose** -- Rose outside the aura absorbing and transmuting foreign energy. | `level-1/13-cleansing-rose-reimagined.png` | `level-1/13-cleansing-rose.PNG` |
| 14 | **Energy Recovery** -- Rose gathering and returning life-force energy to each chakra. | `level-1/14-energy-recovery-background.jpeg` | `level-1/14-recovery-rose-original.PNG` |
| 15 | **Pink Rose Closure** -- Gift of well-being at the end of meditation. | `level-1/15-pink-rose-closure.png` | -- |
| 16 | **Discharge Excess Energy** -- Leaning forward, energy flowing from hands into the earth. | `level-1/16-discharge-excess.PNG` | `level-1/16-discharge-energy-original.PNG` |
| 17 | **Sacred Space** -- Creating your own internal energetic environment for meditation. | `level-1/17-sacred-space.png` | -- |
| 18 | **The 6th and 7th Chakras (Sacred Space)** -- Locations of the upper chakras for Level 2 work. | `level-1/18-sacred-space.PNG` | `level-1/18-sacredspace-original.jpg` |

#### Level 2 -- Sacred Space & Chakra Activation (Slides 19-38)

All files in `public/rose med images/level-2/`.

| Slide | Concept | Reimagined Image | Original Image |
|-------|---------|-----------------|---------------|
| 19 | **Prepare Your Physical Space** -- Physical environment preparation for meditation. | `level-2/19-physical-space.png` | -- |
| 20 | **Protection of the Space** -- Golden roses at corners connected by golden lines forming a sacred grid. | `level-2/20-create-the-room.jpg` | -- |
| 21 | **Cleansing of the Space** -- Large rose above the grid pouring golden energy downward. | `level-2/21-cleanse-the-space.jpg` | -- |
| 22 | **Owning Your Space** -- Person radiating energy from within, filling the grid with their own light. | `level-2/22-owning-space.jpg` | `level-2/22-protect-the-space-original.PNG` |
| 23 | **Let's Talk About Chakras** -- Introduction to the chakra system. | `level-2/23-chakras-intro.jpeg` | -- |
| 24 | **The Seven Chakras (body map)** -- Figures with color-coded chakra points on the body. | `level-2/24-chakras.png` | -- |
| 25 | **Root Chakra** -- Body illustration emphasizing root location, dominant red. | `level-2/25-root-chakra.png` | -- |
| 26 | **Sacral Chakra** -- Body illustration emphasizing sacral location, dominant orange. | `level-2/26-sacral-chakra.png` | -- |
| 27 | **Solar Plexus Chakra** -- Body illustration emphasizing solar plexus location, dominant yellow. | `level-2/27-solar-plexus-chakra.png` | -- |
| 28 | **Heart Chakra** -- Body illustration emphasizing heart location, dominant green/pink. | `level-2/28-heart-chakra.png` | -- |
| 29 | **Throat Chakra** -- Body illustration emphasizing throat location, dominant light blue. | `level-2/29-throat-chakra.png` | -- |
| 30 | **Third Eye Chakra** -- Body illustration emphasizing third eye location, dominant indigo. | `level-2/30-third-eye-chakra.jpeg` | -- |
| 31 | **Crown Chakra** -- Body illustration emphasizing crown location, dominant violet/white. | `level-2/31-crown-chakra.png` | -- |
| 32 | **Cleansing Each Aura Layer** -- Seven distinct color-coded aura layers. | `level-2/32-cleansing-each-layer.PNG` | -- |
| 33 | **Cleansing Each Chakra** -- Roses on either side for past and present dynamics. | `level-2/33-cleansing-each-chakra.PNG` | -- |
| 34 | **Energy Recovery (Level 2)** -- Rose gathering energy back to each chakra at a deeper level. | `level-2/34-energy-recovery.jpeg` | -- |
| 35 | **Golden Sticky Roses -- Phase 1** -- Roses placed on each of the seven chakra points. | `level-2/35-golden-sticky-1.jpg` | -- |
| 36 | **Golden Sticky Roses -- Phase 2** -- Roses at all major joints and extremities. | `level-2/36-golden-sticky-2.jpg` | -- |
| 37 | **Golden Sticky Roses -- Phase 3** -- Full body coverage with golden roses. | `level-2/37-golden-sticky-3.jpg` | -- |
| 38 | **Golden Sticky Roses -- Phase 4** -- Integration: large golden rose above, golden light cascading through body. | `level-2/38-golden-sticky-4.jpg` | -- |

#### Level 3 -- Advanced Perception (Slides 39-44)

All files in `public/rose med images/level-3/`.

| Slide | Concept | Reimagined Image | Original Image |
|-------|---------|-----------------|---------------|
| 39 | **The Analyzer** -- Energetic point at the back of the head (occipital ridge) for deeper perception. | `level-3/39-analyzer.PNG` | -- |
| 40 | **The Analyzer & Sacred Space** -- Combined reference showing the Analyzer in relation to the sacred space. | `level-3/40-analyzer-and-sacred-space.png` | -- |
| 41 | **Stick of Agreements (Breaking Spiritual Agreements)** -- Visualizing the agreement as a stick, breaking it into three pieces, placing them in a grounded rose, and exploding the rose outside the aura. | `level-3/41-stick-of-agreements.png` | -- |
| 42 | **Cutting Cords** -- Cutting energetic cords from the 7th cervical vertebra down to the 1st chakra using the dominant hand. | `level-3/42-cutting-cords.png` | -- |
| 43 | **Post Intimacy / Sexual Recovery Rose** -- Using orange roses to return the other person's energy and recover your own after sexual intercourse. | `level-3/43-sexual-recovery-rose.png` | -- |
| 44 | **Mock Up** -- Reality creation technique using three grounded roses: manifestation, cleansing, and love. Done for 7 consecutive days. | `level-3/44-mock-up.png` | -- |

### Coverage Summary

All 44 teaching slides have images on the site. Every image file is in `public/rose med images/` organized by level.

| Category | Total Slides | Have Reimagined |
|----------|-------------|----------------|
| Level 1: Foundations (slides 1-18) | 18 | 18 |
| Level 2: Sacred Space & Chakras (slides 19-38) | 20 | 20 |
| Level 3: Advanced Perception (slides 39-44) | 6 | 6 |
| **Total** | **44** | **44** |

---

## 4. COMPLETE TEACHING TEXT (THE WORDS)

Below is the complete teaching text that accompanies each image/slide in the manual. This is the content that appears alongside or below each illustration on the website's `/teaching` pages.

**Source:** `docs/training/mdr-teachers-training-manual.md`

> **Important:** All "Designer Notes" throughout this section are internal guidance for the designer only. Once the designer has completed the work for a given slide, the corresponding designer notes should be **removed from the slide deck / final deliverable** -- they should **not** appear in the finished product. The notes should remain here in this `.md` file as a permanent reference, but the final slides and website pages must contain only the teaching text and imagery.

---

### Opening -- Agreements and Virtues

> Before beginning, all participants honor these agreements:
>
> - **Punctuality**
> - **Confidentiality**
> - **Co-responsibility**
> - **Trust**
> - **Patience, Empathy and Compassion**

---

### Opening -- It's Important to Know

> You will receive the manual in PDF. These teachings are part of a living energetic lineage revealed through direct practice and transmission.
>
> **Please keep in mind:**
> - You should not attempt to teach the Rose Meditation (only to your children under 14 years old).
> - If you would like to become a Rose Meditation Facilitator, it is necessary to follow a training path through Aura Reading.
> - The Rose Meditation cannot be applied to other people.

---

### Opening -- History

> Aura Reading emerged in the 1960s, in California, channeled by a North American called **Lewis S. Bostwick**. Founder of the **Berkeley Psychic Institute** and the **Church of the Divine Man**, he channeled and systematized the techniques and tools sent by the angels, to assist in the process of evolution of humanity.
>
> **Lineage:** Berkeley Psychic Institute → Anastasia Plunk → Angelina Ataide → ROSES OS

---

### LEVEL 1

---

#### Slide 1: The Rose
**Reimagined:** `level-1/01-the-rose.PNG`

> The Rose is the foundational symbol and tool of this practice -- a living energetic instrument used throughout all levels of the work.

---

#### Slide 2: Posture
**Reimagined:** `level-1/02-meditation-posture.PNG`

> Proper meditation posture is seated upright in a chair. Feet are flat on the floor, hands resting gently on the thighs or knees, spine upright, eyes closed. The body is relaxed yet alert -- grounded and receptive.

---

#### Slide 3: Grounding Cord
**Reimagined:** `level-1/03-grounding-cord.jpeg` | **Note:** The original grounding cord (see slide 6 original: `level-1/06-grounding-cord-expansion-original.PNG`) is more accurate than the reimagined version. New designs should reflect the original's depiction.

> The grounding cord is an energetic connection that extends from the base of the spine (first chakra) downward into the center of the Earth. It anchors your energy body to the planet, providing stability, safety, and a channel for releasing unwanted energy.

**Designer Notes:**
- The grounding cord should be **more opaque and transparent** -- thick and strong, not thin or wispy
- It should be **less gold** than the current reimagined version -- refer to the original images for the correct visual tone
- The cord conveys stability and weight; the visual should feel solid, grounded, and substantial

---

#### Slide 4: Golden Sun
**Reimagined:** `level-1/04-golden-sun.png`

> The Golden Sun is a tool for replenishing and restoring your own energy. Visualize a radiant golden sun above your head. It calls back your own life-force energy from wherever you may have left it -- in people, places, situations, or time. It fills you with your own highest vibration.

**Designer Notes:**
- The grounding cord in this image should be **thick, transparent, and strong**
- It should **start lower in the body, under the crotch** — the grounding cord comes from the base of the spine (1st chakra), not from higher up
- Same visual direction as slides 3 and 6: less gold, more opaque/translucent, substantial

---

#### Slide 5: An Exercise to Feel Your Aura
**Original:** `level-1/05-auraexercise-original.PNG` | **Reimagined:** `level-1/05-aura-exercise.PNG`

> The aura is the energetic field that surrounds your physical body. This exercise helps you become aware of its presence, its edges, and its quality. The aura consists of multiple layers radiating outward from the body.

---

#### Slide 6: Expansion of Grounding Cord
**Original:** `level-1/06-grounding-cord-expansion-original.PNG` | **Reimagined:** `level-1/06-expansion-grounding-cord.jpeg`

> Once you are aware of your aura, the grounding cord practice deepens. You ground not only the physical body but also the aura itself -- allowing the entire energy field to anchor into the Earth.

**Designer Notes:**
- Same grounding cord visual direction as slide 3: **more opaque and transparent, thick and strong, less gold**
- The expanded grounding cord should feel even more substantial as it now anchors the entire aura

---

#### Slide 7: Golden Sun Fills You
**Original:** `level-1/07-expansion-fill-with-golden-sun-original.PNG` | **Reimagined:** `level-1/07-golden-sun-fills.png`

> The Golden Sun above the crown pours golden light downward, filling the entire aura and body with your own highest vibration. This completes the full energetic architecture: posture, aura, grounding cord, and golden sun -- all active together.

**Designer Notes:**
- The **expanded grounding cord** should also be represented in this image -- it is part of the full energetic architecture (posture + aura + grounding cord + golden sun)
- Same visual direction: **thick, transparent, strong, less gold**
- **Image repetition issue:** The current reimagined image uses the same human figure as slide 7 -- please use a **different human man** for this slide so the two slides are visually distinct

---

#### Slide 8: Circuit of the Energy of the Earth
**Reimagined:** `level-1/08-earth-energy.PNG`

> The Earth circuit is an energetic pathway that draws the energy of the Earth upward through the feet, rising through the legs and into the body. This circuit connects you to the grounding, nourishing, stabilizing force of the planet.

---

#### Slide 9: Circuit of the Energy of the Cosmos
**Original:** `level-1/09-cosmos-original.PNG` | **Reimagined:** `level-1/09-cosmos-circuit.jpeg`

> The Cosmic circuit is an energetic pathway that draws cosmic energy downward through the crown of the head (7th chakra) and into the body. This circuit connects you to the higher frequencies of universal consciousness, inspiration, and spiritual guidance.

---

#### Slide 10: Circuit of Energy of Cosmos and Earth
**Reimagined:** `level-1/10-cosmosearth.PNG`

> When both circuits are activated simultaneously, the energies of the Earth and Cosmos flow together through the body. Earth energy rises from below; Cosmic energy descends from above. They meet and blend within the body, creating a unified field of balanced, integrated energy.

---

#### Slide 11: The Rose (as Energetic Tool)
**Reimagined:** `level-1/11-therosegold.PNG`

> The Rose is used as a living energetic instrument throughout the practice. It has roots (connection to source), a stem (channel of energy), and a bloom (the active, radiant tool). The Rose can be placed, moved, opened, closed, and released according to the needs of the meditation.

---

#### Slide 12: Roses of Protection, Observation and Separation (Four Roses)
**Original:** `level-1/12-four-roses-original.PNG` | **Reimagined:** `level-1/12-four-roses.PNG`

> Roses are placed at the edges of the aura to serve as energetic sentinels. They perform three functions:
>
> 1. **Protection** -- They define and guard the boundary of your aura
> 2. **Observation** -- They help you notice what energies are approaching or interacting with your field
> 3. **Separation** -- They create healthy energetic distinction between your energy and the energy of others

---

#### Slide 13: Cleansing Rose
**Original:** `level-1/13-cleansing-rose.PNG` | **Reimagined:** `level-1/13-cleansing-rose-reimagined.png`

> The Cleansing Rose is placed outside of the aura. It is used to absorb and transmute foreign or stagnant energy from within your field. Energy that does not belong to you -- from other people, environments, or experiences -- is drawn out of the aura and into the Cleansing Rose, where it is neutralized.

---

#### Slide 14: Energy Recovery of Each Chakra
**Original:** `level-1/14-recovery-rose-original.PNG` | **Reimagined:** `level-1/14-energy-recovery-background.jpeg`

> After cleansing, the Rose is used to recover your own energy that has been left in or taken by others. The Rose is sent out as an instrument to gather and return your own life-force energy to each chakra, restoring fullness and sovereignty to each energy center.

---

#### Slide 15: Pink Rose Closure
**Reimagined:** `level-1/15-pink-rose-closure.png`

> The Pink Rose Closure is offered at the end of the meditation as a gift of well-being -- for yourself or another person. Create an unrooted pink Rose and place yourself or the person inside it, visualizing "Happy, Healthy, Whole, Body, Mind & Soul." Repeat this intention silently while making the Rose rise towards the center of the Universe, wishing all the best for whoever is held within it.

---

#### Slide 16: Discharge Excess Energy
**Original:** `level-1/16-discharge-energy-original.PNG` | **Reimagined:** `level-1/16-discharge-excess.PNG`

> After deep meditation or energy work, excess energy may accumulate in the body. To discharge it, lean forward from the seated position with hands reaching toward the ground. Allow the excess energy to flow out through the hands and into the earth, returning the body to a calm, balanced state.

---

#### Slide 17: Let's Create Your Sacred Space
**Reimagined:** `level-1/17-sacred-space.png`

> Level 2 begins with creating your own sacred space -- an internal energetic environment that serves as your meditation home. This is the space from which all deeper work is conducted.

---

#### Slide 18: The 6th and 7th Chakras (Sacred Space)
**Original:** `level-1/18-sacredspace-original.jpg` | **Reimagined:** `level-1/18-sacred-space.PNG`

> Understanding the locations and roles of the upper chakras is essential for Level 2 work:
>
> - **6th Chakra (Third Eye)** -- Located at the center of the forehead, between and slightly above the eyebrows
> - **7th Chakra (Crown)** -- Located at the top of the head

---

### LEVEL 2

---

#### Slide 19: Let's Prepare Your Physical Space
**Reimagined:** `level-2/19-physical-space.png`

> Before meditation, prepare your physical environment to support the energetic work. The external space should mirror the internal intention: clean, clear, quiet, and intentionally held.

---

#### Slide 20: Protection of the Space
**Original:** `level-2/20-protectthespace-original.jpg` | **Reimagined:** `level-2/20-create-the-room.jpg`

> The physical meditation space is protected by creating an energetic grid using roses. Golden roses are placed at the four corners (and above/below) of the space, connected by lines of golden energy forming a sacred geometric structure -- a container for the work.

**Designer Notes:**
- The lines of the room/grid are all in **gold**
- The room also has its own **grounding cord that expands within the space** -- this exists energetically but is **not depicted in the current image**
- **This is a known visual challenge** -- the room grid is already complex with roses and connecting lines, so adding an expanded grounding cord is difficult to represent clearly. The designer has creative freedom here to find a solution that works without cluttering the composition. Possible approaches: a subtle translucent wash beneath the grid floor, a soft downward glow from the base of the room, or a separate companion detail image. If it cannot be shown clearly in the main image, a note or caption acknowledging the room's grounding cord may suffice
- The grounding cord visual direction (when depicted): **opaque, transparent, thick and strong, less gold** -- same as slides 3 and 6
- **Correction:** The golden energy shown under the figure in the current image is **not accurate** -- the figure does not radiate golden energy beneath it for protection. If anything is shown beneath the figure, it should only be a **grounding cord**, not a pool or field of golden energy
- The grounding cord visual direction (when depicted): **opaque, transparent, thick and strong, less gold** -- same as slides 3 and 6

---

#### Slide 21: Cleansing of the Space
**Original:** `level-2/21-cleansing-space-original.PNG` | **Reimagined:** `level-2/21-cleanse-the-space.jpg`

> Once the space is protected, it is cleansed. A large Cleansing Rose is placed above the grid, and golden energy pours downward through the entire structure, clearing all foreign, stagnant, or disruptive energies from the space.

**Designer Notes:**
- **Correction:** The rose itself does **not beam or emit golden light** -- the golden energy pours downward through the structure to cleanse, but the rose is not the source of a golden light beam. The rose directs the cleansing, but the visual should not show rays or beams of golden light radiating from the rose
- The room should show its own **grounding cord expanding within the space** -- the grounding cord should be clear and transparent so people understand the cord also expands within the room (same visual direction as slide 20)

---

#### Slide 22: Owning Your Space
**Original:** `level-2/22-protect-the-space-original.PNG` | **Reimagined:** `level-2/22-owning-space.jpg`

> After protection and cleansing, you claim ownership of the space. This is an act of energetic sovereignty -- declaring the space as yours, filling it with your own energy and intention. The space becomes an extension of your aura and your practice.

**Designer Notes:**
- The room should show its own **grounding cord expanding within the space** -- the grounding cord should be clear and transparent so people understand the cord also expands within the room (same visual direction as slide 20)
- **Four golden lines go from the perineum to the four bottom corners of the room**, and **four golden lines from the crown to the top four corners of the room** -- this should be clearly depicted as this is what the slide demonstrates
- Same grounding cord visual direction as slides 3 and 6: **opaque, transparent, thick and strong, less gold**

---

#### Slide 23: Let's Talk About Chakras
**Reimagined:** `level-2/23-chakras-intro.jpeg`

> The chakra system is the energetic anatomy of the human body. There are seven primary chakras, each governing specific aspects of physical, emotional, mental, and spiritual life.

---

#### Slide 24: The Seven Chakras
**Original:** `level-2/24-chakras-original.PNG` | **Reimagined:** `level-2/24-chakras.png`

> | # | Chakra | Location |
> |---|--------|----------|
> | 7 | **Crown** | Top of head |
> | 6 | **Third Eye** | Center of forehead |
> | 5 | **Throat** | Throat |
> | 4 | **Heart** | Center of chest |
> | 3 | **Solar Plexus** | Upper abdomen |
> | 2 | **Sacral** | Lower abdomen |
> | 1 | **Root** | Base of spine |

---

#### Slide 25: Root Chakra
**Reimagined:** `level-2/25-root-chakra.png`

> **Muladhara -- Grounding & Safety**
>
> | Attribute | Detail |
> |-----------|--------|
> | Core Conscious Statement | **I AM** |
> | Color | Red |
> | Element | Earth |
> | Body Location | Base of spine, Legs, Feet |
> | Energy | Masculine -- Survival / Foundation |
>
> **Focus:** Stability -- Safety -- Embodiment
>
> | Balanced Expression | Unbalanced Expression |
> |--------------------|-----------------------|
> | Grounded presence | Fear and insecurity |
> | Physical vitality | Survival anxiety |
> | Trust in life | Disconnection from body |
> | Feeling safe in the body | Scarcity mindset |
>
> **Primary Blockages:** Fear -- Insecurity -- Survival Trauma

---

#### Slide 26: Sacral Chakra
**Reimagined:** `level-2/26-sacral-chakra.png`

> **Svadhisthana -- Emotion & Creativity**
>
> | Attribute | Detail |
> |-----------|--------|
> | Core Conscious Statement | **I FEEL** |
> | Color | Orange |
> | Element | Water |
> | Body Location | Lower abdomen, Sexual Organs |
> | Energy | Feminine -- Flow & Flexibility |
>
> **Focus:** Emotions -- Creativity -- Pleasure
>
> | Balanced Expression | Unbalanced Expression |
> |--------------------|-----------------------|
> | Emotional well-being | Depression and numbness |
> | Sensuality and intimacy | Sexual dysfunction |
> | Passion and pleasure | Emotional instability |
> | Adaptability | Fear of change |
>
> **Primary Blockages:** Shame -- Emotional Repression -- Guilt

---

#### Slide 27: Solar Plexus Chakra
**Reimagined:** `level-2/27-solar-plexus-chakra.png`

> **Manipura -- Willpower & Confidence**
>
> | Attribute | Detail |
> |-----------|--------|
> | Core Conscious Statement | **I CAN** |
> | Color | Yellow |
> | Element | Fire |
> | Body Location | Upper abdomen, Diaphragm |
> | Energy | Masculine -- Power & Transformation |
>
> **Focus:** Personal Power -- Self-Esteem -- Drive
>
> | Balanced Expression | Unbalanced Expression |
> |--------------------|-----------------------|
> | Confidence and motivation | Low self-esteem |
> | Responsible and disciplined | Aggression or controlling |
> | Healthy sense of self | Stubborn and domineering |
> | Autonomy | Lack of direction or purpose |
>
> **Primary Blockages:** Self-Doubt -- Insecurity -- Fear of Rejection

---

#### Slide 28: Heart Chakra
**Reimagined:** `level-2/28-heart-chakra.png`

> **Anahata -- Love & Integration**
>
> | Attribute | Detail |
> |-----------|--------|
> | Core Conscious Statement | **I LOVE** |
> | Color | Green (Human Love) / Pink (Divine / Unconditional Love) |
> | Element | Air |
> | Body Location | Center of chest, Heart, Lungs |
> | Energy | Bridge between physical & spiritual |
>
> **Focus:** Love -- Compassion -- Connection
>
> *Balancing self and others, physical and spiritual realms.*
>
> | Balanced Expression | Unbalanced Expression |
> |--------------------|-----------------------|
> | Compassion and empathy | Emotional withdrawal or over-giving |
> | Emotional openness | Fear of intimacy |
> | Forgiveness | Cold or detachment |
> | Healthy intimacy and self-love | Difficulty forgiving |
>
> **Primary Blockages:** Grief -- Betrayal -- Heartbreak
>
> **Human Love & Spiritual Love:**
>
> | Human Love | Spiritual Love |
> |-----------|---------------|
> | Statement: **I LOVE** | Statement: **I AM LOVE** |
> | Empathy and compassion | Unconditional compassion |
> | Forgiveness | Interconnectedness |
> | Healthy relationships | Divine and universal love |
> | Romantic and familial love | Oneness |

---

#### Slide 29: Throat Chakra
**Reimagined:** `level-2/29-throat-chakra.png`

> **Vishuddha -- Communication & Expression**
>
> | Attribute | Detail |
> |-----------|--------|
> | Core Conscious Statement | **I SPEAK AND I LISTEN** |
> | Color | Light Blue |
> | Element | Ether / Sound |
> | Body Location | Throat, Neck, Jaw, Mouth |
> | Energy | Learning to align will with divine truth |
>
> **Focus:** Communication -- Truth -- Authenticity
>
> *Speaking and listening to truth clearly and authentically.*
>
> | Balanced Expression | Unbalanced Expression |
> |--------------------|-----------------------|
> | Clear, honest communication | Fear of speaking up |
> | Authentic self-expression | Being unheard or misunderstood |
> | Good listener | People-pleasing |
> | Strong voice and balanced speech | Suppressed feelings or lies |
>
> **Primary Blockages:** Suppressed Truth -- Fear of Expression -- Miscommunication

---

#### Slide 30: Third Eye Chakra
**Reimagined:** `level-2/30-third-eye-chakra.jpeg`

> **Ajna -- Intuition & Insight**
>
> | Attribute | Detail |
> |-----------|--------|
> | Core Conscious Statement | **I SEE** |
> | Color | Indigo |
> | Element | Light |
> | Body Location | Forehead, Brow, Eye center |
> | Energy | Feminine aspects of awareness |
>
> **Focus:** Imagination -- Perception -- Visualization
>
> *Opening the mind's eye and deeper levels of perception.*
>
> | Balanced Expression | Unbalanced Expression |
> |--------------------|-----------------------|
> | Clear seeing and intuition | Overthinking |
> | Good memory and imagination | Mental fog |
> | Inner location | Disconnection with inner guidance |
> | Wisdom and vision | Escaping reality or spiritual bypassing |
>
> **Primary Blockages:** Suppressed Truth -- Fear of Expression -- Miscommunication

---

#### Slide 31: Crown Chakra
**Reimagined:** `level-2/31-crown-chakra.png`

> **Sahasrara -- Spirituality & Consciousness**
>
> | Attribute | Detail |
> |-----------|--------|
> | Core Conscious Statement | **I KNOW** |
> | Color | Violet & White |
> | Element | Thought & Universal Connection |
> | Body Location | Top of head |
> | Energy | Transcending ego, merging with source |
>
> **Focus:** Spiritual Connection -- Inner Wisdom -- Higher States of Awareness
>
> *Awakening to pure consciousness, divine oneness, and universal connection.*
>
> | Balanced Expression | Unbalanced Expression |
> |--------------------|-----------------------|
> | Spiritual faith and connection | Spiritual emptiness |
> | Inner peace, trust, and wisdom | Existential doubt |
> | Openness and awareness | Feeling isolated or alone |
> | Sense of life purpose | Lack of purpose |
>
> **Primary Blockages:** Disconnection -- Cynicism -- Loss of Meaning

---

#### Slide 32: Cleansing of Each Aura Layer
**Original:** `level-2/32-cleansing-layers-original.jpg` | **Reimagined:** `level-2/32-cleansing-each-layer.PNG`

> The aura is composed of seven layers, each corresponding to a chakra. In Level 2, each layer is individually cleansed from the outermost to the innermost:
>
> | Layer | Aura Layer |
> |-------|-----------|
> | 7 | 7th Aura layer |
> | 6 | 6th Aura layer |
> | 5 | 5th Aura layer |
> | 4 | 4th Aura layer |
> | 3 | 3rd Aura layer |
> | 2 | 2nd Aura layer |
> | 1 | 1st Aura layer |

---

#### Slide 33: Cleansing of Each Chakra
**Original:** `level-2/33-cleansingeachchakra-original.jpg` | **Reimagined:** `level-2/33-cleansing-each-chakra.PNG`

> Each individual chakra is cleansed using roses. The roses address two dimensions:
>
> - **Dynamics of the Past** -- Energetic patterns, imprints, and blockages carried from past experiences
> - **Dynamics of the Present** -- Current energetic influences, relationships, and situations affecting the chakra

---

#### Slide 34: Energy Recovery of Each Chakra (Level 2)
**Original:** `level-2/34-energyrecoveryeachchakra-original.jpg` | **Reimagined:** `level-2/34-energy-recovery.jpeg`

> After cleansing, the energy recovery process is repeated at a deeper level. The Rose is sent out to gather and return your own energy to each individual chakra, restoring sovereignty, vitality, and wholeness to each energy center.

---

#### Slide 35: Golden Sticky Roses -- Phase 1 (Chakra Placement)
**Original:** `level-2/35-golden-sticky-1-original.jpg` | **Reimagined:** `level-2/35-golden-sticky-1.jpg`

> Golden sticky roses are placed on each of the seven chakras, drawing out foreign energy lodged in the energy centers.

**Designer Notes:**
- Add a few **subtle arrows** to indicate the direction of energy being drawn out by the sticky roses

---

#### Slide 36: Golden Sticky Roses -- Phase 2 (Body Placement)
**Original:** `level-2/36-golden-sticky-2-original.PNG` | **Reimagined:** `level-2/36-golden-sticky-2.jpg`

> Golden sticky roses are placed at the joints and extremities of the body -- shoulders, elbows, wrists, hands, hips, knees, ankles, feet -- drawing out foreign energy stored in the physical body.

**Designer Notes:**
- Add a few **subtle arrows** to indicate the direction of energy being drawn out by the sticky roses

---

#### Slide 37: Golden Sticky Roses -- Phase 3 (Full Body Coverage)
**Original:** `level-2/37-golden-sticky-3-original.PNG` | **Reimagined:** `level-2/37-golden-sticky-3.jpg`

> Golden sticky roses are placed throughout the entire body -- covering the torso, limbs, and all remaining areas -- for a thorough, complete energetic cleansing.

**Designer Notes:**
- Add a few **subtle arrows** to indicate the direction of energy being drawn out by the sticky roses

---

#### Slide 38: Golden Sticky Roses -- Phase 4 (Integration)
**Original:** `level-2/38-golden-sticky-4-original.PNG` | **Reimagined:** `level-2/38-golden-sticky-4.jpg`

> After the golden sticky roses have done their work, a large Golden Rose appears above the head. All foreign energy gathered by the sticky roses is released, and the entire body is bathed in golden light -- restoring, sealing, and integrating the energy body.

**Designer Notes:**
- Add a few **subtle arrows** to indicate the direction of energy release and golden light cascading through the body

---

### LEVEL 3

---

#### Slide 39: The Analyzer
**Original:** `level-3/39-analyzer-original-reimagined.jpg` | **Reimagined:** `level-3/39-analyzer.PNG`

> The Analyzer is an advanced tool introduced in Level 3. It is an energetic point located at the back of the head, at the base of the skull (the occipital ridge / brainstem area). The Analyzer is used for deeper perception, reading, and discernment of energy -- a tool for precise energetic analysis.

---

#### Slide 40: The Analyzer & Sacred Space
**Reimagined:** `level-3/40-analyzer-and-sacred-space.png`

> A combined reference showing the Analyzer in relation to the sacred space. This image illustrates how the Analyzer -- the energetic point at the base of the skull -- operates within the context of the protected, cleansed sacred space established in Level 2. The two work together: the sacred space provides the container, and the Analyzer provides the perceptive tool for deeper energetic reading and discernment.

---

#### Slide 41: Breaking Spiritual Agreements (Stick of Agreements)
**Reimagined:** `level-3/41-stick-of-agreements.png`

> Any relationship can only exist in matter if there has been a spiritual agreement to support that relationship. These agreements can only be created with the consent of both parts on the spiritual level and can be broken by either part through their conscious will. Sometimes these agreements are in line with our conscious will; at other times, they resonate with unconscious desires. Using this Rose Meditation technique, we can always break these agreement sticks.
>
> **To break a spiritual agreement:**
> 1. Visualize the agreement as a stick
> 2. Break the stick into three pieces
> 3. Create a grounded Rose
> 4. Place the three pieces of stick in the Rose
> 5. Explode the Rose out of the Aura
>
> *This should always be done with great awareness, as it has very real consequences for our lives.*

---

#### Slide 42: Cutting Cords
**Reimagined:** `level-3/42-cutting-cords.png`

> We have energetic interactions with people all the time we see them, hear them, touch them and even think about them. When we form bonds, our auras connect through cords where energy passes through. That is why we can often feel what is happening with people who are close to us, even if they are far away.
>
> **To cut cords:**
> 1. Close your eyes
> 2. Visualize your Aura with cords coming out of your chakras
> 3. Place your dominant hand on the 7th cervical vertebra (at the junction of the neck and back, at the level of the 5th chakra)
> 4. Intend that your hand has the power to cut all the cords
> 5. Make the movement of cutting the cords down to under your 1st chakra, leaning your hand on the chair where you are sitting
>
> We can also cut cords when the relationship has not ended, but we feel we need more neutrality. These bonds form again very quickly when we reconnect with the person.

---

#### Slide 43: Post Intimacy / Sexual Recovery Rose
**Reimagined:** `level-3/43-sexual-recovery-rose.png`

> After sexual intercourse, if you want to recover your energy that may have remained with the person and return the energy of the person who may have remained with you:
>
> 1. Do the preparation techniques (grounding cord, Golden Sun, energy of the Earth and the Cosmos, sacred space)
> 2. Create an orange Rose and place the person's energy in the Rose (you can visualize the person entering the Rose, the situation, emotions and feelings that may appear at that moment); explode
> 3. Create an unrooted orange Rose that cleanses the person's energy that may have remained in any layer of your Aura; explode
> 4. Create a grounded orange Rose and intend for this Rose to recover all your energy that was left with this person; explode
> 5. If you want to remain energetically separated, cut the energetic cords
> 6. Create an unrooted pink Rose, place the person on it, visualize the person happy and in complete health. Repeat mentally: "Happy, healthy, complete, body, mind, Spirit." Bring the Rose up towards the center of the Universe
> 7. Renew your grounding cord
> 8. Fill yourself with the light of the Golden Sun
> 9. Place your hands on the floor to discharge excess energy

---

#### Slide 44: Mock Up
**Reimagined:** `level-3/44-mock-up.png`

> This is a technique for manifesting things or situations on the physical plane. It is important to note that this technique should only be used for yourself -- it cannot be done for someone else. It must be done 7 days in a row to be effective and it must be done for one goal at a time. The higher your vibration when you do the Mock Up, the more effective it will be. A good time to do it is just after finishing Rose Meditation.
>
> 1. Create a grounded Rose and inside that Rose imagine what you want, creating the image with as much detail as you can
> 2. Create a grounded Rose beside the first one -- this is a Cleansing Rose that will absorb all the blockages between yourself and your goal. Explode it
> 3. Create a third grounded Rose and place inside it an image of something you love deeply. Feel the vibration of Divine Love and allow that vibration to envelop the first Rose with a pink bubble
> 4. Release the first Rose, surrounded by the pink bubble, upward toward the center of the Universe
>
> *Remember to repeat this technique for 7 consecutive days. If you miss a day before completing the 7-day cycle, go back to the beginning. Once you have completed the Mock Up, live your life trying to align yourself on all levels, handing over the fulfillment of your desires to the Supreme Being and open to receiving in whatever way the Great Mystery allows.*

---

## 5. CONTENT STRUCTURE SUMMARY

The manual has five sections, each a page or scroll section on the web:

### Section 1 -- Introduction

- Purpose of Rose Meditation
- How to use this manual
- Teaching posture: guiding, not diagnosing
- Safety, consent, and energetic responsibility

### Section 2 -- Energetic Foundations

Core tools and concepts introduced before the chakra deep-dive:

- **Grounding Cord** -- Energy connection from base of spine to Earth's center
- **Golden Sun** -- Replenishing and restoring personal life-force energy
- **Earth & Cosmos Circuits** -- Integrated energy flow through the body
- **The Rose** -- Living energetic instrument (roots, stem, bloom); functions include place, move, open, close, release
- **The Aura** -- Seven-layer energetic field surrounding the body; introduction to its structure and purpose
- **Roses of Protection, Observation, and Separation** -- Energetic sentinels placed at the aura boundary
- **Cleansing Rose** -- Placed outside aura to absorb and transmute foreign or stagnant energy
- **Energy Recovery** -- Rose sent to gather and return life-force energy to each chakra
- **Discharge Excess Energy** -- Releasing accumulated energy after deep meditation

### Section 3 -- The Seven Chakras (core section)

One consistent layout per chakra, each containing:

- Name (English + Sanskrit)
- Body location (anatomically accurate)
- Color and element
- Core conscious statement (I AM, I FEEL, I CAN, I LOVE, I SPEAK & I LISTEN, I SEE, I KNOW)
- Focus area
- Balanced vs. unbalanced expressions
- Primary blockages
- Teaching cues (what to emphasize verbally)

**Chakra reference:**

| # | Chakra | Sanskrit | Statement | Color | Element |
|---|--------|----------|-----------|-------|---------|
| 1 | Root | Muladhara | I AM | Red | Earth |
| 2 | Sacral | Svadhisthana | I FEEL | Orange | Water |
| 3 | Solar Plexus | Manipura | I CAN | Yellow | Fire |
| 4 | Heart | Anahata | I LOVE | Green/Pink | Air |
| 5 | Throat | Vishuddha | I SPEAK & I LISTEN | Light Blue | Ether |
| 6 | Third Eye | Ajna | I SEE | Indigo | Light |
| 7 | Crown | Sahasrara | I KNOW | Violet/White | Consciousness |

### Section 4 -- Level-Specific Teaching Flows

- **Level 1 (Foundations):** Posture, grounding, golden sun, aura awareness, circuits, roses of protection, cleansing, recovery, pink rose closure, discharge, sacred space, 6th and 7th chakras
- **Level 2 (Sacred Space + Chakra Activation):** Creating sacred space, protecting and cleansing the space, owning the space, chakra deep dive, aura layer cleansing, chakra cleansing (past and present dynamics), energy recovery, golden sticky roses (4 phases)
- **Level 3 (Advanced Perception):** The Analyzer -- energetic point at the base of the skull for deeper perception, reading, and discernment; combined Analyzer & Sacred Space reference; breaking spiritual agreements (stick of agreements); cutting energetic cords; post-intimacy / sexual recovery rose; Mock Up (reality creation technique)

### Section 5 -- Teaching Agreements

Core agreements all participants honor:

- Punctuality
- Confidentiality
- Co-responsibility
- Trust
- Patience, Empathy, and Compassion

Sacred use guidelines:

- Material is for initiated students only
- Cannot be used to teach or guide others independently
- Exception: supporting children under the practitioner's care

---

## 6. ILLUSTRATION & IMAGERY

### Style

Stick-and-line drawings with color that evokes watercolor -- a feeling of a time that came before. Drawings should feel pure, innocent, vibrant, and loving.

### Heritage Context

The existing drawings and logo are references to the original stick-and-line style from the tradition's history. The current logo also represents the past logo. The new design should pay homage to this history -- honoring the old while creating a new, elevated rendition. The viewer should always feel the connection between old and new. The originals carry the truth of the teaching; the new designs carry that same truth forward in a modern visual language.

### Working with Two Image Sets

All images are in the same directory (`public/rose med images/`). They are differentiated by naming:
- Files with **"original"** in the name = hand-drawn originals from the tradition
- Files **without** "original" (the larger PNGs) = reimagined/modernized versions

| Image Set | Location | How to Identify | Purpose |
|-----------|----------|----------------|---------|
| **Originals** | `public/rose med images/` | Filename contains "original" | **Accuracy reference** -- shows exactly what each energetic structure should depict. New designs must reflect what the originals show. |
| **Reimagined** | `public/rose med images/` | Filename does NOT contain "original" | **Feel reference** -- shows the target for clothing, design style, and aesthetic. Not the accuracy source. |
| **Original PDF** | `docs/source-materials/MDR - VISUAL SUPPORT - FEB2024.pdf` | The full 46-page source deck | Complete original visual presentation for cross-reference |

**Designer workflow:**
1. Review the original image for each concept to understand **what must be shown** -- the original is more accurate and the new design must reflect it
2. Review the reimagined version (if available) for **feel** -- clothing, design style, aesthetic direction
3. Where no reimagined version exists (only 4 concepts -- see Section 3), create a new illustration that honors the original's accuracy while matching the reimagined style
4. Always maintain the connection between old and new -- pay homage to the original tradition while elevating it
5. Both originals and reimagined images should be accessible on the website -- the originals serve as a supplementary reference that teachers may prefer for their accuracy

### Transparent Backgrounds

All images must have **true transparent backgrounds**. No checkerboard patterns or solid-color fills behind figures. If any existing images have checkerboard backgrounds, they need to be cleaned up to use proper transparency.

### Rose Depiction Rule

Roses in this system are always depicted as a stem and a flower only -- never with thorns or leaves.

### Rose Imagery in Opening Pages

Where a logo is called for in the opening slides (Sections 1--3), use the logos from the live website (rosesos.com) alongside a realistic rose image. These set the visual tone for the manual. The website logos are the source of truth -- do not recreate or reinterpret them.

### Figure Diversity

Body placement visuals must include both male and female figures and represent a wide variety of types of people, nationalities, and ethnicities -- not just white people. Figures should reflect the whole world, like the United Nations. No single type of person should dominate the imagery. A variety of body shapes, sizes, skin tones, and cultural backgrounds should be represented throughout the manual.

**The designer has creative freedom here.** The reimagined images serve as **inspiration** -- they show the feel, clothing style, and aesthetic direction we're going for. But the designer should create their own diverse examples and bring new interpretations. Each person depicted can and should be different. Think of the reimagined images as a mood board, not a blueprint. We want the designer to imagine new figures that represent the full spectrum of humanity.

### Non-Chakra Teaching Slides

Slides illustrating meditation techniques (grounding cord, golden sun, aura layers, roses of protection, etc.) should be specific in the lines and patterns shown. The imagery needs to accurately depict the energetic structures being taught.

### Chakra Section Imagery

The chakra pages do not need the rose logo. The designer has creative freedom here -- the priority is helping viewers clearly understand where in the body each chakra is located. Each chakra page should emphasize that chakra's color -- vibrant yet subtle, applied cohesively across the section. The designer has discretion on how the color is expressed (background wash, glow, accent, etc.).

**Nadis:** Each chakra page should also show the nadis (energy channels) associated with that chakra on the body. The nadis illustrate how energy flows into and out of each chakra -- they are part of the teaching and help the viewer understand each chakra as a living, connected energy center, not just a point on the body.

### Fashion & Figure References

People depicted should evoke high-end ancient-meets-modern style -- natural materials like linen, silk, raw natural fibers in neutral tones.

Key references:
- [Caravana](https://caravana.land) -- artisan-driven luxury resort wear
- High-end Greek fashion blending ancient heritage with modern minimalism -- designers like Zeus+Dione, Celia Dragouni, Vassilis Zoulias; brands like Greek Archaic Kori, Pearl and Caviar, Parthenis
- [Yeva](https://yeva.world) -- design inspiration

---

## 7. VISUAL IDENTITY (Condensed)

The live website [rosesos.com](https://rosesos.com) is the primary reference for font choices, color palette, and overall vibe. Align with what is on the site now.

**Design ethos:** Apple-level minimalism inside a temple. Sacred-tech minimalism -- earthy, grounded, warm, quiet.

### Color Rules for the Manual

| Context | Treatment |
|---------|-----------|
| Non-chakra pages | Warm neutral background (rose clay / peachy neutral) |
| Chakra pages | Each chakra's correct color as the dominant color |
| Gold accents | For headings, dividers, key phrases -- used intentionally, never decoratively |
| Cross-chakra cohesion | Harmonize saturation so the chakra section feels unified |

### Primary Palette

| Color | HEX | Role |
|-------|-----|------|
| Rose Clay Mauve | `#9C6F6E` | Signature field color -- the human interface layer |
| Aura White | `#F7F5F2` | Primary background |
| Soft Charcoal | `#3F3E3C` | Body text, navigation |
| Antique Olive Brass | `#9E956B` | Accent -- headings, highlights, buttons ("like gold in a temple") |
| Honeyed Stone | `#C7AE8C` | Background support |
| Peach Sand | `#EBD6C1` | Light backgrounds |
| Golden Ether | `#F5E8E2` | Warm blush background, pairs with gold |

### Typography

| Use | Typeface |
|-----|----------|
| Headlines, sacred text | Cormorant Garamond |
| Body, UI, buttons, navigation | Inter |

### Texture

Surfaces should feel like clay, linen, stone, paper, soft fogged light. Rose Clay Mauve should always be paired with subtle texture (linen, paper grain, soft mineral noise) -- flat fills make it feel cosmetic, texture makes it architectural.

---

## 8. PDF DOWNLOAD

A "Download PDF" button at the top of the teaching section exports the entire manual as a formatted PDF designed for print or offline reference. Each level page also has its own download button for exporting that level individually.

**Requirements:**

- PDF mirrors the web layout as closely as possible
- Branded template: ROSES OS wordmark, Aura White background, consistent margins and typography
- Formatted for both screen reading and print (A4 / Letter)
- Cormorant Garamond for headers, Inter for body
- Illustrations and diagrams render cleanly (SVG preferred)
- Page numbers and section headers in footer
- Subtle brand texture on each page (light enough to print cleanly)
- **Multilingual:** Export in the currently selected language. Include the language code in the filename (e.g., `roses-os-mdr-level-1-pt.pdf`). The PDF cover page should display the language name (e.g., "Português" for Portuguese exports)
- **Per-level download:** Each level page (Level 1, 2, 3) has a "Download PDF" button that exports only that level's content as a standalone PDF
- **Full manual download:** The teaching hub page has a "Download Full Manual" button that exports all levels as a single PDF

---

## 9. DESIGN PRINCIPLES

These principles guide every design decision in the manual:

1. **Silence is sacred** -- Whitespace is not empty. It is intentional breathing room.
2. **Warmth over polish** -- The brand should feel like clay, not chrome.
3. **Centered and calm** -- Layouts are devotional, not dynamic. Centered, not asymmetric.
4. **Gold is earned** -- Use `#9E956B` for emphasis, never decoration.
5. **No hype** -- Nothing should feel urgent, loud, or sales-driven. This is a teaching instrument.
6. **Consistency is coherence** -- Same background style, same layout logic, same color rules, same iconography across every page and PDF.
7. **Texture has meaning** -- Clay, linen, stone, paper evoke earthiness. Use them with intention.
8. **Rose Clay Mauve is the brand** -- It is the field, not the accent. It should feel like home.

---

## 10. ACCESSIBILITY

The designer has discretion on accessibility approach. The goal is that the manual works well as a teaching presentation on tablets and laptops. Key considerations:

- Sufficient contrast for readability in varied lighting (teaching environments)
- Clear typographic hierarchy so teachers can scan quickly during live sessions
- Touch-friendly navigation for tablet use
- Legible at arm's length (presentation context)

---

## 11. CREATIVE FREEDOM

The designer has creative freedom in executing this manual. These guidelines provide intention and tonal foundation -- not rigid constraints. We trust the designer's eye and craft to interpret these principles and bring them to life. Where something is not specified, follow your instinct within the brand's tone -- warm, sacred, grounded, quiet.

---

## 12. PRODUCTION CHECKLIST

- [ ] Review source content: `docs/training/mdr-teachers-training-manual.md`
- [ ] Review source plan: `docs/source-materials/plan-mdr.md`
- [ ] Review original visual presentation: `docs/source-materials/MDR - VISUAL SUPPORT - FEB2024.pdf`
- [ ] Review original images in `public/rose med images/` (files with "original" in the name) -- these are the accuracy reference
- [ ] Review reimagined images in `public/rose med images/` (files without "original" in the name) -- these are the aesthetic target
- [ ] Review live site [rosesos.com](https://rosesos.com) for current visual reference
- [ ] Review source Keynote file: `docs/source-materials/Rose + Aura - Invite .key`
- [ ] Design the password-protected entry gate
- [ ] Build Introduction pages (purpose, posture, safety)
- [ ] Build Energetic Foundations pages -- each with image (original or reimagined) + teaching text
- [ ] Verify all images from Section 3 match the site (all 36 slides have images)
- [ ] Build Chakra 1--7 pages (one per chakra, consistent layout, with teaching text)
- [ ] Build Level-specific teaching flow pages (Level 1, 2, 3)
- [ ] Build Teaching Agreements pages
- [ ] Ensure each slide pairs an image with its corresponding teaching text from Section 4 of this document
- [ ] Design the PDF export (full manual as downloadable PDF)
- [ ] Add per-level PDF download buttons (Level 1, 2, 3 each export individually)
- [ ] Add "Download Full Manual" button on the teaching hub page
- [ ] Review all pages for consistency (layout, color, typography)
- [ ] Test on tablet and laptop (teachers will use these devices during live sessions)
- [ ] Verify Cormorant Garamond and Inter render Greek characters correctly
- [ ] Design the language selector component (EN / PT / ES / EL toggle)
- [ ] Create translation content structure (`src/content/teaching/{en,pt,es,el}.json`)
- [ ] Test text expansion in Portuguese, Spanish, and Greek -- ensure layouts accommodate longer strings
- [ ] Test PDF export in each language

---

## REFERENCE DOCUMENTS

| Document | Path |
|----------|------|
| Teaching Manual (source content & words) | `docs/training/mdr-teachers-training-manual.md` |
| MDR Plan (source plan) | `docs/source-materials/plan-mdr.md` |
| Original Visual Presentation (46 pages) | `docs/source-materials/MDR - VISUAL SUPPORT - FEB2024.pdf` |
| Original Images (hand-drawn) | `public/rose med images/` -- files with "original" in the name |
| Reimagined Images (modernized) | `public/rose med images/` -- files without "original" in the name |
| Brand DNA | `docs/brand/brand-dna.md` |
| Source Keynote | `docs/source-materials/Rose + Aura - Invite .key` |
| Master Designer Plan | `docs/project-plan-for-designer.md` |

---

## LANGUAGE VERSIONS

The MDR Teacher's Resource Manual will be available in **four languages**:

| Language | Code | Status | Notes |
|----------|------|--------|-------|
| **English** | `en` | Primary -- build first | Source language for all content |
| **Portuguese** | `pt` | Phase 2 | Core community language -- many practitioners are Portuguese-speaking |
| **Spanish** | `es` | Phase 2 | Growing community in Spanish-speaking regions |
| **Greek** | `el` | Phase 2 | Community presence in Greece; supports Mediterranean expansion |

### Multilingual Design Approach

**Identical layouts, text-only swaps.** The visual design, imagery, and layout structure remain exactly the same across all languages. Only the teaching text, UI labels, headings, and navigation elements change.

#### Design Considerations

1. **Text expansion:** Portuguese, Spanish, and Greek text is typically 15--30% longer than English. Layouts must accommodate longer strings without breaking. Allow flexible text containers -- do not hard-code widths based on English string lengths.

2. **Greek script:** Greek uses a different alphabet (e.g., Ελληνικά). Ensure the chosen typefaces (Cormorant Garamond and Inter) support the Greek character set with proper diacritics (polytonic and monotonic accents). Both fonts have Greek support -- verify rendering quality during design.

3. **Chakra terminology:** Sanskrit terms (Muladhara, Svadhisthana, etc.) remain the same across all languages -- they are universal. Only the descriptive text, conscious statements, and teaching cues are translated.

4. **Language selector:** Add a language selector (dropdown or toggle) to the teaching section header. It should:
   - Appear next to the "Download PDF" button
   - Show language names in their native script: English, Português, Español, Ελληνικά
   - Default to English
   - Persist the selection for the session (cookie or localStorage)
   - Be visible on both the teaching hub page and all level pages

5. **PDF export per language:** The "Download PDF" button should export the manual in the currently selected language. The PDF filename should include the language code (e.g., `roses-os-mdr-manual-pt.pdf`).

6. **Direction:** All four languages are left-to-right (LTR). No RTL support is needed.

7. **Translation management:** Teaching text translations will be provided as structured content files (one per language). The website should load the correct content file based on the selected language. Suggested structure:
   - `src/content/teaching/en.json` -- English (source)
   - `src/content/teaching/pt.json` -- Portuguese
   - `src/content/teaching/es.json` -- Spanish
   - `src/content/teaching/el.json` -- Greek

8. **Image text:** All teaching images are language-neutral (no embedded text). No image localization is needed -- only the accompanying teaching text changes.

#### Implementation Priority

- **Phase 1:** Build the complete manual in English. All design, layout, imagery, and interaction work happens here.
- **Phase 2:** Once the English version is approved, add the language selector and integrate translated content files. This is a content swap -- no design changes needed.
