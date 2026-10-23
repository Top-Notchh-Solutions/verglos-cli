# PLAN-WEB-014 — subscription invoice reconciliation and Production rollout

Date: 2026-10-09  
Web reviewed commit: `a95deef` (`fix(billing): bind subscription captures through invoices`)  
Private scope: isolated Preview/Test Mode plus fail-closed Production code rollout

## Change qualified

Razorpay Test Mode delivered the first subscription charge as a payment payload
with an `invoice_id` and `order_id`; the provider payment record did not expose
`subscription_id`. The handler previously recognized only `subscription_id`,
so it routed that valid subscription capture through the order path and rejected
it. The reviewed fix resolves the provider invoice, validates its paid status,
amount, currency, payment, order, and subscription bindings, then resolves the
signed subscription notes before recording the captured subscription payment.
The observed string boolean form of `captured` is normalized without weakening
the captured/status/refund checks.

## Verification

- Focused Razorpay webhook tests: **13 pass / 0 fail**.
- Full Web suite: **891 total / 868 pass / 23 explicit skips / 0 fail**.
- Typecheck: passed.
- Local 45-page production build: passed.
- Preview deployment: `dpl_FBtepYT84UUNCcvjo1jj43HxU7KB`, READY at
  `https://verglos-bhvvgg66m-anuragyadav20062002s-projects.vercel.app`.
- Razorpay Test Mode webhook was updated to the reviewed isolated Preview
  target and remained enabled with the existing event set. The bypass query
  and webhook secret are intentionally not recorded here.
- A fresh canonical monthly Pro Test Mode subscription completed hosted
  checkout. Read-only provider evidence showed a paid invoice with a matching
  payment, order, and subscription. Read-only isolated-database evidence showed
  the subscription `active`, a captured `subscription` payment for the
  canonical INR amount, and a non-null license binding. No rows were inserted
  or edited manually.

## Production rollout

- Production deployment: `dpl_72ptf8YQyLxxXvJHVQDg2vUfh3CN`, READY at
  `https://verglos-cghkmkzzg-anuragyadav20062002s-projects.vercel.app`, aliased
  to `https://verglos.com`.
- Remote Production runtime configuration: passed.
- Remote build: passed; 45 pages generated.
- Read-only smoke: `/`, `/checkout`, and `/docs` returned 200;
  method/auth probes returned the expected 405/401 boundaries.
- Production checkout contained no Test Mode marker, Razorpay test key, or
  provider plan ID. Checkout cache-control remained private/no-store and HSTS
  remained present.
- No Production plan IDs, payment/provider writes, database or migration
  writes, entitlement changes, account changes, or customer-data mutations
  occurred.

## Acceptance disposition

This closes the previously observed subscription-capture implementation defect
and advances the isolated provider lifecycle evidence. It does **not** by itself
close the full Gate 4 matrix: renewal, failure, cancellation/expiry, refunds,
replay/out-of-order delivery, and complete provider/ledger/entitlement
reconciliation still require their own evidence. No backlog checkbox changed.

Score after this batch: **219 checked / 61 unchecked / 280 total (78.2%)**.
