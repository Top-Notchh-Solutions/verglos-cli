# DAMM Vulnerable Node full-fixture scan — 2026-10-06

- Fixture: full checkout at commit
  `1946570b36bf8e6dcac48142f072f40ee9cee160`.
- Authorization: local non-destructive scan/detector qualification only under
  the fixture's `AUTHORIZATION.md`; no exploit, fuzz, load, external contact,
  hosted upload, or customer-assessment claim.
- CLI source: pinned current tree
  `955412516b96cc09393e78c43bf7d02b9abd05d9`.
- Command: `node packages/cli/dist/index.js scan --json --no-telemetry`, run
  with the fixture as the working directory.
- Result: exit `0`; 38 files walked; 17 findings; score `34`, risk level
  `critical`; severity counts critical 2, high 4, medium 6, low 0, info 5.
- Coverage: all 11 requested detectors executed, but status is **incomplete**
  because the npm registry lookup was unavailable. No test-file findings were
  included in the score.
- Scan JSON digest: `sha256:2eaaae79ef6a510e518bffddfa1b0b16bedb2632575101d7c73cbb0543c900d9`
  (raw output remains in the local temporary evidence path only; no source or
  report was uploaded).

This is public-fixture technical evidence only. It does not satisfy customer
consent or external acceptance gates.
