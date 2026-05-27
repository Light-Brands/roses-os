---
slug: faithful-pdf-export
created: 2026-05-27
target_repo: Light-Brands/roses-os
---

# Plan: Faithful PDF export

## Architecture sketch

```
src/components/manuals/DownloadMenu.tsx  ──┐
                                            │ click PDF
                                            ▼
                            GET /api/manuals/[manualId]/pdf?locale=xx
                                            │
                ┌───────────────────────────┴────────────────────────┐
                │ chromium-adapter.ts                                 │
                │   - local dev: spawn local Chromium                 │
                │   - Vercel:   @sparticuz/chromium binary path       │
                └───────────────────────────┬────────────────────────┘
                                            │ page.goto()
                                            ▼
                  GET /manuals/[manualId]/print?locale=xx
                                            │ server component
                                            │ - reads blocks from Supabase (RLS via cookie)
                                            ▼
                  synthesize-rhythm.ts (pure)
                    - reads synthesis-rules.ts for locale
                    - groups stack-of-blocks into panels
                    - emits {panels: [...], pageBreaks: [...]}
                                            │
                                            ▼
                  print-manual.css applied → DOM tree
                                            │
                                            ▼
                  page.pdf() → application/pdf stream
                                            │
                                            ▼
                  Response (200 + X-PDF-Tier: runtime)
                                            │
                  on failure ┬─────────────► static PDF (if mapped, 302 + X-PDF-Tier: static)
                              ├─────────────► blocksToHtml blob sentinel (X-PDF-Tier: blob)
                              └─────────────► 5xx + named-error envelope
```

Components added by this spec:

| Module                                                          | Type              | Owner               |
|-----------------------------------------------------------------|-------------------|---------------------|
| `src/lib/manuals/chromium-adapter.ts`                           | adapter           | Amelia              |
| `src/lib/manuals/synthesize-rhythm.ts`                          | pure function     | Kaze + Amelia       |
| `src/lib/manuals/synthesis-rules.ts`                            | data file         | Kaze                |
| `src/styles/print-manual.css`                                   | CSS               | Kaze                |
| `app/manuals/[manualId]/print/page.tsx`                         | server component  | Amelia              |
| `app/api/manuals/[manualId]/pdf/route.ts`                       | route handler     | Amelia              |
| `scripts/manuals/visual-diff.ts`                                | CI tool           | Bob + Lattice       |
| `scripts/manuals/freeze-2022-pdf-hashes.ts`                     | one-shot tool     | Lattice             |

Modified:

| Module                                          | Change                                                |
|-------------------------------------------------|-------------------------------------------------------|
| `src/components/manuals/DownloadMenu.tsx`       | state machine, progress, language affordance, fallback transparency |
| `src/lib/manuals/pdf-map.ts`                    | becomes fallback table, not primary path; comment updated |
| `next.config.ts`                                | add `@sparticuz/chromium` to `serverComponentsExternalPackages` |
| `vercel.json` (or route export config)          | runtime=nodejs, memory>=1024MB, maxDuration=60        |
| `package.json`                                  | add `@sparticuz/chromium` pinned to puppeteer-core    |
| `ARCHITECTURE.md` (new at repo root)            | created by this spec (mode=create)                    |

## Sequencing (4 milestones)

### M1 — One English render on Vercel preview (the proof)

End state: `GET /api/manuals/rose-meditation-level-1/pdf?locale=en` on a Vercel preview returns a valid PDF generated from current Supabase blocks. No rhythm tuning yet, no fallback chain wired, no language fan-out. The render proves chromium-on-Vercel works and the synthesizer pipes through.

Estimated effort: 2-3 days.

Tasks (issue titles below; ordered by dep):
- T-001 Add @sparticuz/chromium pinned to puppeteer-core@24.38 (Amelia, 2h)
- T-002 Build chromium-adapter.ts (Amelia, 3h)
- T-003 Build synthesize-rhythm.ts + synthesis-rules.ts scaffold (Kaze + Amelia, 4h)
- T-004 Build /manuals/[manualId]/print server component (force-dynamic) (Amelia, 4h)
- T-005 Build /api/manuals/[manualId]/pdf route (runtime=nodejs, maxDuration=60) (Amelia, 3h)
- T-006 Configure next.config.ts serverComponentsExternalPackages + vercel route config (Amelia, 1h)
- T-007 Smoke test on Vercel preview: curl returns PDF (AC1 partial) (Bob, 1h)

### M2 — Editorial rhythm matches the 2022 original (Kaze territory)

End state: the rendered PDF for `rose-meditation-level-1?locale=en` honors the editorial rhythm of `Rose-Level-1-Manual-EN.pdf` within a per-page pixel delta of 10 percent for the cover, TOC, and first three body pages. Page alternation rule active.

Estimated effort: 3-4 days.

Tasks:
- T-008 Codify three synthesis rules: text-then-image 60/40 panel, two adjacent images fuse, image-row-with-caption centered plate (Kaze + Amelia, 6h)
- T-009 Right-hand-band alternation rule across pages (Kaze + Amelia, 4h)
- T-010 Per-section page-break rule (Kaze, 2h)
- T-011 Print CSS at src/styles/print-manual.css: Cormorant Garamond @font-face from public/fonts/, @page rules, panel layout (Kaze + Amelia, 5h)
- T-012 Print template version constant in synthesize-rhythm.ts, embedded in PDF metadata (Lattice, 2h)
- T-013 Freeze 2022 PDF hashes in ARCHITECTURE.md (Lattice, 1h)
- T-014 Visual-diff harness at scripts/manuals/visual-diff.ts (Bob + Lattice, 5h)
- T-015 First visual-diff pass against Rose-Level-1-Manual-EN.pdf (Kaze + Bob, 3h)

### M3 — Language fan-out across the six locales

End state: all six locales [en, pt, es, el, ru, uk] of `rose-meditation-level-1`, `rose-meditation-level-2`, `rose-meditation-level-3`, and `aura-level-1` render through the runtime route. Rhythm and typography fidelity; NOT content parity (#504 boundary).

Estimated effort: 2-3 days.

Tasks:
- T-016 Locale query param plumbed end-to-end, validated against [en, pt, es, el, ru, uk] allowlist (Amelia, 2h)
- T-017 Per-locale grouping overrides in synthesis-rules.ts (Kaze + Amelia, 4h)
- T-018 Six-locale snapshot fixtures (Bob + Lattice, 3h)
- T-019 Visual diffs across the six locales, repair rhythm regressions (Kaze + Bob, 6h)

### M4 — Fallback chain, telemetry, cutover

End state: the Download menu uses the runtime route as primary, with visible fallback transparency. Kill switch wired. Sentry telemetry observable per render. Static PDFs stay reachable as cold fallback. Visual-regression CI gate in place.

Estimated effort: 2-3 days.

Tasks:
- T-020 Four-tier fallback chain in the API route (runtime, static, blob, named-error) (Amelia, 4h)
- T-021 Sentry span instrumentation with pdf.tier, pdf.locale, pdf.manualId, chromium boot timing (Lattice + Amelia, 3h)
- T-022 Kill switch env var MANUAL_RUNTIME_PDF_DISABLED forcing static fallback (Lattice, 2h)
- T-023 DownloadMenu.tsx state machine, progress indicator, language affordance, fallback transparency (Sally + Amelia, 8h)
- T-024 Per-render telemetry log with slug/locale/template-version/duration/outcome (Lattice, 2h)
- T-025 Visual-regression CI gate over the six-locale snapshot set (Lattice + Bob, 4h)
- T-026 Drift watcher: weekly job comparing static vs runtime renders for mapped slugs (Lattice, 3h)

## Risks (top 5, each with mitigation)

1. **Chromium-on-Vercel bundle size and timeout.** `@sparticuz/chromium` plus the rest of roses-os may blow the 250MB unzipped function limit on Vercel Pro. Cold-start may exceed `maxDuration=60`. Mitigation: isolate the route as its own function via `serverComponentsExternalPackages` in `next.config.ts`; benchmark on a preview deployment in M1 before any rollout; pin both packages and gate CI on version-mismatch detection.

2. **Synthesizer produces visually worse output than the static PDF.** The rule set must be tunable per-locale because non-English manuals have different image-to-text ratios. Mitigation: synthesis-rules.ts is a data file, not code; one round of visual diff against the 2022 PDF gates M2 close; locale overrides land in M3 not M2.

3. **Fallback chain confusion.** Three outcomes collapsing onto one button trains teachers to mistrust the surface. Mitigation: DownloadMenu state machine has explicit fallback-static and fallback-html states with named explanations BEFORE the file leaves; Sentry tag `pdf.tier` makes silent fallback structurally visible.

4. **Dual source of truth drift.** Static PDFs and runtime renders diverge over months; a teacher prints a static fallback and never knows it. Mitigation: drift watcher job (T-026) runs weekly, compares both for mapped slugs; visible `X-PDF-Tier: static` response header; kill switch (T-022) is the audit-trail-leaving fallback control.

5. **Language coverage as a cliff.** Five non-English editions are stale snapshots (issue #504). Rhythm renders that look correct in English may break in Greek or Russian. Mitigation: M3 ACs enumerate all six locales explicitly (AC4 names es); M3 boundary explicitly excludes content parity (#504 stays separate); per-locale visual fixtures land in T-018.

## Dependencies

- **External:** `@sparticuz/chromium` (new dependency, pinned). `puppeteer-core@^24.38.0` (already present).
- **Internal:** Issue #504 (language re-sync) sits adjacent. M3 deliberately scopes rhythm-only, leaving #504 to a separate spec; if #504 lands first, M3 surfaces will reflect updated content automatically.
- **Vercel:** project must be on Pro tier minimum (function maxDuration > 10s, function memory budget for chromium).
- **Sentry:** roses-os already wired (Light Brands observability standard). The new spans tag onto the existing init.
- **Supabase:** RLS posture on `manual_blocks` already enforced by the editor; the API route reuses the session cookie. No new policies.
- **2022 PDF reference files:** `Rose-Level-1-Manual-EN.pdf`, `ROSES MANUAL 1 and 2 _2022_ English V1 .pdf`, `ROSES 3 MANUAL _2022 English_ V1.pdf` at repo root, plus the copies at `public/manuals/pdf/`. Hashes frozen in ARCHITECTURE.md per T-013.

## Cost-shaped considerations

- **Time:** ~9-13 dev-days total across the four milestones. Roughly one calendar week if uninterrupted, two with normal interleave.
- **Vercel cost:** function invocations carry chromium cold-start at roughly 5-8s and warm at 1-2s. With a 60s `maxDuration` and 1024MB memory, GB-seconds per invocation is bounded. Teacher download volume is low (estimated under 100 per day across all manuals), so monthly Vercel cost impact is negligible.
- **Maintenance:** the synthesizer rules in `synthesis-rules.ts` are the only file that needs review when Jennifer or a future editor flags rhythm drift. Rules ship as data, not code, so changes are short PRs with visual diff attached.

## Sequencing constraint named explicitly

M3 acceptance is rhythm and typography fidelity ONLY, not content parity. The non-English editions of all four slugs carry stale structural snapshots from before covers and TOC (issue #504). The spec must not adopt #504 mid-M3; if rhythm regressions in non-English renders trace back to stale block content, the regression closes as "out of scope, see #504" and #504 remains a separate spec. This is the boundary Bob named to keep M3 demoable.

## Strict-local handoff per genesis-spec Section G

This spec drains through /develop in strict-local mode. The verification path can rely on:
- A worktree URL (the `/manuals/[manualId]/print` route served locally via `pnpm dev`).
- A Vercel preview deployment (AC1-AC7 are written against `<preview-host>`).
- The static fallback PDF (AC5 verifies the redirect to it).

No AC assumes a merged main. Promotion (commit + PR + merge) is a separate explicit operator act after /develop closes the milestone gate.

## Live-surface URL on close per genesis-spec Section H

Phase 4.5 mockup served at `http://127.0.0.1:4180/` (local). Closing message names this URL as the first line, with the spec path as a secondary reference. Once /develop ships M1, the live surface becomes the Vercel preview deployment URL.
