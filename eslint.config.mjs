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
  {
    rules: {
      // React Compiler (RC) advisory rules newly bundled in eslint-config-next 16.
      // This app predates them and uses the flagged patterns intentionally:
      //  - set-state-in-effect: hydration-safe state init gated behind a `mounted`
      //    flag, and reset-on-route/prop-change effects — both legitimate.
      //  - immutability: imperative react-three-fiber camera mutation
      //    (cam.fov / cam.position) is the correct r3f pattern.
      // Keep them visible as warnings rather than failing CI on intended code.
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/immutability": "warn",
    },
  },
]);

export default eslintConfig;
