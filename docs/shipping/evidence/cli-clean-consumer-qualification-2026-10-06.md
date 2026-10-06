# CLI clean-consumer qualification — 2026-10-06

- Source: pinned current CLI tree
  `955412516b96cc09393e78c43bf7d02b9abd05d9`.
- Archive set: six freshly generated `2.0.0-alpha.1` archives in the private
  temporary qualification directory.
- `check-packed-manifests.mjs`: passed for all 6 archives.
- `package-surface-audit.mjs`: passed; declared public entrypoints resolve to
  archive members.
- `verify-clean-consumer.mjs`: passed; a clean consumer installed all six
  archives, imported every library, executed the Verglos CLI, and observed no
  implicit external-engine installation.
- This validates package composition and consumer behavior only. It does not
  prove legal clearance, trusted npm publishing, provenance attestation,
  customer acceptance, or GA release readiness.
