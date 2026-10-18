# TEAM-WEB-006 GitHub App webhook configuration — 2026-10-18

## Scope

This packet records the owner-visible configuration of the personal Preview
GitHub App. It is configuration evidence only; no webhook secret or token is
recorded, and no delivery success is inferred.

## Observed configuration

- App: `Verglos Preview SCM Checks`
- Owner: `@anuragyadav-git`
- App ID: `5367509`
- Webhook active: yes.
- Webhook endpoint: `https://verglos.com/api/v1/webhooks/scm/github`.
- SSL verification: enabled.
- GitHub reported that a webhook secret is configured; the secret was not
  viewed, copied, or recorded.
- Repository permissions: Checks read/write; Metadata read-only and mandatory;
  all other observed repository permissions were no access.
- Subscribed events: Check Run and Check Suite only.

## Independent delivery check

Read-only GitHub API inspection of recent merged commits found only GitHub
Actions check runs for the selected repositories. It did not show a
`Verglos Preview SCM Checks` provider check run on the inspected CLI or Web
merge commits. This is a delivery gap, not a failure of the configured
webhook itself.

## Disposition

The App configuration is consistent with the bounded SCM contract. Keep
`TEAM-WEB-006`, `GITHUB-WEB-002`, and `GITHUB-WEB-003` open pending an
authorized live delivery/publication, duplicate/retry behavior, and
reconciliation observation. No AppSec state changed. Score remains **232
checked / 48 open / 280 total (82.9%)**.

