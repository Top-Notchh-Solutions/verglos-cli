# PLAN-WEB-014 · isolated subscription create/cancel reconciliation · 2026-10-10

## Configuration and deployment

- Preview-only branch-scoped auth fixture was rotated through Vercel for
  `feat/preview-test-auth`; the secret was not printed, committed, or used in
  Production.
- The resulting Preview deployment was READY at
  `https://verglos-gbhjjpuhd-anuragyadav20062002s-projects.vercel.app`.
- Vercel deployment protection was accessed through the authenticated
  `vercel curl` transport. No protection was disabled.
- The canonical monthly Test Mode plan and four-method Preview configuration
  remained unchanged.

## Hosted subscription operations

Two bounded POST requests to the Preview `create-subscription` route were
accepted in Razorpay Test Mode. Each response contained the Test-Mode key,
canonical monthly cadence/catalog fields, and a provider subscription ID.
Each corresponding owner-bound `subscription-status` read returned:
`status=processing`, `subscriptionStatus=pending` before payment, with no
entitlement grant.

The two fresh provider subscriptions were then cancelled through the Razorpay
Test Mode API with `cancel_at_cycle_end=false`. Both provider operations
returned HTTP 200 and provider state `cancelled`.

## Reconciliation result

After a bounded wait, the provider inventory for the canonical plans reported
**6 active, 11 created, 9 cancelled**. The isolated Preview database reported
**5 active, 7 cancelled, 14 pending** subscription rows. The two fresh rows
remained pending, and the owner-bound status read for a fresh provider-
cancelled subscription still returned `processing/pending`. Payment rows
remained **5 captured, 1 failed, 2 refunded**; no new payment or entitlement
was granted.

This proves the real provider create and cancel operations, server-catalog
binding, owner binding, pending persistence, and the fail-safe no-grant state.
It also exposes the remaining lifecycle gap: a signed provider cancellation
delivery and its application-side transition to `cancelled` were not
observed. The provider API state alone is not accepted as webhook evidence.

## Boundary and release decision

This was isolated Test Mode plus isolated Preview-database state only. No
Production provider, payment, database, migration, entitlement, account, or
customer write occurred. Gate 4 and `PLAN-WEB-011`, `PLAN-WEB-012`,
`PLAN-WEB-014`, and `PLAN-WEB-015` remain open pending reachable signed
webhook delivery, cancellation/replay/out-of-order reconciliation, renewal,
expiry/failure/refund coverage, and the remaining method matrix.

Required next artifact: a provider delivery record and isolated database
transition for the fresh cancellation, owned by Web/provider operations. The
Preview protection bypass used by the runner is not automatically available
to Razorpay, so do not claim webhook delivery until the provider can reach the
authorized isolated endpoint or a provider-supported replay is captured.
