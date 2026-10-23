# GITHUB-WEB-001 installation identity qualification · 2026-10-19

**Disposition:** `GITHUB-WEB-001` is complete and checked. Its lifecycle,
delivery/replay, uninstall/recovery, and final cutover acceptance remain in
the separate GITHUB-WEB-002–004 rows.

## Exact implementation qualification

- **Repository:** `anuragyadav-git/verglos-web`
- **Source commit:** `0719074d5a6f83198f5e36c0eeb064f2a12e1b1b`
- **Worktree:** disposable clean qualification worktree
  `/private/tmp/verglos-web-qual-web-005-route-e2e-20261019`
- **Runtime:** macOS Darwin arm64; Node `v26.4.0`; pnpm `10.34.5`
- **Contract result:** 25/25 passed, 0 failed, 0 skipped, exit 0.

The focused suite covered immutable GitHub identity normalization, rejection
of owner-name-only and cross-account binding, least-privilege permissions,
multi-repository token scope, provider-derived identity, stale-repository
reconciliation, duplicate-selection refusal, installation admission, and
tenant-scoped SCM route projections.

## Live provider observation

Read-only inspection used the existing authenticated Chrome pages; no tab or
window was created and no GitHub mutation was issued.

- **Organization:** `Top-Notchh-Solutions`, GitHub account ID `287223982`
  (`O_kgDOER6wrg`)
- **Application:** `Verglos Organization SCM Checks`, developed by
  `Top-Notchh-Solutions`
- **Installation:** `172686102`, installed on the organization
- **Repository scope:** `Only select repositories`; selected
  `Top-Notchh-Solutions/verglos-cli`
- **Repository identity:** numeric repository ID `1310272752`
  (`R_kgDOThks8A`)
- **Permissions:** read metadata; read/write checks
- **App purpose shown by GitHub:** least-privilege SCM checks for Verglos
  security decisions

The organization and repository IDs were independently read from the public
GitHub API, while the installation ID, permissions, selected-repository scope,
and installed state were read from the authenticated organization installation
page. The API query was read-only and returned the matching immutable IDs.

## Evidence integrity

- Focused Web contract log SHA-256:
  `4b9f00fc6ceea9867be8fb8ea98eb61d933b250b71eb67e03a13f6c394f68ce2`
- Preserved log:
  `docs/shipping/evidence/artifacts/github-web-001-2026-10-19/web-contract-tests.log`
- No tokens, private keys, webhook payloads, customer source, or cookies were
  copied into this tracker.

## Acceptance boundary

This evidence closes only the immutable GitHub account/repository/install-
identity, organization ownership, bounded selected-repository scope, and
least-privilege permission contract. GITHUB-WEB-002 remains open for provider
token/lifecycle observation; GITHUB-WEB-003 remains open for live delivery,
replay, and reconciliation; GITHUB-WEB-004 remains open for complete
authorized organization cutover and recovery acceptance. Hunt/AppSec state is
unchanged.
