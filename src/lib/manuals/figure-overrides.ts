/**
 * Per-manual recipe figure-to-asset override map (decision D-24, spec 005 T-008).
 *
 * Two writers touch `manual_blocks`: the reconstruction pipeline and the editor
 * (D-7 makes the reconstruction the authority). A teacher who replaces a figure
 * in the editor writes the new `content.src` to the row — but the NEXT
 * reconstruction re-run rebuilds the row from `map(extract(canon), recipe)` and
 * clobbers the swap, because the recipe, not the row, is the authority of human
 * intent. This module is that recipe: a small per-manual map keyed by the same
 * stable `<page>:<ordinal>` anchor the provenance sidecar uses (see
 * `provenance.ts`), recording which figure asset a human chose. The
 * reconstruction merges it into the extracted `figureFiles` so the swap survives
 * a re-run.
 *
 * The human-touch marker (D-12, T-009) rides each override entry, so the
 * reconstruction and the D-18 promotion precheck can see a figure was replaced by
 * a person and carry it forward instead of treating it as machine output.
 */

/** Stable figure anchor: `<canon page>:<figure ordinal>`. Same shape as the
 *  provenance sidecar anchor, so an override and its provenance index off one
 *  coordinate. */
export function figureAnchorKey(page: number, ordinal: number): string {
  return `${page}:${ordinal}`;
}

/** One human-chosen figure asset, keyed by the (page, ordinal) anchor. */
export interface FigureOverride {
  /** The replacement asset path (e.g. `/uploads/upload-….png`). */
  src: string;
  /** D-12 human-touch marker: a person, not the pipeline, chose this asset. */
  human: boolean;
  /** Audit: who replaced it (PIN role / signer) and when (ISO 8601). */
  replaced_by?: string;
  replaced_at?: string;
}

/** The per-manual recipe map: anchor → override. Persisted per manual+language. */
export type FigureOverrideMap = Record<string, FigureOverride>;

/**
 * Merge the recipe overrides into the extracted `figureFiles` map for one page.
 * `figureFiles` maps a figure ordinal to its freshly extracted asset; any ordinal
 * with a human override on this page is replaced by the override `src`. Pure: a
 * new map is returned, the input is untouched. This is the single point where a
 * re-run honors human intent (D-24).
 */
export function applyFigureOverrides(
  figureFiles: Map<number, string>,
  overrides: FigureOverrideMap,
  page: number,
): Map<number, string> {
  const merged = new Map(figureFiles);
  for (const [anchor, ov] of Object.entries(overrides)) {
    const [p, o] = anchor.split(':').map((n) => Number(n));
    if (p === page && Number.isFinite(o) && ov.src) {
      merged.set(o, ov.src);
    }
  }
  return merged;
}

/** The anchors a human has touched, for the D-18 promotion precheck to carry
 *  forward (T-009). */
export function humanTouchedAnchors(overrides: FigureOverrideMap): string[] {
  return Object.entries(overrides)
    .filter(([, ov]) => ov.human)
    .map(([anchor]) => anchor);
}

/** Upsert a single override into the map (the write path the editor calls
 *  through). Returns a new map; marks the entry human-touched (T-009). */
export function withFigureOverride(
  overrides: FigureOverrideMap,
  page: number,
  ordinal: number,
  src: string,
  replacedBy: string,
  replacedAt: string,
): FigureOverrideMap {
  return {
    ...overrides,
    [figureAnchorKey(page, ordinal)]: { src, human: true, replaced_by: replacedBy, replaced_at: replacedAt },
  };
}
