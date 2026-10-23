# Latest CLI scan — OWASP Juice Shop technical fixture

## Scope

- Source repository: `https://github.com/juice-shop/juice-shop`
- Full clone path: `acceptance-fixtures/juice-shop`
- Fixture commit: `1618a611b173b4bf114028e6e02549950606e29d`
- Authorization basis: fixture `AUTHORIZATION.md` and upstream MIT license;
  this is a public technical fixture, not a customer repository or endorsement.
- CLI source commit: `67a132cae26994e2a095238228bb809fd3f9af34`
- CLI version: `2.0.0-alpha.1`
- Telemetry: disabled (`VERGLOS_TELEMETRY=0`)
- Network/exploit/Hunt execution: not performed

## Command and result

```text
VERGLOS_TELEMETRY=0 node packages/cli/dist/index.js scan \
  --json --no-provenance --output .local-evidence/juice-shop-cli-67a132c-1791296931
```

The scan completed in 1,029 ms and walked 906 files. The JSON report is kept
outside tracked repositories at:

`/Users/anuragyadav/Developer/TopNotchh-Workspace/.local-evidence/juice-shop-cli-67a132c-1791296931/verglos-report.json`

Report SHA-256:
`1ac1dd89f0ac00b1e2b368c5b9201ddbcec543405b45fe73e189ea30c6f861fc`

Summary: **55 findings**, score `0`, risk level `critical`:

| Severity | Count |
|---|---:|
| Critical | 16 |
| High | 12 |
| Medium | 18 |
| Low | 0 |
| Info | 9 |

Seven test-file findings were excluded from the score and are explicitly
labelled for manual fixture review. Coverage is `incomplete` because
provenance was explicitly skipped; no PASS or complete-coverage claim is made.

## Boundary

This evidence demonstrates the current CLI against a reproducible public
technical fixture. It does not close ACCEPT-005, which requires an independently
authorized customer repository and bounded customer workflow, and it does not
close Hunt, legal, independent-review, hosted-provider, or production gates.
