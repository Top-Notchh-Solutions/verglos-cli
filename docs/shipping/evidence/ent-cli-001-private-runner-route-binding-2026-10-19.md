# ENT-CLI-001 private-runner route-binding hardening · 2026-10-19

## Scope

This packet records a real CLI implementation slice for `ENT-CLI-001`. It
does not close the row and does not claim operational enrollment, runner
execution, provider reconciliation, cross-platform deployment, independent
review, or enterprise acceptance.

## Source and contribution

- Repository: `Top-Notchh-Solutions/verglos-cli`
- Base: `origin/main` at `0823b513f2b1810ad9f6afcb8806ba46f61feedb`
- Implementation: `0d8f2c94` · `fix(cli): bind private runner protocol endpoints`
- Regression coverage: `1ce91a1a` · `test(cli): reject private runner route overrides`
- Pull request: https://github.com/Top-Notchh-Solutions/verglos-cli/pull/153
- Branch: `codex/ent-cli-001-endpoint-binding-20261019`

## Original logic changed

The private-runner client previously accepted any caller-supplied relative
path on the trusted API origin. The poll path is now reconstructed from the
exact tenant and runner identifiers and rejects any override that is not the
canonical `/api/v1/private-runner/jobs?tenant_id=...&runner_id=...` route. The
result upload path is now fixed to `/api/v1/private-runner/results` and rejects
same-origin route overrides. This keeps the bearer-bound protocol client from
being redirected to an unrelated authenticated route.

No remote job is executed by the client, no raw runner output is uploaded, and
the existing signature, target, replay, timeout, response-size, and result
projection checks remain in place.

## Verification

- `packages/cli/src/private-runner-client.test.ts`: **9/9 pass**, 0 fail, 0 skip.
- New tests prove poll and result-upload route overrides are rejected before
  credential/network use.
- `pnpm exec turbo run build --force`: **8/8 tasks pass**.
- Existing CLI qualification baseline remains **291/293 pass, 2 explicit
  Hunt A2 skips, 0 failures**; this slice did not exercise the held AppSec
  target-code qualification.
- `git diff --check`: pass.

## Disposition

`ENT-CLI-001` remains unchecked. Required operational enrollment credential
exchange, approved isolated runner execution and result reconciliation,
cross-platform operational evidence, independent review, and enterprise
acceptance are not established by this local code change. Score remains
**239 checked / 41 open / 280 total (85.4%)**. No AppSec checkbox, provider
state, production state, or customer acceptance state changed.
