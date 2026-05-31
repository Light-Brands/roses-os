// Fixture data for the richer-block-editor mockup.
// Drawn from docs/canon/Aura 1 - Jan2026.pdf, section "Cleansing the energy field".
// All block kinds shown match a named pattern from the canon inventory.

export const manual = {
  id: 'aura-level-1',
  slug: 'aura-level-1',
  title: 'Aura Level 1',
  cover_image: '/images/covers/aura-1.jpg',
  template: { corner_frames: true, palette: 'aura-warm' },
};

export const locales = [
  { code: 'en', label: 'EN', coverage: 'full' },
  { code: 'pt', label: 'PT', coverage: 'partial' },
  { code: 'es', label: 'ES', coverage: 'partial' },
  { code: 'el', label: 'EL', coverage: 'empty' },
  { code: 'ru', label: 'RU', coverage: 'empty' },
  { code: 'uk', label: 'UK', coverage: 'empty' },
];

export const paletteGroups = [
  {
    name: 'Headings',
    entries: [
      { kind: 'eyebrow-heading', label: 'Eyebrow plus h1', cite: 'Aura p 4' },
      { kind: 'heading', label: 'Section heading', cite: 'Aura p 9' },
      { kind: 'subheading', label: 'Subheading', cite: 'Aura p 12' },
    ],
  },
  {
    name: 'Body',
    entries: [
      { kind: 'text', label: 'Paragraph', cite: 'Aura p 2' },
      { kind: 'spoken-instruction', label: 'Spoken instruction', cite: 'Aura p 4 (rose-icon)' },
      { kind: 'callout', label: 'Callout', cite: 'Rose L1 p 6' },
      { kind: 'quote', label: 'Tinted blockquote', cite: 'Aura p 18' },
    ],
  },
  {
    name: 'Structure',
    entries: [
      { kind: 'two-column-section', label: 'Two-column section', cite: 'Aura p 12' },
      { kind: 'numbered-exercise', label: 'Numbered exercise', cite: 'Aura p 9 (numeral 4)' },
      { kind: 'summary-card', label: 'Summary card', cite: 'Rose L1 p 11' },
    ],
  },
  {
    name: 'Figures',
    entries: [
      { kind: 'captioned-figure', label: 'Captioned figure', cite: 'Aura p 25' },
      { kind: 'image-row', label: 'Image row', cite: 'Rose L1 p 8' },
    ],
  },
  {
    name: 'System',
    entries: [
      { kind: 'divider', label: 'Divider', cite: 'Aura p 14' },
      { kind: 'page-break', label: 'Page break', cite: 'system' },
      { kind: 'footnote', label: 'Footnote', cite: 'Rose L3 p 19' },
    ],
  },
];

// "Cleansing the energy field" section, 8 blocks. Schema v1 shape.
export const populatedBlocks = [
  {
    id: 'b1',
    kind: 'eyebrow-heading',
    schema_version: 1,
    content: { eyebrow: 'EXERCISE FOUR', title: 'Cleansing the energy field' },
  },
  {
    id: 'b2',
    kind: 'text',
    schema_version: 1,
    content: {
      doc: 'Once the rose is anchored, the practitioner moves attention to the boundary of the field. The body holds; the field receives.',
    },
  },
  {
    id: 'b3',
    kind: 'spoken-instruction',
    schema_version: 1,
    content: {
      cue: 'rose',
      line: 'I clear my field of what is not mine.',
    },
  },
  {
    id: 'b4',
    kind: 'numbered-exercise',
    schema_version: 1,
    content: {
      numeral: 4,
      body: 'Sit upright. Soften the jaw. Let breath travel from belly to crown. Begin three rounds of the cleansing sweep.',
    },
  },
  {
    id: 'b5',
    kind: 'two-column-section',
    schema_version: 1,
    content: {
      children: [
        {
          id: 'b5a',
          kind: 'captioned-figure',
          schema_version: 1,
          content: {
            src: '/images/aura-cleansing-diagram.png',
            alt: 'Aura cleansing sweep diagram',
            caption: 'The sweep moves outward, never inward.',
          },
        },
        {
          id: 'b5b',
          kind: 'text',
          schema_version: 1,
          content: {
            doc: 'The diagram on the left shows the direction of motion. Move from the crown down to the feet, then sweep outward at the boundary of the field.',
          },
        },
      ],
    },
  },
  {
    id: 'b6',
    kind: 'callout',
    schema_version: 1,
    content: {
      variant: 'note',
      body: 'If the field feels heavy, return to the rose anchor before continuing the sweep.',
    },
  },
  {
    id: 'b7',
    kind: 'quote',
    schema_version: 1,
    content: {
      body: 'What is not yours leaves more easily than what is.',
      attribution: 'Lineage teaching',
    },
  },
  {
    id: 'b8',
    kind: 'divider',
    schema_version: 1,
    content: {},
  },
];

// Volume variants for the populated state (E.1 three-volume mandate).
// Small = 1 block, medium = ~50 blocks (we render 18 then truncate visually),
// large = ~200 blocks (we render 30 then show a "+170 more" pill).
export const volumes = {
  small: populatedBlocks.slice(0, 1),
  medium: Array.from({ length: 18 }, (_, i) => populatedBlocks[i % populatedBlocks.length])
    .map((b, i) => ({ ...b, id: `m-${i}` })),
  large: Array.from({ length: 30 }, (_, i) => populatedBlocks[i % populatedBlocks.length])
    .map((b, i) => ({ ...b, id: `l-${i}` })),
};

export const errorStates = {
  validation: {
    block_id: 'b6',
    field: 'body',
    message: 'Callout body must be at least 4 characters. Add the text the practitioner should read.',
  },
  conflict: {
    other_editor: 'teacher (PIN ****)',
    other_locale: 'en',
    last_seen: '2026-05-28T17:48Z',
  },
  permission: {
    role_required: 'editor',
    role_seen: 'reader',
    suggestion: 'Refresh the page and enter your editor PIN.',
  },
};
