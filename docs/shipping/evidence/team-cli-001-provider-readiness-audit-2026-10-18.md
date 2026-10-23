# TEAM-CLI-001 provider-readiness audit — 2026-10-18

## Scope and boundary

This is a fresh read-only audit of the provider-side prerequisites for
`TEAM-CLI-001`. It records the current public heads, the Vercel Preview
environment-key surface, and the GitHub organization installations. It does
not create an App, install an App, change Vercel, write a policy row, expose a
secret, or claim a live signed fetch.

The code-side policy client remains separately revalidated in
`team-cli-001-policy-current-head-revalidation-2026-10-18.md`.

## Audit timestamp and identities

- Audit timestamp: `2026-10-17T19:26:39Z`.
- GitHub CLI account used: `anuragyadav-git` (read-only queries in this audit).
- Vercel CLI account used: `anuragyadav20062002`.
- Vercel project: `verglos-web` / `prj_ssnvOaAkJ2WUdTWFj6XjAAxSOmqg`.
- No browser tab was opened or navigated.

## Source heads

- CLI `Top-Notchh-Solutions/verglos-cli` `main`:
  `50bcab42eadfa8796d86d1f7a8aaee3010c65647`.
- Web `anuragyadav-git/verglos-web` `main`:
  `9dd2ab30c83a31dc4769ac3818ed881595b54924`.

## Commands actually run

The following commands projected metadata only; no secret values were
printed, stored, or requested:

```text
gh api orgs/Top-Notchh-Solutions/installations \
  --jq '.installations[] | [.id, .app_slug, .target_type, .account.login] | @tsv'
vercel env ls --json --project verglos-web \
  | jq -r '.envs[] | [.key, ((.target // []) | join(","))] | @tsv' | sort -u
gh api repos/Top-Notchh-Solutions/verglos-cli/commits/main --jq .sha
gh api repos/anuragyadav-git/verglos-web/commits/main --jq .sha
```

## Results

The organization installations were:

```text
135902108  vercel        Organization  Top-Notchh-Solutions
161075107  neon-postgres Organization  Top-Notchh-Solutions
```

No dedicated Verglos GitHub SCM App installation was present. The Vercel
project has the Preview organization-policy signer keys:

```text
VERGLOS_ORGANIZATION_POLICY_ISSUER         preview
VERGLOS_ORGANIZATION_POLICY_PRIVATE_KEY   preview
VERGLOS_ORGANIZATION_POLICY_SIGNER_ID     preview
```

The Vercel project has no Preview environment keys named
`VERGLOS_GITHUB_APP_ID`, `VERGLOS_GITHUB_APP_PRIVATE_KEY`, or
`VERGLOS_GITHUB_WEBHOOK_SECRET`.

## Acceptance disposition

`TEAM-CLI-001` remains unchecked. The missing artifacts are still:

1. an authorized least-privilege SCM App installation and repository binding;
2. the corresponding server-held Preview credentials and webhook secret;
3. a published canonical policy row bound to that repository;
4. authenticated signed CLI fetch, cache, offline, and cross-tenant
   qualification against the live binding.

`TEAM-CLI-002` and `TEAM-WEB-006` remain dependency-blocked. This row is not
AppSec-held. The read-only audit did not change public repositories, Vercel
Preview or Production, GitHub installations, databases, billing, npm, or
customer state. Score remains **230 checked / 50 open / 280 total (82.1%)**.

