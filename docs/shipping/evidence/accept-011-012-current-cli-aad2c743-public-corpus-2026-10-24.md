# ACCEPT-011/012 current alpha.4 CLI public-OSS corpus rerun · 2026-10-24

## Authorization and boundary

This is the owner-authorized local analysis path for public open-source
JavaScript/TypeScript repositories at exact commits. It is not customer
consent, recipient acceptance, upstream endorsement, vulnerability disclosure,
or independent Hunt/AppSec review. Telemetry was disabled, live-secret
verification was not requested, source upload was none, and reports remain
private local derived artifacts.

## Exact execution

- CLI source: current alpha.4 candidate commit `aad2c74395a5c381c955ab9dfab7462295564840`.
- Node: `v26.4.0`.
- Build: `pnpm build` passed **8/8** Turbo package builds.
- Command per fixture:
  `VERGLOS_TELEMETRY=0 node packages/cli/dist/index.js scan --json --quiet --no-telemetry --output <private-output-dir>`
- Eight full, non-shallow fixture clones were scanned at their frozen commits.
- Verification JSON: `.local-evidence/public-oss-corpus-2026-10-24-cli-aad2c743-rerun-v1/verification-aad2c743.json`, SHA-256
  `d225b27781364c828da074cda64b700f50de19d9c0e6fd6f9568f00e648f4745`.
- Triage JSON: `.local-evidence/public-oss-corpus-2026-10-24-cli-aad2c743-rerun-v1/triage-aad2c743.json`, SHA-256
  `204fae877456bb6d3fd6f5153c835c3fff78552922d5e4fcf33964d5e564705d`.

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

This refreshes the ACCEPT-011/012 execution inputs against the current alpha.4
candidate rather than the earlier `7d07066` CLI head. It materially advances
the planned owner-authorized public-OSS POC path, but it does not close
ACCEPT-005, ACCEPT-006, or ACCEPT-008 and does not create provider/Production,
customer/recipient, independent-review, human/field, AppSec/Hunt, or
final-release evidence. No backlog checkbox is changed; the authoritative
score remains **245 checked / 35 open / 280 total (87.5%)**, partitioned as
**13 AppSec-dependent / 22 non-AppSec** rows.
