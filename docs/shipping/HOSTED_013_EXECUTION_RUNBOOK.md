# HOSTED-013 execution runbook (private)

Do not push this file publicly. It documents the exact founder-authorized sequence to run the composed writer against production and record HOSTED-013 as accepted. Every step assumes the reviewer has read the writer + reconciler source and understands what the planners will and will not touch.

## Prerequisites

- Web `origin/main` includes the five planner merges (#34–#38), the writer + reconciler phase (#39), and the writer integration test phase (#40).
- Production DB URL provided out-of-band as `VERGLOS_MIGRATION_AUDIT_DATABASE_URL`; the credential must at minimum allow `SELECT`, `INSERT`, and `SELECT` from `information_schema` under the `public` schema. The audit-only credential from the 2026-09-12 audit was read-only and is not sufficient for commit mode.
- A fresh Neon point-in-time branch or logical backup created immediately before the commit run. Record the branch id or dump URL as part of the evidence bundle.
- No unmerged migration on `verglos-web` main other than 0000–0016 (already applied). If a newer migration lands, resolve it before running the writer.

## Step 1 · Dry-run against production

Purpose: confirm the planner outputs match reviewer expectations and prove the transaction unwinds cleanly under real load.

```
export VERGLOS_MIGRATION_AUDIT_DATABASE_URL=…
pnpm db:writer > hosted-013-dryrun-$(date -u +%Y%m%dT%H%M%SZ).json
```

Verify in the emitted JSON:

- `mode == "dry-run"` and `transactionOutcome == "rollback"`.
- `perSourceCounts.users.wouldCreate` matches the current users count minus any already-migrated / slug-collision / quarantined outcomes.
- `perSourceCounts.monitor_registrations.parentNotMigrated` equals `wouldCreate` from the users bucket (each parent org still needs to be inserted first — see Step 2).
- `writes.organizationsInserted`, `writes.membershipsInserted`, `writes.projectsInserted`, and `writes.mappingsInserted` sum to the total the reviewer expects to see land.
- `perSourceCounts.attestations.wouldPreserve` + `.alreadyMapped` + `.quarantined` sums to the audit's attestation row count.
- `perSourceCounts.licenses.wouldPreserve` + `.alreadyMapped` + `.quarantined` sums to the audit's license row count.
- `perSourceCounts.reports.wouldPreserve` + `.alreadyMapped` + `.quarantined` sums to the audit's report row count.
- No `perSourceCounts.*.quarantined` entry exceeds the reviewer's tolerance. Investigate any non-zero quarantine before proceeding.

If any invariant fails, stop, correct the source data or the planner (via a new phase PR), and start Step 1 again.

## Step 2 · Two-phase commit run

The composed writer plans and writes inside one transaction, so on the first commit run the users planner produces `would-create` orgs while the monitor_registrations planner still sees no parent org and returns `parent-not-migrated`. Run twice to reach steady state.

```
pnpm db:writer --commit --sources=users,attestations,licenses,reports > hosted-013-commit-pass1-$(date -u +%Y%m%dT%H%M%SZ).json
pnpm db:writer --commit --sources=monitor_registrations > hosted-013-commit-pass2-$(date -u +%Y%m%dT%H%M%SZ).json
```

Both runs must exit successfully with `mode == "commit"` and `transactionOutcome == "commit"`. `writes.organizationsInserted` in pass 1 must equal `perSourceCounts.users.wouldCreate`. Pass 2's `writes.projectsInserted` must equal pass 1's expected project count.

If either run raises: stop, run `pnpm db:reconcile` to inspect the state, and open a follow-up phase PR for the correction. Do not manually delete mapping rows.

## Step 3 · Reconciliation

```
pnpm db:reconcile > hosted-013-reconcile-$(date -u +%Y%m%dT%H%M%SZ).json
```

Verify:

- `status == "reconciled"`.
- Every `perSource[].perTargetKind[].orphanMappings` equals `0`.
- Every `perSource[].perTargetKind[].unmappedSourceRows` equals `0`.
- `totals.targetOrganizationsMissing == 0` and `totals.targetProjectsMissing == 0`.
- `totals.mappingsSurveyed` equals the sum of `perSourceCounts.*.wouldPreserve/wouldCreate` from the commit runs.

If any drift is reported, the writer is idempotent; running it again is safe. If drift persists, open a phase PR to fix the plan and re-run.

## Step 4 · Restore/recovery drill

On the fresh Neon branch (or against a restored dump) created before Step 2:

1. Confirm the branch exists and the manifest points at it.
2. Run `pnpm db:migration-audit` against the branch to confirm 33 tables, 17 migrations, and the same source row counts as pre-commit production.
3. Run `pnpm db:writer --commit` against the branch and verify writes match production's Step 2 counts.
4. Run `pnpm db:reconcile` against the branch and verify `status == "reconciled"`.
5. Record the drill result. If any step diverges from production, halt and investigate before considering HOSTED-013 complete.

## Step 5 · Rollback path (tested only, never invoked casually)

Rollback is not a script; it is a documented sequence.

1. Freeze application writes to the affected target tables (`organizations`, `organization_members`, `projects`, `legacy_migration_mappings`) via a maintenance mode or feature flag.
2. Restore from the Step 4 branch or dump.
3. Verify the restored state's row counts and per-table digests match the pre-Step-2 audit snapshot.
4. Reopen application writes.
5. Preserve every hosted-013-* manifest emitted along the way as the incident record.

The writer never issues destructive statements, so a rollback is always a restore-from-backup — there is nothing to "un-write" through DDL.

## Evidence bundle for HOSTED-013 acceptance

Assemble locally (do not push):

- The four `hosted-013-*.json` manifests from Steps 1–3.
- The Neon branch id (or logical dump URL) used for Step 4.
- The Step 4 manifests emitted against the drill branch.
- A short reviewer note stating that Step 5's rollback path was walked-through on the drill branch (even if not fully executed).

Only when every artifact is captured and reviewed does HOSTED-013 flip from unchecked to checked in the backlog. Update `VERGLOS_V1_BACKLOG.md`, `STATUS.md`, `EXECUTION_LEDGER.md`, `TRACEABILITY.md` in one compact commit citing the manifest hashes.

## Non-goals of this runbook

- Findings decomposition (legacy `reports.findings` → `observations` rows) is out of scope; the report planner deliberately preserves reports in place. That decomposition is future work under a separate acceptance item.
- Any legacy plan alias normalization (`sentinel`/`compliance`/`founder` → canonical plan names) is out of scope; the license planner preserves aliases untouched.
- `attestation_verifications` retention is out of scope; those historical page-view rows are governed by a separate retention decision.
