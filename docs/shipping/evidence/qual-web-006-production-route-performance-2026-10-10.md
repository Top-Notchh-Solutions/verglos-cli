# QUAL-WEB-006 Production route/performance qualification — 2026-10-10

## Read-only browser evidence

Using the existing authenticated Chrome DevTools session against
`https://verglos.com`:

- `/account` performance trace: LCP **2,327 ms**, CLS **0.00**;
- Lighthouse desktop and mobile: Accessibility **100**, Best Practices
  **100**; both runs had the same three expected authenticated-page SEO
  findings (`noindex`, missing canonical, and `llms.txt` recommendation);
- no console messages were reported on the account page;
- `/account`, `/account/privacy`, `/orgs`, and `/docs` rendered without an
  application-error marker;
- `/account/monitoring`, `/account/alerts`, `/account/history`, and
  `/account/activations` redirected to `/account` for the current Free account,
  which is a paywall-boundary observation rather than route-content proof.

No provider, payment, database, entitlement, account, organization, customer,
deployment, or Production state write occurred.

## Acceptance boundary

This is current Production route/performance evidence only. `QUAL-WEB-006`
remains unchecked pending keyboard and screen-reader execution, large-data
qualification, field-CWV evidence, and complete paid/authenticated route
coverage. Score remains **223 checked / 57 unchecked / 280 total (79.6%)**.
