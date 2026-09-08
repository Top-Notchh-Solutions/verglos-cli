# Verglos Verification-Attempt Contract

Status: V1 contract implemented by `CONTRACT-006`

Owner: Evidence/Verification

Last reviewed: 2026-09-09

Schema `urn:verglos:schema:verification-attempt` version `1.0.0` records one bounded attempt to verify one observation against one immutable subject. It records what was approved, which signed recipe and exact inputs were used, the sandbox and network policy, declared limits, measured usage, redacted output digests, and a non-boolean outcome.

## Outcomes

| Outcome | Meaning | Execution rule |
|---|---|---|
| `confirmed` | The bounded recipe reproduced evidence supporting the observation. | Must execute and carry an evidence digest. |
| `not_reproduced` | The bounded recipe completed without reproducing the observation. | Must execute and carry an evidence digest. It is not a universal false-positive claim. |
| `inconclusive` | The attempt does not support either confirmation or non-reproduction. | May describe an executed or non-executed attempt; the reason and limitations remain visible. |
| `not_supported` | No compatible verification path supports the observation. | Must not execute. |
| `environment_error` | Environment or infrastructure prevented a trustworthy result. | May describe a failed execution or a failure before execution; it cannot become `not_reproduced`. |
| `policy_denied` | Policy or approval prevented execution. | Must not execute and must record a denied or not-requested approval state. |

The old `verified`, `false`, and `not_attemptable` labels are legacy compatibility inputs. They are not valid V1 output truth and require an explicit migration policy before import.

## Trust and execution boundary

An executed attempt requires a recipe whose signature status is `verified`, including signer identity and the digest of the exact trust policy used. The attempt binds the recipe version and digest, subject and observation IDs, input and parameter digests, approval state, and whether ephemeral secret inputs were supplied. Invalid or unverified recipes cannot execute.

Execution requires declared isolation, a non-root identity, and a recorded cleanup outcome. Container, gVisor, and microVM isolation additionally require an immutable runtime digest. Network is denied by default. An allowlist contains HTTPS origins only: no credentials, path, query, or fragment. This contract validates the declared boundary; hostname resolution, private-address rejection, redirect controls, and enforcement evidence belong to the sandbox implementation and its acceptance tests.

## Bounds and evidence

Each attempt declares timeout, CPU, memory, disk, process, output, and network-request limits. Recorded usage cannot exceed them, and denied network requires zero requests. Non-executed attempts have zero usage, no execution output, no start time, no cleanup claim, and no secret inputs.

Output is represented by content digests, sizes, truncation state, and explicit redaction state for stdout, stderr, and artifacts. `confirmed` and `not_reproduced` require a combined evidence digest. The contract does not treat raw console text as truth, attest that producer-reported redaction was effective, or prove sandbox enforcement by itself; those require implementation-level leakage, isolation, and tamper tests.

`packages/shared/src/verification.test.ts` covers all six outcomes, signature and approval gates, isolation/runtime requirements, network-origin rules, resource limits, non-execution invariants, evidence requirements, time ordering, JSON round-tripping, and future-version upgrades.
