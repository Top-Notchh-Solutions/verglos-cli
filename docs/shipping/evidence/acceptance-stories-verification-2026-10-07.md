# Acceptance-substrate verification · 2026-10-07

## Scope

This refresh runs the private ACCEPT-002/003 harness against the current
workspace roots. It is substrate/regression evidence only. It does not claim
hosted HTTP, provider, customer, reviewer, human-browser, field-CWV,
migration, production, or release acceptance.

CLI root: `/Users/anuragyadav/Developer/TopNotchh-Workspace/.local/verglos-cli-current`
at `ad6ee1479c887c59eb6630da4754a2e0b7b4045e`.
Web root: `/Users/anuragyadav/Developer/TopNotchh-Workspace/verglos-web`
at `cbc0f5a89179995569308695419d4578c57ce716`.

Command:

```text
VERGLOS_CLI_ROOT=/Users/anuragyadav/Developer/TopNotchh-Workspace/.local/verglos-cli-current VERGLOS_WEB_ROOT=/Users/anuragyadav/Developer/TopNotchh-Workspace/verglos-web pnpm --silent acceptance:stories:verify
```

## Results

- CLI configured package suite: 241 tests, 241 passed, 0 failed, 0 skipped;
- Web configured suite: 916 tests, 888 passed, 0 failed, 28 explicit
  environment-gated skips;
- composed Studio/Enterprise/Team/quality substrates: 74 passed, 0 failed,
  0 skipped;
- all three commands exited 0;
- output hashes are retained in
  `docs/shipping/evidence/acceptance-stories-verification-2026-10-03.json`.

An earlier explicit compatibility-checkout run against the old workspace root
`b070942` enumerated 34 tests; it is not used as latest-source acceptance.
The unreleased `2.0.0-alpha.1` source under test is the explicit `.local`
worktree above and its configured package suite enumerates 241 tests.

Frozen story status remains honest: Hunt isolation is qualification-open,
modified-CLI is runtime-qualification-open, Studio recipient is customer-
acceptance-open, Enterprise runner is provider-qualification-open, and
account deletion is implementation-open.

Non-executing control checks also pass:

- `pnpm --silent acceptance:protocol:check` confirms the external workflow
  protocol and consent template are present; external contact remains
  not-performed and customer acceptance remains open;
- `pnpm --silent acceptance:study-protocols:check` confirms the comprehension
  and Hunt adjudication protocols; participant and adjudication runs remain
  open.

The final corpus verifier was deliberately not run because the objective
reserves final corpus analysis for after implementation, qualification,
release-gate, and release-candidate-freeze work.

## Boundary

No production/database/provider/payment/deployment/migration operation ran.
No public repository or marketing surface changed. ACCEPT-002 and ACCEPT-003
remain unchecked pending complete external/hosted/provider/customer evidence,
reviewer sign-off, and the open story coverage above.
