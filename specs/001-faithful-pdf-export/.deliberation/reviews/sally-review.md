# Sally review — faithful-pdf-export

## 1. What problem is this actually solving?

The current Download menu lies. It says "Download PDF — Designed print original" when the slug is mapped, which means the file the teacher receives is the 2022 canonical, not the manual they just edited. Jennifer cannot tell from the surface that her edits never reached the artifact. On unmapped slugs the same button silently switches to `window.print()` over a lossy HTML blob with no warning that the layout has degraded.

The new surface communicates three things the old one cannot:
- The PDF is being generated from the editor's current state, with progress.
- Which language edition is being rendered (today the menu is monolingual; the editor exposes language but the download path does not).
- If the runtime render fails, the user sees the fallback chain in plain words and chooses, rather than being silently downgraded.

## 2. Smallest first version that proves the idea

Wire the existing PDF button to call `/api/manuals/[manualId]/pdf` with the active language, show a determinate-looking progress indicator while the server renders, and on success trigger the download. One language. Mapped slugs only. No menu redesign. If the route 5xxs, fall back to the existing static PDF for the slug and tell the user that is what just happened. That single round trip proves teachers' edits land in the file and the fallback is visible.

## 3. Three UX risks that would kill this

- **No progress indicator during the Chromium render.** Server-side Puppeteer on Vercel takes 5 to 20 seconds cold. A spinner that runs longer than a normal download window without a determinate signal trains users to click again and double-fire the route. Needs an indeterminate spinner plus elapsed-time text after 3 seconds plus a cancel affordance.
- **Fallback chain confusion.** Three outcomes (runtime PDF, static PDF, lossy HTML print) collapse onto one button. If the user gets the static fallback after editing for an hour, the surface must say so before the download starts, not after, otherwise this regresses the lie the spec is trying to fix.
- **Language selection ambiguity.** Today the menu inherits language implicitly from the route. If the editor is on `?lang=es` but the download serves English because that is the canonical fallback, the user has no signal. The menu needs an explicit language line ("Spanish — from your edits") that updates as the editor language changes.

## 4. Success at 90 days

Jennifer downloads from `/manuals` and the PDF reflects what she edited in every one of the six languages. Zero "the PDF is wrong" support messages from her cohort. The download button shows render progress and the user knows which path produced their file (runtime, static fallback, or lossy fallback) before clicking. Time-to-PDF for a 40-block manual is under 8 seconds at p50 on Vercel production. Keyboard-only and screen-reader walkthroughs both complete the download path without help.

## 5. Atomic tasks

1. Extract the Download button trigger into a state machine: idle, requesting, rendering, downloading, failed-runtime, fallback-static, fallback-html.
2. Add a determinate-looking progress indicator with elapsed time after 3 seconds and a cancel button at 15 seconds.
3. Add a language affordance line under the PDF button that reads the editor's active locale and shows it in the user's UI language plus the locale code.
4. Add a fallback-static UI state that names what is about to happen ("Serving 2022 print original because the live render failed") before the file leaves.
5. Add a fallback-html UI state for unmapped slugs with no chromium, with a "this layout is rough" disclaimer.
6. Wire client error envelope handling against the route's `{ok:false,error:{code,message}}` contract.
7. Add a retry affordance on `failed-runtime` distinct from the original button, so retry does not refire on the same broken state.
8. Verify 44px minimum touch target on the menu items at mobile breakpoints.
9. Add `aria-live=polite` region announcing state transitions for screen readers.
10. Add keyboard parity: Esc closes, Enter triggers, arrow keys move between three options, focus ring visible.
11. Honor `prefers-reduced-motion` on the framer-motion enter/exit.
12. Add the empty state (zero blocks) and the loading-blocks state (editor still fetching) at the menu level.
13. Add desktop + mobile mockup frames for idle, requesting, rendering, fallback-static, failed states.
14. Telemetry: log which path served the file (runtime, static, html) so the 90-day success metric is measurable.

## 6. The one thing only my faculty would have noticed

The current menu preserves a quiet interaction the spec does not yet name: the PDF button's subtitle changes (`Designed print original` versus `US Letter, ready to print`) to telegraph which path will run. That subtitle is the only honest signal in the whole surface today. The new flow must keep a live subtitle that names the path before the click, not after, and it must update when the editor's language changes. Without that, the menu reverts to the same lie in a new costume.
