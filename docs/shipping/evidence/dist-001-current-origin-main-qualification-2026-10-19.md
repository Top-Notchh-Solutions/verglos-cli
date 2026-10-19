# DIST-001 current origin/main package qualification — 2026-10-19

## Scope

This packet records a fresh package-surface qualification for the exact
current CLI merge. It verifies the seven public archives, manifest/front-door
constraints, clean-consumer imports, optional-engine behavior, and bounded
signed A1 execution. It does not publish npm artifacts, create a tag, change a
registry, claim legal clearance, or qualify the independent Hunt boundary.

## Source and runtime

- Repository: `Top-Notchh-Solutions/verglos-cli`
- Exact source: `origin/main` at `0823b513f2b1810ad9f6afcb8806ba46f61feedb`
- Worktree: disposable `/private/tmp/verglos-cli-studio-upload-20261019`
- Output: disposable `/private/tmp/verglos-dist-001-current-20261019`
- Host: Darwin 25.5.0 arm64
- Node: `v26.4.0`
- pnpm: `9.15.9`

The first pack attempt stopped in the setup-only license inventory because the
macOS install lacked metadata for optional cross-platform `@esbuild` packages.
The runbook's temporary `pnpm.supportedArchitectures` selection was applied
only in the disposable worktree, the locked dependencies were reinstalled,
and the setting was removed before the worktree was checked clean. No public
source file changed.

## Commands and results

```text
pnpm install --frozen-lockfile
node scripts/pack-public-packages.mjs /private/tmp/verglos-dist-001-current-20261019
node scripts/check-packed-manifests.mjs /private/tmp/verglos-dist-001-current-20261019
node scripts/verify-clean-consumer.mjs /private/tmp/verglos-dist-001-current-20261019
git diff --check
```

- Dependency installation: passed after the temporary setup selection.
- Package packer: **7 archives created**.
- Packed-manifest audit: passed for **7/7** archives.
- Clean consumer: passed; installed all 7 archives, imported every library,
  executed `Verglos 2.0.0-alpha.1`, confirmed no external engine installation,
  and executed signed `a1-utf8-contains` through the bounded restricted-process
  runtime with an isolated Pro capability fixture.
- `git diff --check`: passed; the disposable worktree was clean after the
  temporary setup was removed.

Private log SHA-256 values:

```text
install: 6366b18596e73f80077d9d3f3c9b5d3f129c550ae8c05644307013902dbc5451
pack:    e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
manifest:81102afc0689d51a36ff35c879d57ec251b2407028d8ac259dda0b14b74455ec
consumer:977dae5a5eb0c71ae92d34885525553737fb4bbd9c2c7502e75dded296beeede
```

Archive SHA-256 values:

```text
ab8e4684bb7c63e1040c0f08e797bff10a473b4074ada3dd2afd4b04309ce437  verglos-2.0.0-alpha.1.tgz
56e37b5d5fd648c83c4674fa1c025770e1c8a0ca251a8c85b260d6546e62e83a  verglos-entitlement-2.0.0-alpha.1.tgz
04c8abfa37cbb3a2b98d7b8e4aaa350c377e2fe24ab246fa04bbb7edcaa64698  verglos-hunt-2.0.0-alpha.1.tgz
00df22a73ea75a695fab59a03c5e6e456928e48b478acdacd8f3b0904f0f8c16  verglos-mcp-2.0.0-alpha.1.tgz
b391c7b6e00bc72b4d44972361eecc555e340c95a5901bb076683e014a2af31b  verglos-reporter-2.0.0-alpha.1.tgz
e3b9f078f5fcd873fb33e6ddf5a67d8f3e8dbbc72ed151d229723551cb537cd9  verglos-scanner-2.0.0-alpha.1.tgz
3a03cb516ee9126b11596c1163c678cfb5fbe63897d53ef7a5c01ed117c846ea  verglos-shared-2.0.0-alpha.1.tgz
```

## Acceptance boundary

This advances DIST-001 package/archive evidence only. `DIST-001` remains
unchecked pending the dependent LOCAL/HUNT/RECORD product surfaces and final
legal/release qualification. No public repository, npm registry, provider,
customer, Production, payment, or AppSec state changed.

The authoritative backlog remains **235 checked / 45 open / 280 total
(83.9%)**. `TEAM-CLI-001` is checked.
