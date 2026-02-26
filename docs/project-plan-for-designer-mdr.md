# MDR Teacher's Resource Manual -- Designer Plan

> Design brief for the Teacher Visual Aid Manual -- the facilitator's companion for teaching Rose Meditation.
>
> **Updated February 2026** -- Now includes complete image inventory (originals + reimagined), full teaching text for each slide, and integration plan for the website's `/teaching` section.

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
| **Original images (in repo)** | `public/rose med images/` (PNG exports of the original hand-drawn illustrations) |
| **Reimagined images** | `public/rose med images/reimagined/` (modernized versions -- being uploaded) |
| **Brand tone** | Sacred-tech minimalism -- earthy, grounded, warm, quiet. Never busy, never loud. |
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

The designer has **two sets of images** to work with for each teaching concept:

1. **Original images** -- Hand-drawn stick-and-line illustrations from the tradition. These are in `public/rose med images/` and are the most accurate depictions of the energetic structures. They are the source of truth for what should be shown.
2. **Reimagined images** -- Modernized, elevated versions that honor the originals while bringing them into the ROSES OS brand language. These will be uploaded to `public/rose med images/reimagined/`.

**The designer should use both sets.** The originals are the accuracy reference -- they show exactly what each energetic structure looks like and how it works. The reimagined versions are the aesthetic target -- they show how the final manual should feel. Where a reimagined image exists, use it as the primary visual. Where it doesn't yet exist, the designer creates the modernized version using the original as the guide.

### Image-to-Concept Mapping

Below is the complete inventory of original images and their corresponding teaching concepts. Each entry shows the file name, what it depicts, and where it appears in the manual.

#### Level 1 -- Foundational Practices

| # | Original Image File | Concept | Manual Section |
|---|-------------------|---------|----------------|
| 1 | `5-the-rose.PNG` | **The Rose** -- The foundational symbol and energetic tool. Roots, stem, and bloom. | Section 2: Energetic Foundations |
| 2 | `6-posture.PNG` | **Meditation Posture** -- Seated upright in a chair, feet flat, hands on knees, eyes closed. | Section 2: Energetic Foundations |
| 3 | `7-Groundingcord.PNG` | **Grounding Cord** -- Energy connection from base of spine into the center of the Earth. | Section 2: Energetic Foundations |
| 4 | `8-golden-sun.PNG` | **Golden Sun** -- Radiant golden sun above the head, restoring personal life-force energy. | Section 2: Energetic Foundations |
| 5 | `9-aura-exercise .PNG` | **Aura Exercise** -- Golden silhouette surrounded by concentric layers of glowing energy. | Section 2: Energetic Foundations |
| 6 | `10-Grounding cord expand .PNG` | **Grounding Cord with Aura** -- Person within aura egg, grounding cord extending through aura into earth. | Section 2: Energetic Foundations |
| 7 | `11-expansion-grounding-cord.PNG` | **Full Meditation Setup** -- Complete foundational setup: posture + aura + grounding cord. | Section 2: Energetic Foundations |
| 8 | `11aExpand auragoldensunexpanded.PNG` | **Full Setup with Golden Sun** -- Posture + aura + grounding cord + golden sun above crown. | Section 2: Energetic Foundations |
| 9 | `Circuitofthenergyofearth.PNG` | **Earth Circuit** -- Energy rising through feet and legs into the body. | Section 2: Energetic Foundations |
| 10 | `12Circuitofenergycismos .PNG` | **Cosmos Circuit** -- Cosmic energy descending through the crown into the body. | Section 2: Energetic Foundations |
| 11 | `13cosmosearth.PNG` | **Combined Earth + Cosmos Circuit** -- Both flows active simultaneously through the body. | Section 2: Energetic Foundations |

#### Images Still Needed (not yet in repo)

The following teaching concepts from the manual require illustrations. The designer should create these, using the style established by the reimagined images:

| Concept | Description | Manual Section |
|---------|-------------|----------------|
| **Roses of Protection, Observation, and Separation** | Roses placed at the four edges of the aura boundary, connected by lines forming a protective perimeter. | Level 1: Energetic Foundations |
| **Cleansing Rose** | A golden rose positioned outside the aura boundary, absorbing and transmuting foreign energy. | Level 1: Energetic Foundations |
| **Energy Recovery** | Rose on a cord extending outward, gathering and returning energy to each chakra. | Level 1: Energetic Foundations |
| **Discharge Excess Energy** | Person leaning forward, hands reaching toward floor, golden energy streaming into earth. | Level 1: Energetic Foundations |
| **Sacred Space Grid** | Person at center of a golden geometric grid with roses at corners, connected by golden lines. | Level 2: Sacred Space |
| **Cleansing of the Space** | Large rose above the grid pouring golden light downward through the structure. | Level 2: Sacred Space |
| **Owning Your Space** | Person radiating energy from within, filling the grid with their own light. | Level 2: Sacred Space |
| **The Seven Chakras (body map)** | Male and female figures with color-coded chakra points on the body. | Level 2: Chakras |
| **6th and 7th Chakra Locations** | Side profile showing precise locations of third eye and crown chakras. | Level 2: Chakras |
| **Aura Layer Cleansing** | Person with seven distinct color-coded aura layers, golden sun above, grounding cord below. | Level 2: Cleansing |
| **Chakra Cleansing** | Person with roses on either side -- one for past dynamics, one for present dynamics. | Level 2: Cleansing |
| **Golden Sticky Roses -- Phase 1** | Roses placed on each of the seven chakra points. | Level 2: Golden Sticky Roses |
| **Golden Sticky Roses -- Phase 2** | Roses placed at all major joints and extremities. | Level 2: Golden Sticky Roses |
| **Golden Sticky Roses -- Phase 3** | Person covered in golden roses from head to toe. | Level 2: Golden Sticky Roses |
| **Golden Sticky Roses -- Phase 4** | Large golden rose above head, golden light cascading through body, integration. | Level 2: Golden Sticky Roses |
| **The Analyzer** | View from behind the head showing a glowing golden point at the occipital ridge/brainstem. | Level 3: The Analyzer |

---

## 4. COMPLETE TEACHING TEXT (THE WORDS)

Below is the complete teaching text that accompanies each image/slide in the manual. This is the content that appears alongside or below each illustration on the website's `/teaching` pages.

**Source:** `docs/training/mdr-teachers-training-manual.md`

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

### Opening -- Sacred Companion

> This manual is a sacred companion for those who have been initiated into the path of Rose Meditation.
>
> These teachings are part of a living energetic lineage. They invite inner stillness, gentle discipline, and deep self-responsibility. ROSES OS is not a system to be imposed or taught casually -- it is an energetic operating system revealed through direct practice and transmission.
>
> **To honor the integrity of this work:**
> - Please do not share this material with others who have not received the transmission.
> - This manual is for personal use only and cannot be used to teach or guide others.
> - You are welcome to support children under your care with these tools.
>
> *Let each page be a reminder of the sacred space within you.*

---

### Opening -- History

> Aura Reading emerged in the 1960s, in California, channeled by a North American called **Lewis S. Bostwick**. Founder of the **Berkeley Psychic Institute** and the **Church of the Divine Man**, he channeled and systematized the techniques and tools sent by the angels, to assist in the process of evolution of humanity.
>
> **Lineage:** Berkeley Psychic Institute → Anastasia Plunk → Angelina Ataide → ROSES OS

---

### LEVEL 1

---

#### Slide: The Rose
**Image:** `5-the-rose.PNG` / reimagined version

> The Rose is the foundational symbol and tool of this practice -- a living energetic instrument used throughout all levels of the work.

---

#### Slide: Posture
**Image:** `6-posture.PNG` / reimagined version

> Proper meditation posture is seated upright in a chair. Feet are flat on the floor, hands resting gently on the thighs or knees, spine upright, eyes closed. The body is relaxed yet alert -- grounded and receptive.

---

#### Slide: Grounding Cord
**Image:** `7-Groundingcord.PNG` / reimagined version

> The grounding cord is an energetic connection that extends from the base of the spine (first chakra) downward into the center of the Earth. It anchors your energy body to the planet, providing stability, safety, and a channel for releasing unwanted energy.

---

#### Slide: Golden Sun
**Image:** `8-golden-sun.PNG` / reimagined version

> The Golden Sun is a tool for replenishing and restoring your own energy. Visualize a radiant golden sun above your head. It calls back your own life-force energy from wherever you may have left it -- in people, places, situations, or time. It fills you with your own highest vibration.

---

#### Slide: An Exercise to Feel Your Aura
**Image:** `9-aura-exercise .PNG` / reimagined version

> The aura is the energetic field that surrounds your physical body. This exercise helps you become aware of its presence, its edges, and its quality. The aura consists of multiple layers radiating outward from the body.

---

#### Slide: Grounding Cord (with Aura)
**Image:** `10-Grounding cord expand .PNG` / reimagined version

> Once you are aware of your aura, the grounding cord practice deepens. You ground not only the physical body but also the aura itself -- allowing the entire energy field to anchor into the Earth.

---

#### Slide: Full Meditation Setup
**Image:** `11-expansion-grounding-cord.PNG` + `11aExpand auragoldensunexpanded.PNG` / reimagined versions

> The complete foundational setup combines all three elements: the person is seated in proper posture, enclosed within their aura, with the grounding cord descending into the earth and the golden sun shining above the crown.

---

#### Slide: Circuit of the Energy of the Earth
**Image:** `Circuitofthenergyofearth.PNG` / reimagined version

> The Earth circuit is an energetic pathway that draws the energy of the Earth upward through the feet, rising through the legs and into the body. This circuit connects you to the grounding, nourishing, stabilizing force of the planet.

---

#### Slide: Circuit of the Energy of the Cosmos
**Image:** `12Circuitofenergycismos .PNG` / reimagined version

> The Cosmic circuit is an energetic pathway that draws cosmic energy downward through the crown of the head (7th chakra) and into the body. This circuit connects you to the higher frequencies of universal consciousness, inspiration, and spiritual guidance.

---

#### Slide: Circuit of Energy of Cosmos and Earth
**Image:** `13cosmosearth.PNG` / reimagined version

> When both circuits are activated simultaneously, the energies of the Earth and Cosmos flow together through the body. Earth energy rises from below; Cosmic energy descends from above. They meet and blend within the body, creating a unified field of balanced, integrated energy.

---

#### Slide: The Rose (as Energetic Tool)
**Image:** `5-the-rose.PNG` / reimagined version (or new illustration showing roots, stem, bloom in detail)

> The Rose is used as a living energetic instrument throughout the practice. It has roots (connection to source), a stem (channel of energy), and a bloom (the active, radiant tool). The Rose can be placed, moved, opened, closed, and released according to the needs of the meditation.

---

#### Slide: Roses of Protection, Observation and Separation
**Image:** *Needs to be created*

> Roses are placed at the edges of the aura to serve as energetic sentinels. They perform three functions:
>
> 1. **Protection** -- They define and guard the boundary of your aura
> 2. **Observation** -- They help you notice what energies are approaching or interacting with your field
> 3. **Separation** -- They create healthy energetic distinction between your energy and the energy of others

---

#### Slide: Cleansing Rose
**Image:** *Needs to be created*

> The Cleansing Rose is placed outside of the aura. It is used to absorb and transmute foreign or stagnant energy from within your field. Energy that does not belong to you -- from other people, environments, or experiences -- is drawn out of the aura and into the Cleansing Rose, where it is neutralized.

---

#### Slide: Energy Recovery of Each Chakra
**Image:** *Needs to be created*

> After cleansing, the Rose is used to recover your own energy that has been left in or taken by others. The Rose is sent out as an instrument to gather and return your own life-force energy to each chakra, restoring fullness and sovereignty to each energy center.

---

#### Slide: Discharge Excess Energy
**Image:** *Needs to be created*

> After deep meditation or energy work, excess energy may accumulate in the body. To discharge it, lean forward from the seated position with hands reaching toward the ground. Allow the excess energy to flow out through the hands and into the earth, returning the body to a calm, balanced state.

---

### LEVEL 2

---

#### Slide: Let's Create Your Sacred Space
**Image:** *Needs to be created (sacred space grid)*

> Level 2 begins with creating your own sacred space -- an internal energetic environment that serves as your meditation home. This is the space from which all deeper work is conducted.

---

#### Slide: The 6th and 7th Chakras
**Image:** *Needs to be created*

> Understanding the locations and roles of the upper chakras is essential for Level 2 work:
>
> - **6th Chakra (Third Eye)** -- Located at the center of the forehead, between and slightly above the eyebrows
> - **7th Chakra (Crown)** -- Located at the top of the head

---

#### Slide: Let's Prepare Your Physical Space
**Image:** *(Text-only slide, or subtle illustration)*

> Before meditation, prepare your physical environment to support the energetic work. The external space should mirror the internal intention: clean, clear, quiet, and intentionally held.

---

#### Slide: Protection of the Space
**Image:** *Needs to be created*

> The physical meditation space is protected by creating an energetic grid using roses. Golden roses are placed at the four corners (and above/below) of the space, connected by lines of golden energy forming a sacred geometric structure -- a container for the work.

---

#### Slide: Cleansing of the Space
**Image:** *Needs to be created*

> Once the space is protected, it is cleansed. A large Cleansing Rose is placed above the grid, and golden energy pours downward through the entire structure, clearing all foreign, stagnant, or disruptive energies from the space.

---

#### Slide: Owning Your Space
**Image:** *Needs to be created*

> After protection and cleansing, you claim ownership of the space. This is an act of energetic sovereignty -- declaring the space as yours, filling it with your own energy and intention. The space becomes an extension of your aura and your practice.

---

#### Slide: Let's Talk About Chakras
**Image:** *(Text-only slide or simple illustration)*

> The chakra system is the energetic anatomy of the human body. There are seven primary chakras, each governing specific aspects of physical, emotional, mental, and spiritual life.

---

#### Slide: The Seven Chakras
**Image:** *Needs to be created (body map with all 7 chakra points)*

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

#### Slide: Root Chakra
**Image:** Body illustration emphasizing Root Chakra location, dominant red color

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

#### Slide: Sacral Chakra
**Image:** Body illustration emphasizing Sacral Chakra location, dominant orange color

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

#### Slide: Solar Plexus Chakra
**Image:** Body illustration emphasizing Solar Plexus location, dominant yellow color

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

#### Slide: Heart Chakra
**Image:** Body illustration emphasizing Heart location, dominant green/pink color

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

#### Slide: Throat Chakra
**Image:** Body illustration emphasizing Throat location, dominant light blue color

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

#### Slide: Third Eye Chakra
**Image:** Body illustration emphasizing Third Eye location, dominant indigo color

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

#### Slide: Crown Chakra
**Image:** Body illustration emphasizing Crown location, dominant violet/white color

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

#### Slide: Cleansing of Each Aura Layer
**Image:** *Needs to be created*

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

#### Slide: Cleansing of Each Chakra
**Image:** *Needs to be created*

> Each individual chakra is cleansed using roses. The roses address two dimensions:
>
> - **Dynamics of the Past** -- Energetic patterns, imprints, and blockages carried from past experiences
> - **Dynamics of the Present** -- Current energetic influences, relationships, and situations affecting the chakra

---

#### Slide: Energy Recovery of Each Chakra (Level 2)
**Image:** *Needs to be created (or reimagined from Level 1 version)*

> After cleansing, the energy recovery process is repeated at a deeper level. The Rose is sent out to gather and return your own energy to each individual chakra, restoring sovereignty, vitality, and wholeness to each energy center.

---

#### Slide: Golden Sticky Roses -- Phase 1 (Chakra Placement)
**Image:** *Needs to be created*

> Golden sticky roses are placed on each of the seven chakras, drawing out foreign energy lodged in the energy centers.

---

#### Slide: Golden Sticky Roses -- Phase 2 (Body Placement)
**Image:** *Needs to be created*

> Golden sticky roses are placed at the joints and extremities of the body -- shoulders, elbows, wrists, hands, hips, knees, ankles, feet -- drawing out foreign energy stored in the physical body.

---

#### Slide: Golden Sticky Roses -- Phase 3 (Full Body Coverage)
**Image:** *Needs to be created*

> Golden sticky roses are placed throughout the entire body -- covering the torso, limbs, and all remaining areas -- for a thorough, complete energetic cleansing.

---

#### Slide: Golden Sticky Roses -- Phase 4 (Integration)
**Image:** *Needs to be created*

> After the golden sticky roses have done their work, a large Golden Rose appears above the head. All foreign energy gathered by the sticky roses is released, and the entire body is bathed in golden light -- restoring, sealing, and integrating the energy body.

---

### LEVEL 3

---

#### Slide: The Analyzer
**Image:** *Needs to be created*

> The Analyzer is an advanced tool introduced in Level 3. It is an energetic point located at the back of the head, at the base of the skull (the occipital ridge / brainstem area). The Analyzer is used for deeper perception, reading, and discernment of energy -- a tool for precise energetic analysis.

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

- **Level 1 (Foundations):** Posture, grounding, golden sun, aura awareness, circuits, roses of protection, cleansing, recovery, discharge
- **Level 2 (Sacred Space + Chakra Activation):** Creating sacred space, protecting and cleansing the space, owning the space, chakra deep dive, aura layer cleansing, chakra cleansing (past and present dynamics), energy recovery, golden sticky roses (4 phases)
- **Level 3 (Advanced Perception):** The Analyzer -- energetic point at the base of the skull for deeper perception, reading, and discernment

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

The existing drawings and logo are references to the original stick-and-line style from the tradition's history. The current logo also represents the past logo. The new design should pay homage to this history -- honoring the old while creating a new, elevated rendition.

### Working with Two Image Sets

| Image Set | Location | Purpose |
|-----------|----------|---------|
| **Originals** | `public/rose med images/` | Accuracy reference -- shows exactly what each energetic structure should depict |
| **Reimagined** | `public/rose med images/reimagined/` | Modernized versions in the ROSES OS brand language |
| **Original PDF** | `docs/source-materials/MDR - VISUAL SUPPORT - FEB2024.pdf` | The complete 46-page original visual presentation |

**Designer workflow:**
1. Review the original image for each concept to understand what must be shown
2. Review the reimagined version (if available) for the target aesthetic
3. Where no reimagined version exists, create a new illustration that honors the original's accuracy while matching the reimagined style
4. Both originals and reimagined images should be accessible on the website -- the originals serve as a supplementary reference that teachers may prefer for their accuracy

### Rose Depiction Rule

Roses in this system are always depicted as a stem and a flower only -- never with thorns or leaves.

### Rose Imagery in Opening Pages

Where a logo is called for in the opening slides (Sections 1--3), use both the rose logo (minimal line icon) and a realistic rose image. These set the visual tone for the manual.

### Figure Diversity

Body placement visuals should represent diverse people -- a variety of body shapes, sizes, and ethnicities. Figures should reflect the whole world, like the United Nations. No single type of person should dominate the imagery.

### Non-Chakra Teaching Slides

Slides illustrating meditation techniques (grounding cord, golden sun, aura layers, roses of protection, etc.) should be specific in the lines and patterns shown. The imagery needs to accurately depict the energetic structures being taught.

### Chakra Section Imagery

The chakra pages do not need the rose logo. The designer has creative freedom here -- the priority is helping viewers clearly understand where in the body each chakra is located. Each chakra page should emphasize that chakra's color -- vibrant yet subtle, applied cohesively across the section. The designer has discretion on how the color is expressed (background wash, glow, accent, etc.).

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

A "Download PDF" button at the top of the teaching section exports the entire manual as a formatted PDF designed for print or offline reference.

**Requirements:**

- PDF mirrors the web layout as closely as possible
- Branded template: ROSES OS wordmark, Aura White background, consistent margins and typography
- Formatted for both screen reading and print (A4 / Letter)
- Cormorant Garamond for headers, Inter for body
- Illustrations and diagrams render cleanly (SVG preferred)
- Page numbers and section headers in footer
- Subtle brand texture on each page (light enough to print cleanly)

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
- [ ] Review original images in `public/rose med images/` -- these are the accuracy reference
- [ ] Review reimagined images in `public/rose med images/reimagined/` -- these are the aesthetic target
- [ ] Review live site [rosesos.com](https://rosesos.com) for current visual reference
- [ ] Review source Keynote file: `docs/source-materials/Rose + Aura - Invite .key`
- [ ] Design the password-protected entry gate
- [ ] Build Introduction pages (purpose, posture, safety)
- [ ] Build Energetic Foundations pages -- each with image (original or reimagined) + teaching text
- [ ] Create or refine illustrations for concepts without reimagined images (see "Images Still Needed" table)
- [ ] Build Chakra 1--7 pages (one per chakra, consistent layout, with teaching text)
- [ ] Build Level-specific teaching flow pages (Level 1, 2, 3)
- [ ] Build Teaching Agreements pages
- [ ] Ensure each slide pairs an image with its corresponding teaching text from Section 4 of this document
- [ ] Design the PDF export (full manual as downloadable PDF)
- [ ] Review all pages for consistency (layout, color, typography)
- [ ] Test on tablet and laptop (teachers will use these devices during live sessions)

---

## REFERENCE DOCUMENTS

| Document | Path |
|----------|------|
| Teaching Manual (source content & words) | `docs/training/mdr-teachers-training-manual.md` |
| MDR Plan (source plan) | `docs/source-materials/plan-mdr.md` |
| Original Visual Presentation (46 pages) | `docs/source-materials/MDR - VISUAL SUPPORT - FEB2024.pdf` |
| Original Images (hand-drawn) | `public/rose med images/` |
| Reimagined Images (modernized) | `public/rose med images/reimagined/` |
| Brand DNA | `docs/brand/brand-dna.md` |
| Source Keynote | `docs/source-materials/Rose + Aura - Invite .key` |
| Master Designer Plan | `docs/project-plan-for-designer.md` |

---

## LANGUAGE VERSIONS

**Phase 1:** English (primary)

Future phases: Portuguese, Spanish -- identical layouts, text-only swaps.
