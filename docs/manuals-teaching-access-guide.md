# RoseSOS: Manuals & Teacher Visual Aid Access

Two pages are protected by the same PIN gate. This is the one guide covering both.

**rosesos.com is down**, so use the live Vercel links below until the domain is back.

## The Pages

- **Manual Library**: https://roses-os.vercel.app/manuals
- **Teacher Visual Aid Manual** (Rose Meditation facilitator page): https://roses-os.vercel.app/teaching

## The Codes

Both pages share the same two-code gate:

| Access level | What it lets you do                  |
| ------------ | ------------------------------------ |
| **Editor**   | Full edit rights, text and images    |
| **Teacher**  | Read-only, view content, no editing  |

The codes themselves are not written here. Ask Jennifer or the Light Brands team for them.
They are stored in Supabase, in the `settings` table under the keys `manual_editor_pin` and
`manual_teacher_pin`, and checked server-side by `src/app/api/manuals/pin/route.ts`. Changing
a value there changes the code for both pages at once.

## The One Thing to Remember

This isn't two separate passcode sets for two separate doors. It's one gate, reused on both
pages, and the real distinction is **editor vs. teacher**, not manuals vs. meditation.

If you've entered a code and can't edit text or images, you're in with the teacher code
(read-only). Re-enter with the editor code to get edit access.

---

_Light Brands internal reference._
