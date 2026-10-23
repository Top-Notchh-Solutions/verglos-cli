# ENT-CLI-001 private-runner protocol requalification — 2026-10-19

## Verification

The private-runner implementation commits `723f655` and `68772d7` are
ancestors of the current CLI merge `50bcab42eadfa8796d86d1f7a8aaee3010c65647`.
On the checked-out implementation worktree, the bounded protocol and client
tests were rerun:

- shared private-runner protocol: **5/5 passed**;
- CLI private-runner client: **3/3 passed**;
- shared and CLI typechecks: passed;
- no test was skipped or failed.

The exercised contract covers signed-job verification, tenant/runner/target
binding, expiry and replay refusal, network/limit bounds, malformed nested
JSON refusal, GET-only polling, local replay persistence, and least-evidence
result projection. The protocol contains no arbitrary shell or general
remote-command field.

## Boundary and disposition

This is code-side requalification only. No runner credential was exchanged,
no customer or Production runner executed, and no external provider or
database state changed. `ENT-CLI-001` remains unchecked pending operational
enrollment credential exchange, approved isolated runner execution and result
reconciliation, cross-platform operational evidence, independent review, and
authorized enterprise acceptance. AppSec/Hunt remains unchanged.

The ledger score remains **235 checked / 45 open / 280 total (83.9%)**.
