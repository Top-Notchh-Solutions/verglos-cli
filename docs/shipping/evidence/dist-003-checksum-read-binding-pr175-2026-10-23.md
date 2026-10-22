# DIST-003 checksum read binding · CLI PR #175 · 2026-10-23

## Implementation

CLI source commit `18b6dd7d569bebcd6a20dc397376d8795d8e714b` updates
`scripts/generate-release-checksums.mjs` to read every release artifact through
the bounded regular-file helper. The checksum generator therefore rejects
symlink/non-regular inputs and rechecks the opened file identity/size before
hashing bytes. The source regression test rejects a return to pathname-bound
`readFile(path)` access.

## Verification

- Focused checksum/release-boundary contracts: **26/26 passed**.
- Forced CLI Turbo test/typecheck/build graph: **23/23 tasks passed**.
- `git diff --check`: passed.
- Hosted Standard validation: run `39859012857`, passed.
- Hosted self-scan: run `39859013103`, passed.
- Hosted platform/in-toto matrix: run `39859013466`, passed across Ubuntu,
  macOS, and Windows Node 20/22/24 plus in-toto release binding.
- Normal merge commit: `268dc53987132f02b3daead16ac5ba07aaefdbe7`.

## Boundary

This is code-side DIST-003 progress only. It does not claim legal/license
clearance, trusted or protected publication, immutable public attestation,
provider/Production action, customer acceptance, independent review, or final
release sign-off. No publication, deployment, database, provider, customer,
or release-sign-off state changed; nothing was deleted. Score remains
**239 checked / 41 open / 280 total (85.4%)**.
