# Context packet: deterministic extraction geometry

**Run:** deterministic-extraction-geometry-20260531 (offline, strict-local, roses-os worktree)
**Refines:** 002-faithful-content-reconstruction, milestone M1, step E2.

## The trigger

The M1 extraction sample (`scripts/reconstruct-l1-sample.ts`) asks Gemini 2.5-pro for per-block bounding boxes from a page raster, then crops figures by them. Observed this session on Rose Meditation Level 1: boxes too large (swallow body text), too small or offset (cut the meditating figure to legs and torso), mislocated (a decorative-flower box cropped the TOC words "Cleanse &"). Every prompt tweak fixed one page and regressed another. Root cause: box behavior is a page-global, non-deterministic estimate, and the page already carries the exact coordinates as data.

## The thesis taken to panel

Separate "what is it" from "where is it / what does it look like". pdf.js reads the exact text runs and the exact embedded image rects and pixels (deterministic). The model only classifies pre-extracted regions into the 18 v2 block types, never producing a coordinate.

## Panel

- Amelia (Senior Developer): empirical probe on the real PDF. See `reviews/amelia-review.md`.
- Winston (System Architect, architecture-author): the decision record D-11 plus D-12. See `reviews/winston-review.md`.
- Custodian, Edut, Mar'ah: channeled by Quinn into the per-region cache (idempotency), the visual-verification gate (the honesty lesson), and the fidelity-is-human framing.

## Honesty lesson that became AC10

This session shipped a side-by-side preview and claimed it worked from data alone (every block valid) without looking at the render. It was broken (clipped figures, fragmented cover). AC10 makes the screenshot-and-look step a gate: a data-only validity claim does not close a slice.

## Constraints inherited from spec 002 (unchanged)

D-1 (discriminated-union blocks, `validateBlockInput` write gate), D-5 (staging lane), D-7 (recipe-as-authority idempotency), D-9 (18 types). The change is internal to E2; E3 validation, the recipe authority, the staging lane, promotion, and the scale to other manuals are untouched.
