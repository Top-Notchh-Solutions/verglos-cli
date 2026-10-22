# STUDIO-CLI-001 current-head requalification · 2026-10-22

## Scope

This recheck covers the repository-owned CLI client-projection contract and
the Web Studio custody/handoff contract at the current merged heads. It is
implementation evidence only. It does not assert independent recipient or
customer acceptance, provider payment, Production entitlement, or external
audit sign-off.

## Exact source

- CLI merged head: `db3510356ecd6c6e430d7dcb3b9354e514d777ee`.
- Web merged head: `8ece40eca79586c75a301751edf9c6b473ff295d`.
- Web PR #244 merged normally; no source branch or artifact was deleted.

## Commands and results

- CLI shared client-projection tests: **5/5** passed.
- CLI projection/upload tests: **7/7** passed.
- Web custody/handoff/Studio contract suite:
  `client-projection`, route contracts, leakage, handoff contracts, and
  `studio-e2e`: **46/46** passed.
- Web current-head release smoke remained **7/7**, with public smoke
  **18 routes / 22 claims / 2 proof assets / 0 issues**.
- Web typecheck passed.

The tests use synthetic bounded fixtures and local source contracts. No
remote database URL, provider, customer, recipient, legal, Production,
publication, deployment, or release-sign-off operation occurred. No secret
value was read into this packet. Nothing was deleted.

## Disposition

The code-owned STUDIO-CLI-001 contract is implemented and green at the current
merged heads: projections are allowlisted and digest-bound, upload approval is
required, tenant/workspace/record scope is enforced, and recipient handoff is
bounded and single-use. Keep `STUDIO-CLI-001` unchecked until the authorized
independent recipient/customer acceptance and its hosted/audit artifact exist.
The live score remains **239 checked / 41 open / 280 total (85.4%)**.
