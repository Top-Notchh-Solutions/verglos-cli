# TEAM-CLI-001 hosted CLI policy and provider qualification — 2026-10-19

## Disposition

`TEAM-CLI-001` is checked based on the approved isolated Preview
qualification. The qualification exercised the mapped founder entitlement,
signed organization/repository policy fetch, CLI cache/offline/expiry/
cross-tenant behavior, source-free SCM admission/idempotency, provider
delivery, and provider read-back. Production, payment, customer data, and the
old archive repository were not used or changed. No AppSec/Hunt state changed.

## Exact public implementation history

The CLI route-binding implementation is CLI PR #147, merged normally as
`5bf7ae70a0e8169f169750cfc188baf4d13685db`, preserving implementation
`b761dee41d3f9a46fc8ebd60135eaefe6acdb154` and regression test
`e28d831a5bf7b793a5f6434480b3c88bceee9f96`.

The hosted SCM delivery runtime was repaired through three normal Web merges,
with no squash, rebase, force-push, empty commit, or documentation-only
substitute:

- PR #216 merged `e2fc3f9daa359bacd896af1fcf4d01791e47474a`: implementation
  `e7beecf` and regression test `748d069`; the delivery claim join now uses
  the locked CTE installation identity.
- PR #217 merged `358dc3c0852520110009808086aeb5f6601083f2`: implementation
  `a3ad482` and regression test `63d6520`; claim timestamps are serialized for
  the Neon serverless SQL driver.
- PR #218 merged `390fd3f82b2a59003e30e2362ab593ef1db4b982`: implementation
  `bb950c1` and regression test `ee63385`; lease-finish timestamps are also
  serialized for the same driver.

Local final SCM verification passed **22/22**, with zero failures/skips, and
`pnpm typecheck` passed. Each Web PR's protected typecheck/schema, Vercel,
Vercel Preview Comments, and GitGuardian checks passed. The final merged Web
commit was deployed to Preview as deployment
`dpl_CENtuqYXgX4mMrFbdzH4BbQkDtoX` at
`https://verglos-6mcljhopc-anuragyadav20062002s-projects.vercel.app` and
reached `READY`.

## Mapped non-production entitlement and signed policy

The protected Preview owner fixture returned an authorized device-code result
with plan `founder` and `has_license_key: true`. The license bearer was held
only in memory and is not recorded here.

The fixture binding was:

- organization: `bca7f024-3053-4f56-af0a-207bf0138862`
- project: `3919e928-b680-430c-ba43-a68eeab89263`
- provider installation: `172686102`
- GitHub account: `287223982`
- repository: `Top-Notchh-Solutions/verglos-cli`
- repository ID: `1310272752`

The final Preview policy route returned a signed envelope with:

- schema: `urn:verglos:schema:organization-policy` version `1.0.0`
- organization/repository scope matching the fixture IDs above
- policy digest `sha256:055bd90bca9822faa7219224aeba42ed4c201ab9ed81df9ca9efa167a9ad8a02`
- signer key ID `sha256:bb9443f7dc2f2325704ad3ef650e0b73b3582dbfee9f6e03affcf93ab6260c14`
- signer `tns-preview-policy-qualification-20261018`, issuer
  `https://verglos.com`
- signature present; policy document not recorded

The CLI fetcher matrix for this same isolated qualification recorded:

```text
remote=remote
offline=cache
expired=cache-expired
crossTenant=organization-mismatch
cacheMode=0600
requests=2
```

The controlled fetch seam asserted the exact organization/repository policy
URL and bearer header. Protected Preview transport was accessed through the
Vercel CLI; this evidence does not overclaim an unprotected browser request.

## Source-free provider delivery and reconciliation

The exact source-free SCM payload used the CLI merge commit
`5bf7ae70a0e8169f169750cfc188baf4d13685db`, bounded synthetic subject and
artifact digests, decision `PASS`, completed state, and record URL
`https://verglos.com/records/team-cli-001-20261019`.

The protected SCM enqueue returned the existing delivery, proving replay
idempotency:

- delivery ID: `d99ff23b-8428-41c8-b45d-434d5805ad88`
- payload digest: `sha256:183d3f1ded108e741318235a0d98671c5662ac3eaa4c9cf1c5f465a1def7d95d`
- enqueue decision: `noop`

The final protected `GET /api/cron/scm` returned:

```json
{"ok":true,"result":{"claimed":1,"delivered":1,"retried":0,"failed":0,"leaseLost":0}}
```

A second identical enqueue read back `providerStatus: delivered` and
`deliveryDecision: noop`. GitHub read-back for commit
`5bf7ae70a0e8169f169750cfc188baf4d13685db` showed:

- check ID `117824403843`
- name `Verglos / release decision`
- status `completed`
- conclusion `success`
- details URL `https://verglos.com/records/team-cli-001-20261019`
- bounded output title `Verglos release decision`

No provider token, license key, private key, customer source, response body,
or browser credential was recorded.

## Commands and limitations

Commands actually run included locked dependency installation, the focused SCM
test command, `pnpm typecheck`, normal GitHub PR pushes/checks/merges, a
Preview `vercel deploy`, protected `vercel curl` calls for CLI auth, policy,
SCM enqueue, cron, and replay, `vercel logs` for the two runtime failures, and
the read-only GitHub check-runs API query. Secret values were derived and held
in shell memory only; they were never printed or committed.

This is bounded Preview qualification evidence, not an independent AppSec
review, production certification, customer acceptance, or permission to run
arbitrary commands. The AppSec/Hunt gate remains a separate independent gate.

## Score

This closure changes the private backlog from **232 checked / 48 open / 280
total (82.9%)** to **233 checked / 47 open / 280 total (83.2%)**. Dependent
rows remain open until their own contracts are satisfied.
