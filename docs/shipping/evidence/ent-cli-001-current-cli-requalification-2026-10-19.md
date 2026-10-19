# ENT-CLI-001 current CLI requalification · 2026-10-19

**Disposition:** implementation and regression qualification only;
`ENT-CLI-001` remains unchecked for operational and acceptance evidence.

## Exact source and environment

- **Repository:** `anuragyadav-git/verglos-cli`
- **Source:** `origin/main` at `0823b513f2b1810ad9f6afcb8806ba46f61feedb`
- **Worktree:** disposable clean qualification worktree
  `/private/tmp/verglos-cli-studio-upload-20261019`
- **Runtime:** Darwin 25.5.0 arm64; Node `v26.4.0`; pnpm `9.15.9`
- **Scope:** CLI-side private-runner protocol/client only. No enrollment
  credential, runner process, target repository, provider write, customer data,
  Production state, or AppSec execution was used.

## Commands and results

```text
pnpm --filter verglos test       PASS: 307/309, 0 failures, 2 explicit skips, exit 0
pnpm --filter verglos typecheck  PASS: exit 0
```

The seven focused private-runner tests all passed. They covered authenticated
GET polling, Ed25519 signature verification, tenant/runner/target admission,
local job/nonce replay refusal, bounded streamed-response timeout, least-
evidence authenticated POST upload, malformed-result refusal before network,
and result-response timeout. The two package-test skips are the existing A2
Docker-target qualification cases, not private-runner failures.

## Evidence integrity

- CLI test log SHA-256:
  `b72159b3a4007beab63008d493ad97c7d029d460668cf5f186a06558b6935984`
- CLI typecheck log SHA-256:
  `4da2d8794d161e7eee3f88e04f8600495b4e412e43900b17cfebfea0ef603310`
- Preserved logs:
  `docs/shipping/evidence/artifacts/ent-cli-001-current-2026-10-19/`

## Acceptance boundary

This requalifies the current CLI implementation only. The row still requires
real operational enrollment credentials, an approved runner execution and
result-reconciliation run, supported cross-platform operational evidence,
independent review, and authorized enterprise acceptance. No checkbox changed;
`TEAM-CLI-001` remains checked and Hunt/AppSec rows remain held.

**Score:** **235 checked / 45 open / 280 total (83.9%)**.
