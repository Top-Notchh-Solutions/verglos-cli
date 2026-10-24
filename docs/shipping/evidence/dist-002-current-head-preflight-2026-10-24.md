# DIST-002 current-head release preflight receipt

Date: 2026-10-24

## Exact source and provider boundary

- CLI candidate source: `bcb30a7ed645b21ec150e22929f7bd2960b5c7c3`.
- Candidate package version: `2.0.0-alpha.4`.
- Release tag input used only for local metadata generation:
  `v2.0.0-alpha.4`; no Git tag was created or pushed.
- Registry/provider boundary: no npm request that could publish, no tag push,
  no workflow dispatch, no environment approval, and no token use.

## Contract and license checks

- Current release/trusted-publishing contract suite: **19/19 passed**, **0**
  failures, skips, or cancellations.
- `node scripts/license-inventory.mjs --require-clear`: exit **0**.
- Inventory: **254** lockfile package IDs, **250** package entries, **1**
  bundled component, **0** review blockers.
- The workflow remains bound to stable-only immutable tags, exact tag/commit
  verification, protected `release`, serialized publication, GitHub OIDC,
  seven exact public packages, and `VERGLOS_FINAL_RELEASE_READY=true`.

## Local artifact and consumer qualification

The local preflight packed the seven public archives and generated the required
notices, SBOMs, external-license records, release notes, origin metadata, and
checksums. Results:

- packed-manifest audit: **7/7** archives passed;
- strict release verifier: **15** release artifacts verified (**7** npm
  archives, **8** sidecars, with notices in every archive);
- clean consumer: installed all **7** archives, imported all libraries,
  executed Verglos `2.0.0-alpha.4`, confirmed no external engine installation,
  and executed the signed `a1-utf8-contains` fixture through the bounded
  restricted-process runtime with an isolated Pro capability fixture;
- `SHA256SUMS` digest:
  `sha256:c524585a6fd3f6959fd1ad1df362e9b93df3322dfc7d76363b7e499e0a07a96f`;
- release metadata binds version `2.0.0-alpha.4`, source commit
  `bcb30a7ed645b21ec150e22929f7bd2960b5c7c3`, and local tag input
  `v2.0.0-alpha.4`.

## Shipping disposition

This advances the complete code-side and local artifact preflight for
`DIST-002`. Keep the row unchecked for protected-environment approval, trusted
npm publisher enrollment, legal/release clearance, one actual immutable
publication with provider provenance, and final acceptance. No provider,
registry, Production, customer, tag, or release state changed; no files or
branches were deleted.
