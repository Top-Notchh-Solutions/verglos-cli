# DIST-006 current-head rollback/revocation rehearsal · 2026-10-24

## Exact candidate and verification

- **CLI ledger head:** `8c561e13a6431529d069d27c97a9f261c4353c99`.
- **Runtime:** macOS arm64, Node `v26.4.0`.
- **Build:** `pnpm build` passed **8/8** Turbo package builds.
- **Focused tests:** `node --test scripts/release-rollback-evidence.test.mjs`
  passed **2/2**, with **0** failures, cancellations, or skips.
- **Rehearsal:** `release-rollback-evidence.mjs` and
  `verify-release-rollback-rehearsal.mjs` exited **0**.

The bounded report matched fixture manifest
`sha256:664f70df2f2a0c063d43c767e602266b1adc1709a498dae7ef71825291b960b7`,
covered five decisions (npm-package rollback, engine-manifest rollback,
Hunt-feed rollback, signing-identity revocation, and Web-deployment rollback),
and preserved two historical records. The report SHA-256 is
`sha256:1b02fa0fc7c7287954249e5a0a484ca5b8d057b0979f2f26325561b11cef362d`;
the run-log SHA-256 is
`sha256:1132526800f3d333750d2cc0972dc64fa15f6b82645ffa844092eb224ba70d56`.

## Boundary and disposition

This is a local fail-closed decision-contract rehearsal using synthetic
immutable references. It did not call npm, a registry, a signing provider,
Hunt-feed provider, Vercel, or any authenticated rollback/revocation endpoint.
It does not prove that a live release or credential was rolled back or
revoked. `DIST-006` remains open for the real provider/registry/engine/feed/
signing/deployment operation, operational review, and final release
acceptance. No publication, version/tag, credential, customer state, or file
was deleted or overwritten. Score remains **246 checked / 34 open / 280 total
(87.9%)**, split **13 AppSec-dependent / 21 non-AppSec**.
