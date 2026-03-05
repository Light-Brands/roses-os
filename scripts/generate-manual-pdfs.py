"""
Generate branded ROSES OS student manual PDFs using weasyprint.
Applies the website aesthetic: Cormorant Garamond + Inter, warm palette.
"""

import weasyprint

# =============================================================================
# BRAND STYLES (matching ROSES OS website)
# =============================================================================

BRAND_CSS = """
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600&family=Inter:wght@300;400;500;600&display=swap');

@page {
  size: A4;
  margin: 2.5cm 2.5cm 3cm 2.5cm;
  background: #F7F5F2;

  @bottom-center {
    content: counter(page);
    font-family: 'Inter', sans-serif;
    font-size: 9pt;
    color: #9C6F6E;
  }

  @bottom-right {
    content: 'ROSES OS';
    font-family: 'Inter', sans-serif;
    font-size: 8pt;
    font-weight: 500;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #B5A89D;
  }
}

@page :first {
  @bottom-center { content: none; }
  @bottom-right { content: none; }
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 10.5pt;
  line-height: 1.7;
  color: #3F3E3C;
  background: #F7F5F2;
}

/* Cover Page */
.cover {
  page-break-after: always;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  min-height: 85vh;
  padding: 4cm 2cm;
}

.cover-eyebrow {
  font-family: 'Inter', sans-serif;
  font-size: 9pt;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #9E956B;
  margin-bottom: 1.5cm;
}

.cover-title {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 36pt;
  font-weight: 400;
  color: #3F3E3C;
  letter-spacing: 0.02em;
  margin-bottom: 0.8cm;
}

.cover-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 11pt;
  font-weight: 300;
  color: #8C7E73;
  max-width: 28em;
  line-height: 1.6;
  margin-bottom: 2cm;
}

.cover-divider {
  width: 60px;
  height: 1px;
  background: #9E956B;
  margin: 0 auto 1.5cm auto;
}

.cover-brand {
  font-family: 'Inter', sans-serif;
  font-size: 9pt;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #B5A89D;
}

.cover-note {
  font-family: 'Inter', sans-serif;
  font-size: 8.5pt;
  color: #8C7E73;
  margin-top: 1.5cm;
  max-width: 30em;
  line-height: 1.5;
  font-style: italic;
}

/* Copyright Page */
.copyright {
  page-break-after: always;
  padding-top: 3cm;
}

.copyright p {
  font-size: 9pt;
  color: #8C7E73;
  line-height: 1.6;
  margin-bottom: 0.8em;
}

/* Section Headers */
h1 {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 28pt;
  font-weight: 400;
  color: #3F3E3C;
  letter-spacing: 0.02em;
  margin-bottom: 0.6cm;
  margin-top: 1cm;
}

h2 {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 20pt;
  font-weight: 400;
  color: #9C6F6E;
  margin-top: 1.2cm;
  margin-bottom: 0.5cm;
  padding-bottom: 0.3cm;
  border-bottom: 1px solid #E8E0D8;
}

h3 {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 15pt;
  font-weight: 500;
  color: #3F3E3C;
  margin-top: 0.8cm;
  margin-bottom: 0.3cm;
}

h4 {
  font-family: 'Inter', sans-serif;
  font-size: 10pt;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #9E956B;
  margin-top: 0.6cm;
  margin-bottom: 0.3cm;
}

/* Body Text */
p {
  margin-bottom: 0.5cm;
  line-height: 1.7;
}

/* Lists */
ul, ol {
  margin-left: 1.2em;
  margin-bottom: 0.5cm;
}

li {
  margin-bottom: 0.25cm;
  line-height: 1.6;
}

li::marker {
  color: #9E956B;
}

/* Callout / Emphasis Boxes */
.callout {
  background: #F5E8E2;
  border-left: 3px solid #9E956B;
  padding: 0.6cm 0.8cm;
  margin: 0.6cm 0;
  border-radius: 0 8px 8px 0;
}

.callout p {
  margin-bottom: 0.2cm;
  font-size: 10pt;
}

/* Highlighted Quote */
.highlight {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 13pt;
  font-style: italic;
  color: #9C6F6E;
  text-align: center;
  padding: 0.8cm 1.5cm;
  margin: 1cm 0;
  border-top: 1px solid #E8E0D8;
  border-bottom: 1px solid #E8E0D8;
}

/* Section Divider */
.divider {
  width: 40px;
  height: 1px;
  background: #9E956B;
  margin: 1cm auto;
}

/* Page Break */
.page-break {
  page-break-before: always;
}

/* Technique Module */
.technique {
  margin-top: 0.8cm;
  margin-bottom: 0.8cm;
}

/* Steps */
.steps {
  counter-reset: step;
  list-style: none;
  margin-left: 0;
}

.steps li {
  counter-increment: step;
  padding-left: 1.8em;
  position: relative;
}

.steps li::before {
  content: counter(step) ".";
  position: absolute;
  left: 0;
  font-weight: 600;
  color: #9E956B;
}

/* Chakra Colors */
.chakra-1 { border-left-color: #C0392B; }
.chakra-2 { border-left-color: #E67E22; }
.chakra-3 { border-left-color: #F1C40F; }
.chakra-4 { border-left-color: #27AE60; }
.chakra-5 { border-left-color: #5DADE2; }
.chakra-6 { border-left-color: #2E4053; }
.chakra-7 { border-left-color: #8E44AD; }

/* Chakra List */
.chakra-list {
  list-style: none;
  margin-left: 0;
}

.chakra-list li {
  padding: 0.25cm 0.5cm;
  margin-bottom: 0.2cm;
  border-left: 3px solid #E8E0D8;
  font-size: 10pt;
}

/* Elements Summary Box */
.elements-box {
  background: #F5E8E2;
  border-radius: 8px;
  padding: 0.8cm 1cm;
  margin: 1cm 0;
}

.elements-box h3 {
  color: #9C6F6E;
  margin-top: 0;
  margin-bottom: 0.4cm;
}

.elements-box ul {
  list-style: none;
  margin-left: 0;
  columns: 2;
  column-gap: 1cm;
}

.elements-box li {
  padding-left: 1em;
  position: relative;
  margin-bottom: 0.2cm;
  font-size: 9.5pt;
  break-inside: avoid;
}

.elements-box li::before {
  content: '\\2022';
  position: absolute;
  left: 0;
  color: #9E956B;
}

/* Image Placeholder */
.image-placeholder {
  border: 2px dashed #C4B8AE;
  border-radius: 8px;
  background: #F0EBE6;
  padding: 1.2cm 1cm;
  margin: 0.8cm 0;
  text-align: center;
  page-break-inside: avoid;
}

.image-placeholder .ph-icon {
  font-size: 18pt;
  color: #B5A89D;
  margin-bottom: 0.3cm;
}

.image-placeholder .ph-label {
  font-family: 'Inter', sans-serif;
  font-size: 9pt;
  font-weight: 500;
  color: #9C6F6E;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 0.2cm;
}

.image-placeholder .ph-desc {
  font-family: 'Inter', sans-serif;
  font-size: 8.5pt;
  color: #8C7E73;
  line-height: 1.5;
  max-width: 30em;
  margin: 0 auto;
}

.image-placeholder .ph-ref {
  font-family: 'Inter', sans-serif;
  font-size: 7.5pt;
  color: #B5A89D;
  margin-top: 0.3cm;
  font-style: italic;
}

/* End Page */
.end-page {
  page-break-before: always;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  min-height: 60vh;
  padding: 4cm 2cm;
}

.end-page p {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 14pt;
  color: #9C6F6E;
  font-style: italic;
}
"""

# =============================================================================
# LEVEL 2 MANUAL HTML
# =============================================================================

LEVEL_2_HTML = """<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>ROSES OS — Level 2 Manual</title></head>
<body>

<!-- COVER -->
<div class="cover">
  <p class="cover-eyebrow">Student Manual</p>
  <h1 class="cover-title">Level 2</h1>
  <p class="cover-subtitle">Sacred Space, Chakra Cleansing &amp; Energy Recovery</p>
  <div class="cover-divider"></div>
  <p class="cover-brand">ROSES OS</p>
  <p class="cover-note">Teachings by Angelina Ataíde. This manual is for initiated students only. Please do not share this information.</p>
</div>

<!-- COPYRIGHT -->
<div class="copyright">
  <p><strong>Teachings by Angelina Ataíde</strong></p>
  <p>No part of this manual may be reproduced and/or shown to people who have not attended a Rose Meditation Course.</p>
  <p>Teaching the Rose Meditation and Aura Reading requires specific training, as well as a lot of experience with Aura Reading and energy work. Therefore, for your own protection, please do not share this information.</p>
  <p>Illustrations: Saraswati Noemi, Cecilia Lynch, Drica Voivodic</p>
  <p style="margin-top: 1cm; font-size: 8pt; color: #B5A89D;">2021 Review &bull; ROSES OS 2026 Edition</p>
</div>

<!-- SACRED SPACE -->
<h2>Sacred Space — Center of the Head</h2>

<div class="image-placeholder">
  <div class="ph-icon">&#9702;</div>
  <p class="ph-label">Illustration — Sacred Space</p>
  <p class="ph-desc">Person seated in meditation posture with the center of the head illuminated — the sacred space where the Spirit resides and from which all energy work is conducted.</p>
  <p class="ph-ref">Ref: Slide 19 — Sacred Space</p>
</div>

<p>Place yourself in the center of your head, in your sacred space, where you are safe and aware of your energetic authority. It is from there that you can do the Rose Meditation or any energy work safely, clearly, clairvoyantly and saving your energy.</p>

<p>This space is dedicated to your Spirit, which is the purest part of you. It should always be tightly closed and protected. Go to this place whenever you do the Rose Meditation or whenever you need to make important decisions and want to be in alignment with your spiritual essence.</p>

<div class="divider"></div>

<!-- PREPARING THE SPACE -->
<h2>Preparing the Space</h2>

<h3>Preparing the Room</h3>

<div class="image-placeholder">
  <div class="ph-icon">&#9702;</div>
  <p class="ph-label">Illustration — Room Protection</p>
  <p class="ph-desc">Room with 4 Golden Roses at the corners, golden lines connecting from the top four corners to the ceiling center and bottom four corners to the floor center, with a vertical golden line unifying them. A transparent grounding cord descends from the center of the floor to the Earth.</p>
  <p class="ph-ref">Ref: Slide 20 — Protection of the Space</p>
</div>

<p>Now prepare the room you're in so that it's clean and protected:</p>

<ul>
  <li>Create 4 Golden Roses, each with a golden stem and a golden grounding cord.</li>
  <li>Create 4 golden lines from the top four corners of the room, which join in the center of the room at the ceiling.</li>
  <li>Create 4 golden lines coming from the four lower corners of the room, which join in the center of the room, on the floor.</li>
  <li>Create a golden line that runs from the point where the upper lines join to the point where the lower lines join, unifying the energy in the room.</li>
</ul>

<h3>Owning Your Space</h3>

<div class="image-placeholder">
  <div class="ph-icon">&#9702;</div>
  <p class="ph-label">Illustration — Owning Your Space</p>
  <p class="ph-desc">Person seated within the golden grid room. Four golden lines extend from the crown chakra to the top four corners, and four golden lines from the root chakra to the bottom four corners — establishing energetic authority over the space.</p>
  <p class="ph-ref">Ref: Slide 22 — Owning Your Space</p>
</div>

<p>Own the room to have authority over the space where you are meditating:</p>

<ul>
  <li>From the point where the lower lines join, create a transparent grounding cord that goes to the center of the Earth and expand it laterally to the edges of the room.</li>
  <li>See the whole room and everything in it vibrating in gold.</li>
  <li>Create a large golden Rose (not sticky), the size of the room, which descends from the center of the Universe, enters through the top of the room, cleanses the space and descends through the grounding cord.</li>
  <li>Create 4 golden lines that go from the crown chakra to the top 4 corners of the room.</li>
  <li>Create 4 golden lines running from the root chakra to the four bottom corners of the room.</li>
</ul>

<div class="callout">
  <h4>Remarks</h4>
  <p>Use these techniques to cleanse and protect your home, your workspaces, anywhere you go to sleep or meditate.</p>
  <p>If you're going to meditate in an open-air space, create a dome or golden room around you and do all the techniques as if you were indoors.</p>
  <p>Don't use these techniques to cleanse the energy of public spaces, such as restaurants, airports, banks, etc. If you're going to meditate in a public space, it's best to create a golden dome around you as if you were in an open space.</p>
  <p>You can use these techniques for a room, for example the room where you're meditating, or for the whole house or land.</p>
</div>

<!-- CHAKRA CLEANSING -->
<div class="page-break"></div>
<h2>Chakra Cleansing</h2>

<div class="image-placeholder">
  <div class="ph-icon">&#9702;</div>
  <p class="ph-label">Illustration — Chakra Cleansing</p>
  <p class="ph-desc">Person seated in meditation with two grounded roses placed outside the aura — one in front and one behind — at the level of a chakra. The roses act like magnets, drawing out foreign energy. The front rose cleanses present energies, the back rose cleanses past energies.</p>
  <p class="ph-ref">Ref: Slide 24 — Cleansing of Each Chakra</p>
</div>

<p>Start cleansing the chakras by creating and exploding roses. Roses work like a vacuum cleaner or magnet and suck in energies that don't belong to you:</p>

<ul>
  <li>On the outside of the Aura, create two grounded red Roses, one behind you and one in front, both at the level of your first chakra. We intend them to cleanse the chakra deeply, removing energies that are not yours. The front Rose cleanses mainly energies from the present and the back Rose cleanses mainly energies from the past (you can do one at a time).</li>
  <li>Create and explode several Roses to cleanse your chakra.</li>
  <li>Now create an unrooted red Rose corresponding to the first chakra (at the height of the chakra). The layer cleanses out of your Aura and create a new Rose.</li>
  <li>Create and explode several Roses to cleanse the layers of your Aura.</li>
  <li>When you feel the need, create a red Rose grounded at the level of the first chakra, outside the Aura. Intend that this Rose absorbs all your energy dispersed in this vibration. Explode this Rose and your energy will return to you elevated in vibration and purified.</li>
  <li>When you feel the need, explode this Rose out of your Aura and create a new Rose.</li>
</ul>

<div class="image-placeholder">
  <div class="ph-icon">&#9702;</div>
  <p class="ph-label">Illustration — Aura Layer Cleansing</p>
  <p class="ph-desc">Person seated within their aura, showing an unrooted rose at the level of a chakra cleansing the corresponding aura layer. The seven aura layers are visible radiating outward from the body.</p>
  <p class="ph-ref">Ref: Slide 25 — Cleansing of Each Aura Layer</p>
</div>

<p>This procedure should be done equally for all the other chakras, starting from the first and going through each chakra in ascending order up to the seventh chakra:</p>

<div class="image-placeholder">
  <div class="ph-icon">&#9702;</div>
  <p class="ph-label">Illustration — The Seven Chakras</p>
  <p class="ph-desc">Diagram of the human body showing all seven chakras aligned from root to crown with their corresponding colors: Red (1st), Orange (2nd), Yellow (3rd), Green/Pink (4th), Sky Blue (5th), Indigo (6th), Violet (7th).</p>
  <p class="ph-ref">Ref: Slide 23 — The Seven Chakras</p>
</div>

<ul class="chakra-list">
  <li class="chakra-1">1st Chakra (Root) — Red</li>
  <li class="chakra-2">2nd Chakra (Sacral) — Orange</li>
  <li class="chakra-3">3rd Chakra (Solar Plexus) — Yellow</li>
  <li class="chakra-4">4th Chakra (Heart) — Pink and Green (do both vibrations)</li>
  <li class="chakra-5">5th Chakra (Throat) — Sky Blue</li>
  <li class="chakra-6">6th Chakra (Third Eye) — Indigo Blue</li>
  <li class="chakra-7">7th Chakra (Crown) — Violet</li>
</ul>

<!-- GOLDEN STICKY ROSES -->
<div class="page-break"></div>
<h2>Golden Sticky Roses</h2>

<p>Create four golden sticky Roses. One at a time, they enter through the crown chakra, cleansing and traveling through our body as follows:</p>

<ul>
  <li><strong>The first:</strong> it enters through the crown chakra, cleansing all the chakras up to the root chakra, and exits through the grounding cord.</li>
</ul>

<div class="image-placeholder">
  <div class="ph-icon">&#9702;</div>
  <p class="ph-label">Illustration — Golden Sticky Rose: Phase 1</p>
  <p class="ph-desc">A golden sticky rose enters through the crown chakra and travels downward through all seven chakras, exiting through the grounding cord.</p>
  <p class="ph-ref">Ref: Slide 26 — Golden Sticky Roses Phase 1</p>
</div>

<ul>
  <li><strong>The second:</strong> it enters through the crown chakra, descends to the throat chakra, splits into two Roses that follow the channels of the arms, exiting through the chakras of the hands, and explode outside the Aura or exit through the grounding cord.</li>
</ul>

<div class="image-placeholder">
  <div class="ph-icon">&#9702;</div>
  <p class="ph-label">Illustration — Golden Sticky Rose: Phase 2</p>
  <p class="ph-desc">A golden sticky rose enters through the crown, descends to the throat chakra, then splits into two roses that travel down the arms and exit through the hands.</p>
  <p class="ph-ref">Ref: Slide 27 — Golden Sticky Roses Phase 2</p>
</div>

<ul>
  <li><strong>The third:</strong> it enters through the crown chakra, descends to the root chakra, turns into two Roses that follow the channels of the legs, exit through the foot chakras and explode outside the Aura or exit through the grounding cord.</li>
</ul>

<div class="image-placeholder">
  <div class="ph-icon">&#9702;</div>
  <p class="ph-label">Illustration — Golden Sticky Rose: Phase 3</p>
  <p class="ph-desc">A golden sticky rose enters through the crown, descends to the root chakra, then splits into two roses that travel down the legs and exit through the feet.</p>
  <p class="ph-ref">Ref: Slide 28 — Golden Sticky Roses Phase 3</p>
</div>

<ul>
  <li><strong>The fourth:</strong> it has a size that spans the entire width of the Aura, it enters and descends, cleansing our entire Aura, and exits through the grounding cord.</li>
</ul>

<div class="image-placeholder">
  <div class="ph-icon">&#9702;</div>
  <p class="ph-label">Illustration — Golden Sticky Rose: Phase 4</p>
  <p class="ph-desc">A large golden rose spans the entire width of the aura, descending from above and cleansing the whole aura as it passes through and exits via the grounding cord. The body is bathed in golden light.</p>
  <p class="ph-ref">Ref: Slide 29 — Golden Sticky Roses Phase 4</p>
</div>

<!-- ELEMENTS SUMMARY -->
<div class="page-break"></div>
<div class="elements-box">
  <h3>Elements of Rose Meditation — Levels 1 &amp; 2</h3>
  <ul>
    <li>Grounding cord</li>
    <li>Golden Sun</li>
    <li>Aura boundaries and cord expansion</li>
    <li>Roses of protection, separation and observation</li>
    <li>Energies of the Earth and Cosmos</li>
    <li>Cleansing Rose</li>
    <li>Energy Recovery Rose</li>
    <li>Sacred space</li>
    <li>Space protection</li>
    <li>Cleansing the Chakras and Aura Layers</li>
    <li>Golden Sticky Roses</li>
  </ul>
</div>

<h3>To End the Meditation</h3>
<ul>
  <li>Cut the grounding cord and create a new one.</li>
  <li>Fill yourself with the Golden Sun.</li>
  <li>Place your hands on the floor to release excess energy.</li>
</ul>

<div class="highlight">
  Yes! Now you are ready for a beautiful day!
</div>

<!-- END -->
<div class="end-page">
  <div class="cover-divider"></div>
  <p>ROSES OS</p>
  <p style="font-size: 10pt; margin-top: 0.5cm; color: #B5A89D; font-style: normal; font-family: Inter, sans-serif;">rosesos.com</p>
</div>

</body>
</html>"""

# =============================================================================
# LEVEL 3 MANUAL HTML
# =============================================================================

LEVEL_3_HTML = """<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>ROSES OS — Level 3 Manual</title></head>
<body>

<!-- COVER -->
<div class="cover">
  <p class="cover-eyebrow">Student Manual</p>
  <h1 class="cover-title">Level 3</h1>
  <p class="cover-subtitle">Advanced Perception, The Analyzer &amp; Creating Reality</p>
  <div class="cover-divider"></div>
  <p class="cover-brand">ROSES OS</p>
  <p class="cover-note">Teachings by Angelina Ataíde. This manual is for initiated students only. Please do not share this information.</p>
</div>

<!-- COPYRIGHT -->
<div class="copyright">
  <p><strong>Teachings by Angelina Ataíde</strong></p>
  <p>No part of this manual may be reproduced and/or shown to people who have not attended a Level 3 Rose Meditation Course.</p>
  <p>Teaching the Rose Meditation and Aura Reading requires specific training, as well as a lot of experience with Aura Reading and energy work. Therefore, for your own protection, please do not share this information.</p>
  <p>Illustrations: Saraswati Noemi, Cecilia Lynch, Drica Voivodic</p>
  <p style="margin-top: 1cm; font-size: 8pt; color: #B5A89D;">2021 Review &bull; ROSES OS 2026 Edition</p>
</div>

<!-- INTRODUCTION -->
<h2>Introduction</h2>

<p>Rose Meditation is a tool for cleansing the aura and the seven main chakras, providing protection and energy balance. Through this technique it is possible to release blocked energies, energies that are not ours, become aware of our life force and deprogram patterns that prevent direct contact with our essence.</p>

<div class="highlight">
  Roses represent the Spirit. Roses absorb all the energies, emotions and situations that don't belong to you or that no longer serve your present moment. We can create and explode them as many times as necessary.
</div>

<!-- 5 BODIES -->
<div class="page-break"></div>
<h2>The 5 Bodies &amp; 5 Levels of Existence</h2>

<p>Everything that manifests itself in matter has an origin on a spiritual level. Everything is also energy. The denser the energy, the more it moves towards manifestation and thus comes into existence in a way that we can perceive objectively.</p>

<h3>1. Spiritual</h3>
<p>On the spiritual level, everything is perfect and complete. Here there is no suffering or adversity. It is the field of learning, where the existence of each event, relationship or being is determined. There is no value judgment here. There is no right or wrong, good or bad. It simply is. It's where we can find answers to what may seem unfair or cruel from our limited perspective.</p>

<h3>2. Energetic</h3>
<p>This is the field of the subtle, of potential, of vibration. It's where our Aura is formed and where we work in Rose Meditation. This is where everything that will one day manifest in matter can already be felt, but where there is also much more. It's where non-incarnate energies or entities act. When we have deep and meaningful relationships, it is in the energetic body that we form cords that bind us and through which we continue to feel the other beyond time and space.</p>

<h3>3. Mental</h3>
<p>When the subtle energies densify, the first place we perceive them is in the world of ideas, thoughts, programs and beliefs. The ideas we have about the world and every element in it are stored in our mental body. Here we confront the reality perceived by the senses with the programs that — within us — dictate how the world should be.</p>

<h3>4. Emotional</h3>
<p>This is where everything we feel stays. We have an emotional body where the marks of the feelings that have passed through us, but which we haven't been able to release, remain. Here is the burden left by the traumas we have experienced throughout our lives. The emotional body connects with the physical body mainly through the organs, which change their functioning depending on the emotions we are feeling.</p>

<h3>5. Physical</h3>
<p>Everything we experience in matter, with our body. It's the world we perceive through our five senses: what we see, hear, touch, smell and taste. The physical plane is the only one that is perceived in the same way (objectively) by everyone. That's why it's the reference and where we can turn to investigate and check what's happening on all the other planes.</p>

<!-- CLEANSING TECHNIQUES -->
<div class="page-break"></div>
<h2>Cleansing Techniques</h2>

<h3>Breaking Spiritual Agreements</h3>

<p>Any relationship can only exist in matter if there has been a spiritual agreement to support that relationship. These agreements can only be created with the consent of both parts on the spiritual level and can be broken by either part through their conscious will.</p>

<p>Sometimes these agreements are in line with our conscious will, for example when two people get married. At other times, they resonate with unconscious desires — this is when things happen that we don't want. However, using this Rose Meditation technique, we can always break these agreement sticks.</p>

<div class="callout">
  <p>This should always be done with great awareness, as it has very real consequences for our lives.</p>
</div>

<h4>To Break Agreements</h4>
<ul>
  <li>Create a high-vibration situation, for example, right after the Rose Meditation.</li>
  <li>View the agreements stick that contains all the agreements you want to break.</li>
  <li>Break the stick into three pieces.</li>
  <li>Create a grounded Rose.</li>
  <li>Place the three pieces of stick in the Rose.</li>
  <li>Explode the Rose out of the Aura.</li>
</ul>

<h3>Cutting Energetic Cords</h3>

<p>We have energetic interactions with people all the time we see them, hear them, touch them and even think about them. And when we form bonds, our auras connect through the cords where energy passes through. That's why we can often feel what's happening with people who are close to us, even if they're far away.</p>

<h4>To Cut Cords</h4>
<ul>
  <li>Close your eyes.</li>
  <li>Visualize your Aura with cords coming out of your chakras.</li>
  <li>Place your dominant hand on the 7th cervical vertebra, which is at the junction of the neck and back, at the level of the 5th chakra.</li>
  <li>Intend that your hand has the power to cut all the cords.</li>
  <li>Make the movement of cutting the cords up to under your 1st chakra, leaning your hand on the chair where you are sitting.</li>
</ul>

<p>We can also cut cords when the relationship hasn't ended, but we feel we need more neutrality. These bonds form again very quickly when we reconnect with the person.</p>

<!-- SEXUAL INTERCOURSE -->
<h3>After Sexual Intercourse</h3>

<p>After a sexual intercourse, if you want to recover your energy that may have remained with the person and return the energy of the person who may have remained with you:</p>

<ul>
  <li>Do the preparation techniques (grounding cord, Golden Sun, energy of the Earth and the Cosmos, sacred space).</li>
  <li>Create an orange Rose and place the person's energy in the Rose (you can visualize the person entering the Rose, the situation, emotions and feelings that may appear at that moment); explode.</li>
  <li>Create an unrooted orange Rose that cleanses the person's energy that may have remained in any layer of their Aura; explode.</li>
  <li>Create a grounded orange Rose and intend for this Rose to recover all your energy that was left with this person; explode.</li>
  <li>If you want to remain energetically separated, cut the energetic cords.</li>
  <li>Create an unrooted pink Rose, place the person on it, visualize the person happy and in complete health. Repeat mentally: "Happy, healthy, complete, body, mind, Spirit." Bring the Rose up towards the center of the Universe.</li>
  <li>Renew your grounding cord.</li>
  <li>Fill yourself with the light of the Golden Sun.</li>
  <li>Place your hands on the floor to discharge excess energy.</li>
</ul>

<!-- CLASSES AND CONSULTATIONS -->
<div class="page-break"></div>
<h2>Classes &amp; Consultations</h2>

<p>When you are working in any field — or when you are a teacher or lecturer — you can use Rose Meditation to maintain your energy integrity.</p>

<h3>Before</h3>
<p>Do all the preparation techniques for the Rose Meditation (grounding cord, Golden Sun, energy of the Earth and the Cosmos, sacred space) and cleanse and protect the physical space where the service or class will take place.</p>

<h3>After</h3>
<p>After saying goodbye to the person you have assisted or the students, take a few moments to reorganize the energies and do the energy separation techniques, because during a class or service many emotional, energetic and spiritual bonds can be formed:</p>

<ul>
  <li>Create a new grounding cord.</li>
  <li>Explode the Roses of separation, protection and observation and create new ones.</li>
  <li>Create a grounded Rose in front of you, call your own energy into the Rose and explode the Rose — this recovers your energy that may have remained in the person(s)' Aura.</li>
  <li>Create a Rose, place the person you have assisted or the students inside the Rose and explode the Rose. This way you return energies that may have remained in your aura.</li>
  <li>Cut the cords that bind your Aura to the other person's Aura.</li>
  <li>In the case of closing contracts, when you no longer have plans to serve the person: break spiritual agreements.</li>
  <li>Create an unrooted pink Rose, place the person(s) on this Rose, visualize the person(s) happy and in complete health. Repeat mentally: "Happy, healthy, complete, body, mind, Spirit." Raise the Rose towards the center of the Universe.</li>
  <li>Do the Golden Sticky Rose cleansing meditation (or the full meditation if necessary).</li>
  <li>Explode the 4 roses in the corners of the room.</li>
  <li>Cut the grounding cord and create a new one.</li>
  <li>Fill yourself with the light of the Golden Sun.</li>
  <li>Eliminate excess energy by placing your hands on the floor.</li>
</ul>

<!-- THE ANALYZER -->
<div class="page-break"></div>
<h2>The Analyzer</h2>

<p>The Analyzer is located inside the head. Its functions are to analyze, judge and criticize. It stores our programs and beliefs. Cleansing the Analyzer and the energies that are stored there allows you to free yourself from limitations that impact your life and also helps you to perceive life in a more objective way.</p>

<p>The cleansing of the Analyzer is done on all the chakra colors. Here is the description for the color red:</p>

<ul>
  <li>See the Analyzer in red.</li>
  <li>Ground the Analyzer to the center of the Earth with a red cord.</li>
  <li>Create a red Rose grounded behind you outside your Aura at the height of the Analyzer.</li>
  <li>The Rose now cleanses the Analyzer in this vibration.</li>
  <li>The Rose comes down through the grounding cord.</li>
  <li>Create a Golden Sticky Rose the size of the Analyzer.</li>
  <li>It enters the Analyzer and spirals inside and out, cleansing away any hidden energy that may have remained there.</li>
  <li>Now see the Analyzer in gold, raising its vibration.</li>
  <li>Now close the Analyzer completely.</li>
  <li>Explode the Rose always outside the Aura.</li>
</ul>

<p>This same procedure should be done with the vibration of all the chakras (orange, yellow, green, pink, sky blue, indigo blue and violet).</p>

<div class="callout">
  <p>When closing the Analyzer you may feel your intuition working more strongly and your rational side may be limited. If you need to use your rational faculties, just intend it and the Analyzer will open again.</p>
</div>

<!-- TRANSMEDIUM CHANNELS -->
<h2>Transmedium Channels</h2>

<p>The Transmedium Channels are located at the back of the neck. It is through them that our Spirit incarnates in our body and through them that disincarnate energies of all kinds can exert an influence on us. Cleansing and closing the Transmedium Channels regularly increases energetic authority and allows us to free ourselves from unwanted habits that are being sustained by tendencies and influences outside of us.</p>

<p>Cleansing the Transmedium Channels is similar to cleansing the Analyzer and is also done on all the chakra colors. For the color red:</p>

<ul>
  <li>See the Transmedium Channels in red.</li>
  <li>Ground the Transmedium Channels to the center of the Earth with a red cord for each one.</li>
  <li>Create two red Roses grounded behind you outside your Aura at the height of the Transmedium Channels (or one Rose that splits in two when it reaches the height of the channels).</li>
  <li>The Roses now clean the Transmedium Channels in this vibration.</li>
  <li>The Roses descend through the grounding cords of the channels.</li>
  <li>Create two golden sticky Roses the size of the Transmedium Channels.</li>
  <li>They enter the channels and spiral clean inside and out, cleansing away any hidden energy that may have remained there.</li>
  <li>Now see the Transmedium Channels in gold, raising their vibration.</li>
  <li>Now close the Transmedium Channels completely 100%.</li>
  <li>Always explode the Roses outside the Aura.</li>
</ul>

<p>This same procedure should be done with the vibration of all the chakras (orange, yellow, green, pink, sky blue, indigo blue and violet).</p>

<!-- CREATING REALITY -->
<div class="page-break"></div>
<h2>Creating Reality</h2>

<h3>Impeccability</h3>

<p>We humans are complex beings endowed with the ability to create worlds within ourselves through our imagination, our mind. This allows us to create complex worlds outside ourselves too. The reality we live in today is the fruit of what we have planted in the past, whether in this life or in previous lives. If we want to transform the reality around us, we must pay attention to how we are living and begin a process of transformation from inside out.</p>

<p>We often experience unwanted realities, but we don't know why we can't manifest what we really want. This is because different parts of us are trying to move in different directions at the same time using the same body. This is not possible and causes stagnation. The science of creating reality involves learning to be impeccable with ourselves, putting our energy and our chakras all in the same direction.</p>

<div class="callout">
  <p><strong>Intention</strong> — want / ask / pray — connected to the 7th chakra</p>
  <p><strong>Thinking</strong> — I think / imagine / see — connected to the 6th chakra</p>
  <p><strong>Word</strong> — I say / talk / ponder — linked to the 5th chakra</p>
  <p><strong>Feeling</strong> — feel / digest / alchemize — connected to the 2nd and 4th chakras</p>
  <p><strong>Action</strong> — act / do / renounce — connected to the 1st and 3rd chakras</p>
</div>

<h3>Mock-Up</h3>

<p>This is a technique for manifesting things or situations on the physical plane. It is important to note that this technique should only be used for yourself — it cannot be done for someone else. It must be done 7 days in a row to be effective and it must be done for one goal at a time. The higher your vibration when you do the Mock-up, the more effective it will be. A good time to do it is just after finishing Rose Meditation.</p>

<ol>
  <li>Create a grounded Rose and inside that Rose imagine what you want, creating the image with as much detail as you can.</li>
  <li>Create a second grounded Rose which should be placed on the right side of the first Rose. We intend this Rose to clear any energy that doesn't belong to the first Rose, any kind of blockage that interferes with achieving what you want. Don't focus on what is being cleansed, simply place the intention to cleanse.</li>
  <li>Create a third pink grounded Rose (the color of Divine Love). Into the interior of this Rose you bring the image of something you love very much, something that gives you a lot of satisfaction and pleasure so that you can raise your vibration to the maximum, to the vibration of Love.</li>
  <li>Inspired by the previous Rose, now imagine the energy of Divine Love coming out of your heart, in pink, and enveloping the whole of the first Rose, placing it in a beautiful pink circle, like a bubble.</li>
  <li>Cut the roots of the first Rose and let it go up to the center of the Universe. Always ask for it to come true if it is for the Supreme Good.</li>
  <li>Explode the third Rose (the pink one).</li>
  <li>Explode the second Rose (the cleansing rose).</li>
</ol>

<div class="callout">
  <p>Remember to repeat this technique for 7 consecutive days. If you don't do it one day before completing the 7-day cycle, go back to the beginning. Once you've completed the mock-up, live your life trying to align yourself on all levels, handing over the fulfillment of your desires to the Supreme Being and open to receiving in whatever way the Great Mystery allows.</p>
</div>

<!-- ELEMENTS SUMMARY -->
<div class="page-break"></div>
<div class="elements-box">
  <h3>Elements of Rose Meditation — Level 3 Daily</h3>
  <ul>
    <li>Grounding cord</li>
    <li>Golden Sun</li>
    <li>Aura boundaries and cord expansion</li>
    <li>Roses of protection, separation and observation</li>
    <li>Energies of the Earth and Cosmos</li>
    <li>Cleansing Rose</li>
    <li>Energy Recovery Rose</li>
    <li>Sacred space</li>
    <li>Space protection</li>
    <li>Unrooted roses that cleanse the layers of the Aura</li>
    <li>Grounded Roses that cleanse the front and back of the chakras</li>
    <li>Golden Sticky Roses</li>
    <li>Cleansing the Analyzer</li>
    <li>Cleansing the Transmedium Channels</li>
  </ul>
</div>

<h3>Other Elements of Level 3</h3>
<ul>
  <li>Breaking spiritual agreements</li>
  <li>Cutting the energetic cords</li>
  <li>Cleansing the energy of sexual partners</li>
  <li>Preparation and cleansing for classes and appointments</li>
  <li>Mock-up</li>
</ul>

<h3>To End the Meditation</h3>
<ul>
  <li>Cord + Golden Sun + discharge excess energy</li>
</ul>

<!-- END -->
<div class="end-page">
  <div class="cover-divider"></div>
  <p>ROSES OS</p>
  <p style="font-size: 10pt; margin-top: 0.5cm; color: #B5A89D; font-style: normal; font-family: Inter, sans-serif;">rosesos.com</p>
</div>

</body>
</html>"""


def generate_pdf(html_content: str, output_path: str) -> None:
    html = weasyprint.HTML(string=html_content)
    css = weasyprint.CSS(string=BRAND_CSS)
    html.write_pdf(output_path, stylesheets=[css])
    print(f"Generated: {output_path}")


if __name__ == "__main__":
    generate_pdf(
        LEVEL_2_HTML,
        "/home/user/roses-os/public/resources/manuals/ROSES-OS-Level-2-Manual-EN.pdf",
    )
    generate_pdf(
        LEVEL_3_HTML,
        "/home/user/roses-os/public/resources/manuals/ROSES-OS-Level-3-Manual-EN.pdf",
    )
    print("Done — both manuals generated with ROSES OS brand aesthetic.")
