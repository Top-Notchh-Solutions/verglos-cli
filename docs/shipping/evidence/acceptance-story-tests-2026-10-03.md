# Acceptance-story substrate verification — 2026-10-03

## Scope

This evidence records tests run against the latest unreleased CLI source at
`955412516b96cc09393e78c43bf7d02b9abd05d9` and Web `main` at
`763aab07a19f054dee41dc83ab9ec9f0743b4925`. It is substrate and regression
evidence only; it does not claim hosted HTTP, live billing, customer consent,
independent review, screen-reader, field-CWV, or production acceptance.

## CLI

The first attempt used `node --import tsx` from the monorepo root of the
temporary worktree. That invocation failed before loading tests because the
root does not expose `tsx`; it was a harness-resolution error, not a product
test failure. The package-owned runner was then used.

Command:

```text
pnpm --filter verglos test
```

Result: **236 tests, 236 passed, 0 failed, 0 skipped**.

Additional package-owned checks:

```text
pnpm --dir packages/cli exec node --import tsx --test --test-concurrency=1 \
  ../hunt/src/docker-adapter.test.ts
```

Result: **5/5 passed**. The checks cover pinned image/deny-by-default
invocation, mutable-image and unsafe-input rejection, malformed runtime
shapes, project-root symlink validation, and in-root link handling.

## Web acceptance substrates

Command:

```text
node --import tsx --test --test-concurrency=1 \
  src/lib/organizations/studio-e2e.test.ts \
  src/lib/organizations/enterprise-e2e.test.ts \
  src/lib/organizations/team-e2e.test.ts \
  src/lib/qual/qual-web-suites.test.ts
```

Result: **72 tests, 72 passed, 0 failed, 0 skipped**. The run composes Studio,
Enterprise, Team, authorization/privacy/deletion, and accessibility/performance
decision substrates in-process. It does not substitute for authenticated
dashboard browser evidence or real external-provider/customer workflows.

## Acceptance corpus binding

The reproducibility harness `pnpm --silent acceptance:corpus:verify` verified six
full, non-shallow fixture clones, exact pinned commits, authorization metadata,
complete scanner coverage, and report hashes. Its manifest hash is
`54c3f3bdc111d3a2faf35c841a8fb057649b6a859a5a45f9628945100ea8b2f4`; the
CLI source binding is the commit above. The machine-readable result is
`docs/shipping/evidence/acceptance-corpus-verification-2026-10-03.json`.

## Boundary

No backlog checkbox is closed by this file. Remaining gates include live HTTP
routes/provider evidence, customer authorization, legal/licensing approval,
independent Hunt review, authenticated organization-dashboard interaction,
human screen-reader review, large-dataset and field-CWV evidence, and final
release/marketing truth review.

## Reproducible cross-repository runner

Private command `pnpm --silent acceptance:stories:verify` reran the repository-
owned commands and wrote `docs/shipping/evidence/acceptance-stories-
verification-2026-10-03.json`. It bound CLI
`955412516b96cc09393e78c43bf7d02b9abd05d9` and Web
`763aab07a19f054dee41dc83ab9ec9f0743b4925` and reported:

- CLI package suite: 236/236 passed, 0 skipped.
- Web full suite: 877/905 passed, 28 environment-gated skips, 0 failures.
- Web composed acceptance substrates: 72/72 passed, 0 skipped.

Each command's output hash is retained in the machine-readable result. The
runner is private and fail-closed; a failed command exits non-zero.
