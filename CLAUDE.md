# International Aura School — Claude Code Guide

<!-- BEGIN QIE DOCTRINE -->
<!-- Managed by `bin/qie doctrine apply`. Content outside the markers is preserved. -->

**Canonical rules live in [`AGENTS.md`](./AGENTS.md).** Read it first. This file adds Claude-specific notes only.

## Prime directives (the four that matter most)

1. **Read `AGENTS.md`** — every session, before any file edit.
2. **Read `CHANGELOG.md` and `TODO.md`** — before starting any task, if they exist. Never duplicate completed work.
3. **Isolate with `bin/qie worktree auto <slug>`** before modifying code when other Claude sessions may be active in this repo. The command is idempotent; it no-ops inside an existing worktree.
4. **Never log personal info, never commit secrets.** See AGENTS.md "Secrets" for the full rule.

## Session hygiene

- Use `bin/qie checkpoint "<note>"` at meaningful milestones so other sessions see what you did.
- Use `bin/qie brief <topic>` to pull RAG context from the QIE corpus before large decisions.
- End with `bin/qie worktree finish` (push + PR) when the feature is shippable, or `drop` if abandoning.

## Bash etiquette (learned from production races)

- **Always** run `git diff --cached --stat` **in the same bash block** as `git commit`, gated on an expected file count. Other concurrent sessions can rewrite the shared index between `git add` and `git commit`.
- Stage files explicitly (`git add path/to/file`), never `git add -A` or `git add .` unless you've just reviewed every listed change.

## Slash commands

Project-specific slash commands (if any) live under `.claude/commands/`. The QIE hub's master agent roster (`/bmad-agent-*`, `/quinn`) is available from any repo that carries the `_qie` symlink.

<!-- END QIE DOCTRINE -->
