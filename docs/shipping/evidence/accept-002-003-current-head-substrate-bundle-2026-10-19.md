# ACCEPT-002/003 current-head substrate and evidence-bundle qualification · 2026-10-19

## Scope

This packet records the repository-owned acceptance harness against the exact
current CLI and Web merge heads. It proves substrate execution and private
evidence packaging only. It does not claim hosted HTTP, provider, customer,
reviewer, browser-human, field-CWV, migration, Production, or AppSec
acceptance.

## Exact source heads

- CLI: `11734a45740a893c307606e8f3d3f316711abd9e`
- Web: `2c07237845f0e52061dc52c99c21212615390177`
- CLI worktree: `/tmp/verglos-cli-current-release-20261019`
- Web worktree: `/tmp/verglos-web-current-20261019`
- Source and derived output remained private; no customer source or secret was
  included.

## Commands and results

The private verifier was run with explicit roots and wrote
`docs/shipping/evidence/acceptance-stories-verification-2026-10-19.json`.

- `pnpm --silent acceptance:stories:verify`: exit `0`.
- CLI package suite: **312 tests, 310 pass, 0 fail, 2 skips**; output SHA-256
  `104d00f8089d02bf2717b464bd9cb3452c43a68d09e0a3591f0375de6fa7e316`.
- Web full suite: **979 tests, 949 pass, 0 fail, 30 skips**; output SHA-256
  `2753e4b1ff60d6540fe7c4f390fd00b97ce34d5e828069ecb49afeeb8a1314cf`.
- Composed Web Studio/Enterprise/Team/quality substrates: **74/74 pass, 0
  fail, 0 skip**; output SHA-256
  `3322b12774ffc68fee0312a6459c629719d47ac58a05a15a82512ecd8395e1af`.
- All twelve frozen story mappings executed and
  `storyCoverageComplete` is `true`.

The result preserves the correct open states: Hunt isolation is
`qualification-open`, modified CLI is `runtime-qualification-open`, Studio
recipient is `customer-acceptance-open`, Enterprise runner is
`provider-qualification-open`, and account deletion is
`qualification-open`.

The private evidence bundle was then generated with:

`VERGLOS_ACCEPTANCE_BUNDLE_OUTPUT=docs/shipping/evidence/acceptance-evidence-bundle-2026-10-19.json pnpm --silent acceptance:evidence:bundle`

It exited `0`, hashed **17 files**, and its secret-like material scan passed.
The bundle keeps provider lifecycle, customer consent, independent review,
authenticated browser, field-CWV, and account-deletion gates explicitly open.

## Acceptance boundary

`ACCEPT-002` remains unchecked because the twelve-story run is still
repository-owned substrate/regression evidence rather than the required full
hosted/provider/customer acceptance.

`ACCEPT-003` remains unchecked because the reproducible manifest is present,
but reviewer sign-off and the mapped external/hosted evidence are still
missing. No row checkbox changed.

The live private-ledger score remains **239 checked / 41 open / 280 total
(85.4%)**. AppSec/Hunt remains held separately; no Production, provider,
customer, billing, npm, or release state changed.
