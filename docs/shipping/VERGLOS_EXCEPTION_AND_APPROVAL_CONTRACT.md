# Verglos Exception and Approval Contract

Status: V1 contract implemented by `CONTRACT-007`

Owner: Policy/Evidence

Last reviewed: 2026-09-09

Schemas `urn:verglos:schema:policy-exception` and `urn:verglos:schema:exception-approval`, both version `1.0.0`, keep an exception request separate from the human decision that may activate it. An approval binds the SHA-256 digest of the complete canonical request, so changing its scope, reason, controls, owner, dates, triggers, or limitations invalidates the approval target.

## Exception request

V1 exception scope is deliberately narrow: one immutable subject and between one and 100 exact observation UUIDs. It has no wildcard, repository-wide, future-observation, severity-only, rule-family, tenant-wide, or permanent form. Broader policy constructs require a later version and explicit risk evidence; they cannot be smuggled into free text.

Each request records:

- a stable exception UUID;
- an accountable person or team owner and the person, service, or agent that requested it;
- a bounded reason and visible limitations;
- one or more compensating controls, each with its own owner and digest-bound audit evidence;
- one or more reversal triggers;
- ordered request, effective, and expiry times.

Expiry is mandatory and later than the effective time. Historical and expired requests remain readable as audit evidence; parsing a record does not make it applicable.

## Approval

An approval records an immutable approval UUID, exact exception ID and canonical request digest, `approved` or `denied` decision, named human approver and authority, rationale, decision time, digest-bound audit reference, and a validity deadline for approved decisions. An agent or service cannot occupy the approver field. A denial cannot carry a validity window.

The applicability evaluator rejects a mismatched request digest/ID, a decision made before the request or after its expiry, an approval that outlives the exception, a denied decision, early or expired use, an expired approval, and any subject or observation outside the exact scope. Approval does not rewrite or delete the original observation.

## Non-claims and downstream work

These schemas validate portable records; they do not prove that the named approver had server-side tenant/RBAC authority, that the referenced control remains operational, or that an audit store is immutable. Hosted authorization, revocation/event history, policy effects, UI creation flows, and signed Release Record inclusion remain in `HOSTED-007`, `POLICY-007/008`, `CONTRACT-008/009/010`, and their acceptance suites.

`packages/shared/src/exception.test.ts` covers round trips, canonical request binding, exact scope limits, duplicate/wildcard rejection, mandatory controls and reversal triggers, ordered finite validity, human approval, denial, early/expired use, subject/observation mismatch, approval-window widening, and future-version upgrades.
