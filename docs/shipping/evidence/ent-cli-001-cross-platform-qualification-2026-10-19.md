# ENT-CLI-001 cross-platform runner qualification

## Scope

This packet records the substantive public implementation and qualification
advance for the private-runner protocol. It does not claim enterprise
enrollment, customer acceptance, independent AppSec review, or production
runner execution.

## Public implementation

- Repository: `anuragyadav-git/verglos-web`
- Pull request: #219, merged normally (no squash)
- Implementation commit: `61d4ff79f6c6b2a5be169fbbbfb93f5222b2fd6a`
- Merge commit: `bbe70d4f9cf9946ac390ebcc6c915f7409f77d8d`
- Workflow: `.github/workflows/private-runner-qualification.yml`
- Branch: `codex/ent-cli-cross-platform-matrix-20261019`

The workflow adds a public-safe qualification matrix on Ubuntu, macOS, and
Windows using Node 22 and the locked pnpm version. It also runs a separate
Linux isolated PostgreSQL lifecycle job using the pinned public image
`public.ecr.aws/docker/library/postgres:15-alpine@sha256:f7d23353e1b15400d22ebe31189f4d314b87a4c129cc400c8c2d8d4ca127bf81`.
The workflow has read-only repository permissions and does not contain
credentials, customer source, or provider state.

## Local qualification

In a clean worktree from the Web public `origin/main` source:

- `pnpm install --frozen-lockfile`: passed.
- `pnpm test:private-runner`: **24/24 passed, 0 skipped, 0 failed**.
- `pnpm typecheck`: passed.
- YAML parse and `git diff --check`: passed.
- `node scripts/check-public-boundary.mjs`: passed.
- `pnpm test:private-runner-e2e`: **1/1 passed, 0 skipped, 0 failed** against
  the pinned PostgreSQL image; the temporary container was cleaned up.

## Hosted CI qualification

Workflow run `39180216393` passed:

- Isolated PostgreSQL runner lifecycle: passed, job `117831177265`.
- Protocol and client on `ubuntu-latest`: passed, job `117831177495`.
- Protocol and client on `macos-latest`: passed, job `117831177525`.
- Protocol and client on `windows-latest`: passed, job `117831177444`.

The existing required Web check also passed in run `39180216557`, job
`117831178085` (`typecheck-and-schema`). Vercel deployment, Preview Comments,
and GitGuardian checks passed for the PR.

## Disposition

This closes the implementation and cross-platform qualification sub-work for
ENT-CLI-001, but the backlog row remains unchecked. The row still requires
operational enrollment credential exchange, an approved enterprise/recipient
runner execution and result reconciliation, independent review where required,
and authorized enterprise acceptance. No credential was exchanged and no
customer or Production runner was used here.

AppSec/Hunt-held rows remain unchanged. This evidence does not replace the
independent Hunt review or authorize arbitrary command execution.

