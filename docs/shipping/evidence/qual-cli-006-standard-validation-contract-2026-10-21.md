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

## Official SPDX completion of the local artifact-root run

The missing SPDX runtime was then supplied only inside the disposable
qualification directory: Temurin OpenJDK JRE **17.0.20.1** on macOS arm64 and
the workflow-pinned SPDX Tools **2.0.7** JAR. Its SHA-256 was
`bf99a8b2ffbea238c1451c6b4be568870f18b4aac93d0dbff755f2b0b7ce43f3`, matching
the workflow pin. With that runtime available, the same generated artifact
root passed strict validation **4/4**, exit **0**: SARIF, CycloneDX, SPDX, and
the offline Cosign bundle all returned `passed`.

This completes the local official-validator/tool-integration slice only. The
artifact root remains disposable, the Cosign key remains ephemeral/offline,
and no keyless Fulcio/Rekor identity, release publication, legal clearance,
independent review, hosted supported-platform run, customer evidence, or final
acceptance was created.

## Current-head archive, provenance, and transition qualification

The same clean source head was freshly built and packaged after the validator
run:

- `pnpm build` — **8/8** workspace tasks passed.
- `pnpm typecheck` — **14/14** Turbo tasks passed.
- `node scripts/pack-public-packages.mjs <temporary-root>` — **7** public
  archives at version `2.0.0-alpha.1`.
- `python scripts/verify-in-toto-release.py <temporary-root>` with official
  `in-toto==3.0.0` — exit **0**, exact SHA-256 binding verified for **7/7**
  archives. The verifier generated ephemeral layout/functionary keys inside
  its disposable temporary directory.
- `node scripts/verify-clean-consumer.mjs <temporary-root>` — passed: all
  seven archives installed, all libraries imported, the CLI executed, no
  external engine was installed, and signed bounded A1 execution completed.
- `node scripts/verify-upgrade-rollback.mjs <temporary-root>` — passed the
  transition `1.8.3 -> 2.0.0-alpha.1 -> 1.8.3`.
- `git diff --check` — passed; the clean source worktree remained clean.

The resulting archive SHA-256 products were:

| Archive | SHA-256 |
| --- | --- |
| `verglos-2.0.0-alpha.1.tgz` | `127815d28ef4ce7d1e5671519f53cd209a53030d72530758237afbe559502827` |
| `verglos-entitlement-2.0.0-alpha.1.tgz` | `d84df0342e3fd3f5aea9ea63ac4bd1aa06c30f5818d76bbf52ecaa30e48edda7` |
| `verglos-hunt-2.0.0-alpha.1.tgz` | `44ffd78a55aa64a247a0be95ca845119c5a1e9bd2f4fe4de2adbba5219e07a36` |
| `verglos-mcp-2.0.0-alpha.1.tgz` | `c6082caf02a53e7f4d7af0fdcc38951a84be00baad2507e679fe21b64467f1d4` |
| `verglos-reporter-2.0.0-alpha.1.tgz` | `2105bf9e415303e9d0cdd7399c2ce2c608083866b9c08e121e50d889e34677eb` |
| `verglos-scanner-2.0.0-alpha.1.tgz` | `94d6621df2a206b58d4688bbb7a16c0f90f65d9e6ff62a539e86afefbe55f4a8` |
| `verglos-shared-2.0.0-alpha.1.tgz` | `243b33182a2cdfee800d30fde8fdffc5f40fc8d6aeb07c755d458c311e102603` |

This is local current-head package/provenance evidence only. It does not
replace the hosted Ubuntu/macOS/Windows matrix for this exact release
candidate, trusted keyless identity, protected publication, legal clearance,
independent review, or final acceptance.

## Disposition

This completes the local official-validator contract but does not close the
row. Trusted keyless Sigstore/Fulcio/Rekor release identity, legal clearance,
protected publication, independent review, hosted supported-platform evidence,
customer/recipient acceptance, and final acceptance remain open. No backlog
checkbox changed; the score remains **239 checked / 41 open / 280 total
(85.4%)**.
