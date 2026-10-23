# ACCEPT-002 current-head substrate rerun — 2026-10-14

## Scope

The private twelve-story verifier was rerun from clean detached worktrees at
the exact public merge heads:

- CLI `ba6c75b4e1d11b59f1e6e7bf13edc3c4be02b13a`;
- Web `a54d70dfacfaf9506b1336b788d9cd86c9ca74d7`.

The machine-readable result is
`docs/shipping/evidence/acceptance-stories-verification-2026-10-03.json`.
This harness runs repository-owned tests only. It does not create hosted
sessions, call providers, mutate a database or migration, use customer data,
or perform human/browser acceptance.

## Results

Command:

```text
VERGLOS_CLI_ROOT=/tmp/verglos-dist-001-20261014 \
VERGLOS_WEB_ROOT=/tmp/verglos-web-accept-20261014 \
pnpm --silent acceptance:stories:verify
```

- CLI package suite: **290 passed / 3 explicit skips / 0 failed** out of 293;
  output SHA-256 `f0fb913bcca4d1478e21e107395e22580137d51575bf03d1cc48817ed046f7d0`.
- Web configured suite: **920 passed / 30 explicit skips / 0 failed** out of
  950; output SHA-256
  `b3bcef147ed4566f92cba3294c931cc42d7ef01a00322059616db1ecb5d5670c`.
- Composed Team/Studio/Enterprise/quality substrates: **74/74 passed**, zero
  skips and zero failures; output SHA-256
  `afb8ab9a769abb1831c1c2c4fb0f61402a0e8113e606266537d478975ef52684`.
- All three verifier commands exited 0. The frozen story map still contains
  twelve stories and preserves each story's open/partial status.

## Acceptance disposition

This is substrate/regression evidence only. `ACCEPT-002` remains unchecked for
the required hosted/provider, customer/recipient, independent-review,
human-browser/field-CWV, and account-deletion evidence. The lower CLI pass
count versus the earlier run is recorded as three explicit skips; no failure
was hidden or reclassified.

No provider, payment, database, migration, deployment, npm, production,
customer, or reviewer operation occurred. Score is unchanged at **230 checked
/ 50 unchecked / 280 total (82.1%)**.
