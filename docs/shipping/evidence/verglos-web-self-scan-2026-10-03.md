# Verglos Web self-scan evidence — 2026-10-03

- Target: `/Users/anuragyadav/Developer/TopNotchh-Workspace/verglos-web` at current local `main`
- Scanner: unreleased CLI commit `955412516b96cc09393e78c43bf7d02b9abd05d9` (merged PR #61)
- Command: `VERGLOS_TELEMETRY=0 node packages/cli/dist/index.js scan --json --output .local-evidence/verglos-web-cli-9554125`
- Scan timestamp: `2026-10-03T09:46:07.859Z`
- Project type: Next.js; files walked: 396; duration: 13,597 ms
- Findings: 17 total (1 critical, 0 high, 3 medium, 0 low, 13 info); score `79`, risk `medium`
- Test-file findings: 12 excluded from score by default
- Provenance: complete, `aiAuthoredPercent=37.3`, high confidence, sampled 300/374 files
- JSON report SHA-256: `a389925b7843d8e23db43ea2bf2b294e5920a7704e0b5ada836d6282f8363063`
- HTML report SHA-256: `f9a75ad12783a3dcc36f194ffb5e0ef20c632036cfd03a532b83f1085f404ace`

The critical finding is the developer-machine Cursor MCP configuration under `~/.cursor/mcp.json`, not a repository file; it is retained privately for operator remediation and is not copied into public artifacts. Reports remain in ignored `.local-evidence`; no upload, production write, or checkbox change occurred.
