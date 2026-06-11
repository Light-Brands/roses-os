# Mar'ah: Mirrorblade review

*The mirror reveals; the blade cuts the concealment; what is hidden is hidden no more.*

## 1. What problem is this actually solving?
The bricks were built; the building was never rebuilt. The editor renders the database faithfully, but the database holds flat legacy blocks. This spec rebuilds the content of 4 manuals into v2 primitives so each page reproduces its curated canon PDF. The real problem is not capability. It is a content migration disguised as a rendering task, where the source of truth is a curated PDF, not the old data.

## 2. Smallest first version that proves the idea?
Slice 0: Rose Meditation L1, en only, the full loop on one manual into a staging lane, ending in a side-by-side review harness a human signs off page by page. Not a script run. A proven loop with a human gate that closes.

## 3. Three risks that would kill this if ignored?
- The anon-only write path. `db.ts` imports only the browser client. A bulk staging write of hundreds of blocks has no server-side service-role path. Building one quietly opens a prod-credential seam.
- Staging is undefined. Clone id, reserved language, schema lane, or separate project are four different blast radii. Choosing wrong puts staging writes one filter-bug away from prod reads.
- Idempotency erasing human work. A re-run that overwrites the recipe overrides destroys the only human judgment in the pipeline.

## 4. Success at 90 days?
All 4 manuals, en, on staging, each page human-passed against canon, each soaked 7 days, then promoted transactionally with legacy backup and a tested rollback. Locales remain plumbing-only until translated canon exists. AC10 is formally retired in writing, not silently broken.

## 5. Atomic tasks
- Commit capability locally. Section-1 files staged, scratch excluded, type-check clean on the branch.
- Widen CHECK to include `contents`. Migration lists all 18 types; a `contents` insert succeeds on a staging table.
- Retire AC10 ceiling. Spec text supersedes the 12-type claim with the real count and reason. **Human-review: prose judgment, not bot-verifiable.**
- Define staging realization (D-5). ARCHITECTURE.md names the chosen lane and why; a staging write is provably invisible to prod reads.
- Build server-side admin write path. A documented service-role writer exists separate from the anon browser client; secret is not bundled to client.
- Canon page renderer. Each L1 page emits a PNG via puppeteer + system Chrome.
- Page-to-draft extractor. Each L1 page emits block JSON validated by `validateBlockInput`.
- Per-manual recipe YAML. Re-running extraction preserves prior human override fields unchanged.
- Staging writer. L1 blocks land in the staging lane with `schema_version: 2` and correct positions.
- Side-by-side review harness. Per page, canon image and rendered reconstruction display together.
- Human page sign-off loop. Each L1 page carries a recorded pass or fail state. **Human-review: fidelity is a human eye call.**
- Asset reconciliation. Every canon figure maps to a repo asset or is flagged with alt text.
- Promotion migration. Staging-to-prod runs transactionally, backs up legacy blocks, and rolls back on failure in a dry run.

## 6. The one thing only my faculty would have noticed
The spec claims "reproduces its canon PDF exactly." That word *exactly* is a concealment. Three of the four PDFs are 15 to 21 MB and the only fidelity check is a human eye on a side-by-side. There is no diff oracle. "Exactly" will be asserted, never measured. Name it: fidelity here means a human said yes, not that bytes matched.

## Legion Action Gate

**Truth (Emet).** The spec hides one effect: it presents itself as faithful reproduction when the canon is curated and vision extraction is lossy. Fidelity can be claimed at every page yet verified only by a human glance. There is no `canon-diff` that fails the build; `scripts/canon-diff.ts` is untracked and the test suite exits 0. The honest statement is: the human review gate is the only real check, and "exactly" is its aspiration, not its guarantee.

**Compassion (Rachamim).** A practitioner mid-session who learned the old TOC numbering or the old wording will meet renumbered, recurated pages with no notice. The spec serves the canon, not the existing reader. Required: the 7-day soak must surface intentional content changes to a human who can decide whether a learner is owed a transition, not just a pixel match.

**Necessity (Tzorekh).** Replacing prod content is the one effect to interrogate. Staging proves fidelity; promotion is what risks the live manual. Slice 0 does not need a prod write at all. The minimal ship is: staging stays canonical render until a human explicitly promotes one soaked manual. The promotion migration is necessary eventually, but it is the last task, not the proof.

**Beauty (Tiferet).** The fidelity-proof v4 honored the teaching: corner frames, the rose, the wisdom callout, the footer credit. The surface can carry the manual, not just the pixels. The risk to beauty is the extractor flattening a curated page back toward the old run-on. Recipes must hold intent, or beauty decays one re-run at a time.
