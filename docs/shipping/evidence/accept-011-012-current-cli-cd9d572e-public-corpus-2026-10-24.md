# ACCEPT-011/012 current merged CLI public-OSS corpus execution · 2026-10-24

## Authorization and boundary

This is the owner-authorized local analysis path for public open-source
JavaScript/TypeScript repositories at exact commits. It is not customer
consent, recipient acceptance, upstream endorsement, vulnerability disclosure,
or independent Hunt/AppSec review. Telemetry was disabled, no source or report
was uploaded to a hosted service, and the derived reports remain private local
artifacts.

## Exact execution

- CLI source commit: `cd9d572e28462741103cb21a2274e5892939d5d4`, the merged
  head of CLI PR #294 (`c745a2f103e7cf950bcaef1577456dffb94c876b`).
- Runtime: Node `v26.4.0`.
- Command per fixture:
  `VERGLOS_TELEMETRY=0 node packages/cli/dist/index.js scan --json --quiet --no-telemetry --output <private-output-dir>`.
- All eight fixture clones were full, non-shallow checkouts at their frozen
  commits. No exploit, fuzz, load-test, or external service call was run.
- Evidence root:
  `.local-evidence/public-oss-corpus-2026-10-24-cli-cd9d572e-fresh-v2/`.
- Verification JSON SHA-256:
  `9707d32446f764368e3b0e1c89bf20c2a76335df75508da824a57b2eb5fd62b4`.
- Triage JSON SHA-256:
  `fbec9153b582d0ed98311119b4ad0a9eb91622601a0dca7b1fe358e5e0354104`.

| Fixture | Exact commit | Files walked | Findings | JSON report SHA-256 |
| --- | --- | ---: | ---: | --- |
| `buggy-node` | `b1b9cbc8b86f81a1ecb0b142190d4fa4698518da` | 8 | 59 | `0272c16a2050ee06637a6be52c968385aae36672dc610736ee86be6bf39dd81c` |
| `juice-shop` | `1618a611b173b4bf114028e6e02549950606e29d` | 906 | 54 | `deba717e99f09e1022674818fafb0083d4c0fc0c7db3f4cc2a8e9c00cfa0a997` |
| `nodegoat` | `c5cb68a7084e4ae7dcc60e6a98768720a81841e8` | 67 | 31 | `33cb6dabbec20971327266050dc725c4684b715aa0507f8d27ee925f7401494d` |
| `dvna` | `9ba473add536f66ac9007966acb2a775dd31277a` | 35 | 17 | `7715fc296de92362f32d75ec68c5cd7b465f2994504864c7763a7e90d496f3e4` |
| `nodejs-goof` | `add14ba59e98240d9e00a235dd7d42cd61ae9912` | 25 | 29 | `b05c0a561ed338649e9db54e9b6051f9cca62ec905058fe740ced7d150b7edb1` |
| `damm-vulnerable-node` | `1946570b36bf8e6dcac48142f072f40ee9cee160` | 38 | 17 | `e181f3852617d5ef5ba35673a58ed31697005fe5f1f40d27d2b755ced4026645` |
| `payload` | `57f39097aa17d0ee4db728e393a47409ee24e586` | 8,585 | 79 | `dc11fc74808a6010752d96bcb8aff86a940b5badfeddc435fc3be1559dbf2f1d` |
| `vendure` | `b6653518cd342f803469a394eff6beb0f7a13a12` | 3,830 | 65 | `11accbfca32b6da9a89e260a12c0bb9061518baf44eb17c5f3c9cca26296c301` |

## Result and disposition

- **8/8** exact-commit fixtures verified.
- **13,494** files walked.
- All required architecture shapes are present: `small`, `multi-user`,
  `multi-tenant-team`, and `enterprise-like`.
- **0** coverage gaps and **351** bounded observations across **23** rule
  groups.
- Classification is complete; observations remain unadjudicated.

This is a fresh current-merged-CLI execution receipt and materially advances
the reproducibility inputs for `ACCEPT-011` and `ACCEPT-012`. It does not close
either row and does not create provider/Production, recipient/customer,
legal, human/field-CWV, independent-review, AppSec/Hunt, or final-release
evidence. No backlog checkbox changed; the authoritative score remains
**245 checked / 35 open / 280 total (87.5%)**, partitioned as **13
AppSec-dependent / 22 non-AppSec** rows.

The additive private acceptance bundle contains **301** hashed evidence files,
passed secret scanning with zero mismatches, and has manifest
`sha256:c5491c6f6f2bbd90eea9c39fa2d12ea8b444f48c836fbbc1885f03280426d99d`:
`docs/shipping/evidence/acceptance-evidence-bundle-2026-10-24-corpus-cd9d572e-v2.json`.
