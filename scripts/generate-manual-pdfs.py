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

<p>Place yourself in the center of your head, in your sacred space, where you are safe and aware of your energetic authority. It is from there that you can do the Rose Meditation or any energy work safely, clearly, clairvoyantly and saving your energy.</p>

<p>This space is dedicated to your Spirit, which is the purest part of you. It should always be tightly closed and protected. Go to this place whenever you do the Rose Meditation or whenever you need to make important decisions and want to be in alignment with your spiritual essence.</p>

<div class="divider"></div>

<!-- PREPARING THE SPACE -->
<h2>Preparing the Space</h2>

<h3>Preparing the Room</h3>

<p>Now prepare the room you're in so that it's clean and protected:</p>

<ul>
  <li>Create 4 Golden Roses, each with a golden stem and a golden grounding cord.</li>
  <li>Create 4 golden lines from the top four corners of the room, which join in the center of the room at the ceiling.</li>
  <li>Create 4 golden lines coming from the four lower corners of the room, which join in the center of the room, on the floor.</li>
  <li>Create a golden line that runs from the point where the upper lines join to the point where the lower lines join, unifying the energy in the room.</li>
</ul>

<h3>Owning Your Space</h3>

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

<p>Start cleansing the chakras by creating and exploding roses. Roses work like a vacuum cleaner or magnet and suck in energies that don't belong to you:</p>

<ul>
  <li>On the outside of the Aura, create two grounded red Roses, one behind you and one in front, both at the level of your first chakra. We intend them to cleanse the chakra deeply, removing energies that are not yours. The front Rose cleanses mainly energies from the present and the back Rose cleanses mainly energies from the past (you can do one at a time).</li>
  <li>Create and explode several Roses to cleanse your chakra.</li>
  <li>Now create an unrooted red Rose corresponding to the first chakra (at the height of the chakra). The layer cleanses out of your Aura and create a new Rose.</li>
  <li>Create and explode several Roses to cleanse the layers of your Aura.</li>
  <li>When you feel the need, create a red Rose grounded at the level of the first chakra, outside the Aura. Intend that this Rose absorbs all your energy dispersed in this vibration. Explode this Rose and your energy will return to you elevated in vibration and purified.</li>
  <li>When you feel the need, explode this Rose out of your Aura and create a new Rose.</li>
</ul>

<p>This procedure should be done equally for all the other chakras, starting from the first and going through each chakra in ascending order up to the seventh chakra:</p>

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
  <li><strong>The second:</strong> it enters through the crown chakra, descends to the throat chakra, splits into two Roses that follow the channels of the arms, exiting through the chakras of the hands, and explode outside the Aura or exit through the grounding cord.</li>
  <li><strong>The third:</strong> it enters through the crown chakra, descends to the root chakra, turns into two Roses that follow the channels of the legs, exit through the foot chakras and explode outside the Aura or exit through the grounding cord.</li>
  <li><strong>The fourth:</strong> it has a size that spans the entire width of the Aura, it enters and descends, cleansing our entire Aura, and exits through the grounding cord.</li>
</ul>

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
  <p>No part of this manual may be reproduced and/or shown to people who have not participated in a Level 3 Rose Meditation course. Prerequisite for participating in this course is having participated in Roses 1 and 2 courses.</p>
  <p>To teach Rose Meditation and Aura Reading, specific training is required, in addition to extensive experience with Aura Reading and energy work. Therefore, for your own protection, do not share this information.</p>
  <p>Illustrations: Drica Voivodic and Ana Leite</p>
  <p>Translation: Dara Ayoub</p>
  <p>Formatting &amp; Design: Jennifer Lawless</p>
  <p style="margin-top: 1cm; font-size: 8pt; color: #B5A89D;">ROSES OS 2026 Edition</p>
</div>

<!-- INTRODUCTION -->
<h2>Introduction</h2>

<p>Rose Meditation is a tool for cleansing, protection, and energy balance. Through this technique, it is possible to release retained energies in our aura, in the seven main chakras, cleanse energies that are not ours but that we attract for some reason, and everything that is not beneficial to us. In addition, it generates awareness of our life force and aims to deprogram patterns and genuinely express our essence.</p>

<div class="highlight">
  Roses represent the Spirit. They absorb all energies, emotions, and situations that do not serve your present moment. We can create them and explode them as many times as necessary. When we explode the Roses, they purify and transmute the energy, and send it back to its origin.
</div>

<!-- 5 BODIES -->
<div class="page-break"></div>
<h2>The 5 Bodies &amp; 5 Levels of Existence</h2>

<p>Everything that manifests itself in matter has its origin in the spiritual realm. This is the same as saying that everything has a reason for being. Everything is also energy. The denser the energy, the more it moves toward manifestation and thus comes into existence in a way that we can perceive objectively.</p>

<h3>1. Spiritual</h3>
<p>On the spiritual level, every experience is valid. There is no value judgment here: suffering and adversity are understood as learning experiences. Everything that occurs has a spiritual reason for being. There is no right or wrong, no good or bad — it simply is. From this perspective, we can find answers to what may appear unfair or cruel through a limited lens. Within the spiritual body, we can perceive the deeper lessons one is choosing to experience in the present moment.</p>

<h3>2. Energetic</h3>
<p>This is the realm of the subtle — of power and vibration. It is where the aura is formed and where we work in Rose Meditation. Here, everything that will one day manifest in matter can already be felt, yet there is also much more. It is the domain in which non-incarnated energies or entities operate. When we form deep and meaningful relationships, it is within the energetic body that bonds are created — connections through which we continue to feel the other beyond time and space.</p>

<h3>3. Mental</h3>
<p>When subtle energies become denser, the first place we perceive them is in the world of ideas, thoughts, programs, and beliefs. Our mental body stores the ideas we have about the world and every element that exists in it (at all levels). Here we confront the reality perceived by the senses with the programs that — within us — dictate how the world should be.</p>

<h3>4. Emotional</h3>
<p>The emotional body is where everything is felt. Within it are stored the imprints of emotions that have passed through us but have not yet been released. It is here that the weight of the traumas experienced throughout life resides. The emotional body connects with the physical body primarily through the organs, whose functioning shifts in response to the emotions we experience — for example, the heart beating faster.</p>

<h3>5. Physical</h3>
<p>This body is related to everything we experience in matter. It is the world perceived through the five senses: what we see, hear, touch, smell, and taste. The physical plane is the only plane perceived in the same way — objectively — by all people. For this reason, it serves as a reference point, offering a place from which we can investigate and verify what is occurring across all other planes.</p>

<!-- CLEANSING TECHNIQUES -->
<div class="page-break"></div>
<h2>Cleansing Techniques</h2>

<h3>Breaking Spiritual Agreements</h3>

<p>A relationship can only manifest in the material world if it is sustained by a spiritual agreement. Such agreements are formed with the consent of both parties on a spiritual level and may be dissolved by either party through conscious will.</p>

<p>Each time a spiritual agreement is created, a 'stick of agreements' is formed between the individuals involved. At times, these agreements align with our conscious intentions — for example, when two people choose to marry. At other times, they resonate with unconscious desires, which is when situations may unfold that we do not consciously want. Through this Rose Meditation technique, however, it is always possible to dissolve these sticks of agreements.</p>

<div class="callout">
  <p>This process should be approached with great awareness, as it carries very tangible consequences in our lives.</p>
</div>

<h4>To Break Agreements</h4>
<ul>
  <li>Create a high-vibration situation, for example, right after the Roses Meditation.</li>
  <li>Visualize the stick of agreements that contains all the agreements you want to break.</li>
  <li>Break this stick into three pieces.</li>
  <li>Create a grounded Rose.</li>
  <li>Place the three pieces of the stick in this Rose.</li>
  <li>Explode the Rose outside the Aura.</li>
</ul>

<h3>Cutting Energetic Cords</h3>

<p>We engage in energetic interactions with others constantly — when we see them, hear them, touch them, and even when we think about them. When energetic cords are formed, our auras connect through these ties, allowing energy to flow between us. This is why we can often sense what is happening to people close to us, even at a distance.</p>

<p>When relationships come to an end, we may be deeply affected by the energies that continue to reach us through these bonds. For this reason, it is important to know how to consciously cut them:</p>

<h4>To Cut Cords</h4>
<ul>
  <li>Close your eyes.</li>
  <li>Visualize your aura with bonds coming out of your chakras.</li>
  <li>Place your dominant hand on the 7th cervical vertebra, located at the junction of the neck and back at the level of the 5th chakra.</li>
  <li>Intend that your hand has the power to cut all cords.</li>
  <li>Make the cutting motion under your 1st chakra, placing your hand on the chair where you are sitting.</li>
</ul>

<p>We can also cut the ties when the relationship has not ended, but we feel we need more neutrality. These ties reform very quickly when we reconnect with the person.</p>

<!-- SEXUAL RELATIONSHIPS -->
<h3>Sexual Relationships</h3>

<p>After sexual intercourse, if you want to recover any energy you may have left with the other person and return any energy they may have left with you, simply follow these steps:</p>

<ul>
  <li>Perform the preparation techniques (grounding cord, Golden Sun, Earth and Cosmos energy, sacred space).</li>
  <li>Create an orange Rose and place the person's energy in it with their physical body, emotions, and feelings that may arise at that moment — you can visualize the person entering the rose, the situation you just experienced; explode (you can repeat this step as many times as necessary).</li>
  <li>Create an orange-colored unrooted Rose that cleanses any energy from the person that may have remained in any layer of your aura; explode.</li>
  <li>Create a grounded orange Rose and intend for this rose to recover energy that remained with this person; explode.</li>
  <li>If you want to remain energetically separate from this person, make the movement of cutting the energetic cords that have been established during the relationship.</li>
  <li>Create an unrooted pink Rose, place the person in it, visualize them happy with complete health in their body, mind, and soul. Repeat mentally: "Happy, healthy, whole, body, mind and soul." Make the Rose rise toward the center of the universe, wishing the best for them.</li>
  <li>Renew your grounding cord.</li>
  <li>Fill yourself with the light of the Golden Sun.</li>
  <li>Place your hands on the ground to discharge excess energy.</li>
</ul>

<p>You can also use this technique for relationships that happened a long time ago or when you end a relationship. In this case, it may be interesting to break the stick of agreements you have with that person as well.</p>

<!-- CLASSES AND SERVICES -->
<div class="page-break"></div>
<h2>Classes &amp; Services</h2>

<p>When you provide services in any area — or when you are a teacher or lecturer — you can use the Rose Meditation to maintain your energetic integrity.</p>

<h3>Before</h3>
<p>Perform all the preparation techniques for Rose Meditation (grounding cord, Golden Sun, Earth and Cosmos energy, sacred space) and cleanse and protect the physical space where the consultation or class will take place.</p>

<h3>After</h3>
<p>After saying goodbye to the person you treated or your students, you can take a few moments to reorganize your energies and perform the energy separation techniques, as many emotional, energetic, and spiritual bonds can form during a class or treatment.</p>

<ul>
  <li>Cut the grounding cord and create a new one.</li>
  <li>Fill yourself with the light of the Golden Sun.</li>
  <li>Cut the cords that bind your Aura to the Aura of the person(s).</li>
  <li>Create a grounded Rose in front of you, draw your own energy into the Rose, and explode the Rose — this recovers your energy that may have remained in the Aura of the person(s).</li>
  <li>Explode the Roses of separation, protection, and observation and create new ones.</li>
  <li>Create a Rose, place the person you served or your students inside the Rose, and explode the Rose. This way, you return any energies that may have remained in your aura.</li>
  <li>When ending contracts, when you no longer plan to serve the person: break the spiritual agreements.</li>
  <li>Create an unrooted pink Rose, place the person(s) in this Rose, visualize the person(s) happy with complete health in their body, mind, and Soul. Repeat mentally: "Happy, healthy, complete, body, mind, Soul." Make the rose rise toward the center of the Universe.</li>
  <li>Do the cleansing meditation of the Golden Sticky Roses (or the complete meditation if necessary).</li>
  <li>Create a new grounding cord.</li>
  <li>Fill yourself with the light of the Golden Sun.</li>
  <li>Eliminate excess energy by placing your hands on the floor.</li>
  <li>Explode the 4 Roses in the corners of the room.</li>
</ul>

<!-- THE ANALYZER -->
<div class="page-break"></div>
<h2>The Analyzer</h2>

<p>The Analyzer is located inside the head. Its functions are: to analyze, judge, and criticize. It stores our programs and beliefs. Cleansing the Analyzer and the energies stored there allows you to free yourself from limitations that impact your life and also perceive life in a more objective way.</p>

<p>The Analyzer is cleansed in all the colors of the chakras. Here is the description for the color red:</p>

<ul>
  <li>See the Analyzer in red.</li>
  <li>Ground the Analyzer to the center of the Earth with a red cord.</li>
  <li>Create a red Rose rooted behind you outside your Aura at the height of the Analyzer.</li>
  <li>The Rose now cleanses the Analyzer at that vibration.</li>
  <li>Explode the Rose always outside the aura.</li>
</ul>

<p>This same procedure should be done with the vibration of all the chakras (orange, yellow, green, pink, sky blue, indigo blue, and violet).</p>

<ul>
  <li>Now see the Analyzer in golden color raising its vibration.</li>
  <li>Create a Golden Sticky Rose the size of the Analyzer.</li>
  <li>It enters the Analyzer and spirals around inside and out, cleaning up any remaining hidden energy that may have been left there.</li>
  <li>The Rose descends through the rooting cord.</li>
  <li>Now close the Analyzer completely.</li>
</ul>

<div class="callout">
  <p>When you close the Analyzer, you may feel your intuition working more strongly and your rational side may be limited. If you need to use your rational faculties, simply intend for the Analyzer to open again.</p>
</div>

<!-- CREATING REALITY -->
<div class="page-break"></div>
<h2>Creation of Reality</h2>

<p>We humans are complex beings, endowed with the capacity to create inner worlds through imagination and mind. This same capacity allows us to shape complex realities outside ourselves. The reality we experience today is the result of what we have planted in the past, whether in this lifetime or in previous ones. If we wish to transform the reality around us, we must observe how we are living and begin a process of transformation from the inside out.</p>

<h3>Impeccability</h3>

<p>We often find ourselves living realities we do not desire, without understanding why we are unable to manifest what we long for. This occurs because different parts of ourselves attempt to move in different directions at the same time, all using the same body. Such inner conflict makes forward movement impossible and results in stagnation.</p>

<p>The science of creating reality involves learning to be impeccable with ourselves, putting all our energy and chakras in the same direction.</p>

<div class="callout">
  <p><strong>Intention</strong> — I want / I ask / I pray — connected to the 7th chakra</p>
  <p><strong>Thought</strong> — I think / imagine / see — connected to the 6th chakra</p>
  <p><strong>Word</strong> — I say / I keep quiet / I ponder — connected to the 5th chakra</p>
  <p><strong>Feeling</strong> — I feel / digest / alchemize — connected to the 2nd and 4th chakras</p>
  <p><strong>Action</strong> — I act / I do / I renounce — connected to the 1st and 3rd chakras</p>
</div>

<h3>Mock-Up</h3>

<p>This is a technique for manifesting situations or outcomes on the physical plane. It is important to note that this practice should be used only for oneself; it cannot be performed on behalf of another person. For it to be effective, it must be practiced for seven consecutive days and focused on one goal at a time. The higher your vibrational state while creating the mock-up, the more effective the process will be. For this reason, an ideal moment to practice it is, for example, immediately after completing the Rose Meditation.</p>

<ol>
  <li>Create a grounded Rose and inside that Rose imagine what you want, creating the image with as much detail as you can.</li>
  <li>Create a second grounded Rose that should be placed to the right of the first Rose. We intend for this Rose to cleanse all energy that does not belong to the first Rose, any type of blockage that interferes with the realization of what you desire. Do not focus on what is being cleansed, simply set the intention to cleanse.</li>
  <li>Create a third pink grounded Rose (the color of Divine Love). In this Rose, we bring into your inner self the image of something you love very much, something that gives you great satisfaction and pleasure so that you can raise your vibration to the maximum, to the vibration of love.</li>
  <li>Inspired by the previous Rose, now imagine the energy of Divine Love, in pink, coming out of your heart and enveloping the first Rose, placing it in a beautiful pink circle, like a bubble.</li>
  <li>Cut the roots of the first Rose and let it rise to the center of the Universe. Always ask for it to be done if it is for the greater good.</li>
  <li>Explode the third Rose (the pink one).</li>
  <li>Explode the second Rose (the cleansing rose).</li>
</ol>

<div class="callout">
  <p>Remember to repeat this technique for 7 consecutive days. If you miss a day before completing the 7-day cycle, go back to the beginning. After completing the mock-up, live your life trying to align yourself on all levels, surrendering the fulfillment of your desires to the Supreme Being, open to receiving in whatever way the Great Mystery allows.</p>
</div>

<!-- ELEMENTS SUMMARY -->
<div class="page-break"></div>
<div class="elements-box">
  <h3>Elements of the Daily Rose Meditation Level 3</h3>
  <ul>
    <li>Grounding cord</li>
    <li>Golden Sun</li>
    <li>Aura boundaries and cord expansion</li>
    <li>Roses of protection, separation and observation</li>
    <li>Earth and Cosmic Energies</li>
    <li>Cleansing Rose</li>
    <li>Rose of energy recovery</li>
    <li>Sacred space</li>
    <li>Space protection</li>
    <li>Grounded roses that cleanse the front and back chakras</li>
    <li>Unrooted roses that cleanse the layers of the aura</li>
    <li>Golden Sticky Roses</li>
    <li>Cleansing the Analyzer</li>
    <li>Finishing: Cord + Golden Sun + Discharging excess energy</li>
  </ul>
</div>

<h3>Other Elements of Level 3 Rose Meditation</h3>
<ul>
  <li>Breaking spiritual agreements</li>
  <li>Cutting energetic cords</li>
  <li>Cleansing the energy of sexual partners</li>
  <li>Preparation and cleansing for classes and consultations</li>
  <li>Mock-up</li>
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
