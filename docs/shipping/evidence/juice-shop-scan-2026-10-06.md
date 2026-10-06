# Juice Shop full-fixture scan — 2026-10-06

- Fixture: full OWASP Juice Shop checkout at commit
  `1618a611b173b4bf114028e6e02549950606e29d` (20.2.0).
- Authorization: local non-destructive scan/detector qualification only, under
  the fixture's MIT-based `AUTHORIZATION.md`; no exploit attempts, fuzzing,
  load tests, callbacks, hosted upload, or publication.
- CLI source: pinned current Verglos tree
  `955412516b96cc09393e78c43bf7d02b9abd05d9`.
- Command: `node packages/cli/dist/index.js scan --json --no-telemetry`, run
  with the fixture as the working directory.
- Result: exit `0`; 906 files walked; 55 findings; score `0`, risk level
  `critical`; severity counts critical 16, high 12, medium 18, low 0, info 9.
  Seven test-file findings were explicitly excluded from the score.
- Coverage: `complete`; all 11 requested detectors executed; no limitations.
- Scan JSON digest (stored only in the local temporary run output):
  `sha256:0b82322b4492ea8a71afc01642c0bed470458f8fcb0a4addbe12d447eb336649`.

This is technical fixture evidence only. The fixture authorization explicitly
states that it is not a customer repository and does not provide OWASP
endorsement or customer acceptance. ACCEPT-004/005 remain open.
