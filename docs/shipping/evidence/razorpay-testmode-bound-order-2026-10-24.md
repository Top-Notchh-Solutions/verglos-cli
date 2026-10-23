# Razorpay Test Mode current checkout-bound order · 2026-10-24

## Scope and safety

This record captures one real, synthetic Razorpay Test Mode order created by
the current Verglos Cards-only checkout route against an isolated local
PostgreSQL database. It uses the owner-controlled Test Mode credential pair
from the testing environment; no credential value is retained here.

- Web checkout source head: `791500d4dbc495312287287f692a6fc39120e3a2`
- Application database: isolated local Docker `verglos_test` on `127.0.0.1`
- Route: `POST /api/razorpay/create-order`
- Synthetic identity: owner-controlled fixture only
- Provider mode: Razorpay Test Mode (`rzp_test_` key)
- Payment method contract: `card` / Cards only

## Provider receipt

- Route response: HTTP **200**
- Provider read-back: `GET /v1/orders/{id}` HTTP **200**
- Provider order: `orde…9ZQv` (masked identifier; no raw provider ID retained)
- Provider creation time: `2026-10-23T22:26:12Z`
- Provider status: `created`
- Amount: **280,943 paise / INR 2,809.43**
- Catalog binding: Pro monthly, 30-day term
- Bound application note keys: `amount_minor`, `cadence`,
  `catalog_version`, `checkout_id`, `checkout_kind`, `checkout_signature`,
  `currency`, `duration_days`, `payment_methods`, `plan_id`, `user_id`,
  `verglos_checkout`

The order was not opened into a hosted payment, captured, refunded, or used
to deliver a webhook or entitlement. No money was charged. No Production
database, account, customer, or payment state was written, and no deletion was
performed.

## Disposition

This advances the current provider-boundary and `ACCEPT-003` evidence packet.
It does not close `ACCEPT-003` or the provider-lifecycle gate: a created order
is not a captured payment, signed webhook, refund, renewal, or complete
ledger/entitlement reconciliation. The earlier isolated Test Mode lifecycle
records remain historical evidence and are not relabeled as this receipt.

No backlog checkbox or score changed. The authoritative score remains
**245 checked / 35 open / 280 total (87.5%)**, partitioned as **13
AppSec-dependent / 22 non-AppSec** rows.
