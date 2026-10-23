# Verglos Final V1 Product Contract

> **2026-10-12 approved-contract notice:** The canonical approved contract is
> [`FINAL_V1_PRODUCT_CONTRACT_APPROVAL_DRAFT_2026-10-12.md`](FINAL_V1_PRODUCT_CONTRACT_APPROVAL_DRAFT_2026-10-12.md).
> It supersedes this 2026-10-11 copy. This historical copy is retained for
> traceability; do not use it to choose plan behavior or goal scope.

The current execution goal stops after Point 5: public TypeScript/JavaScript
npm-package qualification. Publication, held-out POC/experiments, and the
final release decision are deferred to the next goal.

**Decision date:** 2026-10-11  
**Scope:** `verglos-cli`, private shipping tracker, CLI shipping worktree,
and `verglos-web`  
**Status:** authoritative product direction; implementation and acceptance are
still required

## Current implementation note · 2026-10-22

The Web merged head now applies the route-wide security-header baseline and
passes its regression contract; PR #240 merged normally with all hosted checks
green. This updates implementation coverage only and does not change the
contract's acceptance boundaries or the private backlog score (**239 checked /
41 open / 280 total, 85.4%**). Evidence:
`evidence/accept-005-web-security-headers-pr240-2026-10-22.md`.

The subsequent Web PR #241 merged normally and tightened the public proof URL
boundary without changing the product contract or its acceptance gates.
Evidence: `evidence/accept-005-web-public-proof-url-pr241-2026-10-22.md`.

This document replaces conflicting informal descriptions of the final V1
scope. It is a product contract, not proof that every capability is already
implemented. A capability becomes shipped only after its code, tests, runtime
evidence, and applicable approval are recorded in the private shipping tracker.

## 1. Product promise

Verglos is the security decision layer between code being changed and software
being released:

```text
Inspect -> Decide -> Prove -> Approve or block -> Monitor
```

The initial native language surface is TypeScript and JavaScript. Verglos must
also accept evidence from other ecosystems through supported import formats;
native scanners for additional languages are a later expansion and must not be
claimed before they are implemented and qualified.

Verglos is not only a scanner. The V1 product includes the terminal CLI, the
optional Web control plane, safe Hunt verification, portable Attest/Release
Records, plan entitlements, and the Team/Studio/Enterprise workflows described
below.

## 2. One product, five plan levels

Every plan uses the same CLI package. Plans unlock capabilities through a
server-issued, signed entitlement; the CLI verifies the entitlement and applies
the same policy locally. There are not separate Free/Pro/Team binaries.

| Plan | V1 customer value |
| --- | --- |
| **Free** | Terminal JS/TS scanning, secrets/dependencies/provenance coverage, local HTML/JSON results, pre-commit/CI use, MCP scan, and bounded Hunt capability. No required hosted history. |
| **Pro** | Free plus personal dashboard, private hosted records, broader local Hunt, remediation workflow, monitoring, signing, and manual prepaid renewal. |
| **Team** | Pro plus a Verglos organization, members/roles, shared policy/baseline, shared history, approvals, and GitHub/GitLab pull-request checks. |
| **Studio** | Team plus client workspaces, agency/client separation, handoff receipts, white-label evidence, and public verification workflows. |
| **Enterprise** | Studio plus contracted governance, private runners, customer-controlled KMS/HSM options, retention/residency controls, audit export, and support obligations. |

Exact prices, seats, record allowances, retention, and managed-execution
allowances come only from the verified Web plan catalog. Do not advertise a
price or allowance that is not active and founder-verified in that catalog.

## 3. Billing contract: cards-only prepaid manual renewal

Paid plans are purchased with a one-time card payment for a fixed term. V1 does
not promise automatic recurring card renewal.

```text
Card payment -> provider webhook -> payment ledger -> fixed-term entitlement
             -> expiry -> customer chooses Renew and pays again
```

Required behavior:

- Free does not require payment.
- Pro, Team, Studio, and Enterprise use an approved fixed-term commercial
  offer; Enterprise may use a contracted amount.
- A captured card payment is bound to the exact user, organization, plan,
  catalog version, amount, currency, and entitlement term.
- Duplicate, out-of-order, failed, timeout, retry, and refund events are
  idempotent and fail closed.
- Entitlements have explicit start and expiry times.
- Expiry removes paid capability without deleting customer evidence.
- Renewal creates a new one-time payment and a new entitlement grant.
- Production never uses Test Mode credentials, guessed prices, synthetic
  provider events, or manual payment/entitlement row edits.

The Web implementation must remove automatic-renewal assumptions from the
customer promise. Existing subscription code may remain only as a compatibility
boundary while the prepaid order path is implemented, tested, migrated, and
then made unreachable for the final V1 offer.

This decision replaces the need for a Razorpay recurring-card simulator as a
V1 acceptance requirement. It does **not** remove the need to prove the real
one-time card payment, webhook, ledger, refund, expiry, and renewal matrix.

## 4. Web control plane and CLI data plane

The CLI remains useful from the terminal for every plan:

```text
Developer terminal/CI
  -> inspect JS/TS project
  -> apply local policy
  -> run bounded Hunt recipe when entitled
  -> create/verify local Release Record
  -> optionally sync redacted/approved evidence to Web
```

The Web app provides the account, plan, billing, organization, policy,
repository integration, history, approvals, monitoring, and recipient views.
The Web dashboard is not required for a Free local scan and must not require
source upload for ordinary local work.

The Web entitlement service is the source of truth for plan capabilities and
expiry. The CLI must not grant itself paid capabilities by changing a local
plan string or cached file.

## 5. GitHub/GitLab integration

“Web SCM” means Source Code Management integration: Verglos connects to
GitHub/GitLab so a pull request can be scanned and receive a release/security
decision.

The initial authorized test setup is:

1. TopNotchh’s GitHub organization is the company test organization.
2. A Verglos Team/Studio/Enterprise test workspace is bound to that test
   organization.
3. The Verglos GitHub App or supported GitLab integration is installed with
   only the permissions required for the selected repositories.
4. Public TypeScript/JavaScript repositories are forked into the company test
   organization.
5. Each test records the public URL, exact commit SHA, license/NOTICE status,
   and permitted test commands.
6. The integration is tested for installation, repository binding, pull-request
   delivery, permission denial, duplicate/replay delivery, scan result,
   failure/retry, and removal.

The existing TopNotchh GitHub login is useful for this test, but an ordinary
GitHub login is not itself the Verglos integration. The binding between the
GitHub organization/repository and the Verglos workspace must be explicit.

No random customer repository is required for this company test. Private or
customer repositories require a separate private consent record. Public
repositories and company-owned forks do not require the original author's
credentials.

For V1, Verglos owns the organization-policy signing root. Customers do not
create their own cryptographic trust roots. Verglos signs the policy server
side; the CLI verifies the public key and applies the policy. Enterprise may
add customer-controlled KMS/HSM roots as a separate contracted control.

## 6. Hunt contract

Hunt is enabled in V1 for every plan with plan-appropriate limits. Hunt is not
an unrestricted autonomous pentester and must never execute arbitrary
model-generated shell.

A Hunt recipe is signed, declarative, digest-pinned, and bounded. It declares
the target type, supported rule IDs, image/runtime, command template,
assertions, resource limits, network need, cleanup, and redaction behavior.

Required default safety:

- read-only project input;
- no host Docker socket;
- no access to host secrets or personal files;
- network disabled unless an explicitly approved recipe requires it;
- CPU, memory, process, file, output, and wall-clock limits;
- deterministic cleanup;
- structured outcomes such as confirmed, not-reproduced, inconclusive,
  not-supported, and environment-error;
- visible coverage and limitations in every result.

Hunt must be installable and usable from the public supported CLI boundary. A
private workspace package, undocumented binary, or implicit download cannot be
treated as a shipped customer feature. The implementation must either publish
the supported Hunt package, bundle it into the supported CLI archives, or
provide a documented and integrity-checked runtime distribution.

## 7. Attest and the Release Record

Attest is a required V1 capability for Pro and above, not a future marketing
placeholder. The product has three related but distinct forms of evidence:

1. **Release provenance:** npm/in-toto/Sigstore/build evidence proving how a
   package was produced.
2. **Imported attestations:** supported evidence from GitHub, Docker, in-toto,
   CycloneDX, SPDX, SARIF, and other approved sources.
3. **Customer Release Record:** a portable signed `.vgl` record containing the
   immutable subject, coverage, observations, policy, Hunt results,
   exceptions, approvals, limitations, and final decision.

The final customer-facing Attest flow must create and verify the Release
Record locally, optionally publish a redacted/approved verification view, and
remain independently verifiable when the dashboard is unavailable.

The public claim must distinguish “provenance evidence exists” from “Verglos
customer Attest is shipped.” Both require their own implementation and
qualification evidence.

## 8. Third-party tools and review boundaries

Trivy and detect-secrets are engines/adapters, not the product itself.
Verglos must record engine source, version, digest/provenance, license, NOTICE
requirements, coverage, and failure/incomplete behavior.

There is no special “Trivy reviewer” requirement:

- An **independent AppSec reviewer** reviews Hunt isolation and residual risks.
- An **authorized legal/company reviewer** reviews third-party licenses,
  modification/redistribution rights, trademarks, and notices.
- Contacting an upstream maintainer is optional and only needed when a specific
  license or usage question cannot be resolved from authoritative records.

AI may format drafts, but it may not invent a reviewer, signature, legal
approval, consent, or security result.

## 9. Campaign truth boundary

The campaign may describe the product only at the maturity proven by the
current release candidate. “Alpha shell,” “beta,” “implemented,” “verified,”
and “generally available” are different claims.

Before declaring final V1, the tracker must contain evidence for:

- clean public CLI installation and TypeScript/JavaScript scan;
- supported Hunt installation, sandbox, recipes, and adversarial results;
- working Attest/Release Record creation and offline verification;
- fixed-term card checkout and complete entitlement reconciliation;
- TopNotchh organization GitHub/GitLab test matrix;
- plan-specific Web and CLI behavior for Free, Pro, Team, Studio, and
  Enterprise contract paths;
- protected npm/Web release, rollback, notices, and provenance;
- independent AppSec and legal/company approvals where required;
- final acceptance and authorized POC corpus.

No document update or architecture decision checks a backlog item by itself.

## 10. Authoritative execution method

For every implementation batch:

1. Select the first dependency-ready unchecked item from
   `docs/shipping/VERGLOS_V1_BACKLOG.md`.
2. Identify the owning repository and exact acceptance condition.
3. Implement the smallest complete change; do not mark a checkbox for a
   partial substrate.
4. Run focused tests, then the relevant full verification/build/lint or hosted
   matrix.
5. Test the Web and CLI plan behavior against the authorized TopNotchh test
   organization and forked public TS/JS corpus when the item concerns plans,
   SCM, Hunt, or Attest.
6. Write private evidence with commit SHA, commands, result counts, limits,
   and any external dependency.
7. Update `EXECUTION_LEDGER.md` and `STATUS.md`.
8. Check a backlog box only when its complete acceptance condition is met.
9. Recompute the score from the checkbox file and publish a short summary:
   score, checkbox changed, implementation summary, tests/evidence, and next
   dependency-ready item.

If the item requires an external provider, independent reviewer, legal
approval, customer consent, or founder-only decision, record the blocker and
move to the next dependency-ready implementation item. Do not fabricate the
missing artifact and do not repeatedly rerun an unchanged blocked path.

## 11. Current starting checkpoint

Before this contract update, the private tracker score was:

**223 checked / 57 open / 280 total (79.6%)**

This contract update changes product direction and queue instructions. It does
not close any checkbox. The next implementation work is the prepaid billing
contract, followed by public Hunt distribution, Attest/Release Record
completion, and the TopNotchh GitHub organization test matrix, in strict
dependency order.
