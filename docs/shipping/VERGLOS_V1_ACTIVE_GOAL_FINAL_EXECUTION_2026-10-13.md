# Verglos V1 final shipping goal — non-AppSec completion

**Owner:** Anurag Yadav, owner of Top Notchh Solutions and Verglos
**Updated:** 2026-10-21
**Status:** active; this is the single authoritative continuation goal
**Backlog authority:** `docs/shipping/VERGLOS_V1_BACKLOG.md`
**Evidence authority:** `docs/shipping/EXECUTION_LEDGER.md` and
`docs/shipping/evidence/`
**Implementation repositories:** `verglos-web` and `verglos-cli`
**Private tracker:** `verglos-cli-private-shipping`

## 1. Objective

Starting at the first unchecked backlog item, finish every item that does not
require the independent Hunt/AppSec review. “Finish” means implementing the
original production logic, adding the required regression coverage and
schemas/configuration/workflows, running the applicable qualification, saving
the real evidence, reconciling the private shipping records, and checking the
backlog item only when its complete contract is satisfied.

The goal is not to create progress notes or partial placeholders. It ends when
all eligible non-AppSec items are genuinely implemented, qualified, evidenced,
and checked. Hunt/AppSec-dependent items remain explicitly held until the
independent review is complete.

The current recorded baseline is **239 checked / 41 open / 280 total
(85.4%)**. Recompute this from the live checklist after every accepted batch;
never copy an old score forward.

## 2. Authority and scope

Owner-provided company authorization and previously recorded evidence are
available for routing and must not be repeatedly requested. They do not permit
inventing a provider event, customer consent, legal opinion, field metric,
independent review, or production mutation. Reuse an existing evidence packet
when it actually satisfies the row; otherwise name the exact missing artifact.

The active product position is Verglos as a security layer for AI-generated
code: inspect, decide, prove, and monitor. Every public claim, plan, command,
dashboard, report, release artifact, and integration must remain bounded by
implemented behavior and its recorded evidence.

The private shipping repository is the ledger, not the implementation target.
All product logic belongs in the actual `verglos-web` or `verglos-cli` source
repository. Use a clean worktree of the corresponding real repository when a
dirty parent checkout would contaminate qualification. Do not work in the old
archive repository.

## 3. AppSec hold rule

The explicit hold roots are:

- `HUNT-008`, `HUNT-009`, `HUNT-010`, and `HUNT-011`;
- `QUAL-CLI-004`; and
- every later row whose own acceptance contract directly requires the
  independent Hunt isolation review or its result.

Classify dependencies row by row. Do not hold unrelated Studio, Enterprise,
distribution, Web, acceptance, final-copy, or provider work merely because
the Hunt review is pending. Do not check an AppSec-held row, replace its
review with an owner assertion, or claim that a green local test is an
independent security review.

If an AppSec-held row has an independent non-AppSec implementation defect, do
not split the row into a checkbox claim. Record the defect for the later
AppSec batch and move to the next dependency-ready non-AppSec row.

## 4. Top-to-bottom execution protocol

For each unchecked item in file order:

1. Read the complete row, its dependencies, acceptance conditions, and every
   referenced evidence packet.
2. Classify it as AppSec-held, dependency-blocked, externally evidenced, or
   dependency-ready and implementable.
3. If it is AppSec-held, record the exact review dependency and continue.
4. If it is dependency-ready, implement the whole row’s product contract in
   the actual Web/CLI repository. Do not stop at a UI shell, validator stub,
   fixture-only substitute, or documentation claim.
5. Add focused tests for success, refusal, authorization, tenant binding,
   replay/idempotency, malformed input, failure/rollback, and privacy paths
   required by that row. Add migration, schema, workflow, artifact, or
   configuration changes when the contract requires them.
6. Run focused tests followed by relevant package tests, typecheck, build,
   migration/order checks, public-boundary checks, artifact/package checks,
   hosted/provider/browser checks, or Docker checks required by the row.
7. Preserve exact source commit, command, exit status, deployment or artifact
   identity, digest, counts, limitations, and privacy boundary in a private
   evidence packet.
8. Check the backlog row only if every acceptance condition and every
   non-held dependency is satisfied. Otherwise leave it unchecked with the
   exact missing artifact, owner, next action, and release impact.
9. Recompute the score and reconcile the private tracker before moving to the
   next row.

Complete one row’s implementation and qualification before starting an
unrelated row. Multiple substantive commits may be used within one row; do
not scatter token-consuming micro-slices across the backlog.

## 5. What counts as real implementation

Acceptable work changes the original production path and its contract. It may
include server/client logic, CLI behavior, database schema/migrations, route
authorization, tenant scoping, lifecycle/replay handling, release tooling,
package boundaries, CI workflows, browser behavior, or bounded evidence
generation.

The implementation must:

- use the canonical plan, identity, subject, policy, record, entitlement, and
  evidence contracts already established by the repositories;
- fail closed on missing, stale, malformed, unauthorized, cross-tenant,
  replayed, or unsupported input where the contract requires it;
- preserve source privacy, secret redaction, digest binding, and auditability;
- expose limitations instead of converting unavailable evidence into a pass;
- use real production code paths in qualification, with synthetic data only
  where the row explicitly permits it; and
- include regression coverage that would fail if the boundary were removed.

Do not close a row by editing a checkbox, adding a generated status paragraph,
renaming a fixture, manufacturing a customer/provider result, or making an
empty/duplicate commit.

## 6. Evidence and ledger reconciliation

Every completed batch must update the existing private records as applicable:

- `docs/shipping/STATUS.md`;
- `docs/shipping/EXECUTION_LEDGER.md`;
- `docs/shipping/TRACEABILITY.md`;
- `docs/shipping/DECISIONS.md`;
- `docs/shipping/RELEASE_GATES.md`; and
- `docs/shipping/VERGLOS_V1_BACKLOG.md`.

Evidence belongs under the private `docs/shipping/evidence/` area when it
contains restricted commands, deployment identifiers, hosted results, owner
decisions, customer/recipient information, or operational details. Do not add
irrelevant public Markdown files to increase contribution count. A ledger
entry must point to real code, tests, artifacts, and limitations; it must not
upgrade partial qualification into acceptance.

The evidence packet for a checked row must state:

- row ID and acceptance mapping;
- implementation repository and exact commit(s);
- commands and exact pass/fail/skip results;
- provider, deployment, package, browser, or artifact identity when relevant;
- digest/version/configuration information without secrets;
- privacy and authorization scope;
- failures, skips, residual risks, and rollback behavior; and
- why the row is now fully satisfied.

## 7. Commit and repository policy

Preserve normal granular history. Use separate substantive commits for
logical implementation, regression coverage, and an evidence/ledger
reconciliation when those are genuinely separate reviewable changes. Use
normal branches and normal merges.

Never squash, rebase, force-push, create empty or duplicate commits, or make
commits solely to inflate contribution counts. Do not spend time or tokens on
unrelated Markdown. Public repositories receive public-safe source and tests;
restricted evidence remains in the private shipping repository.

Use the existing authenticated Chrome session only when browser evidence is
actually required. Do not open another Chrome window or tab. Prefer local
commands, repository tests, and authorized CLI/API paths for all other work.
Do not expose secrets, customer source, raw credentials, or private tracker
contents in public commits, logs, or final responses.

## 8. Progress report required after each batch

Every continuation report must state, using current evidence:

- the backlog row fully implemented;
- rows newly checked, if any;
- rows still open and the exact non-AppSec reason;
- AppSec-held rows and their missing independent-review artifact;
- exact commits, normal merges, deployments, and evidence paths;
- commands and qualification results;
- public/private boundary and residual risks;
- the next unchecked row in file order; and
- the recomputed `checked / open / total` score.

“Implemented” and “qualified” are not synonyms for “checked.” A row remains
open when its own contract still requires an external artifact, even if its
code-side implementation is complete. That missing artifact must not be
mislabelled as AppSec.

## 9. Completion condition

This active goal is achieved only when:

1. every unchecked backlog row that is not AppSec-held has been implemented,
   qualified, evidenced, and checked;
2. every non-commit gate outside AppSec has a real decision or artifact and is
   reconciled in the private tracker;
3. all remaining unchecked rows are explicitly AppSec-held, with the exact
   independent review dependency recorded;
4. Web, CLI, package, release, entitlement, Studio, Enterprise, SCM, privacy,
   accessibility, acceptance, and final public-truth claims match the actual
   source and evidence;
5. no placeholder, owner assertion, local-only result, or artificial commit is
   being used as a substitute for a row contract; and
6. the final private score, evidence index, residual risks, and next AppSec
   action are recorded.

The goal must not be marked complete while any satisfiable non-AppSec row is
open. It is acceptable for the final score at that point to retain the
explicit AppSec hold rows as open; that is the intended completion boundary of
this goal.

## 10. Canonical files for every continuation

Read before changing backlog state:

- `docs/shipping/VERGLOS_V1_BACKLOG.md`
- `docs/shipping/EXECUTION_LEDGER.md`
- `docs/shipping/TRACEABILITY.md`
- `docs/shipping/DECISIONS.md`
- `docs/shipping/RELEASE_GATES.md`
- `docs/shipping/STATUS.md`
- `docs/shipping/FINAL_V1_PRODUCT_CONTRACT_APPROVAL_DRAFT_2026-10-12.md`
- `docs/shipping/FINAL_V1_PAYING_VALUE_BLUEPRINT_2026-10-13.md`
- `docs/shipping/FINAL_V1_FEATURE_COVERAGE_MATRIX_2026-10-13.md`

Implement only in the current `verglos-web` and `verglos-cli` repositories or
their clean worktrees. Keep this file as the single active goal and keep the
private ledger as the authoritative evidence and backlog record.
