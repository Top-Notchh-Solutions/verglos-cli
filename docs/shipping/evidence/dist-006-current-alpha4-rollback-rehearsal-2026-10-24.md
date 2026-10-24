# DIST-006 current alpha.4 rollback rehearsal · 2026-10-24

## Exact candidate and verification

- **CLI source:** `aad2c74395a5c381c955ab9dfab7462295564840`.
- **Runtime:** macOS arm64, Node `v26.4.0`.
- **Build:** `pnpm build` passed **8/8** Turbo package builds.
- **Focused tests:** rollback evidence contracts passed **2/2**.
- **Rehearsal:** `release-rollback-evidence.mjs` and
  `verify-release-rollback-rehearsal.mjs` passed with exit 0.

The bounded report matched fixture manifest
`sha256:664f70df2f2a0c063d43c767e602266b1adc1709a498dae7ef71825291b960b7`,
covered five decisions (npm package rollback, engine-manifest rollback, Hunt
feed rollback, signing-identity revoke, and Web deployment rollback), and
preserved two historical records. Report SHA-256:
`sha256:6bd077dbc1c25d37874e0bd1868cc3c82aaf85546e266df53ced1cf4e530cb0d`.
The run log SHA-256 was
`sha256:1132526800f3d333750d2cc0972dc64fa15f6b82645ffa844092eb224ba70d56`.

## Boundary and disposition

This is a local fail-closed decision-contract rehearsal using synthetic
immutable references. It did not call npm, a registry, signing provider,
Hunt-feed provider, Vercel, or any authenticated rollback/revocation endpoint.
`DIST-006` remains open for an actual provider/registry/engine/feed/signing/
deployment operation, independent review, and final release acceptance. No
publication, version/tag, credential, customer state, or file was deleted or
overwritten. Score remains **245 checked / 35 open / 280 total (87.5%)**.
