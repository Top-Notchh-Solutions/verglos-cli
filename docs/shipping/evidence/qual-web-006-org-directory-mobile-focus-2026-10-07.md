# QUAL-WEB-006 authenticated organization-directory runtime probe — 2026-10-07

## Scope

- Existing authenticated production page: `/orgs`.
- Existing Chrome CDP page target reused; no new tab, navigation, click,
  form submission, or data mutation occurred.
- The page was observed in desktop `1710x985` and mobile `390x844` emulation;
  the target was explicitly restored to desktop `1710x985` afterward.

## Observations

- Desktop and mobile both had no horizontal overflow.
- The empty state exposed one `h1`, one `h2`, two landmarks, one focusable
  link, and zero buttons. The desktop accessibility tree had 30 nodes / 18
  named nodes; mobile had 32 nodes / 20 named nodes.
- Desktop runtime metrics were `LayoutDuration=0.000059s`,
  `RecalcStyleDuration=0.000669s`, `TaskDuration=0.001557s`, and
  `JSHeapUsedSize=6,530,812` bytes.
- The programmatic focus probe found the single `Personal account` link, but
  programmatic focus is not a keyboard or screen-reader acceptance test; its
  computed outline style was `none` with a 3px outline width. No focus pass is
  claimed.
- A five-second CDP page-target monitor saw the same four page targets before
  and after the probe; no tab creation/destruction occurred.

## Boundary

This is partial empty-state runtime evidence only. Keyboard traversal,
human/screen-reader review, responsive states beyond the bounded emulation,
field Core Web Vitals, authenticated data states, large datasets, and complete
QUAL-WEB-006 acceptance remain open. No checkbox changed and no production,
database, payment, deployment, or provider mutation occurred.
