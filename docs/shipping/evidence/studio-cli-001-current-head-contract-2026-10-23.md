# STUDIO-CLI-001 current-head contract qualification — 2026-10-23

## Exact sources

- **CLI:** `3d4bca1f3d306a2d69798d0af58f1361cec69620`.
- **Web:** `16ceddc9855e75e04f10ddd276fae16c7ef09e01`.
- **Database boundary:** local disposable `verglos_test` fixtures only; no
  hosted database or Production data was used.

## Verification

- CLI `pnpm --filter verglos test`: **291 passed / 2 explicit skips / 0
  failures**. The skips are the documented opt-in Hunt Docker qualification
  cases, outside the Studio projection contract.
- Web focused client-projection, client-workspace, tenant-leakage, portfolio,
  handoff, allowance, retention, Studio E2E, route-contract, page-contract,
  and custody-integration suite: **145 passed / 0 failed / 0 skipped**.
- The custody integration used temporary tables and transaction-scoped
  synthetic records. It verified exact redacted projection storage,
  tenant/project binding, allowance reservation release on storage failure,
  handoff lifecycle, and bounded receipt metadata.

## Disposition

The repository implementation and current-head regression contract are
complete. `STUDIO-CLI-001` remains unchecked only for the declared external
customer/recipient acceptance artifact and its hosted/audit record; synthetic
fixtures do not represent that external acknowledgement. No customer source,
provider payment, Production entitlement, or release action occurred. Nothing
was deleted or overwritten.
