# TEAM-CLI-001 organization-owner policy authorization fix — 2026-10-18

## Scope

This packet records a public Web implementation slice for the next
non-AppSec backlog row. The repository-policy endpoint previously authorized
license bearers only through the legacy user-to-primary-tenant migration
mapping. That made a valid owner of a newly created organization unable to
fetch its explicitly organization- and repository-bound policy.

The fix adds `isActiveOrganizationOwner`, which queries the exact requested
organization and requires the license user to be its active owner. A missing
owner match returns the existing bounded `404 policy unavailable` response;
database failures remain `503 policy unavailable`. The legacy migration
resolver remains unchanged for the v2 entitlement path.

## Exact implementation

- Repository: `https://github.com/anuragyadav-git/verglos-web`
- Pull request: `https://github.com/anuragyadav-git/verglos-web/pull/192`
- Assignee: `anuragyadav-git`
- Branch: `codex/fix-scm-mixed-scope-20261018`
- Implementation commit: `4579c27`
- Regression-test commit: `f8b420e`
- Branch head: `f8b420e012b69c9d8b6052c9da16c1633582b4c7`
- Normal merge commit: `188b4b01fd9d6c7c4292d8cdf55a3b348954e9d4`
- Merge state: PR merged normally into `main` on 2026-10-18; both substantive
  commits remain in the first-parent merge history.
- Merge policy: regular reviewable history; no squash, rebase, force-push,
  empty, duplicate, or artificial commit

## Verification

- Focused SCM and tenant-scope contract tests: **22 passed, 0 failed,
  0 skipped**.
- `pnpm typecheck`: passed.
- `git diff --check`: passed.
- READY Preview deployment: `dpl_7DhQxht5dgG655VBqU1a1NnzZj21`.
- Preview URL:
  `https://verglos-ew4flng1y-anuragyadav20062002s-projects.vercel.app`.
- Hosted build generated **47/47** pages and included the policy route.
- GitGuardian, Vercel Preview Comments, and hosted `typecheck-and-schema`:
  passed.
- After the normal merge, the connected Vercel project automatically deployed
  merge commit `188b4b01fd9d6c7c4292d8cdf55a3b348954e9d4` to Production as
  deployment `dpl_6v94AE2iXisCWHKxQfrjKyD81NZ8`.
- `vercel inspect` reported target `production`, status `Ready`, and aliases
  `https://verglos.com`, `https://www.verglos.com`, and
  `https://verglos-web.vercel.app`.
- A read-only public smoke request to `https://verglos.com/` returned HTTP
  `200`, `content-type: text/html`, and the factual title
  `Verglos — The Security Layer for AI-Generated Code`.

## Organization SCM provider activation checkpoint

The organization-owned GitHub App was created and installed through the
authenticated `anuragyadav-git` owner session, using the same existing browser
window. GitHub API read-back confirmed:

- App: `Verglos Organization SCM Checks`, App ID `5368230`.
- Installation ID: `172686102` on account `Top-Notchh-Solutions`.
- Repository selection: `selected`, exactly
  `Top-Notchh-Solutions/verglos-archive` (non-Production test repository).
- Permissions: repository metadata `read` and checks `write`; no all-repository
  installation was used.
- Webhook endpoint configured on the App:
  `https://verglos.com/api/v1/webhooks/scm/github`.

The server-held Vercel configuration was rotated in both Preview and
Production to this organization App. The configured variable names are
`VERGLOS_GITHUB_APP_ID`, `VERGLOS_GITHUB_APP_PRIVATE_KEY`, and
`VERGLOS_GITHUB_WEBHOOK_SECRET`; Vercel reports them as hidden secrets. No
private-key or webhook-secret value is recorded in this packet.

Because the environment snapshot changed, Production was redeployed from the
clean hosted qualification worktree. The new deployment
`dpl_8joQ1Xg3cXmk9UWs1DQyjSigQC9Z` reached `READY` at
`https://verglos-cll23hhnd-anuragyadav20062002s-projects.vercel.app` and was
aliased to `https://verglos.com`. The hosted build generated **47/47** pages.
A read-only smoke request after that deployment returned HTTP `200`, the
expected Security Layer title, and **204851** response bytes.

## Hosted Preview SCM/policy qualification checkpoint

Using the existing authenticated Verglos owner session, a disposable
Preview-only qualification project was created and bound to the least-privilege
organization installation:

- Organization external ID: `org_03971076-631d-4f3e-abf0-0eb9c7033423`.
- Project: `verglos-scm-qualification-20261018`.
- Project ID: `821854d4-afe0-414b-a630-28bfecb064f2`.
- Environment: `preview`.
- Repository: `Top-Notchh-Solutions/verglos-archive`.
- SCM binding ID: `066a654c-9208-49ed-952c-7cf241f9636d`.
- GitHub installation ID: `172686102`; repository ID: `1305731597`.
- SCM read-back status: `active`.

A policy document was created, transitioned through `review`, and published
through the hosted policy API. The published row is:

- Policy ID: `verglos.policy.scm-qualification-20261018`.
- Policy row ID: `95f44933-cb7c-4cb3-87ae-51ed02d866da`.
- Version: `1.0.0`.
- Digest algorithm: `canonical-json-v1`.
- Digest: `sha256:c7327a70ded22a0e051b9da420c012e2ae5d105c430ebe665b82d1ac9399b698`.
- Status: `published`.
- Effective from: `2026-10-18T12:18:21.242Z`.

The authenticated policy-enforcement request was also exercised without a
license bearer and returned HTTP `401` with the bounded reason
`invalid authorization`. The account is Free and has no license key, so the
CLI fetch/cache/offline/cross-tenant matrix cannot be honestly claimed from
this session. No billing or payment operation was attempted, and no auth or
license guard was bypassed.

This adds real hosted installation, project binding, policy lifecycle, and
fail-closed authorization evidence. It does not close `TEAM-CLI-001`, because
the row still requires an active mapped license bearer, authenticated CLI
fetch/cache/offline/cross-tenant observations, and reconciliation.

## Boundary and disposition

This is code, hosted-build, authorized least-privilege provider-installation,
server-held-configuration, and Production deployment evidence. The selected
GitHub installation and Vercel configuration now exist, but this packet does
not claim the authenticated CLI fetch/cache/offline/cross-tenant matrix or
reconciliation. No customer, billing, npm registry, or database migration
state was changed. No credentials, private keys, license bearers, raw provider
payloads, or customer source are recorded.

`TEAM-CLI-001` remains unchecked. The row still requires the published signed
organization policy, authenticated live CLI fetch/cache/offline/cross-tenant
observations, and reconciliation evidence. `TEAM-CLI-002` and `TEAM-WEB-006`
remain dependent. Score remains **232 checked / 48 open / 280 total (82.9%)**.
