# DIST-001 current merged-head package requalification — 2026-10-18

## Scope

This records a current public package-surface requalification for `DIST-001`.
It does not publish npm artifacts, create a release tag, change a registry,
deploy a service, or close the row. `DIST-001` still depends on the LOCAL,
HUNT, and RECORD product surfaces and on complete final-release acceptance.

Repository: `Top-Notchh-Solutions/verglos-cli`

Implementation commit: `8da4617d34196be2c9fcd86c166259ef82984f28`

Normal merge reviewed: `50bcab42eadfa8796d86d1f7a8aaee3010c65647`

The reviewed merge preserves the regular contribution history and is not a
squash merge. No rebase, force-push, empty, duplicate, artificial, or
documentation-only contribution was used for this qualification.

## Verification

All commands ran in a disposable detached worktree at the exact normal merge
and wrote archives only under a disposable `/tmp` output directory:

```text
pnpm install --frozen-lockfile
node scripts/pack-public-packages.mjs /tmp/verglos-dist-001-artifacts.uXMzj6
node scripts/check-packed-manifests.mjs /tmp/verglos-dist-001-artifacts.uXMzj6
node scripts/verify-clean-consumer.mjs /tmp/verglos-dist-001-artifacts.uXMzj6
```

Results:

- `pack-public-packages.mjs`: **7 archives created**.
- `check-packed-manifests.mjs`: **passed** for the seven generated archives,
  including the public `verglos` bin/export and forbidden-file/package-surface
  checks.
- `verify-clean-consumer.mjs`: **passed**. The clean consumer installed all
  seven archives, imported all libraries, executed Verglos `2.0.0-alpha.1`,
  confirmed that no external engine was installed implicitly, and executed the
  signed `a1-utf8-contains` fixture through the bounded restricted-process
  runtime with an isolated Pro capability fixture.
- `git diff --check`: **passed** after removing the disposable setup change.

Generated archive SHA-256 values:

```text
b9d1fbc4f369c6d5a4b2826ede7e5ee092a99be22d5a8d41b40b7610ec1464e3  verglos-2.0.0-alpha.1.tgz
b9e7cc8385de1e38d6f3114faa36f8df5cf3db2b4dbe4588d399cd3fa8a6e7bc  verglos-entitlement-2.0.0-alpha.1.tgz
3472ad4c640a64515c4778265db2124d052d3e6714a47d07c9d989092e429469  verglos-hunt-2.0.0-alpha.1.tgz
255f903e91f034b951807d32dd233eac98e326bc870c4ea4e500e62a67ca2092  verglos-mcp-2.0.0-alpha.1.tgz
be808cd929b022e2a95d80edf8e619143f8bc1695cc30c528c6ae6e30c1a5776  verglos-reporter-2.0.0-alpha.1.tgz
cb0cdf0810f213c4b899982849d8a814d03abc670ac3e5e9c071f7d2d4c390dd  verglos-scanner-2.0.0-alpha.1.tgz
15548bdb508773e4a99b32cace384c80eee0d7fd7880b8371699bf9cc16139b3  verglos-shared-2.0.0-alpha.1.tgz
```

The disposable worktree temporarily enabled pnpm’s cross-platform metadata
selection so the already-locked optional platform packages could be installed
for the audit. That setup change was removed before the worktree was closed;
no public source file changed.

## Boundary and disposition

This is technical package/archive evidence only. It does not establish the
independent Hunt AppSec review, trusted publication, provider readiness,
customer acceptance, hosted entitlement, final release approval, or the
remaining LOCAL/HUNT/RECORD contracts. No public repository, npm registry,
provider, database, customer, deployment, or production state changed.

`DIST-001` remains unchecked. Score remains **232 checked / 48 open / 280
total (82.9%)**.
