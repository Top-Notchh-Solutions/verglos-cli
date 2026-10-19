# ACCEPT-002 current-source substrate verification — 2026-10-19

This is a private, repository-owned substrate requalification. It does not
claim hosted, provider, customer, reviewer, browser-human, field-CWV,
migration, or production acceptance.

## Inputs and command

- CLI source: `0823b513f2b1810ad9f6afcb8806ba46f61feedb`
- Web source: `0719074d5a6f83198f5e36c0eeb064f2a12e1b1b`
- CLI root: `/private/tmp/verglos-cli-studio-upload-20261019`
- Web root: `/private/tmp/verglos-web-qual-web-005-route-e2e-20261019`
- Command: `VERGLOS_CLI_ROOT=... VERGLOS_WEB_ROOT=... VERGLOS_ACCEPTANCE_STORIES_OUTPUT=... node scripts/verify-acceptance-stories.mjs`
- Environment: macOS Darwin 25.5.0 arm64, Node `v26.4.0`, CLI pnpm `9.15.9`, Web pnpm `10.34.5`
- Generated result: `acceptance-stories-verification-2026-10-19.json`
- Result SHA-256: `3e8707d4224fa2dfbfd509707b44b67e82ea51533574588766ee78f7a60127ce`
- Terminal log SHA-256: `863cf587ef15745caab0670644b8e3d00bb5ba0a1811798230811119def63bec`
- Acceptance evidence bundle rerun: 17 files, secret scan passed; bundle
  SHA-256 `a45de0bac980edde20c610892c16b9617808b646e4ae06b1f23654891310d7c8`.

## Results

| Surface | Tests | Passed | Skipped | Failed | Exit |
| --- | ---: | ---: | ---: | ---: | ---: |
| CLI package suite | 309 | 307 | 2 | 0 | 0 |
| Web full suite | 977 | 947 | 30 | 0 | 0 |
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
