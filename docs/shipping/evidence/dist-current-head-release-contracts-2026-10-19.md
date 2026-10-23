# Distribution current-head release contracts · 2026-10-19

## Scope

This packet requalifies the distribution and rollback code on the exact merged
CLI head after the private-runner merge. It does not publish npm, create a tag,
invoke a registry, mutate a signing identity, call a Hunt provider, or deploy
or roll back Vercel.

## Source and environment

- Repository: `Top-Notchh-Solutions/verglos-cli`
- Exact source commit: `11734a45740a893c307606e8f3d3f316711abd9e`
- Worktree: disposable clean detached worktree at `origin/main`
- Platform: macOS arm64; Node `v26.4.0`; pnpm `9.15.9`
- Public/private boundary: only public CLI source and synthetic release
  fixtures were used; no credentials, customer source, registry state, or
  private shipping files entered the worktree.

## Commands and results

1. `pnpm install --frozen-lockfile` — completed with the locked pnpm version.
2. `pnpm build` — **8/8** workspace build tasks passed.
3. `node --test scripts/publish-workflow-contract.test.mjs scripts/verify-release-tag.test.mjs scripts/verify-release-artifacts.test.mjs scripts/package-surface-audit.test.mjs scripts/release-rollback-evidence.test.mjs` — **15/15** passed, zero failures/skips.
4. `node scripts/release-rollback-evidence.mjs /tmp/verglos-dist-release-qualification-20261019` — exit `0`; status `passed`; five operations; two historical records preserved.
5. `git diff --check` — passed.

The first direct test invocation before the build failed because the disposable
worktree had no generated CLI `dist` output. After the required build, the
same test command passed 15/15. That setup failure is retained as a command
ordering note, not a product failure.

## Verified boundaries

- Publish workflow requires immutable tag verification, protected `release`
  environment, OIDC `id-token: write`, serialized publication, complete
  sidecar evidence, clean-consumer verification, and `--provenance`.
- Workflow contract rejects manual dispatch, mutable dist-tag promotion, and
  long-lived npm token dependencies.
- Release artifact verification covers seven public archives, checksums,
  notices, CycloneDX/SPDX SBOMs, dependency/external-license records, and
  clean-consumer output.
- Rollback rehearsal covers npm package, engine manifest, Hunt feed,
  signing identity, and Web deployment boundaries while preserving two
  historical records in memory.

## Acceptance boundary

`DIST-001`, `DIST-002`, `DIST-003`, and `DIST-006` remain unchecked. Their
code-side implementation and current-head contract qualification are advanced,
but the remaining requirements are dependency completion, protected trusted
publisher/release approval, legal clearance, actual immutable publication or
attestation where required, and authenticated rollback/revocation acceptance.
No checkbox or release state changed.

The live private-ledger score remains **239 checked / 41 open / 280 total
(85.4%)**. AppSec/Hunt remains held separately. The generated rollback report
is disposable and represented by the bounded result above; the authoritative
private evidence is this packet.
