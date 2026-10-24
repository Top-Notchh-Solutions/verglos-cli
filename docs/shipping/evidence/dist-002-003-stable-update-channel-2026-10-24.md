# DIST-002/DIST-003 stable update-channel implementation · 2026-10-24

## Scope

This receipt records a real CLI implementation change for the distribution and
release-preparation substrate. It does not close either backlog checkbox.

## Production observation

The public npm registry currently reports `2.0.0-alpha.1` for both its
`latest` and `alpha` dist-tags, while the newest stable package version is
`1.8.3`. The previous updater queried the mutable `latest` endpoint and would
therefore have moved a stable installation to the public qualification
prerelease.

## Implemented change

- `verglos update` now reads the package metadata endpoint and selects the
  highest valid stable SemVer from `versions`, ignoring prereleases and
  mutable dist-tags.
- SemVer comparison now handles stable-versus-prerelease ordering.
- The installer uses `npm install -g verglos@<selected-stable-version>` rather
  than the mutable `verglos@latest` tag.
- CLI help and README examples explicitly say “latest stable npm version”.

Code commit `3217991628c2834dcdb4eaf922769b1a509e4838` was merged normally in
CLI PR [#365](https://github.com/Top-Notchh-Solutions/verglos-cli/pull/365) as
merge commit `d657889d39c3a3090d5f8411a81d7b1adc6d9f2f`.

## Verification

- Focused updater tests: **8/8 passed**.
- CLI typecheck: passed.
- CLI build: passed.
- Full CLI package suite: exited successfully; the only skips were the
  existing opt-in Docker/Hunt cases.
- Direct registry-backed `fetchLatestVersion()` result: `1.8.3`.
- `git diff --check`: passed.

The PR's queued GitHub Actions runs were force-cancelled before they could
consume paid runner minutes. No package was published, no version was
released, and no files or evidence were deleted.

## Shipping boundary

This is implementation and release-preparation evidence only. DIST-002 and
DIST-003 remain unchecked for trusted/protected publication, immutable
attestation, provider/Production publication action, independent review, and
final release acceptance. Score remains **246 checked / 34 open / 280 total
(87.9%)**, split **13 AppSec-dependent / 21 non-AppSec**.
