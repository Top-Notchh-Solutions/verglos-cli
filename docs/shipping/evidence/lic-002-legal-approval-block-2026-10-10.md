# LIC-002 legal and external-content block — 2026-10-10

## Technical verification completed

At the current private shipping source:

- `pnpm licenses:inventory --check` passed;
- the current inventory contains **148 package entries / 150 versions**;
- automated review blockers: **0** and unknown redistribution classes: **0**;
- license-inventory, notice-generation, and release-artifact verifier tests:
  **8 passed / 0 failed**.

The prior private inventory record describes a different dependency snapshot
with 180 lockfile versions. That count must be reconciled against the exact
release candidate before publication; no count is silently carried forward.

## Missing approval artifacts

`LIC-002` remains unchecked because the technical inventory is not legal
approval. An authorized legal/company reviewer must decide the exact release
scope for:

- the Trivy image/release, layers, vulnerability database terms, and NOTICE;
- detect-secrets’ operator-executable-only boundary or an immutable selected
  release if bundling is proposed;
- Sigstore/in-toto packages and fixtures, OWASP/public fixtures, and any copied
  examples or standards material;
- Hunt recipe/rule provenance, modification, redistribution, trademark, and
  premium-feed restrictions;
- final archive contents, generated notices/SBOMs, and the nested/transitive
  license reconciliation.

The private legal addendum is a review request only and has no reviewer name,
signature, approval date, or legal conclusion. Owner: authorized company/legal
reviewer. Review: 2026-10-11 IST or when the release candidate changes. No
publication, provider, database, Production, or customer-data write occurred.

## Queue decision

Keep `LIC-002` unchecked and park it. `QUAL-CLI-006` is the next
dependency-ready unchecked item by backlog order; it must retain the same
legal/trusted-publication boundary.
