# Acceptance input-read boundaries · 2026-10-23

## Scope

The private acceptance runners now consume JSON manifests through one shared
bounded regular-file reader, `scripts/read-bounded-json.mjs`. The reader:

- rejects invalid paths, non-regular files, and inputs over 16 MiB;
- opens with `O_RDONLY | O_NOFOLLOW` when the platform provides the flag;
- rechecks opened-file identity and size before and after reading; and
- parses only the bytes read from the opened handle as fatal UTF-8 JSON.

The boundary is used by the file runners for authorized workflows, public OSS
triage, comprehension scoring, commercial acceptance, release-gate
reconciliation, candidate freeze, and final regression. Existing output files
remain protected by their separate exclusive `wx` writers.

## Verification

From the private shipping repository:

```text
node --test scripts/read-bounded-json.test.mjs scripts/freeze-release-candidate.test.mjs scripts/reconcile-release-gates.test.mjs scripts/run-final-regression.test.mjs scripts/score-comprehension-test.test.mjs scripts/validate-commercial-acceptance.test.mjs scripts/validate-authorized-workflow.test.mjs scripts/triage-public-oss-corpus.test.mjs
```

Result: **31 tests passed, 0 failed, 0 skipped**. The dedicated reader test
also confirms regular-file acceptance and rejection of a symlink and an
oversized input. `node --check` passed for the changed scripts,
`pnpm acceptance:study-protocols:check` passed, and `git diff --check` passed.

## Shipping boundary

This is repository-owned implementation progress for `ACCEPT-005`,
`ACCEPT-006`, `ACCEPT-008`, `ACCEPT-009`, `ACCEPT-010`, `ACCEPT-012`, and
`ACCEPT-014`. It does not create participant, customer, provider, independent
review, publication, or final-release evidence. Those rows remain open and no
backlog checkbox changed. The live score remains **244 checked / 36 open / 280
total (87.1%)**. No user data, repository, branch, release, provider record,
or prior evidence was deleted or overwritten; test cleanup was limited to the
new temporary directories created by the test runner.
