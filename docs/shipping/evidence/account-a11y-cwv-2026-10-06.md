# Authenticated account accessibility/performance recheck — 2026-10-06

## Scope

Read-only browser qualification of the deployed `/account` route using the
authorized signed-in Chrome profile. No account, billing, or production data
was changed.

## Results

- Chrome DevTools Lighthouse navigation audit (desktop): Accessibility **100**,
  Best Practices **100**.
- The three Lighthouse failures were intentional private-page SEO controls:
  indexing is blocked, no public canonical is emitted, and `llms.txt` is not a
  requirement for the authenticated account surface. They are not accessibility
  or security failures.
- Performance trace (desktop, no throttling): LCP **1,051 ms**, CLS **0.00**;
  TTFB was 522 ms and render delay 529 ms.
- Lighthouse mobile navigation also scored Accessibility **100** and Best
  Practices **100**. A mobile trace at 390×844 reported LCP **587 ms** and
  CLS **0.00** (lab data; no CrUX field data).
- CrUX field data is unavailable for this private route; this is lab evidence,
  not field-CWV evidence.
- The page exposed named navigation landmarks, readable signed-in state, and
  the existing free/pro boundary without claiming paid access.

## Boundary

This strengthens QUAL-WEB-006 evidence for the authenticated account surface,
but does not close the item: human screen-reader review, large-dataset states,
and field CWV evidence remain open.
