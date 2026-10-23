# Active goal execution inputs · 2026-10-23

This is the safe input index for running the active non-AppSec shipping goal.
It references authorization and evidence artifacts without copying secrets,
database URLs, cookies, tokens, customer source, or private provider values.

## Source repositories

- `../verglos-cli` — public CLI implementation repository.
- `../verglos-web` — Web implementation repository.
- `../verglos-cli-shipping-worktree` — CLI shipping qualification worktree.
- `../verglos-cli-private-shipping` — private goal, evidence, and ledger.

## Owner and company authorization

- `evidence/owner-authorization-2026-10-23.md` — current owner execution and
  public-open-source benchmark authorization.
- `evidence/owner-authorization-2026-10-14.md` — prior bounded Preview/local
  authorization; retained as historical scope evidence.
- `legal/legal-company-decision-2026-10-18.md` — company licensing and
  redistribution disposition with conditions and re-review triggers.
- `legal/external-engines-and-standards-2026-10-03.md` — external engine,
  standards, provenance, and attribution inventory.
- `legal/transitive-license-review-2026-10-08.md` — transitive license review.
- `evidence/lic-002-upstream-source-provenance-2026-10-14.md` and
  `evidence/lic-002-upstream-exact-source-recheck-2026-10-18.md` — exact
  upstream source and provenance evidence.

## Product, pricing, and infrastructure decisions

- `FINAL_V1_PRODUCT_CONTRACT_APPROVAL_DRAFT_2026-10-12.md` — approved
  implementation contract and launch catalog.
- `deliverables/FOUNDER-INPUTS-ONLY-2026-10-12.md` — current owner decisions,
  including Team/Studio hypotheses, queue choice, and execution authorization.
- `DECISIONS.md` — OPS-001 Neon PostgreSQL queue/object-storage decision and
  OPS-002 scheduler decision.
- `evidence/hosted-013-selected-db-planner-2026-10-08.md` — selected database
  planning evidence.
- `acceptance/external-workflow-protocol.md` — bounded external workflow
  protocol.
- `acceptance/consent-record.template.md` — only for a later real external
  recipient/customer POC; it is not needed for the authorized local public
  open-source benchmark path.

## Fixture authorization files

Public/open-source fixture permissions:

- `../acceptance-fixtures/buggy-node/AUTHORIZATION.md`
- `../acceptance-fixtures/damm-vulnerable-node/AUTHORIZATION.md`
- `../acceptance-fixtures/dvna/AUTHORIZATION.md`
- `../acceptance-fixtures/juice-shop/AUTHORIZATION.md`
- `../acceptance-fixtures/nodegoat/AUTHORIZATION.md`
- `../acceptance-fixtures/nodejs-goof/AUTHORIZATION.md`

Owner-controlled synthetic fixture permissions:

- `acceptance-fixtures/internal-agent-surface/AUTHORIZATION.md`
- `acceptance-fixtures/internal-idor/AUTHORIZATION.md`

For any new public repository, record the exact URL, commit, license, scope,
commands, local-only boundary, redaction result, and attribution before use.

## Test, Preview, and current product evidence

- `evidence/acceptance-evidence-bundle-2026-10-22-pr164-pr165-pr166-pr237-pr238-hosted-final.json`
- `evidence/accept-002-003-clean-head-verification-2026-10-22.md`
- `evidence/qual-web-005-current-head-requalification-2026-10-22.md`
- `evidence/qual-web-006-current-head-requalification-2026-10-22.md`
- `evidence/studio-cli-001-current-head-requalification-pr167-pr241-2026-10-22.md`
- `evidence/studio-cli-001-preview-studio-fixture-2026-10-21.md`
- `evidence/ent-cli-001-hosted-runner-qualification-2026-10-21.md`
- `evidence/final-web-007-browser-qualification-pr247-2026-10-23.md`
- `evidence/final-web-007-browser-qualification-pr247-2026-10-23.json`
- `evidence/final-web-008-machine-readable-release-smoke-pr250-2026-10-23.md`
- `evidence/final-web-008-page-extension-inventory-pr250-2026-10-23.md`

## Provider, Preview, and Production evidence

These are existing observations and execution packets. They must not be
expanded into claims beyond the environment and operation each file states.

- `evidence/production-and-preview-auth-rollout-2026-10-09.md`
- `evidence/vercel-production-preview-config-audit-2026-10-09.md`
- `evidence/vercel-production-preview-readonly-2026-10-08.md`
- `evidence/production-current-code-rollout-smoke-2026-10-10.md`
- `evidence/production-readonly-smoke-2026-10-10-followup.md`
- `evidence/production-migration-2026-10-10.md`
- `evidence/production-migration-exact-audit-2026-10-07.md`
- `evidence/production-write-preflight-2026-10-10.md`
- `evidence/plan-web-014-provider-subscription-authorization-otp-2026-10-10.md`
- `evidence/plan-web-014-preview-prepaid-cards-lifecycle-2026-10-11.md`
- `evidence/plan-web-014-preview-hosted-payment-lifecycle-2026-10-09.md`
- `evidence/plan-web-014-testmode-webhook-inventory-2026-10-07.md`
- `evidence/razorpay-testmode-webhook-inventory-2026-10-10.md`
- `evidence/team-web-006-scm-reconciliation-pr204-production-2026-10-18.md`
- `evidence/github-web-002-provider-lifecycle-2026-10-19.md`

## Distribution and release evidence

- `evidence/dist-001-pack-manifest-read-binding-pr174-2026-10-23.md`
- `evidence/dist-002-003-publication-archive-snapshot-pr170-2026-10-23.md`
- `evidence/dist-002-release-tag-read-binding-pr177-2026-10-23.md`
- `evidence/dist-003-checksum-read-binding-pr175-2026-10-23.md`
- `evidence/dist-006-rollback-evidence-read-binding-pr176-2026-10-23.md`
- `evidence/dist-006-rollback-input-hardening-pr169-2026-10-23.md`
- `evidence/qual-cli-006-current-head-requalification-pr167-2026-10-22.md`
- `evidence/cli-full-qualification-and-production-smoke-2026-10-10.md`
- `evidence/point-5-public-npm-repository-qualification-2026-10-12.md`

## Local secret and database handling

- `../verglos-web/.env.test.local` may contain local test configuration. Its
  values are not copied into the goal, committed, or printed.
- Use the repository's isolated serial test path and local disposable database
  by default. A remote test value is never used unless a specific target
  explicitly requires it and its safety contract permits it.
- No production secret, provider token, cookie, customer source, or database
  URL belongs in this index or any committed shipping record.

## Run order

1. Start with the first currently open non-AppSec implementation target in the
   active goal: `STUDIO-CLI-001`.
2. Inspect the real source contract in `../verglos-web` or `../verglos-cli`.
3. Implement the missing behavior and regression coverage.
4. Run the smallest focused test, then the relevant full local graph.
5. Use the authorization and environment evidence above only for the exact
   permitted scope; record observed results in a new evidence file.
6. Open and merge a normal PR without squash or destructive history changes.
7. Reconcile the active goal, backlog, status, ledger, and decisions before
   selecting the next target.
