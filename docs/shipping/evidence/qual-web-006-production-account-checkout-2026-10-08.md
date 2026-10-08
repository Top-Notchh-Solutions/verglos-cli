# QUAL-WEB-006 · production account and checkout read-only qualification · 2026-10-08

## Scope

- Existing authenticated production account surface: `/account`.
- Existing production checkout surface: `/checkout`.
- Chrome DevTools MCP only; no form submission, checkout continuation, payment,
  account, organization, database, deployment, or environment mutation.
- The authenticated account showed the existing user as `Free` with no license;
  no paid entitlement or organization membership was created or inferred.

## Observed results

| Surface | LCP | CLS | Lighthouse accessibility | Lighthouse best practices | Console |
|---|---:|---:|---:|---:|---|
| `/account` desktop snapshot | 857 ms | 0.00 | 100 | 100 | no warnings/errors |
| `/checkout` desktop snapshot | 811 ms | 0.00 | 100 | 100 | no warnings/errors |
| `/checkout` mobile navigation | not captured by this audit | not captured | 100 | 77 | provider/browser findings reported by Lighthouse |

The checkout accessibility tree rendered the Pro INR catalog and the hosted
method projection: UPI, Cards, Netbanking, Wallets, EMI, and Pay Later. The
page stated that access is granted only after server-side webhook verification.

The account trace had one existing payment-status request in its critical
request chain with a 2.319-second request duration. Its provider identifier is
not retained here. No write resulted from the request.

## Findings and limits

- Desktop account and checkout accessibility snapshots were clean for this
  bounded run; this is not a human screen-reader or keyboard acceptance.
- Checkout mobile Lighthouse reported third-party-cookie and DevTools-issue
  findings, plus missing meta-description/crawlability/`llms.txt` checks. These
  are not silently attributed to product code; the checkout includes provider
  resources and final public metadata remains under the goal's final-web hold.
- The run does not qualify authenticated organization data, large datasets,
  field Core Web Vitals, payment lifecycle, plan activation, or production
  reconciliation.

## Disposition

No backlog checkbox changed. `QUAL-WEB-006` remains open for keyboard and
screen-reader review, authenticated organization data, large datasets, field
CWV, responsive states, and complete evidence. `PLAN-WEB-011/012/013/014/015`
remain open for provider lifecycle and reconciliation evidence. Backlog remains
**218 checked / 62 unchecked / 280 total (77.9%)**.
