# RoseSOS: Manuals & Teacher Visual Aid Access

Two pages are protected by the same PIN gate. This is the one guide covering both.

**rosesos.com is down**, so use the live Vercel links below until the domain is back.

## The Pages

- **Manual Library**: https://roses-os.vercel.app/manuals
- **Teacher Visual Aid Manual** (Rose Meditation facilitator page): https://roses-os.vercel.app/teaching

## The Code

Both pages share one code, and it gives everyone full edit rights (text and images). Since
2026-10-10 the editor code is used for everyone; the separate read-only teacher code is retired.

The code itself is not written here. Ask Jennifer or the Light Brands team for it. It is stored
in Supabase, in the `settings` table (`manual_editor_pin`, with `manual_teacher_pin` set to the
same value), checked server-side by `src/app/api/manuals/pin/route.ts`, and can be changed from
the admin Settings page.

---

_Light Brands internal reference._
