# Context packet — roses-os: site-ready, all manuals

Run id: roses-os-site-ready-20260609-185905
Target repo: Light-Brands/roses-os (existing). Worktree: `clients/light-brands/.worktrees/roses-os--s-202605291136-550e00`, branch `claude/p1-451-s-202605291136-550e00`.
Each panelist writes against THIS packet, in their own voice, in their own review file under `reviews/<panelist>-review.md`. Hard limit 600 words.

## The raw idea (Dario, verbatim, Spanish)

"estamos con roses OS: Perfecto, arma el plan para dejar el sitio totalmente listo. eso implica. Parsear los todos los manuales al editor con la nueva forma q desarrollamos, subir todo a produccion, asegurarse q no hay ningun otro bug, y crear todas las traducciones para todos los idiomas. Hace el plan de tal manera q ejecutando un develop headless terminemos con todo listo."

Translation of intent: leave the Roses OS site totally ready in ONE `/develop --headless` run. That means: (1) reconstruct ALL manuals into the editor with the new deterministic-geometry engine, (2) push everything to production, (3) make sure there are no other bugs, (4) create all translations for all languages.

## Operator decisions already taken (these FIX the spec's terminal state)

Quinn asked Dario two questions before this run. His answers:

1. **Promotion scope:** the headless run takes EVERYTHING to staging and verifies it; it NEVER promotes to prod. Promotion staging->prod is Dario's manual command, per manual, AFTER the run. Consequence: the headless run uses the anon key only and needs no service token. Prod is never written by the bot.
2. **el/ru/uk translation:** machine translation generates all 6 languages, but Greek/Russian/Ukrainian are staged MARKED "held for native review" until a native speaker approves. en/es/pt are staged ready-to-promote.

These are not open questions. They are the contract.

## Two human gates the spec must NAME (the headless run does not cross them)

- **G1 — service token.** Promoting staging->prod (Dario's later step) needs a fresh Supabase service token. The ones used on 2026-06-07 were rotated/revoked. Not the bot's problem; named so the operator knows.
- **G2 — native review.** el/ru/uk are held at staging until a native speaker signs off. external: named-human-signoff.

## Load-bearing operating rule (Dario, sealed ARCHITECTURE D-13/D-14)

Generalize the fix, never patch the page. Every fidelity error becomes a deterministic rule over the PDF geometry that holds across the whole corpus, never a page-specific patch or template. A fix that only helps one page is rejected.

## Verified substrate (probed at code level today — build on these, do not rediscover)

The reconstruction engine is general and lives in `src/lib/manuals/`: `extract-geometry.ts` (pdf.js -> PageGeometry, reading order, FNV-1a region hash, fills, text color, serif flag), `layout.ts` (recursive XY-cut -> reading order + columns), `classify-regions.ts` (rule-first, per-region cache, model labels only residue), `columns.ts` (N-column -> nested two-column-section), `map-to-blocks.ts` (`validateBlockInput` Zod write gate), `provenance.ts` (D-12 sidecar + audit cols). ARCHITECTURE decisions D-11 through D-17 govern it. Decision head is currently **D-17**; new decisions start at **D-18**.

- **The reconstruction DRIVER is hardcoded to Level 1.** `scripts/reconstruct-l1-geometry.ts` carries L1-specific paths, page count, font embed, and render metadata. The ENGINE is general; the DRIVER is not. Generalizing the driver to `--manual <slug>` is task 1.
- **L1 EN is DONE and staged.** 76 blocks, fidelity matched on size/leading/color/typeface (exact-to-canon Times/Arial per probe). Staged in Supabase staging lane `rose-meditation-level-1__staging` (id `2ab33901`). The editor works: add/duplicate/reorder, page boundaries from `source_page` provenance, heading-level toggle, block action toolbar, N-column render, M5 in-column authoring, image upload + paste, full 18-type PDF export. All of this is UNCOMMITTED on the worktree branch right now (task 0 must commit this baseline before anything else, or it is at risk).
- **The translation pipeline is BUILT and general.** `src/lib/manuals/translate-fields.ts` (`collectStrings`/`applyStrings` over all 18 block types + a TipTap text-node walker; never touches structure, src, child refs, enums, colors, schema_version), `scripts/extract-translatable.ts` (-> `source.json` with flat strings[]), `scripts/stage-translation.ts` (joins `translations.<lang>.json` back by position+path, validates every block through `validateBlockInput`, anon-key insert into `<slug>__staging` under the target language, remaps container child refs). PROVEN: L2 Spanish staged and verified (112 es blocks in lane `503f961a`, headings translated, html/style/src intact, 0 residual EN). The GAP: the actual translate STEP was Claude inline this one time. To scale to pt/el/ru/uk x L2/L3/Aura it needs an MT call wired to the `source.json -> translations.<lang>.json` contract. Repo carries `GOOGLE_GEMINI_API_KEY`.
- **`scripts/stage-reconstruction.ts` is general** and already does the OBLIGATORY child-ref remap (export synthetic `page:ordinal` ids -> DB uuids by position; without it two-column/section blocks render empty). Reusable for L2/L3/Aura EN.
- **Promotion staging->prod does NOT exist yet.** ARCHITECTURE D-8 NAMES the promotion gate (D-12 already references "the promotion gate (D-8)" for the signer NOT-NULL check), but no script implements it. It is a destructive overwrite of live client locale rows; it needs one transaction, the child-ref remap, a `--dry-run`, per manual+language granularity, and a signer/provenance check. In the headless run it is BUILT and tested staging->staging only; it never runs against prod.
- **L3 is the long pole.** `docs/canon/Rose Meditation Level 3.pdf` (15 MB). L3 carries tables, a glossary, and footnotes: structures with NO block type in the frozen 18-type schema and NO classification rule in the engine. Fidelity on L3 is the biggest unknown in the arc. Per the deterministic-extraction lesson, the architecture-author must EMPIRICALLY PROBE L3's PDF geometry (drive pdf.js, see what table/footnote/glossary structure is actually recoverable from text positions and rules/lines) BEFORE committing any new block-type decision.

## The four manuals (canon PDFs present)

L1 Rose Meditation Level 1 (prod manual id `afd5453c`, staging `2ab33901`), L2 Level 2 (`156a0f3c`, staging `503f961a`), L3 Level 3 (`e953a823`, staging lane created by migration 0007), Aura 1 (`85c8c132`, staging lane from 0007). Languages: en/es/pt/el/ru/uk.

Per-manual translation truth (audited): L1 is genuinely human-translated (leave it alone). L2/L3 are English duplicated into all 6 languages. Aura is partial. So auto-translate targets L2/L3/Aura, not L1.

## Operator-intent anchor: three open `lb-task` issues

Dario already filed three site-ready issues on roses-os. This spec drains them; do not duplicate them:
- #596 Ensure the manual editor is fully functional and live.
- #597 Ensure PDF generation is working correctly.
- #598 Verify all other-language (i18n) features are working.

## Verify surfaces (existing)

`npx tsx scripts/verify-extract-geometry.ts` (AC1/2/3) and `npx tsx scripts/verify-classify-map.ts` (AC4/5/8 + columns + XY-cut) both green. Typecheck `node_modules/.bin/tsc --noEmit` filtered to manuals/ + scripts/verify*. Side-by-side compare harness `scripts/_cmp.cjs` (puppeteer, screenshots each `section.page`). `/test-feature` editor driver pattern `scripts/_editor-qa.cjs` (sessionStorage PIN inject `roses-manual-auth`). `.ts` imports EXTENSIONLESS, run via tsx not node. Dev server `PORT=3005 pnpm dev` in the worktree. PINs editor 1234 / teacher 5678.

## The six questions every panelist answers

1. What problem is this actually solving?
2. What is the smallest first version that proves the idea?
3. What 3 risks would kill this if ignored?
4. What does success look like at 90 days?
5. What atomic tasks does this break into? (5-15, each <= 1 day; map them to the 3 cohorts: Reconstruction EN / Translation / Promotion+cierre.)
6. What is the one thing only your faculty would have noticed?

Voice rule: no em-dashes, no en-dashes, no hype words, no emojis, no exclamation marks. Plain English.
