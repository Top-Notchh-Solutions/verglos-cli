# TEAM-WEB-006 GitHub App response boundary — 2026-10-18

## Scope

This packet records a public Web hardening slice for the GitHub App provider
exchange. It does not claim a live provider installation, signed webhook
delivery, repository check publication, customer acceptance, or AppSec/Hunt
qualification.

## Public change

- Repository: `anuragyadav-git/verglos-web`.
- Pull request: [#196](https://github.com/anuragyadav-git/verglos-web/pull/196).
- Implementation commit: `8b8a259e3892ee017c081351e2ee91f807a6e0ea`.
- Regression-test commit: `ae038eb86b0435005457eaf65cb344f15bdb2a85`.
- Normal merge commit: `dbe30687b08da0978609ad8fd186c40e2d11721f`.

## Implemented behavior

The provider exchange now keeps its bounded abort signal active through response
body consumption, rejects bodies larger than 1 MiB before JSON parsing, and
maps body-stream aborts to the bounded provider failure rather than exposing
provider/runtime error details. The request timeout remains capped at 10
seconds, with shorter values accepted for deterministic tests.

## Verification

- `node --import tsx --test src/lib/organizations/github-app-contract.test.ts` —
  **11 passed, 0 failed**.
- `pnpm exec tsc --noEmit` — passed.
- `git diff --check` — passed.
- Hosted `typecheck-and-schema` — passed.
- GitGuardian Security Checks — passed.
- Vercel Preview Comments — passed.
- Vercel Preview — passed.

The PR retained both substantive commits and was merged with the regular merge
method; no squash or rebase was used. No Production operation, provider secret,
private key, customer repository, or browser credential was stored.

## Gate disposition

This is provider-boundary implementation progress only. `TEAM-WEB-006` remains
unchecked because live installation, hosted credential configuration, signed
delivery, check publication, retry/reconciliation, and operational cutover are
still required. The AppSec-held rows remain parked. No backlog checkbox changed.

Live score at capture: **232 checked / 48 open / 280 total (82.9%)**.
