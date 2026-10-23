# QUAL-CLI-006 current merged-head validation qualification · 2026-10-22

## Verification

Exact public CLI merged head `db3510356ecd6c6e430d7dcb3b9354e514d777ee`
passed the standard-validation contract set **12/12**. The tests cover
bounded official-validator argv execution, SARIF/CycloneDX/SPDX/Sigstore
fixture handling, trusted-root identity binding, redaction, unavailable-tool
inconclusive status, artifact-root confinement, and fail-closed malformed,
symlinked, and oversized artifacts. The current merged PR run also completed
the hosted cross-platform/in-toto/standard-validation workflow successfully.

This packet does not claim a live keyless Fulcio/Rekor identity or legal
release approval. Local official-tool execution was not repeated on macOS;
the hosted workflow is the authoritative official-tool path.

## Boundary and disposition

`QUAL-CLI-006` remains unchecked for trusted keyless release identity,
legal/protected publication, independent review, and final acceptance. No
registry, provider, Production, database, customer, or AppSec state changed.
Nothing was deleted.

Current score: **239 checked / 41 open / 280 total (85.4%)**.
