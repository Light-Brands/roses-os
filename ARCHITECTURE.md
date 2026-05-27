---
name: roses-os-architecture
last_spec: faithful-pdf-export
created: 2026-05-27
mode: create
author: Winston (BuildOS Architect, /create-spec architecture-author)
---

# Architecture — roses-os

> The decision log. This file was bootstrapped by the `faithful-pdf-export` spec because no ARCHITECTURE.md existed at roses-os root. Decisions captured here are only those that spec needs; broader roses-os architecture stays implicit in code until a later spec touches it. Future specs that touch the manuals export path append decisions here rather than re-deciding in code review.

## System shape (manuals export subsystem)

roses-os is a Next 16 App Router application with Supabase as the data plane and Vercel as the deploy target. The `/manuals` editor reads and writes blocks (stack of `heading`, `text`, `image`, `image-row`, `divider`, `page-break`) keyed by `manualId` and `locale`. Before this spec, the Download menu's PDF button branched on `pdf-map.ts`: mapped slugs served a 2022 static PDF from `public/manuals/pdf/`; unmapped slugs ran `blocksToHtml` and called `window.print()`. After this spec, a runtime path turns current Supabase blocks into a print-faithful PDF on Vercel, with the two pre-existing paths demoted to fallbacks.

```
DownloadMenu.tsx
   |
   v
GET /api/manuals/[manualId]/pdf?locale=xx
   |
   +-- chromium-adapter (launch puppeteer-core via @sparticuz/chromium on Vercel; local Chromium in dev)
   |
   +-- in-process fetch of /manuals/[manualId]/print?locale=xx
   |        |
   |        +-- server component reads blocks from Supabase
   |        +-- synthesize-rhythm.ts groups blocks into panels
   |        +-- print-manual.css applies typography + page rules
   |
   +-- page.pdf() -> application/pdf stream
   |
   +-- fallback chain: static PDF (if mapped) -> blocksToHtml client blob -> named-error envelope
```

Modules in this subsystem:

| Name                                 | Responsibility                                              | Owns                                                       |
|--------------------------------------|-------------------------------------------------------------|-----------------------------------------------------------|
| `DownloadMenu.tsx`                   | UI entry; chooses runtime vs static vs blob path            | Per-click telemetry, fallback dispatch                    |
| `/api/manuals/[manualId]/pdf`        | Server route; orchestrates chromium + fallback chain        | Response shape, Sentry capture, fallback decision         |
| `/manuals/[manualId]/print`          | Server component; renders synthesized HTML for chromium     | DOM that chromium prints; locale-aware                    |
| `chromium-adapter.ts`                | Launches puppeteer-core with the right binary per env       | Cold-start chromium handle, version pin                   |
| `synthesize-rhythm.ts`               | Pure function: blocks plus locale rules to grouped panels   | Grouping rule set, locale overrides                       |
| `synthesis-rules.ts`                 | Data file: per-locale grouping rules                        | Rule shape: which block runs become which panel kind      |
| `print-manual.css`                   | Print-specific styles, page rules, panel layout             | Typography, page-break behavior, side-by-side rendering   |
| `pdf-map.ts`                         | Slug to static PDF map (existing, demoted to fallback)      | Fallback PDF resolution                                   |
| `public/manuals/pdf/*.pdf`           | The 2022 canonical PDFs (existing)                          | Cold fallback artifacts; reference baseline (hashes below)|

## Decision log

### D-001 — Chromium on Vercel via `@sparticuz/chromium` plus `puppeteer-core`

- **Chosen.** Use `@sparticuz/chromium` paired with the already-vendored `puppeteer-core@^24.38.0`, launched through a single adapter at `src/lib/manuals/chromium-adapter.ts` that branches on `process.env.VERCEL`. The Vercel function runs `nodejs` runtime with memory at or above 1024 MB and `maxDuration` raised to 60 seconds.
- **Alternatives considered.**
  - Browserless (hosted Puppeteer-as-a-service).
  - Puppeteer-cluster on a dedicated Vercel function or external worker.
  - Render a paginated HTML and let the browser print client-side.
- **Why this won.** `scripts/build-manuals.ts` already runs `puppeteer-core` at build time, so the team's mental model is in place. `@sparticuz/chromium` is the canonical serverless chromium binary and ships pre-bundled for the AWS Lambda runtimes Vercel uses. No new vendor, no new billing line.
- **Why the alternatives lost.** Browserless adds a vendor and a credential surface for one feature. Puppeteer-cluster solves a load problem we do not have. Client-side print loses fidelity and was the failure mode that motivated this spec.
- **Implications.** Per-route config (`maxDuration`, `runtime`, memory) must be set; CI must fail a mismatched bump of either package; `puppeteer-core` and `@sparticuz/chromium` stay version-aligned.
- **Panel source.** Winston, Amelia.

### D-002 — Print route is its own segment, not a query-flagged view

- **Chosen.** A dedicated segment `app/manuals/[manualId]/print/page.tsx`, server component, locale via `?locale=xx` query string.
- **Alternatives considered.** `/manuals/[manualId]?view=print` query-flag on the existing reading route. A route group `(print)/manuals/[manualId]` with its own layout.
- **Why this won.** A dedicated segment has its own layout with no editor chrome, no nav, no Tailwind preflight surprises. Stable URL for chromium to navigate to. Easy to gate from search engine indexing.
- **Why the alternatives lost.** Query-flag overloads the reading route and risks accidental indexing. Route group adds nesting for one page.
- **Implications.** The print route uses `export const dynamic = 'force-dynamic'` and `export const revalidate = 0`. A `<meta name="robots" content="noindex">` block is rendered.
- **Panel source.** Winston, Sally.

### D-003 — API route is cookie-pass-through, gated by RLS, not a separate PIN

- **Chosen.** `/api/manuals/[manualId]/pdf` forwards the caller's Supabase session cookie to the in-process fetch of the print route. Authorization is the same Supabase RLS posture the editor already enforces. No new PIN, no signed URL.
- **Alternatives considered.** PIN-gated route (separate code per manual). Signed URL with short TTL minted by the editor at click time. Public route, no auth.
- **Why this won.** The editor is already RLS-gated; reusing the session means no second authorization plane to keep in sync. A teacher who can edit can download.
- **Why the alternatives lost.** PIN adds a credential per manual. Signed URL adds a secret rotation surface for no reader-side gain. Public route leaks edited drafts.
- **Implications.** The route runs in the user's request context, never as a service-role call. Chromium's in-process fetch carries the same cookie headers.
- **Panel source.** Winston, Lattice.

### D-004 — Rhythm synthesis is rule-based with per-locale overrides, isolated as a pure module

- **Chosen.** `src/lib/manuals/synthesize-rhythm.ts` exports a pure function `synthesize(blocks, locale) => panels`. Rules live in a TypeScript data file `synthesis-rules.ts` keyed by locale, with an `en` default. No LLM at render time. No new block types.
- **Alternatives considered.** LLM call per render to group blocks. Explicit "synthesis hint" markers stored on blocks themselves. All-in-one render inside `print/page.tsx` with grouping inline.
- **Why this won.** Rules are deterministic, cheap, testable, and per-locale overridable. Isolating into a pure module makes the synthesizer the spec's testable surface, which is the architectural risk identified in panel review.
- **Why the alternatives lost.** LLM adds latency, cost, and non-determinism on every download. Hint markers contradict the constraint that teachers do not learn new block types. Inline grouping calcifies into the render and is untestable.
- **Implications.** The synthesizer has its own unit tests with fixtures from real Supabase data per locale. Changes to grouping ship as data, not code. Synthesizer version is embedded in PDF metadata (see D-009).
- **Panel source.** Winston, Kaze.

### D-005 — Four-tier fallback chain: runtime, static, blob, named-error

- **Chosen.** Four steps in order: runtime route succeeds and streams PDF; on failure, redirect to `pdf-map.ts` static PDF if the slug is mapped (HTTP 302, `X-PDF-Tier: static`); on failure or no map, the API returns a sentinel that tells `DownloadMenu.tsx` to run the existing `blocksToHtml` client blob path (`X-PDF-Tier: blob`); on any further failure, return `{ok: false, error: {code, message}}` with HTTP 5xx.
- **Alternatives considered.** Single-path: runtime only, blank error otherwise. Two-path: runtime then static, drop the blob.
- **Why this won.** The spec keeps static PDFs in the repo as fallback. The blob path is the only path that exists today for unmapped slugs and non-English; killing it leaves those users worse off if chromium fails.
- **Why the alternatives lost.** Single-path strands every user on a cold-start error. Two-path drops the only working option for unmapped slugs.
- **Implications.** `DownloadMenu.tsx` keeps its existing branches as the receiver of the sentinel. The route logs which tier served the request to Sentry as `pdf.tier`, so we can watch the static and blob tiers go quiet over time.
- **Panel source.** Winston, Lattice.

### D-006 — No PDF caching in v1; per-block-hash caching parked behind a flag

- **Chosen.** Render on every request. No cache layer. An `If-None-Match` ETag derived from `max(updated_at)` over the manual's blocks is the only header.
- **Alternatives considered.** In-memory LRU keyed by `(manualId, locale, contentHash)`. Vercel KV cache per block-hash. CDN cache with revalidate-on-edit webhook.
- **Why this won.** Volume is low (teacher downloads, not public traffic). Cache invalidation is the bug we cannot afford given the whole point is that edits flow through. Rendering on demand is correct first; cache is an optimization that ships only if Sentry shows real latency pain.
- **Why the alternatives lost.** Each adds a stale-content risk that directly violates Jennifer's complaint. ETag gives a free 304 path without owning storage.
- **Implications.** Cold-start chromium runs every download. AC measure cold-start latency budget. A future spec can add per-block-hash caching once the surface is proven.
- **Panel source.** Winston.

### D-007 — Locale flows as a query parameter, source-of-truth is the editor selection

- **Chosen.** The Download menu reads the editor's currently selected locale and appends `?locale=xx` to both the API call and the print route navigation. The API forwards it. The print route reads it from `searchParams`. No locale inference from headers or cookies.
- **Alternatives considered.** Locale from `Accept-Language` header. Locale stored on a session cookie at editor load. Locale derived from the URL path of the editor.
- **Why this won.** Explicit is cheaper than implicit. The editor already knows which locale is selected; passing it forward is one parameter. Debugging is trivial because the URL says what was requested.
- **Why the alternatives lost.** Header-based locale gets confused by user-agent guesses. Cookie-stored locale drifts. URL-derived locale couples two routes that should stay independent.
- **Implications.** The API route validates the locale against the allowlist `[en, pt, es, el, ru, uk]` and falls back to `en` with a logged warning if absent or invalid. The synthesizer receives the validated locale, never raw.
- **Panel source.** Winston, Sally.

### D-008 — Static PDFs at public/manuals/pdf/ remain reachable, become the second-tier fallback

- **Chosen.** Keep `pdf-map.ts` and the three static PDFs as the cold fallback. The Download menu never links to them directly anymore; only the runtime route redirects there. New static PDFs are not added by this spec; the path exists only for the three currently-mapped slugs.
- **Alternatives considered.** Remove the static PDFs entirely once runtime ships. Keep static PDFs as a hidden manual override route the editor can toggle.
- **Why this won.** Spec constraint #3 names the static fallback as required. The route owns the decision of when to use it, so the user never sees stale 2022 content unless chromium genuinely fails.
- **Why the alternatives lost.** Removing strands the user on chromium errors. A manual override route adds a UI surface the spec explicitly does not want.
- **Implications.** `pdf-map.ts` becomes a fallback data structure, not a primary route handler. A future spec can prune it when Sentry confirms the runtime route is reliable for those three slugs.
- **Panel source.** Winston, Lattice.

### D-009 — Print template version constant embedded in PDF metadata

- **Chosen.** Export a semver constant `PRINT_TEMPLATE_VERSION` from `src/lib/manuals/synthesize-rhythm.ts`. The API route writes it into the rendered PDF metadata via Puppeteer's `displayHeaderFooter` plus a `<meta name="pdf-template-version" content="x.y.z">` block read by chromium at print time. CI bumps the constant any time `synthesize-rhythm.ts` or `synthesis-rules.ts` changes.
- **Alternatives considered.** Store version in a separate constants file. Embed version in PDF filename. Skip versioning until a future spec.
- **Why this won.** Lattice surfaced the audit-failure mode: months from now a teacher prints two PDFs and asks why they differ. Without a version stamp on each render, the comparison is vibes-based. Co-locating the constant with the synthesizer means it cannot drift away from the rules that produced it.
- **Why the alternatives lost.** Separate constants file invites the constant to lag the rules. Filename versioning collides with the language code in the user-facing download name. Skipping versioning leaves the audit failure unaddressed.
- **Implications.** `pdfinfo <file>` reveals the version. The drift watcher (M4 T-026) reads it to compare static vs runtime renders auditably. Visual-regression diffs in CI carry the version pair (`a.b.c -> a.b.d`) for traceability.
- **Panel source.** Lattice, Winston.

### D-010 — 2022 canonical PDFs hash-frozen in this architecture file

- **Chosen.** SHA256 hashes of the three 2022 canonical PDFs at `public/manuals/pdf/` are recorded below. Any future mutation of those files must update the hash and document the reason. The hash is the immutable historical reference.
- **Alternatives considered.** Treat the static PDFs as opaque assets, no hash record. Move the 2022 PDFs to a separate git submodule for versioning.
- **Why this won.** Lattice's structural observation: the 2022 PDFs are themselves unversioned artifacts. Once runtime ships they become the comparison baseline; teachers will hold runtime prints next to 2022 prints and ask about drift. The honest answer requires an immutable baseline reference. Recording the hash in this file makes the answer auditable.
- **Why the alternatives lost.** Opaque assets leave the audit question structurally unanswerable. A separate submodule adds operational complexity for one infrequent comparison.
- **Implications.** Frozen hashes below. CI fails if the files at `public/manuals/pdf/` drift from these hashes without an accompanying ARCHITECTURE.md update.

**Frozen hashes (recorded 2026-05-27, populated by T-013):**

```
rose-meditation-level-1.pdf      = sha256:<filled-by-T-013>
rose-meditation-level-1-and-2.pdf = sha256:<filled-by-T-013>
rose-meditation-level-3.pdf      = sha256:<filled-by-T-013>
```

- **Panel source.** Lattice, Winston.

## Conventions

- **Naming.** Synthesizer: `synthesize-rhythm.ts`. Rules data: `synthesis-rules.ts`. Adapter: `chromium-adapter.ts`. Print route: `app/manuals/[manualId]/print/page.tsx`. API route: `app/api/manuals/[manualId]/pdf/route.ts`. All new pure code lives under `src/lib/manuals/`; route handlers and server components live under App Router segments.

- **Structure.** Pure functions live in `src/lib/manuals/`. React components used only by the print route live in `app/manuals/[manualId]/print/_components/`. Tests for pure modules live alongside as `*.test.ts`. No new test runner; `pnpm test` placeholder stays as-is and the synthesizer tests run via a dedicated `pnpm test:synthesize` script.

- **Error handling.** All HTTP routes introduced or modified by this spec return the named-error envelope `{ok: false, error: {code, message}}` per /test-feature v1.5. Stable error codes: `CHROMIUM_LAUNCH_FAILED`, `CHROMIUM_DISABLED`, `BLOCKS_FETCH_FAILED`, `SYNTHESIS_EMPTY`, `PRINT_TIMEOUT`, `LOCALE_INVALID`. Legacy `{error: string}` is not used in new code.

- **Observability.** Sentry captures every chromium boot timing as a span tag, every fallback-tier hit as `pdf.tier=runtime|static|blob|error`, plus `pdf.manualId` and `pdf.locale` always set, plus `pdf.template.version` from D-009. Console capture in Sentry is at warn+error per the standard Light Brands observability config.

- **Data flow.** The print route reads from Supabase under the caller's RLS session, never the service role. The synthesizer is the single writer of the panel grouping shape. The API route is the single writer of the fallback decision and the response envelope.

- **Cookies and headers.** Chromium's in-process fetch of the print route propagates the request's `cookie` header so RLS holds. No service-role reads from the print route.

- **Response headers (manuals export subsystem).** `X-PDF-Tier: runtime|static|blob`. `X-PDF-Template-Version: <semver>` when tier is runtime.

## Non-goals

- This architecture does not introduce new block types. The render template synthesizes rhythm from existing blocks.
- It does not remove the static PDFs at `public/manuals/pdf/` or the `pdf-map.ts` table. They become cold fallback.
- It does not redesign the `/manuals` editor or its block model.
- It does not introduce a separate PDF storage layer (Supabase Storage, S3, Vercel Blob). Render on demand.
- It does not handle the language re-sync for non-English editions (issue #504, out of scope).
- It does not add a print-preview mode in the editor UI. The Download button is the only entry.

## Open architectural questions

- **A-Q1.** Should the synthesizer produce a fixed page count, or let chromium flow content naturally? Disagreement: Kaze leans fixed (match 2022 PDFs exactly); Sally and Amelia lean variable (avoid orphan widows, accept teacher edits that change length). Per `[[feedback_autonomy_authorized_paths]]`: ship variable-length PDFs in v1 with explicit `page-break-before` controls in the synthesizer; revisit if Jennifer flags drift after the first runtime download.
- **A-Q2.** Where does the `MANUAL_RUNTIME_PDF_DISABLED` kill switch and the per-slug rollout allowlist live? Disagreement: Winston suggests env var on Vercel; Lattice suggests Supabase row for auditability. Default: env var on Vercel for v1 because lowest-friction rollout; promote to Supabase row once more than five slugs need flag control.

## Source

- Spec(s): `./specs/001-faithful-pdf-export/spec.md`
- Plan(s): `./specs/001-faithful-pdf-export/plan.md`
- Deliberation artifacts: `./specs/001-faithful-pdf-export/.deliberation/`
- Panelists who contributed to architecture decisions: Winston (author), Amelia (D-001), Sally (D-002, D-007), Lattice (D-003, D-005, D-008, D-009, D-010), Kaze (D-004).
