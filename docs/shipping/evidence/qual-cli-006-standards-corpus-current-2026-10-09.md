# QUAL-CLI-006 — current standards corpus requalification

Date: 2026-10-09

## Scope

The current CLI `main` source head was checked without changing source or
public documentation. This was a bounded code-side qualification of the
restored standards-validation corpus, not a release or publication.

## Results

Command:

```text
packages/cli/node_modules/.bin/tsx --test packages/shared/src/spec-validation-corpus.test.ts
```

Result: **7/7 pass, 0 fail, 0 skipped**.

The passing cases cover required-field/round-trip checks for SARIF 2.1.0,
CycloneDX 1.6, SPDX 2.3, in-toto Statement v1, detect-secrets baselines,
Sigstore envelope guards, and the cross-platform install/upgrade/rollback
contract reference.

The shared package also passed typecheck and build. Docker was healthy. The
host did not have `cosign`, `in-toto-verify`, `syft`, or `trivy` installed, so
this run did not claim execution through those independent official tools.

## Disposition

`QUAL-CLI-006` remains unchecked. The corpus proves the current implementation
boundary only; official-validator execution, clean consumer install/upgrade/
rollback evidence at the exact release candidate, trusted keyless Sigstore
identity, protected publishing, legal clearance, and final acceptance remain
required. No Production, database, payment, provider, deployment, npm
publication, or release state changed.
