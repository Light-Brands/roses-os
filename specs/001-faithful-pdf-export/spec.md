> Tracked as Light-Brands/roses-os#537

---
slug: faithful-pdf-export
title: Faithful PDF export from the /manuals editor
created: 2026-05-27
target_repo: Light-Brands/roses-os
source: inline (Dario, /create-spec)
panel_run: faithful-pdf-export-20260527-192019
panelists: [Winston, Mary, Amelia, Bob, Kaze, Sally, Lattice]
kaze_attach: true
architecture_author: true
architecture_mode: create
status: scoped
---

# Spec: Faithful PDF export from the /manuals editor

## Problem

The Download then Print as PDF button in /manuals lies. On the three slugs mapped in `src/lib/manuals/pdf-map.ts` (rose-meditation-level-1, rose-meditation-level-2, rose-meditation-level-3) the button serves a 2022 static PDF from `public/manuals/pdf/`, so teachers' edits never reach the artifact they download. On unmapped slugs (aura-level-1, every non-English edition) the button falls through to `src/lib/manuals/export-html.ts`'s `blocksToHtml` flow, which produces a stack-of-blocks layout that loses the editorial rhythm of the original 2022 manuals. Jennifer Lambert raised both failures on 2026-05-27: (a) "When they print from /manuals it should be the version in there that's being edited", (b) "the style of the original meditation manuals has more image, image, image, text".

Two failure modes, one root: there is no runtime path from the current Supabase block state to a print-faithful PDF.

## Why now

Jennifer is the steward of the Rose Meditation teaching lineage. The printed manual is the physical artifact teachers hand to students. Today the artifact does not reflect the editor's content, so the /manuals editor functionally has no print path. PR #505 papered over the gap by serving static PDFs for the mapped slugs; the gap re-opens the first time a teacher edits and prints. The deferred issue #506 captures the architectural intent; this spec executes it.

## In scope

- A server-side route at `/api/manuals/[manualId]/pdf` that renders current Supabase blocks into a faithful PDF via Puppeteer plus `@sparticuz/chromium` on Vercel.
- A print-tuned route at `/manuals/[manualId]/print` that the API renders against. Server component, locale-aware, no editor chrome.
- A pure rhythm synthesizer at `src/lib/manuals/synthesize-rhythm.ts` that groups stack-of-blocks into image+text panels honoring the 2022 editorial rhythm.
- Per-locale grouping overrides via `src/lib/manuals/synthesis-rules.ts`, en default plus pt/es/el/ru/uk overrides.
- A four-tier fallback chain (runtime, static, blocksToHtml blob, named-error envelope).
- Update to `src/components/manuals/DownloadMenu.tsx`: state machine for the new flow (idle, requesting, rendering, downloading, failed-runtime, fallback-static, fallback-html), elapsed-time text, language affordance, fallback transparency.
- Telemetry: per-render Sentry span with `pdf.tier`, `pdf.locale`, `pdf.manualId`, chromium boot timing, render duration.
- Print template version constant embedded as PDF metadata for audit.
- Visual-regression test over the six-locale snapshot set.
- Kill switch env var `MANUAL_RUNTIME_PDF_DISABLED` that forces static fallback for emergency rollback.
- ARCHITECTURE.md at roses-os root (mode = create, bootstrapped from this spec).

## Out of scope

- New block types ("split image/text", "image-row with caption"). The render-template path is the chosen route; teachers do not learn new blocks.
- Removing the static PDFs at `public/manuals/pdf/` or `pdf-map.ts`. They become cold fallback.
- The /manuals editor block model or editing surface beyond the Download menu.
- Issue #504 language re-sync (separate spec).
- Issue #492 header responsive fix (separate).
- Issue #490 For Teachers integration (separate).
- The undo button Jennifer requested (Jennifer's #4, separate spec).
- The other-language re-sync (Jennifer's #2, partially covered by #504, separate spec).
- AI-assisted first-pass translation across languages (offered to Jennifer, pending her answer; separate spec).
- A separate PDF storage layer (Supabase Storage, S3, Vercel Blob). v1 renders on demand.

## Acceptance criteria

Each criterion is independently verifiable per genesis-spec Section A.

- **AC1.** `curl -sI https://<preview-host>/api/manuals/rose-meditation-level-1/pdf?locale=en` on a Vercel preview deployment returns HTTP 200 with `Content-Type: application/pdf` and `Content-Length` > 50000. Cold-start latency under 30 seconds, warm under 8.

- **AC2.** With the editor open at `/manuals/rose-meditation-level-1` and locale en, edit any block's text from `<old>` to `<new>` and save. Within 5 seconds, download the PDF via the menu. The downloaded PDF's extracted text contains `<new>` AND does not contain `<old>`. Verifiable via `pdftotext <file> - | grep <new>` and `! grep <old>`.

- **AC3.** `curl -sf https://<preview-host>/api/manuals/aura-level-1/pdf?locale=en` returns a runtime-rendered PDF (not a redirect; response `Content-Type: application/pdf`, response header `X-PDF-Tier: runtime`). The PDF contains at least one side-by-side panel: verifiable by extracting the print HTML rendered by the synthesizer and grep-asserting at least one `<div class="panel-side-by-side">` element.

- **AC4.** `curl -sf https://<preview-host>/api/manuals/rose-meditation-level-1/pdf?locale=es` returns a Spanish-content PDF. `pdftotext <file> - | head -50` includes at least one Spanish-locale block from Supabase, verifiable by joining the extracted text against `SELECT html FROM manual_blocks WHERE manual_slug='rose-meditation-level-1' AND locale='es' LIMIT 5`. The response header `X-PDF-Tier: runtime`.

- **AC5.** With `MANUAL_RUNTIME_PDF_DISABLED=1` set on the deployment, `curl -sI https://<preview-host>/api/manuals/rose-meditation-level-1/pdf?locale=en` returns HTTP 302 with `Location: /manuals/pdf/rose-meditation-level-1.pdf` and `X-PDF-Tier: static`.

- **AC6.** With `MANUAL_RUNTIME_PDF_DISABLED=1` set AND requesting an unmapped slug, `curl -sf https://<preview-host>/api/manuals/aura-level-1/pdf?locale=en` returns HTTP 503 with body matching the v1.4 named-error envelope. `curl ... | jq '.ok'` returns `false`. `curl ... | jq -r '.error.code'` returns `CHROMIUM_DISABLED`. `curl ... | jq -r '.error.message'` is a human-readable string.

- **AC7.** For every PDF route invocation, Sentry (org `light-brands-ai`, project `roses-os`) receives a span tagged `pdf.tier=<runtime|static|blob|error>`, `pdf.locale=<en|pt|es|el|ru|uk>`, `pdf.manualId=<slug>`, and a `chromium.boot.ms` measurement. Verifiable in the Sentry dashboard within 60 seconds of the invocation.

- **AC8.** Walking the Download menu in the browser: click PDF on a mapped slug. After 3 seconds of inflight render the menu shows elapsed-time text in seconds AND an indeterminate spinner. At 15 seconds the menu surfaces a Cancel button. The active language is shown as `<Language name> from your edits` and updates when the editor's locale changes. On failure-static, the menu shows "Serving 2022 print original because the live render failed" before the file leaves. Verifiable by a manual walkthrough at mobile (375px) and desktop (1280px) viewports.

- **AC9.** Visual-regression: rendering `rose-meditation-level-1?locale=en` through the runtime route produces a per-page pixel delta under 10 percent against `Rose-Level-1-Manual-EN.pdf` for the cover, the table-of-contents page, and the first three body pages. Verifiable via `scripts/manuals/visual-diff.ts` (new) and its CI run on the Vercel preview.

- **AC10.** `pdfinfo <downloaded-file> | grep -E 'Creator|Producer'` exposes a `PRINT_TEMPLATE_VERSION: <semver>` line in the metadata. The constant lives in `src/lib/manuals/synthesize-rhythm.ts` and is bumped by CI any time `synthesize-rhythm.ts` or `synthesis-rules.ts` changes.

## Open questions

Per genesis-spec Section C. Each names the person who can answer and the default the workflow proceeds with if no answer arrives.

- **Q1. Should the synthesizer produce a fixed page count, or let chromium flow content naturally?** Disagreement: Kaze leans fixed (match 2022 PDFs exactly); Sally and Amelia lean variable (avoid orphan widows, accept teacher edits that change length). Default: variable-length PDFs in v1 with explicit `page-break-before` controls in the synthesizer; revisit if Jennifer flags drift after first runtime download. Answerer: Jennifer (felt judgment after walking through the mockup).

- **Q2. Where does `MANUAL_RUNTIME_PDF_DISABLED` and the per-slug rollout allowlist live?** Disagreement: Winston suggests env var on Vercel; Lattice suggests Supabase row for auditability; Bob suggests hardcoded constant. Default: env var on Vercel for v1 because lowest-friction rollout; promote to Supabase row once more than five slugs need flag control. Answerer: Dario.

- **Q3. Should /manuals get a "regenerate canonical PDF" button as a simpler path that bypasses runtime chromium entirely?** Raised by Mary as the simpler-path-nobody-named: teacher clicks regenerate, build-time Puppeteer (same as `scripts/build-manuals.ts`) runs and replaces `public/manuals/pdf/<slug>.pdf`. Trade-off: download becomes "live as of the last regenerate", not minutely live. Default: not in this spec, because Jennifer's job (a) explicitly asks for editor-to-print fidelity and the regenerate button does not give her that. Answerer: Jennifer.

- **Q4. Should the static 2022 PDFs be frozen with a hash recorded in ARCHITECTURE.md as immutable historical reference?** Raised by Lattice. The 2022 PDFs are unversioned artifacts; once runtime ships they become the historical comparison baseline. Default: yes, record SHA256 of each in ARCHITECTURE.md so the comparison is auditable. Already added to M2 task T-015. Answerer: panel resolution (already adopted).

- **Q5. Right-hand-band alternation rule.** Raised by Kaze: 2022 PDFs alternate body left / illustration right vs illustration left / body right across pages, a quiet rhythm device the block-render cannot see. Default: implement as an explicit synthesis rule in M2 (T-012). Answerer: panel resolution (already adopted).

## Mockup

The user-facing surface was designed before implementation via a Phase 4.5 mockup deliberation with Kaze, Sally, and Custodian. The frozen mockup lives at `./mockups/index.html` and is the visual contract any /develop run inherits.

- **Screens covered:** /manuals Download menu in all states (idle, requesting, rendering, downloading, failed-runtime, fallback-static, fallback-html); print template preview (cover, side-by-side panel page, full-bleed text page).
- **State machine:** idle → requesting (button disabled, language line visible) → rendering (indeterminate spinner, elapsed text after 3s) → at 15s (Cancel surfaces) → downloading (browser download dialog) → failed-runtime → fallback-static (with named explanation before file leaves) → fallback-html.
- **Iterations:** 2 (see `./mockups/iterations.md`).
- **Approved on:** 2026-05-27T19:55Z
- **Design panelists:** Kaze, Sally, Custodian.

## Panelists who contributed

- **Winston** — architecture-author, system shape, decision log, ARCHITECTURE.md draft.
- **Mary** — surfaced "the editor lies to the teacher" framing; named the simpler-path-not-taken (regenerate button) as Q3.
- **Amelia** — chromium-on-Vercel feasibility specifics (50MB binary, 250MB function limit, font availability, `dynamic = 'force-dynamic'`, version-pin between `puppeteer-core@^24.38.0` and `@sparticuz/chromium`).
- **Bob** — milestone sequencing M1-M4; named the boundary that prevents #504 from bleeding into M3.
- **Kaze** — editorial rhythm rules, right-hand-band alternation, typography hierarchy specifics.
- **Sally** — Download menu state machine, fallback transparency, language affordance, WCAG floor.
- **Lattice** — dual-source-of-truth drift signal, print template versioning, 2022 PDFs hash freeze, kill-switch env var.

## Source

- Panel deliberation: `./.deliberation/` (context.md + 7 review files + Winston's architecture draft).
- Architecture: `../../ARCHITECTURE.md` (this spec is the inaugural decision set).
- Plan: `./plan.md`.
- Mockup: `./mockups/`.
