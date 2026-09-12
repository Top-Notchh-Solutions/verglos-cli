# Verglos V1 release gates

Latest checkpoint (2026-09-12; supersedes dated gate snapshots below): approved web production base-schema migration `0000`–`0014` ran successfully through `pnpm exec drizzle-kit migrate` using Vercel production env. Postflight verifies 33/33 declared public tables, 15 migration-history rows, original 10 table counts unchanged (74 aggregate rows), 23 new tables empty, zero sentinel license rows, `pro` default, and all three project contract columns. A time-based temporary branch from production reproduced the 10-table/74-row baseline and was deleted. This closes only the approved schema-apply operation—not HOSTED-013, production backfill/dual-write, application cutover, or full recovery qualification. Web PR #32 remains OPEN/CLEAN at `67bbe09`; hosted Node 22 workflow `34694532678`, GitGuardian, and Vercel pass. `DIST-WEB-001` remains accepted; the 413-component license inventory still has 79 manual-review flags (53 missing declarations), so legal clearance is not inferred and R-018 remains open. Backlog: 150 unchecked / 119 checked / 269. No application deployment, PR merge, or public-copy change.

Production migration execution (2026-09-12): exact owner approval was received after presenting scope. A fresh read-only preflight identified Neon branch `production`, 10/33 tables, 74 aggregate rows, no journal, 0 sentinel rows, and `licenses.plan` default `'pro'::text`. Local `pnpm db:check` and `pnpm db:migrations:check` passed. `pnpm exec drizzle-kit migrate` exited 0; read-only postflight confirmed the full expected result. Point-in-time branch rehearsal succeeded and the branch was deleted. HOSTED-013 remains unchecked because no user-data backfill/dual-write/cutover or source-to-target reconciliation was executed; those are separate writes requiring their own exact plan and approval. The broader release is not authorized by this schema migration.

Production migration gate update (2026-09-12): bounded repeatable-read/read-only audits found 10/33 declared application tables present, 23 missing, no discoverable migration-history table, and aggregate exact counts totaling 74 rows across present tables. No customer row values were selected. The role can perform DDL/DML outside the read-only transaction. All 15 migrations replay on a disposable schema-only production clone; replay on a clean-empty DB fails because `0000` requires the pre-existing `licenses` baseline. Neon management API `GET /api/v2/projects` returned HTTP 401 using the separate `neon-api-key`, so provider backup/snapshot schedule metadata remains unknown. This is a blocking discovery, not migration readiness. HOSTED-013/R-021 still require identified legacy baseline/history, source-data inventory and reconciliation, signed audit evidence, approved exact migration plan, tested backup/restore and rollback, and independent review. No production write/migration occurred.

Migration replay gate addendum (2026-09-12): 87 existing column names/types/nullability values match Drizzle, but schema constraints/defaults/indexes/grants remain unverified. `0000`'s only data update currently matches zero `sentinel` license rows, but it still changes a column default. No migration-history record or tested snapshot restore was available. `pnpm db:migrate` remains prohibited on the production endpoint pending exact reviewed plan and all restore/reconciliation gates.

Migration gate update (2026-09-12): web `9eba73d` adds a local read-only audit command; local 86/86 tests and build/type/schema/migration checks pass, hosted run `34679868578`, GitGuardian, and Vercel pass. The command observed an empty isolated DB, not production data. HOSTED-013 and R-021 still require a complete/reproducible baseline, authorized source snapshot, signed manifest, mapping/reconciliation evidence, tested rollback, and independent review; this helper does not satisfy or authorize those gates. Backlog count unchanged at 152 unchecked / 117 checked / 269.

Local Hunt runtime revalidation (2026-09-12): Docker Desktop integration against pinned BusyBox passes all 15 runtime assertions; Hunt package aggregate 51 pass / 1 macOS namespace skip. HUNT-011/QUAL-CLI-004 remain open; the skip is not treated as a pass and Linux-host evidence/independent review are still required.

## Gate 0 — Truth and scope

- Current capability registry reconciled with code/tests.
- Every command and plan has a shipped/partial/planned label.
- Open-core, premium content, third-party licenses, notices, and trademark boundaries reviewed.

## Gate 1 — Evidence correctness

- Subject identity is immutable and digest-bound.
- Native and imported observations preserve attribution.
- Duplicate, malformed, stale, and mismatched evidence tests pass.
- Engine absence/staleness yields `INCOMPLETE`, never false `PASS`.

## Gate 2 — Security and agent safety

- No target-code execution during ordinary scanning.
- Hunt recipes are signed, bounded, isolated, redacted, and network-denied by default.
- SSRF, path traversal, archive bomb, symlink, malformed input, resource exhaustion, webhook, and tenant-boundary tests pass.

## Gate 3 — Product and UX

- Local viewer answers release decision before deep evidence.
- Developer, lead, client, and procurement views are understandable without founder explanation.
- Keyboard, screen reader, contrast, reduced motion, and machine-readable alternatives pass.

## Gate 4 — Commercial and operations

- Server-side seats, quotas, retention, overages, billing, and modified-CLI tests pass.
- Idempotency, retries, dead letters, restore drill, rollback, alert delivery, and monitoring pass.
- Per-plan hosted COGS and support cost are measured; no unbounded managed execution exists.

## Gate 5 — Distribution and licensing

- Clean install/upgrade/rollback on supported macOS, Linux, and Windows architectures.
- Trusted npm provenance, dependency SBOM, `THIRD_PARTY_NOTICES`, license validation, attribution, and modification notices are complete.
- Current state (2026-09-12): OPEN. LIC-001/004 and HOSTED-011/012 are accepted; CLI PR #34 self-scan and all nine Ubuntu/macOS/Windows Node 20/22/24 cells pass. Web PR #32 head `0d9a185` passes hosted run `34678019063`, GitGuardian, and Vercel, including 82/82 PostgreSQL-backed tests and all build/schema/security checks. PLAN-WEB-001/002 are accepted: catalog-derived server capabilities and explicit commercial/allowance states are implemented, while PLAN-CLI-001 and R-031 gateway/checkout reconciliation remain open. R-007 operator/provider privileged-access controls remain open. DIST-001 stays open behind LOCAL/HUNT/RECORD dependencies. Publishing remains fail-closed because the nested `benchmark@1.0.0` ISC/BSD-3-Clause conflict needs review; LIC-002 external content records, web redistribution review, release-note qualification, protected publish controls, and full amd64/arm64 install/rollback evidence remain open.

## Gate 6 — External acceptance

Current web update (2026-09-12): PR #32 head `0d9a185` is OPEN/MERGEABLE; hosted Node 22 run `34678019063`, GitGuardian, and Vercel pass. CI passes 82/82 tests with PostgreSQL, typecheck, schema/migration checks, production build, public-boundary, dependency, and tracked-secret checks. HOSTED-011/012 and PLAN-WEB-001/002 are accepted. Backlog count: 152 unchecked / 117 checked / 269. PR #34 also remains open; no merges or deployments were performed.

Web verification addendum (2026-09-12): PR #32 head `21c3b19` passes Node 22 run `34672637622`, including PostgreSQL integration, typecheck, full suite, schema/migration checks, build, public-boundary, dependency, and secret checks; GitGuardian and Vercel pass. HOSTED-011 is accepted at the verified PR head. HOSTED-012 route-level non-member/role-denial and existence-hiding evidence remains incomplete.

- Feature-complete release candidate tested against frozen public and authorized repositories/artifacts.
- Acceptance stories in `VERGLOS_FINAL_ACCEPTANCE_AND_POC.md` pass.
- Truth registry, docs, dashboard labels, pricing copy, and campaign claims updated only after evidence review.
