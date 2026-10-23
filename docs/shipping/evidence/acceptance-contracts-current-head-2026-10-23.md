# Acceptance contract suite · current merged head · 2026-10-23

## Scope

The exact merged private-shipping head `4f803a0af31385994c8cd7d27dfe593a1fa239c9`
was checked with the focused contracts for the remaining non-AppSec acceptance
implementation surfaces:

- backlog partition and open-state parsing;
- authorized workflow validation (`ACCEPT-005`);
- comprehension scoring (`ACCEPT-006`);
- commercial evidence validation (`ACCEPT-008`);
- release-gate reconciliation and candidate freeze (`ACCEPT-009/010`); and
- final regression input and byte-binding behavior (`ACCEPT-014`).

## Verification

Command:

```text
node --test scripts/audit-shipping-backlog.test.mjs scripts/freeze-release-candidate.test.mjs scripts/reconcile-release-gates.test.mjs scripts/run-final-regression.test.mjs scripts/score-comprehension-test.test.mjs scripts/validate-authorized-workflow.test.mjs scripts/validate-commercial-acceptance.test.mjs
```

Result: **48/48 passed**, 0 failed, 0 skipped. The tests cover fail-closed
missing-gate behavior, malformed and future-dated inputs, unsafe paths,
secret-like material, digest/byte binding, consent windows, duplicate
participants, commercial-event tampering, and no-overwrite output behavior.

## Boundary

This is current-head implementation/regression evidence only. It does not
claim an external recipient, customer, provider, Production, publication,
independent review, human/field result, or final release decision. The
affected backlog rows remain unchecked until their declared external artifacts
exist. Nothing was deleted or overwritten.
