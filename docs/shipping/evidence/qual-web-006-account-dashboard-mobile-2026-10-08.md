# QUAL-WEB-006 authenticated account dashboard sweep — 2026-10-08

## Boundary

- **Surface:** authenticated production `/account` through the connected
  Chrome DevTools session.
- **Account state:** current session exposed the Free account boundary only;
  no identity value was retained.
- **No mutation:** no form submission, payment, entitlement, organization,
  database, provider, deployment, or account-state write occurred.

## Results

- Lighthouse desktop: Accessibility **100**, Best Practices **100**;
  SEO **58**, Agentic Browsing **67**.
- Lighthouse mobile: Accessibility **100**, Best Practices **100**;
  SEO **58**, Agentic Browsing **67**.
- Mobile emulation: **390×844**, touch enabled, Fast 3G.
- Mobile performance trace: LCP **741 ms**, CLS **0.00**; field data was not
  available.
- Mobile console: no warning/error messages.
- Desktop and mobile DOM measurements: document/body width matched the
  viewport with no horizontal overflow; two landmarks and nine focusable
  elements were present in both states.
- Keyboard traversal sample: **8/8** tab stops matched `:focus-visible` and
  exposed a non-zero outline width; this is automated focus evidence, not a
  human screen-reader review.
- The account showed the Free-tier boundary; paid monitoring, alerts, score
  history, and activation data were not available for this session.

## Disposition

This is partial empty/Free-state accessibility and performance evidence. The
private authenticated surface is correctly not indexable, and the SEO/agentic
scores are not release-quality evidence for the public site. `QUAL-WEB-006`
remains open for paid dashboard data, keyboard-visible focus review, human
screen-reader review, loading/error/data states, large datasets, and field-CWV
evidence. No backlog checkbox changed. Backlog remains **218 checked / 62
unchecked / 280 total (77.9%)**.
