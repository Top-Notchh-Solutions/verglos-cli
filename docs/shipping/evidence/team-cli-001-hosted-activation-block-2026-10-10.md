# TEAM-CLI-001 hosted-activation block — 2026-10-10

## Completed in the current branch

The signed organization-policy contract, bounded cache, authenticated fetch,
offline fallback, and `verglos policy organization fetch` command are present
and locally qualified. The implementation evidence is recorded in
`team-cli-001-policy-client-2026-10-10.md`.

## Missing acceptance artifacts

`TEAM-CLI-001` cannot be checked until all of these are supplied and verified:

- the authorized production policy signer and pinned trust-root activation;
- a dry-run inventory/reconciliation of existing hosted policy rows against
  the recursive canonical digest contract, followed by the approved migration
  or explicit zero-row result;
- a live tenant/repository-bound fetch from the deployed hosted endpoint using
  an authorized non-production/company fixture;
- signed response, cache, expiry/offline, and cross-tenant rejection evidence
  from that hosted run.

Owner: authorized Verglos policy operator and Web deployment owner. Next
action: activate the signer/trust root in the approved environment, run the
row reconciliation, then capture the live fetch trace. Review: 2026-10-11 IST
or immediately after activation. No Production or database write was made by
this block transition.

## Queue decision

Keep the checkbox open and park this item. The next dependency-ready item by
backlog order is `STUDIO-CLI-001`; its existing local projection evidence must
be assessed separately and must not inherit this item's hosted acceptance.
