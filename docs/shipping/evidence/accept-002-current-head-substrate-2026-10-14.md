# ACCEPT-002 current merged-head substrate verification — 2026-10-14

## Scope

The private twelve-story acceptance verifier was rerun against the exact
current disposable source heads:

- CLI `ba6c75b4e1d11b59f1e6e7bf13edc3c4be02b13a` in
  `/private/tmp/verglos-cli-qual-006`;
- Web `a54d70dfacfaf9506b1336b788d9cd86c9ca74d7` in
  `/private/tmp/verglos-web-qual-006`.

The machine-readable result is retained at
`docs/shipping/evidence/acceptance-stories-verification-2026-10-03.json`.
The verifier is repository-owned and runs only local package/composed test
commands. It does not create hosted sessions, call a payment/provider API,
mutate a database or migration, use customer data, or perform a browser-human
review.

## Results

Command:

```text
VERGLOS_CLI_ROOT=/private/tmp/verglos-cli-qual-006 \
VERGLOS_WEB_ROOT=/private/tmp/verglos-web-qual-006 \
pnpm --silent acceptance:stories:verify
```

- CLI package suite: **291 passed / 2 explicit skips / 0 failed** out of 293;
  output SHA-256
  `d3f69c9546986bb42e9401fa2a604b153379a7500b90a9e1d2b09f1cc1f10620`.
- Web configured suite: **920 passed / 30 explicit skips / 0 failed** out of
  950; output SHA-256
  `65d47fe07bbfafba9737b0b3b5eacec83b16362d8b85768a81aec44c6e6d90bb`.
- Composed Team/Studio/Enterprise/quality substrates: **74/74 passed**, zero
  skips and zero failures; output SHA-256
  `d465637c78a9fd16106f6b96598db13b9309c26f23415a20a98099591c802ac0`.
- All three verifier commands exited 0. The frozen story map still contains
  twelve stories and preserves their individual open statuses.

## Acceptance boundary

This is current-head substrate/regression evidence, not complete ACCEPT-002 or
ACCEPT-003 acceptance. The open stories still require the applicable hosted
provider lifecycle, authorized customer/recipient observation, independent
review, human browser/field-CWV evidence, and account-deletion qualification.
The verifier deliberately does not manufacture those observations.

Owner/next action: Top Notchh Solutions; use the separately authorized
Preview/provider/recipient/runner/browser operations when each fixture and
reviewer is available. No review date is asserted by this local run.

No checkbox changed: **228 checked / 52 unchecked / 280 total (81.4%)**.
