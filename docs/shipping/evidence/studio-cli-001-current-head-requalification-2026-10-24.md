# STUDIO-CLI-001 current-head requalification receipt

Date: 2026-10-24

## Exact sources and boundary

- Private CLI workspace commit: `bcb30a7ed645b21ec150e22929f7bd2960b5c7c3`
  (the package source under test is the merged CLI source at its current
  package-history head `f35905d20fc0216299a38467606efa5c648295db`).
- Web implementation commit: `7307ae5e0cea18e6d0803aa179fafcc2a0ce36f8`,
  contained in merged Web `257e1cc8e0b467d16966433033589111f62f56f0`.
- Web custody integration database: isolated local `verglos_test` fixture
  only; no hosted database or Production data was used.

## CLI qualification

Command:

```text
pnpm --filter verglos test
```

The command exited **0**. Every emitted package test group passed with no
failures or cancellations. The only skips were the two documented opt-in Hunt
Docker qualification cases; they are AppSec/Hunt cases and are outside the
Studio projection, approval, custody, and handoff contract.

## Web qualification

The focused current-head command ran the client projection, projection route,
client workspace, route boundaries, tenant leakage, portfolio, handoff,
Studio allowance/retention/E2E, tenant-scope, and custody integration tests
against the isolated local fixture.

Result:

- tests: **161**
- passed: **161**
- failed: **0**
- skipped: **0**
- cancelled: **0**
- todo: **0**

The run covered exact redacted projection approval/digest binding, private
field refusal, tenant/project scope, allowance reservation release on storage
failure, handoff issuance/acknowledgement/revocation, recipient identity
binding, cache boundaries, Studio limits, retention holds, and rollback-safe
custody behavior.

## Shipping disposition

This requalifies the current implementation and regression contract for
`STUDIO-CLI-001`. Keep the backlog row unchecked: the declared authorized
recipient/customer acceptance artifact and its independent hosted/audit record
are still absent. Synthetic fixtures, owner-controlled tests, and forged
Production probes cannot represent that external acknowledgement. No customer
source, payment, entitlement, release, or Production state was changed.
