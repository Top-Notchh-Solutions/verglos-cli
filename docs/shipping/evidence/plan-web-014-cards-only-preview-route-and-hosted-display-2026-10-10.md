# PLAN-WEB-014 · Cards-only Preview route and hosted-display qualification

Date: 2026-10-10

## Scope

- Active backlog item: `PLAN-WEB-014`.
- Web branch: `feat/preview-test-auth`.
- Web source: `445d8ed` (`fix(checkout): constrain hosted methods to server catalog`).
- Release decision: Cards-only. The declared hosted method set is `card`.

## Evidence

- The current Preview deployment `dpl_36zQf2zEsVCrxpic8rcrjFJbQbK7` was
  READY after the runtime configuration check and 47-page Next build.
- Through Vercel's protected deployment request path, the real Preview
  `POST /api/razorpay/create-order` route returned HTTP 200 for the canonical
  monthly cadence. The redacted response proved `testMode: true`, catalog
  version `2026-10-02.0`, and `paymentMethods: ["card"]`; the provider order
  was created by the application route.
- The local focused checkout suite passed **12/12**. Web typecheck, Preview
  build, and the current Production build passed.
- Production public smoke remained read-only: `/`, `/checkout`, and `/docs`
  returned HTTP 200, and unauthenticated `GET /api/razorpay/create-subscription`
  returned HTTP 405. The current Production rollout is
  `dpl_9tXipBQD1CmYK8EpmMLCBPrgh3zw`; no Production billing, database,
  migration, entitlement, account, or customer-data write occurred.
- Redacted HTML inspection of the deployed checkout pages found the Cards
  label present and zero occurrences of UPI, netbanking, wallet, EMI, or Pay
  Later in both Production and isolated Preview. Preview retained its Test
  Mode marker; Production did not expose a Test Mode, Preview, or database
  marker.
- A read-only provider check found the latest isolated pending subscription
  fixture still `created` at Razorpay while the isolated application row was
  `pending`; no row was edited and no entitlement was granted.

## Hosted-display result and limitation

The code passes the server-owned display configuration to both order and
subscription Checkout paths with provider default blocks disabled. Existing
user-open provider tabs were not used as post-fix acceptance evidence. Fresh
CDP-injected provider frames did not render a usable form under automation
without a real user-activation session, so hosted modal method visibility is
not claimed as independently verified by this record. The prior open tab
showed the historical provider-default UPI/eMandate surface and remains
pre-fix observation only.

## Boundary and disposition

Test Mode provider order fixtures were created for the display probe; no
capture, refund, subscription authorization, webhook delivery, payment row,
ledger row, license, entitlement, Production, or manual database write was
performed by this batch. The route/display boundary is qualified, but
`PLAN-WEB-014` and Gate 4 remain open for provider-backed card authorization,
signed delivery, exactly-once payment/ledger/license reconciliation, replay
and out-of-order handling, renewal, failure/expiry, refund, timeout/retry,
and complete tenant binding.

Score remains **219 checked / 61 unchecked / 280 total (78.2%)**; no checkbox
changed.

Secrets, database URLs, cookies, authorization headers, personal data, raw
provider payloads, and full provider identifiers are intentionally omitted.
