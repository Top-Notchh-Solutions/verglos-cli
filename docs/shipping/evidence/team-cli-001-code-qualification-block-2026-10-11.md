# TEAM-CLI-001 code qualification and external block — 2026-10-11

## Code qualification

The shipping CLI worktree contains the organization-policy fetch/cache
implementation and policy organization command. It verifies the exact
organization/repository scope, canonical policy digest, active signing key,
signature, bounded response, HTTPS API origin, atomic mode-0600 cache, and
offline TTL behavior.

Verification at worktree head 2b05390f:

- organization-policy/shared policy focused tests: **8/8 passed**;
- Turbo typecheck/build for the CLI dependency graph: **12/12 tasks passed**;
- no source, credential, repository, provider, or Production write occurred.

## Why the checkbox remains open

The repository-owned implementation is not the complete acceptance condition.
The remaining artifacts are:

1. the authorized Verglos organization-policy signing root activated for the
   supported hosted environment, with rotation/revocation ownership;
2. one active TopNotchh company GitHub installation/repository binding whose
   published policy row can be fetched through the hosted route;
3. a live signed fetch and bounded offline-cache recheck using that exact
   organization and repository;
4. the corresponding hosted SCM/provider evidence.

Owner: release owner plus TopNotchh organization administrator. Review date:
2026-10-11 or when the installation and signer artifacts are available. Next
action: bind the authorized company test installation, publish a non-sensitive
test policy, run the live fetch/cache matrix, and record only digests/statuses.
Release decision: do not check TEAM-CLI-001 or its dependent SCM rows from unit
tests alone.
