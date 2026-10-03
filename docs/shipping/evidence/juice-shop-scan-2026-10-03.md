# Juice Shop full-checkout scan evidence — 2026-10-03

Status: local technical fixture evidence only; this is not customer acceptance or OWASP endorsement.

- Fixture: `acceptance-fixtures/juice-shop`
- Repository checkout: full clone (`is-shallow-repository=false`)
- Fixture commit: `1618a611b173b4bf114028e6e02549950606e29d` (Juice Shop 20.2.0)
- Authorization basis: local MIT-licensed public technical fixture; see fixture `AUTHORIZATION.md`
- Verglos source: CLI commit `955412516b96cc09393e78c43bf7d02b9abd05d9` (PR #61 merged as `18ab8e7da3003186b80346c3ee4a58c5d8211626`), unreleased `2.0.0-alpha.1` source tree
- Command: `VERGLOS_TELEMETRY=0 node packages/cli/dist/index.js scan --json --no-provenance --output .local-evidence/juice-shop-cli-9554125`
- Scan timestamp: `2026-10-03T09:39:48.129Z`
- Files walked: 906
- Findings: 55 total (16 critical, 12 high, 18 medium, 0 low, 9 info); score `0`, risk `critical`
- Test-file findings: 7, excluded from score by default
- Coverage: incomplete because provenance was explicitly skipped; no network verification or Hunt execution was requested
- JSON report SHA-256: `5cb906b0f85febfe60f193ab9823faa9009b5d57e9e8fdc0f18a698cdd335777`
- HTML report SHA-256: `4e242d3a569eb367f1ced5c5241f5893e7d24ae154c9720b5748a2d18b952c3b`

The derived reports remain in the local ignored `.local-evidence` directory. Findings are not uploaded, published, or represented as a customer assessment. This evidence does not close `ACCEPT-001`/`ACCEPT-005`, `QUAL-CLI-004`, or independent-review gates.
