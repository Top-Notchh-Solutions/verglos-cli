# LIC-003 notice-generator recheck — 2026-10-11

## Mechanical result

- Ran `node scripts/generate-third-party-notices.mjs` twice from the private
  CLI shipping source.
- Outputs were byte-identical.
- Generated output size: **197,966 bytes**.
- Output SHA-256: `2355bbf2062a9b3dbe86daf95dbb4d8708236cc276f1b25e59475a7b64febad1`.
- The generator retains package identity and available LICENSE/NOTICE text and
  includes the non-endorsement provenance disclaimer.
- Current `.artifacts` contains **zero `.tgz` release archives** for final
  package-surface qualification.

## Acceptance boundary

`LIC-003` remains unchecked. The mechanical generator is ready, but final
acceptance requires the exact release archives, reconciliation with the
external-content legal record, and authorized legal approval for unresolved
engine/fixture/recipe/notice/redistribution decisions. `LIC-002` is still
open, so this dependent row cannot be accepted. No package, registry,
Production, provider, database, entitlement, account, or customer-data state
was changed. `DIST-001` is the next dependency-ready assessment after the
legal/notice boundary is parked.
