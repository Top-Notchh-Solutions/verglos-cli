# CLI release-artifact gate qualification — 2026-10-06

Source: exact current CLI tree at commit `955412516b96cc09393e78c43bf7d02b9abd05d9`.

In a disposable temporary directory, the release pipeline assembled the six
`2.0.0-alpha.1` archives, generated `THIRD_PARTY_NOTICES`, CycloneDX and SPDX
SBOMs, generated the dependency-license inventory, ran the clean-consumer
verification, and generated `SHA256SUMS`.

- Clean consumer: passed; all six archives installed, all public libraries
  imported, CLI version executed, and no external engine was installed.
- Final `verify-release-artifacts.mjs` gate: failed closed as designed because
  `dependency-license-inventory.json` contains unresolved redistribution
  blockers (BlueOak manual review, nested-license review, and a missing source).
- Temporary artifact directory was under `/tmp` and was not published or
  copied into a repository.

This is qualification evidence for the release gate, not release approval.
LIC-002/003 and DIST-002/003/006 remain open; no backlog checkbox, public
registry, deployment, or production state changed.
