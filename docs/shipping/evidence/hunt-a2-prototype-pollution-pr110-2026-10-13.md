# HUNT-008 A2 prototype-pollution contribution evidence

Date: 2026-10-13

## Public change identity

- Repository: `Top-Notchh-Solutions/verglos-cli`
- Contribution PR: https://github.com/Top-Notchh-Solutions/verglos-cli/pull/110
- Source commit: `34ab084db269b07095a3fc957c9e8657f195bb93`
- Merge commit: `65cfd8940cd9e9b219bbe10198f5c65852689f43`
- Merge parents: `16fdafd814e0ee2d161243cf53d86a425075800e` and
  `34ab084db269b07095a3fc957c9e8657f195bb93`
- Merge mode: regular two-parent merge; no squash and no force-push
- Package version under test: `2.0.0-alpha.1`

## Implemented contract slice

- Added scanner detector `D1-008` for the bounded prototype-pollution object
  merge pattern and its explain-bank remediation mapping.
- Added the signed A2 catalog descriptor
  `a2-prototype-pollution-harness`.
- Added a sanitized target-code fixture with vulnerable and safe merge paths.
- Added a bounded target harness covering positive, negative, unsupported,
  timeout, and adapter-failure outcomes with strict one-line results.
- Extended the public catalog, fixture matrix, Hunt package tests, Docker
  adapter expectations, CLI all-family qualification, and README to include
  the eighth A2 target family.

## Evidence and commands

All commands below ran from the clean public contribution worktree at the
source commit before merge unless stated otherwise.

- `pnpm install --frozen-lockfile` — completed successfully.
- `pnpm --filter @verglos/shared build` — passed.
- `pnpm --filter @verglos/hunt build` — passed.
- `pnpm --filter @verglos/scanner test` — passed, including the new `D1-008`
  scanner assertions (`2/2` for the new detector test).
- `pnpm --filter @verglos/hunt test` — all executed non-Docker tests passed;
  the package's Docker integration and 16 adversarial runtime tests remained
  explicitly skipped unless their dedicated opt-in environment is enabled.
- `docker info` — passed on Docker Desktop 29.7.2, linux/arm64.
- `VERGLOS_HUNT_DOCKER_TARGET_INTEGRATION=1 node --test --test-concurrency=1
  packages/hunt/dist/target-harness-fixtures.test.js` — passed `3/3`, including
  positive/negative/unsupported execution and timeout/adapter-failure coverage;
  the Docker matrix exercised all eight A2 families.
- `VERGLOS_HUNT_DOCKER_TARGET_INTEGRATION=1 pnpm exec tsx --test
  --test-concurrency=1 src/hunt-execute.test.ts` from `packages/cli` — passed
  `6/6`, including the public CLI all-family qualification.
- `pnpm exec turbo run build --filter=verglos... --force` — `7/7` packages
  successful.
- `pnpm exec turbo run typecheck --filter=verglos... --force` — `13/13` tasks
  successful.
- `git diff --check` — passed.

The protected public checks also passed after one isolated Windows Node 20
teardown retry:

- Platform matrix run `38362298810` — Linux, macOS, and Windows Node 20/22/24
  all passed; the successful retry job was `115182070394`.
- in-toto release binding — passed (`115182108229`).
- Verglos self-scan — passed (`38362298762`).

The first Windows Node 20 attempt failed only while removing a temporary test
directory (`ENOTEMPTY`) after its test cases had passed; rerunning the failed
job completed green. This is recorded as CI evidence, not hidden as a pass on
the first attempt.

## Boundary and authorization

Top Notchh Solutions, as repository owner/operator, authorized this public-safe
implementation contribution and the local Docker qualification. The fixture is
sanitized and deterministic; no customer source, customer data, secret,
provider, entitlement, database, Production, npm publication, or hosted target
was used or written. Owner authorization does not constitute independent AppSec
review, provider confirmation, customer acceptance, legal clearance, or hosted
entitlement evidence.

## Acceptance disposition

This packet evidences an implementation increment for HUNT-008:

1. `D1-008` has explicit detector, remediation, test, and catalog binding.
2. The prototype-pollution reference harness has bounded positive, negative,
   unsupported, timeout, and adapter-failure outcomes.
3. The local pinned-Docker target path and public CLI qualification exercise
   the expanded eight-family matrix.
4. Public protected CI, in-toto binding, and self-scan are green after merge.

HUNT-008 remains unchecked. Its complete acceptance still requires the full
per-family target contract beyond this single family, supported-rule approval,
trusted/licensed release treatment, hosted entitlement, any required
Linux/Docker host qualification, independent review, and final release
acceptance. The backlog score therefore remains **228 checked / 52 unchecked /
280 total (81.4%)**; no checkbox changed.
