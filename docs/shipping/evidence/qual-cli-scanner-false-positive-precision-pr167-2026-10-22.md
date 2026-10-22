# CLI scanner false-positive precision qualification · 2026-10-22

## Source and implementation

- Public repository: `Top-Notchh-Solutions/verglos-cli`.
- PR #167 merged normally into `origin/main` as
  `db3510356ecd6c6e430d7dcb3b9354e514d777ee`.
- Production implementation commit: `062a5f41`.
- Regression-test commit: `7ccfe683`.
- The source branch and both granular commits were preserved; no squash,
  rebase, force-push, or deletion occurred.

## Verification

- `pnpm --filter @verglos/scanner test`: exit 0, including the new safe-URL
  and static-notice regressions.
- `pnpm --filter @verglos/scanner typecheck`: exit 0.
- `pnpm --filter @verglos/scanner build`: exit 0.
- `pnpm --filter verglos test`: exit 0.
- `pnpm --filter verglos typecheck`: exit 0.
- `pnpm --filter verglos build`: exit 0.
- Merged-head-equivalent CLI self-scan: exit 0, **77 findings**, score
  **81/medium**; the two safe URL `AUTH-003` false positives and the
  production telemetry privacy-notice `D8-001` false positive were absent.
  Provenance was explicitly skipped, so coverage remains incomplete by
  design.
- Hosted verification observed green for the standards/provenance validator,
  Verglos self-scan, in-toto binding, all macOS and Ubuntu Node 20/22/24
  jobs, and Windows Node 22. Windows Node 20/24 were still in progress at
  the merge observation and were not represented as passed.

## Boundary and disposition

This is public code-side scanner qualification only. No database, provider,
Production, customer, recipient, legal, field, independent-review, or AppSec
operation occurred. Nothing was deleted. No shipping checklist row was
checked; the live score remains **239 checked / 41 open / 280 total (85.4%)**.
The first dependency-ready non-AppSec row remains `STUDIO-CLI-001`, open for
authorized independent recipient/customer acceptance and hosted/audit evidence.
