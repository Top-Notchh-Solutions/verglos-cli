# DIST-002 current merged-head release workflow requalification · 2026-10-22

## Scope

This packet records the current public CLI release workflow at merged head
`db3510356ecd6c6e430d7dcb3b9354e514d777ee` (PR #167 merge). It rechecks the
repository-owned OIDC/provenance, protected-environment, immutable-tag,
artifact, and publication-preflight contracts without starting a release or
mutating the npm registry.

## Verification

- The focused release contract set passed **19/19**, with 0 failures and 0
  skips. It covers the publish workflow boundary, exact tag/source binding,
  release origin/checksums, public package preflight, and strict release
  artifact verification.
- `node scripts/verify-release-rollback-rehearsal.mjs` passed with **5**
  bounded operations and **2** preserved historical records.
- `node scripts/license-inventory.mjs --require-clear` exited **2** as
  designed because seven dependency review entries remain unresolved:
  `benchmark@1.0.0` nested under `fast-uri@3.1.7`, plus BlueOak review for
  `glob@13.0.6`, `lru-cache@11.5.2`, `minimatch@10.2.6`, `minipass@7.1.3`,
  `minipass-flush@1.0.7`, and `path-scurry@2.0.2`.

The workflow still requires OIDC `id-token: write`, the protected `release`
environment, immutable tag/source matching, `--provenance`, and no
long-lived npm-token path. No tag, protected-environment approval, trusted
publisher enrollment, legal/license approval, npm publication, immutable
attestation, provider, Production, database, customer, or AppSec state
changed.

## Disposition

`DIST-002` remains unchecked. The repository implementation and negative-path
contracts pass, but the row still needs DIST-001, protected/trusted-publisher
execution, legal/license clearance, and a real immutable publication and
attestation. The seven license entries are an explicit blocker, not waived by
the test pass.

Current score: **239 checked / 41 open / 280 total (85.4%)**.
