# Verglos V1 Active Goal — Final Product, Whole Backlog, and Release

Use this file as the replacement active goal for the next shipping run.

## Objective

Complete and ship the real Verglos Final V1 across:

- `/Users/anuragyadav/Developer/TopNotchh-Workspace/verglos-cli`
- `/Users/anuragyadav/Developer/TopNotchh-Workspace/verglos-cli-private-shipping`
- `/Users/anuragyadav/Developer/TopNotchh-Workspace/verglos-cli-shipping-worktree`
- `/Users/anuragyadav/Developer/TopNotchh-Workspace/verglos-web`

The product must be usable from the terminal and Web for Free, Pro, Team,
Studio, and Enterprise. The initial native language surface is TypeScript and
JavaScript. Hunt, Attest/Release Records, plan entitlements, Web billing,
organization workflows, and Team+/GitHub-GitLab checks are part of the Final
V1 contract; they are not to be described as shipped until implemented and
qualified.

The authoritative contract is:

```text
docs/shipping/FINAL_V1_PRODUCT_CONTRACT_2026-10-11.md
```

The goal is complete only when every required backlog checkbox is genuinely
satisfied, the final acceptance/POC corpus is recorded, and the protected
release is ready. A document edit, deployment, browser click, or local test
does not check a box by itself.

## Starting checkpoint

The private tracker currently reports:

**223 checked / 57 unchecked / 280 total — 79.6%**

Recompute this from the live checkbox file after every substantial batch. Never
reuse a stale score from an earlier conversation or goal attachment.

## Product contract to implement

### Billing

- Free requires no payment.
- Paid plans use Cards-only, one-time prepaid fixed-term payment.
- Automatic recurring-card renewal is not promised in V1.
- Renewal is a new user-initiated payment.
- Payment capture, webhook, ledger, refund, expiry, and renewal are bound to
  the exact user, organization, plan, catalog version, amount, currency, and
  entitlement term.
- Duplicate and out-of-order provider events are idempotent and fail closed.
- Do not use `$1` pricing, guessed OTPs, synthetic provider events, direct row
  edits, or Production Test Mode credentials.

### Plans

- **Free:** terminal JS/TS scan, local reports, pre-commit/CI, MCP scan, and
  bounded Hunt.
- **Pro:** Free plus personal dashboard, hosted private records, broader local
  Hunt, remediation, monitoring, signing, and prepaid renewal.
- **Team:** Pro plus organization, members/roles, shared policy/baseline,
  approvals, history, and GitHub/GitLab pull-request checks.
- **Studio:** Team plus client workspaces, handoff receipts, white-label
  evidence, and public verification workflows.
- **Enterprise:** Studio plus contracted governance, private runners,
  customer-controlled KMS/HSM, retention/residency, audit, and support.

The Web plan catalog is the source of truth for prices, allowances, and
capabilities. The CLI consumes signed entitlements and must not grant paid
capabilities from a locally edited plan value.

### Hunt

Hunt is enabled for every plan with plan-appropriate limits. It uses signed,
declarative, digest-pinned recipes—not arbitrary AI-generated shell.

Every Hunt execution must enforce read-only input, no host Docker socket, no
host-secret access, network denied by default, resource/time/output limits,
cleanup, redaction, and explicit outcomes/limitations.

Hunt must be installable from the supported public CLI boundary. A private
workspace package or undocumented runtime is not a shipped customer feature.

### Attest and Release Records

Attest is required for Pro+ and must produce a portable signed `.vgl` Release
Record containing the exact subject, coverage, observations, policy, Hunt
results, exceptions, approvals, limitations, and final decision. It must verify
offline and optionally publish an approved/redacted verification view.

Keep these separate in evidence:

1. npm/in-toto/Sigstore/build provenance;
2. imported external attestations such as SARIF, SPDX, CycloneDX, Docker, or
   GitHub evidence;
3. the customer-facing Verglos Release Record.

### GitHub/GitLab test plan

Use the TopNotchh GitHub organization as the authorized company test
organization. Create or use a Verglos Team/Studio/Enterprise test workspace,
install the Verglos integration, and fork public TypeScript/JavaScript repos
into that organization.

For each test repository, record the public URL, exact commit SHA,
license/NOTICE status, permitted commands, and network policy. Test
installation, organization/repository binding, pull-request delivery,
permission denial, duplicate/replay delivery, failure/retry, scan result, and
removal. No random customer repository or private source is required for this
company test corpus.

For V1, Verglos centrally signs organization policies. Customers do not create
their own trust roots. Enterprise customer-controlled KMS/HSM is a separate
contracted control.

## Execution order

Work continuously in strict dependency order. Do not jump to marketing or a
later gate while an implementation-ready earlier item is open.

### Phase 0 — synchronize truth

1. Treat `FINAL_V1_PRODUCT_CONTRACT_2026-10-11.md` as the shared contract.
2. Reconcile stale public/Web claims that call Hunt or Attest shipped when the
   implementation is still a shell/beta.
3. Keep historical evidence immutable; add superseding entries instead of
   rewriting past test results.
4. Keep all four repositories aligned without copying secrets or private
   evidence into public repositories.

### Phase 1 — payment and entitlement implementation

1. Replace the customer-facing automatic-recurring promise with prepaid manual
   renewal.
2. Implement the fixed-term order path for every active purchasable paid plan.
3. Bind payment, webhook, ledger, refund, expiry, renewal, and entitlement to
   the versioned catalog.
4. Ensure the CLI and Web agree on plan capabilities and expiry.
5. Run isolated Test Mode and Docker/PostgreSQL matrices.
6. Reconcile the appropriate `PLAN-WEB`, `PRO`, and acceptance rows only after
   their complete acceptance conditions pass.

### Phase 2 — public Hunt distribution and safety

1. Finish the supported Hunt package/runtime boundary.
2. Ship only signed, digest-pinned recipes with bounded execution.
3. Run unit, Docker, Linux, adversarial, cleanup, resource, and failure tests.
4. Produce clear `confirmed`, `not-reproduced`, `inconclusive`,
   `not-supported`, and `environment-error` results.
5. Record content provenance and licensing requirements.
6. Do not claim independent security approval until a real independent reviewer
   signs it.

### Phase 3 — Attest and Release Records

1. Implement the customer-facing `verglos attest` path and `.vgl` record.
2. Bind records to immutable source/artifact subjects and coverage.
3. Include policy, Hunt, exceptions, approvals, limitations, and decision.
4. Verify records offline and through the approved Web verification path.
5. Add clean-consumer, upgrade, rollback, tamper, and public/private boundary
   tests.

### Phase 4 — Team, Studio, Enterprise, and SCM

1. Complete the organization, role, shared policy, baseline, approval, and
   repository-binding contracts.
2. Activate the centrally managed organization-policy signing root through the
   approved secret/key custody path; never paste a private key into chat.
3. Install the GitHub/GitLab integration in the TopNotchh test organization.
4. Run the forked public TS/JS repository corpus through local CLI, Web,
   pull-request, and entitlement paths.
5. Complete Studio client handoff/verification and Enterprise private-runner /
   KMS paths only where the backlog acceptance condition requires them.

### Phase 5 — external release gates

1. Obtain the independent Hunt AppSec review.
2. Obtain authorized legal/company approval for Trivy, detect-secrets, scanner
   fixtures, Hunt content, modification, redistribution, trademarks, and
   notices.
3. Enable protected npm/Vercel approvals and verify provenance/rollback.
4. Run final acceptance, POC, accessibility, performance, deletion, consent,
   and recipient matrices.
5. Freeze and publish the exact release candidate only after all dependencies
   are satisfied.

## Checkbox operating protocol

For every selected unchecked row:

1. Read the exact row and its dependency chain.
2. Identify the owning repository and acceptance artifact.
3. Implement the complete change; do not check a partial substrate.
4. Run focused tests and then the required full/hosted verification.
5. Use the authorized TopNotchh GitHub organization and public forks for SCM,
   plan, Hunt, and Attest POC tests.
6. Use the connected Chrome DevTools session at `127.0.0.1:9222` when it is
   available for browser/provider verification; use Docker for isolated runtime
   tests. If a tool is unavailable, use the repository's safe CLI/test path.
7. Write private evidence with exact commit, deployment, commands, results,
   limitations, and state-change boundary.
8. Update `EXECUTION_LEDGER.md` and `STATUS.md`.
9. Check the box only when the complete acceptance condition is met.
10. Recount the backlog and report:

    - new checked/open/total score and percentage;
    - checkbox IDs changed;
    - concise implementation summary;
    - tests and evidence paths;
    - any external gate still open;
    - next dependency-ready item.

If the row requires an external provider, independent reviewer, legal approval,
customer consent, or founder decision, record the blocker and move to the next
dependency-ready implementation row. Do not fabricate evidence, signatures,
consent, customer acceptance, or provider behavior.

## Evidence and repository boundaries

- Public CLI repositories contain public-safe code, tests, and claims only.
- Private shipping contains execution ledger, backlog, evidence, legal records,
  customer consent, and release approvals.
- Web contains Web implementation and public-safe Web contract documentation.
- Worktrees are implementation surfaces, not independent sources of truth.
- Historical evidence is not rewritten; current truth is recorded in a dated
  superseding ledger/status entry.
- Never commit environment files, database URLs, API keys, Vercel tokens,
  GitHub tokens, cookies, private source, or customer data.

## Completion definition

This goal is complete only when:

- the live backlog has no unchecked required V1 rows;
- Free, Pro, Team, Studio, and Enterprise contract paths are verified;
- TypeScript/JavaScript CLI and Web flows work end to end;
- Hunt is publicly installable, bounded, and evidence-backed;
- Attest creates and verifies the portable Release Record;
- prepaid payment and manual renewal reconcile correctly;
- TopNotchh organization SCM tests pass;
- required AppSec/legal/release approvals are recorded;
- final acceptance and POC evidence are complete; and
- the exact release candidate is protected, rollback-ready, and publishable.

Starting score for this run: **223 checked / 57 unchecked / 280 total
(79.6%)**.
