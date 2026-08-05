# Spec 006 — German review record (AC9 / T-011)

## German native review — verdict: PASS-WITH-FIXES (fixes applied)

A German-fluent review ran over all three surfaces (teaching `de.json`, the staged
manual-editor blocks, the student PDFs). Overall judgment: the German reads as
competent human-quality prose, not machine slop. One systemic glossary defect plus
consistency drift were found and swept before promotion.

### Findings and fixes applied
- **"Erdungskabel" → "Erdungsschnur"** (grounding cord was mistranslated as "cable"):
  13 occurrences across `de.json` + three staging lanes. Swept to zero — verified
  `Erdungskabel` = 0 in `de.json` and in all four staging `de` lanes; `Erdungsschnur`
  present (9 in de.json, 30 across staging).
- **Brand term unified to "Rosenmeditation"** (one word), replacing "Rosen-Meditation"
  and English "Rose Meditation" leftovers in German prose. The English legal `notice`
  boilerplate on manual covers keeps "Rose Meditation" as the modality's proper-noun
  brand token (deliberate; matches the student PDFs).
- **Register drift Sie→du** fixed in five L3 teaching slides + the aura closing section,
  to match the warm "du" voice of the rest of the corpus.
- Small fixes: "Kehlkopfchakra"→"Halschakra", "zum wohle Aller"→"zum Wohle aller",
  L3 heading capitalization, "Level N"→"Stufe N". "Halschakra" (throat) kept per house
  style (matches the hand-authored student PDFs).

38 staging rows patched (L1 15, L2 7, L3 11, aura 5), each read-back-verified.

## Council review (genesis-build Section V) — verdict: APPROVE

Four adversarial lenses, all APPROVE-WITH-NITS, no surviving blocker:
- **i18n correctness (Amelia):** every exhaustive locale site covered; de.json 231/231
  key-parity; PDFs resolve; no new tsc error in the diff; LanguageSelector auto-renders DE.
- **Security (Tamir):** no secret staged or committable; `.env.local` gitignored; German
  content written only via the guarded `__staging` path; model change inert. Nit: the
  `import-manuals-to-blocks.ts` enrollment of `de` was reverted (legacy unguarded seed).
- **Deploy/ordering (Winston):** prod renderer already serves every DE block type live
  (DE mirrors the es profile); DE image srcs are a strict subset of live paths (no 404);
  PDF filenames match; DE PDFs on par with peers; 0 unsigned staging rows.
- **Honesty (Edut):** content exists behind the switcher on every surface; MT-draft
  posture honestly labeled (PRÜFAUSGABE / REVIEW EDITION); prod lanes empty (gated).

## Known-partial, consistent with peers (not a DE regression)
The DE Teachers-Aid PDF carries ~9 English body paragraphs (Pink Rose Closure, Cosmic
circuit, upper-chakra locations, Golden-Rose cleansing). Verified identical in the
ES / PT / EL Teachers-Aids — this is a pre-existing gap in the Teachers-Aid translation
map (`generate-translated-teachers-aid.ts`) affecting all non-English languages equally.
The German Teachers-Aid is therefore exactly consistent with the other languages.
Follow-up (all languages, out of scope for this spec): complete the Teachers-Aid
translation map so no non-English Teachers-Aid ships English teaching paragraphs.

## AC6 count-matching note
Each staging lane's own in-lane `en` count (L1 101 / L2 147 / L3 69) is smaller than the
authoritative prod `en` (103 / 187 / 99). The German was count-matched to the **prod**
English (103 / 187 / 99 / aura 355), i.e. the corrected/authoritative source, not the
stale in-lane English. The intra-lane en≠de is expected, not a defect.

## Provenance
- Teaching `de.json`: Gemini `gemini-flash-latest` MT from `en.json`.
- Manual blocks: Gemini `gemini-flash-lite-latest` MT (flash-latest daily quota exhausted).
- Student PDFs: hand-authored German (Gemini quota-blocked mid-run), consistent terminology.
All are teacher-refinable drafts, the same posture as es/pt/el/ru/uk.
