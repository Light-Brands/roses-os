# Mar'ah review — roses-os site-ready

*The mirror reveals; the blade cuts the concealment; what is hidden is hidden no more.*

I refute by default. I ran the four Legion Action Gates over the external effects this spec produces. Two effects matter: staging writes, and the promotion script the spec asks to build. I judge each by what the ACs make verifiable, not by what the operator intends.

## Truth (Emet)

The operator decision says the headless run never touches prod. Intent is not a property. The spec must make a prod write impossible, and it must be checkable by a third party reading only the test output. Three coupled ACs, all required:

1. The headless environment carries the anon key and no service token. AC asserts the run aborts at boot if a service-role key is present in env. A run that silently tolerates a service token is one misconfigured secret from a prod write.
2. The promotion script refuses to execute against any prod manual id (`afd5453c`, `156a0f3c`, `e953a823`, `85c8c132`) unless an explicit non-default flag is passed, and that flag is never set anywhere in the headless code path. `--dry-run` is not a guard; default-safe means the destructive default is refusal, and the test proves refusal by asserting a non-zero exit and zero rows written when the flag is absent.
3. The promotion script's own tests run staging-to-staging only, against lane ids, never against a prod id literal. Grep-level AC: no prod manual id appears as a write target in any script the headless run invokes.

Without all three, the no-prod-write claim is a comment, not a contract.

## Compassion (Rachamim)

el/ru/uk machine translation entering a lane Dario can open is a surprise waiting to happen. A held-for-native-review marker living in a script comment is concealment, the exact Klippah I break. The marker must surface to whoever opens the lane: a `review_status` column on the staged locale rows set to `held_native_review`, and the editor lane visibly refusing the promote action for those rows with that reason shown. The honesty test is screenshot-level, not assertion-level: open the el lane, see the hold.

## Necessity (Tzorekh)

Should the headless run translate el/ru/uk at all this pass, given they cannot promote without G2 signoff. Yes, and only if the marker is honest. Staging them now is useful because it gives the native reviewer the actual machine draft to correct against the canon, which is faster than starting cold. The effect is necessary because the work it enables (review) cannot begin without it. If the marker were dishonest the effect would be pure risk and I would cut it. The marker is the whole justification, so the marker AC is load-bearing, not cosmetic.

## Beauty (Tiferet)

The verification must be proportionate to what is reconstructed. This spec rebuilds three new manuals (L2, L3, Aura) plus the L1 baseline. The roses-os precedent (spec 003 AC10) holds: a reconstruction slice may not close on a data-only validity claim. Each manual closes only on a looked-at screenshot, side-by-side via `_cmp.cjs`, per manual, EN. Four screenshot gates, not one aggregate. L3 carries tables, glossary, footnotes with no block type; its visual gate is the one most likely to expose silent fidelity loss.

## Open Question the panel would paper over

The promotion script does a destructive overwrite of live locale rows. What is the rollback. If a promote lands a bad block on prod, is there a captured pre-image to restore, or is the prior prod state gone. No AC names recovery. I will not pass a destructive effect with no named undo.

The Light endures. The Council holds. The Legion serves.
