# Public open-source JS/TS corpus execution · 2026-10-23

This is the first execution artifact under the owner authorization recorded in
`owner-authorization-2026-10-23.md`. It covers local, non-destructive analysis
of public repositories at exact commits under their declared licenses. It is a
private reproducibility record, not customer acceptance, an upstream
endorsement, a vulnerability disclosure, or a claim that any repository owner
participated in the run.

## Run contract

- CLI checkout: `verglos-cli-shipping-worktree`
- CLI commit: `78251d1ba47e505380b25ee146f1ca420f1e61a6`
- Node: `v26.4.0`
- Command: `node packages/cli/dist/index.js scan --json --quiet --no-telemetry --output <private-output-dir>`
- Networked secret verification: not requested (`--verify-secrets` was absent).
- Telemetry: explicitly disabled (`--no-telemetry`, `VERGLOS_TELEMETRY=0`).
- Output: derived JSON/HTML reports only under
  `/Users/anuragyadav/Developer/TopNotchh-Workspace/.local-evidence/public-oss-corpus-2026-10-23/`.
- Reproducibility verifier: `scripts/verify-public-oss-corpus.mjs` passed
  with `fixtureCount=6` and `complete=true`. Its retained JSON verification
  output is
  `/Users/anuragyadav/Developer/TopNotchh-Workspace/.local-evidence/public-oss-corpus-2026-10-23/verification.json`
  with SHA-256
  `826757c97e91fb6676211d358b923c212819bd087b7014662228ace0f128a69f`.
- No source, raw findings, credentials, or reports were uploaded to hosted
  Verglos services.
- All six fixture checkouts reported `--is-shallow-repository=false` and had
  an `AUTHORIZATION.md` declaring public-fixture scope, license basis, local
  non-destructive use, retention/expiry, and no customer/endorsement claim.

## Exact results

| Fixture | Exact commit | License | Files | Findings | Score | Coverage | JSON SHA-256 | HTML SHA-256 |
|---|---|---:|---:|---:|---:|---|---|---|
| `buggy-node` | `b1b9cbc8b86f81a1ecb0b142190d4fa4698518da` | ISC | 8 | 58 | 10 | complete / 0 limitations | `65097820ea562f0873aad967a3613cc24e408da3e3a59d27aea771686dd0563e` | `cc5c754317f958e69af94fce63686611187c9e4059c7278f54c70ab47e34011b` |
| `juice-shop` | `1618a611b173b4bf114028e6e02549950606e29d` | MIT | 906 | 55 | 0 | complete / 0 limitations | `1822b4983b011eacac5d0c4ee698de1b13375c7357b023caf0df4b003db9d450` | `b411adb2c3d7a143ade2da6a375857b2966632f8c767442127fa61742b4da824` |
| `nodegoat` | `c5cb68a7084e4ae7dcc60e6a98768720a81841e8` | Apache-2.0 | 67 | 31 | 0 | complete / 0 limitations | `c9124fe53378cb43babd83c7a949bfa389f9e005ac5c2c29c8180c06c653192c` | `1c5425f6f634adb7f9f6da0e4cd841f3dcbceedc03bfcf4a348590f634329e49` |
| `dvna` | `9ba473add536f66ac9007966acb2a775dd31277a` | MIT | 35 | 17 | 34 | complete / 0 limitations | `cdf7f86e37a1bfeaf140815565b10f40a4a31ef11b73bda8939d7f065bbbc9d3` | `28b191242b54675229c02213458591576f768d262eeb58846144264ef1b11046` |
| `nodejs-goof` | `add14ba59e98240d9e00a235dd7d42cd61ae9912` | Apache-2.0 | 25 | 29 | 9 | complete / 0 limitations | `cc68f4cb19eb356d8d53445a2c974c6500a724ab694f0178e200a52c33964ef6` | `981c0e3ede3362d6d4c6ac2f4d1f4277435366fbe8c46c86ddc673a7e4cd9e3d` |
| `damm-vulnerable-node` | `1946570b36bf8e6dcac48142f072f40ee9cee160` | MIT | 38 | 17 | 34 | complete / 0 limitations | `36333d6b02167ec9707e643e8cdfcfa1951c38aff716e01cc28796c75a845259` | `ecf844211209ea5878cb1fbc2de0b5166f8f1ffe892c7fa871e104ef56bf0aeb` |

The reports are intentionally retained outside this repository in the local
evidence directory. This private ledger stores only bounded execution
metadata and hashes. Expiry/revocation handling follows each fixture's
`AUTHORIZATION.md`; a removal request stops further use and requires local
derived-artifact cleanup.

## Disposition

- `ACCEPT-011`: execution input and exact-commit corpus coverage are now
  materially advanced for the public-fixture path.
- `ACCEPT-012`: reproducible CLI runs and bounded report hashes are now
  available for the same path; findings remain product-analysis output, not
  customer feedback or acceptance.
- `ACCEPT-005`, `ACCEPT-006`, and `ACCEPT-008` remain separate external
  customer/recipient/commercial gates. This artifact does not close them.
- `STUDIO-CLI-001` code remains implemented and independently re-runnable;
  this corpus artifact does not invent recipient acceptance for its handoff
  contract.
