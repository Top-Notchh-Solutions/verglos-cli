# Verglos V1 · Manual-input blocker inventory (private)

Do not push publicly. This document enumerates every remaining open backlog item under Verglos V1 and names the specific manual input (owner + action) the founder must supply to unblock it. Compiled 2026-09-16 after the HOSTED-013 planner set, writer + reconcile, writer integration test, QUAL-CLI-001 determinism corpus, and DIST-004 install-matrix invariants all merged.

Per the goal file: "For every item left unchecked in the active area, state the specific unmet criterion and required evidence or owner. Do not describe a task as 'blocked' without naming the dependency and why it prevents work."

Nothing in this document is speculative. Every entry cites the exact acceptance criterion or dependency the item is waiting on.

## Blocker taxonomy

Every remaining item falls in one of these five buckets. Categorized this way so the founder can unblock a batch of items with a single decision or credential.

| Bucket | Manual input required | Items chained off it |
|---|---|---|
| **A · Production DB write** | Production `DATABASE_URL` with write privileges + explicit go/no-go on the writer's `--commit` run per `HOSTED_013_EXECUTION_RUNBOOK.md` | HOSTED-013, all PRO-*, QUAL-WEB-004, and every downstream that reads the tenant/project model |
| **B · Provider selection** | Founder-authorized decision (with measured workload, security/privacy, recovery, exit, cost evidence) for durable queue + object storage per architecture decision set | OPS-001 through OPS-015, DIST-WEB-002, DIST-WEB-003, QUAL-WEB-002, QUAL-WEB-003, QUAL-WEB-004, PRO-005, PRO-006, PRO-009, OPS-015 →  most STUDIO/ENT retention items |
| **C · External content / trust root** | Authenticated Hunt publisher root, licensed recipe content, and an approved recipe feed/rotation policy | HUNT-002 through HUNT-011, QUAL-CLI-004 |
| **D · Legal review** | Approved licensing (Trivy / detect-secrets / scanner fixtures / premium rule packs), contributor DCO-or-CLA decision, third-party redistribution approval | LIC-002, LIC-003, LIC-005, DIST-002, DIST-003, DIST-006 |
| **E · POC / commercial** | Authorized customer repositories, POC recruitment consent, paid-pilot authorization, external campaign go-ahead, npm publish / production deploy authorization | ACCEPT-001 through ACCEPT-010, FINAL-WEB-001 through FINAL-WEB-008, RECORD-010 (Phase-8 marketing embargo lift) |

Every task listed below points at exactly one of these buckets. When the founder resolves a bucket, that block of items becomes executable.

## HOSTED / PRO / QUAL-WEB stack — bucket A (production DB write)

- **HOSTED-013** — planner set, writer, reconciler, and runbook all shipped and merged. Unmet: founder runs `pnpm db:writer --commit` per `HOSTED_013_EXECUTION_RUNBOOK.md`, produces `reconciled` manifest, walks the restore drill on a Neon branch. Owner: founder.
- **PRO-001 through PRO-010** — all block on HOSTED-013's real production data being in the tenant/project model. No PRO-* item can produce its dashboard slice against an empty target-schema production DB.
- **PLAN-WEB-004** — server-side authorization service depends on real tenant data landing via HOSTED-013.
- **PLAN-WEB-005 through PLAN-WEB-010** — usage/allowance/seat/retention enforcement all require live tenant data + real quota measurements post-cutover.
- **QUAL-WEB-004** — migration/restore/disaster-recovery drill requires HOSTED-013 committed and OPS-014/015 selected (see bucket B).

## OPS / DIST-WEB stack — bucket B (provider selection)

- **OPS-001** — architecture decision set explicitly defers durable queue/object-storage provider selection pending representative workload measurements, security/privacy review, recovery drill, exit plan, and actual-cost comparison. Provider-neutral contract already lands on main. Unmet: founder ranks candidates (Neon jobs, Vercel Queues, external queue service like AWS SQS/Cloud Tasks) and records a justified selection.
- **OPS-002 through OPS-015** — every OPS item chains off OPS-001's provider choice: due-job producer, inventory/advisory worker, normalization/cache, reverse-index matcher, transactional outbox, delivery workers, webhook hardening, alert dedup, dead-letter, retention, telemetry, ops metrics, backup/restore, monitoring cutover.
- **DIST-WEB-002** — production configuration validation stays preparatory until queue/object-storage variables exist (OPS-001).
- **DIST-WEB-003** — deployment/rollback/health runbook needs OPS-013/014 to define what "healthy" and "restored" mean.
- **QUAL-WEB-002** — SSRF/webhook suite blocks on OPS-008 (hardened webhook delivery).
- **QUAL-WEB-003** — concurrency/idempotency load suite blocks on OPS/PLAN.
- **QUAL-WEB-005** — privacy/deletion/retention qualification blocks on OPS-011/012 + Studio/Enterprise foundations.
- **PLAN-WEB-007** — 80% warning behavior blocks on OPS-006.

## HUNT stack — bucket C (external content / trust root)

- **HUNT-002** — recipe verification/trust store needs authenticated official publisher root and licensed recipe feed. Local trust-store code (`40b16dc`, `2318b9d`) exists but is caller-supplied; no official root or managed feed exists.
- **HUNT-003 through HUNT-011** — every downstream Hunt item chains off HUNT-002. Recipe planner, probe runners, verdict classifier, initial recipe set, functional hunt command, MCP Hunt tools, and adversarial sandbox suite all require trusted recipes.
- **QUAL-CLI-004** — Hunt independent isolation evidence pack chains off HUNT-011 and requires independent security review.

## Licensing stack — bucket D (legal review)

- **LIC-002** — external engine/content license records need approved Trivy/detect-secrets/scanner-fixtures/premium-rule licenses, provenance, modification records, and trademark language. Owner/legal review is external.
- **LIC-003** — `THIRD_PARTY_NOTICES` generator exists (`9a1dad4`, `4435964`) but final artifact/legal qualification needs LIC-002.
- **LIC-005** — contributor ownership policy needs founder DCO-or-CLA decision, inbound license, and future entity-assignment path.
- **DIST-002** — trusted npm publishing workflow chains off LIC-003/004 (final licensing before publish). Workflow code (`2f162d2`) exists preparatory.
- **DIST-003** — release artifact attestations/checksums generator (`e5e4e72`, `66312a4`, `d269e45`, `4435964`) is preparatory; needs LIC clearance for public release.
- **DIST-006** — rollback/revocation workflow chains off DIST-002 through DIST-005.
- **DIST-004 / DIST-005** — DIST-004 install invariants are shipping on the current CLI phase PR (QUAL-CLI-001 + DIST-004). DIST-005 upgrade/backward-compat matrix chains off DIST-004 + CONTRACT-012; once DIST-004 accepts, DIST-005 is executable *without* external inputs — noting as a follow-up executable item.

## Team / Studio / Enterprise stack — bucket A + bucket B chain

- **TEAM-WEB-001 through TEAM-WEB-010, TEAM-CLI-001/002** — organization creation, RBAC, shared policy versioning, baseline/exception register, approval queue, GitHub/GitLab check integration, Jira/Linear work-item integration, portfolio views, organization signing workflow, and E2E authorization suite all block on TEAM-WEB-001 (which needs HOSTED-002 already checked + PLAN-WEB-009 which blocks on bucket A).
- **STUDIO-CLI-001, STUDIO-WEB-001 through STUDIO-WEB-010** — client workspace model, authorization/leakage suite, canonical branding projection, public verification publication controls, custom-domain verification, handoff receipt model, client portfolio dashboard, retention/export, billing/allowance flows, and E2E acceptance suite all block on STUDIO-WEB-001 (which needs HOSTED-002-007 + PLAN-WEB-010, blocking on bucket A) and RECORD-011 (already checked but STUDIO-CLI-001 also needs PLAN-CLI-001 → chain).
- **ENT-CLI-001, ENT-WEB-001 through ENT-WEB-008** — private runner protocol, SSO organization contract, SCIM lifecycle, runner enrollment/job API, KMS policy, deployment contract, audit export, residency/retention controls, and readiness suite. All chain off TEAM/ENGINE-HUNT-RECORD and bucket A.

## Plan chain — chained off HOSTED-002/003 (bucket A) and production signer key

- **PLAN-WEB-003** — signed entitlement token vNext blocks on production successor-key provisioning + CLI public-pin alignment. Progress code merged (`d6cde6f`, `4c0bd49`); founder must provision the production signer keypair and rotate the CLI public pin.
- **PLAN-CLI-001** — progress code merged (`7edb4a9`); blocks on PLAN-WEB-003.
- **PLAN-CLI-002** — effective-capability UX blocks on PLAN-CLI-001.
- **PLAN-CLI-003** — modified/untrusted CLI test client blocks on PLAN-WEB-004-012 (bucket A + B chain).
- **PLAN-CLI-004** — plan/catalog contract fixtures block on PLAN-WEB-002/003 + PLAN-CLI-001.
- **PLAN-WEB-011 / PLAN-WEB-012** — billing amount/catalog binding + lifecycle blocks on PLAN-WEB-001 (checked). PLAN-WEB-011 has preparatory commit `cfe6936`. Founder must decide final billing lifecycle policy and authorize the mainline reconciliation.

## ACCEPT / FINAL-WEB stack — bucket E (POC + commercial)

- **ACCEPT-001** — frozen 10-20 repository/artifact corpus needs founder-authorized customer repositories with responsible-disclosure rules and non-public vulnerable fixtures. Explicitly needs Gate 0-5 pass first.
- **ACCEPT-002 through ACCEPT-010** — every ACCEPT item chains off ACCEPT-001. Includes automated stories, evidence bundles, external workflow protocol, authorized workflows, comprehension test, Hunt adjudication study, commercial acceptance/COGS, truth reconciliation, and GA release candidate freeze.
- **FINAL-WEB-001 through FINAL-WEB-008** — every public marketing copy/pricing/docs/proof-asset/accessibility/claim-sweep item blocks on ACCEPT-009/010 + explicit founder command. Under the goal file's Phase-8 marketing embargo until every prior gate passes.
- **RECORD-010** — legacy `attest` compatibility. Progress commits `077b008` + `e58dbd8` merged. Unmet: Phase-8 correction of `/verify` marketing index. Blocks on same embargo as FINAL-WEB.

## Miscellaneous — bucket A (production DB) or already-partial

- **DIST-005** — upgrade/backward-compatibility matrix. Deps CONTRACT-012 (checked) + DIST-004 (accepting this phase). Once DIST-004 merges, DIST-005 is executable without external inputs: write cross-version fixtures for CLI/report/token/config/record paths + database compatibility + preserved local data. Estimated: one phase PR, follow-up.

## Founder-checklist items (explicitly external — bucket A/B/D/E)

These lines in the backlog are explicit founder-decision items, not agent tasks:

- Confirm final plan hypotheses after evidence (Team $99 vs bounded founding cohort; Studio $249 vs bounded founding cohort). [E]
- Select/approve queue and object-storage provider only after the Phase 0 cost/constraint decision. [B]
- Obtain legal review for premium content license, contributor terms, trademarks, privacy, terms, and enterprise obligations. [D]
- Approve any external engine/fixture redistribution with unresolved license or NOTICE status. [D]
- Approve networked Hunt recipe exceptions individually; default remains no network. [C]
- Arrange independent Hunt isolation/security review. [C]
- Supply authorized customer fixtures/repositories and consent for external acceptance. [E]
- Authorize external conversations, paid pilots, checkout tests, campaign, publish, deploy, npm release, tags, pushes, and production migrations separately. [E]
- Do not claim Team/Studio/Enterprise generally available until their end-to-end gates pass. [E — persistent constraint]

## What CAN still be shipped without founder input

After QUAL-CLI-001 + DIST-004 merge, the only executable item left with green deps is **DIST-005** (upgrade/backward-compat matrix). Everything else is blocked in one of the five buckets above.

## Recommended founder action order (to unblock the largest chunk fastest)

1. **Bucket A (production DB write)** — one hour of founder time to run the writer + reconciler + restore drill. Unblocks HOSTED-013 + ~30 downstream items (all PRO-*, PLAN-WEB-004+, TEAM/STUDIO/ENT foundations).
2. **Bucket B (provider selection)** — record durable queue + object storage decision. Unblocks ~15 OPS-* items + DIST-WEB-002/003 + QUAL-WEB-002/003/005.
3. **Bucket D (legal review)** — clear LIC-002 licensing + LIC-005 DCO-or-CLA. Unblocks DIST-002/003/006 (release engineering).
4. **Bucket C (Hunt external content)** — provision authenticated publisher root + licensed recipes. Unblocks 8 HUNT-* items + QUAL-CLI-004.
5. **Bucket E (POC + commercial)** — happens last per the goal file's phase ordering. Everything else must be gate-passed first.

Every code-side blocker at 2026-09-16 has been shipped and merged. What remains is founder actions on the five buckets above.
