# Winston review — roses-os: site-ready, all manuals

Faculty: system architecture. Mode: UPDATE of an existing decision log (head D-17).

## 1. What problem is this actually solving

Three of the four manuals exist in production as low-fidelity legacy rows or English-duplicated locale rows. The new deterministic-geometry engine reconstructs L1 faithfully but is wired to one manual by a hardcoded driver, and the translation step ran once by hand. The real problem is operational: turn a proven-on-L1 engine into a corpus-wide, idempotent, one-command pipeline that reaches staging for every manual and language without a human babysitting it, while keeping production untouched until a human signs.

## 2. The smallest first version that proves the idea

Generalize the L1 driver to `--manual <slug>` and run L2 EN end to end to staging. If one slug change reconstructs L2 EN faithfully with zero new engine code, the "engine is general, driver is not" claim is proven and the rest is repetition plus the L3 table rule.

## 3. Three risks that would kill this

1. **L3 net-new structure handled as a page patch.** The table on page 9 is the one structure with no block type. If it is special-cased per page, D-13 breaks and the corpus rots. Grounded below: it is a general rule over fill-rect geometry.
2. **The headless bot writing prod.** Promotion is a destructive overwrite of live locale rows. If the promotion executor can reach prod from the anon-key headless run, one bad flag corrupts a live manual. The contract forbids it; the architecture must enforce it (anon-key-only, prod connection absent from the run).
3. **MT silently shipping machine Greek/Russian/Ukrainian to readers.** Without a held-for-native-review marker carried as data, el/ru/uk look promotable and someone promotes them.

## 4. Success at 90 days

All four manuals reconstructed and staged in EN; L2/L3/Aura machine-translated to all six languages and staged; en/es/pt promotable, el/ru/uk staged and visibly held; promotion run by Dario per manual+language as a one-transaction command with a dry-run; issues #596/#597/#598 closed. No prod write ever came from the bot.

## 5. Atomic tasks (mapped to the three cohorts)

**Reconstruction EN:** (a) commit the uncommitted L1 baseline; (b) generalize driver to `--manual <slug>` with per-manual render metadata; (c) add the L3 table block type to CHECK then registry then TS (D-2 order); (d) add the deterministic table rule from row fill-rules plus aligned x-columns; (e) reconstruct L2/L3/Aura EN to staging; (f) verify fidelity with `_cmp.cjs`.

**Translation:** (g) wire the MT call to the `source.json -> translations.<lang>.json` contract; (h) stage pt/el/ru/uk for L2/L3/Aura; (i) stamp el/ru/uk held-for-native-review; (j) verify zero residual EN per the L2-es method.

**Promotion + cierre:** (k) build the promotion executor (D-8) staging-to-staging only, one transaction, child-ref remap, `--dry-run`, per manual+language, signer NOT-NULL; (l) verify the two human gates are named, run #596/#597/#598 checks, leave prod untouched.

## 6. The one thing only my faculty noticed

I probed the real L3 PDF. The production driver records `constructPath -> fill` but DROPS `stroke`. I expected table grids to be strokes and the driver to be blind to them. They are not: every L3 table rule (page 2 contents, page 9 table) is a thin FILLED rectangle the driver already captures. Page 9 is a true table because its row fills split at a cell wall (x=322) and its text aligns to fixed x-columns. There are NO footnotes anywhere in L3 (every small-font run is a letter-spaced section eyebrow or running furniture), and the page-11 "glossary" is a two-column term list D-16 already renders. So the L3 unknown collapses to ONE general table rule over geometry the engine already extracts, not three new block types and not a stroke-capture change. That reframes the long pole as small.
