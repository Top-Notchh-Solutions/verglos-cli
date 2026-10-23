# HUNT recipe fixture-contract implementation evidence

- **Date:** 2026-10-14
- **Public repository:** `Top-Notchh-Solutions/verglos-cli`
- **Pull request:** [#125](https://github.com/Top-Notchh-Solutions/verglos-cli/pull/125)
- **Contribution commits:**
  `677233e57e514390afc44a5dd17222f156ca1b41`,
  `b01f1a9d50063fe545cef11f46163033e2eb434b`
- **Normal merge:** `ba6c75b4e1d11b59f1e6e7bf13edc3c4be02b13a`

## Implemented contract

Every parsed Hunt recipe now carries explicit references for the five bounded
fixture classes required by the execution contract: positive, negative,
timeout, infrastructure failure, and unsupported. Fixture IDs must be unique,
and the expected verdicts are fixed to `confirmed`, `not-reproduced`,
`inconclusive`, `environment-error`, and `not-supported`, respectively. The
references identify fixture implementations; they do not carry raw target
input or source content. The recipe digest therefore commits to the fixture
contract wherever trust and execution bindings already commit to the recipe.

The public release-verification and clean-consumer scripts now use the same
contract, so package qualification exercises the shipped schema rather than a
test-only shape.

## Verification

- Local full CLI test command exited 0 with zero failures; existing
  environment-gated Docker/A2 cases remained explicit skips.
- Shared package test suite passed after the verdict mapping correction.
- Hunt package test suite passed: 76 passed, 21 explicit Docker/integration
  skips, 0 failed.
- `pnpm build` passed all 8 workspace builds.
- `node scripts/verify-hunt-fixtures.mjs` passed positive, negative, timeout,
  and adapter-failure cases with bounded redacted output.
- Public boundary audit passed.
- Protected PR run `38545037960` passed all 11 required matrix/binding jobs;
  public self-scan `38545037969` passed.

## Acceptance boundary

This is implementation and public fixture-contract qualification only. It does
not close HUNT-008 or any dependent row. Supported-rule approval,
trusted/licensed recipe provenance, authorized target/corpus qualification,
Linux/Docker external review, independent AppSec review, hosted entitlement or
provider evidence, customer/field acceptance, `.vgl` binding, and final release
criteria remain open. No checkbox or score changed: **228 checked / 52
unchecked / 280 total (81.4%)**.

No npm publication, production deployment, customer source, secret, or private
shipping document entered the public repository. No squash, rebase, force-push,
empty commit, or artificial contribution activity was used.
