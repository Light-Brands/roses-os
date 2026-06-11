/**
 * Figure pixel extraction for the manual reconstruction pipeline (spec 003
 * T-FIG, AC3 + AC9; decision D-11). Figures come from the PDF, never a model box.
 *
 * Two pixel paths, both keyed on the deterministic operator-list rect:
 *   - Path (a), native resolution: the browser driver already decoded the
 *     embedded XObject via `page.objs.get(objId)` and handed back a PNG dataUrl
 *     at the image's native resolution. `saveNativePng` writes those bytes.
 *   - Path (b), pure-node fallback: when the native decode did not resolve,
 *     `cropFromRaster` crops the page raster (rendered by render-canon-pages.mjs)
 *     by the exact rect via sharp. No canvas dependency.
 *
 * AC9 fallback for a figure that is vector art (a path-paint cluster with no
 * covering image XObject): `vectorArtCrop` produces a deterministic raster crop
 * of the cluster's operator-geometry bounds, or flags it for the human-upload
 * path of spec 002 OQ1 with the rect as the crop hint. A figure rect never comes
 * from a model coordinate under any branch.
 *
 * The pure rect math and hashing carry no `sharp` import so they run anywhere;
 * the raster crop lazy-imports sharp inside the node-only function.
 */

import type { Rect, FigureRegion } from './extract-geometry';

/** An integer pixel crop box on a raster, top-left origin. */
export interface PixelCrop {
  left: number;
  top: number;
  width: number;
  height: number;
}

/**
 * Map a PDF-point rect to an integer pixel crop on a raster of the same page,
 * clamped to the raster bounds. Deterministic: the same rect and raster size
 * always yield the same crop. `width`/`height` are floored to at least 1.
 */
export function rectToRasterCrop(
  rect: Rect,
  pageWidthPt: number,
  pageHeightPt: number,
  rasterWidth: number,
  rasterHeight: number,
): PixelCrop {
  const sx = rasterWidth / pageWidthPt;
  const sy = rasterHeight / pageHeightPt;
  const left = Math.max(0, Math.min(rasterWidth - 1, Math.round(rect[0] * sx)));
  const top = Math.max(0, Math.min(rasterHeight - 1, Math.round(rect[1] * sy)));
  const right = Math.max(left + 1, Math.min(rasterWidth, Math.round(rect[2] * sx)));
  const bottom = Math.max(top + 1, Math.min(rasterHeight, Math.round(rect[3] * sy)));
  return { left, top, width: right - left, height: bottom - top };
}

/** FNV-1a 64-ish hash over raw bytes, rendered as 16 hex chars. Pure; identical
 *  in node and browser. Used to key the per-region classification cache on the
 *  figure's actual pixel bytes (AC6). */
export function hashBytes(bytes: Uint8Array): string {
  // Two interleaved 32-bit FNV-1a lanes give a 64-bit-ish digest without BigInt.
  let h1 = 0x811c9dc5;
  let h2 = 0x811c9dc5 ^ 0x9e3779b9;
  for (let i = 0; i < bytes.length; i++) {
    const b = bytes[i];
    h1 = Math.imul(h1 ^ b, 0x01000193);
    h2 = Math.imul(h2 ^ ((b + i) & 0xff), 0x01000193);
  }
  const hex = (n: number) => (n >>> 0).toString(16).padStart(8, '0');
  return hex(h1) + hex(h2);
}

/** Decode a `data:image/png;base64,...` dataUrl to raw bytes. */
export function decodeDataUrl(dataUrl: string): Uint8Array {
  const comma = dataUrl.indexOf(',');
  const b64 = comma >= 0 ? dataUrl.slice(comma + 1) : dataUrl;
  return Uint8Array.from(Buffer.from(b64, 'base64'));
}

export interface FigurePixelResult {
  /** Output PNG path written, relative to the run output dir. */
  file: string;
  /** Which path produced the pixels. */
  via: 'native-xobject' | 'raster-crop' | 'vector-raster-crop';
  /** Hash of the written pixel bytes; feeds the region cache key. */
  pixelsHash: string;
  naturalWidth: number;
  naturalHeight: number;
}

/** Path (a): persist the native-resolution PNG the browser already decoded from
 *  the embedded XObject. Node-only (writes a file). */
export async function saveNativePng(
  dataUrl: string,
  outDir: string,
  fileName: string,
  naturalW: number,
  naturalH: number,
): Promise<FigurePixelResult> {
  const fs = await import('fs');
  const path = await import('path');
  const bytes = decodeDataUrl(dataUrl);
  const outPath = path.join(outDir, fileName);
  fs.writeFileSync(outPath, bytes);
  return { file: fileName, via: 'native-xobject', pixelsHash: hashBytes(bytes), naturalWidth: naturalW, naturalHeight: naturalH };
}

/** Path (b): pure-node crop of the page raster by the exact operator-list rect.
 *  Lazy-imports sharp so the pure helpers above stay browser-safe. */
export async function cropFromRaster(
  rasterPath: string,
  rect: Rect,
  pageWidthPt: number,
  pageHeightPt: number,
  outDir: string,
  fileName: string,
  via: 'raster-crop' | 'vector-raster-crop' = 'raster-crop',
): Promise<FigurePixelResult> {
  const sharpMod = (await import('sharp')).default;
  const path = await import('path');
  const fs = await import('fs');
  const meta = await sharpMod(rasterPath).metadata();
  const rw = meta.width ?? 0;
  const rh = meta.height ?? 0;
  const crop = rectToRasterCrop(rect, pageWidthPt, pageHeightPt, rw, rh);
  const outPath = path.join(outDir, fileName);
  await sharpMod(rasterPath).extract(crop).toFile(outPath);
  const bytes = Uint8Array.from(fs.readFileSync(outPath));
  return { file: fileName, via, pixelsHash: hashBytes(bytes), naturalWidth: crop.width, naturalHeight: crop.height };
}

/** AC9: a vector-art figure (no XObject) is cropped from the page raster by its
 *  computed operator-geometry bounds, a deterministic rect, never a model box.
 *  This is `cropFromRaster` tagged as a vector crop; the rect is the cluster's
 *  bounds the browser walk produced. When the bounds are too ambiguous to crop,
 *  the caller routes the region to the human-upload path with the rect as hint
 *  (see `flagForHumanUpload`). */
export async function vectorArtCrop(
  rasterPath: string,
  rect: Rect,
  pageWidthPt: number,
  pageHeightPt: number,
  outDir: string,
  fileName: string,
): Promise<FigurePixelResult> {
  return cropFromRaster(rasterPath, rect, pageWidthPt, pageHeightPt, outDir, fileName, 'vector-raster-crop');
}

/** A figure flagged for the spec-002 OQ1 human-upload path: the rect is carried
 *  as the crop hint, no pixels are invented, and `src` stays empty until a human
 *  uploads. AC9's "or flagged for the human-upload path, never by a model box." */
export interface HumanUploadFlag {
  flagged: true;
  reason: string;
  cropHint: Rect;
}

export function flagForHumanUpload(region: FigureRegion, reason: string): HumanUploadFlag {
  return { flagged: true, reason, cropHint: region.rect };
}

/**
 * Choose the pixel path for a figure region. Native XObject PNG is primary (path
 * a) when the browser decoded one; otherwise the deterministic raster crop (path
 * b). Vector-art regions (no objId) route to the vector crop. The rect always
 * comes from the operator list; no branch consults a model.
 */
export async function extractFigurePixels(args: {
  region: FigureRegion;
  nativePng: { dataUrl: string; naturalW: number; naturalH: number } | null;
  rasterPath: string;
  pageWidthPt: number;
  pageHeightPt: number;
  outDir: string;
  fileName: string;
}): Promise<FigurePixelResult> {
  const { region, nativePng, rasterPath, pageWidthPt, pageHeightPt, outDir, fileName } = args;
  if (region.source === 'xobject' && nativePng && nativePng.dataUrl) {
    return saveNativePng(nativePng.dataUrl, outDir, fileName, nativePng.naturalW, nativePng.naturalH);
  }
  if (region.source === 'vector') {
    return vectorArtCrop(rasterPath, region.rect, pageWidthPt, pageHeightPt, outDir, fileName);
  }
  // XObject whose native decode did not resolve -> pure-node raster crop fallback.
  return cropFromRaster(rasterPath, region.rect, pageWidthPt, pageHeightPt, outDir, fileName);
}
