# PLAN-CLI-002 effective-capability UX evidence

Date: 2026-10-10 IST  
Repository: private shipping ledger (`local/private-shipping-ledger`)  
Scope: CLI entitlement truth and user-facing reporting only

## Result

`verglos whoami --json` and human output now report the effective entitlement
rather than trusting the cached license tier alone:

- effective plan (`free`, `pro`, `team`, `studio`, `enterprise`, or `founder`);
- authority source (`rest`, `cache`, `signed-token`, or `free`);
- stale state and bounded offline grace;
- opaque capability count, without inventing capability names or maturity;
- server/token catalog version and bounded allowances when supplied; and
- signed-token expiry when a verified v2 catalog token is the effective source.

The human output also distinguishes the effective plan from a cached license
plan and keeps the upgrade path actionable through `https://verglos.com/checkout`
and `verglos login`. Capability failures retain the existing upgrade CTA.
Machine output remains JSON-only and license keys/tokens are redacted. A
current REST response remains authoritative; a legacy tier-only token cannot
grant paid capability offline.

## Implementation

The reviewed entitlement/catalog work is integrated at these local commits:

- `a5e7ccf` — v2 tenant-bound entitlement verification;
- `53fba75` — strict keyed-header verification compatibility;
- `3ef8aed` — signed entitlement catalog consumption;
- `b2e68c3e` — identity-bound cache and effective-plan resolution;
- `4956987c` — effective entitlement fields in `whoami`; and
- `7490fe44` — machine-output contract correction.

The local integration also preserves the existing approved-fix cache fixtures
under the new credential-scope binding and restores the server-shaped catalog
fixtures used by the entitlement tests. No Production deployment, payment
provider operation, database write, entitlement write, npm publish, or
customer-data operation was performed for this item.

## Verification

All commands were run from the CLI workspace with dependencies installed from
the existing lockfile/cache:

- entitlement package tests: **15/15**;
- focused CLI entitlement/offline/JWT/whoami tests: **28/28**;
- CLI machine-output process suite: **30/30**;
- full `pnpm --filter verglos test`: passed;
- `pnpm --filter verglos typecheck`: passed;
- `pnpm --filter verglos build`: passed; and
- `git diff --check`: passed.

Existing hosted evidence for the reviewed upstream commits `e06de5b` and
`443be30` remains attached by the backlog record, including the nine supported
Ubuntu/macOS/Windows × Node 20/22/24 cells and in-toto binding. This local
integration does not claim a new hosted run at the private branch head.

## Disposition

`PLAN-CLI-002` is accepted and checked. Its effective-capability display is
fail-soft across online, cached, signed-token, legacy-token, and Free paths;
the CLI never treats a stale or legacy tier as proof of unavailable paid
features. Provider lifecycle evidence and the separate Gate 4 remain outside
this item.
