# DIST-006 rollback/revocation manifest-binding evidence · 2026-10-19

## Change identity

- Repository: `Top-Notchh-Solutions/verglos-cli`
- Pull request: #157
- PR tip reviewed locally: `167c344bd7fb647d646a9e6b451dd18d558bf4ac`
- Normal merge commit: `7c24535c55e2672b188cddb6219511c0910983ff`
- Original-logic implementation: `b9cc1e12`
- Regression/evidence coverage: `167c344b`
- Branch: `codex/dist-006-rollback-manifest-main-20261019`
- No squash, rebase, force-push, or artificial commit was used.

## Implemented production path

The real CLI `release rollback-rehearsal` path now reads the bounded manifest
bytes once, computes their SHA-256 digest, evaluates the shared
`decideReleaseRollback` contract for all five required release boundaries, and
emits the manifest digest in both successful and denied-operation JSON results.
The evidence generator independently hashes the fixture file and fails closed
unless the CLI-emitted digest matches the exact bytes it invoked.

This is an integrity binding for the existing rollback/revocation decision
boundary. It does not perform provider writes or claim that a live npm release,
engine manifest, Hunt feed, signing identity, or Vercel deployment was changed.

## Local verification

- `pnpm install --frozen-lockfile`: passed.
- `pnpm build`: **8/8** workspace builds passed.
- `node --test packages/cli/dist/release-rollback-plan.test.js`: **6/6** passed.
- `node --test scripts/release-rollback-evidence.test.mjs`: **1/1** passed.
- `pnpm --filter verglos test`: exited `0`; the existing Hunt A2 integration
  cases remained explicit skips where their opt-in environment was not set;
  no test failure occurred.
- `git diff --check`: passed.

The generated report recorded:

- status: `passed`
- operations: five (`npm-package`, `engine-manifest`, `hunt-feed`,
  `signing-identity`, `web-deployment`)
- actions: four rollback decisions and one signing-identity revocation
- historical records: two, preserved: `true`
- manifest digest:
  `sha256:664f70df2f2a0c063d43c767e602266b1adc1709a498dae7ef71825291b960b7`
- independent fixture comparison: `true`
- evidence source commit: `167c344bd7fb647d646a9e6b451dd18d558bf4ac`

## Hosted verification

- Platform matrix run `39262149777`: **12/12** Ubuntu/macOS/Windows Node
  20/22/24 jobs passed.
- Official standard/provenance validators run `39262149790`: passed.
- Self-scan run `39262149671`: passed.
- In-toto binding job `118092298436`: passed.

## Disposition and residual boundary

This is substantive original-logic progress for DIST-006 and closes the
manifest-integrity gap identified in the local rehearsal evidence. The
DIST-006 checkbox remains unchecked pending authenticated rollback/revocation
acceptance for the real npm/registry, engine, Hunt-feed, signing-provider, and
web-deployment boundaries, plus final release mapping and acceptance. No npm,
registry, signing-provider, Hunt-provider, Vercel, Production, entitlement, or
customer write occurred. AppSec/Hunt rows were not changed.
