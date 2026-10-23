# Current-head acceptance story verification · 2026-10-23

The twelve-story private verifier ran against clean exact heads:

- CLI `3d4bca1f3d306a2d69798d0af58f1361cec69620`
- Web `16ceddc9855e75e04f10ddd276fae16c7ef09e01`

The first attempt was preserved in
`acceptance-stories-verification-2026-10-23-current.json`; it failed before
tests because the isolated Web worktree had no installed `tsx` dependency.
After `pnpm install --frozen-lockfile` in that worktree, the additive retry
artifact `acceptance-stories-verification-2026-10-23-current-retry.json`
passed all commands:

- CLI: 312 passed / 2 skipped out of 314;
- Web: 956 passed / 30 skipped out of 986;
- composed Web acceptance substrates: 79 passed / 0 skipped out of 79;
- twelve story mappings: complete; zero failures.

The passing retry artifact SHA-256 is
`sha256:9dd4524885443f02db6094e18d46e0ffb726ad4839492ff350caae59612c745e`.
This remains substrate/regression evidence only: no hosted HTTP, provider,
customer, reviewer, human-browser, field-CWV, migration, or Production
acceptance is claimed. ACCEPT-002/003 remain open for their declared external
and reviewer gates. No prior artifact was deleted or overwritten.
