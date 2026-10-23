# PRO-008 final V1 billing view — 2026-10-11

## Accepted scope

`PRO-008` is accepted against the Final V1 contract: owner-managed Pro
membership and billing state for Cards-only prepaid fixed-term access with
customer-initiated manual renewal. Automatic recurring renewal is not a V1
customer promise; legacy subscription rows are reconciliation-only.

## Implementation

- Web `d4dd7f9` aligns the organization billing view with the final contract.
- `/members` retains server-side invitation admission against the canonical
  Pro two-seat allowance, pending-invitation accounting, role controls, and
  owner-preserving removal behavior from Web `982b57d`.
- `/billing` projects the server-resolved plan/license/catalog, numeric or
  explicit `unset`/`contracted` allowances, server-reconciled usage, 80%
  threshold events, owner-only payment/refund/provider metadata, and a
  manual-renewal link back to the server-owned Cards-only checkout.
- Billing copy explicitly excludes automatic renewal and tax-invoice/document
  fabrication. Provider invoice metadata is reconciliation data only; no
  provider URL, tax payload, or secret is stored or shown.
- The checkout route remains server-catalog-bound and exposes only the
  configured Cards method; the webhook remains authoritative for entitlement.

## Verification

- Focused commercial-state, allowance, threshold, checkout, and route-contract
  suite: **39 passed / 1 explicit environment-gated skip / 0 failures**.
- Focused payment/webhook suite: **29 passed / 1 explicit environment-gated
  skip / 0 failures**.
- Existing isolated Docker PostgreSQL commercial-state/billing integration:
  **7/7 passed** at the invoice-metadata implementation checkpoint; the
  current change is a server-rendered view/contract alignment on top of that
  persisted, tenant-bound state.
- Web typecheck, production build (**47 pages**), and `git diff --check` pass.

## Boundary

No Production payment, database, migration, entitlement, account,
organization, provider, or customer-data write occurred. PRO-008 acceptance
does not pass Gate 5, Hunt/AppSec, legal, protected release/rollback, or final
acceptance gates.

## Decision

Check `PRO-008`; preserve payment metadata and the explicit V1 limitation
instead of claiming an invoice-document product that is not implemented or
legally qualified.
