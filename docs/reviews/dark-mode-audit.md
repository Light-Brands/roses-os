# Dark Mode Quality Audit

**Date:** 2026-03-07
**Scope:** Full codebase review of dark mode implementation quality
**Reference:** Scope of Work (docs/brand/scope-of-work-and-proposal.md, line 63) lists "Dark mode support" as a Phase 1 deliverable.

---

## Infrastructure Status

The dark mode system is well-architected with proper separation of concerns:

| Layer | Status | File |
|-------|--------|------|
| CSS Variables (light/dark) | Complete | `src/design-system/theme.css` |
| Theme Provider & Hook | Complete | `src/lib/theme.tsx` |
| Tailwind `dark:` integration | Complete | `src/app/globals.css` |
| System preference detection | Complete | `src/lib/theme.tsx` |
| localStorage persistence | Complete | `src/lib/theme.tsx` |
| Rose Clay style variant | Complete | `src/design-system/theme.css` |
| Admin theme toggle (Sun/Moon) | Complete | `src/components/admin/AdminHeader.tsx` |
| Layout hydration script | Complete | `src/app/layout.tsx` |
| Public-facing theme toggle | **Missing** | No toggle for site visitors (system preference only) |

---

## Critical Issues

### 1. `--color-soft-charcoal` invisible in dark mode
- **File:** `src/design-system/theme.css`, line 50
- **Problem:** Value `#3F3E3C` has no dark override and is identical to `--color-background-muted` in dark mode. Any element using this as text/foreground will be invisible against muted backgrounds.
- **Fix:** Add `--color-soft-charcoal: #D5CFC8;` (or similar light warm gray) to the `.dark` block.

### 2. Undefined CSS variables in admin styles
- **File:** `src/app/(admin)/admin/globals.css`, lines 73, 82
- **Problem:** References `--color-primary-500` and `--color-secondary-500` which are never defined anywhere. `.gradient-text` and `.focus-ring:focus` are broken in both light and dark mode.
- **Fix:** Replace with defined variables (e.g., `var(--color-rose-500)` and `var(--color-accent)`).

### 3. `--color-info` low contrast in dark mode
- **File:** `src/design-system/theme.css`, line 82
- **Problem:** Value `#6B5F56` has no dark override and is near-identical to dark mode background tones.
- **Fix:** Add `--color-info: #A89B90;` (or similar lighter variant) to the `.dark` block.

---

## High Priority Issues

### 4. PdfImageEditor status messages
- **File:** `src/components/teaching/PdfImageEditor.tsx`, lines 241-243, 281
- **Problem:** `bg-red-50`/`bg-green-50` status messages render as bright white boxes in dark mode. Delete button `hover:bg-red-50` also flashes white.
- **Fix:** Add `dark:bg-red-900/20 dark:text-red-300` and `dark:bg-green-900/20 dark:text-green-300`.

### 5. GuardianCard photo border
- **File:** `src/components/sections/GuardianCard.tsx`, line 31
- **Problem:** `border-white` on photo ring is conspicuously bright in dark mode.
- **Fix:** Add `dark:border-neutral-800` or `dark:border-[var(--color-background)]`.

### 6. `--color-section-dark` loses contrast
- **File:** `src/design-system/theme.css`, line 168
- **Problem:** Value `#1E1916` is nearly identical to dark mode background `#1A1716` -- section loses visual separation.
- **Fix:** Add `--color-section-dark: #2A2320;` (lighter dark tone) to the `.dark` block.

---

## Medium Priority Issues

### 7. Card hover shadow hardcoded
- **File:** `src/app/globals.css`, line 422
- **Problem:** `.card-hover:hover` uses `box-shadow: 0 4px 20px 0 rgb(59 47 47 / 0.1)` -- warm-brown shadow is wrong in dark mode.
- **Fix:** Add `.dark .card-hover:hover` override with `rgb(0 0 0 / 0.3)`.

### 8. ChakraSlideCard border and inline colors
- **File:** `src/components/teaching/ChakraSlideCard.tsx`, line 136
- **Problem:** `border-black/10` is invisible in dark mode. Inline hex+alpha style colors (lines 61, 72, 91) won't adapt.
- **Fix:** Add `dark:border-white/10`. Consider using CSS variables for inline styles.

### 9. FormStepper Framer Motion fallbacks
- **File:** `src/components/ui/FormStepper.tsx`, lines 37-47
- **Problem:** Framer Motion `animate` uses `#FFFFFF` fallback; hardcoded `rgba(156,111,110,0.15)` shadow won't adapt.
- **Fix:** Use resolved CSS variable values or conditional theme-aware colors.

### 10. SubscribeCalendar double-inversion
- **File:** `src/components/ui/SubscribeCalendar.tsx`, lines 106-108
- **Problem:** Mixes `bg-[var(--color-foreground)]` with `dark:bg-white` -- if CSS variable already flips, this creates double-inversion.
- **Fix:** Remove the `dark:` override or remove the CSS variable, use one strategy consistently.

### 11. Brand color CSS variables missing dark overrides
- **File:** `src/design-system/theme.css`, lines 42-50
- **Problem:** `--color-rose-clay`, `--color-olive-brass`, `--color-terracotta`, `--color-honeyed-stone`, `--color-gilded-clay`, `--color-peach-sand`, `--color-golden-ether`, `--color-cream-veil` have no dark overrides. Some may need lighter variants for adequate contrast on dark backgrounds.
- **Fix:** Evaluate each and add adjusted values where contrast is insufficient.

---

## Low Priority Issues

### 12. Hardcoded brand hex colors across ~20 components
- **Files:** `TeachingSlideCard.tsx`, `TechniqueCard.tsx`, `LevelNav.tsx`, `LanguageSelector.tsx`, `LineageTimeline.tsx`, `ElevenCapacities.tsx`, `DomainGrid.tsx`, `PathLevels.tsx`, `PdfImageEditor.tsx`, `Navigation.tsx`, and others
- **Problem:** Pervasive use of `#9E956B` (olive brass) and `#9C6F6E` (rose clay) without `dark:` variants. These are decorative accents that work acceptably but aren't formally dark-aware.
- **Fix:** Replace with CSS variables `var(--color-olive-brass)` / `var(--color-rose-clay)` (after adding dark overrides per issue #11).

### 13. tokens.ts has no dark mode awareness
- **File:** `src/design-system/tokens.ts`
- **Problem:** Components consuming tokens for inline styles or Framer Motion always get light-mode colors/shadows. No mechanism to select dark-mode-appropriate values.
- **Fix:** Consider exporting a `getToken(key, isDark)` helper or restructure tokens with light/dark variants.

### 14. Tailwind shadow utilities always use light-mode values
- **File:** `src/app/globals.css`, lines 20-159 (`@theme inline` block)
- **Problem:** Shadow tokens use warm-brown `rgb(59 47 47 / ...)` tinting. The CSS variable overrides in theme.css only work with `var(--shadow-*)`, not Tailwind classes like `shadow-md`.
- **Fix:** Ensure components use `var(--shadow-*)` or add dark-mode shadow overrides via Tailwind config.

### 15. Toggle switches in admin settings
- **File:** `src/app/(admin)/admin/settings/page.tsx`, lines 307, 493
- **Problem:** `after:bg-white after:border-neutral-300` without dark variants on toggle knobs.
- **Fix:** Add `dark:after:border-neutral-600`.

---

## What's Working Well

- **Admin pages:** Consistently paired `dark:` Tailwind variants throughout all 8 pages
- **Public site pages:** CSS variables handle theme switching automatically
- **Three.js components:** Properly use `isDark` prop for rendering adjustments
- **Theme hydration script:** Prevents flash of wrong theme on load
- **System preference detection:** Responds to OS-level theme changes in real-time
- **Rose Clay style variant:** Properly defined for both light and dark modes
- **Selection colors:** Has proper `.dark` override (globals.css line 469)
- **Skeleton loading states:** Has proper `.dark` override in admin CSS

---

## Recommendations

1. **Immediate:** Fix critical issues #1-3 (invisible text, undefined variables, low contrast)
2. **Short-term:** Fix high priority issues #4-6 (visible UI breaks in dark mode)
3. **Medium-term:** Address medium issues #7-11 (subtle visual inconsistencies)
4. **Long-term:** Refactor hardcoded hex colors to use CSS variables (#12), add dark awareness to tokens.ts (#13)
5. **Feature:** Add a public-facing dark mode toggle to the site navigation (currently admin-only)
