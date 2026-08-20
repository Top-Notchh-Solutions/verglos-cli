# Changelog

## 2.0.0-alpha.1

### Added

- `verglos hunt` shell (Pro+, exit `78` in alpha).
- `verglos attest` shell (Studio, exit `78` in alpha).
- `packages/hunt` and `packages/attest` scaffolds with stable interfaces.
- `verified` field on `Finding` (`null` in alpha).
- Reporter rendering for verified state in HTML, terminal, and JSON reports.
- Five new MCP tools: `verglos_hunt_finding`, `verglos_hunt_report`, `verglos_hunt_before_write`, `verglos_hunt_explain_verdict`, and `verglos_attest`; all are stubs in alpha.
- Studio tier in the entitlement matrix.
- `hunt` and `attest` config schema blocks.

### Changed

- Report `schemaVersion` bumped to `2.0.0`.
- `--help` grouped around the CLI trio: Scan, Hunt, Attest, Fix & CI, Session, and Utilities.

### Notes

- No functional hunt or attest logic ships in alpha; both are shells only.
- Free tier no longer runs hunt. Free remains the local scanner, provenance, slopsquat, MCP scan, CI critical gate, and local report tier.
