#!/usr/bin/env bash
# Re-run reconstruct -> stage EN -> extract -> translate+stage (5 langs) for a manual,
# now with the contents-pagenum fix + figures externalized to public/ on write.
set -u
M="$1"
echo "=== $M : reconstruct (clean) ==="
npx tsx scripts/reconstruct-geometry.ts --manual "$M" 2>&1 | grep -E "blocks:|externalized|error" | tail -3
echo "=== $M : stage EN ==="
npx tsx scripts/stage-reconstruction.ts --manual "$M" --input "_qie-output/roses-os/reconstruction/$M-en/editor-blocks.json" --run-id "recon-$M-geometry" 2>&1 | grep -E "Upserted|staging lane now|remapped" | tail -2
echo "=== $M : extract source from staging EN ==="
npx tsx scripts/extract-translatable.ts --manual "${M}__staging" --out "_qie-output/roses-os/translation/$M-en/source.json" 2>&1 | grep -E "pulled|extracted|FATAL" | tail -2
for L in es pt; do
  npx tsx scripts/translate-mt.ts --manual "$M" --to "$L" 2>&1 | grep -oE "wrote [0-9]+ entries|FATAL.*" | head -1
  npx tsx scripts/stage-translation.ts --manual "$M" --to "$L" --run-id "translate-$M-$L" 2>&1 | grep -oE "inserted [0-9]+ blocks|coverage incomplete" | head -1
done
for L in el ru uk; do
  npx tsx scripts/translate-mt.ts --manual "$M" --to "$L" 2>&1 | grep -oE "wrote [0-9]+ entries|FATAL.*" | head -1
  npx tsx scripts/stage-translation.ts --manual "$M" --to "$L" --run-id "held-native-review-${M}-$L" 2>&1 | grep -oE "inserted [0-9]+ blocks|coverage incomplete" | head -1
done
echo "=== $M : DONE ==="
