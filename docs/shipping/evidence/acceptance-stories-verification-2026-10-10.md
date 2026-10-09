# Acceptance-substrate verification — 2026-10-10

## Scope

The private ACCEPT-002/003 verifier was rerun against the authoritative CLI
release head and the current Web head. This is repository-owned
substrate/regression evidence only. It does not claim hosted HTTP, provider,
customer, reviewer, human-browser, field-CWV, migration, production, or
release acceptance.

CLI source: `origin/main` at `f5686b5c5aa11f45f392e647bd9d7e31830654ba`.
Web source: `51e07f5670c1dc4a5de2c0fe1951a5d58c03bf63`.

The CLI was prepared in a detached worktree with the locked offline install,
workspace build, and package test prerequisites. The verifier command was:

```text
VERGLOS_CLI_ROOT=<detached authoritative CLI worktree> VERGLOS_WEB_ROOT=/Users/anuragyadav/Developer/TopNotchh-Workspace/verglos-web pnpm --silent acceptance:stories:verify
```

## Results

- CLI configured package suite: **274/274 passed**, 0 failed, 0 skipped;
- Web configured suite: **918/948 passed**, 0 failed, 30 explicit
  environment-gated skips;
- composed Studio/Enterprise/Team/quality substrates: **74/74 passed**, 0
  failed, 0 skipped;
- all three verifier commands exited 0;
- protocol integrity check passed;
- study-protocol integrity check passed, with participant and Hunt
  adjudication runs still open;
- acceptance corpus integrity passed for 12 fixtures: six full repository
  clones, four artifacts, and two internal fixtures.

The machine-readable command arguments, exact commits, exit codes, parsed
totals, and output hashes are retained in:

`docs/shipping/evidence/acceptance-stories-verification-2026-10-03.json`

The refreshed bundle records the remaining open gates as provider lifecycle,
customer consent, independent review, authenticated browser, field CWV, and
account deletion.

## Boundary and backlog decision

This closes the stale-source/harness qualification problem for the
repository-owned acceptance substrate. It does **not** close ACCEPT-002 or
ACCEPT-003: the twelve-story acceptance remains open for hosted/provider
delivery, customer acceptance, independent review, browser-human evidence,
field-CWV evidence, and account-deletion acceptance. No production, provider,
database, payment, entitlement, migration, or customer state was changed.

Backlog remains **219 checked / 61 unchecked / 280 total (78.2%)**. No
checkbox was changed.
