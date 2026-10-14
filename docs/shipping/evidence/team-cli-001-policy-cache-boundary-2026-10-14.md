# TEAM-CLI-001 organization-policy cache boundary evidence

Date: 2026-10-14

## Public implementation

- Repository: `Top-Notchh-Solutions/verglos-cli`
- Pull request: [#124](https://github.com/Top-Notchh-Solutions/verglos-cli/pull/124)
- Contribution commit: `cc27a121a13025977a78521d59192279e93799cb`
- Normal merge commit: `4642f7d43141e23f0d73b7a245767393bb63d644`
- No squash, rebase, force-push, empty commit, or artificial contribution
  activity was used.

## Change

The organization-policy cache now enforces a mode-0700 parent directory
before each atomic mode-0600 replacement. Contract tests verify the directory
and file permissions on POSIX systems. The fetch contract now explicitly
proves that a response which sends headers and then stalls during the bounded
body read falls back to the still-valid verified cache instead of hanging or
accepting an incomplete remote document.

## Verification

- Focused organization-policy cache/fetch tests: **7 passed / 0 failed**.
- Full CLI package test command: exit 0, zero failures; the existing A2
  Docker integration remains the documented explicit skip.
- CLI typecheck: passed.
- CLI build: passed.
- `git diff --check`: passed.
- Public-boundary audit: passed; no internal shipping documents or founder
  assets are tracked.
- Protected platform/in-toto run `38542000125`: all Ubuntu/macOS/Windows
  Node 20/22/24 cells and in-toto binding passed.
- Public self-scan run `38542000081`: passed.

## Acceptance boundary

This is code-side TEAM-CLI-001 progress only. It does not prove production
signer/trust-root activation, provider installation, repository binding,
published Preview policy rows, authenticated live signed fetch/cache/offline/
cross-tenant evidence, or the remaining hosted acceptance criteria.
TEAM-CLI-001 therefore remains unchecked and the score remains **228 checked /
52 unchecked / 280 total (81.4%)**.

No private tracker, credentials, provider state, database, npm publication,
production deployment, or customer source was used or pushed to the public
repository.
