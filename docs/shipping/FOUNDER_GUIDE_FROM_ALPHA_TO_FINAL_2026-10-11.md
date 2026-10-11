# Verglos V1: from the public release to the final release

**Private shipping guide — 11 October 2026**

**Contract update:** The final V1 product direction is defined by
`FINAL_V1_PRODUCT_CONTRACT_2026-10-11.md`. Hunt and Attest remain required
capabilities, Team/Studio/Enterprise SCM testing uses the TopNotchh
organization and public forks, and paid plans use prepaid manual renewal.
This guide remains the comprehensive founder explanation; its older
recurring-card discussion is historical context and does not create a new
blocking direction for V1.

This is the plain-language explanation of where Verglos has reached and what
is still needed before calling the new product a final V1 release.

Do not put passwords, database URLs, API keys, Vercel tokens, GitHub tokens,
cookies, private repository source, or customer data in this document or in
ChatGPT.

## The short version

Verglos is not at the beginning.

- The last public package baseline is `1.8.3`.
- The new CLI has reached the tagged/tested alpha `2.0.0-alpha.1`.
- The alpha packages have been built, installed by clean consumers, imported,
  and tested through upgrade and rollback exercises on Linux/macOS fixtures.
- The Web product has substantial implementation and a Production code
  rollout. Production billing is deliberately fail-closed while qualification
  is unfinished.
- The final protected npm publication and final V1 acceptance have **not** yet
  happened.

The current private backlog score is:

**223 checked / 57 open / 280 total — 79.6%**

The open items are not all missing code. Many now require evidence or a
decision that only an external provider, an authorized company owner, an
independent security reviewer, or a legal reviewer can provide.

## What “final release” means here

There are three different milestones. They must not be confused:

1. **Code exists** — the feature is implemented and tests pass.
2. **Release qualification** — the feature works in the supported environment
   and has the required evidence.
3. **Final public release** — the exact release is legally cleared, independently
   reviewed where required, protected by the publishing controls, and then
   deliberately published.

Verglos has reached milestone 1 for a large part of the product and milestone
2 for many areas. It has not completed milestone 3 for the new final V1.

The alpha tag is therefore real progress, but it is not the final release.
The final version number should be chosen by the release owner after the open
gates are cleared; do not silently treat `2.0.0-alpha.1` as the final V1.

## Where each remaining requirement belongs

| Requirement | Product area | What it proves |
| --- | --- | --- |
| Razorpay prepaid-card Test Mode lifecycle | `verglos-web` Preview/Test Mode payment and webhook flow | A canonical prepaid payment, signed delivery, ledger, refund, expiry, manual renewal, and entitlement lifecycle reconciles correctly |
| Organization-policy signer/trust root and authorized test repository | Web organization/SCM integration plus CLI policy fetch/cache | Team/Studio/Enterprise policy can be trusted and bound to the correct organization and repository |
| Independent AppSec review | Private CLI Hunt sandbox | A person who did not build Hunt independently checked its isolation and residual risks |
| Legal/company approval | Private shipping and release records | Verglos is allowed to use, modify, and redistribute the listed third-party content and notices |

These are different gates. Completing one does not automatically complete the
others. The gates are evaluated through the existing backlog and execution
ledger; this guide and the product-contract amendment do not replace or
reorder backlog checkboxes.

---

## 1. Razorpay: prepaid card billing and manual renewal

### Active V1 decision

Final V1 uses Cards-only, one-time prepaid fixed-term payment. A customer
renews by starting a new payment; automatic recurring-card renewal is not a
V1 promise. Therefore a provider recurring-card fixture is **not** a blanket
release blocker for this V1 contract. The older recurring-card investigation
below is retained as historical evidence and may remain relevant to a future
recurring-billing version.

For the active V1 payment rows, the required proof is the canonical prepaid
order/capture, signed webhook delivery, ledger projection, refund, expiry,
manual renewal, idempotency/replay, and entitlement reconciliation in the
isolated Preview/Test Mode path. Production remains controlled and must not be
used to manufacture missing evidence.

### This belongs to

This is a **Web application** requirement. It concerns the isolated Preview
deployment of `verglos-web`, the Razorpay Test Mode account, the webhook route,
the billing ledger, and the entitlement/license projection.

It is not a CLI packaging problem and it is not solved by publishing an npm
package.

### What is already ready

The tracker records that these pieces are available:

- A separate Neon test database and an isolated Preview configuration.
- Docker PostgreSQL as a local fallback.
- Razorpay Test Mode credentials and canonical Pro plan inventory.
- A Test Mode webhook target.
- A Cards-only release configuration.
- Code and tests for substantial order, subscription, webhook, refund, ledger,
  and entitlement behavior.

Some Test Mode payment and refund cases have been exercised. This is useful
evidence, but it is not yet the complete prepaid lifecycle matrix.

### Historical provider boundary and current work

The official Razorpay recurring-card probe reached the recurring-card/mandate
step but the Test Mode card was not eligible, and the provider dashboard did
not expose a supported immediate renewal/replay control. That result remains
recorded for future recurring billing; it is not converted into a fake
success and it does not block the prepaid V1 contract by itself.

The active implementation/evidence work is the prepaid lifecycle matrix. If a
specific backlog row still names recurring behavior, update that row’s
acceptance wording through a dated private decision/ledger entry before
checking it. Do not silently check it, silently delete it, or let the wording
change skip other rows.

### Your steps

1. Keep the hosted work in Razorpay **Test Mode** and the isolated Preview
   environment. Do not use real money, guessed OTPs, fake provider events,
   direct database edits, or `$1` pricing.
2. Run the canonical prepaid card order/capture and signed webhook flow.
3. Run the supported refund, expiry, manual-renewal, duplicate/replay, and
   out-of-order/error cases using real provider delivery where required and
   isolated Docker/PostgreSQL fixtures for code-side behavior.
4. Reconcile payment, ledger, entitlement, user, organization, amount,
   currency, catalog version, and term. Record failures and limitations.
5. Do not send the secret key or database URL in chat. A private evidence path
   and a status summary are enough.

### What this does not mean

- It does not require changing the Production database URL.
- It does not require enabling recurring billing in Production first; recurring
  billing is not promised by the active V1 contract.
- It does not require supporting every payment method if the release decision
  is Cards-only.
- It does not permit marking the backlog item complete merely because a card,
  wallet, QR, or one successful payment screen worked.

The relevant current records are:

```text
docs/shipping/evidence/plan-web-014-preview-official-recurring-card-fixture-boundary-2026-10-10.md
docs/shipping/evidence/razorpay-testmode-recurring-card-support-request-2026-10-10.md
```

---

## 2. Organization signer, trust root, and test repository

### This belongs to

This requirement spans two parts of Verglos:

- **Web:** organization policy, paid-plan organization state, GitHub/GitLab
  installation, repository binding, and webhook/check delivery.
- **CLI:** fetching, verifying, caching, and applying the signed organization
  policy.

It applies only if Web SCM and the Team/Studio/Enterprise organization-policy
workflow remain part of final V1. It is not needed for an ordinary person to
install the basic public npm CLI.

### What “signer/trust root” means in simple terms

Verglos must be able to answer: “Who is allowed to approve this organization
policy, and how do we know the policy has not been changed?”

- The **signer** is the approved signing identity that signs the policy.
- The **trust root** is the public verification key or approved root that tells
  Verglos which signer to trust.
- The **repository binding** says exactly which organization and test
  repository the policy applies to.

This is an organization security decision, not a setting that can be invented
by a developer or supplied by a general ChatGPT permission message.

### Your decision first

Choose one of these two honest options:

#### Option A — Web SCM is in final V1

Complete the steps below. The related Team/Studio/Enterprise and SCM backlog
items stay active.

#### Option B — Web SCM is deferred from final V1

Record that decision in the private tracker and ship the npm/CLI scope only
after its own release gates pass. The SCM items remain deferred/open; they are
not falsely checked as completed.

### Steps if Web SCM remains in final V1

1. The authorized company security/infra owner confirms the organization name,
   policy scope, and the test environment.
2. That owner provisions an approved signing identity and trust root. Use the
   company’s KMS, HSM, secret manager, or approved key custody. Do not create
   or paste a Production private key in chat.
3. The owner records where the trust root is controlled and who may rotate or
   revoke it. Share the location and status, never the private key.
4. An owner of the company test repository installs or authorizes the Verglos
   GitHub/GitLab integration for that repository.
5. Create a private consent record containing only the permission details:
   owner, organization, repository URL, exact commit SHA, permitted paths and
   commands, network policy, allowed evidence, retention, expiry, and
   revocation instructions.
6. The authorized runner tests installation, permission denial, policy fetch,
   policy verification, repository binding, webhook delivery, replay
   protection, scan/check result, and removal.
7. Record the exact repository URL and commit SHA in the private evidence. Do
   not upload repository source, credentials, cookies, or access tokens here.

### What the company owner must provide afterward

Only these non-secret facts are needed:

```text
Web SCM in final V1: yes / deferred
Signer/trust-root activation: ready / not ready
Test repository consent record: private path
Repository commit tested: private evidence path or commit SHA
Integration test result: pass / findings
```

The current blocker record is:

```text
docs/shipping/evidence/team-cli-001-hosted-activation-recheck-2026-10-10.md
```

---

## 3. Independent AppSec review of Hunt

### This belongs to

This is for the **private CLI Hunt sandbox**, especially the code under the
private CLI repository’s Hunt package and its Linux/Docker isolation tests.

It is not a Razorpay review, not a Web login review, and not a request to log
in to Trivy.

### Why Codex cannot complete this by itself

The purpose is independence. The reviewer must be a real person or security
firm that did not implement the Hunt sandbox. I can prepare the packet and run
engineering checks, but I cannot sign my own independent review.

### Your steps

1. Choose an AppSec/security reviewer who did not implement Hunt.
2. Give them the private packet:

   ```text
   docs/shipping/evidence/hunt-independent-review-packet-2026-10-09.md
   ```

3. Tell them to review the exact CLI commit named in that packet, not an older
   branch or an uncommitted working tree.
4. Give them the permitted private source/evidence access through your normal
   secure company process. Do not paste repository credentials into chat.
5. They independently run the Linux/Docker adversarial tests.
6. They check, at minimum, network and socket restrictions, devices and
   namespaces, secret exposure, resource limits, cleanup, and failure
   classification.
7. They write findings and remaining risks.
8. They choose exactly one recommendation: `PASS`, `PASS WITH LIMITATIONS`, or
   `FAIL`.
9. They add their name, organization, scope, tests run, date, and a verifiable
   signature or approval reference.
10. Store the completed review in the private `docs/shipping/evidence/`
    directory.

Do not ask an AI to invent the reviewer’s identity, findings, signature, or
approval. A draft may be formatted by AI, but the actual review must come from
the independent reviewer.

---

## 4. Legal/company approval

### This belongs to

This is a **private release-record requirement** covering material that may be
shipped with or used by the CLI/Web product. It is not a Trivy account or
dashboard login.

### Your steps

1. Choose an authorized company or legal reviewer who can approve the product
   and release scope.
2. Give them this private addendum:

   ```text
   docs/shipping/legal/legal-review-addendum-2026-10-09.md
   ```

3. Ask them to review the exact release candidate and decide each section:

   - Trivy image, release, and NOTICE usage
   - `detect-secrets`
   - scanner fixtures
   - Hunt recipes and rules
   - modification rights
   - redistribution rights
   - trademark restrictions
   - required copyright/license notices
   - scope, expiry, conditions, and required source offers

4. They add their name, role, organization, review date, decision, conditions,
   and a signature or verifiable approval reference.
5. Keep the completed addendum under private
   `docs/shipping/legal/`. Do not place it in the public CLI repository.

The current addendum is a review request, not an approval. It cannot be
treated as complete until the authorized reviewer fills it in.

---

## What happens after these three external actions

The release sequence is:

1. Finish the active prepaid Razorpay lifecycle evidence and the corresponding
   backlog rows.
2. Finish the organization signer/repository evidence, or formally record that
   Web SCM is deferred from final V1.
3. Obtain the independent Hunt review.
4. Obtain the legal/company approval.
5. Re-run the final CLI/Web qualification against the exact release commit.
6. Enable protected npm/Vercel release approvals and verify provenance,
   checksums, notices, and rollback evidence.
7. Freeze the release candidate.
8. Run final acceptance and authorized POC evidence.
9. Only then publish the final npm version and promote the approved Web
   configuration.

No one should check a backlog box merely because a document was drafted. A box
can be checked only when its stated evidence and external approval actually
exist.

## What you need to tell Codex — without secrets

When one of these actions is complete, send only a status update like this:

```text
Razorpay recurring fixture/control: available / not yet
Web SCM in final V1: yes / deferred
Signer/trust-root activation: ready / not ready
Test repository consent: private file path
Independent AppSec review: private file path and PASS/PASS WITH LIMITATIONS/FAIL
Legal/company review: private file path and approved/conditional/not approved
```

That is enough to continue. Never send the underlying keys, passwords, tokens,
cookies, database URLs, or private repository source.

## Authoritative tracker files

Use these files for the live state; older conversation summaries and stale
copies of the goal do not override them:

```text
docs/shipping/VERGLOS_V1_BACKLOG.md
docs/shipping/STATUS.md
docs/shipping/VERGLOS_V1_MANUAL_INPUT_BLOCKERS.md
docs/shipping/FOUNDER_ACTION_STEPS.md
docs/shipping/evidence/
docs/shipping/legal/
```

At the time of this guide, the authoritative score is **223/57/280 (79.6%)**.
The current release position is **alpha-qualified and substantially
implemented, but not finally published or accepted**.
