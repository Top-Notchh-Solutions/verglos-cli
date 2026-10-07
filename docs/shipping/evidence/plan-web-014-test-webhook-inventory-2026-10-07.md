# PLAN-WEB-014 Razorpay Test Mode webhook inventory — 2026-10-07

## Scope

Read-only inspection of the Razorpay Test Mode webhook configuration using the
isolated test key pair. No webhook was created, edited, enabled, deleted, or
sent. No production environment, database, deployment, payment, or QR state
was touched.

## Result

The Test Mode account returned one configured webhook destination. It was
reported inactive; its host was `verglos.com` (path and identifier withheld).
The configured event set included the application-relevant
`payment.captured`, `payment.failed`, `refund.created`, `refund.processed`,
`qr_code.credited`, and subscription lifecycle events.

The inactive state means this inventory is not webhook-delivery evidence. The
destination was not activated because it points at the product host and a
provider-side activation could deliver sandbox events to a live-looking
runtime without a reviewed non-production cutover. This is an external
configuration blocker, not a reason to claim payment acceptance.

## Code alignment

Web PR #149 exact head `051d4be` adds strict handling for the provider-native
`refund.processed` event: it fetches the provider payment's cumulative refund
watermark, validates payment/currency/amount binding, and then invokes the
monotonic application refund ledger. `refund.created` remains non-terminal and
does not revoke entitlement. Local focused payment tests passed 29 with one
explicit migrated-DB skip; typecheck, schema checks, migrations check, build,
diff, and staged secret scan passed. Hosted Verify `37645815573` was in
progress when this evidence was written.

## Disposition

No backlog item is accepted. PLAN-WEB-013/014/015 remain open for a reviewed
non-production webhook destination, real hosted method lifecycle evidence,
capture/refund/replay/reconciliation, and production truth/cutover preflight.
