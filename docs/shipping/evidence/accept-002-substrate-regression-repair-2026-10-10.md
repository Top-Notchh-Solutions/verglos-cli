# ACCEPT-002 substrate/regression repair — 2026-10-10

## Scope

The private acceptance verifier was rerun against the committed Web fix
`e310c57afec730d0266e72a7adbfff59e5efa09a` and the pinned CLI checkout
`ad6ee1479c887c59eb6630da4754a2e0b7b4045e`.

The Web fix repaired two source-level regressions exposed by the verifier:

- the tenant-scope audit now covers the current 23 protected routes and 36
  guarded methods, including private-runner and client-projection routes;
- recurring subscription creation uses the stable
  `PAYMENT_METHOD_UNAVAILABLE` error contract when Cards are unavailable.

## Verification

Command:

```text
pnpm acceptance:stories:verify
```

Results from the committed-head run:

- CLI package suite: **241/241 passed**, 0 failed, 0 skipped;
- Web full suite: **923/953 passed**, 0 failed, 30 explicit environment-gated
  skips;
- composed Studio/Enterprise/Team/quality substrates: **74/74 passed**, 0
  failed, 0 skipped;
- all verifier commands exited 0 (`allCommandsPassed: true`).

The machine-readable command arguments, exact commits, exit codes, totals,
and output hashes are retained in:

`docs/shipping/evidence/acceptance-stories-verification-2026-10-03.json`.

## Boundary and disposition

This is repository-owned substrate/regression evidence. It does not claim
hosted HTTP, provider lifecycle, customer or recipient acceptance, independent
review, human browser/screen-reader, field-CWV, migration, deletion, or
Production acceptance. No provider, payment, webhook, database, entitlement,
account, customer, deployment, npm, or Production state write occurred.

Keep `ACCEPT-002` and `ACCEPT-003` unchecked. The authoritative backlog remains
**223 checked / 57 unchecked / 280 total (79.6%)**.
