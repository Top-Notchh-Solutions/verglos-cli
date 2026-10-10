# PLAN-WEB-014 · current Preview Cards-only revalidation

Date: 2026-10-10
Environment: current READY Vercel Preview deployment for Web `445d8ed`
Status: route/configuration evidence; not final hosted acceptance

## Result

The current Preview deployment was inspected with Vercel CLI and reported
`READY` with target `preview`. An authenticated Vercel CLI request to
`/checkout` returned HTTP 200. The server-rendered checkout props reported:

- catalog version `2026-10-02.0` with the canonical Pro offers;
- exactly one hosted payment method: `card` / `Cards`;
- `testMode: true`;
- `subscriptionEnabled: true`.

The Preview environment-variable listing showed the isolated database marker,
Preview `DATABASE_URL`, Razorpay Test Mode configuration, webhook secret, and
Cards-only method configuration present. Values were not revealed.

## Boundary

Direct browser navigation to this deployment without the Vercel protection
bypass redirected to Vercel login. Therefore this record proves the current
deployed server response and configuration only; it does not claim fresh
browser-render, checkout-submit, or final hosted Preview acceptance.

No payment, database, migration, entitlement, customer-data, or Production
write occurred.

## Disposition

The current Preview route is correctly fail-closed and Cards-only, but
`PLAN-WEB-014` and Gate 4 remain open for provider renewal/replay/out-of-order
evidence and final authorized hosted browser acceptance. Score remains **219
checked / 61 unchecked / 280 total (78.2%)**.

Deployment identifiers, URLs containing bypass values, secrets, database URLs,
cookies, authorization headers, personal data, and raw payloads are omitted.
