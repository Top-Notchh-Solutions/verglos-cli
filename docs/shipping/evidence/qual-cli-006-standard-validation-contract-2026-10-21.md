# QUAL-CLI-006 standard-validation contract requalification — 2026-10-21

## Scope

- **Source:** clean detached CLI `origin/main` at
  `72190acae81b454a4a88a0ea8d222c8981ac9a3f`.
- **Focused command:** `node --test scripts/verify-standard-validation.test.mjs`.
- **Supporting command:** `pnpm typecheck` — **14/14** Turbo tasks passed.
- **Boundary:** local contract qualification only; no registry, signing,
  provider, Production, customer, legal, or independent-review action.

## Result

The focused standard-validation suite passed **7/7**, covering:

- bounded SARIF, CycloneDX, SPDX, and Sigstore validator argv;
- validator-output redaction;
- unavailable official tools remaining `not-supported`/inconclusive;
- CycloneDX alternate validator flag selection;
- Sigstore fixture-root confinement;
- strict rejection of missing/rejected validators; and
- fail-closed missing, malformed, symlinked, oversized, and symlinked-root
  artifacts.

The direct CLI invocation `pnpm qualify:standards` was also attempted without
an artifact-root argument and correctly exited **1** with its usage contract.
No official validator was claimed or executed by that invocation; an actual
artifact-root run still requires the release artifact bundle and approved
validator tooling.

## Disposition

This strengthens the implementation contract for QUAL-CLI-006 but does not
close the row. Trusted keyless Sigstore/Fulcio/Rekor release identity, legal
clearance, protected publication, independent review, hosted supported-platform
evidence, and final acceptance remain open. No backlog checkbox changed; the
score remains **239 checked / 41 open / 280 total (85.4%)**.
