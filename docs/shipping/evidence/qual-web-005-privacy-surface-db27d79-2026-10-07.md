# QUAL-WEB-005 privacy surface implementation — 2026-10-07

## Exact candidate

- Web PR: `#153`
- Head: `db27d793d890929f642ed0d5b5b9bd056a7322bc`
- Hosted Verify: `37607448915` — success in 2m36s
- PR state: open, clean, mergeable; not merged or deployed

## Implementation

The active phase now exposes an authenticated `/account/privacy` surface in
the account navigation. It loads the private deletion-request ledger with
`no-store`, requires an explicit confirmation checkbox before POSTing
`{confirm:true}`, handles idempotent requests, and states that hosted deletion
remains pending reviewed worker execution. It preserves the customer-held
signed-record boundary in the user-facing copy and displays request history.

## Verification

- Focused privacy/route/hold/inventory/digest/worker tests: **23/23 pass**.
- Typecheck: pass.
- Drizzle schema check and ordered migration check: **35 migrations pass**.
- Production build: pass; `/account/privacy` is included in the route output.
- Negative boundary: **2/2 pass**.
- SBOM and license gates: pass; 414 components and 415 dependency-graph
  entries were validated. Manual license review counts remain governed by the
  existing license evidence and are not silently treated as legal clearance.
- Hosted Verify: typecheck, serial suite, negative boundary, truth registry,
  schema/migration, build, public-boundary, dependency, SBOM/license, and
  tracked-secret steps all passed.

## Acceptance boundary

This is implementation and hosted code evidence only. No browser deletion
request, worker invocation against an isolated authenticated account, legal or
customer-held-record disposition run, restore/rollback acceptance, production
write, migration, deployment, payment, or entitlement operation occurred.
QUAL-WEB-005 remains unchecked.
