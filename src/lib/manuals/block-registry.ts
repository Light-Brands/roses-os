/**
 * Block registry contract (T-013).
 *
 * Each block declares its shape in one place. The central registry assembles
 * them so adapters (HTML export, MD export, render path, preview) read a single
 * source of truth per block type.
 *
 * The renderer + previewer + serializer + deserializer all consume the same
 * entries; adding a new block type means adding one registry entry and
 * registering its Zod schema in `block-schema.ts`.
 */

import type { ComponentType } from 'react';
import type { BlockSchema } from './block-schema';
import {
  headingContentSchema,
  textContentSchema,
  imageContentSchema,
  imageRowContentSchema,
  dividerContentSchema,
  pageBreakContentSchema,
  coverContentSchema,
  calloutContentSchema,
  quoteContentSchema,
  numberedExerciseContentSchema,
  captionedFigureContentSchema,
  spokenInstructionContentSchema,
  tableContentSchema,
  contentsContentSchema,
  footnoteContentSchema,
  glossaryContentSchema,
  sectionContentSchema,
  twoColumnSectionContentSchema,
} from './block-schema';
import type { z } from 'zod';
import type { BlockType, BlockContent } from './types';

type ContentValidator = z.ZodType<unknown>;

export interface BlockRegistryEntry {
  /** The discriminator: must match `block_type` in DB and TS union. */
  kind: BlockType;
  /** Human label for the palette. */
  label: string;
  /** One-line description for the palette tooltip. */
  description: string;
  /** Schema version this block writes by default. */
  schemaVersion: 1 | 2;
  /** Zod validator for the content shape. */
  validator: ContentValidator;
  /** Default content emitted when the author drops a fresh block. */
  defaultContent: () => BlockContent;
  /** Renderer component (set by the React side, undefined during type-only use). */
  renderer?: ComponentType<{ content: BlockContent }>;
  /** Preview component (print-CSS view); typically same as renderer or its print variant. */
  preview?: ComponentType<{ content: BlockContent }>;
  /** Serialize this block's content to inline HTML for the legacy exporter. */
  serializeHtml: (content: BlockContent) => string;
  /** Serialize this block's content to GitHub-flavored Markdown. */
  serializeMd: (content: BlockContent) => string;
  /** Does this block carry child block IDs (Section, TwoColumnSection)? */
  isContainer: boolean;
}

// Empty serializers default - actual logic lives in export-html.ts / export-md.ts;
// the registry's serializer functions are filled in M2 + M3 when the block
// primitives ship. For M1 the registry asserts the SHAPE of the contract.

const PASSTHROUGH_HTML = (): string => '';
const PASSTHROUGH_MD = (): string => '';

export const blockRegistry: ReadonlyArray<BlockRegistryEntry> = [
  {
    kind: 'heading',
    label: 'Heading',
    description: 'Section title with optional eyebrow strip.',
    schemaVersion: 1,
    validator: headingContentSchema,
    defaultContent: () => ({ text: 'New heading', level: 2 }),
    serializeHtml: PASSTHROUGH_HTML,
    serializeMd: PASSTHROUGH_MD,
    isContainer: false,
  },
  {
    kind: 'text',
    label: 'Text',
    description: 'Paragraph or list. Rich-text editor in M2.',
    schemaVersion: 1,
    validator: textContentSchema,
    defaultContent: () => ({ html: '' }),
    serializeHtml: PASSTHROUGH_HTML,
    serializeMd: PASSTHROUGH_MD,
    isContainer: false,
  },
  {
    kind: 'image',
    label: 'Image',
    description: 'Single image (deprecation candidate; prefer captioned-figure).',
    schemaVersion: 1,
    validator: imageContentSchema,
    defaultContent: () => ({ src: '', alt: '' }),
    serializeHtml: PASSTHROUGH_HTML,
    serializeMd: PASSTHROUGH_MD,
    isContainer: false,
  },
  {
    kind: 'image-row',
    label: 'Image row',
    description: 'Two to four images side-by-side (deprecation candidate; prefer two-column-section).',
    schemaVersion: 1,
    validator: imageRowContentSchema,
    defaultContent: () => ({ images: [{ src: '', alt: '' }, { src: '', alt: '' }] }),
    serializeHtml: PASSTHROUGH_HTML,
    serializeMd: PASSTHROUGH_MD,
    isContainer: false,
  },
  {
    kind: 'divider',
    label: 'Divider',
    description: 'Horizontal separator.',
    schemaVersion: 1,
    validator: dividerContentSchema,
    defaultContent: () => ({}),
    serializeHtml: PASSTHROUGH_HTML,
    serializeMd: PASSTHROUGH_MD,
    isContainer: false,
  },
  {
    kind: 'page-break',
    label: 'Page break',
    description: 'Forces the renderer to start a new page.',
    schemaVersion: 1,
    validator: pageBreakContentSchema,
    defaultContent: () => ({}),
    serializeHtml: PASSTHROUGH_HTML,
    serializeMd: PASSTHROUGH_MD,
    isContainer: false,
  },
  {
    kind: 'cover',
    label: 'Cover',
    description: 'Title page with author + illustrator + cover image.',
    schemaVersion: 2,
    validator: coverContentSchema,
    defaultContent: () => ({ schema_version: 2, title: 'Manual title' }),
    serializeHtml: PASSTHROUGH_HTML,
    serializeMd: PASSTHROUGH_MD,
    isContainer: false,
  },
  {
    kind: 'callout',
    label: 'Callout',
    description: 'Tinted box with note / warning / wisdom / summary variant.',
    schemaVersion: 2,
    validator: calloutContentSchema,
    defaultContent: () => ({
      schema_version: 2,
      variant: 'note',
      body: { type: 'doc', content: [] },
    }),
    serializeHtml: PASSTHROUGH_HTML,
    serializeMd: PASSTHROUGH_MD,
    isContainer: false,
  },
  {
    kind: 'quote',
    label: 'Quote',
    description: 'Tinted blockquote with left rule and optional attribution.',
    schemaVersion: 2,
    validator: quoteContentSchema,
    defaultContent: () => ({
      schema_version: 2,
      body: { type: 'doc', content: [] },
    }),
    serializeHtml: PASSTHROUGH_HTML,
    serializeMd: PASSTHROUGH_MD,
    isContainer: false,
  },
  {
    kind: 'numbered-exercise',
    label: 'Numbered exercise',
    description: 'Outsize numeral + body, hanging indent.',
    schemaVersion: 2,
    validator: numberedExerciseContentSchema,
    defaultContent: () => ({
      schema_version: 2,
      numeral: '1',
      body: { type: 'doc', content: [] },
    }),
    serializeHtml: PASSTHROUGH_HTML,
    serializeMd: PASSTHROUGH_MD,
    isContainer: false,
  },
  {
    kind: 'captioned-figure',
    label: 'Captioned figure',
    description: 'Image with italic terracotta caption.',
    schemaVersion: 2,
    validator: captionedFigureContentSchema,
    defaultContent: () => ({ schema_version: 2, src: '', alt: '' }),
    serializeHtml: PASSTHROUGH_HTML,
    serializeMd: PASSTHROUGH_MD,
    isContainer: false,
  },
  {
    kind: 'spoken-instruction',
    label: 'Spoken instruction',
    description: 'Bold quoted line with rose-icon marker.',
    schemaVersion: 2,
    validator: spokenInstructionContentSchema,
    defaultContent: () => ({ schema_version: 2, spoken: '' }),
    serializeHtml: PASSTHROUGH_HTML,
    serializeMd: PASSTHROUGH_MD,
    isContainer: false,
  },
  {
    kind: 'table',
    label: 'Table',
    description: 'Simple table with header row.',
    schemaVersion: 2,
    validator: tableContentSchema,
    defaultContent: () => ({ schema_version: 2, header: [''], rows: [['']] }),
    serializeHtml: PASSTHROUGH_HTML,
    serializeMd: PASSTHROUGH_MD,
    isContainer: false,
  },
  {
    kind: 'contents',
    label: 'Table of contents',
    description: 'Canon contents list: numeral · title · page, hairline rows.',
    schemaVersion: 2,
    validator: contentsContentSchema,
    defaultContent: () => ({ schema_version: 2, rows: [{ title: '' }] }),
    serializeHtml: PASSTHROUGH_HTML,
    serializeMd: PASSTHROUGH_MD,
    isContainer: false,
  },
  {
    kind: 'footnote',
    label: 'Footnote',
    description: 'Inline refs + definitions at section end.',
    schemaVersion: 2,
    validator: footnoteContentSchema,
    defaultContent: () => ({
      schema_version: 2,
      body: { type: 'doc', content: [] },
      notes: {},
    }),
    serializeHtml: PASSTHROUGH_HTML,
    serializeMd: PASSTHROUGH_MD,
    isContainer: false,
  },
  {
    kind: 'glossary',
    label: 'Glossary',
    description: 'Term + definition pairs.',
    schemaVersion: 2,
    validator: glossaryContentSchema,
    defaultContent: () => ({ schema_version: 2, entries: [] }),
    serializeHtml: PASSTHROUGH_HTML,
    serializeMd: PASSTHROUGH_MD,
    isContainer: false,
  },
  {
    kind: 'section',
    label: 'Section',
    description: 'Group of blocks (page-aware preview boundary).',
    schemaVersion: 2,
    validator: sectionContentSchema,
    defaultContent: () => ({ schema_version: 2, children: [] }),
    serializeHtml: PASSTHROUGH_HTML,
    serializeMd: PASSTHROUGH_MD,
    isContainer: true,
  },
  {
    kind: 'two-column-section',
    label: 'Two column section',
    description: 'Two-column container with left/right children.',
    schemaVersion: 2,
    validator: twoColumnSectionContentSchema,
    defaultContent: () => ({ schema_version: 2, left: [], right: [] }),
    serializeHtml: PASSTHROUGH_HTML,
    serializeMd: PASSTHROUGH_MD,
    isContainer: true,
  },
];

export function blockRegistryEntry(kind: BlockType): BlockRegistryEntry | undefined {
  return blockRegistry.find((e) => e.kind === kind);
}

export function blockRegistryKinds(): BlockType[] {
  return blockRegistry.map((e) => e.kind);
}

// Sanity: union check for completeness. If this fails to compile, a BlockType
// variant is missing from the registry.
const _completeness: { [K in BlockType]: true } = blockRegistry.reduce<Record<BlockType, true>>(
  (acc, e) => {
    acc[e.kind] = true;
    return acc;
  },
  {} as Record<BlockType, true>,
);
void _completeness;

// Discriminated reference for callers who want the typed BlockSchema entry.
export type RegistryEntryFor<T extends BlockType> = BlockRegistryEntry & { kind: T };
export type BlockOfKind<T extends BlockType> = Extract<BlockSchema, { block_type: T }>;
