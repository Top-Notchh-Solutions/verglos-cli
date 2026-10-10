# TEAM-CLI-001 policy client implementation — 2026-10-10

## What changed

The private shipping branch now includes the reviewed CLI implementation for
signed organization-policy resolution:

- `e5c8e66` adds the shared strict envelope, recursive policy digest, exact
  organization/repository binding, active-key verification, and fail-closed
  remote/cache resolution contract.
- `0b96ac4c` adds bounded atomic mode-restricted cache persistence with
  symlink, scope, digest, and size checks.
- `ecfc1fb` adds bounded authenticated fetch and the
  `verglos policy organization fetch` command with JSON/quiet output.
- `0749320` keeps the shared export surface buildable on this branch.

The command reports only resolution status, tenant/repository identifiers,
policy digest, source, and expiry. It does not print the bearer credential or
policy contents.

## Verification

At exact source `0749320`:

- shared organization-policy tests: **3 passed / 0 failed**;
- CLI cache/fetch tests: **4 passed / 0 failed**;
- shared typecheck: passed;
- CLI typecheck: passed;
- CLI build: passed;
- `git diff --check`: passed.

The full CLI test command was also rerun after rebuilding the shared package;
the registered suites completed without a test failure. No provider, database,
Production, entitlement, npm, or customer-data write occurred.

## Acceptance boundary

This closes the implementation gap only. `TEAM-CLI-001` remains unchecked
because acceptance still requires all of the following external artifacts:

1. an authorized production signer/trust-root activation;
2. reconciled hosted policy rows under the recursive digest contract;
3. a live tenant/repository-bound hosted fetch using the deployed endpoint;
4. the corresponding hosted SCM/provider qualification.

Synthetic keys, local fixtures, or the gate-test Razorpay environment cannot
replace those artifacts. Owner: authorized Verglos policy operator. Review:
2026-10-11 IST or immediately after signer/endpoint activation.
