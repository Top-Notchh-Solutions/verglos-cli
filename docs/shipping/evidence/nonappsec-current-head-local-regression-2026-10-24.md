# Current non-AppSec local regression · 2026-10-24

## Exact candidates

- CLI product source: `f6facdc5ad312325f00618e3e463dc81569c4341`
- Web product source: `257e1cc8e0b467d16966433033589111f62f56f0`
- Commands were run locally from the authoritative CLI and Web worktrees;
  no GitHub Actions runner, provider payment, package publication, deployment,
  customer data, or Production database write was used.

## Results

| Worktree | Command | Result |
| --- | --- | --- |
| CLI | `pnpm test` | Turbo **13/13 tasks successful**, exit 0 |
| Web | `pnpm test:serial` | **904/928 passed**, **24 designed skips**, **0 failures**, **0 cancellations**, exit 0 |

The Web skips are the repository's explicit database-bound integration skips;
they are not failures or relabeled passes. The CLI run used the shared local
Turbo cache and all 13 package test tasks completed successfully.

## Boundary

This is current local implementation/regression evidence for the non-AppSec
candidate. It does not create provider publication, customer/recipient
acceptance, human screen-reader or field-CWV evidence, independent review,
AppSec/Hunt review, account-deletion acceptance, or final release sign-off.
No backlog checkbox changed.
