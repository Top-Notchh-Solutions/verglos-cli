# Hosted organization-policy authority substrate — 2026-10-06

## Scope

Web PR #148 merged as `cbc0f5a`. This is implementation and qualification
evidence for TEAM-CLI-001; it is not production activation or live fetch
evidence.

## Contract

- Migration `0028_scm_project_binding.sql` adds a nullable foreign key from
  `scm_installations.project_id` to `projects.id`. Existing unbound rows cannot
  serve policy.
- GitHub installation admission accepts an optional project UUID and validates
  every binding against an active project in the same authorized organization.
  GitLab remains unbound because it has no immutable repository-ID contract in
  this phase.
- `GET /api/v1/organizations/:organizationId/repositories/:repositoryId/policy`
  requires an active bearer license whose mapped owner tenant exactly matches
  the organization UUID, exactly one active GitHub repository binding, and one
  published `canonical-json-v1` policy effective at the current time.
- The response is a signed CLI-compatible envelope with exact organization and
  repository binding, recursive canonical digest, derived public-key ID, and a
  dedicated Ed25519 signer separate from entitlement JWT keys. Missing,
  malformed, ambiguous, or cross-tenant state fails closed without reflection.

## Verification

- Local policy/signer/SCM/tenant contract tests: 23/23 passed.
- Full Web suite: 868 total / 846 passed / 22 explicit environment-gated skips /
  0 failures.
- Typecheck, production build, Drizzle check, 29-migration ordering, and diff
  hygiene passed.
- Hosted PR #148 run `37493818464`: typecheck/schema, Vercel, GitGuardian, and
  Preview Comments passed.

## Boundary

No `VERGLOS_ORGANIZATION_POLICY_PRIVATE_KEY` was provisioned or printed. No
production migration, policy-row inventory/rewrite, authenticated hosted fetch,
customer operation, or database operation occurred. TEAM-CLI-001 and
PLAN-CLI-001 remain open pending production signer/trust-root activation,
policy reconciliation, R-041 credential rotation, and live runtime evidence.
