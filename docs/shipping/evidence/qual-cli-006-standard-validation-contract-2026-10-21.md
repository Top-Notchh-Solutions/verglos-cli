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

## Disposable artifact-root qualification

The current source was also exercised against a disposable generated artifact
root with the available official local tools:

- Microsoft SARIF Multitool **5.8.0** validated `report.sarif` successfully,
  with its non-fatal missing-`informationUri` warning.
- CycloneDX CLI **0.33.1** validated `SBOM.cdx.json` successfully on macOS
  arm64.
- Cosign **2.6.0** validated the generated offline bundle successfully using
  an ephemeral local key and `--tlog-upload=false`; the private key was
  removed immediately and this is not keyless Fulcio/Rekor evidence.
- The official SPDX validator was not configured because this host has no Java
  runtime, so `SBOM.spdx.json` was reported `not-supported`.

The non-strict runner result was **3 passed / 1 unsupported / 0 failed** with
`result: inconclusive`. The strict runner correctly exited **1** with
`result: failed` because unsupported SPDX validation is fatal in strict mode.
The artifact root and generated signing material were disposable local
qualification inputs; no release artifact, registry, publication, provider,
customer, legal, or independent-review action occurred.

## Disposition

This strengthens the implementation contract and exercises three of the four
available official validators, but does not close the row. Official SPDX
qualification, trusted keyless Sigstore/Fulcio/Rekor release identity, legal
clearance, protected publication, independent review, hosted
supported-platform evidence, and final acceptance remain open. No backlog
checkbox changed; the score remains **239 checked / 41 open / 280 total
(85.4%)**.
