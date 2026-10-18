# TEAM-WEB-006 hosted GitHub check-delivery qualification — 2026-10-19

## Disposition

`TEAM-WEB-006` is checked for the implemented GitHub/GitLab SCM integration
core. The existing Web implementation and focused failure/replay suites were
combined with an owner-authorized isolated Preview delivery: a bounded
source-free check was admitted against the mapped GitHub installation,
delivered by the durable worker, replayed as a no-op, and read back from
GitHub with a successful completed conclusion. No customer source, provider
token, private key, production state, or archive repository was used. No
AppSec/Hunt state changed.

## Implementation and regression coverage

The Web SCM implementation was merged through normal non-squash PRs #129–#137
and the subsequent Preview delivery fixes in PRs #216–#218. The accepted
implementation covers:

- immutable provider installation/account/repository identity and tenant
  binding;
- raw-body GitHub/GitLab webhook authentication and bounded payloads;
- redacted HTTPS-only check composition with commit, subject, and artifact
  identity;
- digest-based idempotent admission and conflicting-payload refusal;
- fenced `SKIP LOCKED` delivery claims, lease-fenced finish, bounded retry and
  terminal-failure classification;
- GitHub App token exchange/refresh and encrypted server-only token storage;
- provider transport timeout, redirect refusal, response-body cancellation,
  bounded request metadata, and retry-after handling; and
- authenticated SCM cron execution with aggregate results only.

The existing focused SCM route/lease/runner/worker/provider coverage passed
with zero failures or skips, including the accepted **22/22** combined SCM
suite and the provider transport **7/7** and delivery **14/14** slices. The
existing authorized installation scope and repository reconciliation evidence
bind installation `172686102` to `Top-Notchh-Solutions/verglos-cli`, account
`287223982`, repository ID `1310272752`, and the qualification organization.

## Live isolated Preview qualification

The source-free payload was produced by the actual CLI `ci --check-payload`
command and contained only bounded decision metadata. The protected Web SCM
enqueue on Preview accepted it for:

- organization: `bca7f024-3053-4f56-af0a-207bf0138862`
- installation: `172686102`
- repository: `Top-Notchh-Solutions/verglos-cli` (`1310272752`)
- commit: `5bf7ae70a0e8169f169750cfc188baf4d13685db`
- decision: `PASS`
- subject/artifact digest: `sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`
- record URL: `https://verglos.com/records/team-cli-002-20261019`

The Web admission returned delivery ID
`2b0bf9db-02e2-4f9e-a66b-373baa2cad04`, provider payload digest
`sha256:749537ee0402dde616913209277fcca4d3f2b7d82014f8c324ffad174ce700a7`,
and initial state `queued`.

The protected SCM worker returned:

```json
{"ok":true,"result":{"claimed":1,"delivered":1,"retried":0,"failed":0,"leaseLost":0}}
```

An identical protected enqueue returned `providerStatus=delivered` and
`deliveryDecision=noop` for the same delivery and payload digest. GitHub
read-back returned exactly one `Verglos / release decision` check for the
bound commit:

- check ID: `117825133730`
- status: `completed`
- conclusion: `success`
- details URL: `https://verglos.com/records/team-cli-002-20261019`
- output title: `Verglos release decision`
- output summary: bounded decision, subject digest, and artifact digest only

This proves the live provider publication and replay path for the authorized
GitHub installation. GitLab was not exercised live because no authorized
GitLab installation is in scope; the GitLab adapter remains covered by the
Web provider contract tests and no GitLab customer/provider state was touched.

## Boundary and limitations

This is an isolated Preview qualification of the Web SCM integration core,
not production certification, customer acceptance, an independent AppSec
review, or permission to upload source. GitHub lifecycle/cutover rows
`GITHUB-WEB-001` through `GITHUB-WEB-004` remain separate and unchecked until
their own installation, lifecycle, reconciliation, and acceptance contracts
are satisfied. AppSec/Hunt remains a separate independent gate.

## Score

This closure changes the private backlog from **234 checked / 46 open / 280
total (83.6%)** to **235 checked / 45 open / 280 total (83.9%)**.
