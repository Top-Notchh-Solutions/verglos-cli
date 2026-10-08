# Verglos V1 · Manual-input blocker inventory (private)

Do not push publicly. This document enumerates remaining manual-input classes under Verglos V1 and names the specific owner action needed to unblock them. Reconciled 2026-10-07 after current CLI/Web head reconciliation, official CLI artifact validation, Razorpay Test Mode inventory freeze, and the latest private evidence commits. Older bullets below are superseded where this update marks an item accepted.

Per the goal file: "For every item left unchecked in the active area, state the specific unmet criterion and required evidence or owner. Do not describe a task as 'blocked' without naming the dependency and why it prevents work."

Nothing in this document is speculative. Every entry cites the exact acceptance criterion or dependency the item is waiting on.

## Current-state reconciliation · 2026-10-08

The historical entries below retain the evidence that existed when they were
written. The following newer evidence supersedes any older statement that says
the production deployment still lacks the hosted-method configuration:

- The 2026-10-08 production smoke rendered the hosted UPI, Cards, Netbanking,
  Wallets, EMI, and Pay Later projection with HTTP 200 and no browser console
  errors. This confirms the current display/deployment boundary only; it does
  not qualify payment success, capture, refund, renewal, replay ordering,
  webhook delivery, entitlement issuance, or production reconciliation.
- `DIST-WEB-002` and `DIST-WEB-003` are already checked in the authoritative
  backlog. Their older unauthorized-Vercel/missing-variable notes below are
  historical evidence, not current open checklist items.
- `R-041` remains open until the exposed production database credential's
  rotation, Vercel secret refresh, old-credential revocation, and bounded
  read-only verification are independently evidenced. No production database
  write is authorized by this reconciliation.
- `PLAN-WEB-011/012/013/014/015` remain open because the live provider
  lifecycle and production reconciliation evidence is still missing. Further
  requests with the previously flagged Test Mode credential remain frozen.
- The local Web test environment now contains a Neon PostgreSQL value, but a
  bounded metadata/aggregate audit found 26 migration records, 2 users, 1
  license, 1 organization, and 4 Razorpay webhook-event rows. It is therefore
  not an empty isolated Preview database and must not be used for payment
  qualification. The raw value and Neon identifiers were not recorded or
  reused; see `test-database-isolation-audit-2026-10-08.md`.

## Blocker taxonomy

Every remaining item falls in one of these five buckets. Categorized this way so the founder can unblock a batch of items with a single decision or credential.

| Bucket | Manual input required | Items chained off it |
|---|---|---|
| **A · Production DB write** | Production `DATABASE_URL` with write privileges + explicit go/no-go on the writer's `--commit` run per `HOSTED_013_EXECUTION_RUNBOOK.md` | HOSTED-013, all PRO-*, QUAL-WEB-004, and every downstream that reads the tenant/project model |
| **B · Provider/cutover evidence** | Neon PostgreSQL is selected and OPS-001-014 are accepted. Remaining input is the production migration/cutover state needed by OPS-015 plus later measured workload/recovery evidence. | OPS-015, DIST-WEB-003, QUAL-WEB-003/004/005, PRO-005/009 and downstream Studio/Enterprise operations |
| **C · External Hunt content / independent review** | Authenticated, licensed evidence-backed recipe content plus approved supported-rule coverage; later independent isolation review | HUNT-008 through HUNT-011, QUAL-CLI-004 |
| **D · Legal review** | Approved licensing (Trivy / detect-secrets / scanner fixtures / premium rule packs) and third-party redistribution approval. LIC-005 DCO policy is accepted. | LIC-002, LIC-003, DIST-002, DIST-003, DIST-006 |
| **E · POC / commercial** | Authorized customer repositories, POC recruitment consent, paid-pilot authorization, external campaign go-ahead, npm publish / production deploy authorization | ACCEPT-001 through ACCEPT-010, FINAL-WEB-001 through FINAL-WEB-008, RECORD-010 (Phase-8 marketing embargo lift) |

Each unresolved class below points at its governing bucket. Resolving a bucket makes only the dependency-satisfied items in that class executable.

## HOSTED / PRO / QUAL-WEB stack — bucket A (production DB write)

- **HOSTED-013** — planner set, writer, reconciler, and runbook all shipped and merged. Unmet: founder runs `pnpm db:writer --commit` per `HOSTED_013_EXECUTION_RUNBOOK.md`, produces `reconciled` manifest, walks the restore drill on a Neon branch. Owner: founder.
- **PRO-001 through PRO-010** — all block on HOSTED-013's real production data being in the tenant/project model. No PRO-* item can produce its dashboard slice against an empty target-schema production DB.
- **PLAN-WEB-004** — server-side authorization service depends on real tenant data landing via HOSTED-013.
- **PLAN-WEB-005 through PLAN-WEB-010** — usage/allowance/seat/retention enforcement all require live tenant data + real quota measurements post-cutover.
- **QUAL-WEB-004** — migration/restore/disaster-recovery drill requires HOSTED-013 committed and OPS-014/015 selected (see bucket B).

## OPS / DIST-WEB stack — bucket B (provider/cutover evidence)

- **OPS-001 through OPS-014** — accepted. Neon PostgreSQL is the founder-authorized V1 durable queue; producer, advisory processing, matching/outbox, delivery, webhook, dedup, DLQ, retention, telemetry, health metrics, and backup/reconciliation code are merged.
- **OPS-015** — monitoring migration/cutover remains open on HOSTED-013 production data migration and an evidence-backed cutover/rollback run.
- **DIST-WEB-002** — code-side matrix remains complete at Web PR #49 head `b103d9e`; it remains open because the installed Vercel credential is unauthorized, so actual production variable names/scopes, provider-selector provisioning, and production deployment evidence cannot be verified.
- **DIST-WEB-003** — OPS-013/014 are accepted; this runbook now remains chained to DIST-WEB-002 production configuration/deployment evidence and an executable health/rollback rehearsal.
- **QUAL-WEB-003** — concurrency/idempotency load suite blocks on OPS/PLAN.
- **QUAL-WEB-005** — privacy/deletion/retention qualification blocks on OPS-011/012 + Studio/Enterprise foundations.
- **PLAN-WEB-007** — 80% warning behavior blocks on OPS-006.

## HUNT stack — bucket C (external content / independent review)

- **HUNT-002 through HUNT-007** — accepted where applicable (HUNT-001-007 are now all checked). The trust contract remains local/caller-supplied for pre-launch; planning, A1/A2 execution boundaries, redaction, and verdict classification are implemented and tested.
- **HUNT-008** — needs real evidence-backed supported-rule recipes with authenticated provenance/license and positive, negative, timeout, and failure fixtures. Synthetic catalog scaffolding alone cannot satisfy this criterion.
- **HUNT-009 through HUNT-011** — remain downstream of HUNT-008: functional command, MCP tools, and complete adversarial suite.
- **QUAL-CLI-004** — Hunt independent isolation evidence pack chains off HUNT-011 and requires independent security review.

## Licensing stack — bucket D (legal review)

- **LIC-002** — external engine/content license records need approved Trivy/detect-secrets/scanner-fixtures/premium-rule licenses, provenance, modification records, and trademark language. Owner/legal review is external.
- **LIC-003** — `THIRD_PARTY_NOTICES` generator exists (`9a1dad4`, `4435964`) but final artifact/legal qualification needs LIC-002.
- **LIC-005** — accepted at CLI PR #41 with DCO 1.1, inbound license, contribution licensing, trademark/security language, and CLA fallback documented.
- **DIST-002** — trusted npm publishing workflow chains off LIC-003/004 (final licensing before publish). Workflow code (`2f162d2`) exists preparatory.
- **DIST-003** — release artifact attestations/checksums generator (`e5e4e72`, `66312a4`, `d269e45`, `4435964`) is preparatory; needs LIC clearance for public release.
- **DIST-006** — rollback/revocation workflow chains off DIST-002 through DIST-005.
- **DIST-004 / DIST-005** — accepted; they are no longer blocker-inventory items.

## Team / Studio / Enterprise stack — bucket A + bucket B chain

- **TEAM-WEB-001 through TEAM-WEB-010, TEAM-CLI-001/002** — organization creation, RBAC, shared policy versioning, baseline/exception register, approval queue, GitHub/GitLab check integration, Jira/Linear work-item integration, portfolio views, organization signing workflow, and E2E authorization suite all block on TEAM-WEB-001 (which needs HOSTED-002 already checked + PLAN-WEB-009 which blocks on bucket A).
- **STUDIO-CLI-001, STUDIO-WEB-001 through STUDIO-WEB-010** — client workspace model, authorization/leakage suite, canonical branding projection, public verification publication controls, custom-domain verification, handoff receipt model, client portfolio dashboard, retention/export, billing/allowance flows, and E2E acceptance suite all block on STUDIO-WEB-001 (which needs HOSTED-002-007 + PLAN-WEB-010, blocking on bucket A) and RECORD-011 (already checked but STUDIO-CLI-001 also needs PLAN-CLI-001 → chain).
- **ENT-CLI-001, ENT-WEB-001 through ENT-WEB-008** — private runner protocol, SSO organization contract, SCIM lifecycle, runner enrollment/job API, KMS policy, deployment contract, audit export, residency/retention controls, and readiness suite. All chain off TEAM/ENGINE-HUNT-RECORD and bucket A.

## Plan chain — chained off HOSTED-002/003 (bucket A) and production signer key

- **PLAN-WEB-003** — signed entitlement token vNext is operationally qualified against the provisioned successor signer and corrected CLI public pin (`7dcc74b`); the remaining downstream check is a real activation/token issue→verify integration trace, not another key-pin change.
- **PLAN-CLI-001** — capability/allowance consumption and bounded offline fallback are implemented (`7edb4a9`, corrected pin `ac74fb2`). It remains unchecked until the deployed activation/token issue→verify integration trace is captured; local unit/process evidence cannot substitute for that hosted boundary.
- **PLAN-CLI-002** — effective-capability UX blocks on PLAN-CLI-001.
- **PLAN-CLI-003** — modified/untrusted CLI test client blocks on PLAN-WEB-004-012 (bucket A + B chain).
- **PLAN-CLI-004** — plan/catalog contract fixtures block on PLAN-WEB-002/003 + PLAN-CLI-001.
- **PLAN-WEB-011 / PLAN-WEB-012** — code qualification is complete on Web PR #49 head `b103d9e`: catalog-only signed snapshots plus an immutable serialized lifecycle/refund ledger pass local and hosted verification. Acceptance remains blocked on an approved verified INR catalog price, production migration `0018` backup/restore/rollback qualification and application, accessible production configuration, and live Razorpay reconciliation. No production write is authorized by the code result.

## ACCEPT / FINAL-WEB stack — bucket E (POC + commercial)

- **ACCEPT-001** — frozen 10-20 repository/artifact corpus needs founder-authorized customer repositories with responsible-disclosure rules and non-public vulnerable fixtures. Explicitly needs Gate 0-5 pass first.
- **ACCEPT-002 through ACCEPT-010** — every ACCEPT item chains off ACCEPT-001. Includes automated stories, evidence bundles, external workflow protocol, authorized workflows, comprehension test, Hunt adjudication study, commercial acceptance/COGS, truth reconciliation, and GA release candidate freeze.
- **FINAL-WEB-001 through FINAL-WEB-008** — every public marketing copy/pricing/docs/proof-asset/accessibility/claim-sweep item blocks on ACCEPT-009/010 + explicit founder command. Under the goal file's Phase-8 marketing embargo until every prior gate passes.
- **RECORD-010** — legacy `attest` compatibility. Progress commits `077b008` + `e58dbd8` merged. Unmet: Phase-8 correction of `/verify` marketing index. Blocks on same embargo as FINAL-WEB.

## Miscellaneous — bucket A (production DB) or already-partial

- **QUAL-CLI-006** — dependency-ready now that IMPORT exports, RECORD-002/009/011/012, and DIST-004/005 are accepted. CLI PR #47 (`af3aa09`) fixes SPDX generator defects and records official SARIF/CycloneDX/SPDX validation evidence; acceptance still needs official in-toto/Sigstore validation plus supported-platform install/upgrade/rollback evidence. The item remains unchecked while PR #47 hosted matrix/self-scan checks are pending and those remaining evidence classes are absent.
- No independent DIST-005 action remains; it is accepted. The next Hunt item is HUNT-008 and is blocked on the concrete content/provenance evidence stated above.

## Founder-checklist items (explicitly external — bucket A/B/D/E)

These lines in the backlog are explicit founder-decision items, not agent tasks:

- Confirm final plan hypotheses after evidence (Team $99 vs bounded founding cohort; Studio $249 vs bounded founding cohort). [E]
- Neon PostgreSQL queue selection is complete for pre-launch; supply later production cutover/recovery evidence for OPS-015. [B]
- Obtain legal review for premium content license, contributor terms, trademarks, privacy, terms, and enterprise obligations. [D]
- Approve any external engine/fixture redistribution with unresolved license or NOTICE status. [D]
- Approve networked Hunt recipe exceptions individually; default remains no network. [C]
- Arrange independent Hunt isolation/security review. [C]
- Supply authorized customer fixtures/repositories and consent for external acceptance. [E]
- Authorize external conversations, paid pilots, checkout tests, campaign, publish, deploy, npm release, tags, pushes, and production migrations separately. [E]
- Do not claim Team/Studio/Enterprise generally available until their end-to-end gates pass. [E — persistent constraint]

## What CAN still be shipped without founder input

The current CLI and Web implementation heads have no open phase PR requiring local merge work. QUAL-CLI-006's current-head supporting run now has official in-toto, CycloneDX, and SPDX evidence plus Node 22/platform evidence; it remains unchecked because trusted keyless identity, legal/license clearance, independent review, and release approval are not proven. PLAN-WEB-014 is frozen at the provider boundary until the flagged Test Mode credential is rotated/repaired; no further provider calls should use it. DIST-WEB-002/003, PLAN-WEB-015, HOSTED-013, OPS-015, and the downstream PRO/Team/Studio/Enterprise runtime items remain production/cutover-gated. HUNT-008/009/010/011 and QUAL-CLI-004 remain content/provenance/independent-review-gated. POC, legal, publication, and marketing remain external gates.

The next three independent batches are therefore:

1. **R-041 / production safety:** founder rotates the exposed production database credential, refreshes the Vercel production secret, redeploys, revokes the old credential, and provides bounded read-only verification before any production DB operation.
2. **PLAN-WEB-014/015:** after Test Mode credential rotation, establish the account-enabled method set and capture the private lifecycle matrix; only then reconcile production configuration. No guessed method list or QR-only fallback is acceptable.
3. **GITHUB-WEB-004 / external qualification:** authorized App/org installation and bounded install/webhook/check/uninstall/recovery evidence, or the next legal/trusted-publishing review batch if that authorization is not available.

## Recommended founder action order (to unblock the largest chunk fastest)

1. **Bucket A (production DB write)** — one hour of founder time to run the writer + reconciler + restore drill. Unblocks HOSTED-013 + ~30 downstream items (all PRO-*, PLAN-WEB-004+, TEAM/STUDIO/ENT foundations).
2. **Bucket D (legal review)** — clear LIC-002 external-content/redistribution licensing. LIC-005 is already accepted; remaining clearance unblocks DIST-002/003/006.
3. **Bucket C (Hunt external content)** — supply authenticated/licensed evidence-backed recipes and supported-rule evidence. Unblocks HUNT-008-011 + QUAL-CLI-004.
4. **Bucket B (cutover evidence)** — after HOSTED-013, run monitoring migration/cutover and recovery evidence for OPS-015 and downstream operations.
5. **Bucket E (POC + commercial)** — happens last per the goal file's phase ordering. Everything else must be gate-passed first.

Every currently identified acceptance blocker at 2026-09-20 names its required external evidence or owner above; completed provider, DCO, compatibility, and early Hunt items are no longer treated as blockers.
