# QUAL-WEB-005 restore-harness evidence · 2026-10-07

- **Code:** Web PR #153 now includes `250313e` (`fix(ops): harden restore
  drill readiness and parsing`), pushed to
  `feat/web-qual-005-deletion-worker`.
- **Disposable rehearsal:** Existing snapshot
  `verglos-web/hosted-013-backup-20260920T151757Z.sql` was restored into a
  disposable `postgres:18-alpine` container. The harness applied all 35
  ordered migrations, ran both HOSTED-013 writer passes, ran reconciliation,
  and simulated a stopped-database fail-closed read.
- **Result:** Docker boot, `pg_restore`, migration, writer pass 1, writer pass
  2, reconciliation (`status=reconciled`), and failure simulation all passed.
  Measured RTO was 3.09s. Report:
  `verglos-web/.worktrees/web-qual-005-deletion-worker/qual-web-004-drill-20261007T-port-55446.json`.
- **Failed gate:** The snapshot mtime produced an RPO of approximately 396h,
  exceeding the critical 48h threshold. The report is therefore failed and is
  not acceptance evidence for a current backup cadence.
- **Harness validation:** `pnpm exec tsc --noEmit`, reconciliation tests, and
  DR-drill tests passed (18/18 focused tests). The harness now waits for the
  host port, captures bounded restore diagnostics, invokes reconciliation
  directly, and parses only the manifest object.
- **Boundary:** This is disposable restore/reconcile evidence only. It does
  not prove a current production backup, Neon restore, Vercel deployment
  rollback, authenticated non-production deletion E2E, or provider/payment
  behavior. No production/provider/payment/database/migration/deployment/
  credential operation occurred. QUAL-WEB-005 remains unchecked.
