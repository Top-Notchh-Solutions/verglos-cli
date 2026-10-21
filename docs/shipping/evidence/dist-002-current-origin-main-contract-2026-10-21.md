# DIST-002 current origin/main release-contract qualification · 2026-10-21

## Scope and acceptance boundary

This packet records the current merged release-workflow contract. It is
implementation and negative-path evidence only. It does not create a release
tag, approve the protected environment, enroll or use a trusted npm publisher,
publish to npm, create an immutable attestation, or provide legal/license
clearance.

## Source and verification

- Repository: `Top-Notchh-Solutions/verglos-cli`.
- Exact source: `origin/main`
  `72190acae81b454a4a88a0ea8d222c8981ac9a3f`.
- Clean detached qualification worktree; Node `v26.4.0`, pnpm `9.15.9`.
- `node --test scripts/publish-workflow-contract.test.mjs
  scripts/verify-release-artifacts.test.mjs scripts/verify-release-tag.test.mjs
  scripts/generate-release-origin.test.mjs` — **10/10** tests passed, 0
  failures, 0 skips.
- The broader forced workspace graph already passed **23/23** Turbo tasks with
  no failures on this exact source. Its explicit Docker/A2 integration tests
  remain environment-gated skips.

The contract suite covers OIDC `id-token: write`, the protected `release`
environment, immutable tag/version binding, serialized publication, required
sidecars and checksums, clean-consumer ordering, pre-publication verification,
`--provenance`, and rejection of manual, mutable-dist-tag, and long-lived-token
bypass paths.

## Strict release blocker

`node scripts/license-inventory.mjs --require-clear >/dev/null` exited **2**
with `dependency license review required for 7 package version(s)`. The
current inventory identifies:

- `benchmark@1.0.0` bundled by `fast-uri@3.1.7` — nested-license conflict;
- `glob@13.0.6`, `lru-cache@11.5.2`, `minimatch@10.2.6`, `minipass@7.1.3`,
  `minipass-flush@1.0.7`, and `path-scurry@2.0.2` — license review required.

The strict release verifier must refuse this unresolved inventory; the entries
are not silently waived or relabeled.

## Disposition

`DIST-002` remains unchecked because DIST-001 is still open, the protected
environment and trusted-publisher decisions have not been executed, legal/
license clearance is unresolved, and no immutable publication or attestation
exists. No npm registry, provider, customer, Production, or AppSec state
changed. The score remains **239 checked / 41 open / 280 total (85.4%)**.
