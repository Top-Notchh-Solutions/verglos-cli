# ACCEPT-011/012 current CLI public-OSS corpus run · 2026-10-24

## Authorization and boundary

This is the owner-authorized local analysis path for public open-source
JavaScript/TypeScript repositories at exact commits. It is not customer
consent, recipient acceptance, upstream endorsement, vulnerability disclosure,
or independent Hunt/AppSec review. Telemetry was disabled, live-secret
verification was not requested, source upload was none, and reports remain
private local derived artifacts.

## Exact execution

- CLI source: clean current CLI worktree commit
  `7d07066f967a2e7899aca6b51f04f306b7071013`.
- Node: `v26.4.0`.
- Command per fixture:
  `VERGLOS_TELEMETRY=0 node packages/cli/dist/index.js scan --json --quiet --no-telemetry --output <private-output-dir>`
- Eight full, non-shallow fixture clones were scanned at their frozen commits.
- Verification JSON: `.local-evidence/public-oss-corpus-2026-10-24-cli-7d07066-rerun-v2/verification-7d07066.json`, SHA-256
  `12fb64d77b0404c35206795979b89d2daf0567e8a11e5681b2d6d55bb4db857c`.
- Triage JSON: `.local-evidence/public-oss-corpus-2026-10-24-cli-7d07066-rerun-v2/triage-7d07066.json`, SHA-256
  `1021c806ed68245ac5b6f4fb7718330296b42e064fc41d29f82245f74e553c9e`.

| Fixture | Exact commit | Files walked | Findings | Coverage |
| --- | --- | ---: | ---: | --- |
| `buggy-node` | `b1b9cbc8b86f81a1ecb0b142190d4fa4698518da` | 8 | 59 | complete |
| `juice-shop` | `1618a611b173b4bf114028e6e02549950606e29d` | 906 | 54 | complete |
| `nodegoat` | `c5cb68a7084e4ae7dcc60e6a98768720a81841e8` | 67 | 31 | complete |
| `dvna` | `9ba473add536f66ac9007966acb2a775dd31277a` | 35 | 17 | complete |
| `nodejs-goof` | `add14ba59e98240d9e00a235dd7d42cd61ae9912` | 25 | 29 | complete |
| `damm-vulnerable-node` | `1946570b36bf8e6dcac48142f072f40ee9cee160` | 38 | 17 | complete |
| `payload` | `57f39097aa17d0ee4db728e393a47409ee24e586` | 8,585 | 79 | complete |
| `vendure` | `b6653518cd342f803469a394eff6beb0f7a13a12` | 3,830 | 65 | complete |

Aggregate verification: **8 fixtures**, **13,494 files walked**, all required
architecture shapes (`small`, `multi-user`, `multi-tenant-team`, and
`enterprise-like`), and **0 coverage gaps**. Bounded triage produced **351
findings**, **23 rule groups**, and **0 coverage gaps**. Observations remain
unadjudicated and no customer claim is made.

## Disposition

This materially advances the owner-authorized public-OSS execution inputs for
`ACCEPT-011` and `ACCEPT-012` and is eligible for the planned POC analysis
path. It does not close `ACCEPT-005`, `ACCEPT-006`, or `ACCEPT-008`, and does
not create provider/Production, customer/recipient, independent-review,
human/field, AppSec/Hunt, or final-release evidence. No backlog checkbox is
changed; the authoritative score remains **244 checked / 36 open / 280 total
(87.1%)**, partitioned as **13 AppSec-dependent / 23 non-AppSec** rows.

