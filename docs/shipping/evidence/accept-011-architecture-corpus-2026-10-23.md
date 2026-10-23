# ACCEPT-011 architecture-shaped public OSS corpus · 2026-10-23

## Scope and authorization

This is a private, local execution artifact for the owner-authorized public
open-source benchmark path. The corpus uses full, non-shallow clones pinned to
exact commits and contains JavaScript/TypeScript repositories selected to cover
small, multi-user, multi-tenant/team, and enterprise-like architecture shapes.
It is not customer acceptance, recipient consent, endorsement, or a claim about
the upstream projects. No live-target attack, fuzzing, load test, contact, or
provider/Production operation was performed. Derived reports remain under the
workspace's local evidence directory; raw source and reports are not copied
into this private tracker.

The Payload and Vendure fixture directories contain the owner's local
authorization notes. Vendure is used only under its GPLv3 community license
for local analysis; the commercial license is not used, and no Vendure source
or derived report is redistributed.

## Exact fixture manifest

| Fixture | Upstream and exact commit | License | Architecture shape(s) | Scan result |
| --- | --- | --- | --- | --- |
| `buggy-node` | `https://github.com/UtkarshGupta-CS/buggy-node` · `b1b9cbc8b86f81a1ecb0b142190d4fa4698518da` | ISC | small | 8 files, 58 findings |
| `juice-shop` | `https://github.com/juice-shop/juice-shop` · `1618a611b173b4bf114028e6e02549950606e29d` | MIT | multi-user | 906 files, 55 findings |
| `nodegoat` | `https://github.com/OWASP/NodeGoat` · `c5cb68a7084e4ae7dcc60e6a98768720a81841e8` | Apache-2.0 | multi-user | 67 files, 31 findings |
| `dvna` | `https://github.com/appsecco/dvna` · `9ba473add536f66ac9007966acb2a775dd31277a` | MIT | small | 35 files, 17 findings |
| `nodejs-goof` | `https://github.com/snyk-labs/nodejs-goof` · `add14ba59e98240d9e00a235dd7d42cd61ae9912` | Apache-2.0 | multi-user | 25 files, 29 findings |
| `damm-vulnerable-node` | `https://github.com/rdurlo/Damm-Vulnerable-Node-Application` · `1946570b36bf8e6dcac48142f072f40ee9cee160` | MIT | small | 38 files, 17 findings |
| `payload` | `https://github.com/payloadcms/payload` · `57f39097aa17d0ee4db728e393a47409ee24e586` | MIT | multi-tenant/team | 8,585 files, 79 findings |
| `vendure` | `https://github.com/vendure-ecommerce/vendure` · `b6653518cd342f803469a394eff6beb0f7a13a12` | GPL-3.0-only | multi-tenant/team, enterprise-like | 3,830 files, 68 findings |

The six historical fixture names and metadata are preserved from the prior
corpus manifest. The two new repositories are pinned to the remote HEADs
observed on 2026-10-23 and cloned fully at those commits. Payload's
multi-tenant plugin documentation and Vendure's channel-scoped multi-tenancy,
roles, and self-hosting documentation are the architecture-shape evidence
paths recorded by the verifier.

## Reproduction and verification

The corrected scans ran from each fixture's own clone directory with telemetry
disabled and the CLI at commit `2db1139337d60543fd59ec0b7e3130983d40e0a3`.
Both new scans exited successfully with complete coverage and zero scanner
limitations. The verifier then confirmed:

- 8 full, non-shallow fixtures;
- all four required architecture shapes present;
- 100% JS/TS code share for six fixtures, 99.54% for Juice Shop, and 99.97%
  for Vendure;
- 13,494 files walked in aggregate and 354 findings in the expanded triage
  input;
- no architecture coverage gaps.

The verifier output is retained at
`/tmp/verglos-public-oss-verification-architecture-2026-10-23.json` for this
run and has SHA-256:

```text
8d4c3de593cd07010d8959a4bd31cfaf8e8c5f07b6064e4a55be3c9e314186e7
```

The derived reports are under:

```text
.local-evidence/public-oss-corpus-2026-10-23/payload-corrected
.local-evidence/public-oss-corpus-2026-10-23/vendure-corrected
```

An initial invocation used the wrong working directory and produced preserved
diagnostic output in the sibling `payload` and `vendure` directories. Those
outputs are not used as evidence and were not deleted or overwritten.

This implementation advances the corpus input for `ACCEPT-011` and
`ACCEPT-012`; it does not close the rows. Independent review, held-out
correction/acceptance, and final release gates remain open. No provider,
Production, customer, or final-release action occurred.
