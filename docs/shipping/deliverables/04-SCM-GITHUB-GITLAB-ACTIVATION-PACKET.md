
# GitHub/GitLab organization integration packet

**Private working packet — TEAM-WEB-006, GITHUB-WEB-001 to GITHUB-WEB-004**

## Plain-English meaning

Free and Pro can use the terminal CLI. Team and higher plans may connect a
Web organization to GitHub/GitLab so Verglos can post a bounded check on the
correct commit. Your GitHub account being related to Top Notchh is not itself
the Verglos App installation.

## Current browser fact

The authenticated GitHub Developer Settings page currently says:

    No GitHub Apps

So no live Verglos GitHub App installation evidence exists yet in that account.

## Minimum GitHub App contract

The current Web code requires:

    VERGLOS_GITHUB_APP_ID
    VERGLOS_GITHUB_APP_PRIVATE_KEY
    VERGLOS_GITHUB_WEBHOOK_SECRET

The implemented minimum permissions are:

- Checks: write
- Metadata: read

The current Web routes are:

    POST/GET /api/v1/organizations/<organization-id>/scm/installations
    POST     /api/v1/webhooks/scm/<provider>/<installation-id>
    POST     /api/cron/scm
    GET      /api/v1/organizations/<organization-id>/repositories/<repository-id>/policy

## Setup sequence

1. Open GitHub Settings → Developer settings → GitHub Apps → New GitHub App.
2. Create an internal Preview App with the exact Preview homepage.
3. Generate a webhook secret locally and keep it private.
4. Request only Checks write and Metadata read.
5. Enable only installation/lifecycle and commit events used by the deployed
   code. Codex will verify the final event list before qualification.
6. Create the App and store the generated private key only in Vercel Preview.
7. Install it on the narrowest authorized company test repository or
   organization scope.
8. Record the installation ID, immutable account ID, repository ID, repository
   owner/name, permissions, event IDs, and test commit in private evidence.

Do not guess the dynamic webhook path. Codex will verify the final deployed
installation ID and route before any live delivery test.

## Required live test matrix

| Test | Evidence |
|---|---|
| Installation | App installation and correct Verglos organization binding |
| Repository selection | Immutable repository/account IDs and least scope |
| Signed webhook | Signature accepted; invalid signature rejected |
| Commit event | Exact commit/artifact identity bound |
| Duplicate delivery | No duplicate durable check/event |
| Wrong account/repository | Cross-tenant request rejected |
| Retry/lease | Bounded retry and stale-worker fencing |
| Suspend/revoke | Future delivery fails closed |
| Uninstall | Installation revoked and no future event accepted |
| Check publication | Correct source-free check appears on the test commit |

## Evidence file

    docs/shipping/evidence/github-scm-live-cutover-<date>.md

No repository source or GitHub token belongs in this file.

## Founder input

Codex does not need a commit from you. The only choices are:

- which company-owned test organization/repository to install on;
- whether GitHub only is sufficient for V1, or GitLab must also be qualified;
- whether the selected repository is public technical-only or private/customer
  acceptance scope.

A private/customer repository also needs the consent record in Group 9.

