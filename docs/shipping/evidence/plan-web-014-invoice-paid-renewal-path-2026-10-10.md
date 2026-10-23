# PLAN-WEB-014 invoice-paid renewal path — 2026-10-10

## Implementation

Web commits `a97bc2b` and `b1bd248` add a fail-closed `invoice.paid` webhook path for
subscription-backed provider invoices. The handler resolves the provider
invoice, requires a bound subscription, then reuses the existing signed
checkout snapshot, exact amount/currency, paid-invoice, captured-payment, and
provider-identity checks before recording the lifecycle and payment through
the existing idempotent ledger. Unrelated one-off invoices are acknowledged
without a subscription or entitlement write.

The same event identity claim/replay boundary is used as the existing payment
and subscription events. No manual row repair or direct entitlement mutation
was added.

## Verification

- Focused Razorpay webhook handler: **20/20 pass, 0 fail, 0 skip**.
- Broader billing/payment/lifecycle set: **48 pass, 0 fail, 3 explicit
  environment skips**.
- TypeScript typecheck: pass.
- Production build: pass; **47 pages** generated.
- Disposable PostgreSQL migration and real handler integration: **5/5 pass**,
  including successful paid-invoice fulfillment and replay deduplication.

The integration database was loopback-only, initialized with the reviewed
baseline/migrations, and stopped after the run. The remote Test Mode/Neon
database was not used by this qualification.

## Boundary and remaining gate

This is code-side and isolated integration progress. No Production plan,
provider, payment, Neon, migration, entitlement, account, or customer-data
write occurred. A provider-delivered signed `invoice.paid` or
`subscription.charged` event for the previously observed active Test Mode
subscription is still required, followed by read-only provider-to-ledger-
to-license reconciliation. Gate 4 and `PLAN-WEB-011`, `PLAN-WEB-012`,
`PLAN-WEB-014`, and `PLAN-WEB-015` therefore remain open.

Backlog remains **219 checked / 61 unchecked / 280 total (78.2%)**; no
checkbox changed.
