# Verglos V1 — Founder Action Steps

**Private document. Do not copy this file into the public CLI or Web repository.**

This is the simple checklist for finishing the external parts of Verglos V1.
You do not need to send passwords, database URLs, API keys, customer source
code, or tokens in ChatGPT.

## 1. Database: keep the existing Neon database

You do **not** need to create a new Neon database.

The goal is only to change the password for the existing database user.
Changing the password does not delete tables or rows.

### In Neon

1. Open the existing Verglos project in Neon Console.
2. Select the existing production branch.
3. Open the database role used by `DATABASE_URL`.
4. Choose **Reset password** and generate a new password.
5. Keep the same project, branch, database name, host, and role.
6. Copy the new connection string privately.

Do not create a new empty database and do not paste the connection string here.

### In Vercel

The variable name is:

```text
DATABASE_URL
```

Update it for both **Production** and **Preview**. Use the new connection
string, then choose **Sensitive** if Vercel asks whether the value can be
revealed.

The CLI commands are:

```bash
cd /Users/anuragyadav/Developer/TopNotchh-Workspace/verglos-web
vercel env update DATABASE_URL production
vercel env update DATABASE_URL preview
```

Enter the new value only when the command prompts for it. Never put the value
after the command and never paste it into ChatGPT.

### Redeploy Web

Environment-variable changes affect new deployments only. From the Web
directory, run:

```bash
cd /Users/anuragyadav/Developer/TopNotchh-Workspace/verglos-web
vercel redeploy dpl_Btjq8knubUab1ENgF7CEtzdUFV7G
```

If Vercel says that deployment cannot be redeployed because a newer deployment
exists, use:

```bash
cd /Users/anuragyadav/Developer/TopNotchh-Workspace/verglos-web
vercel --prod
```

After it finishes, check:

```bash
vercel ls
```

The deployment must say `Ready`. If it fails, share only the error message;
never share environment values.

After the new deployment works, revoke the old Neon password/credential.

## 2. Razorpay payment-method variable

This variable tells Verglos which payment methods the Razorpay account has
actually enabled.

Variable name:

```text
RAZORPAY_ENABLED_PAYMENT_METHODS
```

Use only method names that Razorpay shows as enabled for this account. The
hosted methods understood by the current Web code are:

```text
upi
card
netbanking
wallet
emi
paylater
```

Example format only:

```text
upi,card,netbanking,wallet
```

Do not copy this example unless those exact methods are enabled in the
Razorpay account. Do not invent a list. Do not configure production as
QR-only.

If the variable already exists, update it:

```bash
cd /Users/anuragyadav/Developer/TopNotchh-Workspace/verglos-web
vercel env update RAZORPAY_ENABLED_PAYMENT_METHODS production
```

Enter only the confirmed comma-separated method names when prompted. Then
redeploy using the command in Section 1.

## 3. Authorized repository permission

This is simply a permission form for a repository owner. It is **not** a file
containing repository source code.

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

## 4. Legal approval

This is a private written record that someone authorized to make the decision
has checked the licenses and usage rights.

Create a file such as:

```text
docs/shipping/legal/legal-review-YYYY-MM-DD.md
```

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

## 5. Independent Hunt security review

Choose a separate AppSec/security person or security firm. The reviewer must
not be the person who implemented the Hunt sandbox. I cannot sign this review
myself because that would not be independent.

Give the reviewer this private packet:

```text
docs/shipping/evidence/hunt-independent-review-packet-2026-10-02.md
```

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

## 6. What to tell Codex afterward

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
