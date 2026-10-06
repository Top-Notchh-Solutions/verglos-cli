# QUAL-CLI-006 / DIST-001 / DIST-003 release-artifact qualification — 2026-10-06

## Scope and boundary

- Source was the merged CLI `origin/main` at `dacd286c78378e41b503a4874f93c939e92e6c15`.
- Qualification ran in an isolated detached worktree. A temporary pnpm
  `supportedArchitectures` overlay installed the lockfile's Darwin, Linux,
  and Windows arm64/x64 optional package manifests; the overlay was not a
  repository change.
- No npm publication, tag, deployment, production database access, provider
  operation, or customer operation occurred. R-041 remains open and blocks
  production access.

## Passing evidence

- `pnpm build`: 8/8 workspace build tasks passed.
- Release-script tests: 20/20 passed across SBOM, SPDX, notices, license
  inventory, public packing, clean consumer, release artifact, and release
  tag coverage.
- Package contents audit: 6 public packages passed.
- Packed manifest audit: 6 archives passed; no forbidden files, unresolved
  workspace dependencies, or license-file mismatch.
- Public boundary audit passed.
- `v2.0.0-alpha.1` matched all 6 public package versions.
- Clean consumer installed all 6 archives, imported all libraries, executed
  `Verglos 2.0.0-alpha.1`, and confirmed no external engine installation.
- Upgrade/rollback passed: `1.8.3 -> 2.0.0-alpha.1 -> 1.8.3`.
- Hosted in-toto evidence remains green in run `37497389053`; the local
  `in-toto-verify` executable was not installed in this environment.

## Strict release result

The strict verifier did not pass. It correctly rejected the generated
`dependency-license-inventory.json` because 8 redistribution reviews remain:

1. `glob@13.0.6`, `lru-cache@11.5.2`, `minimatch@10.2.6`,
   `minipass@7.1.3`, `minipass-flush@1.0.7`, and `path-scurry@2.0.2` use
   BlueOak-1.0.0 and require legal/redistribution review.
2. `benchmark@1.0.0` nested under `fast-uri@3.1.7` has a nested-license
   conflict with its container and requires review.
3. `minipass-pipeline@1.2.4` has missing source metadata and requires review.

The six archive and sidecar SHA-256 values are recorded in the isolated
qualification output; the strict gate remains open until those reviews are
resolved and the verifier passes with zero blockers.

Archive digests:

```text
98cf8e7606319a071d8abcfc692b45b33de1ca1102f8c10b3ecdb975fde65657  verglos-2.0.0-alpha.1.tgz
1c6ddced19bea3a11e8d96d175e51f4078bef3c1abd80c07ff7aed8ec77e2d9e  verglos-entitlement-2.0.0-alpha.1.tgz
cee91197cbd715588c1aac7d0f878ba995a9031a00e80f7037344d97a440a55d  verglos-mcp-2.0.0-alpha.1.tgz
d05ababe772b02043af4a685fe30f069841255e84e4e38cf79639a10c3203148  verglos-reporter-2.0.0-alpha.1.tgz
4bf269d0807c81e3126dd95d8b767dac5287520a9c0075a025b37a9b7ff6bdf9  verglos-scanner-2.0.0-alpha.1.tgz
5f2d99e2719a1aa0a12027598f3539dd136104e52857294fd8c2125104da80b9  verglos-shared-2.0.0-alpha.1.tgz
```

## Decision and follow-up

- QUAL-CLI-006 and DIST-001/003 remain unchecked.
- No public release or npm publication is authorized.
- Next independent batch remains PLAN-CLI-004 supported-version compatibility
  fixtures, followed by QUAL-WEB-006 authenticated dashboard accessibility and
  performance evidence.
