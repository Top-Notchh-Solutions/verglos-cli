# HUNT-008 requalification and external-gate block — 2026-10-10

## Local result

The current pinned CLI checkout was qualified with:

```text
pnpm --filter @verglos/hunt test
```

The package build and tests completed successfully: **45 executable tests
passed**, **16 Docker integration tests were explicitly skipped**, and **0
tests failed**. The skips require a pinned test image and Linux host namespace
evidence; they are not treated as failures or as independent review.

A supplementary pinned Docker run is recorded separately at
`docs/shipping/evidence/hunt-008-docker-adversarial-macos-2026-10-10.md`:
**60 passed / 1 skipped / 0 failed** on macOS arm64. The Linux-only namespace
assertion remained explicitly skipped.

The run covers the bounded Docker invocation/runner contracts, A1 adapter,
recipe catalog positive/negative/timeout/failure fixtures, cleanup, redaction,
trust/approval binding, and canonical verdict behavior. No remote recipe,
customer repository, provider, Production, database, or entitlement state was
accessed or changed. The supplied gate-testing environment was not needed for
this local qualification and was not read or printed.

## Why HUNT-008 remains open

The backlog acceptance criteria still require artifacts that local tests cannot
create:

- an authenticated recipe publisher root and immutable provenance/license
  record;
- supported-rule/content authorization and qualified command/approval wiring;
- an independent AppSec review of the execution boundary.

The fixed A1 catalog is intentionally not a trusted publisher feed and does
not authorize arbitrary recipe execution. Keep `HUNT-008` unchecked and park
it. `HUNT-009`, `HUNT-010`, and `HUNT-011` remain downstream or independently
gated; this is not a reason to mark any of them complete.

## Owner and unblock

Owner: product/release owner for recipe provenance and an independent AppSec
reviewer who did not implement the Hunt sandbox.

Unblock artifact: signed publisher/license/provenance records, the bounded
approval-wiring qualification, and an independently signed review packet tied
to the exact CLI commit and Linux/Docker adversarial results.

Review: 2026-10-11 IST or when those artifacts are available.
