# PLAN-WEB-014 · Preview fixture access blocker · 2026-10-10

## Target

- Preview deployment: `https://verglos-web-git-feat-previ-d17858-anuragyadav20062002s-projects.vercel.app`
- Web change under qualification: PR #171, isolated subscription lifecycle
  handling.
- Intended operation: Preview-only Test Mode `POST
  /api/razorpay/create-subscription` with the canonical monthly cadence,
  followed by provider, ledger, entitlement, and reconciliation checks.

## Bounded attempt

The authorized local runner invoked `vercel env run -e preview` and attempted
to load the Preview fixture configuration. Vercel reported that **10 Secret
values cannot be pulled from the Preview environment**. The local environment
did not contain `VERGLOS_PREVIEW_TEST_AUTH_SECRET`, so the runner stopped at
the fixture-availability check.

No HTTP request was sent to the Preview route. Therefore this attempt created
no provider subscription, database row, migration, payment, webhook,
entitlement, account, customer, deployment, or Production change.

## Missing artifact and owner

The missing artifact is runtime-safe access to the hidden Preview auth-fixture
secret for an authorized runner. Owner: founder or Vercel project
administrator. Review/expiry: make it available to the authorized local or CI
runner before the next Preview lifecycle attempt, and review it on
2026-10-10. Do not paste the secret into chat, commit it, or expose it in
logs.

Safe next action: provide the secret to the authorized runner through the
existing protected local/CI mechanism, or use an authorized browser/CI fixture
that can set the Preview test-auth header. Then rerun the subscription,
provider-event, replay, reconciliation, and entitlement matrix.

## Release decision

Gate 4 and `PLAN-WEB-011`, `PLAN-WEB-012`, `PLAN-WEB-014`, and `PLAN-WEB-015`
remain open. This is an access blocker, not evidence of a failed payment
operation. Production remains fail-closed; no Production billing or database
activation is authorized by this record.
