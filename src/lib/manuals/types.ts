// =============================================================================
// COLLABORATIVE MANUAL EDITING — Type Definitions
// =============================================================================

/** Supported languages for manual editing */
export type ManualLanguage = 'en' | 'pt' | 'es' | 'el' | 'ru' | 'uk' | 'de';

export const MANUAL_LANGUAGES: { code: ManualLanguage; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'pt', label: 'Portugues' },
  { code: 'es', label: 'Espanol' },
  { code: 'el', label: 'Ellinika' },
  { code: 'ru', label: 'Russkij' },
  { code: 'uk', label: "Ukrains'ka" },
  { code: 'de', label: 'Deutsch' },
];

/** Block types available in the manual editor (schema v1 ↔ v2).
 *
 * Existing v1 types are preserved for backward compat (rows in the DB still
 * carry them). New v2 variants ship via M3 of spec 001-richer-block-editor and
 * are listed below the original six.
 *
 * AC10 ceiling: keep this union under 12 variants by the end of M3. The
 * deprecation runway at `block-deprecation.md` shepherds `image-row` and
 * `divider` toward retirement after the new variants land.
 */
export type BlockType =
  // v1 (current schema)
  | 'heading'
  | 'text'
  | 'image'
  | 'divider'
  | 'page-break'
  | 'image-row'
  // v2 (richer-block-editor spec)
  | 'cover'
  | 'callout'
  | 'quote'
  | 'numbered-exercise'
  | 'captioned-figure'
  | 'spoken-instruction'
  | 'table'
  | 'contents'
  | 'footnote'
  | 'glossary'
  | 'section'
  | 'two-column-section';

/** Schema version baked into every block's content per AC4. */
export type BlockSchemaVersion = 1 | 2;

/** Content shape per block type */
export interface HeadingContent {
  schema_version?: BlockSchemaVersion; // v2-aware variants set 2; v1 rows have no field (parsed as 1)
  text: string;
  level: 1 | 2 | 3;
  /** Optional eyebrow strip above an h1 (v2 only; pairs to the existing heading slot per T-032). */
  eyebrow?: string;
}

export interface TextContent {
  schema_version?: BlockSchemaVersion;
  html: string;
  /** v2 canonical JSON shape (TipTap document JSON). Optional during the v1→v2 migration window. */
  doc?: TiptapDoc;
}

export interface ImageContent {
  schema_version?: BlockSchemaVersion;
  src: string;
  alt: string;
  caption?: string;
}

export interface ImageRowItem {
  src: string;
  alt: string;
}

export interface ImageRowContent {
  schema_version?: BlockSchemaVersion;
  images: ImageRowItem[]; // 2–4 images rendered side-by-side
  caption?: string;
}

// =============================================================================
// v2 content shapes (M1 schema, primitives land in M3)
// =============================================================================

export interface CoverContent {
  schema_version: 2;
  title: string;
  /** Italic subtitle below the title (e.g., "Level 1 — Initiation Course"). */
  subtitle?: string;
  /** Masthead alignment. Front covers center; contents-page mastheads go left. Defaults to center. */
  align?: 'left' | 'center';
  author?: string;
  illustrator?: string;
  cover_image?: string;
  /** Small eyebrow line above the title (e.g., "ROSES OS · LEVEL 1"). */
  eyebrow?: string;
}

/** A single table-of-contents row: numeral | title | page. */
export interface ContentsRow {
  /** Left-hand numeral or range (e.g., "1", "3–5"). Optional for unnumbered entries. */
  numeral?: string;
  title: string;
  /** Right-hand page reference. */
  page?: string;
}

export interface ContentsContent {
  schema_version: 2;
  /** Optional eyebrow above the contents list (e.g., "CONTENTS"). */
  eyebrow?: string;
  rows: ContentsRow[];
}

export type CalloutVariant = 'note' | 'warning' | 'wisdom' | 'summary';

export interface CalloutContent {
  schema_version: 2;
  variant: CalloutVariant;
  title?: string;
  /** Hide the variant label strip in the read view (canon notes carry no label). */
  hideLabel?: boolean;
  /** Canonical JSON body (TipTap doc). */
  body: TiptapDoc;
}

export interface QuoteContent {
  schema_version: 2;
  body: TiptapDoc;
  attribution?: string;
}

export interface NumberedExerciseContent {
  schema_version: 2;
  numeral: string;
  title?: string;
  body: TiptapDoc;
}

export interface CaptionedFigureContent {
  schema_version: 2;
  src: string;
  alt: string;
  caption?: string;
  /** Optional credit line beneath caption (italic, muted). */
  credit?: string;
}

export interface SpokenInstructionContent {
  schema_version: 2;
  /** The line the practitioner says aloud. Rendered with rose-icon marker + bold. */
  spoken: string;
  /** Optional follow-on prose. */
  prose?: TiptapDoc;
}

export interface TableContent {
  schema_version: 2;
  header: string[];
  rows: string[][];
  caption?: string;
}

export interface FootnoteContent {
  schema_version: 2;
  /** Inline ref body using the markers below. */
  body: TiptapDoc;
  /** Map of footnote markers to definitions. */
  notes: Record<string, string>;
}

export interface GlossaryEntry {
  term: string;
  definition: string;
}

export interface GlossaryContent {
  schema_version: 2;
  entries: GlossaryEntry[];
}

export interface SectionContent {
  schema_version: 2;
  title?: string;
  /** Children block IDs (parent reference; flat-table storage). */
  children: string[];
}

export interface TwoColumnSectionContent {
  schema_version: 2;
  /** Left and right column children, by block ID. */
  left: string[];
  right: string[];
  /** Column proportions. Defaults to [1, 1]. */
  proportions?: [number, number];
}

/**
 * TipTap canonical JSON shape. Kept loose at the type level because TipTap's
 * own types do not export a stable Doc type for v2; runtime validation lives
 * in `richtext/serializer.ts` and `block-schema.ts`.
 */
export interface TiptapDoc {
  type: 'doc';
  content?: TiptapNode[];
}

export interface TiptapNode {
  type: string;
  attrs?: Record<string, unknown>;
  content?: TiptapNode[];
  marks?: TiptapMark[];
  text?: string;
}

export interface TiptapMark {
  type: string;
  attrs?: Record<string, unknown>;
}

export type BlockContent =
  | HeadingContent
  | TextContent
  | ImageContent
  | ImageRowContent
  | CoverContent
  | CalloutContent
  | QuoteContent
  | NumberedExerciseContent
  | CaptionedFigureContent
  | SpokenInstructionContent
  | TableContent
  | ContentsContent
  | FootnoteContent
  | GlossaryContent
  | SectionContent
  | TwoColumnSectionContent
  | Record<string, never>;

/** A manual (e.g. "Rose Meditation Level 1") */
export interface Manual {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  cover_image: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

/** A content block within a manual for a specific language */
export interface ManualBlock {
  id: string;
  manual_id: string;
  language: ManualLanguage;
  block_type: BlockType;
  content: BlockContent;
  position: number;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
  /**
   * Reconstruction provenance (migration 0006, D-12): the 1-based canon PDF page
   * this block was extracted from. NULL for legacy and interactively-added rows.
   * Render-only — the editor uses it to mark canon page boundaries.
   */
  source_page?: number | null;
}

/** Role assigned after PIN verification */
export type ManualRole = 'editor' | 'teacher';

/** PIN verification response */
export interface PinVerifyResponse {
  success: boolean;
  role?: ManualRole;
  error?: string;
}

/** API response wrapper */
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}
