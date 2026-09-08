# Verglos Policy-Evaluation Contract

Status: V1 contract implemented by `CONTRACT-008`

Owner: Policy/Evidence

Last reviewed: 2026-09-09

Schema `urn:verglos:schema:policy-evaluation` version `1.0.0` records a deterministic evaluation of one immutable subject under one exact policy ID, version, and digest. The contract derives the decision, ordered reasons, and process exit from the recorded identity and check facts; readers reject a document that changes any of those derived fields independently.

## Decisions and exits

| Decision | Meaning | Exit |
|---|---|---:|
| `PASS` | Every recorded requirement is satisfied by current evidence for the exact subject. | 0 |
| `BLOCK` | Complete current evidence violates a blocking policy check. | 1 |
| `REVIEW` | An advisory failure or advisory evidence gap needs human review. | 2 |
| `INCOMPLETE` | Exact identity is mismatched/unresolved, or required evidence is missing, stale, unsupported, or erroneous. | 3 |

`INCOMPLETE` has precedence over simultaneous blocking or review facts. This prevents a partial run, source outage, unsupported target, stale database, parse error, or source-to-artifact mismatch from becoming an apparently complete decision. `BLOCK` then precedes `REVIEW`; `PASS` is possible only when no incomplete, blocking, or review reason exists.

## Identity, checks, and freshness

The evaluation names the intended `subjectId` and records identity as `matched`, `mismatched`, or `unresolved`. A match must repeat the same immutable subject ID. A mismatch must name a different observed subject. An unresolved identity cannot invent one. Non-matching states require a visible reason and always derive `INCOMPLETE`.

Every policy check has a stable ID, required/advisory classification, failure effect, evidence status, content digests, exact observation IDs when relevant, freshness, owner, reason, and next action. Required and advisory behavior is explicit: advisory checks cannot directly block a release. Check IDs and observation IDs are unique within their scopes, and reasons are emitted in code-unit order by check ID.

Satisfied and failed checks require evidence digests that are current at evaluation time. Stale checks require evidence plus an elapsed validity boundary. Missing and unsupported checks cannot claim evidence. Error state may retain diagnostic evidence but freshness remains unknown. Source update, check, evaluation, and validity times cannot contradict their declared freshness state.

## Boundaries

This is a language-neutral result contract and derivation primitive, not the final configurable policy engine. It does not choose required checks, thresholds, exception effects, observation severity behavior, or policy profiles. Those enter through versioned policy documents and the deterministic evaluator in `POLICY-001` through `POLICY-013`. A structurally valid check still depends on the named producer, observation, exception, and evidence artifacts being validated by their own contracts.

`packages/shared/src/policy-evaluation.test.ts` covers all four decisions, the fixed 0/1/2/3 exit mapping, incomplete precedence, missing/stale/unsupported/error evidence, identity mismatch/unresolved state, freshness contradictions, evidence honesty, advisory limits, unique/deterministically ordered checks, tamper rejection, JSON round trips, and future-version upgrades.
