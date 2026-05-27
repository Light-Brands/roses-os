# Mary review — faithful-pdf-export

## 1. What problem is this actually solving?

The stated problem is "teacher edits do not appear in the printed PDF." That is a symptom. Jennifer's two quotes carry two distinct jobs:

(a) **Trust the editor.** "When they print from /manuals it should be the version in there that is being edited." Jennifer is asking for editor-to-print fidelity, full stop. Today she edits and the artifact lies to her. That is a confidence problem, not a layout problem.

(b) **Recover the editorial rhythm.** "The style of the original meditation manuals has more image, image, image, text." This is about the felt quality of the printed object. The 2022 PDFs were designed; the current export is assembled. Jennifer is the steward of a teaching tradition and the printed manual is the physical artifact teachers hand to students. It carries the lineage.

The deeper problem is that the /manuals editor and the printed artifact have been two different products. This spec collapses them into one. Job (a) is the contract. Job (b) is the bar.

## 2. Smallest first version that proves the idea

A working `/api/manuals/[manualId]/pdf` route on Vercel that:

- Renders the current English `rose-meditation-level-1` blocks through a Puppeteer page using a print template that produces image-text interleaving close to the 2022 source.
- Streams the resulting PDF as a download.
- Falls back to the static slug-mapped PDF when chromium fails to launch or the render exceeds a timeout.

That single slug, single language, end to end on Vercel, with the fallback wired, proves the idea. The other five languages and the two other slugs come after.

## 3. Three risks that would kill this if ignored

1. **Chromium on Vercel is not the same machine as chromium on Dario's Mac.** `@sparticuz/chromium` has cold-start cost, memory ceiling, and serverless function timeout (Hobby 10s, Pro 60s). A render that works in dev fails in prod silently. Mitigation: ship behind the fallback chain, instrument with Sentry from the first deploy, measure P95 render time on real manuals before declaring done.

2. **The print template is a design exercise, not an engineering one.** The "image, image, image, text" rhythm is not encoded in the blocks. Synthesizing it from a flat stack is a grouping heuristic problem. If the heuristic is wrong, Jennifer will look at the output and say it still does not match. This is where the project quietly fails. Mitigation: Kaze owns the rhythm rules before Amelia writes the template; one round of A/B against the 2022 PDF before milestone close.

3. **The simpler path nobody named: a manual "regenerate canonical PDF" button in the editor.** Teacher clicks it, build script runs offline, output replaces `public/manuals/pdf/<slug>.pdf`. Same Puppeteer precedent as `scripts/build-manuals.ts`. No runtime chromium-on-Vercel. No serverless timeout. The trade is that the download is not live; it is "live as of the last regenerate." For a content type that changes weekly, not minutely, this might be enough. Worth naming so the panel can reject it explicitly rather than skip past it.

## 4. Success at 90 days

Jennifer prints a manual she edited yesterday and the PDF matches both the edits and the 2022 visual feel, in English and at least two of the five non-English editions. Zero teacher complaints about "the PDF is wrong" in a rolling 30-day window. Static fallback fires fewer than five percent of the time in production. Sentry shows P95 render under 20 seconds.

## 5. Atomic tasks

1. Add `@sparticuz/chromium` to `package.json` and confirm it boots on a Vercel preview.
2. Scaffold `/manuals/[manualId]/print` server component that reads blocks from Supabase by manualId.
3. Define the rhythm grouping rules with Kaze in a short doc (rules only, no code).
4. Implement the rhythm grouping function over the block array.
5. Style the print template to recover the 2022 typography hierarchy.
6. Scaffold `/api/manuals/[manualId]/pdf` route that drives Puppeteer against the print route.
7. Wire the error envelope and timeout handling per the v1.4 named-error shape.
8. Wire the fallback chain: runtime route fails or times out, serve the static slug-mapped PDF.
9. Update `DownloadMenu.tsx` to call the new route, drop the `getFinalPdfForSlug` branch.
10. Add Sentry instrumentation around the render call (duration, failure cause).
11. Smoke-test all six language editions on `rose-meditation-level-1`.
12. Visual-diff one rendered manual against `Rose-Level-1-Manual-EN.pdf` with Jennifer.
13. Curl-test the audit envelope on success and forced error per the v1.4 contract.
14. Document the chromium-on-Vercel decision in `ARCHITECTURE.md` (Winston).

## 6. The one thing only the analyst's lens would have noticed

The hidden assumption is that "faithful" means "matches the 2022 PDF." It does not. Jennifer signed two contracts in her two quotes: (a) the printed artifact reflects what the editor shows, and (b) it carries the editorial weight of the original. If the 2022 PDF stops being the reference next year (new cover art, new TOC convention, new founder direction), the print template must not be hard-coded to a 2022 aesthetic. Build the rhythm rules as configuration, not as a frozen stylesheet. Jennifer is not asking for a museum piece. She is asking for an artifact that stays trustworthy as the tradition evolves.
