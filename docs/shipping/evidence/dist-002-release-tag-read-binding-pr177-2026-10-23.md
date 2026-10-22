# DIST-002 release-tag read binding · CLI PR #177 · 2026-10-23

## Implementation

CLI source commit `d6bb2851d869a32246222e003d9e6d3898cedb56` updates
`scripts/verify-release-tag.mjs` so all seven public package manifests are
read through the bounded regular-file helper before version comparison. The
source regression rejects a return to pathname-bound manifest reads.

## Verification

- Focused release contracts: **11/11 passed**.
- Forced CLI Turbo test/typecheck/build graph: **23/23 tasks passed**.
- `git diff --check`: passed.
- Hosted Standard validation: run `39861975912`, passed.
- Hosted self-scan: run `39861975908`, passed.
- Hosted platform/in-toto matrix: run `39861975924`, passed across Ubuntu,
  macOS, and Windows Node 20/22/24 plus in-toto release binding.
- Normal merge commit: `a21938b951497a4b47536afa84951f94306aa50d`.

## Boundary

This is code-side DIST-002/003 progress only. It does not claim trusted or
protected npm publication, immutable attestation, legal/license clearance,
provider/Production action, customer acceptance, independent review, or final
release sign-off. No publication, deployment, database, provider, customer,
or release-sign-off state changed; nothing was deleted. Score remains
**239 checked / 41 open / 280 total (85.4%)**.
