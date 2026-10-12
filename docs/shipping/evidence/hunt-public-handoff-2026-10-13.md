# Public Hunt handoff evidence — 2026-10-13

## Purpose

This record captures the public implementation that connects an ordinary
`verglos scan --hunt` run to the bounded Hunt execution command without
silently executing or authorizing anything.

## Public release identity

- Repository: `https://github.com/Top-Notchh-Solutions/verglos-cli`
- Pull request: `#92`
- Merged commit: `b49375b03435a77f363b5bfda49a303f491da098`
- Public package line: `2.0.0-alpha.1`
- Runtime: public `@verglos/hunt` package with the fixed A1 catalog

## What changed

After a successful scan with `--hunt`, the machine-readable result includes a
handoff with:

- the generated report path;
- the required signed recipe, trust-store, and approval input names;
- the exact finding rule, subject, and observation bindings; and
- the `verglos hunt --execute` command to run after those inputs are supplied.

The human output gives the same next action. The scan does not auto-approve a
recipe, execute a worker, or treat a plan label as entitlement authority.
Execution still requires the paid capability, a trusted supported recipe, an
exact report binding, and an approval binding. Missing or invalid inputs fail
closed.

## Verification

Protected checks for PR #92 passed on:

- macOS, Ubuntu, and Windows;
- Node 20, Node 22, and Node 24;
- in-toto release binding;
- typecheck and full test suites;
- clean packed-package consumer qualification; and
- upgrade/rollback qualification.

The local CLI/package verification also passed the full suite, including 45
process tests. The Windows path assertion compares the actual report file by
file identity, so Windows 8.3 temporary-path normalization cannot produce a
false mismatch.

Earlier evidence in
`hunt-public-package-runtime-2026-10-12.md` records the separate clean
consumer execution of the signed A1 recipe with a local capability fixture.
That run produced the expected completed/confirmed result with network denied
and no source access. It remains a local qualification fixture, not hosted
entitlement evidence.

## Limits and disposition

This record does not claim:

- hosted Pro/Team/Enterprise entitlement qualification;
- legal or licensed third-party recipe clearance;
- independent AppSec review;
- Linux namespace or Docker adversarial coverage beyond the separately
  recorded runs; or
- final npm publication or final acceptance.

No provider, database, Production, npm, customer, or source-upload write was
performed. No backlog checkbox changed. The private tracker remains at
**228 checked / 52 unchecked / 280 total (81.4%)**.
