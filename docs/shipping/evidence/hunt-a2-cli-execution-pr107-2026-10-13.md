# HUNT-009 technical evidence — A2 public CLI execution path

Date: 2026-10-13

## Result

Public CLI PR #107 was squash-merged into `main` as:

`f4fe4987dc4f33c9617b5124574075419fc098a5`

The reviewed source commit was `ca923c4aee0575ed9601366f82d92f2a56f2625f`.
The change connects the public `verglos hunt --execute` path to one signed A2
target-harness recipe and fixes the execution-binding schema so supported
scanner IDs such as `D1-001` are accepted without weakening validation.

## What was qualified

- The opt-in public CLI test signs an A2 SQL/NoSQL injection recipe,
  trust-store entry, and approval for the exact target fixture.
- The command invokes the bounded target-harness adapter with the pinned
  Node image, denied network, non-root execution, read-only target mount,
  bounded resources, cleanup, and redaction requirements.
- The structured result is checked for an authorized recipe, the expected
  target assertion, a confirmed outcome, and absence of the fixture's
  injection string in the result.
- The test is opt-in and remains skipped unless
  `VERGLOS_HUNT_DOCKER_TARGET_INTEGRATION=1` is explicitly set.
- The schema correction accepts the existing uppercase detector/rule IDs
  used by the scanner while preserving Hunt rule-ID and signed-binding
  validation.

## Verification

The focused public CLI qualification passed:

```text
VERGLOS_HUNT_DOCKER_TARGET_INTEGRATION=1 pnpm --filter verglos exec node --import tsx --test --test-name-pattern='signed A2' src/hunt-execute.test.ts
```

Result: 1 test passed, 0 failed.

The affected public CLI package test process exited successfully with the
opt-in integration enabled. The public build passed 8/8 tasks, typecheck
passed 14/14 tasks, and `git diff --check` passed.

Protected GitHub verification for PR #107 passed:

- platform matrix run `38343233763` — Ubuntu/macOS/Windows Node 20/22/24;
- self-scan run `38343233729`;
- in-toto release binding in platform run `38343233763`.

## Public/private boundary

Only public-safe test code, schema validation, and the existing sanitized
reference fixture were included in the public PR. No private tracker content,
deployment details, credentials, provider data, customer source, or consent
records were added. No Production, payment, database, entitlement, account,
or customer-data write occurred.

## Acceptance disposition

This is implementation and qualification evidence for the A2 public command
path. It does not close `HUNT-009` because the row still depends on the
complete HUNT-008 acceptance, hosted entitlement evidence, Linux/Docker
qualification where required, trusted/licensed recipe treatment, and
independent review. The private tracker remains:

**228 checked / 52 unchecked / 280 total (81.4%)**.

