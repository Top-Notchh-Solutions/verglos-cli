# HUNT-008 R10 Agent/MCP capability-receipt evidence

## Identity and shipping

- **Public repository:** `Top-Notchh-Solutions/verglos-cli`
- **PR:** [#112](https://github.com/Top-Notchh-Solutions/verglos-cli/pull/112)
- **Source commit:** `8eebc1d70c9ba30e304545907a72f99eec480fbb`
- **Merge commit:** `14d82d6d58547844084320121d390b79e0274103`
- **Merge parents:** `c560b6a728a248f5b3c7a8ed727e366134610ac0` and
  `8eebc1d70c9ba30e304545907a72f99eec480fbb`
- **Integration:** regular two-parent merge into public `main`; no squash and
  no force-push.
- **Package:** `2.0.0-alpha.1`.

## Implemented contribution

PR #112 extends the sanitized Agent/MCP HUNT-008-R10 reference family:

- the target fixture issues an explicit synthetic capability receipt bound to
  the exact tool, input scope, target, decision, and single-use replay policy;
- the safe dispatcher accepts the exact receipt once and rejects a second use
  of the same receipt; and
- the positive path retains the approval-bypass fixture while the negative
  path proves the bounded receipt/replay behavior.

The contribution is a local target-code qualification fixture. It is not a
live MCP server or customer-agent workflow.

## Local qualification

The following evidence was run from the clean PR worktree at merged public
base `c560b6a728a248f5b3c7a8ed727e366134610ac0` plus source commit
`8eebc1d70c9ba30e304545907a72f99eec480fbb`:

- `git diff --check` passed.
- `pnpm --filter @verglos/hunt test` passed. The focused target-harness
  process had **3 pass / 1 explicit Docker skip** by default, including the
  capability-receipt/replay assertion.
- `VERGLOS_HUNT_DOCKER_TARGET_INTEGRATION=1 node --test --test-concurrency=1 packages/hunt/dist/target-harness-fixtures.test.js`
  passed **4/4**, including all ten families through the pinned Docker path.
- From `packages/cli`,
  `VERGLOS_HUNT_DOCKER_TARGET_INTEGRATION=1 pnpm exec tsx --test --test-concurrency=1 src/hunt-execute.test.ts`
  passed **6/6**.
- `VERGLOS_HUNT_DOCKER_TARGET_INTEGRATION=1 pnpm --filter verglos test`
  completed successfully after workspace dependency builds.
- `pnpm exec turbo run build --filter=verglos... --force` passed **7/7**.
- `pnpm exec turbo run typecheck --filter=verglos... --force` passed
  **13/13**.

The Docker qualification used Docker Desktop `29.7.2` on `linux/aarch64` and
the pinned image identity
`node:22-alpine@sha256:0a7108bf6c7bf5de370ffb1a3ed6be93d405b43ff159f681a8d18c0e2bc2e402`.

## Protected verification

All eleven required PR checks passed:

- platform matrix: `38366570622`
- Verglos self-scan: `38366570578`
- in-toto plus Ubuntu/macOS/Windows Node 20/22/24 cells; Windows Node 20
  completed in 9m44s.

## Boundary and acceptance disposition

Top Notchh Solutions owner/operator authorization was used for this public-safe
contribution. The fixture uses no customer source or data, real credential,
live MCP server, provider state, entitlement, database, Production, npm,
hosted target, external network, or arbitrary shell. Owner authorization is
not represented as independent AppSec review, provider confirmation, customer
acceptance, legal clearance, or release approval.

This is an implementation and shipping increment for HUNT-008-R10, not closure
of HUNT-008. The complete row still requires real authorized target workflow,
per-family proof/retest, approved rule and provenance/licensing treatment,
hosted entitlement, required Linux/Docker adversarial qualification,
independent review, and final release acceptance. No backlog checkbox changed.
The score remains **228 checked / 52 unchecked / 280 total (81.4%)**.
