# DIST-002/003 registry SemVer hardening — 2026-10-24

## Scope

The CLI stable update channel reads npm package metadata and must not treat
untrusted version keys as valid releases. This change hardens the parser used
by `verglos update` and the update gate without publishing a package or
changing npm state.

## Implementation

- PR #371 merged normally as `0ed84805226cff8fe129596db2c3f3011885f7f7`.
- Release-version numeric components are rejected when they are not safe
  integers instead of being silently coerced through JavaScript `Number`.
- SemVer numeric prerelease identifiers with leading zeroes are rejected.
- Valid stable versions continue to be selected independently of mutable npm
  dist-tags and prereleases.

## Verification

- Focused updater suite: **8/8 passed**, zero failures, skips, cancellations,
  or todos.
- CLI typecheck: passed.
- CLI build: passed.
- Existing untracked JSON evidence fixtures were not staged, changed, or
  deleted.
- The three Actions runs queued by the PR were force-cancelled before merge;
  no paid hosted verification was allowed to continue.

## Boundary

This is production release-channel implementation evidence for DIST-002/003.
It does not constitute trusted npm publication, immutable external
attestation, protected approval, independent review, or final release
acceptance. No registry, provider, customer, database, or deployment write
occurred. The backlog remains **246 checked / 34 open / 280 total (87.9%)**,
split **13 AppSec-dependent / 21 non-AppSec**.
