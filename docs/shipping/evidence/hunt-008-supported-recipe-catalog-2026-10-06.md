# HUNT-008 supported recipe catalog — 2026-10-06

CLI PR #67 (`30467e6`) merged as `9725e134779d47faced9861c7ce5f4cdff83d825`.

`@verglos/hunt` now exposes a fixed A1 catalog containing only the bounded
`utf8-contains` pure probe. Validation requires the exact adapter, command,
assertion, input keys, denied network, unconditional cleanup, and mandatory
redaction. The catalog records explicit positive, negative, timeout, and
adapter-failure fixture expectations. Unknown recipes and arbitrary command or
network changes fail closed; validation returns a digest for the exact parsed
recipe.

Verification: Hunt package tests pass (40 executed, 16 environment-gated Docker
skips, 0 failures), package typecheck/build pass, and hosted run
`37462319147` passes all nine Ubuntu/macOS/Windows × Node 20/22/24 cells,
Self-scan, and in-toto. This remains substrate evidence: no trusted feed,
licensed recipe provenance, approval/entitlement route, or arbitrary recipe
execution was enabled. HUNT-008/HUNT-009 remain open.
