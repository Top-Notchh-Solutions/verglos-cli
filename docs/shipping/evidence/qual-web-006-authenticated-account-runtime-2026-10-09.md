# QUAL-WEB-006 authenticated account runtime requalification — 2026-10-09

## Scope

- Surface: `https://verglos.com/account`
- Deployment under observation: current production deployment recorded in
  `vercel-production-preview-config-audit-2026-10-09.md`, Web commit
  `be4289f838b4cd53ed243979bfd7623262b69636`.
- Instrument: approved Chrome DevTools CDP session on the authenticated page.
- Viewport: `500x844`.
- Operation: read-only reload, DOM metrics, Lighthouse snapshot, console
  inspection, network-status inspection, and keyboard traversal. No button,
  form, checkout, payment, deletion, account, entitlement, or provider action
  was invoked.

## Results

- Reloaded `/account` returned HTTP 200; the observed application route and
  account subroute requests returned 200 or 304. No console warning or error
  was present after the clean reload.
- DOM metrics: one visible `main`, one visible heading, nine visible controls,
  zero unnamed visible controls, zero disabled visible controls, zero images,
  zero missing image `alt` values, and no horizontal overflow.
- Lighthouse snapshot: Accessibility **100**, Best Practices **100**, SEO
  **100**, Agentic Browsing **50**. The single failed audit is not treated as
  a product acceptance pass; the detailed public metadata/agentic finding
  remains under the held truth pass.
- Keyboard-only bounded traversal reached named links, returned to the body,
  then continued through the named-link cycle. No unnamed focused control was
  observed and no application mutation occurred.

## Disposition

This is fresh authenticated account-runtime and accessibility evidence for
`QUAL-WEB-006`, not full acceptance. Human screen-reader review, responsive
state coverage, complete dashboard-route coverage, large-dataset behavior,
field/CrUX Core Web Vitals, and final truth reconciliation remain open. No
production, database, migration, payment, provider, deployment, account,
entitlement, deletion, or customer-data write occurred. The backlog remains
**218 checked / 62 unchecked / 280 total (77.9%)**.
