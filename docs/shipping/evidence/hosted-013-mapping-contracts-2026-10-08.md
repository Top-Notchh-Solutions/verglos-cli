# HOSTED-013 mapping and reconciliation contracts — 2026-10-08

## Batch boundary

- **Relevant gates:** HOSTED-013 cutover safety, `QUAL-WEB-004`, and the
  downstream production-data prerequisites for `PRO-*`/organization routes
- **Repository:** current `verglos-web` worktree; no code changes
- **Database:** one isolated loopback-only PostgreSQL mapping test container,
  pinned to `sha256:2bf082886c059b4cf5af3f9e8d3a8916c35699062899061c13bc32d5921c631a`
- **External state:** no Preview, Production, provider, or customer data

## Results

- HOSTED-013 user/project/license/report planner, reconciler, and writer tests:
  **53 passed / 0 failed / 0 skipped**
- Legacy mapping SQL integration test: **1 passed / 0 failed / 0 skipped**
- Aggregate: **54 passed / 0 failed / 0 skipped**
- Web typecheck: passed
- Drizzle schema check: passed
- Ordered migration check: passed; **37** migrations verified
- Mapping container stopped after the run; no containers remained

## Covered safety behavior

The contracts verify deterministic user-scoped IDs and source digests, bounded
email-derived display values, invalid identity/license/ownership quarantine,
legacy `sentinel`/`compliance`/`founder` alias preservation, parent-org
ordering, deterministic writer source filters, explicit dry-run versus commit
limitations, duplicate mapping rejection, digest-only quarantine records, and
reconciliation failure on orphan mappings, unmapped source rows, or missing
target rows.

## Disposition and limitations

This is local planning and mapping evidence only. It does not inspect or alter
production rows, prove a backup/restore, authorize the writer, resolve the
legacy alias/channel/auth-code decisions found in the read-only audit, or
establish production cutover/recovery. No checkbox changed and no database,
payment, entitlement, deployment, or public-repository write occurred.
