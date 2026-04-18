# International Aura School

> The Operating System of Remembrance

<!-- BEGIN QIE DOCTRINE -->
<!-- This file's doctrine section is managed by `bin/qie doctrine apply`. -->
<!-- Manual content above/below the markers is preserved on re-apply. -->
<!-- Regenerate with: bin/qie doctrine apply --project roses-os -->

## Stack

- Stack not auto-detected. Fill in languages, runtimes, and key dependencies here.

## Layout

```
(Update this with the actual top-level layout; run `ls -F` and summarize.)
```

## Conventions

- Add project-specific conventions here after a short audit of existing code patterns.
- Cross-cutting rules (worktree isolation, secrets, PII) already apply via the QIE hub.

## Commands

(Fill in the one-liner commands an agent would run: build, test, lint, typecheck, dev.)

## Change tracking

- Use `CHANGELOG.md` and `TODO.md` if they exist. If not, consider creating them.

## Multi-session note (cross-cutting rule from QIE hub)

Before modifying files in this repo, Claude sessions run `bin/qie worktree auto <slug>` once from the QIE hub so each session works in an isolated worktree and the shared `.git/index` doesn't race. Worktrees land at `clients/light-brands/.worktrees/roses-os--<slug>/` and are swept automatically after 7 days of inactivity unless they hold unpushed or unmerged work.

Full directive: see the QIE hub `CLAUDE.md` "Multi-Session Worktree Isolation" section.

## Secrets

Never log personal information. Use generic categories. Never commit `.env*.local`, API keys, tokens, passwords, or customer data. Repo-wide secrets go in `.env.local` (gitignored); shared docs go in `.env.example`.

<!-- END QIE DOCTRINE -->
