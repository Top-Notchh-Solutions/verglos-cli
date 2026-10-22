# ENT-CLI-001 current merged-head reconciliation — 2026-10-22

## Scope

This packet records the ENT-CLI-001 implementation hardening and merged-head
qualification. It does not close the backlog row and does not claim an
enterprise enrollment credential exchange, customer-runner acceptance, or
production/provider execution.

## Public implementation and promotion

- Repository: `Top-Notchh-Solutions/verglos-cli`
- Implementation commit: `e72e83f40ce0b1137795c945c35ea8c5354e2645`
- Pull request: [#162](https://github.com/Top-Notchh-Solutions/verglos-cli/pull/162)
- Merge commit: `a6ca411c012e319e434e667d5d50c384455f53ff`
- Source branch: `codex/ent-cli-001-reconciliation-20261022` (preserved)
- Related Web source: `e1b20ac864ff4f6e005382e8792f3abe0aadbf2a`

The CLI upload client now fails closed unless a successful result
acknowledgement contains `ok: true`, a canonical lowercase
`sha256:<64-hex>` `resultDigest`, and a boolean `idempotent` field. The
regression test covers a malformed successful-looking response.

## Qualification

- Focused private-runner client suite: **11/11 passed**.
- Forced CLI workspace test/typecheck/build graph: **23/23 tasks passed**.
- Merged-head acceptance verifier: CLI **311/313** with 2 explicit skips and
  0 failures; Web **950/980** with 30 explicit skips and 0 failures; composed
  Web substrates **74/74**; all **12/12** stories mapped; exit 0.
- CLI verifier output SHA-256:
  `77cca446245d6412b3dac745638b3507fb9b9648b2d2b4ac2572b9bca1f90ef3`
- Web verifier output SHA-256:
  `84b0a47da61400a44e21dfc146c11a9dd5889f44ecf620163f8776840bfd7417`
- Composed substrate output SHA-256:
  `32c6b1bf109389ef141a5181f8e0e226e88af2b6d7ceee805456856e1a739b2d`
- Hosted PR checks: the Platform Matrix run concluded successfully, and the
  official standard/provenance, in-toto, and self-scan checks passed. The
  Windows/Node 22 check was still reporting an in-progress GraphQL status
  during the final read even though its workflow run concluded successfully.

## Boundary and disposition

The verifier used no `TEST_DATABASE_URL`, hosted HTTP, provider, customer,
reviewer, browser-human, field-CWV, migration, or Production operation. The
supplied Web `.env.test.local` was not sourced into this verifier; its test
database value remains private and unused. No file, branch, record,
deployment, provider, customer, database, or release artifact was deleted or
changed.

Keep `ENT-CLI-001` unchecked for operational enrollment credential exchange,
an authorized bounded enterprise runner execution and result reconciliation,
cross-platform operational acceptance of that deployed runner, independent
review where required, and authorized enterprise acceptance. Score remains
**239 checked / 41 open / 280 total (85.4%)**.
