# DIST-003 release artifact contract evidence — 2026-10-19

## Scope

This packet records the implementation and qualification advance for
`DIST-003` in the public `verglos-cli` repository. It does not claim that a
package was published, that a registry attestation exists, or that legal,
provider, customer, or final-release acceptance was completed.

## Public source and merge

- Repository: `Top-Notchh-Solutions/verglos-cli`
- Pull request: [#149](https://github.com/Top-Notchh-Solutions/verglos-cli/pull/149)
- Implementation commit: `8542ab7f test(release): enforce uploaded release evidence`
- Normal merge commit: `5abf451f31a425bf0ab8013bd4b461d9a59f938d`
- Merge method: normal merge; no squash, rebase, or force-push

The release-workflow contract test now requires the publication workflow to
upload every generated release sidecar with `if-no-files-found: error` before
the first `npm publish`. The required sidecars are the checksum file, third-
party notices, CycloneDX and SPDX SBOMs, external-license records, clean-
consumer verification, and the dependency-license inventory. The test also
requires the release-artifact verifier to run before the upload step.

## Verification

- Focused local contract test: `node --test scripts/publish-workflow-contract.test.mjs` — **1 pass, 0 fail**.
- `git diff --check` — passed.
- Hosted matrix run `39182478465` — all Ubuntu/macOS/Windows Node 20/22/24 jobs passed.
- Hosted self-scan run `39182478499` — passed.
- Official standard/provenance validators run `39182478551` — passed.
- In-toto release binding job `117837979585` — passed.
- The full hosted matrix completed without failures.

## Boundary and disposition

This is a real code-side release-evidence contract advance. It strengthens
the workflow so a publication cannot proceed with missing generated evidence,
but it does not execute publication or create a registry attestation. No npm
registry, trusted-publisher enrollment, provider, customer, Production, or
AppSec/Hunt state was changed.

`DIST-003` remains unchecked pending actual immutable publication and
attestation, release-note and license-clearance evidence, trusted-publishing
review, and the required final acceptance mapping. AppSec/Hunt-held rows were
not touched.

## Backlog state

The authoritative private backlog remains **235 checked / 45 open / 280 total
(83.9%)**. The DIST-003 checkbox is intentionally unchanged.
