# Lattice review: faithful-pdf-export

Structural lens. Six prompts. Load and tolerance, not certainty.

## 1. What problem is this actually solving?

The proximate problem is editor-to-export divergence: Jennifer edits in /manuals, the download serves a 2022 artifact. The structural problem is older. roses-os carries two parallel sources of truth for the same teacher-facing artifact: a static PDF tree at public/manuals/pdf/ and a runtime block model in Supabase. PR #505 papered over the gap by serving the static asset for mapped slugs. This spec widens that crack by adding a third surface, the runtime Puppeteer render, while keeping the static tree as fallback. The architecture is stable enough to absorb one more surface only if we name the precedence rule and write it down. Today there is no canonical answer to "which artifact wins when they disagree." After this spec there must be one.

## 2. Smallest first version that proves the idea?

One slug, one language, one render path. rose-meditation-level-1 in English, /api/manuals/rose-meditation-level-1/pdf, deployed to a Vercel preview, returning a PDF that visually matches the 2022 reference within a defined tolerance (page count equal, section headings present, at least one image+text panel rendered). No fallback chain yet. No multi-language. Either it renders on Vercel against @sparticuz/chromium or it does not. If it does not, the rest of the spec is theoretical.

## 3. Three risks that kill this if ignored

a. Dual-source-of-truth drift. The static tree stays as fallback. Six months from now a teacher edits, the runtime route fails silently for a class of inputs, and the static 2022 PDF ships to a student. Nobody notices because the download succeeded. The fallback path must emit a visible signal (header, watermark, telemetry event) so silent fallback is structurally impossible.

b. Print template versioning. The print template IS the editorial contract. A change to its grouping rules retroactively changes every download for every slug in every language. Without a template version pinned in the rendered PDF metadata and logged per render, you cannot answer "which template version produced this artifact" three months out. This is the audit failure mode.

c. Language coverage as a cliff, not a gradient. Five non-English editions are structural snapshots from before covers and TOC. The print template's grouping heuristics will hit edge cases unevenly across pt/es/el/ru/uk. A render that looks correct in English and broken in Greek ships as "working" if the AC reads "English renders." AC must enumerate all six languages with per-language visual snapshots.

## 4. Success at 90 days

The runtime route is the default download for all six languages on all four slugs. The static tree at public/manuals/pdf/ has not been served as fallback more than 0.5 percent of requests over the trailing 30 days. Render error rate below 1 percent. Per-render telemetry log carries slug, language, template version, render duration, outcome. Jennifer has edited at least one manual and seen the edit in a downloaded PDF without operator help.

## 5. Atomic tasks

1. Add @sparticuz/chromium dependency, validate local Puppeteer-on-Vercel preview boot.
2. Stub /api/manuals/[manualId]/pdf returning a one-page PDF on Vercel preview.
3. Build /manuals/[manualId]/print server route consuming Supabase blocks.
4. Print template version constant, embedded in PDF metadata at render.
5. Grouping rules for side-by-side panels, English only, regression snapshot.
6. Language plumbing: language query param to print route, six-language snapshot fixtures.
7. Fallback chain with VISIBLE signal on static-PDF fallback (header banner or watermark).
8. Per-render telemetry: slug, language, template version, duration, outcome to logs.
9. Kill-switch env var FAITHFUL_PDF_RUNTIME_DISABLED that forces static fallback.
10. Health endpoint /api/manuals/_health reporting chromium boot status.
11. Visual-regression CI gate over six-language snapshot set.
12. Drift watcher: weekly job comparing static vs runtime render for mapped slugs.
13. Decision log entry in ARCHITECTURE.md naming the precedence rule.

## 6. The one thing only Lattice would notice

The canonical 2022 PDFs at public/manuals/pdf/ are themselves an unversioned artifact. Nobody owns them, nobody can tell you which Word doc they came from. The day the runtime route ships, those files stop being "the source" and become "the fallback," but their authority as historical reference is what teachers compare against. Three months in, a teacher will print a runtime PDF, hold it next to a 2022 PDF, and ask why the rhythm shifted. The honest answer is the 2022 PDF was never the spec, it was an artifact. The spec must name the 2022 PDFs as a snapshot reference with a frozen hash recorded in ARCHITECTURE.md, so the comparison is auditable rather than vibes-based.
