# Current-head non-AppSec implementation regression · 2026-10-24

## Exact sources and local environment

- Private shipping worktree: `7e8a9ba937da2f83e34a6ee80b0d2053b82e18cf`.
- CLI current head: `7d07066f967a2e7899aca6b51f04f306b7071013`.
- Web current head: `791500d4dbc495312287287f692a6fc39120e3a2`.
- Runtime: Node `v26.4.0`, pnpm `9.15.9`, macOS arm64.
- Local dependency preparation used `pnpm install --frozen-lockfile --force
  --ignore-scripts`; this installs the complete lockfile optional-package
  metadata set needed by the deterministic license/SBOM checks. It changes no
  tracked source or lockfile bytes.

## Results

The current local implementation substrate passed all of the following:

| Surface | Command/result |
| --- | --- |
| CLI build | `pnpm build`: **8/8** workspace packages |
| CLI typecheck | `pnpm typecheck`: **14/14** tasks |
| CLI tests | `pnpm test`: exit `0` |
| Web serial regression | `pnpm test:serial`: exit `0`; current suite recorded as **904/928** with 24 designed skips and 0 failures |
| Web public-release smoke | `pnpm test:public-release-smoke`: **12/12** |
| Web truth registry | `pnpm test:truth-registry`: **37/37** |
| Web typecheck | `pnpm typecheck`: exit `0` |
| Private shipping contracts | `node --test scripts/*.test.mjs`: **179/179**, 0 failures/skips |

The private suite includes the backlog partition audit, evidence bundle
builder/verifier, license inventory and SBOM determinism, public package
packing, release checks, rollback rehearsal, acceptance-story/comprehension/
commercial/workflow validators, triage, and final-regression fail-closed
contracts. The complete run used no GitHub Actions minutes and made no
provider, registry, database, payment, customer, or release-publication write.

## Shipping disposition

This is current code-side implementation and regression evidence for the
non-AppSec queue. It does not substitute for a real customer/recipient,
participant/commercial, authenticated deletion, human screen-reader or
field-CWV, trusted publication/attestation, independent review, AppSec/Hunt,
or final release/go-no-go event where the row contract requires one. No
backlog checkbox changes; the authoritative score remains **245 checked / 35
open / 280 total (87.5%)**, partitioned as **13 AppSec-dependent / 22 open
non-AppSec** rows. Nothing was deleted or overwritten.
