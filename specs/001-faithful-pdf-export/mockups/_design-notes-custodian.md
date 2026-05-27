# Design notes — Custodian (audit, observability, data shape)

Augmenting Kaze (rhythm, typography) and Sally (state machine, WCAG). My lane: the audit-trail line in the menu, per-state data-shape rules, the trust signal.

## Per-state data-shape rules

One bullet per state. What the user-facing element must surface, what it must not.

- **idle.** Show: active language line ("English from your edits"), a quiet route-health dot (see trust signal). Hide: tier name, template version, hashes, span IDs, Sentry references. The menu at rest is silent about machinery.

- **requesting.** Show: button disabled, language line still visible. Hide: tier negotiation, route latency, any "calling Sentry" or "boot chromium" string. The user is not a sysadmin.

- **rendering.** Show: indeterminate spinner; after 3s, elapsed-time text in seconds. Hide: `chromium.boot.ms`, span trace IDs, internal phase names. The elapsed counter is the only quantitative signal.

- **downloading.** Show: language line plus a small tier tag ("live from your edits") rendered as plain language, not the literal `X-PDF-Tier` value. Hide: PRINT_TEMPLATE_VERSION (it lives in PDF metadata, retrievable via `pdfinfo`; the menu does not surface it).

- **failed-runtime.** Show: a one-line explanation in plain language naming the next step the menu will take ("Live render did not return; serving the 2022 print original"). Hide: error codes (`CHROMIUM_LAUNCH_FAILED` etc), stack frames, Sentry event IDs. Operator-facing detail flows to Sentry; the teacher sees the consequence.

- **fallback-static.** Show: the label "2022 print original" (D-010 honored by name, not by hash). Hide: the SHA256 hash itself, the file path `public/manuals/pdf/...`, the word "fallback". "Original" is honest and dignified; "fallback" implies failure attribution the teacher should not carry.

- **fallback-html.** Show: "Browser-printed version of your edits" plus a quiet note that rhythm may differ from the live render. Hide: `blocksToHtml` internals, blob URL, the word "blob".

## Audit-trail line

The Download menu carries one user-visible tier descriptor placed under the language line, in the same quiet weight. Three plain-language values, one per served tier:

- runtime served: "Live from your edits"
- static served: "2022 print original"
- blob served: "Browser-printed from your edits"

The line appears in the downloading, failed-runtime, fallback-static, and fallback-html states. It is absent in idle/requesting/rendering because no tier has resolved yet. The mockup marks this line explicitly as the audit slot; /develop must preserve copy and position verbatim.

## Trust signal

One element. A 6px dot at the menu's lower-left corner, in the muted-warm palette. Green when the last successful runtime render on this manual happened within 24h. Amber when older. Tooltip on hover names the exact time. No noise, no badge, no number. The dot is the only ambient health surface; everything else routes to Sentry.

## Feel verdict (Section E.6, audit dimension)

When transparency works without being loud, the menu feels like a librarian: it knows which edition it is handing you, it says so in one quiet line, and it does not narrate the catalog system.
