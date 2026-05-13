# Brand Quick-Reference

> A one-page card for the fundamentals. For the full identity, see [`brand-dna.md`](./brand-dna.md) and the in-progress [110-page brand book](../project-plan-for-designer-brand-book.md).

---

## Essence

> The Operating System of Remembrance — spiritual-modern consciousness technology that restores inner symmetry and coherence. Not a self-improvement brand. An operating system of coherence — where intuition becomes precise and presence becomes sovereign.

*Source: [`README.md`](../../README.md)*

---

## Logo & emblem — four directions

The live site currently uses a raster mark (`/public/rose.png`) plus a sans-serif lockup. No vector identity exists. Each concept below is **grounded in something already on the site** — the concentric-petal SVG in [`SectionDivider`](../../src/components/ui/SectionDivider.tsx) (variant `rose`), the 3D bloom in [`RoseModel.tsx`](../../src/components/three/RoseModel.tsx) (petal `#D94060`, stem `#2D5E34`, gold rim light `#9E956B`), and the "remember who you are" tone of the hero.

### A. Concentric Bloom

<svg viewBox="0 0 160 170" width="160" height="170" xmlns="http://www.w3.org/2000/svg">
  <g fill="none" stroke="#9C6F6E" stroke-linecap="round" stroke-linejoin="round">
    <path d="M 80 54 C 80 54 48 66 48 86 C 48 101.6 62.4 110 80 110 C 97.6 110 112 101.6 112 86 C 112 66 80 54 80 54 Z" stroke-width="0.8" opacity="0.3"/>
    <path d="M 80 42 C 80 42 56 54 56 74 C 56 87.2 66.8 98 80 98 C 93.2 98 104 87.2 104 74 C 104 54 80 42 80 42 Z" stroke-width="1" opacity="0.5"/>
    <path d="M 80 30 C 80 30 64 46 64 62 C 64 70.8 71.2 78 80 78 C 88.8 78 96 70.8 96 62 C 96 46 80 30 80 30 Z" fill="#9C6F6E" stroke="none" opacity="0.75"/>
    <circle cx="80" cy="70" r="2.8" fill="#9E956B" stroke="none"/>
  </g>
  <text x="80" y="140" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="11" fill="#3F3E3C" letter-spacing="5">INTERNATIONAL AURA SCHOOL</text>
</svg>

*Direct evolution of the site's existing `SectionDivider variant="rose"` — three nested petal teardrops fanning downward, gold seed at the heart. Already part of the visual vocabulary; the emblem just clarifies and crowns it.*

### B. Aura-Wrapped Bloom

<svg viewBox="0 0 160 170" width="160" height="170" xmlns="http://www.w3.org/2000/svg">
  <circle cx="80" cy="70" r="56" fill="none" stroke="#9E956B" stroke-width="0.5" opacity="0.55"/>
  <g fill="none" stroke="#9C6F6E" stroke-linecap="round" stroke-linejoin="round">
    <path d="M 80 54 C 80 54 48 66 48 86 C 48 101.6 62.4 110 80 110 C 97.6 110 112 101.6 112 86 C 112 66 80 54 80 54 Z" stroke-width="0.8" opacity="0.3"/>
    <path d="M 80 42 C 80 42 56 54 56 74 C 56 87.2 66.8 98 80 98 C 93.2 98 104 87.2 104 74 C 104 54 80 42 80 42 Z" stroke-width="1" opacity="0.5"/>
    <path d="M 80 30 C 80 30 64 46 64 62 C 64 70.8 71.2 78 80 78 C 88.8 78 96 70.8 96 62 C 96 46 80 30 80 30 Z" fill="#9C6F6E" stroke="none" opacity="0.75"/>
    <circle cx="80" cy="70" r="2.8" fill="#9E956B" stroke="none"/>
  </g>
  <text x="80" y="150" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="11" fill="#3F3E3C" letter-spacing="5">INTERNATIONAL AURA SCHOOL</text>
</svg>

*A. enclosed by a single thin gold ring — the rim-light halo from the 3D scene made explicit. Reads as "bloom within its own field of presence." Most directly says aura + rose; slightly less quiet than A.*

### C. Serif Wordmark Lockup

<svg viewBox="0 0 280 130" width="280" height="130" xmlns="http://www.w3.org/2000/svg">
  <g font-family="Georgia, 'Times New Roman', serif" fill="#3F3E3C">
    <text x="140" y="52" text-anchor="middle" font-size="17" letter-spacing="8">INTERNATIONAL</text>
    <line x1="50" y1="66" x2="230" y2="66" stroke="#9E956B" stroke-width="0.5"/>
    <circle cx="140" cy="66" r="2.5" fill="#9E956B"/>
    <text x="140" y="92" text-anchor="middle" font-size="17" letter-spacing="8">AURA · SCHOOL</text>
  </g>
</svg>

*Typography-only. Quiet, formal, print-first. The Cormorant Garamond serif voice already drives the hero — this is the masthead version. Sacrifices any icon; pairs naturally with A, B, or D for full lockups.*

### D. Side-View Rose

<svg viewBox="0 0 160 170" width="160" height="170" xmlns="http://www.w3.org/2000/svg">
  <g fill="none" stroke-linecap="round" stroke-linejoin="round">
    <line x1="80" y1="58" x2="80" y2="112" stroke="#2D5E34" stroke-width="1.6"/>
    <path d="M 80 88 Q 96 86 102 100 Q 94 98 80 96" stroke="#2D5E34" stroke-width="1.2" fill="none"/>
    <path d="M 70 60 L 80 52 L 90 60" stroke="#2D5E34" stroke-width="1.2"/>
    <path d="M 62 40 C 62 22 72 14 80 16 C 88 14 98 22 98 40 C 98 54 90 60 80 60 C 70 60 62 54 62 40 Z" stroke="#9C6F6E" stroke-width="1.5" fill="#9C6F6E" fill-opacity="0.12"/>
    <path d="M 72 38 C 72 28 80 26 80 30 C 80 26 88 28 88 38 C 88 46 84 50 80 50 C 76 50 72 46 72 38 Z" stroke="#9C6F6E" stroke-width="1.2" fill="none"/>
    <path d="M 76 36 Q 80 32 84 36 Q 82 42 80 42 Q 78 42 76 36 Z" stroke="#9C6F6E" stroke-width="1" fill="#9E956B" fill-opacity="0.5"/>
  </g>
  <text x="80" y="150" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="11" fill="#3F3E3C" letter-spacing="5">INTERNATIONAL AURA SCHOOL</text>
</svg>

*Botanical profile — closed rose bud, calyx, leaf, stem in the 3D model's forest green (`#2D5E34`). Most literal echo of the live `RoseCanvas`. Sacrifices the abstract-symbol read; gains warmth and direct lineage to what's on screen.*

> **How to choose:** A is the safest evolution (the divider grown up). B says "aura" most clearly. C is the formal wordmark to pair with any icon. D is the botanical-portrait route closest to the 3D scene. A printed lockup will likely combine one of A / B / D with C.

---

## Colors — primary palette

| Swatch | Name | Hex | Role |
|---|---|---|---|
| <svg width="28" height="20"><rect width="28" height="20" fill="#F7F5F2" stroke="#3F3E3C" stroke-width="0.5"/></svg> | Aura White | `#F7F5F2` | Primary background |
| <svg width="28" height="20"><rect width="28" height="20" fill="#9C6F6E"/></svg> | Rose Clay | `#9C6F6E` | Signature — the field, not the accent |
| <svg width="28" height="20"><rect width="28" height="20" fill="#3F3E3C"/></svg> | Soft Charcoal | `#3F3E3C` | Body text, dark UI |
| <svg width="28" height="20"><rect width="28" height="20" fill="#9E956B"/></svg> | Antique Olive Brass | `#9E956B` | Gold accent — *earned*, not decorative |
| <svg width="28" height="20"><rect width="28" height="20" fill="#C7AE8C"/></svg> | Honeyed Stone | `#C7AE8C` | Warm neutral support |
| <svg width="28" height="20"><rect width="28" height="20" fill="#EBD6C1"/></svg> | Peach Sand | `#EBD6C1` | Light section backgrounds |
| <svg width="28" height="20"><rect width="28" height="20" fill="#F5E8E2"/></svg> | Golden Ether | `#F5E8E2` | Warm blush; pairs with gold |

*Full scales (rose 50–950, warm-neutral 0–950) live in [`src/design-system/tokens.ts`](../../src/design-system/tokens.ts).*

---

## Typography

| Role | Family | Weights | CSS var |
|---|---|---|---|
| Display, headlines, sacred text | **Cormorant Garamond** | 300, 400, 500, 600, 700 | `--font-serif` |
| Body, UI, navigation | **Inter** | 300, 400, 500, 600, 700 | `--font-sans` |
| Code | System mono | — | `--font-mono` |

Self-hosted in `/public/fonts/`. Loaded in [`src/app/layout.tsx`](../../src/app/layout.tsx).

**Pairing rule:** Serif for moments, sans for surfaces. Headings, pull-quotes, and ritual copy in Cormorant; everything else in Inter.

---

## Core tokens

- **Radius:** default `0.5rem`; full scale xs `0.125rem` → full `9999px`.
- **Spacing:** 8px grid (Tailwind defaults retained).
- **Shadows:** all warm-tinted off `rgb(59 47 47 / …)` — never cool grey shadows.
- **Easings:** `ease-smooth`, `ease-hover`, `ease-breathe`, `ease-sacred` — durations extend up to `1200ms` (`contemplative`) for meditative transitions.

*Defined in [`src/design-system/tokens.ts`](../../src/design-system/tokens.ts) and exposed as CSS variables in [`src/design-system/theme.css`](../../src/design-system/theme.css).*

---

## Voice

- **Contemplative, precise.** Short sentences. Period-driven cadence.
- **Lineage over self-help.** Use "remembrance," "coherence," "presence" — avoid "manifest," "level up," "hack."
- **Never hype.** No exclamation marks. No urgency. The reader arrives; they aren't sold to.

---

## Don'ts

- No glossy gradients, neon, or saturated brights — the palette is earthen.
- Gold (`#9E956B`) is **earned** — for emphasis, never decoration.
- No drop-shadows that read cool/blue — shadows are warm-rose.
- Don't pair Cormorant with another serif; don't pair Inter with another sans.

---

## Sources

- [`docs/brand/brand-dna.md`](./brand-dna.md) — master content (1900+ lines)
- [`docs/project-plan-for-designer-brand-book.md`](../project-plan-for-designer-brand-book.md) — full book in progress
- [`src/design-system/tokens.ts`](../../src/design-system/tokens.ts) — colors, radii, shadows, easings
- [`src/design-system/theme.css`](../../src/design-system/theme.css) — CSS variables
- [`src/app/layout.tsx`](../../src/app/layout.tsx) — font loading
- [`src/components/ui/Logo.tsx`](../../src/components/ui/Logo.tsx) — current logo component
