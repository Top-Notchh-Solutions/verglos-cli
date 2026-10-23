# QUAL-WEB-006 authenticated account mobile runtime — 2026-10-08

## Scope

Read-only Chrome DevTools performance trace and Lighthouse navigation audit of
the existing authenticated production `/account` route. No account, license,
organization, payment, database, or deployment mutation occurred; no console
messages were emitted during the run.

## Results

- CPU throttling: 1x; network throttling: none
- Lab LCP: **587 ms**
- CLS: **0.00**
- Lighthouse mobile accessibility: **100**
- Lighthouse mobile best practices: **100**
- Lighthouse mobile SEO: **58**

The SEO score reflects three findings: indexing is blocked, no canonical is
declared, and the site-level `llms.txt` recommendation fails. The first two
are expected privacy behavior for the authenticated account route and are not
treated as defects. No CrUX field data was available.

## Limits and disposition

This covers one authenticated Free account route on mobile emulation. It does
not qualify paid organization dashboards, human screen-reader behavior,
large datasets, field CWV, or final public SEO/metadata decisions. Public
metadata remains frozen by the release gate. `QUAL-WEB-006` remains open; no
backlog checkbox changed.
