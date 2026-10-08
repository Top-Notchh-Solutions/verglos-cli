# QUAL-WEB-005 · authenticated privacy/deletion mobile slice — 2026-10-08

## Scope

Read-only Chrome DevTools qualification of the authenticated production
`/account/privacy` route under 390×844 mobile/touch and Fast 3G emulation.
No deletion checkbox was selected, no request was submitted, and no account
data or identifiers were recorded.

## Observed contract

- The page clearly distinguishes hosted private-data deletion from preservation
  of bounded customer-held signed-record digests.
- The request checkbox is exposed with an accessible name.
- The deletion button is disabled until explicit confirmation.
- Request history reports no recorded deletion requests.
- The route exposes the account navigation and a main heading without leaking
  tenant or customer-held record data.

## Results

- Lighthouse mobile Accessibility: **100**
- Lighthouse mobile Best Practices: **100**
- Lighthouse mobile SEO: **100**
- Lab LCP: **614 ms** under Fast 3G
- CLS: **0.00**
- Console messages: none
- CrUX field data: unavailable for this route

## Limitations and disposition

This is a read-only privacy-surface slice, not deletion acceptance. It does
not prove authenticated non-production deletion E2E, worker execution,
customer-held-record preservation, legal/consent decisions, retention
reconciliation, restore/rollback, or independent end-to-end review. The
Agentic Browsing Lighthouse category reported one failure and is not treated
as an accessibility or privacy pass. No checkbox changed and no production,
database, payment, entitlement, or deployment write occurred.
