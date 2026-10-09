# Web and CLI focused qualification at current heads

## Scope

- Web worktree: `feat/preview-test-auth`, exact source `51e07f5`.
- CLI worktree: local `main`, exact source `d0a3b217`.
- Mapped work: Gate 4 and `PLAN-WEB-011/012/014/015`; the CLI API-origin
  boundary and standards-validation corpus supporting `PLAN-CLI-003` and
  `QUAL-CLI-006`.

## Qualification executed

From `verglos-web`:

```text
node --import tsx --test \
  src/lib/billing/ledger-state.test.ts \
  src/lib/razorpay-webhook-handler.test.ts \
  src/lib/razorpay-route-error-contract.test.ts \
  src/app/checkout/checkout-payload.test.ts \
  src/lib/http/request-origin.test.ts \
  src/lib/razorpay-webhook-events.integration.test.ts
```

Result: **42 total, 41 pass, 1 explicit PostgreSQL-environment skip, 0
failures**. The passing cases cover hosted method payload validation, signed
subscription response validation, retry-session behavior, same-origin
request protection, catalog/provider binding, subscription lifecycle
ordering, invoice binding for captured and failed payments, null provider
period-end handling, refund watermarking, replay/conflict semantics, and
webhook error redaction.

From `verglos-cli`:

```text
pnpm exec tsc -p packages/cli/tsconfig.json --noEmit
pnpm exec tsc -p packages/shared/tsconfig.json --noEmit
```

Both typechecks passed. From `packages/cli`:

```text
node --import tsx --test \
  src/credentials.test.ts \
  src/monitor.test.ts \
  ../shared/src/spec-validation-corpus.test.ts
```

Result: **17 pass, 0 failures**. The focused cases cover canonical HTTPS API
origins, rejection of unsafe origins before bearer use, monitor behavior, and
required SARIF/CycloneDX/SPDX/in-toto/detect-secrets validation corpus fields.

## Acceptance boundary

This is fresh current-head regression and type qualification. It does not
prove the remaining provider subscription authorization, renewal, expiry,
refund/replay, signed-delivery, entitlement reconciliation, Production
billing, independent AppSec, legal, trusted-publishing, customer-consent, or
final-POC gates. No checkbox is closed from this batch.

## Write boundary and score

- No Production, provider, database, migration, payment, entitlement,
  account, customer, or manual-row write occurred.
- Dependency setup recreated only ignored local `node_modules`; no source or
  lockfile change was made.
- Score remains **219 checked / 61 unchecked / 280 total (78.2%)**.

