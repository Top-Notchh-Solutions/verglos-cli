# Agent-surface path redaction — 2026-10-02

- Repository: `verglos-cli`
- PR: https://github.com/Top-Notchh-Solutions/verglos-cli/pull/52
- Commit: `514349f`
- Change: global agent configuration findings now report `~/.cursor/...` rather than absolute developer home paths
- Regression test: asserts the rendered finding path contains no temporary/home directory path
- Local verification: scanner package tests passed; full CLI build passed
- Fixture rescan: 906 files walked; score unchanged; zero absolute `/Users/anuragyadav/...` finding paths
- Hosted CI: pending at time of recording

This protects report portability and avoids disclosing the scanning operator's local filesystem path. It does not suppress or disable global agent-surface detection.

