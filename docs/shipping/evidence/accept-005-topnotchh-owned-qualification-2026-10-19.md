# ACCEPT-005 first-party owned-repository qualification · 2026-10-19

**Disposition:** qualification evidence only; `ACCEPT-005` remains unchecked.
This run does not claim external customer acceptance, recipient acceptance,
provider acceptance, or an independent security review.

## Authorization and scope

- **Authorizing owner:** Anurag Yadav, owner of Top Notchh Solutions and
  Verglos.
- **Authorization reference:**
  `docs/shipping/evidence/owner-authorization-2026-10-14.md`.
- **Repositories:** `Top-Notchh-Solutions/verglos-cli` and
  `anuragyadav-git/verglos-web`, both evaluated as first-party
  Top Notchh-owned working repositories.
- **Permitted scope:** exact detached commits and tracked repository contents
  only; no customer repository, customer data, credentials, production
  database, hosted write, publication, or external recipient.
- **Network/data policy:** telemetry disabled and provenance disabled. No
  network destination or Hunt exception was authorized. This local scanner
  run is not an OS-level network-isolation proof.

## Exact sources and command

- CLI commit:
  `50bcab42eadfa8796d86d1f7a8aaee3010c65647`
- Web commit:
  `390fd3f82b2a59003e30e2362ab593ef1db4b982`
- CLI command used for each clean detached worktree:
  `VERGLOS_TELEMETRY=0 node <qualified-cli>/packages/cli/dist/index.js
  scan --json --no-provenance --output <private-output>`
- Runtime: macOS `Darwin 25.5.0 arm64`; Node `v26.4.0`; pnpm `9.15.9`.
- The scanner distribution was built from CLI commit
  `50bcab42eadfa8796d86d1f7a8aaee3010c65647` in a disposable qualification
  worktree. The worktree had only the documented package-install metadata
  adjustment used for cross-platform dependency installation.

## Bounded results

| Target | Report | Findings | Score | Risk | Coverage |
| --- | --- | ---: | ---: | --- | --- |
| CLI | `verglos-report.json` | 78 | 67 | high | incomplete; provenance skipped |
| Web | `verglos-report.json` | 22 | 73 | medium | incomplete; provenance skipped |

The CLI report counted 1 critical, 2 high, 3 medium, 0 low, and 72 info
findings; 40 test-file findings were excluded from the score. The Web report
counted 1 critical, 1 high, 3 medium, 0 low, and 17 info findings; 16
test-file findings were excluded. The bounded summary retains no snippets,
source, secrets, personal data, or raw finding output.

The reports also surfaced a user-level Cursor configuration finding outside
the checked repository scope. It is recorded as an observation of scanner
scope, not as a repository acceptance finding. No AppSec conclusion is drawn
from this qualification run.

## Artifact digests

Raw JSON/HTML reports and terminal logs were temporary local artifacts and
were not copied into private evidence. Their SHA-256 values were captured
before deletion:

- CLI JSON: `7f6a1b35cea636bbddf8c46a59228a1075e9c3f7964f6fb909f68933b9d96de9`
- CLI HTML: `e8d0cbb178c822496baeed25f68be622147a8e99cabd7e437264d7a965671572`
- CLI terminal log:
  `8fa98edfe097566dc0133d8d975097e79641063fe06747539212b7ea4b5f212e`
- Web JSON: `952e708fbc1c1d51e549d482d938b86d4c20f5dd19374dfcf82143069f7358bf`
- Web HTML: `dedef82c47d4736b97b71727f777d2a1cac7098472428ec614da8c03eea365d5`

The Web shell wrapper did not provide a usable exit capture because zsh
rejects the reserved variable name `status` after the scan output was
generated. The JSON artifact is valid and its bounded summary is recorded;
this is not represented as a passing workflow exit.

## Acceptance decision

This is a first-party technical qualification, not the external workflow
required by the row. The row remains open for a completed consented-team
workflow, owner-facing recipient evidence, reproducible full coverage,
retention/deletion evidence, and the separate AppSec/reviewer boundary where
applicable. No backlog checkbox or score changed.

