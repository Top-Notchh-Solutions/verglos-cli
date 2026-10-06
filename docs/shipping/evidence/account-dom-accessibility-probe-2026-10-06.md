# Authenticated account DOM accessibility probe — 2026-10-06

Page: `https://verglos.com/account` in the existing authenticated Chrome
session.

The production DOM probe found:

- one `main` landmark and one `nav` landmark;
- seven focusable links (Overview, Monitoring, Alerts, Score history,
  Activations, Docs, and See plans);
- zero unlabeled buttons/inputs/selects/textareas;
- body overflow `visible` (no document-level clipping).

This is automated DOM evidence only. It does not substitute for a human
screen-reader review, field Core Web Vitals, or large-dataset testing, so
`QUAL-WEB-006` remains open.
