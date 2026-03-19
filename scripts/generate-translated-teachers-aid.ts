/**
 * Generate Translated Teachers Aid HTML files
 *
 * Reads the EN HTML template and translation JSON files,
 * then produces roses-teachers-aid-{locale}.html for each locale.
 *
 * Usage:
 *   npx tsx scripts/generate-translated-teachers-aid.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '..');
const MANUAL_DIR = path.join(ROOT, 'scripts', 'pdf-manuals');
const TEMPLATE_PATH = path.join(MANUAL_DIR, 'roses-teachers-aid.html');
const TRANSLATIONS_DIR = path.join(ROOT, 'src', 'content', 'teaching');

const LOCALES = ['es', 'pt', 'el'] as const;

// Locale display names for titles
const LOCALE_NAMES: Record<string, string> = {
  es: 'ES',
  pt: 'PT',
  el: 'EL',
};

interface Translation {
  ui: Record<string, string>;
  opening: {
    agreements: { title: string; text: string; items: string[] };
    importantToKnow: {
      title: string;
      paragraphs: string[];
      guidelinesTitle: string;
      guidelinesItems: string[];
      closing: string;
    };
    history: { title: string; text: string; lineage: string };
  };
  levels: Record<string, { title: string; subtitle: string; description: string }>;
  slides: Record<string, { concept: string; teachingText: string }>;
  chakras: Record<
    string,
    {
      concept: string;
      teachingText: string;
      focus: string;
      energy: string;
      bodyLocation: string;
      balanced: string[];
      unbalanced: string[];
      blockages: string;
      extraContent?: string;
    }
  >;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Apply all text replacements for a given locale translation.
 * We use a series of targeted string replacements.
 */
function translateHtml(html: string, t: Translation, locale: string): string {
  let result = html;

  // 1. Update <html lang="...">
  result = result.replace('<html lang="en">', `<html lang="${locale}">`);

  // 2. Update <title>
  result = result.replace(
    '<title>ROSES OS — Teacher Visual Aid Manual</title>',
    `<title>ROSES OS — ${t.ui.teacherVisualAidManual}</title>`
  );

  // 3. Cover page
  result = result.replace(
    'ROSES OS &middot; Teacher Visual Aid Manual',
    `ROSES OS &middot; ${escapeHtml(t.ui.teacherVisualAidManual)}`
  );
  result = result.replace(
    'Rose Meditation &mdash; All Levels</p>\n      <div class="s32"></div>\n\n      <div class="line-c">',
    `${escapeHtml(t.levels['1'].subtitle)} &mdash; ${escapeHtml(t.ui.allLevels)}</p>\n      <div class="s32"></div>\n\n      <div class="line-c">`
  );

  // 4. Table of Contents page
  result = result.replace(
    '>Contents</div>',
    `>${escapeHtml(t.ui.teacherVisualAidManual)}</div>`
  );
  // TOC heading
  result = result.replace(
    '>Teacher Visual Aid Manual</h2>',
    `>${escapeHtml(t.ui.teacherVisualAidManual)}</h2>`
  );
  // TOC subtitle
  result = result.replace(
    'Rose Meditation &mdash; All Levels</p>\n      <div class="s20">',
    `${escapeHtml(t.levels['1'].subtitle)} &mdash; ${escapeHtml(t.ui.allLevels)}</p>\n      <div class="s20">`
  );

  // TOC entries
  result = result.replace('>Opening Sections</td>', `>${escapeHtml(t.opening.agreements.title)}</td>`);
  result = result.replace(
    '>Level 1 &mdash; Foundational Practices</td>',
    `>${escapeHtml(t.levels['1'].title)} &mdash; ${escapeHtml(t.levels['1'].subtitle)}</td>`
  );
  result = result.replace(
    '>Level 2 &mdash; Space Preparation &amp; Chakra Activation</td>',
    `>${escapeHtml(t.levels['2'].title)} &mdash; ${escapeHtml(t.levels['2'].subtitle)}</td>`
  );
  result = result.replace(
    '>Level 3 &mdash; Advanced Practice</td>',
    `>${escapeHtml(t.levels['3'].title)} &mdash; ${escapeHtml(t.levels['3'].subtitle)}</td>`
  );

  // TOC callout
  result = result.replace(
    'This visual aid manual is designed for teachers and facilitators. It contains all slide references across Levels 1, 2, and 3 of the Rose Meditation practice.',
    escapeHtml(t.ui.facilitatorCompanion)
  );

  // Footer text on TOC
  result = result.replace(
    /Teacher Visual Aid &nbsp;&middot;&nbsp; All Levels/g,
    `${escapeHtml(t.ui.teacherVisualAidManual)} &nbsp;&middot;&nbsp; ${escapeHtml(t.ui.allLevels)}`
  );

  // 5. Opening Sections (Page 3)
  result = result.replace('>Preparation</div>', `>${escapeHtml(t.opening.agreements.title)}</div>`);
  result = result.replace(
    '>Agreements &amp; Virtues</h2>',
    `>${escapeHtml(t.opening.agreements.title)}</h2>`
  );
  result = result.replace(
    'Before beginning, all participants honor these agreements:',
    escapeHtml(t.opening.agreements.text)
  );
  // Agreement items (italic line)
  result = result.replace(
    'Punctuality, Confidentiality, Co-responsibility, Trust, Patience, Empathy and Compassion.',
    escapeHtml(t.opening.agreements.items.join(', ')) + '.'
  );

  // Important to Know
  result = result.replace(
    '>It&rsquo;s Important to Know</h2>',
    `>${escapeHtml(t.opening.importantToKnow.title)}</h2>`
  );
  // Important to Know bullet items
  result = result.replace(
    '<li>You will receive the manual in PDF.</li>',
    `<li>${escapeHtml(t.opening.importantToKnow.paragraphs[0])}</li>`
  );
  result = result.replace(
    '<li>These teachings are part of a living energetic lineage revealed through direct practice and transmission.</li>',
    `<li>${escapeHtml(t.opening.importantToKnow.paragraphs[1])}</li>`
  );
  result = result.replace(
    '<li>You should not attempt to teach the Rose Meditation (only to your children under 14 years old).</li>',
    `<li>${escapeHtml(t.opening.importantToKnow.guidelinesItems[0])}</li>`
  );
  result = result.replace(
    '<li>If you would like to become a Rose Meditation Facilitator, it is necessary to follow a training path through Aura Reading.</li>',
    `<li>${escapeHtml(t.opening.importantToKnow.guidelinesItems[1])}</li>`
  );
  result = result.replace(
    '<li>The Rose Meditation cannot be applied to other people.</li>',
    `<li>${escapeHtml(t.opening.importantToKnow.guidelinesItems[2])}</li>`
  );

  // History & Lineage
  result = result.replace('>History &amp; Lineage</h2>', `>${escapeHtml(t.opening.history.title)}</h2>`);
  result = result.replace(
    'Aura Reading emerged in the 1960s, in California, channeled by Lewis S. Bostwick. Founder of the Berkeley Psychic Institute and the Church of the Divine Man, he channeled and systematized the techniques and tools sent by the angels, to assist in the process of evolution of humanity.',
    escapeHtml(t.opening.history.text)
  );
  result = result.replace(
    'Lineage: Berkeley Psychic Institute &rarr; Anastasia Plunk &rarr; Angelina Ataide &rarr; Escola da Aura &rarr; ROSES OS',
    `${escapeHtml(t.ui.lineage)}: ${escapeHtml(t.opening.history.lineage).replace(/→/g, '&rarr;')}`
  );

  // 6. Level dividers
  // Level 1 divider
  result = result.replace('>Level 1 of 3</div>', `>${escapeHtml(t.ui.level)} 1</div>`);
  result = result.replace('>Foundational Practices</h1>', `>${escapeHtml(t.levels['1'].subtitle)}</h1>`);

  // Level 2 divider
  result = result.replace('>Level 2 of 3</div>', `>${escapeHtml(t.ui.level)} 2</div>`);
  result = result.replace(
    '>Space Preparation &amp; Chakra Activation</h1>',
    `>${escapeHtml(t.levels['2'].subtitle)}</h1>`
  );

  // Level 3 divider
  result = result.replace('>Level 3 of 3</div>', `>${escapeHtml(t.ui.level)} 3</div>`);
  result = result.replace('>Advanced Practice</h1>', `>${escapeHtml(t.levels['3'].subtitle)}</h1>`);

  // Slide range labels
  result = result.replace('>Slides 1&ndash;18</p>', `>${escapeHtml(t.ui.slide)}s 1&ndash;18</p>`);
  result = result.replace('>Slides 19&ndash;38</p>', `>${escapeHtml(t.ui.slide)}s 19&ndash;38</p>`);
  result = result.replace('>Slides 39&ndash;44</p>', `>${escapeHtml(t.ui.slide)}s 39&ndash;44</p>`);

  // 7. All slide titles and text
  // We'll do targeted replacements for each slide's concept/title and teaching text

  // Helper: replace slide titles (used in slide-title divs and h3 headings)
  const slideReplacements: [string, string, string][] = [
    // [slideId, EN concept, category: 'slides' or 'chakras']
  ];

  // Build the replacement map from slides
  for (const [slideId, data] of Object.entries(t.slides)) {
    const enSlide = getEnSlideData(slideId);
    if (enSlide) {
      // Replace slide-title div content
      replaceSlideTitle(enSlide.concept, data.concept);
      // Replace slide-text / body content
      replaceSlideText(enSlide.teachingText, data.teachingText);
    }
  }

  // Replace chakra data
  for (const [chakraId, data] of Object.entries(t.chakras)) {
    const enChakra = getEnChakraData(chakraId);
    if (enChakra) {
      replaceSlideTitle(enChakra.concept, data.concept);
      // Replace focus lines in chakra cards
      if (enChakra.focus) {
        result = result.replace(
          new RegExp(escapeRegex(enChakra.focus), 'g'),
          data.focus
        );
      }
    }
  }

  function replaceSlideTitle(enTitle: string, translatedTitle: string) {
    if (!enTitle || !translatedTitle || enTitle === translatedTitle) return;

    // Handle HTML entities in the EN title for matching
    const htmlTitle = enTitle
      .replace(/&/g, '&amp;')
      .replace(/'/g, '&rsquo;')
      .replace(/—/g, '&mdash;')
      .replace(/–/g, '&ndash;');

    const translatedHtmlTitle = translatedTitle
      .replace(/&/g, '&amp;')
      .replace(/'/g, '&rsquo;')
      .replace(/—/g, '&mdash;')
      .replace(/–/g, '&ndash;');

    // Replace in slide-title divs
    const slideTitlePattern = new RegExp(
      `(<div class="slide-title">)${escapeRegex(htmlTitle)}(</div>)`,
      'g'
    );
    result = result.replace(slideTitlePattern, `$1${translatedHtmlTitle}$2`);

    // Also replace in h3 headings
    const h3Pattern = new RegExp(
      `(<h3 class="h-md">)${escapeRegex(htmlTitle)}(</h3>)`,
      'g'
    );
    result = result.replace(h3Pattern, `$1${translatedHtmlTitle}$2`);

    // Also in h2 headings
    const h2Pattern = new RegExp(
      `(<h2 class="h-md">)${escapeRegex(htmlTitle)}(</h2>)`,
      'g'
    );
    result = result.replace(h2Pattern, `$1${translatedHtmlTitle}$2`);

    // Replace in chakra-info title divs
    const chakraTitlePattern = new RegExp(
      `(</span>)${escapeRegex(htmlTitle)}`,
      'g'
    );
    result = result.replace(chakraTitlePattern, `$1${translatedHtmlTitle}`);
  }

  function replaceSlideText(enText: string, translatedText: string) {
    if (!enText || !translatedText || enText === translatedText) return;

    // For slide-text paragraphs, the HTML often contains abbreviated versions.
    // We'll replace both full and abbreviated versions.
    // Convert to HTML-safe string
    const htmlText = textToHtml(enText);
    const translatedHtmlText = textToHtml(translatedText);

    // Try to replace the full text in body paragraphs and slide-text paragraphs
    if (result.includes(htmlText)) {
      result = result.replace(new RegExp(escapeRegex(htmlText), 'g'), translatedHtmlText);
    }
  }

  // 8. Level completion summaries
  result = result.replace('>Level 1 Complete</div>', `>${escapeHtml(t.ui.level)} 1</div>`);
  result = result.replace('>18 Foundational Slides</h2>', `>18 ${escapeHtml(t.ui.slide)}s</h2>`);
  result = result.replace(
    'This concludes the Level 1 visual aids. All foundational tools &mdash; grounding cord, golden sun, aura, circuits, roses, and sacred space &mdash; are now referenced.',
    escapeHtml(t.levels['1'].description)
  );

  result = result.replace('>Level 2 Complete</div>', `>${escapeHtml(t.ui.level)} 2</div>`);
  result = result.replace(
    '>20 Slides &mdash; Space, Chakras &amp; Cleansing</h2>',
    `>20 ${escapeHtml(t.ui.slide)}s</h2>`
  );
  result = result.replace(
    'Space preparation, protection, cleansing, chakra system overview, individual chakra activations, aura layer cleansing, chakra cleansing, energy recovery, and the four phases of Golden Sticky Roses.',
    escapeHtml(t.levels['2'].description)
  );

  result = result.replace('>Level 3 Complete</div>', `>${escapeHtml(t.ui.level)} 3</div>`);
  result = result.replace('>6 Advanced Slides</h2>', `>6 ${escapeHtml(t.ui.slide)}s</h2>`);
  result = result.replace(
    'The Analyzer, sacred space integration, spiritual agreements, cord cutting, post-intimacy recovery, and manifestation through Mock Up.',
    escapeHtml(t.levels['3'].description)
  );

  // 9. Golden Sticky callout
  result = result.replace(
    'This completes the Golden Sticky Rose sequence &mdash; a thorough energetic cleansing of the entire body.',
    escapeHtml(t.ui.goldenStickyRoses)
  );

  // 10. Sacred Space callout
  result = result.replace(
    'The Sacred Space is the culmination of Level 1 &mdash; where all foundational techniques come together in unified awareness.',
    escapeHtml(t.ui.sacredSpace)
  );

  // 11. Closing page quote - provide locale-appropriate versions
  const closingQuotes: Record<string, string> = {
    es: 'La Rosa es una tecnología de la remembranza &mdash;<br>\n        una práctica viva que te reconecta<br>\n        con la inteligencia ya presente<br>\n        en tu cuerpo, tu respiración,<br>\n        y tu ser.',
    pt: 'A Rosa é uma tecnologia de lembrança &mdash;<br>\n        uma prática viva que te reconecta<br>\n        com a inteligência já presente<br>\n        no seu corpo, na sua respiração,<br>\n        e no seu ser.',
    el: 'Το Τριαντάφυλλο είναι μια τεχνολογία ανάμνησης &mdash;<br>\n        μια ζωντανή πρακτική που σας επανασυνδέει<br>\n        με τη νοημοσύνη που είναι ήδη παρούσα<br>\n        στο σώμα σας, στην αναπνοή σας,<br>\n        και στην ύπαρξή σας.',
  };

  if (closingQuotes[locale]) {
    result = result.replace(
      'The Rose is a technology of remembrance &mdash;<br>\n        a living practice that reconnects you<br>\n        with the intelligence already present<br>\n        within your body, your breath,<br>\n        and your being.',
      closingQuotes[locale]
    );
  }

  // 12. Abbreviated slide texts that don't match full teaching text
  // These are hand-shortened in the HTML. We need to handle them individually.

  // Slide 9 abbreviated
  result = replaceText(result,
    'The Cosmic circuit draws cosmic energy downward through the crown of the head (7th chakra) and into the body. This connects you to the higher frequencies of universal consciousness, inspiration, and spiritual guidance.',
    t.slides['l1-cosmos-circuit']?.teachingText ? abbreviateText(t.slides['l1-cosmos-circuit'].teachingText, 200) : ''
  );

  // Slide 11 abbreviated
  result = replaceText(result,
    'The Rose is used as a living energetic instrument throughout the practice. It has roots (connection to source), a stem (channel of energy), and a bloom (the active, radiant tool).',
    t.slides['l1-rose-tool']?.teachingText ? abbreviateText(t.slides['l1-rose-tool'].teachingText, 200) : ''
  );

  // Slide 12 abbreviated
  result = replaceText(result,
    'Roses are placed at the edges of the aura to serve as energetic sentinels. Three functions: Protection (guard the boundary), Observation (notice approaching energies), Separation (healthy energetic distinction).',
    t.slides['l1-four-roses']?.teachingText ? abbreviateText(t.slides['l1-four-roses'].teachingText, 220) : ''
  );

  // Slide 13 abbreviated
  result = replaceText(result,
    'The Cleansing Rose is placed outside of the aura. It absorbs and transmutes foreign or stagnant energy from within your field. Energy that does not belong to you is drawn out and neutralized.',
    t.slides['l1-cleansing-rose']?.teachingText ? abbreviateText(t.slides['l1-cleansing-rose'].teachingText, 200) : ''
  );

  // Slide 14 abbreviated
  result = replaceText(result,
    'After cleansing, the Rose is used to recover your own energy that has been left in or taken by others. The Rose gathers and returns your life-force energy to each chakra, restoring fullness and sovereignty.',
    t.slides['l1-energy-recovery']?.teachingText ? abbreviateText(t.slides['l1-energy-recovery'].teachingText, 200) : ''
  );

  // Slide 15 abbreviated (two occurrences)
  result = replaceText(result,
    'The Pink Rose Closure is offered at the end of the meditation as a gift of well-being. Create an unrooted pink Rose and place yourself or the person inside it, visualizing &ldquo;Happy, Healthy, Whole, Body, Mind &amp; Soul.&rdquo;',
    t.slides['l1-pink-rose-closure']?.teachingText ? textToHtml(abbreviateText(t.slides['l1-pink-rose-closure'].teachingText, 220)) : '',
    true
  );

  // Slide 16 abbreviated
  result = replaceText(result,
    'After deep meditation, excess energy may accumulate. Lean forward with hands reaching toward the ground, allowing the excess energy to flow out through the hands and into the earth.',
    t.slides['l1-discharge']?.teachingText ? abbreviateText(t.slides['l1-discharge'].teachingText, 180) : ''
  );

  // Slide 17 abbreviated
  result = replaceText(result,
    'Creating your own sacred space &mdash; an internal energetic environment that serves as your meditation home. This is the space from which all deeper work is conducted.',
    t.slides['l1-sacred-space']?.teachingText ? textToHtml(abbreviateText(t.slides['l1-sacred-space'].teachingText, 180)) : '',
    true
  );

  // Slide 18 abbreviated
  result = replaceText(result,
    'Understanding the locations and roles of the upper chakras: 6th Chakra (Third Eye) at the center of the forehead; 7th Chakra (Crown) at the top of the head.',
    t.slides['l1-6th-7th-chakras']?.teachingText ? abbreviateText(t.slides['l1-6th-7th-chakras'].teachingText, 180) : ''
  );

  // L2 slide abbreviated texts
  result = replaceText(result,
    'The physical meditation space is protected by creating an energetic grid using roses. Golden roses are placed at the four corners, connected by lines of golden energy forming a sacred geometric structure.',
    t.slides['l2-protection-space']?.teachingText ? abbreviateText(t.slides['l2-protection-space'].teachingText, 200) : '',
    true
  );

  result = replaceText(result,
    'Once the space is protected, it is cleansed. A large Cleansing Rose is placed above the grid, and golden energy pours downward through the entire structure, clearing all foreign energies.',
    t.slides['l2-cleansing-space']?.teachingText ? abbreviateText(t.slides['l2-cleansing-space'].teachingText, 200) : '',
    true
  );

  result = replaceText(result,
    'After protection and cleansing, you claim ownership of the space. This is an act of energetic sovereignty &mdash; declaring the space as yours, filling it with your own energy and intention.',
    t.slides['l2-owning-space']?.teachingText ? textToHtml(abbreviateText(t.slides['l2-owning-space'].teachingText, 200)) : '',
    true
  );

  // Slide 32 abbreviated
  result = replaceText(result,
    'The aura is composed of seven layers, each corresponding to a chakra. Each layer is individually cleansed.',
    t.slides['l2-cleansing-aura-layers']?.teachingText ? abbreviateText(t.slides['l2-cleansing-aura-layers'].teachingText, 120) : ''
  );

  // Slide 33 abbreviated
  result = replaceText(result,
    'Each individual chakra is cleansed using roses addressing past and present dynamics.',
    t.slides['l2-cleansing-each-chakra']?.teachingText ? abbreviateText(t.slides['l2-cleansing-each-chakra'].teachingText, 100) : ''
  );

  // Slide 34 abbreviated
  result = replaceText(result,
    'After cleansing, the energy recovery process is repeated at a deeper level.',
    t.slides['l2-energy-recovery']?.teachingText ? abbreviateText(t.slides['l2-energy-recovery'].teachingText, 80) : ''
  );

  // Slide 35 abbreviated
  result = replaceText(result,
    'Golden sticky roses placed on each chakra, drawing out foreign energy.',
    t.slides['l2-golden-sticky-1']?.teachingText ? abbreviateText(t.slides['l2-golden-sticky-1'].teachingText, 80) : ''
  );

  // Slide 36 abbreviated
  result = replaceText(result,
    'Placed at joints and extremities &mdash; shoulders, elbows, wrists, hands, hips, knees, ankles, feet.',
    t.slides['l2-golden-sticky-2']?.teachingText ? abbreviateText(t.slides['l2-golden-sticky-2'].teachingText, 100) : ''
  );

  // Slide 37 abbreviated
  result = replaceText(result,
    'Placed throughout the entire body for thorough, complete energetic cleansing.',
    t.slides['l2-golden-sticky-3']?.teachingText ? abbreviateText(t.slides['l2-golden-sticky-3'].teachingText, 80) : ''
  );

  // Slide 38 abbreviated
  result = replaceText(result,
    'A large Golden Rose appears above. All foreign energy is released, and the body is bathed in golden light.',
    t.slides['l2-golden-sticky-4']?.teachingText ? abbreviateText(t.slides['l2-golden-sticky-4'].teachingText, 120) : ''
  );

  // L3 abbreviated texts
  result = replaceText(result,
    'The Analyzer is an energetic point located at the back of the head, at the base of the skull. It is used for deeper perception, reading, and discernment of energy.',
    t.slides['l3-analyzer']?.teachingText ? abbreviateText(t.slides['l3-analyzer'].teachingText, 160) : ''
  );

  result = replaceText(result,
    'A combined reference showing the Analyzer in relation to the sacred space. The sacred space provides the container, the Analyzer provides the perceptive tool.',
    t.slides['l3-analyzer-sacred-space']?.teachingText ? abbreviateText(t.slides['l3-analyzer-sacred-space'].teachingText, 160) : ''
  );

  result = replaceText(result,
    'A relationship can only manifest in the material world if sustained by a spiritual agreement. Such agreements may be dissolved by either party through conscious will.',
    t.slides['l3-stick-of-agreements']?.teachingText ? abbreviateText(t.slides['l3-stick-of-agreements'].teachingText, 180) : ''
  );

  result = replaceText(result,
    'We engage in energetic interactions with others constantly. When energetic cords are formed, our auras connect through these ties. It is important to know how to consciously cut them.',
    t.slides['l3-cutting-cords']?.teachingText ? abbreviateText(t.slides['l3-cutting-cords'].teachingText, 180) : ''
  );

  result = replaceText(result,
    'After sexual intercourse, if you want to recover energy you may have left with the other person and return energy they may have left with you, follow the recovery steps.',
    t.slides['l3-sexual-recovery-rose']?.teachingText ? abbreviateText(t.slides['l3-sexual-recovery-rose'].teachingText, 180) : ''
  );

  result = replaceText(result,
    'A technique for manifesting situations on the physical plane. Must be practiced for seven consecutive days, focused on one goal at a time.',
    t.slides['l3-mock-up']?.teachingText ? abbreviateText(t.slides['l3-mock-up'].teachingText, 140) : ''
  );

  // Seven Chakras list in slide 24
  const sevenChakrasEN = `7. Crown &mdash; Top of head<br>\n              6. Third Eye &mdash; Center of forehead<br>\n              5. Throat &mdash; Throat<br>\n              4. Heart &mdash; Center of chest<br>\n              3. Solar Plexus &mdash; Upper abdomen<br>\n              2. Sacral &mdash; Lower abdomen<br>\n              1. Root &mdash; Base of spine`;

  if (t.slides['l2-seven-chakras']?.teachingText) {
    // Parse the seven chakras text from translation
    const lines = t.slides['l2-seven-chakras'].teachingText.split('\n').filter(l => l.match(/^\d\./));
    if (lines.length === 7) {
      const translatedList = lines
        .map(l => l.replace(/—/g, '&mdash;').trim())
        .join('<br>\n              ');
      result = result.replace(sevenChakrasEN, translatedList);
    }
  }

  // Chakra card details: Element, Statement, Focus lines
  // These use a specific HTML pattern in the chakra cards
  const chakraElements: Record<string, { element: string; statement: string }> = {
    'l2-chakra-root': { element: 'Earth', statement: 'I AM' },
    'l2-chakra-sacral': { element: 'Water', statement: 'I FEEL' },
    'l2-chakra-solar-plexus': { element: 'Fire', statement: 'I CAN' },
    'l2-chakra-heart': { element: 'Air', statement: 'I LOVE' },
    'l2-chakra-throat': { element: 'Ether/Sound', statement: 'I SPEAK AND I LISTEN' },
    'l2-chakra-third-eye': { element: 'Light', statement: 'I SEE' },
    'l2-chakra-crown': { element: 'Thought', statement: 'I KNOW' },
  };

  // We keep Element/Statement in English as they are universal/Sanskrit-based terms
  // But translate the Focus line
  for (const [chakraId, enData] of Object.entries(chakraElements)) {
    const translated = t.chakras[chakraId];
    if (translated) {
      // Replace the Focus line
      const enChakra = getEnChakraData(chakraId);
      if (enChakra?.focus) {
        // Focus text appears after "Focus:</strong> "
        result = result.replace(
          `Focus:</strong> ${enChakra.focus.replace(/—/g, '&mdash;')}`,
          `${escapeHtml(t.ui.focus)}:</strong> ${translated.focus.replace(/—/g, '&mdash;')}`
        );
      }
    }
  }

  // Replace Element/Statement labels
  result = result.replace(/\bElement:<\/strong>/g, `${escapeHtml(t.ui.element)}:</strong>`);
  // Keep "Statement" in English as core statements (I AM, etc.) are in English

  // Replace Focus labels in the shorter chakra cards (last three)
  // Already handled above with the loop

  return result;
}

function replaceText(html: string, search: string, replacement: string, replaceAll: boolean = false): string {
  if (!search || !replacement) return html;
  if (replaceAll) {
    return html.split(search).join(replacement);
  }
  return html.replace(search, replacement);
}

function abbreviateText(text: string, maxLen: number): string {
  // Strip newlines and take first N chars
  const clean = text.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
  if (clean.length <= maxLen) return clean;
  // Cut at last space before maxLen
  const cut = clean.substring(0, maxLen);
  const lastSpace = cut.lastIndexOf(' ');
  return cut.substring(0, lastSpace > 0 ? lastSpace : maxLen);
}

function textToHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&rsquo;')
    .replace(/—/g, '&mdash;')
    .replace(/–/g, '&ndash;');
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// English data extracted from teaching-slides.ts
const EN_SLIDES: Record<string, { concept: string; teachingText: string }> = {
  'l1-the-rose': { concept: 'The Rose', teachingText: 'The Rose is the foundational symbol and tool of this practice — a living energetic instrument used throughout all levels of the work.' },
  'l1-posture': { concept: 'Meditation Posture', teachingText: 'Proper meditation posture is seated upright in a chair. Feet are flat on the floor, hands resting gently on the thighs or knees, spine upright, eyes closed. The body is relaxed yet alert — grounded and receptive.' },
  'l1-grounding-cord': { concept: 'Grounding Cord', teachingText: 'The grounding cord is an energetic connection that extends from the base of the spine (first chakra) downward into the center of the Earth. It anchors your energy body to the planet, providing stability, safety, and a channel for releasing unwanted energy.' },
  'l1-golden-sun': { concept: 'Golden Sun', teachingText: 'The Golden Sun is a tool for replenishing and restoring your own energy. Visualize a radiant golden sun above your head. It calls back your own life-force energy from wherever you may have left it — in people, places, situations, or time. It fills you with your own highest vibration.' },
  'l1-aura-exercise': { concept: 'An Exercise to Feel Your Aura', teachingText: 'The aura is the energetic field that surrounds your physical body. This exercise helps you become aware of its presence, its edges, and its quality. The aura consists of multiple layers radiating outward from the body.' },
  'l1-grounding-expansion': { concept: 'Expansion of Grounding Cord', teachingText: 'Once you are aware of your aura, the grounding cord practice deepens. You ground not only the physical body but also the aura itself — allowing the entire energy field to anchor into the Earth.' },
  'l1-golden-sun-fills': { concept: 'Golden Sun Fills You', teachingText: 'The Golden Sun above the crown pours golden light downward, filling the entire aura and body with your own highest vibration. This completes the full energetic architecture: posture, aura, grounding cord, and golden sun — all active together.' },
  'l1-earth-circuit': { concept: 'Circuit of the Energy of the Earth', teachingText: 'The Earth circuit is an energetic pathway that draws the energy of the Earth upward through the feet, rising through the legs and into the body. This circuit connects you to the grounding, nourishing, stabilizing force of the planet.' },
  'l1-cosmos-circuit': { concept: 'Circuit of the Energy of the Cosmos', teachingText: 'The Cosmic circuit is an energetic pathway that draws cosmic energy downward through the crown of the head (7th chakra) and into the body. This circuit connects you to the higher frequencies of universal consciousness, inspiration, and spiritual guidance.' },
  'l1-combined-circuit': { concept: 'Circuit of Energy of Cosmos and Earth', teachingText: 'When both circuits are activated simultaneously, the energies of the Earth and Cosmos flow together through the body. Earth energy rises from below; Cosmic energy descends from above. They meet and blend within the body, creating a unified field of balanced, integrated energy.' },
  'l1-rose-tool': { concept: 'The Rose (as Energetic Tool)', teachingText: 'The Rose is used as a living energetic instrument throughout the practice. It has roots (connection to source), a stem (channel of energy), and a bloom (the active, radiant tool). The Rose can be placed, moved, opened, closed, and released according to the needs of the meditation.' },
  'l1-four-roses': { concept: 'Roses of Protection, Observation and Separation', teachingText: 'Roses are placed at the edges of the aura to serve as energetic sentinels.' },
  'l1-cleansing-rose': { concept: 'Cleansing Rose', teachingText: 'The Cleansing Rose is placed outside of the aura. It is used to absorb and transmute foreign or stagnant energy from within your field.' },
  'l1-pink-rose-closure': { concept: 'Pink Rose Closure', teachingText: 'The Pink Rose Closure is offered at the end of the meditation as a gift of well-being.' },
  'l1-energy-recovery': { concept: 'Energy Recovery of Each Chakra', teachingText: 'After cleansing, the Rose is used to recover your own energy that has been left in or taken by others.' },
  'l1-discharge': { concept: 'Discharge Excess Energy', teachingText: 'After deep meditation or energy work, excess energy may accumulate in the body.' },
  'l1-sacred-space': { concept: "Let's Create Your Sacred Space", teachingText: 'Level 2 begins with creating your own sacred space — an internal energetic environment that serves as your meditation home.' },
  'l1-6th-7th-chakras': { concept: 'The 6th and 7th Chakras (Sacred Space)', teachingText: 'Understanding the locations and roles of the upper chakras is essential for Level 2 work.' },
  'l2-physical-space': { concept: "Let's Prepare Your Physical Space", teachingText: 'Before meditation, prepare your physical environment to support the energetic work. The external space should mirror the internal intention: clean, clear, quiet, and intentionally held.' },
  'l2-protection-space': { concept: 'Protection of the Space', teachingText: 'The physical meditation space is protected by creating an energetic grid using roses.' },
  'l2-cleansing-space': { concept: 'Cleansing of the Space', teachingText: 'Once the space is protected, it is cleansed.' },
  'l2-owning-space': { concept: 'Owning Your Space', teachingText: 'After protection and cleansing, you claim ownership of the space.' },
  'l2-chakras-intro': { concept: "Let's Talk About Chakras", teachingText: 'The chakra system is the energetic anatomy of the human body. There are seven primary chakras, each governing specific aspects of physical, emotional, mental, and spiritual life.' },
  'l2-seven-chakras': { concept: 'The Seven Chakras', teachingText: 'The seven primary chakras, from crown to root.' },
  'l2-cleansing-aura-layers': { concept: 'Cleansing of Each Aura Layer', teachingText: 'The aura is composed of seven layers, each corresponding to a chakra.' },
  'l2-cleansing-each-chakra': { concept: 'Cleansing of Each Chakra', teachingText: 'Each individual chakra is cleansed using roses.' },
  'l2-energy-recovery': { concept: 'Energy Recovery Rose in Depth', teachingText: 'Once the cleansing of the chakra and its corresponding aura layer is complete, the energy recovery process can unfold at their vibration.' },
  'l2-golden-sticky-1': { concept: 'Golden Sticky Roses — First Rose (Crown to Root)', teachingText: 'Four Golden Sticky Roses are used for deep energetic cleansing of the Aura.' },
  'l2-golden-sticky-2': { concept: 'Golden Sticky Roses — Second Rose (Arms)', teachingText: 'The second descends to the throat chakra, where it splits into two Roses that travel the channels of the arms.' },
  'l2-golden-sticky-3': { concept: 'Golden Sticky Roses — Third Rose (Legs)', teachingText: 'The third descends to the root chakra, where it becomes two Roses that follow the channels of the legs.' },
  'l2-golden-sticky-4': { concept: 'Golden Sticky Roses — Fourth Rose (Full Aura)', teachingText: 'The fourth spans the full width of the Aura, descending through the entire energetic field.' },
  'l3-analyzer': { concept: 'The Analyzer', teachingText: 'The Analyzer is an advanced tool introduced in Level 3.' },
  'l3-analyzer-sacred-space': { concept: 'The Analyzer & Sacred Space', teachingText: 'A combined reference showing the Analyzer in relation to the sacred space.' },
  'l3-stick-of-agreements': { concept: 'Stick of Agreements', teachingText: 'A relationship can only manifest in the material world if it is sustained by a spiritual agreement.' },
  'l3-cutting-cords': { concept: 'Cutting Cords', teachingText: 'We engage in energetic interactions with others constantly.' },
  'l3-sexual-recovery-rose': { concept: 'Post Intimacy / Sexual Recovery Rose', teachingText: 'After sexual intercourse, if you want to recover any energy you may have left with the other person.' },
  'l3-mock-up': { concept: 'Mock Up', teachingText: 'The Mock Up is a technique for manifesting situations or outcomes on the physical plane.' },
};

const EN_CHAKRAS: Record<string, { concept: string; focus: string; teachingText: string }> = {
  'l2-chakra-root': { concept: 'Root Chakra', focus: 'Stability — Safety — Embodiment', teachingText: 'Muladhara — Grounding & Safety' },
  'l2-chakra-sacral': { concept: 'Sacral Chakra', focus: 'Emotions — Creativity — Pleasure', teachingText: 'Svadhisthana — Emotion & Creativity' },
  'l2-chakra-solar-plexus': { concept: 'Solar Plexus Chakra', focus: 'Personal Power — Self-Esteem — Drive', teachingText: 'Manipura — Willpower & Confidence' },
  'l2-chakra-heart': { concept: 'Heart Chakra', focus: 'Love — Compassion — Connection', teachingText: 'Anahata — Love & Integration' },
  'l2-chakra-throat': { concept: 'Throat Chakra', focus: 'Communication — Truth — Authenticity', teachingText: 'Vishuddha — Communication & Expression' },
  'l2-chakra-third-eye': { concept: 'Third Eye Chakra', focus: 'Imagination — Perception — Visualization', teachingText: 'Ajna — Intuition & Insight' },
  'l2-chakra-crown': { concept: 'Crown Chakra', focus: 'Spiritual Connection — Inner Wisdom', teachingText: 'Sahasrara — Spirituality & Consciousness' },
};

function getEnSlideData(slideId: string) {
  return EN_SLIDES[slideId] || null;
}

function getEnChakraData(chakraId: string) {
  return EN_CHAKRAS[chakraId] || null;
}

// =============================================================================
// MAIN
// =============================================================================

async function main() {
  console.log('=========================================================');
  console.log('  Generate Translated Teachers Aid HTML Files');
  console.log('=========================================================\n');

  const templateHtml = fs.readFileSync(TEMPLATE_PATH, 'utf-8');
  console.log(`  Template: ${TEMPLATE_PATH} (${templateHtml.length} chars)\n`);

  for (const locale of LOCALES) {
    const jsonPath = path.join(TRANSLATIONS_DIR, `${locale}.json`);
    if (!fs.existsSync(jsonPath)) {
      console.error(`  Translation file not found: ${jsonPath}`);
      continue;
    }

    const translation: Translation = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    console.log(`  [${locale.toUpperCase()}] Translating...`);

    const translatedHtml = translateHtml(templateHtml, translation, locale);

    const outputPath = path.join(MANUAL_DIR, `roses-teachers-aid-${locale}.html`);
    fs.writeFileSync(outputPath, translatedHtml, 'utf-8');
    console.log(`         Output: ${outputPath} (${translatedHtml.length} chars)`);
  }

  console.log('\n=========================================================');
  console.log('  Done. HTML files generated.');
  console.log('=========================================================\n');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
