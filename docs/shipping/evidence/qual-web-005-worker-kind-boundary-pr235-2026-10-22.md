# QUAL-WEB-005 worker-kind boundary evidence · 2026-10-22

## Implementation

Web commit `5fa3b6dbb277e71df5e1560e445c086fd044e830` was promoted through
PR [#235](https://github.com/anuragyadav-git/verglos-web/pull/235) and merged
normally as `d0f8749f4365e2d07c4484f20adc91acc76baa8a`. The source branch
`codex/qual-web-005-worker-kind-boundary-20261022` remains preserved.

The account-deletion worker now validates runtime `requestedKinds` values
against the fixed hosted inventory before claiming a job. This closes the
runtime/type-boundary gap where a JavaScript caller could pass an unsupported
kind despite the TypeScript type, and includes a regression proving that no
store claim occurs for that input.

## Qualification

- Focused account-deletion/privacy contracts: **21/21**.
- Web typecheck: passed.
- Full Web test graph: **950/980** passed, **30** explicit skips, **0**
  failures.
- Merged-head acceptance verifier at Web `d0f8749f` and CLI
  `06c7897525caf499f5128ef0d98f866c17387018`: CLI **311/313** with 2 skips,
  Web **950/980** with 30 skips, composed substrates **74/74**, all **12/12**
  stories executed, exit 0.
- Verifier hashes: CLI output
  `e25bfc4e7ce62899191bc3d08558a81b5e708f852f69167c28bb291b7e80e405`, Web
  output `8e0ad22d0bd07bdee1155a1e389707eba915875025280b153837b71bfa11d516`,
  composed output `25c784173b32b532cdcdfeb80f04bf6e63f9b594ae0e0ca2f4d2ed56a19092c`.
- Vercel Preview and GitGuardian passed. Required Web workflow jobs were
  queued at the final merge/status read and are not claimed as passed.

## Boundary and disposition

The supplied `.env.test.local` was inspected without printing values. Its
`TEST_DATABASE_URL` points to a remote Neon `/neondb` target, while the Web
integration harness intentionally accepts only an isolated local/CI
`verglos_test` database; the integration test therefore failed closed before
connecting. No remote database, Production, provider, customer/recipient,
legal, trusted publication, browser-human, field-CWV, or independent-review
operation occurred. No file, branch, record, deployment, provider, customer,
database, or release artifact was deleted or changed.

Keep `QUAL-WEB-005` unchecked for authenticated isolated deletion E2E, legal
and customer-held-record decisions, consent/retention evidence, migration
authorization, restore/rollback acceptance, independent review, and final
acceptance. Score remains **239 checked / 41 open / 280 total (85.4%)**.
