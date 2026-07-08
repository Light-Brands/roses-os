/**
 * Zod validators for the v1/v2 block schema (T-010 + AC5).
 *
 * Each variant has its own Zod schema; the top-level union is a
 * `z.discriminatedUnion` keyed on `block_type`. Schema_version inside content
 * is loose: v1 rows have no `schema_version` (defaults to 1); v2 rows must set
 * it to 2 explicitly.
 *
 * The API gates (`/api/manuals/[manualId]/blocks` POST and PUT) reject invalid
 * blocks with the named-error envelope `{ok: false, error: {code: 'INVALID_BLOCK',
 * message: <human>}}` per Section D of genesis-build and AC5 of the spec.
 *
 * Backward-compat handling: blocks that fail strict validation route through
 * `block-parser.ts::parseManualBlock()` to a `{ kind: 'unknown', raw }` fallback
 * for read paths. Write paths refuse invalid blocks.
 */

import { z } from 'zod';

// ----- TipTap canonical JSON loose schema ----------------------------------

const tiptapMarkSchema: z.ZodType<unknown> = z.object({
  type: z.string(),
  attrs: z.record(z.string(), z.unknown()).optional(),
});

type TiptapNodeShape = {
  type: string;
  attrs?: Record<string, unknown>;
  content?: TiptapNodeShape[];
  marks?: unknown[];
  text?: string;
};

const tiptapNodeSchema: z.ZodType<TiptapNodeShape> = z.lazy(() =>
  z.object({
    type: z.string(),
    attrs: z.record(z.string(), z.unknown()).optional(),
    content: z.array(tiptapNodeSchema).optional(),
    marks: z.array(tiptapMarkSchema).optional(),
    text: z.string().optional(),
  }),
);

export const tiptapDocSchema = z.object({
  type: z.literal('doc'),
  content: z.array(tiptapNodeSchema).optional(),
});

// ----- Per-variant content schemas -----------------------------------------

const schemaVersionField = z.union([z.literal(1), z.literal(2)]).optional();

export const headingContentSchema = z.object({
  schema_version: schemaVersionField,
  text: z.string(),
  level: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  eyebrow: z.string().optional(),
});

export const textContentSchema = z.object({
  schema_version: schemaVersionField,
  html: z.string(),
  doc: tiptapDocSchema.optional(),
});

export const imageContentSchema = z.object({
  schema_version: schemaVersionField,
  src: z.string(),
  alt: z.string(),
  caption: z.string().optional(),
  width_pct: z.number().min(2).max(100).optional(),
});

export const imageRowContentSchema = z.object({
  schema_version: schemaVersionField,
  images: z.array(z.object({ src: z.string(), alt: z.string() })).min(2).max(4),
  caption: z.string().optional(),
});

export const dividerContentSchema = z.object({
  schema_version: schemaVersionField,
});

export const pageBreakContentSchema = z.object({
  schema_version: schemaVersionField,
});

export const coverContentSchema = z.object({
  schema_version: z.literal(2),
  title: z.string(),
  subtitle: z.string().optional(),
  align: z.enum(['left', 'center']).optional(),
  author: z.string().optional(),
  illustrator: z.string().optional(),
  cover_image: z.string().optional(),
  eyebrow: z.string().optional(),
  credits: z.string().optional(),
  edition: z.string().optional(),
  notice: z.string().optional(),
});

export const contentsRowSchema = z.object({
  numeral: z.string().optional(),
  title: z.string(),
  page: z.string().optional(),
});

export const contentsContentSchema = z.object({
  schema_version: z.literal(2),
  eyebrow: z.string().optional(),
  rows: z.array(contentsRowSchema),
});

export const calloutVariantSchema = z.enum(['note', 'warning', 'wisdom', 'summary']);

export const calloutContentSchema = z.object({
  schema_version: z.literal(2),
  variant: calloutVariantSchema,
  title: z.string().optional(),
  hideLabel: z.boolean().optional(),
  body: tiptapDocSchema,
});

export const quoteContentSchema = z.object({
  schema_version: z.literal(2),
  body: tiptapDocSchema,
  attribution: z.string().optional(),
});

export const numberedExerciseContentSchema = z.object({
  schema_version: z.literal(2),
  numeral: z.string(),
  title: z.string().optional(),
  body: tiptapDocSchema,
});

export const captionedFigureContentSchema = z.object({
  schema_version: z.literal(2),
  src: z.string(),
  alt: z.string(),
  caption: z.string().optional(),
  credit: z.string().optional(),
});

export const spokenInstructionContentSchema = z.object({
  schema_version: z.literal(2),
  spoken: z.string(),
  prose: tiptapDocSchema.optional(),
});

export const tableContentSchema = z.object({
  schema_version: z.literal(2),
  header: z.array(z.string()),
  rows: z.array(z.array(z.string())),
  caption: z.string().optional(),
});

export const footnoteContentSchema = z.object({
  schema_version: z.literal(2),
  body: tiptapDocSchema,
  notes: z.record(z.string(), z.string()),
});

export const glossaryEntrySchema = z.object({
  term: z.string(),
  definition: z.string(),
});

export const glossaryContentSchema = z.object({
  schema_version: z.literal(2),
  entries: z.array(glossaryEntrySchema),
});

export const sectionContentSchema = z.object({
  schema_version: z.literal(2),
  title: z.string().optional(),
  children: z.array(z.string()),
});

export const twoColumnSectionContentSchema = z.object({
  schema_version: z.literal(2),
  left: z.array(z.string()),
  right: z.array(z.string()),
  proportions: z.tuple([z.number(), z.number()]).optional(),
});

// ----- Top-level block schemas (block_type + content) ----------------------

const wrap = <T extends z.ZodType>(blockType: string, contentSchema: T) =>
  z.object({
    block_type: z.literal(blockType),
    content: contentSchema,
  });

export const blockSchema = z.discriminatedUnion('block_type', [
  wrap('heading', headingContentSchema),
  wrap('text', textContentSchema),
  wrap('image', imageContentSchema),
  wrap('image-row', imageRowContentSchema),
  wrap('divider', dividerContentSchema),
  wrap('page-break', pageBreakContentSchema),
  wrap('cover', coverContentSchema),
  wrap('callout', calloutContentSchema),
  wrap('quote', quoteContentSchema),
  wrap('numbered-exercise', numberedExerciseContentSchema),
  wrap('captioned-figure', captionedFigureContentSchema),
  wrap('spoken-instruction', spokenInstructionContentSchema),
  wrap('table', tableContentSchema),
  wrap('contents', contentsContentSchema),
  wrap('footnote', footnoteContentSchema),
  wrap('glossary', glossaryContentSchema),
  wrap('section', sectionContentSchema),
  wrap('two-column-section', twoColumnSectionContentSchema),
]);

export type BlockSchema = z.infer<typeof blockSchema>;

// ----- Named-error envelope helpers (Section D / AC5) ----------------------

export const INVALID_BLOCK_CODE = 'INVALID_BLOCK';

export interface InvalidBlockErrorBody {
  ok: false;
  error: {
    code: typeof INVALID_BLOCK_CODE;
    message: string;
    /** Optional per-field issues from Zod for client-side surfacing. */
    issues?: Array<{ path: PropertyKey[]; message: string }>;
  };
}

/**
 * Validate the {block_type, content} shape coming off the wire. Returns either
 * `{ok: true, value}` or a Section D / AC5 named-error envelope ready to JSON-stringify.
 */
export function validateBlockInput(
  raw: unknown,
):
  | { ok: true; value: BlockSchema }
  | { ok: false; status: number; body: InvalidBlockErrorBody } {
  const parsed = blockSchema.safeParse(raw);
  if (parsed.success) {
    return { ok: true, value: parsed.data };
  }
  return {
    ok: false,
    status: 400,
    body: {
      ok: false,
      error: {
        code: INVALID_BLOCK_CODE,
        message: 'Block payload failed schema validation.',
        issues: parsed.error.issues.map((i) => ({ path: i.path, message: i.message })),
      },
    },
  };
}
