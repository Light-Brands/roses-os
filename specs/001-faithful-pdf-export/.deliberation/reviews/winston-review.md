---
panelist: Winston
role: BuildOS Architect (architecture-author + reviewer)
run: faithful-pdf-export-20260527-192019
words_target: 600
---

# Winston review — faithful-pdf-export

### 1. What problem is this actually solving?

Two failures share one root. First, Jennifer's edits in the `/manuals` editor never reach the downloaded PDF on mapped slugs, because the Download button reads `pdf-map.ts` and serves a 2022 static file from `public/manuals/pdf/`. Second, on unmapped slugs and non-English editions, the fallback is `blocksToHtml` followed by `window.print()`, which produces a stack-of-blocks layout that loses the editorial rhythm of the original PDFs. The root is the same: there is no runtime path from current Supabase block state to a print-faithful PDF. The spec replaces both branches with one server-rendered route. Once that route exists, the static map becomes a fallback, not the primary, and the editor becomes the source of truth.

### 2. What is the smallest first version that proves the idea?

One slug, one language, end-to-end on Vercel. Pick `rose-meditation-level-1` in English. Ship `/manuals/[manualId]/print` as a server component that reads blocks from Supabase, a synthesizer that groups adjacent image+text runs into side-by-side panels using rule-based grouping (no LLM), and `/api/manuals/[manualId]/pdf` that drives Puppeteer against the print route and streams the PDF back. Wire `@sparticuz/chromium` for Vercel. Leave `pdf-map.ts` in place. Add a single feature flag (env var or per-slug allowlist) so the Download button uses the runtime route for the chosen slug and the static PDF for everything else. That is enough to prove the synthesis is good and chromium boots in production.

### 3. What 3 risks would kill this if ignored?

First, chromium on Vercel. `@sparticuz/chromium` plus `puppeteer-core` works only with the right runtime config (`nodejs` runtime, function memory at or above 1024 MB, `maxDuration` raised, and pinned versions matched). A version mismatch silently fails at cold start. Mitigation: pin both packages, smoke the route on a preview deployment before any rollout. Second, the synthesizer producing visually worse output than the static PDF on the very slug Jennifer compared. The rule set must be tunable per-locale because non-English manuals have different image-to-text ratios. Mitigation: ship the rule set as data, not code, and include a visual diff against the 2022 PDF in the AC. Third, the fallback chain. If the runtime route fails for any reason, the user must still get something. Mitigation: chain runtime PDF, then static PDF if the slug is mapped, then the existing `blocksToHtml` blob, then a clear error. Never a blank download.

### 4. What does success look like at 90 days?

Six language editions of three Rose Meditation manuals plus aura-level-1 all render through the runtime route, with the static PDFs untouched as cold fallback. Jennifer's edits land in downloads within one editor save. Cold-start latency is under 8 seconds and warm latency under 2. Sentry shows zero unhandled chromium errors per week. The static-PDF code path executes less than 5 percent of the time, and only when chromium genuinely fails. `pdf-map.ts` exists only as the fallback table.

### 5. What atomic tasks does this break into?

1. Add `@sparticuz/chromium` to `package.json`, pin to a version matching `puppeteer-core@^24.38.0`, document the pin in `scripts/build-manuals.ts` comments.
2. Create the chromium adapter at `src/lib/manuals/chromium-adapter.ts` with one `launch()` that branches local vs Vercel by `process.env.VERCEL`.
3. Create `/manuals/[manualId]/print/page.tsx` as a server component reading blocks and locale by query param.
4. Implement the rhythm synthesizer at `src/lib/manuals/synthesize-rhythm.ts` — pure function, blocks in, grouped panels out.
5. Create the print stylesheet at `src/styles/print-manual.css` — typography, page rules, side-by-side panels.
6. Create `/api/manuals/[manualId]/pdf/route.ts` returning `application/pdf` with `{ok: false, error: {code, message}}` on failure.
7. Wire feature flag `MANUAL_RUNTIME_PDF_SLUGS` env var read by `DownloadMenu.tsx` to choose runtime vs static.
8. Wire `vercel.json` overrides for the route (memory, `maxDuration`, `nodejs` runtime).
9. Add Sentry capture inside the route with `manualId`, `locale`, and chromium boot timing.
10. Visual-diff harness: a script that opens both PDFs in `pdf-to-png` and reports per-page pixel delta against the 2022 originals.
11. Wire fallback chain inside the route: runtime fails, then redirect to static PDF if mapped, then `blocksToHtml` blob signal back to the client.
12. Extend the route and feature flag to the remaining five locales once English passes the visual diff.

### 6. What is the one thing only your faculty would have noticed?

The synthesizer is the architectural risk, not chromium. Chromium-on-Vercel is solved territory and the build script already touches Puppeteer. The synthesizer is novel: it must produce the 2022 PDF's rhythm from a block model that does not encode it, across six locales, for a teacher who never saw the original. Treat the synthesis rules as their own subsystem with their own tests, their own data file, and their own per-locale override hook. If it lives inside `print/page.tsx`, it will calcify into a render artifact nobody dares touch, and the spec's promise to teachers fails quietly the first time Jennifer edits a Spanish manual.
