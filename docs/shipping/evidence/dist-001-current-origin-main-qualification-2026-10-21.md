# DIST-001 current origin/main package qualification · 2026-10-21

## Scope and acceptance boundary

This packet records the current CLI package-boundary qualification from the
merged source line. It qualifies the public archive/front-door contract only;
it does not close `DIST-001` because the row still depends on LOCAL/HUNT/RECORD
surfaces and final legal/release acceptance. No registry publication,
attestation, provider, Production, customer, or legal operation was performed.

## Source and setup

- Repository: `Top-Notchh-Solutions/verglos-cli`.
- Exact source: `origin/main` commit
  `72190acae81b454a4a88a0ea8d222c8981ac9a3f`.
- Qualification worktree: detached clean worktree at the exact commit.
- Runtime: Node `v26.4.0`, pnpm `9.15.9`.
- The documented CI-only `pnpm.supportedArchitectures` setup was applied
  ephemerally before install so every lockfile OS/CPU optional package was
  materialized. The package manifest was restored afterward and the worktree
  returned clean; the setup was not committed.

## Commands and results

- `pnpm install --frozen-lockfile` — passed with the documented
  cross-platform qualification setup.
- `pnpm build` — **8/8** build tasks passed.
- `node --test scripts/package-surface-audit.test.mjs scripts/pack-public-packages.test.mjs` — **8/8** tests passed, 0 failed.
- `node scripts/check-package-contents.mjs` — passed for **7/7** public
  packages.
- `node scripts/pack-public-packages.mjs <artifact-dir>` — produced **7**
  archives.
- `node scripts/check-packed-manifests.mjs <artifact-dir>` — passed for **7/7**
  archives.
- `node --test scripts/verify-clean-consumer.test.mjs` — **2/2** tests passed.
- `node scripts/verify-clean-consumer.mjs <artifact-dir>` — installed all
  **7** archives, imported all public libraries, executed
  `verglos 2.0.0-alpha.1`, confirmed no external-engine installation, and
  executed the signed `a1-utf8-contains` fixture through bounded
  `restricted-process` with an isolated Pro capability fixture.
- `pnpm exec turbo run test typecheck build --force` — **23/23** Turbo tasks
  successful, 0 task failures. Explicit environment-gated Docker/A2 tests
  remained skipped as declared by the repository test contracts.
- `git diff --check` — passed.

## Artifact identities

All seven archives were version `2.0.0-alpha.1`:

| Archive | SHA-256 |
| --- | --- |
| `verglos-2.0.0-alpha.1.tgz` | `89e16907769f6763b9a2ccb689a76301219263f2f5bdfefc653a7b1471baff16` |
| `verglos-entitlement-2.0.0-alpha.1.tgz` | `56e37b5d5fd648c83c4674fa1c025770e1c8a0ca251a8c85b260d6546e62e83a` |
| `verglos-hunt-2.0.0-alpha.1.tgz` | `04c8abfa37cbb3a2b98d7b8e4aaa350c377e2fe24ab246fa04bbb7edcaa64698` |
| `verglos-mcp-2.0.0-alpha.1.tgz` | `00df22a73ea75a695fab59a03c5e6e456928e48b478acdacd8f3b0904f0f8c16` |
| `verglos-reporter-2.0.0-alpha.1.tgz` | `b391c7b6e00bc72b4d44972361eecc555e340c95a5901bb076683e014a2af31b` |
| `verglos-scanner-2.0.0-alpha.1.tgz` | `e3b9f078f5fcd873fb33e6ddf5a67d8f3e8dbbc72ed151d229723551cb537cd9` |
| `verglos-shared-2.0.0-alpha.1.tgz` | `3a03cb516ee9126b11596c1163c678cfb5fbe63897d53ef7a5c01ed117c846ea` |

## Disposition

This is current-head implementation and package qualification evidence. It
does not establish trusted publication, immutable attestation, legal/license
clearance, independent Hunt acceptance, or final release approval. Keep
`DIST-001` unchecked and preserve the score at **239 checked / 41 open / 280
total (85.4%)**.
