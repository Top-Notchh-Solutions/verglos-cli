# QUAL-CLI-006 current origin/main package qualification · 2026-10-19

## Scope

This packet records implementation-side qualification of the original current
`verglos-cli` release logic. It does not claim trusted publication, legal
clearance, independent AppSec review, or final release acceptance.

## Source and environment

- Repository: `Top-Notchh-Solutions/verglos-cli`
- Source: `origin/main` at `0823b513f2b1810ad9f6afcb8806ba46f61feedb`
- Worktree: disposable clean worktree
  `cli-ent-001-20261019`
- Host: Darwin arm64
- Node: `v26.4.0`
- pnpm: `9.15.9`
- Package version exercised: `2.0.0-alpha.1`
- No production, registry, provider, customer, payment, or browser state was
  changed.

## Commands and results

The first contract-test attempt correctly failed closed because the local
install had not materialized the workflow's cross-platform optional package
metadata. The workflow's existing `supportedArchitectures` configuration was
then applied only in the disposable worktree, dependencies were reinstalled
with `pnpm install --frozen-lockfile`, and the qualification was rerun.

- `node --test scripts/standard-validation-contract.test.mjs scripts/platform-matrix-contract.test.mjs scripts/pack-public-packages.test.mjs scripts/verify-clean-consumer.test.mjs scripts/verify-release-artifacts.test.mjs scripts/package-surface-audit.test.mjs scripts/verify-standard-validation.test.mjs`
  — **23/23 pass, 0 fail, 0 skip**.
- `pnpm pack:public` — **7** public archives produced by the repository's
  packer.
- `node scripts/check-packed-manifests.mjs .artifacts/public-packages` — pass.
- `node scripts/verify-clean-consumer.mjs .artifacts/public-packages` — pass:
  all seven archives installed, all libraries imported, the CLI emitted
  `2.0.0-alpha.1`, no external engine was installed implicitly, and signed
  `a1-utf8-contains` executed through the bounded `restricted-process` runtime
  with the isolated Pro capability fixture.
- `node --test scripts/license-inventory.test.mjs scripts/generate-third-party-notices.test.mjs scripts/external-license-records.test.mjs`
  — **16/16 pass, 0 fail, 0 skip**.
- The inventory covered **254** lockfile package IDs, **250** package entries,
  and one bundled component.
- `pnpm licenses:inventory --require-clear` — intentionally **exit 2**;
  seven package versions remain explicit legal review blockers.

## Findings and disposition

The current original package/release logic is operationally qualified for the
local seven-package boundary, clean-consumer imports, no implicit external
engine installation, and signed bounded A1 execution. The contract tests also
continue to enforce official validator wiring, in-toto binding, release
checksums, public package boundaries, and fail-closed validator behavior.

The row remains unchecked. The current license inventory identifies these
unresolved blockers:

- `benchmark@1.0.0`, bundled by `fast-uri@3.1.7`, nested-license conflict.
- `glob@13.0.6`, `lru-cache@11.5.2`, `minimatch@10.2.6`, `minipass@7.1.3`,
  `minipass-flush@1.0.7`, and `path-scurry@2.0.2`, each requiring license
  review for `BlueOak-1.0.0`.

Official SARIF/CycloneDX/SPDX/Sigstore execution and the supported-platform
matrix remain represented by the existing hosted evidence packets; this local
run does not replace those hosted checks. `QUAL-CLI-006` still requires the
row's trusted keyless publication identity, protected publication, legal
clearance, independent AppSec review, hosted supported-platform evidence, and
final acceptance.

## Evidence boundary

This is a real current-head qualification packet, not a placeholder and not a
checkbox claim. AppSec/Hunt rows were not changed. No squash, rebase,
force-push, publication, or artificial contribution commit was made.
