# Verglos V1 — Founder Action Steps

**Private document. Do not copy this file into the public CLI or Web repository.**

This is the simple checklist for finishing the external parts of Verglos V1.
You do not need to send passwords, database URLs, API keys, customer source
code, or tokens in ChatGPT.

## Current 2026-10-09 position

The separate Neon test database, Preview isolation marker, Docker PostgreSQL
path, valid Razorpay Test Mode credentials, Test Mode webhook, and canonical
Test Mode subscription plans are available. The Web subscription route is
implemented and deployed to both Preview and Production. Production is
aliased to `https://verglos.com`, but it deliberately has no Test Mode plan
IDs or Test Mode credentials, so recurring billing remains fail-closed there.
Do not replace the Production database URL or manually edit entitlements or
payment rows for the current qualification.

The next technical action is to run the authenticated isolated Preview/Test
Mode subscription lifecycle and reconcile provider, billing-ledger, webhook,
and entitlement state. Production work is not skipped: Codex will continue
read-only audit, public smoke, configuration verification, monitoring,
rollback preparation, and code deployment. Production billing or database
activation requires its own reviewed operation, backup/restore, dry-run,
reconciliation, and rollback preflight.

Later founder actions are genuinely external: select an independent AppSec
reviewer, obtain authorized legal/licensing approval, decide whether Web SCM
is part of V1 or npm/CLI-only, enable protected release approvals, and provide
authorized final POC fixtures after the release candidate is frozen. A
general permission to work on Verglos does not create those independent
approvals or customer consents.

## 1. Database: current status and safe future rotation

Gate 1 and Gate 2 already have a separate Neon test database, an isolated
Preview database configuration, and the Docker PostgreSQL fallback. The
Production database remains separate.

For the next technical batch, do **not** replace Production `DATABASE_URL`,
run migrations against Production, or manually edit production entitlements or
payment rows. The subscription-creation work is tested against isolated
Preview/Test Mode and Docker fixtures.

Changing a database URL does not recreate tables. Any future database
rotation or cutover must follow the backup, migration, verification, and
rollback procedure in `HOSTED_013_EXECUTION_RUNBOOK.md`; never paste a
connection string into chat. No founder action is required for the current
batch.

## 2. Razorpay payment-method variable

The current Test Mode qualification keeps the provider methods that have a
usable hosted fixture:

Variable name:

```text
RAZORPAY_ENABLED_PAYMENT_METHODS
```

```text
card,netbanking,wallet,emi
```

UPI/UPI QR and Pay Later are not counted in the current hosted matrix because
the provider fixture was unusable: the QR was invalid for the phone test and
the Pay Later OTP fixture did not validate. Do not re-enable those methods by
guesswork. No founder update is required now; the remaining Gate 4 work is
code-owned subscription creation, renewal, cancellation, expiry, and ledger
qualification.

## 3. Public repositories: no permission form is needed

For a public open-source repository, you do **not** need:

- Customer consent
- A GitHub login for the repository
- A Trivy login
- The repository owner's private credentials

The repository can be cloned using its public URL. We record its URL, exact
commit, and license/NOTICE information. Public-repository results are useful
technical evidence, but they are **not** customer acceptance or a customer
POC.

The final public-repository corpus is intentionally run only after the
release-candidate gates are complete. This prevents tuning the product or
public claims against the final evaluation set.

### What you need to do now

Nothing for repository consent yet. The next technical batch is the Web
subscription-creation route and its isolated Test Mode lifecycle evidence.
Do not clone a repository just to create a consent file. Consent files are
stored in this private tracker, not inside the repository being evaluated.

## 4. Authorized repository permission — private/customer POC only

This section applies only if we test a private repository or claim that a real
customer/team accepted Verglos. It is simply a permission form for that
repository owner. It is **not** a file containing repository source code.

AI or Claude may help format a draft, but they must not invent the owner,
scope, approval, signature, expiry, or consent. The repository owner must
review and explicitly approve the final record.

Do this once for each private/customer repository:

```bash
cd /Users/anuragyadav/Developer/TopNotchh-Workspace/verglos-cli-private-shipping
cp docs/shipping/acceptance/consent-record.template.md \
  docs/shipping/acceptance/consent-REPLACE-WITH-REPO-NAME.md
```

Open the copied file and fill in:

- Who owns the repository
- Organization and role
- Repository web address
- Exact commit ID to test
- Which folders may be used
- Which commands may be run
- Whether network access is allowed (normally **no network**)
- Whether findings may be stored
- Which evidence fields are allowed
- When the evidence must be deleted
- When permission expires
- How the owner can revoke permission
- Owner approval and date
- Founder approval and date

The owner must approve the exact repository and exact commit. A general “you
can access our GitHub” message is not enough.

Do not send us repository passwords, GitHub tokens, cookies, or raw private
source code. The external POC happens only after the release-candidate gates
allow it.

## 5. Legal approval

This is not a Trivy login. It is a private written record that someone
authorized to make the decision has checked the licenses and usage rights for
software/content that Verglos may ship or redistribute.

Use the prepared private review packet:

```text
docs/shipping/legal/legal-review-addendum-2026-10-09.md
```

It is a review request, not an approval. The authorized reviewer must fill in
each decision and the scope, expiry, identity, conditions, and verifiable
approval fields.

Write down the decision for each of these:

- Trivy image, release, and NOTICE files
- `detect-secrets`
- Scanner test fixtures
- Hunt recipes and rules
- Whether modification is allowed
- Whether redistribution is allowed
- Trademark restrictions
- Required copyright/license notices
- Countries or products covered, if limited
- Expiry date, if any
- Reviewer name, role, and date
- Approval/signature or a verifiable approval reference

This record stays in the private shipping tracker. Do not add it to the public
CLI repository.

## 6. Independent Hunt security review

This is a final security-acceptance gate for the Hunt sandbox, not a
requirement for cloning ordinary public repositories. Choose a separate
AppSec/security person or security firm. The reviewer must not be the person
who implemented the Hunt sandbox. I cannot sign this review myself because
that would not be independent.

Give the reviewer this private packet:

```text
docs/shipping/evidence/hunt-independent-review-packet-2026-10-09.md
```

The 2026-10-02 packet is historical. The current packet targets CLI
`8bea4be2fa18533eafd088122be769e942965626` and must be used for the review.

The reviewer must:

1. Review the exact current CLI commit.
2. Run the Linux/Docker Hunt isolation tests independently.
3. Check network, sockets, devices, namespaces, secrets, resource limits,
   cleanup, and failure classification.
4. Record what they actually tested.
5. Record findings and remaining risks.
6. Choose one recommendation: `PASS`, `PASS WITH LIMITATIONS`, or `FAIL`.
7. Sign the result or provide a verifiable approval reference.

The signed review goes in the private `docs/shipping/evidence/` directory.

## 7. What to tell Codex afterward

Send only this kind of status message:

```text
Database password changed: yes/no
Vercel DATABASE_URL updated: yes/no
Old database credential revoked: yes/no
Production deployment: Ready/failed
Enabled Razorpay methods: method names only
Repository consent files: private paths only
Legal review file: private path only
Independent Hunt review: private path only
```

Never send the actual database URL, password, API key, Vercel token, GitHub
token, customer source, or cookies.
