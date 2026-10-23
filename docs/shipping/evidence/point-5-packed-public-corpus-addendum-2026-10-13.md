# Point-5 packed public corpus addendum — 2026-10-13

**Evidence type:** repository-owned, local-only packed npm qualification
**Status:** stronger Point-5 progress; not publication, held-out POC, or final
acceptance
**Qualified package version:** `2.0.0-alpha.1`
**Packed source head:** `78251d1ba47e505380b25ee146f1ca420f1e61a6`
**Merged public main:** `13ee73b5dbe2d0e40ff3e47dab692ca3426f90ef`
**Public PR:** `https://github.com/Top-Notchh-Solutions/verglos-cli/pull/91`

## What was tested

The seven local public archives were installed into a fresh temporary npm
consumer. The consumer did not use the npm registry for Verglos packages, did
not use the hosted account, and did not receive a license key. The scan
processes ran from each fixture root with an isolated `HOME`/`USERPROFILE`,
`VERGLOS_TELEMETRY=0`, `--no-telemetry`, and no `--verify-secrets` option.
Reports were written to temporary directories outside the repositories. No
source, report, credential, or finding was uploaded to Verglos.

The representative provenance-enabled runs used:

| Language/shape | Repository | Exact commit | Files walked | Findings | Score | Coverage | Exit |
|---|---|---:|---:|---:|---:|---|---:|
| JavaScript, Express security fixture | `https://github.com/OWASP/NodeGoat.git` | `c5cb68a7084e4ae7dcc60e6a98768720a81841e8` | 67 | 25 | 27 | complete | 0 |
| TypeScript/JavaScript, large Express app | `https://github.com/juice-shop/juice-shop.git` | `1618a611b173b4bf114028e6e02549950606e29d` | 906 | 39 | 3 | complete | 0 |

Report SHA-256 values:

- NodeGoat: `ade6eebffd5cc00d5c66293b37a140e58d1bf57bc551a4e81b9a621b126b8ac7`
- Juice Shop: `205a92abbf9b9f8760fc1422bfecde8124ae82c0da7249bb2b38f37b058310f5`

The same packed consumer also ran non-provenance scans against two additional
public fixtures, both with exit 0: Snyk Labs `nodejs-goof` at
`add14ba59e98240d9e00a235dd7d42cd61ae9912` (25 files, 22 findings, score 48)
and Appsecco DVNA at `9ba473add536f66ac9007966acb2a775dd31277a` (35 files, 9
findings, score 75). Those two runs intentionally used
`--no-provenance`; they are supplementary install/scan evidence, not a claim
of complete provenance coverage.

## Package and runtime boundary

The package set contained exactly these seven archives and passed packed
manifest and clean-consumer checks:

- `verglos`
- `@verglos/shared`
- `@verglos/scanner`
- `@verglos/reporter`
- `@verglos/mcp`
- `@verglos/entitlement`
- `@verglos/hunt`

The clean consumer imported the public libraries, ran `verglos --version`,
and confirmed that no external engine was installed implicitly. The separate
packed Hunt run executed the signed A1 fixture under the local Pro-shaped
capability cache and was recorded in
`hunt-public-package-runtime-2026-10-12.md`.

## Interpretation and limits

This proves that the packed public CLI can install and scan real public
JavaScript/TypeScript repositories locally, including provenance analysis on
the representative JS and TS fixtures. It does not prove customer consent,
hosted paid entitlement, GitHub/GitLab installation, payment lifecycle,
Trivy database qualification, independent AppSec review, legal approval,
npm publication, or final acceptance. Public technical fixtures are not
customers and do not imply endorsement by OWASP, Snyk Labs, Appsecco, or
Juice Shop contributors.

No backlog checkbox changed. Point 5 remains open until the remaining
authorized corpus and its required plan, MCP, Hunt, record, Docker/Trivy,
failure, and no-source-upload evidence are reconciled.
