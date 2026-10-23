# ACCEPT-005 authorized workflow contract · 2026-10-23

## Implementation

The private shipping toolchain now exposes
`acceptance:workflow:validate` through
`scripts/validate-authorized-workflow.mjs`. It validates one exact, consented
external repository workflow record against the frozen protocol:

- repository URL and exact commit binding;
- owner and founder approval digests, scope, expiry, and revocation state;
- permitted paths, commands, and network policy;
- no source upload and digest-only or derived-redacted retention;
- secret, personal-data, scope, and redaction preflight results;
- bounded exit, coverage, finding-count, report/evidence digests; and
- owner summary plus deletion/expiry confirmation.

The result is bounded and fail-closed. It never emits owner names, raw source,
raw findings, credentials, customer data, or private paths. Even a valid
consented run is emitted with `customerAcceptance: not-claimed`; this contract
does not turn a public fixture, synthetic run, or owner assertion into external
customer acceptance.

## Verification and boundary

- `scripts/validate-authorized-workflow.test.mjs`: **4/4** passed;
- syntax validation: passed; and
- `git diff --check`: passed.

No external repository was contacted or scanned in this implementation batch,
and no customer, provider, Production, or release state changed. `ACCEPT-005`
remains open for an actual named owner's consented workflow, redacted result,
and deletion/expiry artifact. Nothing was deleted.
