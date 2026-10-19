# ACCEPT-002 current-source substrate verification — 2026-10-19

This is a private, repository-owned substrate requalification. It does not
claim hosted, provider, customer, reviewer, browser-human, field-CWV,
migration, or production acceptance.

## Inputs and command

- CLI source: `50bcab42eadfa8796d86d1f7a8aaee3010c65647`
- Web source: `390fd3f82b2a59003e30e2362ab593ef1db4b982`
- CLI root: `/tmp/verglos-dist-qual-20261019`
- Web root: `/tmp/verglos-web-team-cli-qual-20261019`
- Command: `VERGLOS_CLI_ROOT=... VERGLOS_WEB_ROOT=... VERGLOS_ACCEPTANCE_STORIES_OUTPUT=... node scripts/verify-acceptance-stories.mjs`
- Environment: macOS Darwin 25.5.0 arm64, Node `v26.4.0`, pnpm `9.15.9`
- Generated result: `acceptance-stories-verification-2026-10-19.json`

## Results

| Surface | Tests | Passed | Skipped | Failed | Exit |
| --- | ---: | ---: | ---: | ---: | ---: |
| CLI package suite | 293 | 291 | 2 | 0 | 0 |
| Web full suite | 975 | 945 | 30 | 0 | 0 |
| Composed Team/Studio/Enterprise/quality substrates | 74 | 74 | 0 | 0 | 0 |

The verifier returned `allCommandsPassed: true`. The two CLI skips and thirty
Web skips are the repository’s explicit environment-gated skips; no failure
was converted into a skip.

The verifier now also enforces a twelve-entry execution plan in private
commit `2c24069b`. All 12 stories have `substrateExecuted: true` and the
generated result records `storyCoverageComplete: true`. Open statuses remain
explicit for Hunt isolation, modified-CLI runtime, Studio recipient,
Enterprise runner, and account deletion; this field is coverage accounting,
not acceptance or security sign-off. The new plan regression tests pass **3/3**.

## Disposition

This advances current-source regression evidence for ACCEPT-002/003 only.
The acceptance story map still classifies Hunt isolation, modified-CLI
runtime, Studio recipient, Enterprise runner, and account deletion as open
qualification/customer/provider stories. ACCEPT-002 and ACCEPT-003 remain
unchecked until their required hosted/provider/customer/reviewer evidence is
actually supplied. No production write, migration, payment, publication, or
AppSec state changed.
