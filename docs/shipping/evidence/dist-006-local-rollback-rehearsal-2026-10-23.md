# DIST-006 local rollback/revocation rehearsal — 2026-10-23

## Exact candidate

- **CLI source:** `3d4bca1f3d306a2d69798d0af58f1361cec69620`.
- **Runtime:** macOS arm64, Node `v26.4.0`.
- **Fixture:** `scripts/fixtures/release-rollback-rehearsal.json`.
- **Fixture digest:** `sha256:664f70df2f2a0c063d43c767e602266b1adc1709a498dae7ef71825291b960b7`.

## Result

`node scripts/release-rollback-evidence.mjs <local-output-directory>` and
`node scripts/verify-release-rollback-rehearsal.mjs` both passed. The report
was `status: passed`, exit code `0`, with five operations and two historical
records preserved:

| Boundary | Decision |
| --- | --- |
| npm package | rollback |
| engine manifest | rollback |
| Hunt feed | rollback |
| signing identity | revoke |
| Web deployment | rollback |

Focused contracts also passed **3/3**:

- `platform-matrix-contract.test.mjs`
- `release-rollback-evidence.test.mjs` (two tests)

Local output was retained at
`/Users/anuragyadav/Developer/TopNotchh-Workspace/.local-evidence/dist-006-release-rollback-20261023.G3y1xe/`.
The recorded `report.json` SHA-256 is
`sha256:52b4b2cfe6c05afa3e0bbd8b010c7cffd4e6bad0147a3e189d956295a3f2f961`;
`run.log` is
`sha256:1132526800f3d333750d2cc0972dc64fa15f6b82645ffa844092eb224ba70d56`.

## Boundary and disposition

This is a local decision-contract rehearsal using synthetic immutable
references. It made no npm, registry, signing-provider, Hunt-feed-provider,
Vercel, deployment, publication, or revocation call. Historical records were
checked as preserved. `DIST-006` remains unchecked for an authenticated
provider/registry/engine/feed/signing/deployment rollback or revocation run,
independent review, and final release acceptance. Nothing was deleted or
overwritten.
