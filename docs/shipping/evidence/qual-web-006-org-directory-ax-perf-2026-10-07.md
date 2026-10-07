# QUAL-WEB-006 organization directory accessibility/performance probe — 2026-10-07

## Scope

- Page: authenticated production `/orgs`
- Browser instrument: existing Chrome CDP target only; no new tab or helper
- Operation: read-only accessibility tree, landmark/heading/interactive-element
  inspection, and Performance-domain snapshot

## Observed

- One visible `main` landmark and one `h1` (`Choose an organization`) were
  present; the empty state exposed an `h2` and one named link.
- The accessibility tree contained 30 nodes, including one `RootWebArea`, one
  `main`, two headings, one link, three paragraphs, and one alert.
- The inspected page had one document/frame and 79 DOM nodes. At the snapshot,
  `LayoutDuration` was 0, `RecalcStyleDuration` was 0.000991 s,
  `TaskDuration` was 0.004148 s, and `JSHeapUsedSize` was 7,941,820 bytes.

## Boundary and limitation

This is partial runtime evidence for the empty organization-directory state,
not complete QUAL-WEB-006 acceptance. It does not cover keyboard traversal,
human screen-reader output, mobile/responsive states, reduced motion, field
Core Web Vitals, authenticated dashboard data, or large datasets. No form,
navigation, database, payment, deployment, or production mutation occurred.

Backlog remains **218 checked / 62 unchecked / 280 total (77.9%)**.
