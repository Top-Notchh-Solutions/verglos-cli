# Authenticated modified-client production probe — 2026-10-06

Read-only requests were issued from the authorized signed-in browser session
against the deployed Web API. No organization or billing state was changed.

## Results

- Forged `as_plan=pro`, `team`, `studio`, and `enterprise` query values all
  returned HTTP 200 with bounded `plan=free`, `real_plan=free`, and
  `simulated=false`; client-supplied plan values cannot elevate the account.
- Malformed organization identifiers were rejected with HTTP 400.
- Well-formed but foreign/non-member organization UUIDs returned HTTP 403 with
  the bounded reason `organization access denied` for both members and usage
  endpoints; no tenant data or plan details were disclosed.

## Boundary

This strengthens PLAN-CLI-003 modified-client and tenant-isolation evidence,
but does not close the item: a separately installed modified CLI still needs
the authenticated usage/record request matrix and production signer/catalog
activation proof.
