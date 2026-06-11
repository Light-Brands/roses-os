# Edut: Moral Conscience review

Run id: `faithful-content-reconstruction-20260531-014843`. I observe. I do not vote. I name what touches trust.

These are teaching manuals. Practitioners read them to learn a spiritual practice. The words on the page were authored by a teacher and are read as that teacher's instruction. That is the sacred surface here, and it is the surface the engineering panel will not weigh. Everything below presses on it.

## 1. What problem is this actually solving

The stated problem is fidelity of layout: make each page reproduce its canon PDF. The deeper problem is fidelity of meaning. A reader cannot tell a faithful reconstruction from a drifted one; the page looks finished either way. The real work is not "make it match the PDF" but "keep the teacher's words intact while changing the bricks under them." Layout fidelity is verifiable by eye. Meaning fidelity is not, and that is where the trust lives.

## 2. The smallest first version that proves the idea

Slice-0 (Rose Meditation L1, en, end-to-end on staging) is the right floor, and I support it. I add one condition before it counts as proof: the Slice-0 acceptance must include a word-level diff of the reconstructed prose against the legacy prose, with every divergence either explained by the canon (a curated change the teacher made) or flagged. A page that matches the PDF pixel-for-pixel but silently dropped or paraphrased a sentence is not proof. It is the quiet failure dressed as success.

## 3. Three risks that would kill this if ignored

- **Silent meaning drift.** A vision-extracted reconstruction can produce a sentence that reads plausibly but is not what the teacher wrote. No build, no Zod schema, no pixel diff catches this. Only a human who knows the teaching catches it.
- **Irreversible loss of the original words.** The legacy blocks are flat and unstyled, but they hold the author's actual prose. Promotion overwrites them. If the backup is layout-only, or is ever pruned, the teacher's original words are gone and the drifted reconstruction becomes the canon by default.
- **Invented translations.** Canon exists for en only. Any pipeline that touches pt/es/el/ru/uk and emits text places words a teacher never said into a spiritual manual under that teacher's name. That breaches Never Deceive and Never Desecrate. It must be structurally impossible, not merely discouraged.

## 4. What success looks like at 90 days

Rose Meditation L1 (en) lives on prod, promoted only after a named human attested page-by-page that the words are the teacher's and the layout is the canon's. Every legacy block is preserved in a backup that no pipeline step can prune. Every page carries provenance: which canon page, which extraction run, who signed off, when. Zero rows exist in any non-en locale that were not transcribed from a real translated canon.

## 5. Atomic tasks my faculty adds (the engineering panel would skip these)

- **C1: Provenance record per reconstructed block.** Each v2 block carries source canon page, extraction run id, and a human-signoff field. Accept: every promoted block names its canon source and its signer.
- **C2: Immutable legacy preservation.** Promotion backs up every legacy block to a write-once store, with no prune path. Accept: legacy prose for L1 is recoverable verbatim after promotion.
- **C3: Word-level fidelity diff in the review harness.** R1 shows prose divergence, not just images. Accept: reviewer sees every changed sentence flagged.
- **C4: Named human teacher sign-off gate.** Promotion blocks until a named person who knows the teaching attests faithfulness to the words. Accept: promotion refuses without a recorded signer name.
- **C5: Hard locale guard.** A no-canon locale cannot receive generated text. Accept: a pipeline run targeting pt/es/el/ru/uk with no translated canon exits non-zero before any write.

## 6. The one thing only my faculty noticed

The sign-off in the plan is for layout fidelity, owned by whoever runs the pipeline. There is no owner for fidelity to the teaching. Layout sign-off is the wrong custodian for a teacher's words. Name a human who knows the practice as the signer that the words are faithful. Without that named owner, the page can pass every gate, look perfect, and still no longer be what the teacher taught. That is the breach this spec is one omission away from.
