# Hunt adjudication study protocol

Status: preregistered private protocol. This document does not contain 100
adjudicated findings and does not close ACCEPT-007.

## Objective and sampling

Evaluate at least **100** independently sampled Hunt-eligible findings from
the fixed technical corpus or an explicitly consented fixture. No customer
source is required for the technical study, and no exploit is run without the
separate Hunt approval/isolation gates.

Before inspecting outcomes, freeze the sample manifest with finding digest,
detector, source fixture, CLI commit, recipe/image digest, and environment
metadata. Do not replace failed or inconvenient samples after seeing results.

## Adjudication labels

Each finding receives exactly one primary label:

- `confirmed`: independent evidence reproduces the claimed security behavior;
- `not-reproduced`: bounded attempt completes without reproducing it;
- `environment-failure`: the prescribed runtime/evidence was unavailable or
  failed before a security conclusion;
- `out-of-scope`: the sample violates the frozen study scope and is excluded
  only with a recorded reason.

The adjudicator also records confidence, command/result digest, limitations,
and whether the result changed the original static finding. `environment-
failure` is never counted as confirmation or non-reproduction.

## Independence and analysis

- The implementation author must not be the sole adjudicator.
- At least two reviewers independently label every sample; disagreements are
  resolved by a third reviewer or documented consensus after labels are frozen.
- Publish only aggregate counts and bounded error categories in the private
  evidence bundle; never publish exploit payloads, secrets, or customer source.
- Report the denominator, exclusions, label counts, disagreement count,
  confidence distribution, and every environment limitation.

## Gate

ACCEPT-007 remains open until 100 valid samples are independently adjudicated,
the frozen manifest and commands are reproducible, disagreement handling is
recorded, and an independent reviewer signs the aggregate report.
