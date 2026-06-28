/**
 * Fidelity-comparison scaffold (decision D-22, spec 005 T-015).
 *
 * Mar'ah named "matches the master" as the least-verifiable claim in the spec.
 * This makes it MEASURABLE instead of asserted: it renders the draft-from-blocks
 * PDF and the canonical hand-designed master, computes a per-page visual delta,
 * and gates any future convergence onto one Download button behind a signed bar.
 *
 * It is deliberately a scaffold, not a verdict. The pure core (per-page delta +
 * the convergence gate) is unit-tested here (`--selftest`). The rasterization
 * step (PDF -> per-page pixel buffers) is the operator's run: it needs the two
 * real PDFs and a rasterizer (Chrome / poppler `pdftoppm`), and on the Level-1
 * corpus the master is ~96MB of imagery, so it is run on the operator's machine,
 * not inside a strict-local /develop run.
 *
 * The convergence policy (D-22) recorded by this scaffold: the single-button
 * convergence of "Designed print original" and "Draft PDF from your edits" does
 * NOT ship until every page's delta clears `FIDELITY_BAR` AND a named human signs
 * off. Until then the two stay separate and labeled (T-013).
 */

/** Fraction of bytes that differ between two equal-length raster buffers, in
 *  [0, 1]. 0 = identical, 1 = every byte differs. Pure and deterministic. */
export function pixelDelta(a: Uint8Array, b: Uint8Array): number {
  if (a.length === 0 || a.length !== b.length) return 1;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) diff++;
  }
  return diff / a.length;
}

/** Per-page deltas for two equal-length lists of page rasters. A length mismatch
 *  (the draft has a different page count than the master) is itself a fidelity
 *  failure: the extra/missing pages report delta 1. */
export function perPageDelta(draft: Uint8Array[], master: Uint8Array[]): number[] {
  const n = Math.max(draft.length, master.length);
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    const d = draft[i];
    const m = master[i];
    out.push(d && m ? pixelDelta(d, m) : 1);
  }
  return out;
}

export interface ConvergenceVerdict {
  /** True only when every page clears the bar AND a signer is named. */
  converges: boolean;
  /** Pages whose delta exceeds the bar (0-based). */
  failingPages: number[];
  worstDelta: number;
  bar: number;
  signer: string | null;
  reason: string;
}

/**
 * The convergence gate (D-22). Convergence onto one Download button is permitted
 * only when EVERY page's delta is at or below `bar` and a human `signer` has
 * approved. A missing signer blocks convergence even at delta 0 — the bar is
 * human-owned, not a number the pipeline can clear by itself.
 */
export function convergenceGate(deltas: number[], bar: number, signer: string | null): ConvergenceVerdict {
  const failingPages = deltas.map((d, i) => (d > bar ? i : -1)).filter((i) => i >= 0);
  const worstDelta = deltas.length ? Math.max(...deltas) : 1;
  let reason: string;
  let converges = false;
  if (deltas.length === 0) {
    reason = 'no pages compared — nothing measured';
  } else if (failingPages.length > 0) {
    reason = `${failingPages.length} page(s) exceed the ${bar} bar (worst ${worstDelta.toFixed(3)})`;
  } else if (!signer) {
    reason = `all pages within ${bar} but no human signer — convergence is signer-gated (D-22)`;
  } else {
    converges = true;
    reason = `all pages within ${bar}, signed off by ${signer}`;
  }
  return { converges, failingPages, worstDelta, bar, signer, reason };
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function selftest(): void {
  let ok = 0;
  let fail = 0;
  const check = (name: string, cond: boolean) => {
    if (cond) { ok++; console.log(`  ok   ${name}`); }
    else { fail++; console.log(`  FAIL ${name}`); }
  };
  check('identical buffers -> delta 0', pixelDelta(new Uint8Array([1, 2, 3]), new Uint8Array([1, 2, 3])) === 0);
  check('fully different buffers -> delta 1', pixelDelta(new Uint8Array([0, 0]), new Uint8Array([1, 1])) === 1);
  check('half different -> delta 0.5', pixelDelta(new Uint8Array([1, 1, 1, 1]), new Uint8Array([1, 0, 1, 0])) === 0.5);
  check('length mismatch -> delta 1', pixelDelta(new Uint8Array([1]), new Uint8Array([1, 2])) === 1);
  const deltas = perPageDelta([new Uint8Array([1, 1])], [new Uint8Array([1, 1]), new Uint8Array([2, 2])]);
  check('page-count mismatch flags the missing page', deltas.length === 2 && deltas[0] === 0 && deltas[1] === 1);
  check('gate blocks when a page exceeds the bar', convergenceGate([0.0, 0.4], 0.1, 'Jen').converges === false);
  check('gate blocks within-bar but UNSIGNED', convergenceGate([0.0, 0.05], 0.1, null).converges === false);
  check('gate converges only when within-bar AND signed', convergenceGate([0.0, 0.05], 0.1, 'Jen').converges === true);
  check('empty comparison never converges', convergenceGate([], 0.1, 'Jen').converges === false);
  console.log(`\nFIDELITY-COMPARE SELFTEST: ${fail === 0 ? 'PASS' : 'FAIL'} (${ok} ok, ${fail} fail)`);
  if (fail > 0) process.exit(1);
}

const args = process.argv.slice(2);
if (args.includes('--selftest')) {
  selftest();
} else {
  console.log('fidelity-compare scaffold (T-015).');
  console.log('Pure core: pixelDelta, perPageDelta, convergenceGate (run --selftest to verify).');
  console.log('To MEASURE a real corpus: rasterize the draft PDF and the canonical master to');
  console.log('per-page pixel buffers (Chrome / poppler pdftoppm), then feed them to perPageDelta');
  console.log('and convergenceGate. Convergence onto one Download button is signer-gated (D-22):');
  console.log('a named human must approve the measured delta before the two outputs merge.');
}
