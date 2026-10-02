# Verglos current-source full fixture scan — 2026-10-02

## Scope

- Fixture: OWASP Juice Shop public technical fixture (not customer acceptance)
- Full clone: `acceptance-fixtures/juice-shop`, commit `1618a611b173b4bf114028e6e02549950606e29d`
- History: 23,312 reachable commits
- CLI source tree: `verglos-cli` merged tree `b781bc41539df3870769996426c03e9209a08ab7` (tree `466d71aef9418093684f726876512f179d9c3b09`)
- CLI package line: `2.0.0-alpha.1`
- Command: `VERGLOS_TELEMETRY=0 node packages/cli/dist/index.js scan --no-telemetry --output <private-dir> --json`
- Exit: `0`

## Result

The scan walked **906 files**, executed every requested detector, completed in 53,885 ms,
and reported no detector coverage limitations. Score output is intentionally preserved:

| Risk | Count |
| --- | ---: |
| Critical | 16 |
| High | 12 |
| Medium | 18 |
| Low | 0 |
| Informational | 9 |

The score is `0 / critical`; seven test-file findings are excluded from the score by the
CLI's explicit test-fixture policy. The report's provenance section reports 35.9% sampled
AI-authored files and high confidence; this is evidence output, not a customer claim.

Report SHA-256 digests (private temporary output):

- JSON: `b05aaae027b6a282b357317bebeecf393b9fb5fc14fa43e61a44077d4c6849cd`
- HTML: `fe1f17a499a4e8dbdcbb71c4671ccd388317715366253aac698df1474ddd77a0`

## Boundary

This is a repeatable current-source technical fixture scan. It does not satisfy authorized
customer acceptance, independent adjudication, or legal approval. Three findings reference
`~/.cursor/mcp.json` outside the fixture root; that scanner-boundary observation remains
recorded and unresolved rather than silently discarded. Raw reports remain private.
