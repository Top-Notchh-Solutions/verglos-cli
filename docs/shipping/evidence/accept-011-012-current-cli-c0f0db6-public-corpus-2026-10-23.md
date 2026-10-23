# ACCEPT-011/012 current merged CLI public corpus run — 2026-10-23

## Authorization and boundary

This is the owner-authorized local analysis path for public open-source
JavaScript/TypeScript repositories at exact commits. It is not customer
consent, recipient acceptance, an upstream endorsement, a vulnerability
disclosure, or an independent Hunt/AppSec review. Telemetry was disabled,
live-secret verification was not requested, networked provider uploads did not
occur, and raw source/findings were not copied into the private tracker.
Existing corpus reports were preserved; this run used a new local evidence
directory:
`.local-evidence/public-oss-corpus-2026-10-23-cli-c0f0db6/`.

## Exact execution

- CLI source: merged CLI `main` commit
  `c0f0db6ab8ab223d0eead310bf827fc11da59bbd`.
- Node: `v26.4.0`; build: **8/8** workspace tasks passed.
- Scan command per fixture:
  `VERGLOS_TELEMETRY=0 node packages/cli/dist/index.js scan --json --quiet
  --no-telemetry --output <private-output-dir>`.
- Eight full, non-shallow fixture clones were scanned at their frozen commits.

| Fixture | Exact commit | Files walked | Findings | Coverage |
| --- | --- | ---: | ---: | --- |
| `buggy-node` | `b1b9cbc8b86f81a1ecb0b142190d4fa4698518da` | 8 | 58 | complete |
| `juice-shop` | `1618a611b173b4bf114028e6e02549950606e29d` | 906 | 54 | complete |
| `nodegoat` | `c5cb68a7084e4ae7dcc60e6a98768720a81841e8` | 67 | 31 | complete |
| `dvna` | `9ba473add536f66ac9007966acb2a775dd31277a` | 35 | 17 | complete |
| `nodejs-goof` | `add14ba59e98240d9e00a235dd7d42cd61ae9912` | 25 | 29 | complete |
| `damm-vulnerable-node` | `1946570b36bf8e6dcac48142f072f40ee9cee160` | 38 | 17 | complete |
| `payload` | `57f39097aa17d0ee4db728e393a47409ee24e586` | 8,585 | 79 | complete |
| `vendure` | `b6653518cd342f803469a394eff6beb0f7a13a12` | 3,830 | 65 | complete |

Aggregate verification: **8 fixtures**, **13,494 files walked**, all required
architecture shapes (`small`, `multi-user`, `multi-tenant-team`,
`enterprise-like`), and **0 coverage gaps**. The exact verification JSON is
`verification-c0f0db6.json`, SHA-256
`f1b16979cb5ef5307b644b37dd41dd964363f5eb61e7cd10cd21dfac534f1e41`.

Bounded triage produced **350 findings**, **23 rule groups**, and **0 coverage
gaps**. Every observation is marked unadjudicated and requires reproduce/
review before product change; customer acceptance is not claimed and
independent review remains required. The triage JSON is `triage-c0f0db6.json`,
SHA-256 `aa99f6935f88647c66961887ee9d417a61ec8d456abf2cec86a4a51b55156c0a`.

This advances the public-fixture execution inputs for `ACCEPT-011` and
`ACCEPT-012`. It does not check either row, close `ACCEPT-005`, or create
provider, Production, customer, reviewer, AppSec/Hunt, or final-release state.
