# QUAL-WEB-005 hosted Preview deletion qualification — 2026-10-18

## Scope and safety boundary

This packet records a real non-Production privacy/deletion execution against
an isolated Vercel Preview deployment using a fresh synthetic owner fixture.
Only the synthetic user's `record_receipt` scope was requested. No Production,
Neon Production, customer account, payment, provider, npm, or AppSec state was
used or changed. The Preview-only cron credential and test-auth material are
not recorded.

## Exact deployment

- Repository: `https://github.com/anuragyadav-git/verglos-web`
- Source commit: `25adc4abb5a7d989c8349eb7a288f7011143f5b7`
- Deployment: `dpl_7w7KmjmBuRhGvHnEh3XUtF3c8f2Z`
- Preview URL: `https://verglos-og2w3oo8a-anuragyadav20062002s-projects.vercel.app`
- Deployment state: `READY`; Preview build and typecheck completed successfully.
- Synthetic deletion request: `1918b441-2b03-4ba9-846c-328bce40dde1`
- Requested kind: `record_receipt`
- Customer-held digest fixture: `sha256:cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc`

## Hosted execution

1. Authenticated deletion history initially returned HTTP 200 with no pending
   requests; the held-digest list initially returned HTTP 200 with no entries.
2. The synthetic signed-record digest was registered through the authenticated
   same-origin route. The route returned an idempotent success on the repeated
   registration, proving duplicate registration does not create a second row.
3. An explicit same-origin deletion request for `record_receipt` returned a
   pending request. The request was not created by direct database access.
4. The authenticated Preview cron endpoint executed the real deletion worker
   and returned `ok=true` with:
   `examined=1`, `completed=1`, `blocked=0`, `retryScheduled=0`,
   `deadLettered=0`, `leaseLost=0`, `alreadyBusy=0`, and `malformed=0`.
5. The authenticated deletion history then returned the same request with
   `status=completed`.
6. The held digest remained present with the same `signed_vgl` kind and exact
   SHA-256 identity, proving the hosted deletion did not rewrite or remove the
   customer-held record identity.
7. A second worker invocation returned all-zero counts, proving the completed
   request was not reprocessed.

## Fail-closed route checks

- A deletion POST without the exact same-origin header returned
  `same-origin request required`.
- A same-origin request with `confirm=false` returned
  `explicit deletion confirmation required`.

## Evidence artifacts

The private terminal artifact directory was
`/tmp/verglos-qual005-live.z9ikfW` while this packet was assembled. It contains
the redacted request/history, held-digest, worker, replay, and guard responses.
No credentials, raw customer data, private keys, or deployment secrets were
copied into the repository.

## Remaining acceptance boundary

This closes the hosted synthetic execution slice only; it does not close
`QUAL-WEB-005`. The row still requires a consent/legal/customer-held-record
decision, complete inventory reconciliation beyond this narrow synthetic
scope, restore/rollback acceptance, production migration authorization, and
independent end-to-end acceptance. The backlog checkbox remains unchecked.

