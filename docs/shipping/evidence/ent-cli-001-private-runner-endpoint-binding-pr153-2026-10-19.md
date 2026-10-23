# ENT-CLI-001 private-runner endpoint binding · PR #153 · 2026-10-19

## Scope

This packet records the merged original-logic endpoint-binding increment for
`ENT-CLI-001`. It is implementation and qualification evidence only; it does
not close the row and does not claim a deployed enrollment exchange, approved
runner execution, result reconciliation, enterprise deployment, independent
review, or enterprise acceptance.

## Source and contribution history

- Repository: `Top-Notchh-Solutions/verglos-cli`
- Pull request: https://github.com/Top-Notchh-Solutions/verglos-cli/pull/153
- Implementation: `0d8f2c94df42e045aad18ccee70ba299821cb338`
- Regression coverage: `1ce91a1a7ecf8cdeec54feeeeab800819e717c74`
- Conflict-resolution merge on the feature branch: `8349311ea37486469d01a72dc352da9e7e4d659e`
- Normal merge to `main`: `eb08f3533594458703cd4ee6143b8cbca105bcaf`
- The pull request was merged with a regular merge commit; no squash, rebase,
  force-push, or artificial contribution was used.

## Original logic implemented

The private-runner client now constructs the poll URL from the trusted API
origin plus the exact tenant and runner identifiers. It rejects any caller
route override that is not the canonical
`/api/v1/private-runner/jobs?tenant_id=...&runner_id=...` path. Result upload is
bound to `/api/v1/private-runner/results`, and enrollment is bound to
`/api/v1/private-runner/enroll`; same-origin route overrides fail before
credential use or network access.

The existing security logic remains active: runner-specific credentials,
redirect refusal, bounded response reads and timeouts, signed-job verification,
tenant/runner/target and expiry admission, local replay persistence, and the
source-free least-evidence result projection. The client never executes a job
and never uploads raw runner output.

## Verification actually run

- Focused `private-runner-client.test.ts`: **10/10 passed**, 0 failed.
- `pnpm --dir packages/cli build`: passed.
- `pnpm --dir packages/cli test`: exit code **0**; the package suite recorded
  its documented held A2 integration skip and no failure.
- `git diff --cached --check`: passed before the normal feature-branch merge.
- Hosted platform matrix run `39256317283`: **12/12 required checks passed** —
  Ubuntu, macOS, and Windows Node 20/22/24, in-toto release binding, and all
  platform-independent required checks.
- Official standard/provenance run `39256317277`: passed.
- Verglos self-scan run `39256317254`: passed.

## Disposition

`ENT-CLI-001` remains unchecked. The code-side endpoint-binding defect is
resolved, but the row still requires authorized deployed enrollment, approved
isolated runner execution and result reconciliation, cross-platform operational
evidence, independent review, and enterprise acceptance. The AppSec/Hunt hold
is unchanged. Score remains **239 checked / 41 open / 280 total (85.4%)**.
