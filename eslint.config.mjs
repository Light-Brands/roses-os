import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Tooling and build scripts — run via tsx/node, not part of the app bundle.
    // Still type-checked by `tsc` (pnpm type-check); ESLint's app-code rules
    // (no-explicit-any, no-require-imports for .cjs, etc.) don't apply here.
    "scripts/**",
    // Stale generic-template artifacts (see CLAUDE.md) — not real product code.
    "ai-workflows/**",
    "prompt-library/**",
    "ui-polish/**",
  ]),
]);

export default eslintConfig;
