# ENT-CLI-001 private-runner credential exchange · 2026-10-19

## Scope

This packet records the original production enrollment logic shipped through
the Web and CLI repositories. It is implementation and qualification evidence
for `ENT-CLI-001`; it is not a claim that an enterprise runner was enrolled or
operated against a production tenant.

## Shipped implementation

- Web PR #225 merged normally as `2c07237845f0e52061dc52c99c21212615390177`.
  Implementation `1b4df17` adds `POST /api/v1/private-runner/enroll`; the
  route consumes the existing one-time owner-issued enrollment token, atomically
  activates the bound runner, clears the enrollment digest, and returns a
  one-time `prc_` credential with a bounded 30-day expiry. Only an HMAC digest
  of the runner credential is stored.
- Web migration `0042_private_runner_credentials.sql` adds the credential
  digest, expiry, and unique index without destructive schema operations.
  Poll and result routes now accept only the active runner credential, enforce
  the exact tenant/runner binding, reject the owner license bearer, and retain
  lease, replay, result-fencing, and source-free projection behavior.
- CLI PR #152 merged normally as
  `11734a45740a893c307606e8f3d3f316711abd9e`. Implementation `aed92de` adds
  `verglos runner enroll <tenantId> <runnerId> <enrollmentToken>` against the
  fixed API route. The credential is validated and persisted through the
  existing mode-restricted credentials store; poll and upload use the persisted
  runner bearer rather than the owner license. Regression `b36e2bad` remains a
  separate commit.
- The implementation accepts no caller-provided API route override, command,
  source payload, secret, or raw target output. The existing signed-job and
  allowlist protocol remains the authority for what a runner may execute.

## Verification

- Web focused contracts: **24/24**, zero failures/skips.
- Web disposable PostgreSQL lifecycle: **1/1**, using the pinned
  `postgres:15-alpine@sha256:2bf082886c059b4cf5af3f9e8d3a8916c35699062899061c13bc32d5921c631a`.
  This covered one-time redemption, replay refusal, owner-bearer refusal,
  runner polling, upload, idempotent replay, conflict, concurrency, and tenant
  fencing.
- Web typecheck, ordered migration audit (**43 migrations**), optimized build
  (**49/49 pages**), and `git diff --check` passed.
- CLI private-runner client tests: **10/10**, zero failures/skips; CLI
  typecheck, production build, and `git diff --check` passed.
- Hosted Web PR #225 passed isolated PostgreSQL, macOS/Ubuntu/Windows protocol
  cells, typecheck/schema, Vercel, Preview Comments, and GitGuardian checks.
- Hosted CLI PR #152 passed Ubuntu/macOS/Windows Node 20/22/24 cells,
  official standard/provenance validation, in-toto release binding, self-scan,
  and GitGuardian.

## Acceptance boundary

`ENT-CLI-001` remains unchecked. The code path is now real and merged, but the
row still requires an authorized deployed-tenant enrollment, approved runner
execution and result reconciliation, operational cross-platform evidence,
independent review, and enterprise acceptance. No production credential,
customer source, or customer runner was used by this qualification.

The live private-ledger score remains **239 checked / 41 open / 280 total
(85.4%)**. AppSec/Hunt rows remain held separately; this packet does not open
or waive that gate and does not close unrelated external acceptance rows.
