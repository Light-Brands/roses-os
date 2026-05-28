# Mockup iterations log

Spec: `001-richer-block-editor` for `Light-Brands/roses-os`. Phase 4.5 mockup deliberation between Kaze and Sally synthesized by Quinn.

## Iter 01 — 2026-05-28T18:00Z

**Sources synthesized:** Kaze design notes at `../.deliberation/mockup/kaze-design-notes.md` (or `_qie/specs/_panel-runs/editor-richer-blocks-20260528-175200/mockup/kaze-design-notes.md`); Sally design notes at the matching `sally-design-notes.md`.

**Files written:** `index.html`, `styles.css`, `fixture.js`.

### Completion checklist against Section E

| Row | Status | Feel clause |
| --- | --- | --- |
| E.1 empty | OK | feel: the page already exists, the cursor breathes inside it, the silence reads as invitation, not error |
| E.1 loading | OK | feel: the save pill spins in mute-gold, the page does not flinch |
| E.1 populated × 1 | OK | feel: a single eyebrow-heading on the page feels honored, not lonely |
| E.1 populated × ~50 | OK | feel: the canvas holds rhythm, the corner-frames ghost behind the long scroll, never compete |
| E.1 populated × ~5000 | OBSERVED-GAP | feel: not depicted directly; the ~200 variant carries a "Virtual scroll planned at AC11 budget" tail. AC11's 800ms preview budget is the contract at scale; the mockup signals it but does not exercise it |
| E.1 error · validation | OK | feel: the failed block lifts and gains a terracotta ring, the page keeps holding, the inline message reads as a hand on a shoulder |
| E.1 error · conflict | OK | feel: a top-of-canvas strip names the other editor, the author keeps typing while they read |
| E.1 error · permission | OK | feel: the page steps back and explains, no modal, no fear, one path forward |
| E.2 mobile (375px) | OK | feel: a calm gold banner names the constraint, no broken layout, no shame |
| E.2 desktop (1280+) | OK | feel: three vertical zones, the canvas takes the center the way a page takes a hand |
| E.3 wired interactions | OK | drag handle toggle on click + Space, locale chip aria-pressed toggle, remove × fade-out, add-gap + reveals on hover, conflict-banner Refresh dismisses, palette entry dragstart sets dataTransfer |
| E.4 affordance cues | OK | drag glyph hidden at rest visible on block hover, chevron not yet (section blocks not in fixture v01), X for remove visible on hover, add-gap + reveals on hover, hover-revealed locale dot |
| E.5 a11y | OK | focus rings via outline-offset on every interactive primitive, role=toolbar/article/alert/status, aria-live polite/assertive, 44px touch targets on palette + locale chips + buttons, prefers-reduced-motion disables save-pill spin, prefers-color-scheme dark swaps bone/cream/ink tokens |

### Free-form pass (Kaze + Sally synthesized by Quinn)

What is alive on the mockup: the corner-frame ghost on the canvas honors Kaze's load-bearing find without making it a block; the Brand Wall palette names blocks after the canon pattern (Spoken instruction, Numbered exercise) so the author recognizes the page they saw it on; Sally's three vertical zones land cleanly at 1280+, the preview pane scales the page-template at 60% so the author sees the canon proportion as they type; the save pill states (dirty / saving / saved / error) thread the canvas without pulling the eye; the empty state honors the silence-as-affordance rule with no skeleton, no illustration, no CTA button.

What is dead: the small-volume state currently shows just one block on a vast page; the page-fill rhythm in the Aura canon comes from multiple blocks holding each other, so a single block reads slightly orphaned. Acceptable for AC verification; revisit if Dario flags. The Spanish-locale partial-coverage dot is currently mute-gold but does not yet show a hover-tooltip naming the count (Sally's `12 of 38 blocks`); deferred to iter 2 if requested.

One cut prescribed before iter 2: the volume-tail copy ("Showing 18 of 50 blocks for mockup density") betrays the seam. In the real editor the count is meaningful (locale-gap density signal). In the mockup it reads as scaffolding. Either drop it or rewrite as a real locale-gap aside.

### Affordance grep audit

For each AC verb in `spec.md`, the mockup contains a discrete visual indicator:

- **click** on palette entry → cursor: grab; glyph visible at left; `dragstart` wired
- **toggle** on save-pill state → `data-state` attribute drives color + indicator shape, all four states reachable from the state-nav
- **open / close** of conflict banner → `is-visible` class, Refresh button dismisses
- **expand / collapse** on section block → CHEVRON not yet (section block out of iter 01 fixture); flagged for iter 2 when two-column-section gains the chevron handle
- **dismiss** on error inline → X on block hover removes locally; conflict banner Refresh dismisses
- **drag** on block → 6-dot grip glyph visible on hover, focusable, Space toggles `is-grabbed` class
- **hover** on add-gap → + glyph reveals at 120ms

MISSING-CUE: section block chevron. Flagged for iter 2 if Dario approves the rest.

### Serve

Local server command:

```
node -e "const http=require('http'),fs=require('fs'),path=require('path');const root='clients/light-brands/.worktrees/roses-os--s-202605281726-5f6673/specs/001-richer-block-editor/mockups';http.createServer((req,res)=>{const f=path.join(root,req.url==='/'?'/index.html':req.url);fs.readFile(f,(e,d)=>{if(e){res.writeHead(404).end();return;}const t=f.endsWith('.html')?'text/html':f.endsWith('.css')?'text/css':f.endsWith('.js')?'text/javascript':'application/octet-stream';res.writeHead(200,{'content-type':t+'; charset=utf-8'}).end(d);});}).listen(4180,'127.0.0.1');"
```

URL: http://127.0.0.1:4190/ (port 4180 and 4185 were already taken by stale mockup servers; bumped to 4190).

## Approved — 2026-05-28T18:38Z

**Dario:** "Aprobado as-is, seguimos a Phase 5."

**Final iter:** 1.

**Mockup files frozen at:** `./index.html`, `./styles.css`, `./fixture.js`.

**Honest note for /develop:** the fixture copy ("EXERCISE FOUR / Cleansing the energy field / I clear my field of what is not mine") is invented in-domain per `[[feedback_mockup_data_hygiene]]`, not lifted from the Aura PDF. The VISUAL treatment (eyebrow caps, outsize numeral, spoken-instruction marker, two-column figure, callout, corner-frames) IS the binding contract. /develop's implementation honors the visual; real manual text comes from Supabase rows on the live editor.

**Carry-forward to /develop:** every visible affordance in the approved mockup is binding for the implementation. T-040 ("block palette redesign as Brand Wall") and the per-block tasks in M3 cite `./index.html` as the visual contract. Tasks reference the mockup live URL until the editor itself reaches a /develop milestone where the surface is real.

