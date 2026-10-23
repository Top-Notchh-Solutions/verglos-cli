# Web payment and Production rollout evidence — 2026-10-09

## Scope

This records the Test Mode provider-plan setup, isolated Preview deployment,
and Production code rollout for the Web subscription path. It does not close
the recurring-payment backlog IDs or Gate 4; real subscription authorization,
renewal/charge, failure, cancellation/expiry, refund, replay, and
ledger/entitlement reconciliation remain required.

## Test Mode provider setup

- Credentials were read from the local, uncommitted
  `verglos-web/.env.gates.testing` file without printing any secret.
- A read-only Razorpay Test Mode plans request was accepted with HTTP 200.
- The account initially contained zero plans.
- Canonical Pro plans were created in Test Mode only:
  - monthly: `plan_TlaD3tfF8tStbw`, INR 280,943 minor units, monthly interval 1;
  - annual: `plan_TlaD4ASatpFUrM`, INR 2,809,430 minor units, yearly interval 1.
- Preview received only the non-secret plan IDs and
  `RAZORPAY_SUBSCRIPTION_TOTAL_COUNT=12`.
- No Production provider configuration was changed and no Test Mode plan ID
  or credential was copied to Production.

## Deployments

- Preview: `dpl_CwmAKov2aoDJmyk9o5LqHS849TEJ`, READY at
  `https://verglos-dhp0dkyma-anuragyadav20062002s-projects.vercel.app`.
- Production: `dpl_E3Xr4UZe1ZXaZfRB7ygvS8HvmQTs`, READY and aliased to
  `https://verglos.com`.
- Both builds passed runtime configuration validation and generated 45 pages.
- Production has no recurring plan IDs, so the new subscription UI remains
  disabled there. This is an intentional fail-closed code rollout, not a
  claim that Production billing is complete.

## Read-only smoke result

- `https://verglos.com/` — HTTP 200.
- `https://verglos.com/checkout` — HTTP 200.
- `GET https://verglos.com/api/razorpay/create-subscription` — HTTP 405, as
  expected for the POST-only route.
- No Production database, migration, payment, provider, entitlement, or
  account write was performed.

## Acceptance and backlog disposition

- Score remains **219 checked / 61 unchecked / 280 total / 78.2%**.
- No checkbox is closed from plan creation or deployment alone.
- Next action: run the authenticated isolated Preview/Test Mode subscription
  lifecycle and reconcile provider, database, ledger, and entitlement state.
- Production next action: perform the read-only configuration/health pass;
  activate Production billing or database changes only with the documented
  operation-specific preflight, backup/restore, reconciliation, and rollback
  evidence.
