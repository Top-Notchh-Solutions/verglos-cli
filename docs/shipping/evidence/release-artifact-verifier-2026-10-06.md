# Release artifact verifier — 2026-10-06

- Built a complete private release-shaped directory from the six packed
  `2.0.0-alpha.1` archives, generated `THIRD_PARTY_NOTICES`, CycloneDX and
  SPDX SBOMs, dependency-license inventory, clean-consumer marker, and
  `SHA256SUMS`.
- Ran `node scripts/verify-release-artifacts.mjs` against that directory.
- The verifier correctly failed at the license gate with:
  `dependency-license-inventory.json contains unresolved redistribution blockers`.
- The failure occurred after the release sidecar/checksum structure was
  accepted; it is the intended fail-closed behavior until the eight inventory
  blockers receive legal resolution.

No artifact was published, tagged, uploaded, or used to change a release
version. DIST/LIC acceptance remains open.
