# HUNT-008 R9 secret and supply-chain contribution evidence

## Identity and shipping

- **Public repository:** `Top-Notchh-Solutions/verglos-cli`
- **PR:** [#111](https://github.com/Top-Notchh-Solutions/verglos-cli/pull/111)
- **Source commit:** `8c1af9701296e8aaedd840c399f8b659469f91d9`
- **Merge commit:** `c560b6a728a248f5b3c7a8ed727e366134610ac0`
- **Merge parents:** `65cfd8940cd9e9b219bbe10198f5c65852689f43` and
  `8c1af9701296e8aaedd840c399f8b659469f91d9`
- **Integration:** regular two-parent merge into public `main`; no squash and
  no force-push.
- **Package:** `2.0.0-alpha.1`.

## Implemented contribution

PR #111 adds two public-safe HUNT-008 R9 reference families:

- `a2-secrets-credential-use-harness`, mapped to `D4-001`, with a
  deterministic in-memory transport and a synthetic credential canary.
- `a2-supply-chain-harness`, mapped to `D6-001`, with disposable package
  metadata and admission checks for exact version, integrity, and lifecycle
  policy.

Both target modules and harnesses cover positive, negative, unsupported,
timeout, and adapter-failure outcomes. The public catalog and CLI now cover
eight A1 probes and ten A2 target-harness families. The R9 harnesses do not
validate a real credential, install a package, execute a lifecycle hook, or
contact a package registry.

## Local qualification

The following evidence was run from the clean PR worktree at the merged public
base plus source commit:

- `git diff --check` passed.
- `pnpm --filter @verglos/shared build` passed.
- `pnpm --filter @verglos/hunt build` passed.
- `pnpm --filter @verglos/scanner test` passed.
- `pnpm --filter @verglos/hunt test` passed. The default run recorded the
  explicit opt-in skips for the 16 Linux/Docker adversarial cases.
- `VERGLOS_HUNT_DOCKER_TARGET_INTEGRATION=1 node --test --test-concurrency=1 packages/hunt/dist/target-harness-fixtures.test.js`
  passed **3/3**, exercising all ten families with positive, negative, and
  unsupported outcomes plus timeout and adapter-failure process behavior.
- From `packages/cli`,
  `VERGLOS_HUNT_DOCKER_TARGET_INTEGRATION=1 pnpm exec tsx --test --test-concurrency=1 src/hunt-execute.test.ts`
  passed **6/6**, including all ten A2 families.
- `pnpm exec turbo run build --filter=verglos... --force` passed **7/7**.
- `pnpm exec turbo run typecheck --filter=verglos... --force` passed
  **13/13**.

The Docker qualification used Docker Desktop `29.7.2` on `linux/aarch64` and
the pinned image identity
`node:22-alpine@sha256:0a7108bf6c7bf5de370ffb1a3ed6be93d405b43ff159f681a8d18c0e2bc2e402`.
The image identity was verified with `docker image inspect` against the
tag-plus-digest reference.

## Protected verification

All eleven required PR checks passed. The protected runs were:

- platform matrix: `38364718216`
- Verglos self-scan: `38364718213`
- Ubuntu, macOS, and Windows Node 20/22/24 cells, including the Windows Node
  20 cell that completed after 10m10s.

## Boundary and acceptance disposition

Top Notchh Solutions owner/operator authorization was used for this public-safe
contribution. The work used no customer source or data, real credential,
provider state, entitlement, database, Production, npm, hosted target,
registry, or external network write. Owner authorization is not represented as
independent AppSec review, provider confirmation, customer acceptance, legal
clearance, or release approval.

This is an implementation and shipping increment for HUNT-008-R9, not closure
of HUNT-008. The complete row still requires per-family target acceptance,
approved rule and provenance/licensing treatment, hosted entitlement, required
Linux/Docker adversarial qualification, independent review, and final release
acceptance. No backlog checkbox changed. The score remains **228 checked / 52
unchecked / 280 total (81.4%)**.
