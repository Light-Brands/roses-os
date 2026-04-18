# AGENTS.md — roses-os (International Aura School)

Canonical rules for any AI agent operating in this repo. Read before editing.

## What this is

Public website + admin tooling for **International Aura School** (a Light-Brands client) — a spiritual education platform centered on "The Rose" inner-technology curriculum (3 levels) and "The Aura" perception work. Surfaces include the public marketing site, gated teaching pages, enrollment/contribution/agreement forms, a PDF/manual export pipeline, and an admin dashboard. The collaborative manual editor (block-based, multi-language, PIN-gated) is the current focus area.

## Stack

- **Next.js 16.1.4** App Router, React 19.2.3, TypeScript strict
- **Tailwind v4** + tokens at `src/design-system/tokens.ts`, theme CSS at `src/design-system/theme.css`
- **Supabase** (`@supabase/ssr` 0.8 + `@supabase/supabase-js` 2.90) for manuals, settings, optional content store. SSR client in `src/lib/supabase/server.ts`, browser client in `client.ts`. Schemas: `supabase/schema.sql`, `supabase/manuals-schema.sql`, `supabase/seed-manual-content.sql`
- **3D / motion:** three.js 0.182 + react-three-fiber 9, drei, postprocessing, simplex-noise (HeroSphere, RoseModel — `src/components/three/`)
- **Animation:** framer-motion 12, gsap 3
- **PDF:** `pdf-lib` for in-app generation, `puppeteer-core` (server, headless) and Python (`scripts/generate-manual-pdfs.py`, `scripts/edit-pdf-images.py`) for offline pipeline. `sharp` for image work, declared as `serverExternalPackages` in `next.config.ts`
- **AI:** `@google/genai` 1.41 — used in `src/app/api/ai/personalize/`
- **Fonts:** Local woff2 (Cormorant Garamond + Inter) loaded via `next/font/local` in `src/app/layout.tsx`. Do not add Google Fonts — keep self-hosted.
- **Package manager:** **pnpm only**. `pnpm-lock.yaml` is canonical; `package-lock.json` exists but Vercel builds off pnpm (commit `7977e52` fixed a Vercel break caused by lockfile drift).

## Where things live

```
src/app/
  layout.tsx                  Root: fonts, JSON-LD org schema, theme bootstrap script, providers (Theme/Transition/Toast), Preloader, PageTransition, CustomCursor, ScrollProgress, PWAInstallPrompt
  globals.css                 Tailwind v4 entry + design tokens
  robots.ts, sitemap.ts       SEO
  (site)/                     Public marketing — home, the-rose, offerings, guardians, community, contact, meditation
  (invitation)/               Invitation funnel + learn-more
  (forms)/                    enroll, contribute, agreements (paired with /api routes)
  (teaching)/                 Gated teaching pages (level-1/2/3) — password gate via PasswordGate
  (manuals)/                  PIN-gated collaborative manual editor — list page + [manualId] block editor
  (admin)/admin/              login, analytics, content, feedback, media, users, settings — own globals.css and layout
  api/
    manuals/                  GET list; [manualId]/blocks (CRUD + reorder); pin (verify/manage); upload (image)
    agreements/ enrollment/ contribution/ feedback/ content/ media/   route.ts each, Supabase-backed
    pdf/                      edit, paid-programs, summary — server PDF generation
    ai/personalize/           Google GenAI call

src/components/
  ui/                         Navigation, Footer, Logo, Preloader, PageTransition, CustomCursor, ScrollProgress, Toast, PWAInstallPrompt
  sections/                   PageHero, DomainGrid, LineageTimeline, ContributionTiers, etc
  three/                      HeroSphere, RoseModel, RoseCanvas (loads /public/models/rose.glb)
  forms/                      EnrollmentForm, ContributionForm, AgreementsForm
  teaching/                   LevelNav, PasswordGate, TechniqueCard, ChakraChart
  manuals/                    BlockEditor, BlockWrapper, ManualPinGate, AdminPinManager, DownloadMenu, blocks/{Heading,Text,Image,Divider,PageBreak,AddBlockMenu}
  admin/                      AdminHeader, AdminSidebar, DataTable, Skeleton

src/lib/
  manuals/                    db.ts (Supabase queries), pin-auth.ts (PIN verify), export-html.ts, export-md.ts, types.ts (block schema, 6 ManualLanguage codes)
  supabase/                   server.ts (createServerSupabaseClient), client.ts, auth.tsx, types.ts, index.ts
  i18n/                       context.tsx + types.ts — translation provider for the 6 manual languages
  admin/auth.tsx              Admin auth helpers
  seo.tsx                     siteConfig + JsonLd + generateOrganizationSchema
  theme.tsx, transition.tsx   Providers used in root layout
  data/                       Static content (programs, lineage, etc)
  utils.ts                    cn() helper

scripts/
  build-manuals.ts            Compiles HTML manuals for L1/L2/L12/L3 — run via `pnpm build:manuals[:l1|l2|l12|l3]`. Side-effect: copies images into scripts/pdf-manuals/images/level-N/, two of which are gitignored (build-synced)
  import-manuals-to-blocks.ts HTML → Supabase block import (commit ab3b55b)
  generate-manual-pdfs.py     Python; deps in scripts/requirements-pdf.txt
  edit-pdf-images.py          Python image swap on existing PDFs
  generate-favicons.mjs       `pnpm icons` — uses sharp + to-ico
  generate-og-image.mjs       OG image
  generate-images-v4.ts, generate-page-images.ts, generate-missing-images.ts   AI image generation pipeline
  generate-translated-teachers-aid.ts, translation-docs/generate-manual-docs.ts   Translation tooling (`pnpm translation:export`)
  new-project.sh              Scaffold helper

docs/                         Brand DNA, foundation (the-codex), program, training, technology, geo-content, source-materials, plans/ (gitignored)
supabase/                     schema.sql, manuals-schema.sql (self-contained, see commit fbba203), seed-manual-content.sql
public/                       Heavy: /images, /page-images, /rose med images, /resources, /models — all excluded from serverless function bundles via outputFileTracingExcludes in next.config.ts
.github/workflows/            ci.yml, deploy.yml, pr-review.yml
setup/                        wizard.mjs (`pnpm setup`) + init.ts — first-time scaffolding
ai-workflows/, prompt-library/, ui-polish/   Legacy generic-template artifacts; not in active use
AI-RULES.md                   STALE — references "Digital Cultures" agency, monochrome palette, Inter-only. Do not follow this for actual style work; the live design uses Cormorant Garamond serif + warm palette per `src/design-system/`.
.claude/project-context.md    STALE — also Digital Cultures. Ignore.
```

## Current focus (per recent commits)

**Collaborative manual editor (iter-1, merged + iterating).** Recent commits:
- 6148ff9 — drag-and-drop reordering, touch-friendly controls
- 27c6129 — content imported to all 6 languages (en, pt, es, el, ru, uk)
- 0bc5063 — editor UX overhaul
- ab3b55b — HTML-to-blocks import script
- d621571 — cover image paths + starter seed
- e63b396 — JSONB PIN parse fix for Supabase settings table
- fbba203 — manuals migration made self-contained
- iter-1 sequence (4b339b9 → 6fb2c6c) — schema, API routes, PIN gate, block editor, export (PDF/HTML/MD), admin PIN management

The system is block-based (`heading | text | image | divider | page-break`), per-language rows in `manual_blocks`, two PIN roles (`editor`, `teacher`), exports to PDF/HTML/Markdown.

## Conventions

- **Imports:** `@/*` → `src/*`. Always alias.
- **Class composition:** `cn()` from `@/lib/utils` (clsx-based).
- **Supabase:** server-side calls go through `await createServerSupabaseClient()` (async). Browser client is separate — never mix.
- **Settings table:** values are JSONB. The PIN parse bug in e63b396 is a reminder — `settings.value` is parsed JSON, not a string.
- **Manual schema:** runs idempotently via `IF NOT EXISTS` and `EXCEPTION WHEN duplicate_object` blocks. RLS is enabled; PIN auth happens at the app layer, not via RLS, so policies are wide-open `USING (true)`.
- **Manual block content shape:** discriminated by `block_type`; types in `src/lib/manuals/types.ts`. Keep `BlockContent` exhaustive when adding a new block type.
- **i18n:** 6 languages hard-coded in `MANUAL_LANGUAGES`. Codes are ISO-style: `en pt es el ru uk` (Greek is `el`, not `gr`).
- **Theme bootstrap:** an inline `<script>` in root layout reads `localStorage.theme` and `localStorage['style-variant']` before hydration to avoid FOUC. Do not rip it out — and if you add a new style variant, mirror it here.
- **PDF redirects:** `next.config.ts` has 3 permanent redirects from `/resources/manuals/ROSES-OS-Level-N-Manual-EN.pdf` → `Rose-Level-N-Manual-EN.pdf` (commit 2dddb20). Keep them; old links are out in the wild.
- **`outputFileTracingExcludes`:** the public/ heavies are excluded from the Vercel function bundle. Do NOT remove without checking what the PDF/api routes still need at runtime.
- **`typescript.ignoreBuildErrors: true`** is set in `next.config.ts` for a known framer-motion `Variants` typing issue in `admin/page.tsx`. Do not depend on tsc-during-build to catch you — run `pnpm type-check` locally.

## Gotchas

- **Two stale generic-template docs lie about the design.** `AI-RULES.md` and `.claude/project-context.md` both describe a "Digital Cultures" monochrome agency site with Inter only. The actual product uses Cormorant Garamond serif + Inter sans, a warm palette, and is a spiritual-education site. Trust the code (`src/design-system/`, `src/app/layout.tsx`) and `README.md`, not those two files.
- **Lockfile dual-presence.** Both `pnpm-lock.yaml` and `package-lock.json` exist. **pnpm is the source of truth.** Vercel builds with pnpm; commit 7977e52 was a sync fix. If you add a dep with `npm install` you will break Vercel — use `pnpm add`.
- **`build-manuals.ts` writes into `scripts/pdf-manuals/images/level-2/`** — two specific files (`19-physical-space.png`, `24-chakras.png`) are gitignored because they are build artifacts. Do not commit them.
- **`_bmad` and `_qie` symlinks** at repo root point to QIE intelligence and are gitignored. Treat as read-only references; never edit through them.
- **`docs/plans/`** is gitignored (commit 26ce387). Drafting plans there is fine, but final docs live elsewhere in `docs/`.
- **`tsconfig.tsbuildinfo`** is committed (599KB) — a quirk of how the repo was initialized. Do not delete it in a PR; that's a separate cleanup.
- **Three large PDFs and two iPhone-name images** sit at the repo root (Rose Meditation Level 1, ROSES 3 MANUAL 2022, ROSES MANUAL 1 and 2 2022, plus `61C5142D-...png` and `IMG_6369.jpeg`). Source material — leave them, don't relocate without asking.
- **Admin PIN flow**: PIN values live in `settings` table (`key='admin_pin'` etc), JSONB. Two distinct PINs — admin (full) and editor/teacher (manual editor scoped). Don't conflate.
- **`@google/genai`** (not `@google/generative-ai`) is the new SDK. Used only in `src/app/api/ai/personalize/route.ts`. Requires `GEMINI_API_KEY` env var.

## Don'ts

- Don't run `npm install` — pnpm only.
- Don't import 3D / heavy three components into route layouts; keep them in client islands (see `src/components/three/RoseCanvas.tsx`).
- Don't add Google Fonts via `next/font/google` — keep self-hosted woff2 in `public/fonts/`.
- Don't follow `AI-RULES.md` or `.claude/project-context.md` style guidance. They're stale generic-template noise.
- Don't widen RLS by removing the `IF NOT EXISTS` / `EXCEPTION` guards in the SQL migrations — re-runs on prod will explode.
- Don't write to the `manual_blocks` table from the browser client — go through the API routes (`/api/manuals/[manualId]/blocks`) which carry PIN auth.
- Don't remove `outputFileTracingExcludes` from `next.config.ts` — the bundle will balloon.
- Don't mix `pnpm dev` with another concurrent dev server in this repo — use the QIE worktree workflow if multiple Claude sessions are active.

## Secrets

- `.env*` is gitignored. No `.env.example` in repo — env keys must be discovered via `vercel env pull` or by reading the Supabase/Google calls (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `GEMINI_API_KEY` at minimum).
- Never log PIN values, Supabase service-role keys, enrollee PII (names, emails on `/api/enrollment`, `/api/contribution`, `/api/agreements`).
- Never commit anything from `clients/` — this entire directory is gitignored at QIE root, but client repos like this one have their own remote (`Light-Brands/roses-os`) and push there.
