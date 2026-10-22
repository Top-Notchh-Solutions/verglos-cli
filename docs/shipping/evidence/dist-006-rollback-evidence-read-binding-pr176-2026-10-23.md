# DIST-006 rollback-evidence read binding · CLI PR #176 · 2026-10-23

## Implementation

CLI source commit `09e68dbe12abb40c36a009542418b618910a0594` updates
`scripts/release-rollback-evidence.mjs` so the fixed rollback rehearsal
manifest is read through the bounded regular-file helper before its digest is
computed. The regression test rejects a return to pathname-bound
`readFile(manifestPath)` access.

## Verification

- Focused rollback-evidence/rollback-plan contracts: **2/2 passed**.
- Forced CLI Turbo test/typecheck/build graph: **23/23 tasks passed**.
- `git diff --check`: passed.
- Hosted Standard validation: run `39860531289`, passed.
- Hosted self-scan: run `39860531105`, passed.
- Hosted platform/in-toto matrix: run `39860530997`, passed across Ubuntu,
  macOS, and Windows Node 20/22/24 plus in-toto release binding.
- Normal merge commit: `fe7ea848c7e9e5b5ec12245c288ce44b7cc4a793`.

## Boundary

This is code-side DIST-006 progress only. It does not claim an authenticated
provider/registry/engine-feed/signing/deployment rollback, legal/license
clearance, customer acceptance, independent review, Production action, or
final release sign-off. No publication, deployment, database, provider,
customer, or release-sign-off state changed; nothing was deleted. Score
remains **239 checked / 41 open / 280 total (85.4%)**.
