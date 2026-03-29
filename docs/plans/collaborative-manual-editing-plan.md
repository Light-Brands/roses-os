# Collaborative Manual Editing System — Implementation Plan

## Overview

Build a PIN-gated collaborative editing system for sacred teaching manuals (Rose Meditation 1, 2, 3 and Aura 1, expandable). Editors use a block-based editor to update text and images per language. Teachers can view and download manuals in PDF, DOCX, or Markdown at US Letter size (8.5" x 11"). PINs are admin-configurable via Supabase.

---

## Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Content storage | **Supabase** (existing `content` + new `manual_sections` table) | Multiple editors, no Git required, real-time capable |
| Editor UX | **Block-based editor** (Notion-style sections) | Each manual = ordered list of blocks (text, image, heading, divider). Drag-to-reorder, inline editing. |
| Paper size | **US Letter** (8.5" x 11") | Matches existing manuals |
| PIN management | **Admin dashboard setting** (Supabase `settings` table) | Configurable without deploys |
| Languages | EN, PT, ES, EL (existing) + **RU, UK** (new) | 6 total |

---

## Data Model

### New Supabase Table: `manual_sections`

```sql
CREATE TABLE manual_sections (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  manual_id   TEXT NOT NULL,          -- 'rose-meditation-1', 'rose-meditation-2', 'rose-meditation-3', 'aura-1'
  locale      TEXT NOT NULL DEFAULT 'en',  -- 'en','pt','es','el','ru','uk'
  position    INTEGER NOT NULL,       -- sort order within manual+locale
  block_type  TEXT NOT NULL,          -- 'heading', 'text', 'image', 'divider', 'page-break'
  content     JSONB NOT NULL DEFAULT '{}',
  -- For 'heading': { "level": 1|2|3, "text": "..." }
  -- For 'text':    { "markdown": "..." }
  -- For 'image':   { "src": "...", "alt": "...", "caption": "...", "width": "full"|"half" }
  -- For 'divider': {}
  -- For 'page-break': {}
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now(),
  updated_by  TEXT,                   -- editor identifier or PIN session
  UNIQUE(manual_id, locale, position)
);

CREATE INDEX idx_manual_sections_lookup ON manual_sections(manual_id, locale, position);
```

### Manual Registry (static config)

```typescript
// src/lib/manuals/config.ts
export const MANUALS = [
  { id: 'rose-meditation-1', title: 'Rose Meditation Level 1', category: 'rose-meditation' },
  { id: 'rose-meditation-2', title: 'Rose Meditation Level 2', category: 'rose-meditation' },
  { id: 'rose-meditation-3', title: 'Rose Meditation Level 3', category: 'rose-meditation' },
  { id: 'aura-1',            title: 'Aura Level 1',           category: 'aura' },
] as const;
```

### Settings Table Entries (PINs)

```sql
INSERT INTO settings (key, value, description)
VALUES
  ('manuals_editor_pin', '"7777"', 'PIN for manual editors (read + write)'),
  ('manuals_teacher_pin', '"4444"', 'PIN for teachers (read-only, download)');
```

---

## Two-Tier PIN Gate

### How it works

1. User visits `/manuals` → sees a PIN gate (similar to existing `PasswordGate.tsx`)
2. PIN is validated against Supabase `settings` table via an API route
3. If PIN matches `manuals_editor_pin` → session gets `role: 'editor'` (stored in sessionStorage)
4. If PIN matches `manuals_teacher_pin` → session gets `role: 'teacher'`
5. If neither → error "Incorrect code"
6. The role determines what UI is shown:
   - **Editor**: sees edit buttons, can modify blocks, upload images
   - **Teacher**: sees read-only view, download/export buttons only

### Files to create/modify

| File | Action | Purpose |
|------|--------|---------|
| `src/components/manuals/ManualGate.tsx` | **Create** | Two-tier PIN gate component |
| `src/app/api/manuals/verify-pin/route.ts` | **Create** | Server-side PIN verification against Supabase settings |
| `src/lib/manuals/auth.ts` | **Create** | `useManualAuth()` hook — returns `{ role, isEditor, isTeacher }` |
| `src/app/(admin)/admin/settings/page.tsx` | **Modify** | Add PIN management fields to admin settings |

---

## i18n: Add Russian & Ukrainian

### Files to create/modify

| File | Action | Purpose |
|------|--------|---------|
| `src/lib/i18n/types.ts` | **Modify** | Add `'ru' \| 'uk'` to `Locale` type, add entries to `LOCALES` array |
| `src/lib/i18n/context.tsx` | **Modify** | Update valid locale list to include `'ru'`, `'uk'` |
| `src/content/teaching/ru.json` | **Create** | Russian translations (copy structure from en.json, translate) |
| `src/content/teaching/uk.json` | **Create** | Ukrainian translations (copy structure from en.json, translate) |
| `src/lib/manuals/i18n.ts` | **Create** | Manual-specific UI strings for all 6 locales |

### Locale type update

```typescript
// src/lib/i18n/types.ts
export type Locale = 'en' | 'pt' | 'es' | 'el' | 'ru' | 'uk';

export const LOCALES: { code: Locale; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'pt', label: 'Portugues' },
  { code: 'es', label: 'Espanol' },
  { code: 'el', label: 'Ellenika' },
  { code: 'ru', label: 'Russkiy' },
  { code: 'uk', label: 'Ukrainska' },
];
```

---

## Block-Based Editor

### Block Types

| Type | Rendered as | Editor UI |
|------|-------------|-----------|
| `heading` | h1/h2/h3 with serif font | Text input + level selector (1/2/3) |
| `text` | Markdown-rendered paragraph(s) | Textarea with markdown preview toggle |
| `image` | Responsive image with optional caption | Upload dropzone + alt text + caption fields |
| `divider` | Decorative horizontal rule | Click to insert, no config needed |
| `page-break` | Forces new page in PDF/DOCX export | Click to insert, invisible in web view |

### Editor Components

| File | Purpose |
|------|---------|
| `src/components/manuals/ManualEditor.tsx` | Main editor shell — loads blocks, handles reorder |
| `src/components/manuals/BlockList.tsx` | Sortable block list with drag handles |
| `src/components/manuals/blocks/HeadingBlock.tsx` | Heading block editor |
| `src/components/manuals/blocks/TextBlock.tsx` | Markdown text block editor with preview |
| `src/components/manuals/blocks/ImageBlock.tsx` | Image upload/replace block |
| `src/components/manuals/blocks/DividerBlock.tsx` | Decorative divider block |
| `src/components/manuals/blocks/PageBreakBlock.tsx` | Page break marker block |
| `src/components/manuals/BlockToolbar.tsx` | "Add block" toolbar (appears between blocks) |
| `src/components/manuals/BlockWrapper.tsx` | Wrapper with drag handle, delete, move up/down |

### Drag & Drop

Use a lightweight approach: up/down arrow buttons on each block + optional HTML5 drag. No heavy dependency needed — the block list is ordered by `position` integer. Reordering updates position values via API.

### Auto-save

Each block auto-saves on blur (debounced 1s). A small "Saving..." / "Saved" indicator in the toolbar. Uses the PATCH endpoint on `manual_sections`.

---

## Read-Only View (Teacher Mode)

| File | Purpose |
|------|---------|
| `src/components/manuals/ManualViewer.tsx` | Read-only renderer — same blocks, no edit UI |
| `src/components/manuals/ManualExportBar.tsx` | Download buttons: PDF, DOCX, Markdown |

The viewer renders the same block data but with no edit controls. Markdown blocks are rendered to HTML. Images are displayed at full resolution.

---

## Export Pipeline

### API Routes

| Route | Purpose |
|-------|---------|
| `src/app/api/manuals/export/pdf/route.ts` | Generate PDF from blocks using pdf-lib |
| `src/app/api/manuals/export/docx/route.ts` | Generate DOCX from blocks using docx package |
| `src/app/api/manuals/export/md/route.ts` | Generate Markdown file from blocks |

### Export Flow

1. Client calls `/api/manuals/export/[format]?manual=rose-meditation-1&locale=en`
2. API fetches all `manual_sections` for that manual+locale, ordered by position
3. Transforms blocks into the target format
4. Returns file as a download

### PDF Generation (pdf-lib)

- Page size: US Letter (612 x 792 points)
- Margins: 72pt (1 inch) all sides
- Fonts: Embed serif (for headings) + sans-serif (for body) — match brand
- Images: Fetch from Supabase storage, embed with aspect ratio preservation
- Page breaks: Respected from `page-break` blocks
- Header/footer: Optional manual title + page number

### DOCX Generation (docx package)

- Page size: US Letter with 1-inch margins
- Styles: Map heading levels, body text, image blocks to DOCX paragraphs
- Images: Embed from Supabase storage
- Page breaks: `PageBreak` element between sections

### Markdown Export

- Headings → `# / ## / ###`
- Text → raw markdown (already stored as markdown)
- Images → `![alt](url)` with caption as italic below
- Dividers → `---`
- Page breaks → `<!-- page-break -->`

---

## URL Structure

```
/manuals                          → PIN gate → manual list
/manuals/[manualId]               → read-only view (teacher) or editor (editor PIN)
/manuals/[manualId]?locale=pt     → specific language version
```

### App Router File Structure

```
src/app/(manuals)/
  layout.tsx                      → ManualGate wrapper + LanguageProvider
  manuals/
    page.tsx                      → Manual listing (grid of 4 manuals)
    [manualId]/
      page.tsx                    → Editor or Viewer based on role
```

---

## API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/manuals/verify-pin` | POST | Verify PIN, return role |
| `/api/manuals/sections` | GET | Fetch all sections for a manual+locale |
| `/api/manuals/sections` | POST | Create a new block |
| `/api/manuals/sections/[id]` | PATCH | Update a block's content |
| `/api/manuals/sections/[id]` | DELETE | Delete a block |
| `/api/manuals/sections/reorder` | POST | Bulk update positions |
| `/api/manuals/upload` | POST | Upload image to Supabase storage |
| `/api/manuals/export/pdf` | GET | Export manual as PDF |
| `/api/manuals/export/docx` | GET | Export manual as DOCX |
| `/api/manuals/export/md` | GET | Export manual as Markdown |

---

## Admin Dashboard: PIN Management

Add a "Manuals" section to the existing admin settings page:

```
┌─────────────────────────────────────┐
│ Manual Access PINs                  │
│                                     │
│ Editor PIN:  [________] (Save)      │
│ Teacher PIN: [________] (Save)      │
│                                     │
│ Editors can modify manual content.  │
│ Teachers can view and download.     │
└─────────────────────────────────────┘
```

Reads/writes from `settings` table with keys `manuals_editor_pin` and `manuals_teacher_pin`.

---

## Implementation Phases

### Phase 1: Foundation (Core Infrastructure)
1. Add `ru` and `uk` to i18n types + create stub translation files
2. Create `manual_sections` Supabase table (migration SQL)
3. Create manual config registry (`src/lib/manuals/config.ts`)
4. Create PIN verification API + admin settings for PINs
5. Create `ManualGate` component (two-tier PIN)
6. Create `useManualAuth()` hook
7. Set up route group `src/app/(manuals)/` with layout

### Phase 2: Editor (Block-Based Editing)
1. Create CRUD API routes for `manual_sections`
2. Create image upload API route (Supabase storage)
3. Build block components: Heading, Text, Image, Divider, PageBreak
4. Build `BlockWrapper` with reorder controls + delete
5. Build `BlockToolbar` (add-block menu)
6. Build `ManualEditor` shell (loads blocks, manages state)
7. Implement auto-save with debounce

### Phase 3: Viewer & Export
1. Build `ManualViewer` (read-only block renderer)
2. Build PDF export API (pdf-lib, US Letter)
3. Build DOCX export API (docx package, US Letter)
4. Build Markdown export API
5. Build `ManualExportBar` with download buttons
6. Wire up the `/manuals/[manualId]` page to show Editor or Viewer based on role

### Phase 4: Content Seeding & Polish
1. Seed initial content for Rose Meditation 1, 2, 3 from existing HTML manuals
2. Create Aura 1 manual structure (empty or initial content)
3. Add Russian and Ukrainian translations for manual UI strings
4. Test export pipeline across all formats
5. Add print CSS refinements for manual pages

---

## File Summary: All Files to Create or Modify

### New Files (~25)

```
src/lib/manuals/
  config.ts                         — Manual registry (IDs, titles, categories)
  auth.ts                           — useManualAuth() hook + session helpers
  types.ts                          — Block types, ManualSection interface
  i18n.ts                           — Manual UI strings (6 locales)

src/components/manuals/
  ManualGate.tsx                    — Two-tier PIN gate
  ManualEditor.tsx                  — Main editor shell
  ManualViewer.tsx                  — Read-only renderer
  ManualExportBar.tsx               — PDF/DOCX/MD download buttons
  BlockList.tsx                     — Sortable block list
  BlockWrapper.tsx                  — Block chrome (drag, delete, move)
  BlockToolbar.tsx                  — "Add block" insertion menu
  blocks/
    HeadingBlock.tsx                — Heading block (edit + view modes)
    TextBlock.tsx                   — Markdown text block
    ImageBlock.tsx                  — Image upload/display block
    DividerBlock.tsx                — Decorative divider
    PageBreakBlock.tsx              — Page break marker

src/app/(manuals)/
  layout.tsx                        — Gate + providers wrapper
  manuals/
    page.tsx                        — Manual listing grid
    [manualId]/
      page.tsx                      — Editor or Viewer page

src/app/api/manuals/
  verify-pin/route.ts               — PIN verification
  sections/route.ts                 — GET (list) + POST (create) sections
  sections/[id]/route.ts            — PATCH + DELETE individual sections
  sections/reorder/route.ts         — Bulk position update
  upload/route.ts                   — Image upload to Supabase storage
  export/pdf/route.ts               — PDF export
  export/docx/route.ts              — DOCX export
  export/md/route.ts                — Markdown export

src/content/teaching/
  ru.json                           — Russian translations (teaching)
  uk.json                           — Ukrainian translations (teaching)
```

### Modified Files (~4)

```
src/lib/i18n/types.ts               — Add 'ru' | 'uk' to Locale type + LOCALES array
src/lib/i18n/context.tsx             — Add 'ru', 'uk' to valid locale check
src/lib/supabase/types.ts            — Add manual_sections table type
src/app/(admin)/admin/settings/      — Add PIN management section
```

---

## Dependencies

**No new npm packages required.** The existing stack covers everything:
- `pdf-lib` — PDF generation
- `docx` — DOCX generation
- `sharp` — Image processing
- `@supabase/supabase-js` — Database + storage
- Markdown rendering can use a simple regex-based approach or add `marked` (~12KB) if needed

**Optional addition:** If drag-and-drop reordering is desired beyond up/down buttons, consider `@dnd-kit/core` (~15KB). But up/down arrows + position numbers work fine for the initial version.

---

## Prompt for Implementation

When ready to implement, use this prompt:

> Implement Phase [N] of the collaborative manual editing system for roses-os.
> Reference: `/docs/plans/collaborative-manual-editing-plan.md`
> Branch: `claude/collaborative-manual-editing-Rm2v1`
>
> Follow the existing codebase patterns:
> - Use `cn()` from `@/lib/utils` for className merging
> - Use CSS variables from the design system (`--color-rose-clay`, etc.)
> - Use `framer-motion` for animations (consistent with PasswordGate)
> - Use the existing Supabase client helpers from `@/lib/supabase/`
> - Follow the existing component structure (named exports, 'use client' directive)
