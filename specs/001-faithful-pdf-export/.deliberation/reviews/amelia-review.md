# Amelia review: faithful-pdf-export

Voice check: plain English, no dashes, no hype.

## 1. What problem is this actually solving?

The Download then Print as PDF button on `/manuals/[slug]` currently does one of two things, neither acceptable. For three mapped slugs it serves the 2022 canonical PDF from `public/manuals/pdf/`, ignoring teacher edits. For everything else it runs `blocksToHtml` into a blob and calls `window.print()`, which loses the original editorial rhythm. The code surface that changes:

- `src/components/manuals/DownloadMenu.tsx`: `handleDownloadPdf` stops branching on `getFinalPdfForSlug`, instead hits `/api/manuals/[manualId]/pdf?lang=<code>`.
- New `app/api/manuals/[manualId]/pdf/route.ts`: launches headless Chromium, navigates to an internal print route, returns `application/pdf`.
- New `app/manuals/[manualId]/print/page.tsx`: server component that reads blocks from Supabase by `manualId` + `lang`, runs the grouping rules, returns print-tuned HTML.
- New `src/lib/manuals/print-grouping.ts`: pure function that turns a stack of blocks into the side-by-side and image-then-text panels Jennifer described.
- `src/lib/manuals/pdf-map.ts` remains as a fallback lookup, not the primary path.

## 2. Smallest first version that proves the idea

A localhost-only route. Add `app/manuals/[manualId]/print/page.tsx` and view it in the browser to confirm the grouping rules read like the 2022 PDF. No Chromium wiring yet. Once the visual rhythm is right, add `app/api/manuals/[manualId]/pdf/route.ts` gated by `process.env.NODE_ENV === 'development'`, reusing the `findChrome()` helper pattern from `scripts/build-manuals.ts`. Ship that to a local Chrome before paying any Vercel cost. The print template is the load-bearing artifact; chromium-on-Vercel is plumbing.

## 3. Three risks that would kill this

- Function timeout. Vercel Hobby caps a serverless function at 10 seconds, Pro at 60, Enterprise at 900. Puppeteer cold start plus `networkidle0` plus `document.fonts.ready` plus the 2 second settle from `build-manuals.ts` is 8 to 25 seconds on a warm Lambda. Must declare `export const maxDuration = 60` and `export const runtime = 'nodejs'` (not edge), and the project must be on Pro at minimum. Without that, every cold call 504s.
- Bundle size. `@sparticuz/chromium` ships about a 50 MB Brotli payload that decompresses to roughly 170 MB in `/tmp`. The serverless function unzipped limit on Vercel Pro is 250 MB. Adding three.js, sharp, and the rest of `roses-os` to that lambda will almost certainly blow the limit. The route must be isolated as its own function and aggressively external-only via `serverComponentsExternalPackages`.
- Font availability inside the headless binary. `@sparticuz/chromium` ships without Cormorant Garamond. The print page must embed the font via `@font-face` with the file shipped from `public/fonts/`, not `next/font`, because `next/font` self-hosting paths resolve inside the lambda differently than at edge.

## 4. Success at 90 days

Jennifer clicks Download on any of the six language editions of any slug and gets a PDF whose layout matches the 2022 rhythm and whose text reflects edits made that morning. The three static PDFs in `public/manuals/pdf/` are kept but not the default path. p95 generation under 12 seconds. Zero teacher reports of stale text. Fallback to the static PDF when the route 5xxs.

## 5. Atomic tasks (each one day or less)

1. Add `@sparticuz/chromium` to dependencies via `pnpm add @sparticuz/chromium`.
2. Build `src/lib/manuals/print-grouping.ts` plus a unit-of-truth fixture comparing real Level 1 blocks to expected panels.
3. Build `app/manuals/[manualId]/print/page.tsx` reading Supabase by `manualId` + `lang`.
4. Build print CSS at `src/styles/manuals-print.css`: `@page`, Cormorant Garamond `@font-face`, page-break rules.
5. Build `app/api/manuals/[manualId]/pdf/route.ts` with `runtime = 'nodejs'`, `maxDuration = 60`, dev branch on local Chrome.
6. Wire `@sparticuz/chromium` for the prod branch, add to `serverComponentsExternalPackages` in `next.config.ts`.
7. Rewrite `DownloadMenu.tsx` `handleDownloadPdf` to fetch the route with `lang` query param.
8. Wire a graceful fallback to `getFinalPdfForSlug` on non-200.
9. Add a Vercel preview smoke check: hit the route for each of the six languages, assert `application/pdf` and size greater than 50 KB.
10. Update `src/lib/manuals/pdf-map.ts` comment to reflect it is now a fallback only.

## 6. The one thing only the dev's lens would catch

Next 16 App Router runs server components with `dynamic = 'force-dynamic'` only when explicitly declared, otherwise it may attempt static generation at build. The `/print` route reads live Supabase blocks; if it is statically generated at build time it will bake stale blocks into the lambda, defeating the whole spec. The print page must carry `export const dynamic = 'force-dynamic'` and `export const revalidate = 0` at the top. Also: `puppeteer-core@^24.38.0` requires Chromium 130 or newer. `@sparticuz/chromium` lags upstream by one to two majors; pin the matching pair (`@sparticuz/chromium-min` plus an explicit Chromium URL) or `page.pdf()` will throw on protocol mismatch.
