# ENT-CLI-001 current-merge private runner requalification — 2026-10-18

## Scope

This packet requalifies the current public private-runner protocol/client and
hosted transport code. It is implementation evidence only; it does not close
`ENT-CLI-001`, which still requires operational enrollment, approved runner
execution/result reconciliation, cross-platform operational qualification,
independent review, and enterprise acceptance.

## Exact public heads

- CLI current merge: `50bcab42eadfa8796d86d1f7a8aaee3010c65647`
- CLI positioning implementation preserved by that merge:
  `8da4617d34196be2c9fcd86c166259ef82984f28`
- Web current merge after PR #188: `a94ff8e352f29f75860340fab69fb472af25924f`
- Relevant public protocol surfaces: `packages/shared/src/private-runner.ts`,
  `packages/cli/src/private-runner-client.ts`, the CLI runner command, and Web
  private-runner enrollment/jobs/results routes and transport contracts.

## Verification

In a detached worktree of the exact CLI current merge, after
`pnpm install --frozen-lockfile`:

- Shared full package suite: **457 tests, 457 passed, 0 failed, 0 skipped**.
- CLI full package suite: **293 tests, 291 passed, 2 explicit skips, 0 failed**.
- Shared private-runner focused protocol tests: **5/5 passed**.
- CLI private-runner client focused tests: **7/7 passed**.
- Workspace build: **8/8 tasks passed**.
- Workspace typecheck: **14/14 tasks passed**.
- `git diff --check`: passed.

The tests cover signed short-lived job verification, tenant/runner/target
binding, GET-only polling, replay-state persistence, malformed-job refusal,
bounded response-body timeout, least-evidence result projection, authenticated
result upload, malformed projection refusal, and timeout classification. The
current implementation contains no general remote-shell or arbitrary-command
field.

## Remaining acceptance boundary

The current code and local/CI qualification do not establish:

- a real operational enrollment credential exchange;
- an approved runner executing a real bounded job and reconciling its result;
- cross-platform operational qualification of that deployed runner;
- independent security review of the runner/Hunt boundary; or
- authorized enterprise acceptance.

`ENT-CLI-001` therefore remains unchecked. No production, customer, provider,
registry, account, database, or deployment state was changed. No public source
change was needed for this requalification, and no squash, rebase, force-push,
empty, duplicate, artificial, or documentation-only contribution was used.
