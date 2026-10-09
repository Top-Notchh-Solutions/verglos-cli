# PLAN-WEB-014 — expired subscription lifecycle Preview qualification

Date: 2026-10-09

## Scope

This record qualifies the Web code-side `subscription.expired` lifecycle
against a fresh isolated PostgreSQL database and the protected Preview
deployment. It is a Preview/Test Mode qualification slice; it is not a
Production billing or database activation record.

Source: Web commit `4ba15ad` on the `feat/preview-test-auth` qualification
branch.

## Implementation

- Added `expired` to the billing subscription status model and ordering.
- Added the reviewed `0037_billing_subscription_expired.sql` constraint
  migration.
- Mapped Razorpay `subscription.expired` to the ledger status without
  creating a payment or revoking already-paid time.
- Added focused lifecycle and real webhook-handler integration coverage.

## Verification

- Focused webhook-handler tests: **13/13 pass**.
- Fresh disposable PostgreSQL ledger integration: **1/1 pass**.
- Fresh disposable PostgreSQL webhook-handler integration: **3/3 pass**.
- Full Web serial suite: **891 total / 868 pass / 23 explicit skips / 0 fail**.
- Typecheck, production build (45 pages), database check, ordered migration
  check (38 migrations), and diff check passed.
- The fresh database applied all 38 migrations successfully, including the
  new expiry constraint migration.

## Preview deployment

Preview deployment `dpl_EhFoWzfHSbQt5LkRYaxS7MdGqc4u` reached READY. Protected
read-only smoke returned HTTP 200 for `/`, `/checkout`, and `/docs`; the
POST-only subscription-creation route returned the expected HTTP 405 to GET.
No secret, database URL, provider identifier, personal data, or protected
session value is included in this record.

## Production boundary

Production remains the previously qualified fail-closed code rollout from
Web source `a95deef`, deployment `dpl_72ptf8YQyLxxXvJHVQDg2vUfh3CN`, aliased to
`https://verglos.com`. This expiry commit was not promoted because it adds a
database constraint migration that still requires a Production migration
preflight, backup/restore or recovery evidence, reconciliation, and rollback
decision.

The Production rollout remains in scope and active, but this record proves
no Production plan IDs, payment/provider writes, database or migration
writes, entitlement changes, account changes, or customer-data mutations.

## Limitations and disposition

This does not prove provider-generated expiry, renewal/charge, failure/halt,
refund, replay/out-of-order delivery, or complete provider/ledger/entitlement
reconciliation. No backlog checkbox is closed by this slice.

Score remains **219 checked / 61 unchecked / 280 total (78.2%)**.
