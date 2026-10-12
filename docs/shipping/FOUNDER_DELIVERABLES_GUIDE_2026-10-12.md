
# Verglos V1 founder deliverables guide

**Private shipping document — 2026-10-12**

**Contract status:** approved. This guide is an operational explanation of
the approved contract at
`FINAL_V1_PRODUCT_CONTRACT_APPROVAL_DRAFT_2026-10-12.md`; it is not a second
product plan. The current goal stops after Point 5, the public TS/JS npm
qualification corpus. Publication, held-out POC/experiments, and the final
release decision are next-goal work.

This is the plain-English collection guide for the remaining Verglos V1
shipping work. It explains what each deliverable is, who must provide it, what
kind of thing it is, where it belongs, and how Codex can use it to qualify the
backlog.

Do not copy this file into the public verglos-cli repository. Do not paste
passwords, database URLs, API keys, GitHub tokens, private keys, browser
cookies, customer source, or raw private findings into ChatGPT.

## The one-sentence explanation

Verglos has a lot of code already. The remaining work is mostly proving that
the code is safe, legal to ship, connected to the right accounts, and useful
for the five plan levels. A deliverable is the piece of proof that lets us
truthfully check one or more backlog boxes.

The deliverable may be:

| Type | What it means | Can AI prepare it? | Who must make the final decision? |
|---|---|---:|---|
| Code/configuration | A feature, environment setting, provider setup, or protected workflow | Yes, with authorization | Founder/operator and normal deployment controls |
| Test artifact | A test command, output, digest, screenshot, trace, or JSON result | Yes, if the run really happened | Codex records only real output |
| Private record | A Markdown/JSON file describing source, scope, license, consent, or a decision | AI can format a draft | The named owner, founder, legal reviewer, or security reviewer |
| Signature/approval | A real person's approval or verifiable approval reference | No | The authorized human |
| Customer/recipient evidence | A real authorized team or recipient used the product and gave bounded feedback | No | That team/recipient and the founder |

AI may draft wording, make tables, calculate hashes, organize real evidence,
and point out missing fields. AI must not invent a license, source version,
customer consent, reviewer identity, signature, legal conclusion, provider
event, or successful test.

## Current position in simple terms

- The CLI and Web implementations for the core V1 surfaces are substantially
  built and many automated contracts already pass.
- The current active-goal snapshot says **228 checked / 52 unchecked / 280
  total**. The backlog contains older historical score notes, so Codex must
  recompute the live score from the authoritative checklist after every batch.
- The remaining 52 boxes are not 52 missing features. Many are final proof,
  approval, external-provider, release, or founder-decision boxes.
- The browser check on 2026-10-12 showed that the authenticated GitHub
  Developer Settings page currently says **No GitHub Apps**. Therefore the
  live Verglos GitHub App installation evidence does not exist yet.
- The current Hunt packet targets CLI commit
  8bea4be2fa18533eafd088122be769e942965626.
- The current final payment contract is **one-time prepaid card billing with
  manual user-initiated renewal**. Automatic recurring renewal and other
  Razorpay methods are not V1 promises unless the contract is deliberately
  changed and requalified.

## Rules before collecting anything

1. Use isolated Preview/Test Mode for payment, organization, policy, SCM, and
   database qualification. Production is not a test database.
2. Never edit payment, entitlement, or evidence rows directly to make a test
   pass. Use the real application/provider path or a declared fixture.
3. Never guess an OTP or fabricate a provider webhook/event.
4. Use canonical plan prices in Test Mode. Do not use a $1 shortcut as V1
   acceptance evidence.
5. A public open-source repository can be cloned publicly. It does not need a
   customer consent form or a Trivy login. Its license and exact commit still
   must be recorded.
6. A private/customer repository needs its owner's written consent for the
   exact URL, commit, paths, commands, network policy, retention, and expiry.
7. Keep raw customer source, raw secrets, raw provider payloads, and browser
   session data out of the evidence repository unless an approved record
   explicitly permits a bounded artifact.
8. Do not mark a backlog box because code, deployment, or a browser click
   exists. Mark it only after the row's complete acceptance evidence exists.
9. If a real reviewer, legal approver, provider, repository owner, or customer
   is required, general founder permission is not a substitute for that role.
10. If a step is unclear, stop at that step and record the missing decision;
    do not silently broaden authority.

## The ten deliverable groups

| # | Deliverable group | Backlog rows covered | What you will ultimately provide |
|---:|---|---|---|
| 1 | Hunt recipes, rules, provenance, and fixtures | HUNT-008 to HUNT-010 | Rule source/version/license records, approval records, and four honest fixture outcomes |
| 2 | Independent Hunt security qualification | HUNT-011, QUAL-CLI-004 | A real AppSec report for the exact CLI commit and Linux/Docker run |
| 3 | Organization policy signer and CLI policy fetch | TEAM-CLI-001, TEAM-CLI-002 | Preview signer/trust-root setup, policy row, live fetch/cache evidence |
| 4 | GitHub/GitLab live organization integration | TEAM-WEB-006, GITHUB-WEB-001 to GITHUB-WEB-004 | A real test installation, repository binding, webhook/check/replay/removal evidence |
| 5 | Studio and Enterprise proof | STUDIO-CLI-001, ENT-CLI-001 | Recipient redaction proof and an approved runner lifecycle/replay report |
| 6 | Legal and licensing clearance | LIC-002, LIC-003 plus founder legal decisions | Completed legal addendum, notices, and conditions for the exact release |
| 7 | Release, provenance, approvals, and rollback | DIST-001 to DIST-003, DIST-006, QUAL-CLI-006 | Clean package audit, protected publish/attestation proof, and rollback rehearsal |
| 8 | Web privacy, deletion, accessibility, and performance | QUAL-WEB-005, QUAL-WEB-006 | Non-production deletion/retention proof and human/browser qualification evidence |
| 9 | Acceptance, comprehension, Hunt study, and commercial proof | ACCEPT-002 to ACCEPT-010 | Reproducible acceptance bundle, authorized users, study, cost/value evidence, and go/no-go |
| 10 | Final public Web pass and final POC corpus | FINAL-WEB-001 to FINAL-WEB-008, ACCEPT-011 to ACCEPT-014 | Truthful public surfaces, frozen TypeScript/JavaScript corpus, regression results, release recommendation |

The nine non-commit founder decisions at the bottom of
VERGLOS_V1_BACKLOG.md are included in Groups 1, 4, 6, 9, and 10.

---

## Group 1 — Hunt recipes, rules, provenance, and fixtures

### What this means in normal language

Hunt is the part of Verglos that can run a narrowly approved security check in
a bounded environment. It must not become “run any command the user gives us.”
Every Hunt recipe needs an identity, a known source, a license decision, a
limited assertion, and predictable test cases.

This group is about **what rule we allow** and **what happens for each result**.
It is not the independent security review yet; that is Group 2.

### Deliverable A — recipe/rule provenance record

This is a private Markdown file. Create one per external or separately
licensed recipe/rule set, for example:

    docs/shipping/evidence/hunt-recipe-provenance-<rule-id>.md

Copy this structure and replace every placeholder with a real fact:

    # Hunt recipe provenance — <rule ID>

    Status: DRAFT / APPROVED / EXCLUDED
    Product/release scope: Verglos V1 <exact release or commit>
    Rule/recipe name and immutable ID: <real value>
    Publisher/author: <real person, project, or Top Notchh Solutions>
    Source URL: <exact URL>
    Source repository: <exact URL, if applicable>
    Exact version/tag/commit: <real version or 40-character commit>
    Artifact digest: <sha256 if an archive/image/rule file was copied>
    License: <exact SPDX identifier or UNKNOWN>
    License/NOTICE URL: <exact URL>
    May Verglos modify it? YES / NO / NEEDS REVIEW
    May Verglos redistribute it? YES / NO / NEEDS REVIEW
    May it be used only as an operator-installed dependency? YES / NO
    Trademark/endorsement restrictions: <exact wording or UNKNOWN>
    Changes made by Verglos: <none or a precise list>
    Required attribution/NOTICE text: <path or exact short description>
    Network requirement: DENIED / named destination / NEEDS REVIEW
    Decision owner: <real name and role>
    Decision date: <UTC date>
    Approval reference: <real reference, or OPEN>

If the rule is written entirely by Top Notchh Solutions, say that clearly and
record the source commit and ownership decision. Do not label an internally
written rule as Trivy, OWASP, or another project's rule. If third-party rule
content is copied, the exact license and permission to modify/redistribute must
be known before it is included in a public package or feed.

### Deliverable B — supported-rule approval record

This is another private Markdown record, for example:

    docs/shipping/evidence/hunt-supported-rule-approval-<rule-id>.md

It must state:

- the exact rule ID and source record;
- which language/runtime it supports, currently TypeScript/JavaScript where
  applicable;
- the input shape and the command/adapter it is allowed to use;
- the expected positive assertion;
- what counts as a negative result;
- the timeout and resource limits;
- whether network is denied, which is the default;
- what data may appear in the redacted result;
- who approved support and on what date;
- the exact CLI commit and recipe/catalog digest reviewed.

For an internally authored V1 rule, the founder may approve the product
support decision. For third-party content, this approval does not replace the
license/legal decision in Group 6.

### Deliverable C — four honest fixtures

Fixtures are test inputs and expected outputs. They are not prose only. They
are usually small JSON/text files plus automated tests, with a private result
record. Use synthetic text and canary values—never a real API key or customer
secret.

For every supported Hunt rule, create or verify these four cases:

| Fixture | Expected meaning |
|---|---|
| Positive | The rule matches the intended condition and returns the documented finding/verdict |
| Negative | A near-miss does not match and is not falsely confirmed |
| Timeout | The bounded runtime stops and classifies the result as timeout/environment failure, never as a clean result |
| Adapter failure | Missing/broken/unsupported adapter is classified as infrastructure or policy, never as “not reproduced” |

The current CLI already has an A1 utf8-contains catalog and supporting
evidence. Do not create a second invented catalog. First inspect the existing
recipe and fixture tests, then add only the missing provenance/approval or
qualification artifact:

    rg -n "utf8-contains|Hunt|timeout|adapter" /Users/anuragyadav/Developer/TopNotchh-Workspace/verglos-cli/src /Users/anuragyadav/Developer/TopNotchh-Workspace/verglos-cli/packages
    git -C /Users/anuragyadav/Developer/TopNotchh-Workspace/verglos-cli rev-parse HEAD

The exact test command for the sandbox suite is already defined in the current
private review packet. Use that command rather than inventing a broad command
or enabling arbitrary network access.

### Group 1 completion package

Codex can check the Hunt rule rows only after the private evidence package has:

- one provenance record for every enabled rule/source;
- one supported-rule approval record for every enabled rule;
- positive, negative, timeout, and adapter-failure fixtures and real results;
- a rule/catalog digest bound to the exact CLI commit;
- an explicit default-deny network decision and any individually approved
  exception;
- no unresolved license/provenance/redistribution question for content that is
  shipped or enabled.

AI can draft these files and run formatting/tests. The founder or legal owner
must confirm facts about ownership, licensing, and redistribution.

---

## Group 2 — Independent Hunt security qualification

### What this means in normal language

This is a person outside the implementation team checking that Hunt really is
contained. They inspect and run the sandbox themselves. It is not a Trivy
account, a GitHub permission, or a request to certify Verglos as secure. It is
a bounded independent review of the Hunt isolation claims.

### Deliverables

Use the current private packet:

    docs/shipping/evidence/hunt-independent-review-packet-2026-10-09.md

The reviewer returns a completed private report under:

    docs/shipping/evidence/hunt-independent-review-<review-date>.md

The report must include:

- reviewer name, organization, role, and verifiable contact/approval
  reference;
- confirmation that they did not implement the Hunt sandbox;
- the exact CLI commit reviewed;
- the exact Linux/Docker image and digest checked;
- commands and tests actually run, with pass/skip/fail totals;
- network and socket denial;
- device and host-Docker-socket denial;
- namespace and privilege behavior;
- secret/path/output redaction;
- CPU, memory, disk, process, output, and time limits;
- cleanup after success, timeout, signal, and failure;
- failure classification, including the rule that infrastructure failure cannot
  become a positive or clean security verdict;
- findings and residual risks;
- exactly one recommendation: PASS, PASS WITH LIMITATIONS, or FAIL;
- signature or another verifiable approval reference.

### What you do

1. Select a real AppSec/security reviewer or firm who did not build the Hunt
   sandbox. An AI, the founder, or the implementer cannot sign as the
   independent reviewer.
2. Give them the public CLI repository URL and the private review packet. Do
   not give them customer source, browser cookies, Production credentials, or
   the private shipping tracker unless their scope explicitly requires a
   specific redacted file.
3. Ask them to clone and check out the exact commit named in the packet.
4. Ask them to run the Linux/Docker adversarial suite independently and retain
   only bounded, redacted evidence.
5. Ask them to complete every field and choose one recommendation.
6. Store the signed report privately. Do not rewrite a FAIL into a PASS.

The current packet already records the expected scope and pinned image. The
current engineering evidence is useful preparation, but it is not independent
review evidence until this person runs and signs it.

### Done means

HUNT-011 and QUAL-CLI-004 can move only when the signed report exists and the
reviewer's limitations are reconciled with the enabled recipes and public
claims. A PASS WITH LIMITATIONS may be acceptable only if the limitation is
explicitly reflected in the product contract and release truth registry.

---

## Group 3 — Organization policy signer and CLI policy fetch

### What this means in normal language

Team plans need a shared organization policy. The Web signs the policy; the
CLI verifies that signature and caches the exact policy. The signer is simply a
company-controlled cryptographic identity that proves the policy really came
from Verglos. It is separate from the entitlement signing key.

### Deliverables

1. A Preview-only organization-policy signing key and its public-key/trust
   record. The private key is a secret; the public key may be recorded in the
   CLI trust bundle if the implementation requires it.
2. Preview environment variables:

       VERGLOS_ORGANIZATION_POLICY_PRIVATE_KEY       Secret
       VERGLOS_ORGANIZATION_POLICY_SIGNER_ID         Config
       VERGLOS_ORGANIZATION_POLICY_ISSUER            Config

3. A Preview organization, project, repository binding, published policy row,
   and a license/tenant-bound fetch result.
4. CLI evidence showing signature verification, digest display, cache mode,
   offline TTL behavior, stale/invalid signature refusal, and repository
   binding.
5. A private evidence file such as:

       docs/shipping/evidence/team-cli-001-policy-preview-<date>.md

### Safe key-generation steps

Run these locally. They create a test key only; they do not touch Production:

    openssl genpkey -algorithm ED25519 -out /tmp/verglos-policy-preview-private.pem
    openssl pkey -in /tmp/verglos-policy-preview-private.pem -pubout -out /tmp/verglos-policy-preview-public.pem

Do not commit either file or paste either key into ChatGPT. Keep the private
key only long enough to enter it into the Preview secret store, then remove the
temporary file through the normal local cleanup process. Use a different key
for a future Production activation.

### Vercel steps

In the Vercel project verglos-web:

1. Open **Settings → Environment Variables → Add**.
2. Add VERGLOS_ORGANIZATION_POLICY_PRIVATE_KEY as **Secret**, **Preview only**,
   using the private PEM.
3. Add VERGLOS_ORGANIZATION_POLICY_SIGNER_ID as **Config**, **Preview only**,
   for example verglos-policy-v1.
4. Add VERGLOS_ORGANIZATION_POLICY_ISSUER as **Config**, **Preview only**,
   using the exact HTTPS Web origin, for example https://verglos.com.
5. Redeploy Preview. Do not add the key to Production as part of this guide.

The Web runtime deliberately fails closed unless all three organization-policy
values are valid. The CLI trust bundle and the deployed signer must match; if
they do not, the CLI must refuse the policy rather than trusting it.

### Preview test sequence

1. Sign in to the isolated Preview deployment.
2. Create or select a test organization and project using the normal UI/API.
3. Install/bind the test repository only through the supported organization
   flow.
4. Create and publish a policy through the application; do not insert a policy
   row manually.
5. Fetch it from the CLI using the exact supported command and a test license.
6. Record the policy ID, version, digest, signer ID, issuer, repository ID,
   result, and CLI cache behavior. Record identifiers, not credentials.
7. Repeat offline and with a mismatched repository/policy to prove refusal.

TEAM-CLI-002 additionally needs the source-free CI check payload: subject
digest, decision, policy identity/digest, record-manifest digest, HTTPS record
URL, and commit. It must be idempotent and must not upload source.

### Done means

The Preview policy is signed by the configured key, fetched for the correct
tenant/repository, verified by the CLI, cached atomically, usable within the
documented offline TTL, and rejected when any identity/digest/signature is
wrong. The evidence must be from the deployed Preview path, not only unit
tests.

---

## Group 4 — GitHub/GitLab live organization integration

### What this means in normal language

Verglos can remain a terminal CLI on Free/Pro. Team and higher plans can add a
Web dashboard connection to a GitHub/GitLab organization so Verglos can run a
bounded check and post a result on the right commit. Your existing GitHub
account being connected to Top Notchh is not the same as the Verglos GitHub App
being created, installed, permission-scoped, and tested.

A public repository may be used for technical testing. The GitHub App still
needs an installation identity and repository binding. A private/customer
repository additionally needs the consent record in Group 9.

### Current browser fact

The authenticated browser's GitHub Developer Settings page currently shows:

    No GitHub Apps

That means the live app setup has not yet happened in that GitHub context.

### Deliverables

- GitHub App registration record, App ID, and private key stored only in the
  Preview secret store;
- webhook secret stored only in the Preview secret store;
- minimum permissions record: GitHub Checks: write and Metadata: read;
- exact organization/user account and repository IDs returned by GitHub;
- Preview installation record bound to the correct Verglos organization/project;
- webhook delivery, duplicate/replay, cross-repository, uninstall, suspend,
  reauthorization, and recovery evidence;
- one private cutover report with URL, exact commit SHA, installation ID,
  repository ID, event IDs, check result, and removal result (identifiers only).

### GitHub setup steps

1. In GitHub, open **Settings → Developer settings → GitHub Apps → New
   GitHub App**. The current direct page is https://github.com/settings/apps.
2. Use a clear internal name such as Verglos Preview SCM.
3. Set the homepage to the exact Preview/Web product URL chosen for testing.
4. Set a strong webhook secret generated locally. Never put it in the app
   name, repository, public issue, or chat.
5. Request only the permissions implemented by Verglos: **Checks: Read and
   write** and **Metadata: Read-only**. Do not add source-content, issues,
   administration, or broad organization permissions unless a later reviewed
   contract explicitly requires them.
6. Enable only the installation/lifecycle and repository event types that the
   deployed contract handles. The current Web route handles installation
   lifecycle events and repository commit payloads; verify the final event list
   against the exact deployed code before saving.
7. Create the App, download its generated private key once, and store it as a
   Vercel Preview secret. Do not commit it.
8. Record the App ID privately. It is an identifier, not a secret; the private
   key is a secret.
9. Install the App on the authorized company test organization or on one
   explicitly selected test repository. Select the narrowest repository scope.
10. Record the installation ID, immutable GitHub account ID, repository ID,
    repository owner/name, granted permissions, and exact test commit in a
    private record. Do not send those details with cookies or tokens.

The Web implementation expects these Preview variables:

    VERGLOS_GITHUB_APP_ID             Config/identifier
    VERGLOS_GITHUB_APP_PRIVATE_KEY    Secret
    VERGLOS_GITHUB_WEBHOOK_SECRET     Secret

The Web routes used by the current implementation are:

    POST/GET /api/v1/organizations/<organization-id>/scm/installations
    POST     /api/v1/webhooks/scm/<provider>/<installation-id>
    POST     /api/cron/scm
    GET      /api/v1/organizations/<organization-id>/repositories/<repository-id>/policy

Use the exact deployed route and installation ID; do not guess a webhook URL.
The current webhook route verifies the raw signature, installation ID,
immutable repository/account IDs, commit SHA, and duplicate delivery ID.

### Test matrix

Run each row in isolated Preview and keep a redacted result:

| Test | Expected result |
|---|---|
| Install selected repository | Installation is active and bound to the right org/project |
| Push/commit event | One source-free check is queued for the exact commit/artifact identity |
| Duplicate same delivery ID | No second durable event/check is created |
| Wrong installation/repository/account | Request is refused without cross-tenant data |
| Temporary provider retry | Bounded retry/lease path runs; no duplicate check |
| Suspend/revoke | Future delivery fails closed; state is audited |
| Reauthorization | Permissions are revalidated and old state is not trusted blindly |
| Uninstall/remove | Installation is revoked and no future delivery is accepted |

GitLab follows the same principle, but it needs a real authorized GitLab
project/group and its own provider token/webhook secret. Do not claim GitLab
completion just because the pure adapter tests pass.

### Done means

All four GitHub rows and TEAM-WEB-006 require real provider evidence:
installation, least permissions, signed delivery, replay protection, exact
commit/artifact binding, check publication, lifecycle removal, and
reconciliation. Automated tests alone are implementation evidence, not live
integration evidence.

---

## Group 5 — Studio and Enterprise proof

### What this means in normal language

Studio is for safely handing selected evidence to a client/recipient. It must
show exactly what leaves Verglos and must not leak private fields. Enterprise
runner is for a controlled machine polling for signed, short-lived work; it is
not remote shell access.

### Studio deliverables

Use the existing implementation and record:

- exact CLI/Web commits;
- the redacted projection preview shown to the recipient;
- the projection digest and approval binding;
- fields deliberately excluded;
- recipient identity and authorization (or a clearly marked synthetic internal
  recipient if the row allows a fixture);
- hosted custody upload and retrieval result;
- cross-client and cross-tenant refusal result;
- recipient confirmation that the artifact is understandable and bounded.

Suggested private record:

    docs/shipping/evidence/studio-cli-001-recipient-<date>.md

The recipient must confirm the real result. AI can compare the projection to
the allowlist but cannot act as the recipient.

### Enterprise runner deliverables

Use the existing private-runner evidence files as the starting point:

    docs/shipping/evidence/ent-cli-001-private-runner-client-2026-10-07.md
    docs/shipping/evidence/ent-cli-001-private-runner-transport-2026-10-08.md
    docs/shipping/evidence/ent-cli-001-private-runner-e2e-2026-10-08.md
    docs/shipping/evidence/ent-cli-001-private-runner-replay-race-2026-10-08.md

The missing operational evidence must show:

- an authorized runner enrollment;
- signed short-lived job issuance;
- GET-only/outbound polling;
- target allowlist enforcement;
- nonce/replay refusal;
- least-evidence result upload;
- success, expiry, malformed-job, duplicate-result, and network-failure
  outcomes;
- cleanup and credential revocation;
- cross-platform result where required;
- independent review or authorized operator sign-off for the run.

There must be no general remote shell, arbitrary command field, or unbounded
source upload. Use Preview/Test Mode and a disposable runner first.

### Done means

STUDIO-CLI-001 needs independent recipient/redaction proof and recipient
acceptance. ENT-CLI-001 needs an operational credential exchange, approved
runner lifecycle/result reconciliation, cross-platform qualification, and any
required independent review.

---

## Group 6 — Legal and licensing clearance

### What this means in normal language

This is not a Trivy login. It is a private written decision by an authorized
legal/company reviewer saying what Verglos may ship, modify, copy, or
redistribute.

### Deliverables

Use the prepared private packet:

    docs/shipping/legal/legal-review-addendum-2026-10-09.md

The reviewer must decide each section separately:

1. Trivy release/image, image layers, database/source terms, LICENSE/NOTICE,
   attribution, and whether Verglos redistributes it or only invokes an
   operator-installed copy.
2. detect-secrets version/source/notice obligations and the rule that an
   unreviewed binary is not bundled.
3. Scanner fixtures, including OWASP Juice Shop or any copied fixture,
   authorship, license, modification, redistribution, attribution, and
   trademark limits.
4. Hunt recipes/rules, publisher, source, exact version, modification,
   redistribution, premium-feed restrictions, and network exceptions.
5. Modification and redistribution rights for each third-party component.
6. Trademark and endorsement wording for named projects.
7. Generated THIRD_PARTY_NOTICES, SBOMs, source-offer text, attribution, and
   package/archive contents.

For each section fill in:

    Decision: approved / approved with conditions / not approved / needs more evidence
    Exact artifact/version reviewed:
    Conditions:
    Reviewer name, organization, role:
    Scope:
    Effective date:
    Expiry or re-review trigger:
    Signature or verifiable approval reference:

The final legal record must be a real review, not an AI-generated signature.
If a license or source is unknown, the correct interim decision is **needs
more evidence** or **exclude/unbundle**, not approved.

### How to get it

1. Give the reviewer the private addendum and the current third-party
   inventory.
2. Give them exact release-candidate artifact names, versions, digests, and
   generated notices—not passwords or unrelated customer source.
3. Ask them to write conditions in the packet itself.
4. Resolve conditions in code/package contents or record the exclusion.
5. Have the reviewer date and sign the final scope.
6. Keep the completed packet private and link it from the ledger.

### Done means

LIC-002 and LIC-003 are closed only after the exact release artifacts are
reviewed and the legal packet says approved or approved with conditions whose
conditions are demonstrably closed. Inventory by itself is not legal
approval.

---

## Group 7 — Release, provenance, protected approvals, and rollback

### What this means in normal language

This proves that the package we publish is the package we tested, that no
private files or keys entered it, that its notices/SBOM/provenance are present,
and that a bad npm or Web release can be stopped, revoked, or rolled back.

### Deliverables

1. **Package contents report** for DIST-001: six expected public archives,
   one verglos bin entry point, correct exports, no private keys, customer
   fixtures, tracker files, or unintended source.
2. **Protected publish evidence** for DIST-002: GitHub OIDC/trusted npm
   publishing, protected environment approval, least permissions, immutable
   version/tag, and no long-lived npm token.
3. **Artifact/provenance evidence** for DIST-003 and QUAL-CLI-006:
   checksums, SBOM, SARIF/CycloneDX/SPDX validation, in-toto/Sigstore result,
   clean-consumer install, and supported OS/Node matrix.
4. **Rollback/revocation report** for DIST-006: bad package, engine
   manifest, recipe feed, signing identity, and Web deployment response. The
   report must preserve old records and explain what is revoked versus what
   remains historically valid.

### Safe sequence

1. Freeze the exact release candidate and record the CLI/Web commit SHAs.
2. Run the existing package boundary and official-format checks.
3. Run npm pack --dry-run or the repository's protected pack command and
   inspect the archive file list. Do not publish yet.
4. Generate checksums, notices, SBOM, and provenance for that exact candidate.
5. Configure GitHub/Vercel protected environments so publication requires a
   human approval and uses short-lived OIDC credentials.
6. Rehearse the rollback on a disposable package/tag/Preview deployment. Do
   not revoke a real public release as a rehearsal.
7. Record the rehearsal, approver, exact versions, expected recovery time,
   result, and limitation.
8. Only after legal approval and release go/no-go may the founder separately
   authorize a real npm publish, tag, or Production deployment.

The migration/restore/rollback instructions for Web data are in:

    docs/shipping/HOSTED_013_EXECUTION_RUNBOOK.md

Do not run its Production commit steps merely to create evidence. Use the
fresh Neon branch or approved disposable environment required by the runbook.

### Done means

The exact package is clean, reproducible, legally cleared, protected by
approval, verifiable by a clean consumer, and recoverable through a rehearsed
procedure. A build passing alone does not close these rows.

---

## Group 8 — Web privacy, deletion, accessibility, and performance

### What this means in normal language

This proves that customers can understand what Verglos stores, request
deletion, retain customer-held signed records correctly, and use the Web app
with keyboard/screen-reader/mobile/performance constraints.

### QUAL-WEB-005 deliverables

Use isolated Preview and a disposable database. Record:

- consent/collection explanation shown to the user;
- account/privacy request creation;
- request history and status;
- worker execution, retry, idempotency, and concurrent-request behavior;
- hosted private data removed from the allowed inventory;
- customer-held signed record digest retained without retaining the record
  bytes, when the contract requires it;
- hold/release behavior;
- no cross-tenant deletion or enumeration;
- legal/customer-held-record decision and reviewer/date.

Suggested evidence:

    docs/shipping/evidence/qual-web-005-privacy-deletion-<date>.md

Do not use Production customer data for a qualification run.

### QUAL-WEB-006 deliverables

The current automated evidence is strong but the item is still open. The
missing human/hosted pieces are:

- screen-reader pass with browser/OS and page list;
- keyboard/focus/landmark results for authenticated organization pages;
- paid organization and large-dataset browser run using an authorized test
  account;
- responsive 390px/mobile and desktop results;
- reduced-motion, loading, empty, error, and long-table behavior;
- field or approved real-user Core Web Vitals evidence with date and page;
- console/network error result;
- reviewer name/date and any known limitation.

Use the existing evidence record as the baseline:

    docs/shipping/evidence/account-a11y-cwv-2026-10-02.md

Screenshots/traces are evidence only when they are redacted, dated, tied to a
commit/deployment, and stored privately. Lighthouse 100 alone does not prove
a human screen-reader pass or a large authenticated dataset.

---

## Group 9 — Acceptance, comprehension, Hunt study, and commercial proof

### What this means in normal language

This is where we demonstrate that the finished product works for real plan
stories and that people understand the results. It is later than ordinary unit
testing. It must not use random repositories or unconsented customer data.

### Deliverable A — acceptance story runner and bundle

ACCEPT-002 and ACCEPT-003 require twelve stories, including Free, CI, Trivy
import, deduplication, mismatch/incomplete evidence, exceptions, Hunt,
offline records, modified CLI, Studio recipient, Enterprise runner, and
account deletion.

The repository already contains a substrate verifier and an evidence JSON.
Use them as the starting point, then add the missing hosted/provider/customer
results. The final private bundle must include:

- exact CLI/Web commits;
- plan/account/organization test configuration;
- environment and runtime versions;
- command arguments and exit codes;
- provider/deployment IDs where safe;
- results, failures, skips, and limitations;
- redaction review;
- reviewer sign-off.

Suggested location:

    docs/shipping/evidence/acceptance-stories-<date>.json
    docs/shipping/evidence/acceptance-review-<date>.md

### Deliverable B — authorized external repository workflow

For each private/customer repository, copy:

    cd /Users/anuragyadav/Developer/TopNotchh-Workspace/verglos-cli-private-shipping
    cp docs/shipping/acceptance/consent-record.template.md docs/shipping/acceptance/consent-<safe-repo-name>-<commit>.md

The owner must complete and approve:

- owner and organization/role;
- exact repository URL and commit SHA;
- permitted paths and commands;
- network policy;
- whether findings may be stored;
- allowed evidence fields;
- retention deadline and expiry time zone;
- revocation/deletion instructions;
- owner approval and founder approval.

Then run the exact approved scope, redact output, give the owner a summary,
and record deletion/expiry. The full protocol is:

    docs/shipping/acceptance/external-workflow-protocol.md

Public open-source repositories may be used for technical evidence, but they
do not close customer acceptance by themselves.

### Deliverable C — comprehension test

Ask the developer/lead/recipient to answer, without being coached:

- What artifact was produced?
- What decision does it represent?
- What changed?
- What risk remains?
- How can the artifact's authenticity be checked?
- What limitations apply?

Record the questions, anonymized or consented participant role, answers,
corrections, date, and pass/fail result. Do not record personal data that is
not needed.

### Deliverable D — Hunt adjudication study

Use the existing adjudication protocol. Freeze the method first, then evaluate
at least 100 independently adjudicated findings. Separate:

- confirmed;
- not reproduced;
- inconclusive;
- environment failure;
- policy denied;
- unsupported.

Record denominator, sampling method, reviewer agreement, corrections, and
held-out fixtures. Do not tune the rule against the same final holdout and
then call it an independent result.

### Deliverable E — commercial/COGS evidence

This is not a vanity claim. Record actual bounded plan tests, manual-renewal
behavior, support time, hosted cost, recipient value, and explicit allowance
limits. Team/Studio pricing hypotheses remain hypotheses until this evidence
exists. Use Test Mode and authorized testers; do not charge real money for
qualification.

### Deliverable F — truth registry and release go/no-go

After the above, update shipped/partial/planned labels from evidence, list
failed gates and rollback work, and write a dated go/no-go. Then freeze the
release candidate: versions, schemas, migrations, plan catalog, compatibility,
docs, notices, SBOM, provenance, and rollback plan.

### Done means

ACCEPT-005 to ACCEPT-010 require actual authorized participants and a complete
evidence bundle. A local story verifier or a founder's general permission is
not a substitute for a customer/recipient response where the row requires it.

---

## Group 10 — Final public Web pass and final POC corpus

### What this means in normal language

This is the final cleanup after the product truth is frozen. We make the public
website describe only what the release actually supports, then test a held-out
set of architecture-shaped TypeScript/JavaScript repositories. The corpus is
not used to secretly tune the product after seeing the answers.

### Final public Web deliverables

For FINAL-WEB-001 to FINAL-WEB-008, collect:

- a capability-to-copy map for homepage, pricing, docs, metadata, and llms
  surfaces;
- updated homepage flow: Inspect → Decide → Prove → Monitor, only where
  supported;
- exact Free/Pro/Team/Studio/Enterprise allowances and billing terms;
- public documentation truth pass for TypeScript/JavaScript coverage,
  engines, signing limitations, Hunt assurance, and dashboard capabilities;
- factual metadata/structured data without invented benchmarks/customers;
- sanitized proof assets with version/date/demo-or-real label/alt text;
- keyboard, screen-reader, responsive, reduced-motion, crawlability, and
  performance verification;
- a final public claim search for stale alpha language, stale prices,
  unsupported plans, and contradictory status;
- production-like smoke without deploying while the release is still frozen.

Keep private screenshots, customer names, raw records, and private evidence
out of public pages.

### Final POC corpus deliverables

Only after the implementation/qualification path and release candidate freeze:

1. Select full, non-shallow public repositories covering small product,
   multi-user SaaS, multi-tenant/team, and enterprise-like boundaries.
2. Record URL, exact commit, license/NOTICE, clone digest, scope, expected
   coverage, configuration, and exclusions in a private manifest.
3. Run the exact unreleased CLI against each fixture with bounded network and
   resource policy.
4. Retain only private redacted reports/hashes and classify findings/coverage
   gaps.
5. Run the held-out false-positive/false-truth correction review.
6. Re-run the frozen corpus across plan, user, and tenant scenarios.
7. Compare report/performance deltas and issue a dated go/no-go recommendation.

Suggested records:

    docs/shipping/evidence/accept-011-corpus-manifest-<date>.md
    docs/shipping/evidence/accept-012-corpus-runs-<date>.json
    docs/shipping/evidence/accept-013-correction-review-<date>.md
    docs/shipping/evidence/accept-014-final-regression-go-no-go-<date>.md

### Done means

The final Web claims match the truth registry, and the corpus is frozen,
licensed, reproducible, redacted, and run against the final candidate without
being used as an unrecorded tuning set.

---

## Founder decision sheet

These are decisions only the founder/company can make. Use a private Markdown
record such as:

    docs/shipping/FOUNDER_DECISIONS_2026-10-12.md

For each line, write DECIDED, DEFERRED, or REJECTED, plus date, scope, reason,
and review trigger:

1. Final Team/Studio pricing hypotheses after evidence.
2. Queue and object-storage provider after the cost/constraint decision.
3. Legal review for premium content, contributors, trademarks, privacy, terms,
   and enterprise obligations.
4. Any external engine/fixture redistribution with unresolved license/NOTICE.
5. Any networked Hunt recipe exception; default is no network.
6. Independent Hunt isolation/security reviewer.
7. Authorized customer fixtures/repositories and consent.
8. Separate authorization for external conversations, paid pilots, checkout,
   campaign, publish, deploy, npm release, tags, pushes, and Production
   migrations.
9. No Team/Studio/Enterprise generally-available claim before end-to-end gates
   pass.

AI may prepare the decision sheet. Only the founder/company can make these
decisions, and an independent reviewer/legal reviewer must still make their
own professional decision.

## What to send back after each real deliverable

Send only a status summary, not secrets or raw private material:

    Deliverable group:
    Backlog IDs affected:
    Status: ready / partial / blocked
    Private file path(s):
    Exact code/deployment commit:
    Tests/evidence actually run:
    Human reviewer/owner status: not required / requested / signed
    Remaining condition:

For repository work, say only the private consent-record path and status. For
legal/AppSec work, say only the private packet path, reviewer status, and
recommendation. Never send the actual signature token, private key, database
URL, provider secret, GitHub token, or browser cookie.

## Completion order for the next working sessions

Use this order to reduce rework:

1. Finish Group 1 recipe provenance/approval/fixture gaps.
2. Obtain and run Group 2's independent Hunt review.
3. Configure and qualify the Preview signer in Group 3.
4. Create/install the least-privilege Preview GitHub App and run Group 4.
5. Run Studio/Enterprise operational acceptance in Group 5.
6. Send the exact release candidate and inventories to the legal reviewer in
   Group 6.
7. Complete protected release/provenance/rollback evidence in Group 7.
8. Finish the missing Web privacy and human qualification in Group 8.
9. Run the authorized acceptance and commercial evidence in Group 9.
10. Freeze public copy and run the final POC corpus in Group 10.

This is a collection order, not permission to skip dependencies. At each
step, Codex should select one active backlog ID, implement or qualify that row,
write its private evidence, update VERGLOS_V1_BACKLOG.md,
EXECUTION_LEDGER.md, STATUS.md, and traceability records together, recompute
the score, and then report the next single dependency-ready ID.

## The finish line

The shipping goal is genuinely complete only when:

- every required backlog checkbox is checked with evidence;
- all external blockers have an owner, artifact, decision, expiry/review date,
  and recorded limitation;
- Hunt has both rule provenance and independent isolation review;
- Team/SCM has real organization-policy and provider evidence;
- Studio/Enterprise have recipient/runner evidence;
- legal, notices, SBOM, provenance, protected release, and rollback evidence
  match the exact release candidate;
- Preview and Production truth registries agree with what is actually enabled;
- final acceptance and the held-out TypeScript/JavaScript corpus pass;
- the founder makes the final dated go/no-go decision.

Until then, the product can be code-complete in many areas while remaining
shipping-incomplete. That is why a test result, a deployment, or a drafted
Markdown file may improve readiness without closing a checkbox by itself.
