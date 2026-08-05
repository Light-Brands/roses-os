# Plan 006 — German language

## M1 — Language registry + PDF wiring (code)
covers: S1-lang-registry, S2-pdf-wiring

- T-001: Add `de` to `ManualLanguage` union + `MANUAL_LANGUAGES` (label "Deutsch") in `src/lib/manuals/types.ts`.
- T-002: Add `de` to `Locale` union + `LOCALES` (label "Deutsch") in `src/lib/i18n/types.ts` and to the persisted-locale whitelist in `src/lib/i18n/context.tsx`.
- T-003: Add `de` label builder + `de` paths (L1/L2/L3 + Teachers-Aid) in `src/lib/data/manual-pdf-paths.ts`; add `de: 'DE'` to `LANG_CODE` in `src/lib/manuals/pdf-map.ts`.
- T-004: Add `de` to the pipeline-script locale arrays (`generate-translated-student-manuals.ts`, `generate-translated-teachers-aid.ts`, `build-manual-translation-maps.mjs`, `import-manuals-to-blocks.ts`).

## M2 — Teaching pages German (content)
covers: S3-teaching-content

- T-005: Generate `src/content/teaching/de.json` from `en.json` via `scripts/translate-json.mjs --name German`.
- T-006: Assert deep key-parity de.json vs en.json; live-load `/teaching/level-1` under `de`.

## M3 — Manual editor blocks German (content, staging)
covers: S4-manual-blocks

- T-007: For each manual (L1, L2, L3, aura-level-1): `extract-translatable` (en) -> `translate-mt --to de` -> `stage-translation --to de` into the `__staging` lanes.
- T-008: Verify staged counts match the English source per manual; assert zero residual-English on headings; image src untouched.

## M4 — Designed PDFs German (assets)
covers: S5-designed-pdfs, S6-teachers-aid-pdf

- T-009: Add a `de` block to `student-manual-translations.json` via `build-manual-translation-maps.mjs`; generate `roses-manual-{1,2,3}-de.html`; render `Rose-Level-{1,2,3}-Manual-DE.pdf`.
- T-010: Generate `roses-teachers-aid-de.html` + render `ROSES-OS-Teachers-Aid-DE.pdf` via the downscaled-image Playwright pipeline (external-blockable on the 96MB wall).

## M5 — German native review (gate before prod promotion)
covers: S7-native-review

- T-011: A German-fluent reviewer reviews the generated German; findings recorded; only approved content is promoted staging -> prod.
