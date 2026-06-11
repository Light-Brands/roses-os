# Context packet: Faithful content reconstruction of the Roses OS manuals

Run id: `faithful-content-reconstruction-20260531-014843`
Spec slug: `002-faithful-content-reconstruction`
Target repo: `Light-Brands/roses-os` (existing). target_kind = existing.
Run mode: STRICT LOCAL / OFFLINE. GitHub is not reachable this session. No issues, no push, no PR. Spec lands as local files only.
Worktree (do not create a new one): `clients/light-brands/.worktrees/roses-os--s-202605291136-550e00`, branch `claude/p1-451-s-202605291136-550e00`.

Each panelist writes one review against THIS packet, in your own voice, answering the six prompts at the end. Hard limit 600 words. Do not edit code. Do not run builds. This is deliberation, not implementation.

---

## The raw idea (verbatim)

Faithful content reconstruction of the Roses OS manuals. Reconstruct every page of the 4 canonical manuals (Rose Meditation L1/L2/L3 + Aura 1) into the new v2 block primitives so each page reproduces its docs/canon PDF exactly, replacing the flat legacy blocks in Supabase manual_blocks. Run fully local/offline. Continue from the existing worktree; the capability code this depends on is uncommitted there. This is a NEW problem distinct from spec 001-richer-block-editor (which built the editor capability). Honor the prerequisites (P0 commit the capability locally, P1 CHECK-constraint migration including the `contents` type, P2 backward-compat parser, P3 staging clone), the human-in-the-loop semi-automated pipeline (render then extract then map then staging then review then promote), staging-first safety with a 7-day soak before any prod write, and the Slice-0 sequencing (Rose Meditation L1 English end-to-end before scaling).

## The full seed plan

Read it in full before writing your review:
`_qie/core/data/roses-os-content-reconstruction-plan-2026-05-31.md`

It carries: what we are doing, where the uncommitted capability lives, the prior spec 001 context, the fidelity proof we ran this session, the canon source of truth, the prerequisites P0 through P3, the engine E1 through E5, the review and promotion R1 through R4, the locale track L1, the Slice-0 sequencing, the risk table, and the deliverables.

---

## What is already true (verified at the code level this session, do not re-litigate)

The capability (spec 001, milestones M0 through M5) is built but UNCOMMITTED in the worktree above. It includes the v2 block primitives, a `contents` table-of-contents primitive added this session, a restyled `cover` masthead, and micro-tweaks (`cover.align`, `callout.hideLabel`). A full clone of the Rose Meditation Level 1 contents page was proven to match the canon PDF pixel-faithfully. The editor renders the DB faithfully; the gap is that the DB still holds FLAT LEGACY blocks. The bricks exist; the content was never rebuilt. That is the whole of this spec.

Concrete substrate facts (cite these, they are confirmed):

- **Block registry** (`src/lib/manuals/block-registry.ts`) now carries 18 block types: heading, text, image, image-row, divider, page-break, cover, callout, quote, numbered-exercise, captioned-figure, spoken-instruction, table, contents, footnote, glossary, section, two-column-section. A compile-time completeness guard fails the build if a `BlockType` union member is missing from the registry.
- **CHECK constraint** (`supabase/migrations/0002_richer_blocks_check.sql`) lists 17 of those 18. It is MISSING `contents`. This is P1 precisely: a migration must widen the CHECK to include `contents` so reconstruction inserts do not fail on prod. Architecture decision D-2 is explicit: CHECK widens BEFORE the TS union references a variant; this is the reverse-order debt being paid.
- **AC10 of spec 001** asserted "block-type count strictly under 12". `docs/canon/patterns.yaml` reasons its way down to a final list of 11 and defers table, footnote, glossary "to a follow-up spec". The registry actually shipped 18. The AC10 ceiling is already blown in reality. This spec must reconcile that honestly: either formally retire AC10 (the 12-ceiling was an early-M0 guess the real canon surface exceeded) or document why the count is what it is. Do not pretend the ceiling holds.
- **Read path** (`src/lib/manuals/block-parser.ts`): `parseManualBlock` routes each row through the Zod discriminated union and falls back to `{kind:'unknown', raw, reason}` rather than throwing. `parseManualBlocks` returns batch stats (total / passed / fallback / reasons). v2 detection is `content.schema_version === 2`. This is P2, and it is already built. Reconstruction must keep every legacy row readable while v2 rows land.
- **Write path** (`src/lib/manuals/db.ts`): `createBlock` / `updateBlock` / `deleteBlock` / `reorderBlocks` all go through `@/lib/supabase/client` (the BROWSER client, anon key). There is no server-side / service-role bulk-write path in this file. A pipeline that writes hundreds of reconstructed blocks to a staging manual needs a server-side admin path; the anon browser client is not it. This is an open architectural seam.
- **Staging does not exist as a concept yet.** `getBlocks(manualId, language)` filters by manual_id + language. "Staging" (P3) could be realized as a clone manual_id, a reserved language tag, a separate schema_version lane, or a separate Supabase project. The seed says "staging Supabase clone of manual_blocks". How staging is realized is unresolved and load-bearing.
- **No test suite.** `pnpm test` is a placeholder that exits 0 (per the repo CLAUDE.md). AC verification cannot lean on "tests pass". A `scripts/canon-diff.ts` exists (untracked) and is the seed of the review/verification surface. Type-check is `pnpm type-check` (pnpm only; npm install breaks Vercel).
- **Canon render path** works: `puppeteer-core` + system Chrome at `C:\Program Files\Google\Chrome\Application\chrome.exe`. `pdftoppm` is NOT available. The 4 canon PDFs live at `docs/canon/` (three are ~15 to 21 MB each).
- **Manuals in DB** (Supabase, English): `afd5453c-...` rose-meditation-level-1 (86 legacy blocks), `156a0f3c-...` level-2, `e953a823-...` level-3, `85c8c132-...` aura-level-1. Languages declared: en, pt, es, el, ru, uk. Canon exists for en only.
- **The canon is CURATED, not 1:1 with the flat data.** Example: the L1 table of contents collapses three flat sections into one row, renumbers entries, adds page numbers, adds a bottom wisdom callout and a footer credit. Reconstruction reads the canon PDF AS the target, it does not mechanically transform the old flat `<ul>`.

## Architecture state

`ARCHITECTURE.md` exists at the worktree root with decisions D-1 through D-4 (block model with schema_version, CHECK-widens-first, TipTap rich-text engine, block registry). Winston is the architecture-author for this spec in UPDATE mode. The next available decision ordinal is **D-5**. Emit only the decisions this spec introduces (pipeline shape, staging realization, idempotency/override model, promotion transaction). Do not touch D-1 through D-4 unless you explicitly supersede one.

## Constraints this spec must honor (from the operator)

- Staging-first. NEVER write to prod during reconstruction. A 7-day soak on staging precedes any prod promotion.
- Idempotent re-runs: a re-run must never lose human corrections. Curation decisions and human edits live in a checked-in per-manual recipe/override file (E4).
- Slice-0 first: prove the whole loop (render then extract then map then staging then review then promote) on ONE manual (Rose Meditation L1, en) before scaling to L2, L3, Aura 1.
- Locales: en only to start (canon exists). Do not invent translations for pt/es/el/ru/uk. Other locales are a separate track gated on translated canon existing.
- Voice rule for all written artifacts: plain English, no em-dashes, no en-dashes, no hype words, no emojis, no exclamation marks.

---

## The six prompts (answer all six, in order)

1. What problem is this actually solving?
2. What is the smallest first version that proves the idea?
3. What 3 risks would kill this if ignored?
4. What does success look like at 90 days?
5. What atomic tasks does this break into? (list 5 to 15, each at most one day of work, each with a one-line verifiable acceptance)
6. What is the one thing only your faculty would have noticed?

Write your review to: `_qie/specs/_panel-runs/faithful-content-reconstruction-20260531-014843/reviews/<your-name>-review.md`
