# ENT-CLI-001 current-head requalification · 2026-10-22

## Scope

This recheck covers the repository-owned private-runner protocol, client,
transport, route, and least-evidence result contracts at the current merged
CLI/Web heads. It is implementation evidence only. It does not assert
operational enrollment, provider action, customer/recipient acceptance,
independent review, or enterprise release sign-off.

## Exact source

- CLI merged head: `db3510356ecd6c6e430d7dcb3b9354e514d777ee`.
- Web merged head: `8ece40eca79586c75a301751edf9c6b473ff295d`.

## Commands and results

- CLI shared private-runner contracts: **6/6** passed.
- CLI private-runner client contracts: **11/11** passed.
- Web private-runner route, migration, job/result, transport, enrollment,
  lease, result-upload, heartbeat, state, and qualification contracts:
  **26/26** passed.
- Combined focused code-owned result: **43/43**, zero failures.

No remote database URL was used. No provider, Production, customer,
recipient, publication, deployment, legal, independent-review, or release
operation occurred. No secret value was recorded and nothing was deleted.

## Disposition

The code-owned private-runner protocol is implemented and green: signed
short-lived jobs, tenant/runner/target binding, GET-only polling, replay
protection, bounded response bodies, least-evidence results, scoped leases,
and fail-closed malformed input are covered. Keep `ENT-CLI-001` unchecked
until operational enrollment/result reconciliation, cross-platform operational
evidence, independent review, enterprise acceptance, and final release
sign-off are actually evidenced. The live score remains **239 checked / 41
open / 280 total (85.4%)**.
