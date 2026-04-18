# CLAUDE.md — roses-os (Claude-specific notes)

**Read [`AGENTS.md`](./AGENTS.md) first.** This file is Claude-only addenda.

## Session start

1. `git log --oneline -10` — current focus is the collaborative manual editor; check what shipped since you last looked.
2. Check if `docs/CHANGELOG.md` or `docs/TODO.md` exist — they don't yet, but if a future session adds them, read first.
3. `git status` — three large source PDFs and two image files at repo root are intentional, not stragglers.
4. **Ignore `AI-RULES.md` and `.claude/project-context.md`.** Both describe a "Digital Cultures" agency site — stale generic-template noise. The real product is a spiritual-education platform with Cormorant Garamond serif + warm palette.

## Worktree rule

This repo is a Light-Brands client project. If another Claude session may be open against `roses-os` (Drode tabs, parallel terminals), isolate first:

```bash
bin/qie worktree auto roses-<short-slug>
```

Skip the worktree only for read-only exploration or a single-line doc edit. Always use one before `pnpm build`, `pnpm dev`, schema changes, or any non-trivial refactor — the manual-editor branch sequence (iter-1/step-1 through step-6) shows how often parallel work happens here.

## Test / lint / typecheck

- `pnpm type-check` — tsc --noEmit. **Run this manually**; `next build` ignores type errors (`next.config.ts` `ignoreBuildErrors: true` for a known framer-motion `Variants` issue in admin).
- `pnpm lint` — eslint flat config (`eslint.config.mjs`).
- `pnpm test` — placeholder, exits 0. There is no test suite yet. Don't claim "tests pass" as evidence of correctness.
- `pnpm build` — full Next prod build. Slow because of three.js + sharp.

## Package manager

**pnpm only.** `package-lock.json` is also present but Vercel deploys off `pnpm-lock.yaml` (commit 7977e52 was a sync break). If you `npm install` you will break Vercel — use `pnpm add`.

## Dev server quirks

- `pnpm dev` boots Next 16 with default Turbopack. Three.js HMR can be flaky — full reload if RoseCanvas stops rendering.
- Supabase calls require env vars (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, sometimes `SUPABASE_SERVICE_ROLE_KEY`). No `.env.example` in repo — pull via `vercel env pull` or ask user.
- `GEMINI_API_KEY` needed for `/api/ai/personalize`. Without it, that route 500s; the rest of the app is fine.

## Harness skill false positives

The Vercel plugin auto-injects skills on file reads (`README.md` → bootstrap; `package.json` → next-upgrade; `next.config.ts` → next-cache-components; `supabase/**` → vercel-storage). For documentation, code review, or text-only edits these are noise — skip them. Only invoke when actually writing code that touches that subsystem.

## Migration / schema work

- `supabase/manuals-schema.sql` is self-contained (commit fbba203) — it includes its own extensions, helper function, and settings table guards. Re-runnable.
- Never strip the `IF NOT EXISTS` / `EXCEPTION WHEN duplicate_object` blocks; re-runs on prod will fail.
- The `settings.value` column is JSONB — parse accordingly (commit e63b396 was a bug from forgetting this).

## When committing

- Stage explicit paths (`git add src/...`), never `git add -A`. The repo has stale generic artifacts (`AI-RULES.md`, `.claude/project-context.md`, `ai-workflows/`, `prompt-library/`, `ui-polish/`) you do not want sweeping into a commit.
- Match the existing commit message style: `feat: <verb-led summary>`, `fix: ...`, `chore: ...`, or the `[iter-N/step-M]` format used during the manual-editor sprint.
