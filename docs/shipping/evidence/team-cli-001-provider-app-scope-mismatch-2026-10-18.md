# TEAM-CLI-001 provider App scope mismatch and cleanup — 2026-10-18

## Observation

The existing GitHub browser session created a private `Verglos Preview SCM`
GitHub App registration with App ID `5361183`. The registration requested only
Checks write and Metadata read, and its homepage was the Preview deployment
URL. No private key or webhook secret was printed or stored in this packet.

The first installation was not a valid TEAM-CLI-001 qualification:

- installation ID: `172504338`;
- installation account: `topnotchhsolutions-apa`;
- repository selection shown by GitHub: **All repositories**;
- authorized qualification target: `anuragyadav-git/verglos-web`;
- required binding: the authorized account/repository with only the narrowest
  selected scope.

The installation therefore did not match the authorized target or least-
privilege requirement. It was queued for uninstall and is not counted as a
provider success, policy fetch, webhook delivery, or SCM check result. No
Vercel Preview credentials were added and no customer or Production state was
changed.

## Boundary

This evidence records cleanup and a provider blocker only. It does not close
TEAM-CLI-001, TEAM-CLI-002, TEAM-WEB-006, GITHUB-WEB-001 through GITHUB-WEB-004,
or any AppSec/Hunt row. The next valid attempt must use the
`anuragyadav-git` GitHub account, install only on
`anuragyadav-git/verglos-web`, configure server-held Preview credentials,
and run the signed installation/webhook/policy/check qualification matrix.

No score changed: **230 checked / 50 open / 280 total (82.1%)**.
