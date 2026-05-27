# Context — faithful-pdf-export

**Run id:** faithful-pdf-export-20260527-192019
**Source:** inline (Dario, /create-spec, 2026-05-27)
**Target repo:** clients/light-brands/roses-os (Light-Brands/roses-os)
**Target kind:** existing
**Worktree:** clients/light-brands/.worktrees/roses-os--faithful-pdf-export
**Branch:** claude/p18070-470-faithful-pdf-export
**Architecture author:** YES, mode = create (no ARCHITECTURE.md at roses-os root)
**Kaze attach:** YES (user-facing surface — printed PDF teachers and students see)
**Edut attach:** NO (no stakeholder coercion, no consent issues)

## Raw idea (verbatim)

Faithful PDF export from the /manuals editor.

Context: Today the Download then Print as PDF on slug-mapped manuals (rose-meditation-level-1/2/3) serves the canonical 2022 PDF from public/manuals/pdf/ via src/lib/manuals/pdf-map.ts. Teachers' edits in the /manuals editor do NOT appear in the downloaded PDF. On unmapped manuals (aura-level-1, non-English translations) it falls back to the lossy blocksToHtml flow in src/lib/manuals/export-html.ts that doesn't recover the original's editorial rhythm.

Source of feedback: Jennifer Lambert, Rose Meditation lead, 2026-05-27: (a) "When they print from /manuals side it should be the version in there that's being edited", (b) "the style of the original meditation manuals (in for-teachers section) has more image, image, image, text, ideally the manuals in /manuals would have matched this style of images and texts". Three reference screenshots compared the polished original PDF (Rose-Level-1-Manual-EN.pdf at public/manuals/pdf/) against the current /manuals editor's stack-of-blocks layout.

What to build: a server-side Puppeteer route at /api/manuals/[manualId]/pdf that renders a print-optimized /manuals/[manualId]/print page using current blocks from Supabase, returns the resulting PDF as a download. Replaces the slug-to-canonical-PDF mapping in pdf-map.ts. The print template recovers the editorial rhythm of the original 2022 PDFs: image+caption side-by-side panels, interleaved image-then-text sequences, the typography hierarchy shown in IMG_7984. Edits in the editor flow into the download automatically.

Prior context: issue #506 (closed COMPLETED by PR #505 but actually deferred). scripts/build-manuals.ts already uses puppeteer-core at build time, that's the precedent. Constraint: must work on Vercel production, not just locally, needs chromium-on-Vercel wiring (@sparticuz/chromium or equivalent). All language editions of the same slug must work, not just English. The slug-mapped static PDFs at public/manuals/pdf/ stay in the repo as a fallback if the runtime route fails.

User-facing surface (the printed manual teachers and students see), kaze_attach=true.

## What already exists (grounded by Quinn from the repo)

- `src/components/manuals/DownloadMenu.tsx` — the menu Jennifer clicks. Three buttons: Print as PDF / Download HTML / Download Markdown. Today the PDF button branches on `getFinalPdfForSlug(slug)`: mapped slugs serve static PDF; unmapped slugs fall through to the `blocksToHtml` flow rendered into a blob then `window.print()`.
- `src/lib/manuals/pdf-map.ts` — the slug to canonical PDF map. Three entries (rose-meditation-level-1, level-2 maps to combined Lvl1and2, level-3). aura-level-1 has no mapping.
- `src/lib/manuals/export-html.ts` — the lossy block-to-HTML renderer the fallback path uses. Carries a TODO comment about Puppeteer being the proper solution.
- `src/lib/manuals/export-utils.ts` — carries `absolutizeSrc(src, origin)` from PR #505 that fixed broken images in exports.
- `scripts/build-manuals.ts` — uses `puppeteer-core` at BUILD time to render the canonical PDFs. The precedent for runtime Puppeteer wiring. NOT the runtime path today.
- `public/manuals/pdf/rose-meditation-level-1.pdf`, `rose-meditation-level-1-and-2.pdf`, `rose-meditation-level-3.pdf` — the canonical static PDFs. They stay as a fallback per the spec brief.
- `package.json` — `puppeteer-core@^24.38.0` already a dependency. `@sparticuz/chromium` NOT yet present.
- Issue #506 — closed COMPLETED by PR #505 (2026-05-23) but actually deferred. The spec's body holds the full justification of why blocksToHtml cannot be the answer and the two options (A: runtime Puppeteer route, B: serve canonical PDFs). #505 took B. This spec implements A.
- The block model: stack of `heading`, `text`, `image`, `image-row`, `divider`, `page-break`. No "side-by-side panel" block. The original 2022 PDF has image+caption side-by-side panels and interleaved image-then-text sequences. This rhythm is NOT in the blocks; it must be synthesized by the print template at render time.
- Non-English manuals: per issue #504 (open), the pt/es/el/ru/uk editions are structural snapshots from before covers and TOC were added. 253 of 2449 blocks are edited by humans (`updated_by = 'Editor'`); much is translation. The faithful PDF export spec must render correctly for all six language editions, not only English.
- Dev quirks: `pnpm` only; `next build` ignores type errors via `ignoreBuildErrors: true`; `pnpm test` is a no-op placeholder; Supabase needs `SUPABASE_URL` + `SUPABASE_ANON_KEY` plus sometimes `SUPABASE_SERVICE_ROLE_KEY`.

## Constraints

1. Must work on Vercel production, not only locally. Chromium-on-Vercel wiring needed.
2. All six language editions of the same slug must render: English plus pt/es/el/ru/uk.
3. The slug-mapped static PDFs at `public/manuals/pdf/` stay as a fallback if the runtime route fails or chromium is unavailable. Removing them is out of scope.
4. The print template must recover the editorial rhythm of the original 2022 PDFs (image+caption panels side-by-side, interleaved image-text) WITHOUT requiring teachers to learn new block types. The synthesis happens at render time from the existing stack-of-blocks.
5. Teachers' edits flow into the download automatically.
6. Voice: no em-dashes, no en-dashes, no hype, no exclamation marks, no emojis.
7. Strict-local handoff per genesis-spec Section G: /develop drains this in a worktree, no PR pre-requirement on any AC.

## What the spec must answer

- The exact shape of `/api/manuals/[manualId]/pdf` (request method, headers, response, error envelope).
- The exact shape of the `/manuals/[manualId]/print` route (server component, what query params it accepts, how it differs from the public reading view).
- How chromium-on-Vercel is wired (`@sparticuz/chromium` is the assumed primitive; confirm or reject).
- The print template's grouping rules: how runs of stack-of-blocks turn into side-by-side panels at render time.
- The fallback chain: when the runtime route fails, what does the user see.
- The language-handling: how language selection in the editor flows into the print route.

## Source of truth for the rhythm

- `Rose-Level-1-Manual-EN.pdf` — repo root. The polished original.
- `ROSES MANUAL 1 and 2 _2022_ English V1 .pdf` — repo root. Levels 1 and 2 combined.
- `ROSES 3 MANUAL _2022 English_ V1.pdf` — repo root. Level 3.
- `public/manuals/pdf/rose-meditation-level-1.pdf` — same as the EN file, copied to public for static download by PR #505.

## Out-of-scope (named by Quinn before the panel writes)

- Adding new block types ("split image/text", "image-row-with-caption"). The render-template path is the chosen route per the spec brief.
- Removing the static-PDF fallback at `public/manuals/pdf/`.
- Editor-side UX changes other than the Download menu's PDF button (this spec touches only the PDF download path).
- Issue #504's language re-sync (covered by a separate spec).
- Issue #492's header responsive fix (separate).
- Issue #490's For Teachers integration (separate).
- The undo button (Jennifer's #4, separate spec).
- The other-language re-sync (Jennifer's #2, separate spec, partially covered by #504).

## Memory pointers worth a panel skim

- `[[project_roses_os_manual_exports]]` — what shipped in PR #505 and why #506 was technically deferred.
- `[[feedback_voice_dario]]` — voice rules.
- `[[feedback_close_with_live_url]]` — closing message must include the live URL Dario can click.
- `[[feedback_develop_local_first]]` — /develop drains locally; spec ACs do not assume a merged main.

## Panelists assigned

Hard cap 7. Picked:

1. **Winston** — architecture-author (mandatory per genesis-spec D + Phase 3.3.1 addendum). System shape, decision log, ARCHITECTURE.md draft.
2. **Mary** — Analyst. Problem framing pressure test.
3. **Amelia** — Dev. Puppeteer-on-Vercel implementation feasibility.
4. **Bob** — SM. Milestone sequencing, dependency wiring.
5. **Kaze** — Creative direction. Auto-attach (user-facing). Editorial rhythm of the print template.
6. **Sally** — UX. Download menu UX, fallback states, multi-language affordance.
7. **Lattice** — Structural integrity cross-domain. Versioning, fallback chain, language coverage as systemic risks.

Each writes one 600-word review answering the six prompts. Winston additionally writes a 1200-word `winston-architecture-draft.md` per the architecture-author addendum.
