# DIST-001 current-head package-surface audit — 2026-10-14

## Scope

This is a private technical recheck of the public CLI distribution boundary at
the exact public merge `ba6c75b4e1d11b59f1e6e7bf13edc3c4be02b13a`. It does not
authorize publication, release, redistribution, or a DIST-001 checkbox.

The audit ran in a detached disposable worktree from `origin/main` with
`pnpm 9.15.9` and the installed Node runtime. The user's dirty public CLI
worktree was not modified.

## Results

- `pnpm build`: **8/8 successful**.
- `node scripts/check-package-contents.mjs`: **passed** for all **7** public
  package manifests.
- `node --test scripts/package-surface-audit.test.mjs`: **5 passed / 0 failed**.
- The surface contract confirms the seven reviewed package identities,
  declared entrypoints, relative-path bounds, no install hooks, no implicit
  Trivy dependency, and exclusion of the internal CLI process-fixture helper.

## Incomplete disposable-environment step

`node scripts/pack-public-packages.mjs .artifacts/public-packages` did not
produce archives because `pnpm licenses list --json` failed with
`ERR_PNPM_MISSING_PACKAGE_INDEX_FILE` for `turbo@2.10.6` in the disposable
machine's pnpm store. A forced install and fetch did not repair that local
store-index condition. Consequently:

- no archive checksum or clean-consumer result is claimed from this run;
- `check-packed-manifests.mjs` was not credited because no archives existed;
- no workaround, generated notice, registry access, or publication was used.

Existing exact-head archive and clean-consumer evidence remains the previously
recorded evidence under `dist-001-package-boundary-recheck-2026-10-11.md` and
the related current-head qualification records; this run only adds the
package-directory and surface-contract results above.

## Acceptance disposition

`DIST-001` remains unchecked. Its complete row still depends on the LOCAL,
HUNT, and RECORD product surfaces plus final release-package and legal
qualification. This audit changes no score and performs no Production,
payment, entitlement, database, deployment, npm, tag, or customer operation.
