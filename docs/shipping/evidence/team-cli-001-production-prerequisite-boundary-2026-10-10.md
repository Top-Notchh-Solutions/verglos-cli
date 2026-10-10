# TEAM-CLI-001 · Production prerequisite boundary — 2026-10-10

## Read-only verification

- The authenticated Production `/orgs` page reports **no organizations**.
- The same-origin `GET /api/v1/organizations` returned HTTP **200** with
  `Cache-Control: private, no-store` and an organization count of **0**.
- No Production organization, project, policy, license, entitlement, or SCM
  row was created or changed.

## Exact policy endpoint prerequisites

Inspection of the deployed policy route shows that a signed policy response
requires all of the following:

1. an active license whose mapped tenant matches the organization;
2. one active GitHub SCM installation for the repository, with a bound project;
3. one published canonical policy row effective at the request time; and
4. the Production organization-policy signer private key, signer ID, and HTTPS
   issuer configuration.

The endpoint fails closed when any prerequisite is absent. Therefore an
organization-only write, a founder-email shortcut, the entitlement signer, or
`.env.gates.testing` cannot create `TEAM-CLI-001` acceptance evidence.

## Disposition

Keep `TEAM-CLI-001` unchecked. The required unblock is an authorized company
test tenant with a valid paid/non-production fixture, an authorized GitHub App
installation and repository binding, a published policy row, and the approved
Production policy signer/trust-root activation. Then capture the signed fetch,
cache/offline, expiry, and cross-tenant denial evidence. No new Production
write is justified by this read-only boundary.

Score remains **223 checked / 57 unchecked / 280 total (79.6%)**.

