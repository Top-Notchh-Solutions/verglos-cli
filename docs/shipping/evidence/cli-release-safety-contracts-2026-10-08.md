# CLI release-safety contract qualification — 2026-10-08

## Batch boundary

- **Relevant backlog:** `DIST-001`, `DIST-003`, `DIST-006`, `QUAL-CLI-006`
- **CLI source:** exact current worktree commit `7d060b2852551cc017bbb2b5f70bad22843e7273`
- **Scope:** local contract and verifier tests; no registry, deployment,
  signing-service, provider, or production state

## Results

- CLI rollback-plan tests: **2 passed / 0 failed**
- Shared rollback and release-decision tests: **13 passed / 0 failed**
- Package-surface, release-artifact, and immutable-tag verifier tests:
  **11 passed / 0 failed**
- Aggregate: **26 passed / 0 failed / 0 skipped**

## Coverage

The batch verified explicit approval, immutable target references, historical
record preservation, supported rollback kinds, signing-identity replacement
requirements, refusal of same-target/history-invalidating actions, bounded
reason handling, exact release-decision identity/time/digest binding, six
public-package identity enforcement, entrypoint and install-hook boundaries,
checksum/sidecar/SBOM shape checks, symlink/duplicate rejection, incomplete
package-set refusal, and immutable tag matching.

## Disposition and limitations

This is local contract/verifier evidence only. It does not establish an actual
npm or deployment rollback, Hunt-feed/engine revocation, keyless Sigstore
identity, trusted publication, legal/license clearance, or final supported
platform release acceptance. No checkbox changed. No production, provider,
database, payment, entitlement, deployment, registry, or public-repository
write occurred.
