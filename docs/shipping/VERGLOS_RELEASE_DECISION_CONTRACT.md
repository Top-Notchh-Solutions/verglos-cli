# Verglos Release-Decision Contract

Status: V1 contract implemented by `CONTRACT-009`

Owner: Policy/Release Evidence

Last reviewed: 2026-09-09

Schema `urn:verglos:schema:release-decision` version `1.0.0` is an immutable projection of one policy evaluation onto an exact set of release subjects. It binds decision identity, policy, evaluation, primary and supporting subjects, referenced approvals, issuer, generation time, and visible limitations without embedding mutable deployment state.

## Binding rules

A release decision has exactly one primary immutable subject, and that ID must equal the subject evaluated by policy. Supporting source, artifact, image, SBOM, and other subject bindings may be present, but subject IDs and approval IDs cannot repeat.

The evaluation reference carries its schema ID, evaluation UUID, canonical content digest, subject, result, evaluated time, and exact policy reference. The top-level policy must match the policy recorded in the evaluation reference. Creation hashes the fully validated policy-evaluation document with canonical JSON and SHA-256. A verifier must resolve that digest to the referenced evaluation before trusting the projection.

The release result must equal the evaluation result. In particular, `INCOMPLETE` cannot be promoted to `PASS`, `REVIEW`, or `BLOCK` during packaging. The decision may be generated only after evaluation. Each referenced exception or release approval carries its own digest, approver identity/authority, decision time, and optional validity boundary; future-dated or already-expired approval references are invalid.

## Identity and non-claims

The decision records a person or service issuer and its claimed authority. The portable contract does not prove hosted tenant membership, RBAC, approval signature validity, evaluation-digest availability, deployment occurrence, or artifact provenance. Those require authorization, record assembly/signing, verifier, and acceptance evidence in their downstream tasks. A valid release decision is not a signed Release Record and is not permission to publish or deploy.

`packages/shared/src/release-decision.test.ts` covers canonical evaluation binding and JSON round trips, incomplete propagation, primary-subject mismatch, duplicate subject/approval identities, generation/approval time bounds, strict policy/evaluation references, policy-binding mismatch, and future-version upgrades.
