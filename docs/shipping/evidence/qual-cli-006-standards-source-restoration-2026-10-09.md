# QUAL-CLI-006 standards validation source restoration — 2026-10-09

## Scope

The public CLI `main` tree contained the standards-validation corpus test but
not the shared importer/parser source it imported. This batch restored the
bounded source surface and public exports without changing the test assertions
or touching unrelated user files.

## Implementation

- Public CLI commit: `d0a3b21` (`fix(shared): restore standards validation corpus`).
- Restored bounded JSON parsing and deterministic JSON export support.
- Restored the importer registry and SARIF, CycloneDX, SPDX, in-toto, and
  detect-secrets baseline importers.
- Exported the shared importer surface from `packages/shared/src/index.ts`.
- Preserved the existing `spec-validation-corpus.test.ts` unchanged.

## Verification

- Shared standards corpus: **7/7 pass**.
- CLI focused security/entitlement/monitor suite: **17/17 pass**.
- Root Turbo test graph: **8/8 tasks successful**.
- Root Turbo typecheck graph: **11/11 tasks successful**.
- Root Turbo build graph: **6/6 tasks successful**.
- `git diff --check`: pass.

## Acceptance boundary

This is implementation and local qualification progress. It does not claim
official SARIF/CycloneDX/SPDX validation, trusted Sigstore/Fulcio/Rekor release
identity, clean-consumer cross-platform release qualification, protected
publishing, legal clearance, or independent acceptance. `QUAL-CLI-006` remains
open and no backlog checkbox changed.

## Production boundary

No Production deployment, plan/provider call, payment write, database or
migration write, entitlement change, account change, or customer-data mutation
occurred in this batch. Production remains in the active goal end-to-end, with
the current operation limited to the already-qualified fail-closed code-rollout
stage.

## Score

**219 checked / 61 unchecked / 280 total (78.2%)**. The score was recomputed
from the private backlog after the batch.
