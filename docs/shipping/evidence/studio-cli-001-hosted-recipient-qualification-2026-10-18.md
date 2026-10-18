# STUDIO-CLI-001 hosted recipient qualification — 2026-10-18

## Result

The current Preview deployment was exercised through its real authenticated
organization/project receipt routes. The redaction boundary and tenant denial
behavior are working, but the authorized hosted-recipient acceptance cannot be
completed with the configured fresh fixture because its founder/enterprise
license has a `contracted` `recordsPerMonth` allowance. The route correctly
returns `allowance_not_configured` rather than treating contracted capacity as
unlimited. `STUDIO-CLI-001` remains unchecked.

This is a hosted entitlement/customer-acceptance prerequisite, not an AppSec
result and not a reason to weaken the allowance guard.

## Exact qualification target

- Deployment: `https://verglos-qag6klamu-anuragyadav20062002s-projects.vercel.app`
- Deployment ID: `dpl_4maHYPZL5qd3hteFoXAmRtWxB3rd`
- Web source commit: `25adc4abb5a7d989c8349eb7a288f7011143f5b7`
- Preview identity: `preview-payment-fixture` / `payment-fixture@example.test`
- Organization: `8600ed0a-4a2c-4a12-9105-f99c5b5decc3`
- Project: `a75afde0-2130-4bc0-9de3-a88e02378ec4`
- Provider-bound repository: `anuragyadav-git/verglos-web`

No secret, license key, database URL, customer source, or raw finding was
recorded here.

## Commands and observations

The run used the existing Vercel CLI against the READY Preview deployment and
the Preview-only `x-verglos-preview-test-auth` seam. The receipt body was a
256-KiB-bounded, digest-consistent redacted projection containing only the
allowlisted manifest, decision, subject, policy, signer-status, redaction, and
limitation fields.

| Check | Result |
| --- | --- |
| `GET /api/v1/organizations/<org>/projects/<project>/receipts` | HTTP 200; empty list; no private fields returned |
| Valid redacted receipt `POST` | HTTP 403, `hosted record allowance is not configured`; no write accepted |
| Same receipt plus forbidden `source` field | HTTP 400, `invalid redacted record receipt`; rejected before admission/persistence |
| Same receipt read under a different organization ID | HTTP 403, `organization access denied` |

The configured Preview owner fixture receives the internal `founder` plan.
The canonical founder/enterprise projection intentionally exposes
`recordsPerMonth: contracted`, while this hosted receipt admission route
requires a numeric allowance. The failure therefore proves the route does not
silently grant hosted custody to an unqualified identity.

## Acceptance boundary

The local CLI projection implementation and Web custody implementation are
already covered by:

- `evidence/studio-cli-001-hosted-custody-implementation-pr-2026-10-18.md`
- public CLI PR #77 / normal merge `de92976`
- Web PR #188 / normal merge `a94ff8e`

The remaining artifacts are an authorized paid/non-production Studio recipient
with a numeric hosted-record allowance, a successful real receipt upload and
download, and recipient/customer acceptance of the redacted projection. Owner
authorization alone does not substitute for that observed hosted state.

## Next unblock

Use an existing isolated Preview Pro/Studio qualification fixture, or run the
approved Preview payment/migration qualification with an explicitly selected
database and its dry-run, reconciliation, and rollback record. Do not modify
the database through an undocumented connection and do not change the
production allowance catalog merely to make this test pass.

No Production, customer, registry, billing, or AppSec state changed. No
squash, rebase, force-push, empty, duplicate, artificial, or irrelevant public
documentation commit was used.
