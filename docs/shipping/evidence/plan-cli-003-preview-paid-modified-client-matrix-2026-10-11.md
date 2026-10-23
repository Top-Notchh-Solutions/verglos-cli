# PLAN-CLI-003 · isolated paid modified-client matrix — 2026-10-11

## Scope

This evidence qualifies the authenticated modified/untrusted client boundary
against the isolated Preview deployment and the isolated Neon Test database.
The hosted deployment used Web source head `887249d`; the local verification
suite was rechecked after Web test commit `003def6`. Production was not used.

The probe held the Preview test-auth value and the paid Pro license bearer only
in process memory. No secret, bearer, cookie, response body containing
personal data, provider credential, database URL, or customer identifier was
stored in this record.

## Authenticated Preview organization/read matrix

The bounded client first observed an empty organization directory, then created
one acceptance organization and one test project in the isolated database.
It exercised the following private list/search/read surfaces with forged
`plan`, `tenant`, `organization`, and query authority values:

- organization and project list
- organization search
- usage query validation
- evidence, exceptions, policies, policy evaluations, receipts, releases,
  and client-projection lists
- forged receipt download/detail and release-detail lookups
- account deletion status and the public receipt lookup boundary

The 27-request hosted matrix recorded **15 HTTP 200**, **2 HTTP 201** for the
two bounded Preview fixture writes, **2 HTTP 400** validation denials,
**3 HTTP 401** license-bearer denials, **4 HTTP 404** not-found denials, and
**1 HTTP 405** unsupported-method response. Private responses carried
`Cache-Control: private, no-store` wherever the route contract requires it;
the public receipt boundary returned `404` with `no-store`.

The forged Enterprise capability selector remained on the server-owned Free
projection before the paid bearer was supplied. No forged tenant/plan/query
field changed the selected organization, project, capability, or record
scope.

## Paid CLI/API bearer matrix

Using the active isolated Pro fixture's raw license bearer, the modified client
requested:

- capability projection with forged `as_plan=enterprise` and tenant input;
- license status with forged plan and tenant input;
- Pro monitor-registration list with forged plan and tenant input;
- Pro score-history list with forged plan and tenant input; and
- license validation with an intentionally wrong body shape to verify the
  bounded `400 bad_request` contract.

The four valid paid requests returned HTTP **200**, private `no-store`
responses, `real_plan=pro`, `active=true`, and only server-owned Pro data.
The malformed validation request returned the bounded HTTP **400** response.
The forged Enterprise selector did not elevate Pro to Enterprise.

## Verification

- Hosted isolated Preview matrix: **27 requests, 0 transport errors**.
- Paid bearer matrix: **5 requests, 4 HTTP 200 and 1 intentional HTTP 400**.
- Focused Web boundary suite after the test-contract repair: **40 passed / 1
  explicit environment-gated skip / 0 failures**.
- The existing Web payment and receipt/tenant contract suites remain green;
  the one skip is the documented database-gated runtime route test, not a
  failed assertion.
- `git diff --check`: passed.

## Disposition

The authenticated modified-client, paid capability, tenant, usage/query,
record/list, search, download/export boundary, and public/private cache
matrix is accepted for `PLAN-CLI-003` in isolated Preview. Production remains
read-only and no Production database, entitlement, payment, or account state
was changed.
