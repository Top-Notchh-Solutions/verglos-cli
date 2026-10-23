# PRO-008 invoice metadata projection — 2026-10-10

## Implementation

Web commit `cad9404` adds the provider-invoice metadata projection required by
the billing view. Subscription payment and invoice webhook paths now carry the
validated provider invoice identity into an idempotent `billing_invoices` row
bound to the billing user. The ledger rejects invoice amount, currency,
payment, subscription, order, owner, and identity mismatches before persistence.

The billing dashboard now shows masked invoice metadata and clearly states the
boundary: Verglos does not store invoice documents, tax payloads, or provider
download URLs. The query is owner-scoped through the existing commercial-state
user binding. No direct entitlement or payment-row repair was added.

## Verification

- migration `0040_billing_invoice_metadata` applied to the explicitly selected
  isolated Neon Test database;
- isolated Neon and Docker audits: **41 expected / 41 applied**, zero pending,
  zero missing tables; `billing_invoices` and `client_projection_custody` are
  present;
- billing/webhook unit set: **22 pass / 0 fail**, with one unrelated database
  integration test explicitly skipped when no local database was supplied;
- isolated Docker billing ledger, commercial-state, and webhook integration:
  **7/7 pass**;
- Web typecheck, Drizzle schema check, migration ordering check, production
  build (**47 pages**), and `git diff --check`: passed.

## Boundary and disposition

This is code and isolated-database evidence only. No Production deployment,
Production database, provider, payment, entitlement, account, or customer-data
write occurred. PRO-008 remains unchecked because the provider-generated
payment/renewal/failure/refund evidence and complete tenant-bound
payment-to-ledger-to-license reconciliation required by PLAN-WEB-011/012 are
still missing. Invoice documents/downloads are intentionally outside this
metadata projection and remain unavailable.

Score remains **223 checked / 57 unchecked / 280 total (79.6%)**; no checkbox
changed.
