# DIST-002 dependency-license remediation audit · 2026-10-22

## Scope

This private packet records a bounded remediation check against the exact
merged CLI head `db3510356ecd6c6e430d7dcb3b9354e514d777ee` (PR #167 merge).
The purpose was to determine whether a safe dependency-only source change
could clear the strict release license gate while preserving the repository's
Node `>=20` support floor and Sigstore behavior.

## Current dependency paths

`pnpm why --recursive` shows the seven current review entries are reachable
through two production paths:

- `@modelcontextprotocol/sdk@1.29.0` → `ajv@8.20.0` →
  `fast-uri@3.1.7`, which bundles `benchmark@1.0.0`.
- `sigstore@4.1.1` → `@sigstore/sign@4.1.1` →
  `make-fetch-happen@15.0.6` → `cacache@20.0.4` and
  `@npmcli/agent@4.0.2`, which bring in `glob@13.0.6`,
  `lru-cache@11.5.2`, `minimatch@10.2.6`, `minipass@7.1.3`,
  `minipass-flush@1.0.7`, and `path-scurry@2.0.2`.

## Verification

- `node scripts/license-inventory.mjs --check` reported lockfile package count
  **254**, one bundled component, and **7** review blockers; the command
  remains intentionally non-zero until the entries are reviewed or removed.
- The bundled `benchmark@1.0.0` entry is declared ISC inside the BSD-3-Clause
  `fast-uri@3.1.7` container and is therefore retained as a nested-license
  conflict rather than waived.
- Registry metadata confirms the current `glob`, `lru-cache`, `minimatch`,
  `minipass`, `minipass-flush`, and `path-scurry` versions are BlueOak-1.0.0.
- The checked fast-uri package versions `3.1.6` through `3.1.9` all retain
  the bundled benchmark package/files, so a fast-uri patch-level change does
  not remove the conflict.
- Earlier Sigstore 5 remediation testing did not preserve the repository's
  Node `>=20` floor. Downgrading the npm fetch/cache chain would still leave
  the `path-scurry` review path and would be an unverified runtime change.

## Disposition

No safe production code or lockfile change was identified that clears all
seven blockers without changing runtime support or bypassing the dependency
license review. No public source, lockfile, tag, registry, provider,
Production, database, customer, legal, or AppSec state changed. No files were
deleted.

`DIST-002` remains unchecked for the explicit legal/license decision,
protected/trusted publisher execution, immutable publication/attestation,
and final acceptance. This packet is evidence for the blocker decision, not a
license approval or a release claim.

## Reproduction boundary

All commands ran in a clean detached worktree at the exact merged head. The
private packet contains no credentials, customer data, or raw registry
artifacts.
