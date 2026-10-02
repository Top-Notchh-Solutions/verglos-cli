# Verglos full-source fixture scan — 2026-10-02

- Fixture: OWASP Juice Shop (public technical fixture, not customer acceptance)
- Fixture path: `acceptance-fixtures/juice-shop`
- Fixture commit: `1618a611b173b4bf114028e6e02549950606e29d`
- Clone mode: full history; 23,312 reachable commits
- CLI commit: `e63b5041727a175da1d770012cb945a061f05324`
- CLI package line: `2.0.0-alpha.1` built from that checkout
- Command: `VERGLOS_TELEMETRY=0 verglos scan --no-telemetry --output <private-evidence-dir> --json`
- Coverage: complete; 906 files walked; all requested detectors executed
- Result: score 0 / critical; 16 critical, 12 high, 18 medium, 0 low, 9 informational; 7 test-file findings excluded from score

## Boundary observation

Three findings referenced `/Users/anuragyadav/.cursor/mcp.json`, outside the fixture root. This is recorded as an unresolved scanner boundary/privacy observation. The report is not acceptance evidence until the agent-surface detector's intended scope is confirmed or the behavior is corrected and retested.

## Storage

Raw JSON/HTML reports remain in the local private evidence directory and are not committed to a public repository.

